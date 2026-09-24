'use server';

import { prisma } from '@/lib/db';
import { calculateLeadScore, isHotLead } from '@/lib/scoring';
import { revalidatePath } from 'next/cache';
import { fallbackStore } from '@/lib/fallback-store';

function logFallbackWarning(action: string, error: any) {
  console.warn(`[Resilience Alert] Database operation in '${action}' failed: ${error?.message || error}. Falling back to resilient runtime store.`);
}

// Re-calculate and update score for a specific lead
export async function updateLeadScoreAction(leadId: string) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        activities: true,
        consent: true,
      }
    });

    if (!lead) {
      fallbackStore.updateLeadScore(leadId);
      return;
    }

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
  } catch (error) {
    logFallbackWarning('updateLeadScoreAction', error);
    fallbackStore.updateLeadScore(leadId);
  }
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
  try {
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
  } catch (error) {
    logFallbackWarning('getLeadsAction', error);
    return fallbackStore.getLeads(filters) as any;
  }
}

// Get single lead details
export async function getLeadByIdAction(id: string) {
  try {
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
  } catch (error) {
    logFallbackWarning('getLeadByIdAction', error);
    return fallbackStore.getLeadById(id) as any;
  }
}

// Update lead stage
export async function updateLeadStageAction(id: string, newStage: string) {
  try {
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
  } catch (error) {
    logFallbackWarning('updateLeadStageAction', error);
    const updated = fallbackStore.updateLeadStage(id, newStage);
    revalidatePath('/leads');
    revalidatePath('/pipeline');
    revalidatePath('/');
    return updated as any;
  }
}

// Add manual activity (note, call, email, etc.)
export async function addLeadActivityAction(leadId: string, kind: string, summary: string, payload?: any) {
  try {
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
  } catch (error) {
    logFallbackWarning('addLeadActivityAction', error);
    const activity = fallbackStore.addLeadActivity(leadId, kind, summary, payload);
    revalidatePath('/leads');
    revalidatePath('/pipeline');
    revalidatePath('/');
    return activity as any;
  }
}

// Update jurisdiction setting and cascade score updates
export async function updateJurisdictionAction(id: string, ab1033OptIn: boolean, notes?: string) {
  try {
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
  } catch (error) {
    logFallbackWarning('updateJurisdictionAction', error);
    const updated = fallbackStore.updateJurisdiction(id, ab1033OptIn, notes);
    revalidatePath('/settings');
    revalidatePath('/leads');
    return updated as any;
  }
}

// Get dashboard stats
export async function getDashboardStatsAction() {
  try {
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
  } catch (error) {
    logFallbackWarning('getDashboardStatsAction', error);
    return fallbackStore.getDashboardStats();
  }
}

// Sequences actions
export async function getSequencesAction() {
  try {
    return await prisma.sequence.findMany({
      include: { steps: { orderBy: { dayOffset: 'asc' } } }
    });
  } catch (error) {
    logFallbackWarning('getSequencesAction', error);
    return fallbackStore.getSequences() as any;
  }
}

export async function updateSequenceStepAction(id: string, subject: string | null, bodyTemplate: string) {
  try {
    const step = await prisma.sequenceStep.update({
      where: { id },
      data: { subject, bodyTemplate }
    });
    revalidatePath('/sequences');
    return step;
  } catch (error) {
    logFallbackWarning('updateSequenceStepAction', error);
    const step = fallbackStore.updateSequenceStep(id, subject, bodyTemplate);
    revalidatePath('/sequences');
    return step as any;
  }
}

// Jurisdictions list
export async function getJurisdictionsAction() {
  try {
    return await prisma.jurisdiction.findMany({
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    logFallbackWarning('getJurisdictionsAction', error);
    return fallbackStore.getJurisdictions() as any;
  }
}

// Suppression actions
export async function getSuppressionsAction() {
  try {
    return await prisma.suppression.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    logFallbackWarning('getSuppressionsAction', error);
    return fallbackStore.getSuppressions() as any;
  }
}

export async function addSuppressionAction(value: string, reason: string) {
  try {
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
  } catch (error) {
    logFallbackWarning('addSuppressionAction', error);
    const suppression = fallbackStore.addSuppression(value, reason);
    revalidatePath('/settings');
    return suppression as any;
  }
}

// Daily Email Nurture Data Action
export async function getDailyEmailDataAction() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [sends, activeEnrollments, totalSuppressions] = await Promise.all([
      prisma.emailSend.findMany({
        where: {
          createdAt: { gte: today }
        },
        include: {
          lead: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.enrollmentState.count({
        where: { status: 'active' }
      }),
      prisma.suppression.count(),
    ]);

    return {
      sends,
      activeEnrollments,
      totalSuppressions,
    };
  } catch (error) {
    logFallbackWarning('getDailyEmailDataAction', error);
    return fallbackStore.getDailyEmailData() as any;
  }
}


// ==========================================
// OUTBOUND EMAIL & PROPERTY QUALIFICATION CRM ACTIONS
// ==========================================

export async function getOutboundPropertiesAction(filters: {
  search?: string;
  city?: string;
  tier?: string;
  status?: string;
} = {}) {
  try {
    return fallbackStore.getOutboundProperties(filters);
  } catch (error) {
    logFallbackWarning("getOutboundPropertiesAction", error);
    return fallbackStore.getOutboundProperties(filters);
  }
}

export async function getOutboundEmailAction(leadId: string, variant: "equity_roi" | "speed_permitting" | "family_lifestyle" = "equity_roi") {
  try {
    return fallbackStore.getOutboundEmail(leadId, variant);
  } catch (error) {
    logFallbackWarning("getOutboundEmailAction", error);
    return fallbackStore.getOutboundEmail(leadId, variant);
  }
}

export async function updateOutboundStatusAction(leadId: string, status: "draft_ready" | "sent" | "opened" | "replied") {
  try {
    const updated = fallbackStore.updateOutboundStatus(leadId, status);
    revalidatePath("/outreach");
    revalidatePath("/daily-email");
    return { success: true, updated };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update status" };
  }
}

export async function saveOutboundDraftAction(leadId: string, subject: string, bodyHtml: string, status: "draft_ready" | "queued" = "draft_ready") {
  try {
    const record = fallbackStore.saveOutboundDraft(leadId, subject, bodyHtml, status);
    revalidatePath("/outreach");
    return record;
  } catch (error) {
    logFallbackWarning("saveOutboundDraftAction", error);
    return null;
  }
}

export async function sendOutboundEmailAction(leadId: string, subject: string, bodyHtml: string) {
  try {
    const lead = fallbackStore.getLeadById(leadId);
    if (lead) {
      const suppressions = fallbackStore.getSuppressions();
      const isSuppressed = suppressions.some(s => s.value.toLowerCase() === lead.email.toLowerCase());
      if (isSuppressed) {
        throw new Error("Recipient " + lead.email + " is on the Suppression / Do Not Contact list.");
      }
    }

    const record = fallbackStore.sendOutboundEmail(leadId, subject, bodyHtml);

    try {
      if (prisma) {
        await prisma.activity.create({
          data: {
            leadId,
            kind: "outbound_email_sent",
            summary: "Outbound Property ADU Qualification Email Sent: " + subject,
            payload: { subject },
          }
        });
        await prisma.emailSend.create({
          data: {
            leadId,
            subject,
            status: "sent",
          }
        });
      }
    } catch (dbErr) {
      logFallbackWarning("sendOutboundEmailAction DB backup", dbErr);
    }

    revalidatePath("/outreach");
    revalidatePath("/leads");
    revalidatePath("/daily-email");
    return { success: true, record };
  } catch (error: any) {
    logFallbackWarning("sendOutboundEmailAction", error);
    return { success: false, error: error?.message || "Failed to dispatch outbound email." };
  }
}

export async function batchGenerateOutboundDraftsAction(leadIds?: string[]) {
  try {
    const count = fallbackStore.batchGenerateOutboundDrafts(leadIds);
    revalidatePath("/outreach");
    return { success: true, count };
  } catch (error: any) {
    logFallbackWarning("batchGenerateOutboundDraftsAction", error);
    return { success: false, error: error?.message || "Failed to batch generate drafts." };
  }
}

export async function batchDispatchOutboundAction(limitOrLeadIds?: number | string[]) {
  try {
    const count = fallbackStore.batchDispatchOutbound(limitOrLeadIds);
    revalidatePath("/outreach");
    revalidatePath("/daily-email");
    return { success: true, count };
  } catch (error: any) {
    logFallbackWarning("batchDispatchOutboundAction", error);
    return { success: false, error: error?.message || "Failed to batch dispatch." };
  }
}

export async function getOutboundMetricsAction() {
  try {
    return fallbackStore.getOutboundMetrics();
  } catch (error) {
    logFallbackWarning("getOutboundMetricsAction", error);
    return fallbackStore.getOutboundMetrics();
  }
}

export async function getOutboundActivityFeedAction(limit = 15) {
  try {
    return fallbackStore.getOutboundActivityFeed(limit);
  } catch (error) {
    logFallbackWarning("getOutboundActivityFeedAction", error);
    return fallbackStore.getOutboundActivityFeed(limit);
  }
}
