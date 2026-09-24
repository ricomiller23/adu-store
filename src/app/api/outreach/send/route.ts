import { NextResponse } from 'next/server';
import { sendOutboundEmailAction } from '@/app/actions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { leadId, subject, bodyHtml } = body;

    if (!leadId || !subject || !bodyHtml) {
      return NextResponse.json(
        { error: 'Missing leadId, subject, or bodyHtml' },
        { status: 400 }
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
