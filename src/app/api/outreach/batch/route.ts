import { NextResponse } from 'next/server';
import { batchDispatchOutboundAction, batchGenerateOutboundDraftsAction } from '@/app/actions';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action, leadIds } = body;

    if (action === 'generate') {
      const result = await batchGenerateOutboundDraftsAction(leadIds);
      return NextResponse.json(result);
    }

    const result = await batchDispatchOutboundAction(leadIds);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
