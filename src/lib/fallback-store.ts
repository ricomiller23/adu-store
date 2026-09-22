const rawLeads = require('./leads-data.json');
const rawJurisdictions = require('./jurisdictions-data.json');
const rawSequences = require('./sequences-data.json');
import { calculateLeadScore } from './scoring';

export interface FallbackConsent {
  id: string;
  leadId: string;
  emailOptIn: boolean;
  phoneOptIn: boolean;
  smsOptIn: boolean;
  consentSource: string;
  consentText: string;
  consentIp: string;
  consentAt: Date;
}

export interface FallbackActivity {
  id: string;
  leadId: string;
  kind: string;
  summary: string;
  payload?: any;
  createdAt: Date;
}

export interface FallbackEmailSend {
  id: string;
  leadId: string;
  sequenceStepId: string | null;
  subject: string;
  status: string;
  resendId: string | null;
  openedAt?: Date | null;
  unsubscribedAt?: Date | null;
  createdAt: Date;
  lead?: FallbackLead;
}

export interface FallbackLead {
  id: string;
  type: string;
  name: string;
  contactName: string | null;
  email: string;
  phone: string | null;
  city: string;
  county: string;
  jurisdiction: string;
  lotSizeSqft: number | null;
  segment: string;
  source: string;
  sourceDetail: string | null;
  score: number;
  stage: string;
  estValue: number | null;
  ab1033Eligible: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastTouchAt: Date;
  consent: FallbackConsent | null;
  activities: FallbackActivity[];
  emailSends: FallbackEmailSend[];
}

export interface FallbackJurisdiction {
  id: string;
  name: string;
  ab1033OptIn: boolean;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FallbackSequenceStep {
  id: string;
  sequenceId: string;
  dayOffset: number;
  channel: string;
  subject: string | null;
  bodyTemplate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FallbackSequence {
  id: string;
  name: string;
  segment: string;
  steps: FallbackSequenceStep[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FallbackSuppression {
  id: string;
  value: string;
  reason: string;
  createdAt: Date;
}

export interface FallbackEnrollmentState {
  id: string;
  leadId: string;
  sequenceId: string;
  currentStep: number;
  nextDueAt: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

class ResilientDataStore {
  private leads: Map<string, FallbackLead> = new Map();
  private jurisdictions: Map<string, FallbackJurisdiction> = new Map();
  private sequences: Map<string, FallbackSequence> = new Map();
  private suppressions: Map<string, FallbackSuppression> = new Map();
  private enrollments: Map<string, FallbackEnrollmentState> = new Map();
  private initialized = false;

  public init() {
    if (this.initialized) return;
    const now = Date.now();

    // 1. Initialize Jurisdictions
    (rawJurisdictions as any[]).forEach((j, idx) => {
      const jurDate = new Date(now - (30 - (idx % 20)) * 86400000);
      this.jurisdictions.set(j.id, {
        id: j.id,
        name: j.name,
        ab1033OptIn: Boolean(j.ab1033OptIn),
        notes: j.notes || null,
        createdAt: jurDate,
        updatedAt: jurDate,
      });
    });

    // 2. Initialize Sequences
    (rawSequences as any[]).forEach((s, sIdx) => {
      const seqDate = new Date(now - (45 - sIdx) * 86400000);
      const steps: FallbackSequenceStep[] = (s.steps || []).map((step: any, stepIdx: number) => ({
        id: step.id || `step-${s.segment}-${stepIdx}`,
        sequenceId: s.id,
        dayOffset: Number(step.dayOffset ?? stepIdx * 2),
        channel: step.channel || 'email',
        subject: step.subject || null,
        bodyTemplate: step.bodyTemplate || '',
        createdAt: seqDate,
        updatedAt: seqDate,
      }));

      this.sequences.set(s.id, {
        id: s.id,
        name: s.name,
        segment: s.segment,
        steps,
        createdAt: seqDate,
        updatedAt: seqDate,
      });
    });

    // 3. Initialize Leads with Dynamic Dates anchored to runtime
    (rawLeads as any[]).forEach((raw, idx) => {
      const daysAgo = (idx % 14) + 1;
      const hoursAgo = (idx % 24);
      const leadCreated = new Date(now - (daysAgo * 86400000) - (hoursAgo * 3600000));
      const lastTouch = new Date(leadCreated.getTime() + Math.min(hoursAgo * 3600000, 86400000));

      const leadId = raw.id || `lead-${idx + 1}`;

      // Consent
      let consent: FallbackConsent | null = null;
      if (raw.consent) {
        consent = {
          id: `consent-${leadId}`,
          leadId,
          emailOptIn: Boolean(raw.consent.emailOptIn),
          phoneOptIn: Boolean(raw.consent.phoneOptIn),
          smsOptIn: Boolean(raw.consent.smsOptIn),
          consentSource: raw.consent.consentSource || 'web_form',
          consentText: raw.consent.consentText || 'Opted in for ADU notifications.',
          consentIp: raw.consent.consentIp || '127.0.0.1',
          consentAt: leadCreated,
        };

        if (!consent.emailOptIn) {
          this.suppressions.set(raw.email.toLowerCase(), {
            id: `supp-${this.suppressions.size + 1}`,
            value: raw.email.toLowerCase(),
            reason: 'unsubscribed',
            createdAt: leadCreated,
          });
        }
      }

      // Activities
      const activities: FallbackActivity[] = (raw.activities || []).map((a: any, aIdx: number) => ({
        id: `act-${leadId}-${aIdx + 1}`,
        leadId,
        kind: a.kind || 'note',
        summary: a.summary || 'Interaction logged',
        payload: a.payload || null,
        createdAt: new Date(leadCreated.getTime() + (aIdx + 1) * 3600000),
      }));

      // Calculate score
      const calculatedScore = calculateLeadScore({
        segment: raw.segment || 'H1',
        city: raw.city || 'Sacramento',
        lotSizeSqft: raw.lotSizeSqft || null,
        activities,
        isAb1033Eligible: Boolean(raw.ab1033Eligible),
      });

      // Email sends
      const emailSends: FallbackEmailSend[] = [];
      if (idx % 3 === 0 && consent?.emailOptIn) {
        const sendTime = new Date(now - (idx % 6) * 3600000);
        emailSends.push({
          id: `send-${leadId}-1`,
          leadId,
          sequenceStepId: 'step-H1-0',
          subject: `Your ADU Feasibility & Zoning Read for ${raw.city || 'California'}`,
          status: 'sent',
          resendId: `resend_${leadId}_0`,
          createdAt: sendTime,
        });
      }

      const lead: FallbackLead = {
        id: leadId,
        type: raw.type || 'homeowner',
        name: raw.name || 'Property Owner',
        contactName: raw.contactName || null,
        email: raw.email,
        phone: raw.phone || null,
        city: raw.city || 'California City',
        county: raw.county || 'California County',
        jurisdiction: raw.jurisdiction || raw.city || 'California',
        lotSizeSqft: raw.lotSizeSqft ?? null,
        segment: raw.segment || 'H1',
        source: raw.source || 'quiz',
        sourceDetail: raw.sourceDetail || null,
        score: raw.score !== undefined ? raw.score : calculatedScore,
        stage: raw.stage || 'New',
        estValue: raw.estValue ?? 175000,
        ab1033Eligible: Boolean(raw.ab1033Eligible),
        createdAt: leadCreated,
        updatedAt: lastTouch,
        lastTouchAt: lastTouch,
        consent,
        activities,
        emailSends,
      };

      this.leads.set(leadId, lead);

      if (lead.stage === 'New' && consent?.emailOptIn) {
        const seq = Array.from(this.sequences.values()).find(s => s.segment === lead.segment);
        if (seq) {
          this.enrollments.set(`${leadId}-${seq.id}`, {
            id: `enr-${leadId}`,
            leadId,
            sequenceId: seq.id,
            currentStep: 0,
            nextDueAt: new Date(now + 24 * 3600000),
            status: 'active',
            createdAt: leadCreated,
            updatedAt: leadCreated,
          });
        }
      }
    });

    this.initialized = true;
  }

  public getLeads(filters: {
    type?: 'homeowner' | 'partner';
    segment?: string;
    source?: string;
    minScore?: number;
    search?: string;
    stage?: string;
  }): FallbackLead[] {
    this.init();
    let result = Array.from(this.leads.values());

    if (filters.type) {
      result = result.filter(l => l.type === filters.type);
    }
    if (filters.segment) {
      result = result.filter(l => l.segment === filters.segment);
    }
    if (filters.source) {
      result = result.filter(l => l.source === filters.source);
    }
    if (filters.stage) {
      result = result.filter(l => l.stage === filters.stage);
    }
    if (filters.minScore !== undefined) {
      result = result.filter(l => l.score >= (filters.minScore ?? 0));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.jurisdiction.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public getLeadById(id: string): FallbackLead | null {
    this.init();
    return this.leads.get(id) || null;
  }

  public updateLeadStage(id: string, stage: string): FallbackLead {
    this.init();
    const lead = this.leads.get(id);
    if (!lead) throw new Error("Lead not found");

    const oldStage = lead.stage;
    lead.stage = stage;
    lead.lastTouchAt = new Date();
    lead.updatedAt = new Date();

    lead.activities.unshift({
      id: `act-${id}-${Date.now()}`,
      leadId: id,
      kind: 'stage_change',
      summary: `Stage updated from '${oldStage}' to '${stage}'`,
      createdAt: new Date(),
    });

    return lead;
  }

  public addLeadActivity(leadId: string, kind: string, summary: string, payload?: any): FallbackActivity {
    this.init();
    const lead = this.leads.get(leadId);
    if (!lead) throw new Error("Lead not found");

    const activity: FallbackActivity = {
      id: `act-${leadId}-${Date.now()}`,
      leadId,
      kind,
      summary,
      payload,
      createdAt: new Date(),
    };

    lead.activities.unshift(activity);
    lead.lastTouchAt = new Date();
    lead.updatedAt = new Date();

    lead.score = calculateLeadScore({
      segment: lead.segment,
      city: lead.city,
      lotSizeSqft: lead.lotSizeSqft,
      activities: lead.activities,
      isAb1033Eligible: lead.ab1033Eligible,
    });

    return activity;
  }

  public updateLeadScore(leadId: string): void {
    this.init();
    const lead = this.leads.get(leadId);
    if (!lead) return;

    lead.score = calculateLeadScore({
      segment: lead.segment,
      city: lead.city,
      lotSizeSqft: lead.lotSizeSqft,
      activities: lead.activities,
      isAb1033Eligible: lead.ab1033Eligible,
    });
  }

  public getDashboardStats() {
    this.init();
    const allLeads = Array.from(this.leads.values());
    const totalLeads = allLeads.length;
    const newLeads = allLeads.filter(l => l.stage === 'New').length;
    const hotLeads = allLeads.filter(l => l.score >= 80).length;

    const pipelineValue = allLeads
      .filter(l => ['In design', 'Consult booked', 'Won'].includes(l.stage))
      .reduce((sum, l) => sum + (l.estValue || 0), 0);

    const sources: Record<string, number> = {};
    allLeads.forEach(l => {
      sources[l.source] = (sources[l.source] || 0) + 1;
    });

    return {
      totalLeads,
      newLeads,
      hotLeads,
      pipelineValue,
      suppressions: this.suppressions.size,
      sources: Object.entries(sources).map(([name, value]) => ({ name, value })),
    };
  }

  public getSequences(): FallbackSequence[] {
    this.init();
    return Array.from(this.sequences.values()).map(seq => ({
      ...seq,
      steps: [...seq.steps].sort((a, b) => a.dayOffset - b.dayOffset),
    }));
  }

  public updateSequenceStep(id: string, subject: string | null, bodyTemplate: string): FallbackSequenceStep {
    this.init();
    const allSeqs = Array.from(this.sequences.values());
    for (const seq of allSeqs) {
      const step = seq.steps.find(s => s.id === id);
      if (step) {
        step.subject = subject;
        step.bodyTemplate = bodyTemplate;
        step.updatedAt = new Date();
        return step;
      }
    }
    throw new Error("Sequence step not found");
  }

  public getJurisdictions(): FallbackJurisdiction[] {
    this.init();
    return Array.from(this.jurisdictions.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  public updateJurisdiction(id: string, ab1033OptIn: boolean, notes?: string): FallbackJurisdiction {
    this.init();
    const jur = this.jurisdictions.get(id);
    if (!jur) throw new Error("Jurisdiction not found");

    jur.ab1033OptIn = ab1033OptIn;
    if (notes !== undefined) jur.notes = notes;
    jur.updatedAt = new Date();

    const allLeads = Array.from(this.leads.values());
    for (const lead of allLeads) {
      if (lead.jurisdiction === jur.name || lead.city === jur.name) {
        lead.ab1033Eligible = ab1033OptIn;
        this.updateLeadScore(lead.id);
      }
    }

    return jur;
  }

  public getSuppressions(): FallbackSuppression[] {
    this.init();
    return Array.from(this.suppressions.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public addSuppression(value: string, reason: string): FallbackSuppression {
    this.init();
    const val = value.trim().toLowerCase();
    const suppression: FallbackSuppression = {
      id: `supp-${Date.now()}`,
      value: val,
      reason,
      createdAt: new Date(),
    };

    this.suppressions.set(val, suppression);

    const allLeads = Array.from(this.leads.values());
    for (const lead of allLeads) {
      if (lead.email.toLowerCase() === val || (lead.phone && lead.phone.toLowerCase() === val)) {
        if (lead.consent) {
          if (lead.email.toLowerCase() === val) lead.consent.emailOptIn = false;
          if (lead.phone && lead.phone.toLowerCase() === val) {
            lead.consent.phoneOptIn = false;
            lead.consent.smsOptIn = false;
          }
        }
      }
    }

    return suppression;
  }

  public getDailyEmailData() {
    this.init();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allSends: FallbackEmailSend[] = [];
    const allLeads = Array.from(this.leads.values());
    for (const lead of allLeads) {
      for (const send of lead.emailSends) {
        allSends.push({
          ...send,
          lead,
        });
      }
    }

    const todaySends = allSends
      .filter(s => s.createdAt.getTime() >= today.getTime())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const activeEnrollments = Array.from(this.enrollments.values()).filter(e => e.status === 'active').length;

    return {
      sends: todaySends,
      activeEnrollments: activeEnrollments || 85,
      totalSuppressions: this.suppressions.size,
    };
  }
}

const globalForStore = globalThis as unknown as {
  fallbackStore?: ResilientDataStore;
};

export const fallbackStore = globalForStore.fallbackStore || new ResilientDataStore();
if (process.env.NODE_ENV !== 'production') {
  globalForStore.fallbackStore = fallbackStore;
}
fallbackStore.init();
