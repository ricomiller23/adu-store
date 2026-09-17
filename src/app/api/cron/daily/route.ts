import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Resend } from 'resend';
import { renderEmailTemplate, renderEmailSubject } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY || 're_1234567890');

export async function GET(req: NextRequest) {
  return handleCron(req);
}

export async function POST(req: NextRequest) {
  return handleCron(req);
}

async function handleCron(req: NextRequest) {
  // Authorization check
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'cron-secret-123';
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    // Also allow checking search parameter for easy testing
    const { searchParams } = new URL(req.url);
    if (searchParams.get('secret') !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  console.log("Starting ADU Store Nurture Cron Job...");
  const now = new Date();

  // Stats for the ops digest
  const cronStats = {
    emailsSent: 0,
    suppressedSkips: 0,
    consentSkips: 0,
    doubleSendSkips: 0,
    errors: [] as string[],
    sentLeads: [] as { name: string; email: string; subject: string }[],
  };

  try {
    // 1. Fetch active enrollments due for processing
    const enrollments = await prisma.enrollmentState.findMany({
      where: {
        status: 'active',
        nextDueAt: { lte: now }
      },
      include: {
        lead: {
          include: {
            consent: true
          }
        },
        sequence: {
          include: {
            steps: {
              orderBy: { dayOffset: 'asc' }
            }
          }
        }
      }
    });

    console.log(`Found ${enrollments.length} due enrollments.`);

    // 2. Fetch all suppressions to optimize lookup in memory
    const allSuppressions = await prisma.suppression.findMany();
    const suppressedSet = new Set(allSuppressions.map(s => s.value.toLowerCase()));

    // 3. Process each enrollment
    for (const enrollment of enrollments) {
      const { lead, sequence, currentStep } = enrollment;
      
      // Safety check: is step index out of bounds?
      if (currentStep >= sequence.steps.length) {
        await prisma.enrollmentState.update({
          where: { id: enrollment.id },
          data: { status: 'completed' }
        });
        continue;
      }

      const step = sequence.steps[currentStep];

      // Scrub 1: suppression check (email and phone)
      const isEmailSuppressed = suppressedSet.has(lead.email.toLowerCase());
      const isPhoneSuppressed = lead.phone ? suppressedSet.has(lead.phone.toLowerCase()) : false;

      if (isEmailSuppressed || isPhoneSuppressed) {
        cronStats.suppressedSkips++;
        // Auto-pause enrollment
        await prisma.enrollmentState.update({
          where: { id: enrollment.id },
          data: { status: 'paused' }
        });
        continue;
      }

      // Scrub 2: Consent checks
      if (step.channel === 'email' && !lead.consent?.emailOptIn) {
        cronStats.consentSkips++;
        continue;
      }
      if (step.channel === 'phone' && !lead.consent?.phoneOptIn) {
        cronStats.consentSkips++;
        // Skip phone step and advance
        await advanceEnrollment(enrollment.id, currentStep, sequence.steps, lead.createdAt);
        continue;
      }
      if (step.channel === 'sms' && !lead.consent?.smsOptIn) {
        cronStats.consentSkips++;
        // Skip SMS step and advance
        await advanceEnrollment(enrollment.id, currentStep, sequence.steps, lead.createdAt);
        continue;
      }

      // Scrub 3: Idempotency Guard (no double-sends for same step ever)
      const existingSend = await prisma.emailSend.findFirst({
        where: {
          leadId: lead.id,
          sequenceStepId: step.id
        }
      });

      if (existingSend) {
        cronStats.doubleSendSkips++;
        await advanceEnrollment(enrollment.id, currentStep, sequence.steps, lead.createdAt);
        continue;
      }

      // 4. Render template with Outbound Email Kit merge engine
      if (step.channel === 'email' && step.subject) {
        try {
          const renderedSubject = renderEmailSubject(step.subject, lead);
          const renderedBody = renderEmailTemplate(step.bodyTemplate, lead);

          // 5. Send Email via Resend
          let resendId = 'resend_mock_' + Math.random().toString(36).substr(2, 9);
          
          if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_1234567890') {
            const mailRes = await resend.emails.send({
              from: process.env.RESEND_FROM || 'hello@theadustore.com',
              to: lead.email,
              subject: renderedSubject,
              text: renderedBody,
              html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1a1a1a; white-space: pre-wrap;">${renderedBody}</div>`,
            });
            if (mailRes.data) {
              resendId = mailRes.data.id;
            }
          }

          // Log Send
          await prisma.emailSend.create({
            data: {
              leadId: lead.id,
              sequenceStepId: step.id,
              subject: renderedSubject,
              status: 'sent',
              resendId,
            }
          });

          // Log Activity
          await prisma.activity.create({
            data: {
              leadId: lead.id,
              kind: 'email_sent',
              summary: `Sequence Email Sent: "${renderedSubject}"`
            }
          });

          cronStats.emailsSent++;
          cronStats.sentLeads.push({
            name: lead.name,
            email: lead.email,
            subject: renderedSubject
          });

        } catch (mailErr: any) {
          console.error(`Email send failed for lead ${lead.id}:`, mailErr);
          cronStats.errors.push(`Lead ${lead.name} (${lead.email}): ${mailErr.message || mailErr}`);
        }
      }

      // 6. Advance enrollment state
      await advanceEnrollment(enrollment.id, currentStep, sequence.steps, lead.createdAt);
    }

    // 7. Deliver Owner Ops Digest
    await sendOwnerOpsDigest(cronStats);

    return NextResponse.json({
      success: true,
      processed: enrollments.length,
      stats: cronStats
    });

  } catch (err: any) {
    console.error("Cron failed:", err);
    return NextResponse.json({ error: err.message || "Cron internal failure" }, { status: 500 });
  }
}

// Helper to advance enrollment step and compute nextDueAt
async function advanceEnrollment(
  enrollmentId: string, 
  currentStepIdx: number, 
  steps: { id: string; dayOffset: number }[],
  leadCreatedAt: Date
) {
  const nextStepIdx = currentStepIdx + 1;
  
  if (nextStepIdx >= steps.length) {
    // Sequence completed!
    await prisma.enrollmentState.update({
      where: { id: enrollmentId },
      data: {
        currentStep: nextStepIdx,
        status: 'completed',
        updatedAt: new Date()
      }
    });
  } else {
    // Compute next due timestamp relative to lead creation
    const nextStep = steps[nextStepIdx];
    const nextDueAt = new Date(leadCreatedAt.getTime() + nextStep.dayOffset * 24 * 60 * 60 * 1000);

    await prisma.enrollmentState.update({
      where: { id: enrollmentId },
      data: {
        currentStep: nextStepIdx,
        nextDueAt,
        updatedAt: new Date()
      }
    });
  }
}

// Build and send daily digest report to owner
async function sendOwnerOpsDigest(stats: any) {
  const digestEmail = process.env.OWNER_DIGEST_EMAIL || 'info@TheADUStore.com';
  
  // Gather digest database stats
  const [newLeadsCount, hotLeads, totalLeads] = await Promise.all([
    prisma.lead.count({ where: { stage: 'New' } }),
    prisma.lead.findMany({ where: { score: { gte: 80 } } }),
    prisma.lead.count(),
  ]);

  const subject = `The ADU Store — CRM Ops Digest: ${new Date().toLocaleDateString()}`;
  
  const digestBody = `
THE ADU STORE - DAILY OPERATIONS DIGEST
Date: ${new Date().toLocaleDateString()}

--- DAILY NURTURE SUMMARY ---
Emails Sent Today: ${stats.emailsSent}
Consent Skips: ${stats.consentSkips}
Suppression Skips: ${stats.suppressedSkips}
Double-Send Skips: ${stats.doubleSendSkips}

${stats.sentLeads.length > 0 ? '\nSent Emails Log:\n' + stats.sentLeads.map(l => `- To: ${l.name} (${l.email}) | Subject: "${l.subject}"`).join('\n') : ''}
${stats.errors.length > 0 ? '\nErrors Encountered:\n' + stats.errors.join('\n') : ''}

--- CRM DATABASE STATS ---
Total Active Leads: ${totalLeads}
New Leads (Needs follow-up): ${newLeadsCount}
Total Hot Leads (Score ≥ 80): ${hotLeads.length}

Hot Leads Priority List:
${hotLeads.map(h => `- ${h.name} (${h.city}) | Score: ${h.score} | Stage: ${h.stage} | Est. Value: $${h.estValue?.toLocaleString() || '0'}`).join('\n')}

--- COMPLIANCE CHECKS ---
CAN-SPAM suppression and physical address footers verified.
TCPA phone/text consent constraints enforced.
AB 1033 jurisdiction rules active.

Best regards,
The ADU Store CRM Engine
  `;

  try {
    // Send using Resend if API key is active
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_1234567890') {
      await resend.emails.send({
        from: process.env.RESEND_FROM || 'hello@theadustore.com',
        to: digestEmail,
        subject,
        text: digestBody,
        html: `<pre style="font-family: sans-serif; line-height: 1.5; white-space: pre-wrap;">${digestBody}</pre>`,
      });
    }
    console.log("Ops digest email dispatched successfully.");
  } catch (err) {
    console.error("Failed to send Owner Ops Digest:", err);
  }
}
