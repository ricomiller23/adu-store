import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateLeadScore } from '@/lib/scoring';
import { Resend } from 'resend';
import { renderEmailTemplate, renderEmailSubject } from '@/lib/email-templates';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || 're_1234567890');

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      name,
      email,
      phone,
      city,
      lotSizeBand,
      goal,
      timeline,
      financing,
      unpermitted,
      consentEmail,
      consentPhone,
      consentSms,
      consentText,
      consentIp,
    } = data;

    if (!name || !email || !city) {
      return NextResponse.json({ error: "Missing required fields: name, email, city" }, { status: 400 });
    }

    // Determine segment H1-H9 based on goal/unpermitted
    let segment = 'H9'; // Default "Recent Buyer / Large Lot"
    if (unpermitted === true || unpermitted === 'yes') {
      segment = 'H7'; // Unpermitted legalization
    } else if (goal === 'rent') {
      segment = 'H1'; // Investor / House Hacker
    } else if (goal === 'family' || goal === 'aging') {
      segment = 'H2'; // Multigenerational
    } else if (goal === 'office') {
      segment = 'H4'; // Remote WFH / Studio
    } else if (goal === 'sell') {
      segment = 'H8'; // Developer / Sell separate
    }

    // Derive approximate lot size
    let lotSizeSqft = 5000;
    if (lotSizeBand === 'under3k') lotSizeSqft = 2500;
    if (lotSizeBand === '3k5k') lotSizeSqft = 4000;
    if (lotSizeBand === '5k7k') lotSizeSqft = 6000;
    if (lotSizeBand === '7kplus') lotSizeSqft = 8500;

    // Check if city is AB 1033 eligible
    const jurisdiction = await prisma.jurisdiction.findFirst({
      where: {
        name: {
          equals: city.trim(),
          mode: 'insensitive'
        }
      }
    });
    const ab1033Eligible = jurisdiction ? jurisdiction.ab1033OptIn : false;

    // Perform Lead Creation in a single transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Lead
      const lead = await tx.lead.create({
        data: {
          type: 'homeowner',
          name,
          email,
          phone: phone || null,
          city,
          county: 'California', // default placeholder
          jurisdiction: jurisdiction?.name || city,
          lotSizeSqft,
          segment,
          source: 'quiz',
          sourceDetail: 'Feasibility Quiz Widget',
          stage: 'New',
          estValue: segment === 'H1' || segment === 'H8' ? 160000 : 130000,
          ab1033Eligible,
        }
      });

      // 2. Create Consent record
      await tx.consent.create({
        data: {
          leadId: lead.id,
          emailOptIn: !!consentEmail,
          phoneOptIn: !!consentPhone,
          smsOptIn: !!consentSms,
          consentSource: 'quiz_widget',
          consentText: consentText || 'I consent to email, call and text communications.',
          consentIp: consentIp || '127.0.0.1',
        }
      });

      // 3. Create Activity record
      await tx.activity.create({
        data: {
          leadId: lead.id,
          kind: 'quiz',
          summary: 'Completed ADU Feasibility Quiz',
        }
      });

      return lead;
    });

    // Recalculate score (loads activities)
    const activities = await prisma.activity.findMany({ where: { leadId: result.id } });
    const score = calculateLeadScore({
      segment,
      city,
      lotSizeSqft,
      activities,
      isAb1033Eligible: ab1033Eligible,
    });

    // Update computed score
    const finalLead = await prisma.lead.update({
      where: { id: result.id },
      data: { score }
    });

    // Check if email opt-in and enroll in sequence
    let emailSent = false;
    const sequence = await prisma.sequence.findUnique({
      where: { segment },
      include: { steps: { orderBy: { dayOffset: 'asc' } } }
    });

    if (sequence && consentEmail) {
      // Enroll lead in sequence
      await prisma.enrollmentState.create({
        data: {
          leadId: finalLead.id,
          sequenceId: sequence.id,
          currentStep: 0,
          nextDueAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Day 1 scheduled tomorrow
          status: 'active'
        }
      });

      // Fire Step 1 welcome email immediately!
      const welcomeStep = sequence.steps.find(s => s.dayOffset === 0);
      if (welcomeStep && welcomeStep.subject) {
        try {
          const renderedSubject = renderEmailSubject(welcomeStep.subject, finalLead);
          const body = renderEmailTemplate(welcomeStep.bodyTemplate, finalLead);

          // Log the send
          await prisma.emailSend.create({
            data: {
              leadId: finalLead.id,
              sequenceStepId: welcomeStep.id,
              subject: renderedSubject,
              status: 'sent',
              resendId: 'resend_mock_' + Math.random().toString(36).substr(2, 9),
            }
          });

          // Create sent email activity
          await prisma.activity.create({
            data: {
              leadId: finalLead.id,
              kind: 'email_sent',
              summary: `Welcome Email Sent: "${renderedSubject}"`
            }
          });

          // Call Resend if API key is configured (ignore mock key)
          if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_1234567890') {
            await resend.emails.send({
              from: (process.env.RESEND_FROM || 'hello@theadustore.com').includes('<') ? (process.env.RESEND_FROM || 'hello@theadustore.com') : `${process.env.REP_NAME || 'David Miller'}, ${process.env.BRAND_NAME || 'The ADU Store'} <${process.env.RESEND_FROM || 'hello@theadustore.com'}>`,
              to: finalLead.email,
              subject: renderedSubject,
              text: body,
              html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1a1a1a; white-space: pre-wrap;">${body}</div>`,
            });
          }

          emailSent = true;
        } catch (mailErr) {
          console.error("Resend delivery failed:", mailErr);
        }
      }
    }

    // Return tailored results message to UI
    let resultMessage = `Your lot supports a detached modular ADU up to 1,200 sqft. `;
    if (ab1033Eligible) {
      resultMessage += `${city} has opted in to AB 1033, meaning you could condo-convert the ADU and sell it separately from the main home for maximum future flexibility!`;
    } else {
      resultMessage += `While ${city} has not adopted separate condo-sales (AB 1033) yet, you can permanently rent out BOTH units under AB 976, creating a high-yield cash flow asset!`;
    }

    return new NextResponse(JSON.stringify({
      success: true,
      leadId: finalLead.id,
      score: finalLead.score,
      segment,
      ab1033Eligible,
      emailSent,
      resultMessage,
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (err: any) {
    console.error("Error capturing lead:", err);
    return new NextResponse(JSON.stringify({ error: err.message || "Failed to process lead capture" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
