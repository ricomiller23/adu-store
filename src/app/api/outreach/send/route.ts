import { NextResponse } from 'next/server';
import { sendOutboundEmailAction, getOutboundEmailAction } from '@/app/actions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { leadId, subject, bodyHtml, angle } = body;

    if (!leadId) {
      return NextResponse.json(
        { error: 'Missing leadId' },
        { status: 400 }
      );
    }

    if (!subject || !bodyHtml) {
      const generated = await getOutboundEmailAction(leadId, angle || 'equity_roi');
      if (generated) {
        subject = subject || generated.subject;
        bodyHtml = bodyHtml || (generated as any).html || (generated as any).bodyHtml;
      }
    }

    if (!subject || !bodyHtml) {
      return NextResponse.json(
        { error: 'Could not generate outbound email content for this lead' },
        { status: 422 }
      );
    }

    const result = await sendOutboundEmailAction(leadId, subject, bodyHtml);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 422 });
    }

    return NextResponse.json({ success: true, record: result.record });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
