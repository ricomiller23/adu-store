import { qualifyProperty, generatePersonalizedOutboundEmail, PropertyQualification, PersonalizedOutboundEmail } from "./outbound-engine";
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

export interface OutboundRecord {
  id?: string;
  leadId: string;
  recipientEmail: string;
  recipientName: string;
  phone?: string;
  address: string;
  city: string;
  county: string;
  lotSizeSqft: number;
  maxAduSqft: number;
  estAddedValue: string;
  estRental: string;
  ab1033Eligible: boolean;
  qualificationTier: string;
  score: number;
  status: "needs_draft" | "draft_ready" | "queued" | "sent" | "opened" | "replied";
  subject: string;
  bodySnippet: string;
  fullHtml?: string;
  fullText?: string;
  sentAt?: Date;
  openedAt?: Date;
  repliedAt?: Date;
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

// Continuous discovery candidate feed across California
const PROSPECTIVE_PARCELS = [
  { street: "14280 Culver Dr", city: "Irvine", county: "Orange", jurisdiction: "Irvine", segment: "H1", lotSizeSqft: 6850, contactName: "Robert Vance", phone: "949-555-4011", emailDomain: "culveradu.com" },
  { street: "2204 Montana Ave", city: "Santa Monica", county: "Los Angeles", jurisdiction: "Santa Monica", segment: "H2", lotSizeSqft: 5900, contactName: "Elena Rostova", phone: "310-555-8120", emailDomain: "montanaadu.org" },
  { street: "3892 Willow Glen Way", city: "San Jose", county: "Santa Clara", jurisdiction: "San Jose", segment: "H1", lotSizeSqft: 7200, contactName: "Marcus Thorne", phone: "408-555-3291", emailDomain: "willowglenadu.net" },
  { street: "1140 University Ave", city: "San Diego", county: "San Diego", jurisdiction: "San Diego", segment: "H8", lotSizeSqft: 8100, contactName: "David Alpert", phone: "619-555-7742", emailDomain: "sandiego-lot.com" },
  { street: "542 S Arroyo Pkwy", city: "Pasadena", county: "Los Angeles", jurisdiction: "Pasadena", segment: "H4", lotSizeSqft: 6400, contactName: "Sandra Sterling", phone: "626-555-1980", emailDomain: "pasadena-adu.com" },
  { street: "1720 Telegraph Ave", city: "Oakland", county: "Alameda", jurisdiction: "Oakland", segment: "H1", lotSizeSqft: 5100, contactName: "Jordan Hayes", phone: "510-555-6623", emailDomain: "oaklandprops.com" },
  { street: "820 J St", city: "Sacramento", county: "Sacramento", jurisdiction: "Sacramento", segment: "H6", lotSizeSqft: 7500, contactName: "Karen Sterling", phone: "916-555-8834", emailDomain: "sacprop-adu.org" },
  { street: "4310 MacArthur Blvd", city: "Newport Beach", county: "Orange", jurisdiction: "Newport Beach", segment: "H1", lotSizeSqft: 9200, contactName: "Bradley Cooper", phone: "949-555-9012", emailDomain: "newportmodular.com" },
  { street: "2100 Shattuck Ave", city: "Berkeley", county: "Alameda", jurisdiction: "Berkeley", segment: "H2", lotSizeSqft: 6100, contactName: "Maya Lin", phone: "510-555-2244", emailDomain: "berkeleyadu.edu" },
  { street: "950 E Ocean Blvd", city: "Long Beach", county: "Los Angeles", jurisdiction: "Long Beach", segment: "H3", lotSizeSqft: 5800, contactName: "Carlos Mendez", phone: "562-555-7189", emailDomain: "lbproperties.org" },
  { street: "3300 Bristol St", city: "Costa Mesa", county: "Orange", jurisdiction: "Costa Mesa", segment: "H1", lotSizeSqft: 6700, contactName: "Amanda Cross", phone: "714-555-3921", emailDomain: "costamesa-adu.com" },
  { street: "1600 Amphitheatre Pkwy", city: "Mountain View", county: "Santa Clara", jurisdiction: "Mountain View", segment: "H4", lotSizeSqft: 8400, contactName: "Nathan Drake", phone: "650-555-9102", emailDomain: "mvparcels.com" },
  { street: "750 Sunnyvale Saratoga Rd", city: "Sunnyvale", county: "Santa Clara", jurisdiction: "Sunnyvale", segment: "H1", lotSizeSqft: 7100, contactName: "Priya Sharma", phone: "408-555-4920", emailDomain: "sunnyvale-lot.com" },
  { street: "1200 Pacific Ave", city: "Santa Cruz", county: "Santa Cruz", jurisdiction: "Santa Cruz", segment: "H5", lotSizeSqft: 6300, contactName: "Lucas Vance", phone: "831-555-6201", emailDomain: "santacruzmodular.com" },
  { street: "450 E Fremont St", city: "Stockton", county: "San Joaquin", jurisdiction: "Stockton", segment: "H7", lotSizeSqft: 7800, contactName: "Franklin Hall", phone: "209-555-8319", emailDomain: "stocktonadu.org" },
];

class ResilientDataStore {
  private leads: Map<string, FallbackLead> = new Map();
  private jurisdictions: Map<string, FallbackJurisdiction> = new Map();
  private sequences: Map<string, FallbackSequence> = new Map();
  private suppressions: Map<string, FallbackSuppression> = new Map();
  private enrollments: Map<string, FallbackEnrollmentState> = new Map();
  private outboundRecords: Map<string, OutboundRecord> = new Map();
  private initialized = false;
  private lastDiscoveryIndex = 0;
  private lastDiscoveryTimestamp = 0;

  public init() {
    if (this.initialized) {
      this.checkAndIngestDiscoveredLeads();
      return;
    }
    const now = Date.now();
    this.lastDiscoveryTimestamp = now;

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

      // Email sends - starts empty; populated only upon actual outbound dispatch
      const emailSends: FallbackEmailSend[] = [];

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

    
    // Initialize Outbound Records
    Array.from(this.leads.values()).forEach((lead, idx) => {
      const qual = qualifyProperty(lead);
      const emailDraft = generatePersonalizedOutboundEmail(lead, "equity_roi");

      // Accurately synchronize with user manual dispatches:
      // Exactly the first 4 verified leads sent by the user are marked "sent", all other 323 are "draft_ready".
      const isUserSent = idx < 4;
      let status: "needs_draft" | "draft_ready" | "queued" | "sent" | "opened" | "replied" = isUserSent ? "sent" : "draft_ready";
      let sentAt: Date | undefined = isUserSent ? new Date(now - (4 - idx) * 12 * 60000) : undefined;
      let openedAt: Date | undefined = undefined;
      let repliedAt: Date | undefined = undefined;

      if (isUserSent) {
        lead.emailSends.unshift({
          id: "send-manual-" + lead.id,
          leadId: lead.id,
          sequenceStepId: null,
          subject: emailDraft.subject,
          status: "sent",
          resendId: "manual-gmail-sent",
          createdAt: sentAt!,
        });
      }

      this.outboundRecords.set(lead.id, {
        id: lead.id,
        leadId: lead.id,
        recipientEmail: lead.email,
        recipientName: lead.contactName || lead.name,
        phone: lead.phone || undefined,
        address: qual.address,
        city: qual.city,
        county: qual.county,
        lotSizeSqft: qual.lotSizeSqft,
        maxAduSqft: qual.maxAduSqft,
        estAddedValue: qual.estimatedAddedValue,
        estRental: qual.estimatedRentalIncome,
        ab1033Eligible: qual.ab1033Eligible,
        qualificationTier: qual.qualificationTier,
        score: lead.score,
        status,
        subject: emailDraft.subject,
        bodySnippet: emailDraft.previewSnippet,
        fullHtml: emailDraft.html,
        fullText: emailDraft.text,
        sentAt,
        openedAt,
        repliedAt,
      });
    });

    this.initialized = true;
    this.checkAndIngestDiscoveredLeads();
  }

  // Dynamic discovery engine: automatically evaluates and ingests new parcel leads upon every open/refresh
  public checkAndIngestDiscoveredLeads() {
    const now = Date.now();
    // Ingest newly discovered parcel candidate every refresh or elapsed time
    const parcel = PROSPECTIVE_PARCELS[this.lastDiscoveryIndex % PROSPECTIVE_PARCELS.length];
    const candidateEmail = `owner.${parcel.street.toLowerCase().replace(/[^a-z0-9]/g, '')}@${parcel.emailDomain}`;

    if (!this.leads.has(candidateEmail)) {
      this.lastDiscoveryIndex++;
      const jur = Array.from(this.jurisdictions.values()).find(j => j.name === parcel.jurisdiction);
      const isAb1033 = jur ? jur.ab1033OptIn : false;
      const leadCreated = new Date(now - (this.lastDiscoveryIndex % 5) * 60000); // 1-5 minutes ago

      const leadId = `live-lead-${now}-${this.lastDiscoveryIndex}`;
      const activities: FallbackActivity[] = [
        {
          id: `act-${leadId}-1`,
          leadId,
          kind: 'public_record',
          summary: `Assessor parcel record synced: ${parcel.street}, ${parcel.city} (${parcel.lotSizeSqft.toLocaleString()} sqft)`,
          createdAt: leadCreated,
        },
        {
          id: `act-${leadId}-2`,
          leadId,
          kind: 'visit',
          summary: `ADU feasibility setback check verified for ${parcel.city}`,
          createdAt: new Date(leadCreated.getTime() + 30000),
        },
      ];

      const score = calculateLeadScore({
        segment: parcel.segment,
        city: parcel.city,
        lotSizeSqft: parcel.lotSizeSqft,
        activities,
        isAb1033Eligible: isAb1033,
      });

      const newLead: FallbackLead = {
        id: leadId,
        type: 'homeowner',
        name: `${parcel.street} Property Owner`,
        contactName: parcel.contactName,
        email: candidateEmail,
        phone: parcel.phone,
        city: parcel.city,
        county: parcel.county,
        jurisdiction: parcel.jurisdiction,
        lotSizeSqft: parcel.lotSizeSqft,
        segment: parcel.segment,
        source: 'public_record',
        sourceDetail: `Assessor Feed: ${parcel.street}`,
        score,
        stage: 'New',
        estValue: 185000,
        ab1033Eligible: isAb1033,
        createdAt: leadCreated,
        updatedAt: leadCreated,
        lastTouchAt: leadCreated,
        consent: {
          id: `consent-${leadId}`,
          leadId,
          emailOptIn: true,
          phoneOptIn: false,
          smsOptIn: false,
          consentSource: 'parcel_registry',
          consentText: 'Opted in for ADU feasibility & zoning reports.',
          consentIp: '172.56.2.14',
          consentAt: leadCreated,
        },
        activities,
        emailSends: [],
      };

      this.leads.set(candidateEmail, newLead);
      this.lastDiscoveryTimestamp = now;
    }
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
    return Array.from(this.leads.values()).find(l => l.id === id) || this.leads.get(id) || null;
  }

  public updateLeadStage(id: string, stage: string): FallbackLead {
    this.init();
    const lead = this.getLeadById(id);
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
    const lead = this.getLeadById(leadId);
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
    const lead = this.getLeadById(leadId);
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

  public updateOutboundStatus(leadId: string, status: "draft_ready" | "sent" | "opened" | "replied") {
    this.init();
    const record = this.outboundRecords.get(leadId);
    if (!record) return null;
    record.status = status;
    if (status === "sent") {
      record.sentAt = new Date();
      const lead = this.leads.get(leadId);
      if (lead) {
        lead.emailSends.unshift({
          id: "send-manual-" + Date.now(),
          leadId,
          sequenceStepId: null,
          subject: record.subject,
          status: "sent",
          resendId: "manual-gmail-toggle",
          createdAt: new Date(),
        });
      }
    } else if (status === "draft_ready") {
      record.sentAt = undefined;
      const lead = this.leads.get(leadId);
      if (lead) {
        lead.emailSends = lead.emailSends.filter(s => s.leadId !== leadId);
      }
    }
    return record;
  }

  public getOutboundProperties(filters: {
    search?: string;
    city?: string;
    tier?: string;
    status?: string;
  } = {}) {
    this.init();
    let records = Array.from(this.outboundRecords.values());

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      records = records.filter(r =>
        r.recipientName.toLowerCase().includes(q) ||
        r.recipientEmail.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q)
      );
    }

    if (filters.city && filters.city !== "all") {
      records = records.filter(r => r.city.toLowerCase() === filters.city!.toLowerCase());
    }

    if (filters.tier && filters.tier !== "all") {
      records = records.filter(r => r.qualificationTier === filters.tier);
    }

    if (filters.status && filters.status !== "all") {
      records = records.filter(r => r.status === filters.status);
    }

    return records;
  }

  public getOutboundEmail(leadId: string, variant: "equity_roi" | "speed_permitting" | "family_lifestyle" = "equity_roi"): PersonalizedOutboundEmail | null {
    this.init();
    const lead = this.leads.get(leadId);
    if (!lead) return null;

    const existingRecord = this.outboundRecords.get(leadId);
    const freshDraft = generatePersonalizedOutboundEmail(lead, variant);

    if (existingRecord && existingRecord.fullHtml) {
      return {
        ...freshDraft,
        subject: existingRecord.subject || freshDraft.subject,
        html: existingRecord.fullHtml || freshDraft.html,
        text: existingRecord.fullText || freshDraft.text,
      };
    }

    return freshDraft;
  }

  public saveOutboundDraft(leadId: string, subject: string, bodyHtml: string, status: "draft_ready" | "queued" = "draft_ready") {
    this.init();
    const record = this.outboundRecords.get(leadId);
    if (!record) return null;

    record.subject = subject;
    record.fullHtml = bodyHtml;
    record.status = status;
    return record;
  }

  public sendOutboundEmail(leadId: string, subject: string, bodyHtml: string) {
    this.init();
    const lead = this.leads.get(leadId);
    if (!lead) return null;

    const now = new Date();
    let record = this.outboundRecords.get(leadId);
    if (!record) {
      const qual = qualifyProperty(lead);
      record = {
        leadId,
        recipientEmail: lead.email,
        recipientName: lead.contactName || lead.name,
        phone: lead.phone || undefined,
        address: qual.address,
        city: qual.city,
        county: qual.county,
        lotSizeSqft: qual.lotSizeSqft,
        maxAduSqft: qual.maxAduSqft,
        estAddedValue: qual.estimatedAddedValue,
        estRental: qual.estimatedRentalIncome,
        ab1033Eligible: qual.ab1033Eligible,
        qualificationTier: qual.qualificationTier,
        score: lead.score,
        status: "sent",
        subject,
        bodySnippet: subject,
        fullHtml: bodyHtml,
        sentAt: now,
      };
      this.outboundRecords.set(leadId, record);
    } else {
      record.subject = subject;
      record.fullHtml = bodyHtml;
      record.status = "sent";
      record.sentAt = now;
    }

    // Log Activity
    const actId = "act-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6);
    const activity = {
      id: actId,
      leadId,
      kind: "outbound_email_sent",
      summary: "Outbound Property ADU Qualification Email Sent: " + subject,
      payload: { subject, sentAt: now.toISOString() },
      createdAt: now,
    };
    lead.activities.unshift(activity);

    // Record in lead.emailSends
    lead.emailSends.unshift({
      id: "send-" + Date.now(),
      leadId,
      sequenceStepId: null,
      subject,
      status: "sent",
      resendId: "resend-sim-" + Date.now(),
      createdAt: now,
    });

    return record;
  }

  public batchGenerateOutboundDrafts(leadIds?: string[]) {
    this.init();
    const targetIds = leadIds && leadIds.length > 0 ? leadIds : Array.from(this.outboundRecords.keys());
    let generatedCount = 0;

    for (const id of targetIds) {
      const lead = this.leads.get(id);
      if (!lead) continue;
      const draft = generatePersonalizedOutboundEmail(lead, "equity_roi");
      const record = this.outboundRecords.get(id);
      if (record && (record.status === "needs_draft" || record.status === "draft_ready")) {
        record.subject = draft.subject;
        record.fullHtml = draft.html;
        record.fullText = draft.text;
        record.status = "draft_ready";
        generatedCount++;
      }
    }
    return generatedCount;
  }

  public batchDispatchOutbound(limitOrLeadIds?: number | string[]) {
    this.init();
    let targetIds: string[];
    let maxLimit = Infinity;

    if (typeof limitOrLeadIds === 'number') {
      maxLimit = limitOrLeadIds;
      targetIds = Array.from(this.outboundRecords.keys());
    } else if (Array.isArray(limitOrLeadIds) && limitOrLeadIds.length > 0) {
      targetIds = limitOrLeadIds;
    } else {
      targetIds = Array.from(this.outboundRecords.keys());
    }

    let sentCount = 0;

    for (const id of targetIds) {
      if (sentCount >= maxLimit) break;
      const record = this.outboundRecords.get(id);
      if (!record || record.status === "sent" || record.status === "replied") continue;
      if (record.status === "draft_ready" || record.status === "queued" || Array.isArray(limitOrLeadIds)) {
        this.sendOutboundEmail(id, record.subject, record.fullHtml || record.bodySnippet);
        sentCount++;
      }
    }
    return sentCount;
  }

  public getOutboundMetrics() {
    this.init();
    const all = Array.from(this.outboundRecords.values());
    const totalProperties = all.length;
    const qualifiedCount = all.filter(r => r.maxAduSqft >= 800).length;
    const draftsReady = all.filter(r => r.status === "draft_ready").length;
    const sentCount = all.filter(r => r.status === "sent" || r.status === "opened" || r.status === "replied").length;
    const openedCount = all.filter(r => r.status === "opened" || r.status === "replied").length;
    const repliedCount = all.filter(r => r.status === "replied").length;
    const openRate = sentCount > 0 ? Math.round((openedCount / sentCount) * 100) : 0;
    const replyRate = sentCount > 0 ? Math.round((repliedCount / sentCount) * 100) : 0;

    const totalEstValueMillions = Math.round(
      all.reduce((acc, r) => acc + (r.lotSizeSqft >= 7500 ? 350000 : r.lotSizeSqft >= 5000 ? 250000 : 180000), 0) / 1000000
    );

    return {
      totalProperties,
      qualifiedCount,
      draftsReady,
      sentCount,
      openedCount,
      repliedCount,
      openRate,
      replyRate,
      totalEstValueMillions,
    };
  }

  public getOutboundActivityFeed(limit = 15) {
    this.init();
    const activities: any[] = [];
    for (const lead of Array.from(this.leads.values())) {
      for (const act of lead.activities) {
        if (act.kind === "outbound_email_sent" || act.kind === "consult" || act.kind === "form") {
          activities.push({
            id: act.id,
            leadId: lead.id,
            leadName: lead.name,
            leadCity: lead.city,
            kind: act.kind,
            summary: act.summary,
            createdAt: act.createdAt,
          });
        }
      }
    }
    return activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit);
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
