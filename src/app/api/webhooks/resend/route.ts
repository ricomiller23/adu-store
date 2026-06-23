import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { type, data } = payload;

    if (!type || !data) {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }

    const emailId = data.email_id;
    const recipient = data.to && data.to[0];

    console.log(`Resend Webhook received. Event: ${type}, EmailId: ${emailId}, To: ${recipient}`);

    // Find the original EmailSend record if available
    const emailSend = emailId 
      ? await prisma.emailSend.findFirst({ where: { resendId: emailId } })
      : null;

    if (type === 'email.opened') {
      if (emailSend) {
        await prisma.emailSend.update({
          where: { id: emailSend.id },
          data: {
            status: 'opened',
            openedAt: new Date()
          }
        });

        // Add activity log
        await prisma.activity.create({
          data: {
            leadId: emailSend.leadId,
            kind: 'email_open',
            summary: `Opened email: "${emailSend.subject}"`
          }
        });
      }
    } 
    
    else if (type === 'email.bounced' || type === 'email.complained') {
      const reason = type === 'email.bounced' ? 'bounced' : 'complaint';
      
      if (recipient) {
        // 1. Add email address to Suppression list
        await prisma.suppression.upsert({
          where: { value: recipient },
          update: { reason },
          create: { value: recipient, reason }
        });

        // 2. Disable consent for all leads matching this email
        const matchingLeads = await prisma.lead.findMany({
          where: { email: { equals: recipient, mode: 'insensitive' } }
        });

        for (const lead of matchingLeads) {
          await prisma.consent.update({
            where: { leadId: lead.id },
            data: {
              emailOptIn: false
            }
          });

          // Log suppression activity on lead timeline
          await prisma.activity.create({
            data: {
              leadId: lead.id,
              kind: 'stage_change',
              summary: `System suppressed contact due to Resend event: ${type}`
            }
          });
        }
      }

      // Update EmailSend status if found
      if (emailSend) {
        await prisma.emailSend.update({
          where: { id: emailSend.id },
          data: { status: reason }
        });
      }
    }

    return NextResponse.json({ received: true });

  } catch (err: any) {
    console.error("Resend Webhook processing failed:", err);
    return NextResponse.json({ error: err.message || "Webhook internal failure" }, { status: 500 });
  }
}
