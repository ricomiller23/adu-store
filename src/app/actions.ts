'use server';

import { prisma } from '@/lib/db';
import { calculateLeadScore, isHotLead } from '@/lib/scoring';
import { revalidatePath } from 'next/cache';

// Re-calculate and update score for a specific lead
export async function updateLeadScoreAction(leadId: string) {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      activities: true,
      consent: true,
    }
  });

  if (!lead) return;

  const isAb1033 = lead.ab1033Eligible;
  const newScore = calculateLeadScore({
    segment: lead.segment,
    city: lead.city,
    lotSizeSqft: lead.lotSizeSqft,
    activities: lead.activities,
    isAb1033Eligible: isAb1033,
  });

  await prisma.lead.update({
    where: { id: leadId },
    data: { score: newScore }
  });
}

// Get all leads with optional filtering
export async function getLeadsAction(filters: {
  type?: 'homeowner' | 'partner';
  segment?: string;
  source?: string;
  minScore?: number;
  search?: string;
  stage?: string;
}) {
  const where: any = {};

  if (filters.type) {
    where.type = filters.type;
  }
  if (filters.segment) {
    where.segment = filters.segment;
  }
  if (filters.source) {
    where.source = filters.source;
  }
  if (filters.stage) {
    where.stage = filters.stage;
  }
  if (filters.minScore !== undefined) {
    where.score = { gte: filters.minScore };
  }
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
      { city: { contains: filters.search, mode: 'insensitive' } },
      { jurisdiction: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return await prisma.lead.findMany({
    where,
    include: {
      consent: true,
      activities: {
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

// Get single lead details
export async function getLeadByIdAction(id: string) {
  return await prisma.lead.findUnique({
    where: { id },
    include: {
      consent: true,
      activities: {
        orderBy: { createdAt: 'desc' }
      },
      emailSends: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });
}

// Update lead stage
export async function updateLeadStageAction(id: string, newStage: string) {
  const oldLead = await prisma.lead.findUnique({ where: { id } });
  if (!oldLead) throw new Error("Lead not found");

  const updatedLead = await prisma.lead.update({
    where: { id },
    data: {
      stage: newStage,
      lastTouchAt: new Date(),
    }
  });

  // Log activity
  await prisma.activity.create({
    data: {
      leadId: id,
      kind: 'stage_change',
      summary: `Stage updated from '${oldLead.stage}' to '${newStage}'`
    }
  });

  revalidatePath('/leads');
  revalidatePath('/pipeline');
  revalidatePath('/');
  return updatedLead;
}

// Add manual activity (note, call, email, etc.)
export async function addLeadActivityAction(leadId: string, kind: string, summary: string, payload?: any) {
  const activity = await prisma.activity.create({
    data: {
      leadId,
      kind,
      summary,
      payload: payload ? JSON.stringify(payload) : undefined
    }
  });

  // Update lead lastTouchAt
  await prisma.lead.update({
    where: { id: leadId },
    data: { lastTouchAt: new Date() }
  });

  // Recalculate score (as activities changed)
  await updateLeadScoreAction(leadId);

  revalidatePath('/leads');
  revalidatePath('/pipeline');
  revalidatePath('/');
  return activity;
}

// Update jurisdiction setting and cascade score updates
export async function updateJurisdictionAction(id: string, ab1033OptIn: boolean, notes?: string) {
  const jurisdiction = await prisma.jurisdiction.update({
    where: { id },
    data: { ab1033OptIn, notes }
  });

  // Get all leads in this jurisdiction and update their eligibility
  const leads = await prisma.lead.findMany({
    where: { jurisdiction: jurisdiction.name }
  });

  for (const lead of leads) {
    await prisma.lead.update({
      where: { id: lead.id },
      data: { ab1033Eligible: ab1033OptIn }
    });
    // Trigger score recalculation
    await updateLeadScoreAction(lead.id);
  }

  revalidatePath('/settings');
  revalidatePath('/leads');
  return jurisdiction;
}

// Get dashboard stats
export async function getDashboardStatsAction() {
  const allLeads = await prisma.lead.findMany({
    include: { activities: true }
  });

  const suppressions = await prisma.suppression.count();

  const totalLeads = allLeads.length;
  const newLeads = allLeads.filter(l => l.stage === 'New').length;
  const hotLeads = allLeads.filter(l => l.score >= 80).length;
  
  // Pipeline value estimation: sum of estValue for won and design stages
  const pipelineValue = allLeads
    .filter(l => ['In design', 'Consult booked', 'Won'].includes(l.stage))
    .reduce((sum, l) => sum + (l.estValue || 0), 0);

  // Lead sources breakdown
  const sources: Record<string, number> = {};
  allLeads.forEach(l => {
    sources[l.source] = (sources[l.source] || 0) + 1;
  });

  return {
    totalLeads,
    newLeads,
    hotLeads,
    pipelineValue,
    suppressions,
    sources: Object.entries(sources).map(([name, value]) => ({ name, value })),
  };
}

// Sequences actions
export async function getSequencesAction() {
  return await prisma.sequence.findMany({
    include: { steps: { orderBy: { dayOffset: 'asc' } } }
  });
}

export async function updateSequenceStepAction(id: string, subject: string | null, bodyTemplate: string) {
  const step = await prisma.sequenceStep.update({
    where: { id },
    data: { subject, bodyTemplate }
  });
  revalidatePath('/sequences');
  return step;
}

// Jurisdictions list
export async function getJurisdictionsAction() {
  return await prisma.jurisdiction.findMany({
    orderBy: { name: 'asc' }
  });
}

// Suppression actions
export async function getSuppressionsAction() {
  return await prisma.suppression.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function addSuppressionAction(value: string, reason: string) {
  const suppression = await prisma.suppression.upsert({
    where: { value },
    update: { reason },
    create: { value, reason }
  });

  // Also disable email/phone consent for matching lead
  const matchingLeads = await prisma.lead.findMany({
    where: {
      OR: [
        { email: value },
        { phone: value }
      ]
    }
  });

  for (const lead of matchingLeads) {
    await prisma.consent.update({
      where: { leadId: lead.id },
      data: {
        emailOptIn: lead.email === value ? false : undefined,
        phoneOptIn: lead.phone === value ? false : undefined,
        smsOptIn: lead.phone === value ? false : undefined,
      }
    });
  }

  revalidatePath('/settings');
  return suppression;
}
