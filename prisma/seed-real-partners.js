require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const realPartners = [
  // P1: Real Estate Agents (Santa Monica / Compass)
  {
    name: "Jessica Abbott (Compass)",
    email: "jessica.abbott@compass.com",
    phone: "310-597-1055",
    city: "Santa Monica",
    county: "Los Angeles",
    jurisdiction: "Santa Monica",
    segment: "P1",
    source: "website",
    sourceDetail: "Agent Referral Form",
    stage: "Active",
    type: "partner",
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: true, smsOptIn: false, consentSource: "agent_opt_in", consentText: "Consent to agency network notifications.", consentIp: "127.0.0.1" },
    activities: [
      { kind: "form", summary: "Registered as a Compass referral agent partner" }
    ]
  },
  {
    name: "Marco Abdelnour (Compass)",
    email: "marco.abdelnour@compass.com",
    phone: "310-595-6416",
    city: "Santa Monica",
    county: "Los Angeles",
    jurisdiction: "Santa Monica",
    segment: "P1",
    source: "website",
    sourceDetail: "Agent Referral Form",
    stage: "Vetting",
    type: "partner",
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: true, smsOptIn: false, consentSource: "agent_opt_in", consentText: "Consent to agent updates.", consentIp: "127.0.0.1" },
    activities: [
      { kind: "form", summary: "Submitted real estate affiliate program request" }
    ]
  },
  {
    name: "David A. Berg (Compass)",
    email: "david.berg@compass.com",
    phone: "310-500-3931",
    city: "Santa Monica",
    county: "Los Angeles",
    jurisdiction: "Santa Monica",
    segment: "P1",
    source: "outreach",
    sourceDetail: "Agent Directory Match",
    stage: "Applied",
    type: "partner",
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "manual", consentText: "Public listing B2B CAN-SPAM introduction", consentIp: "127.0.0.1" },
    activities: [
      { kind: "email_sent", summary: "Sent partnership introductory brochure" }
    ]
  },
  {
    name: "Ari Afshar (Compass)",
    email: "ari@compass.com",
    phone: "310-780-3180",
    city: "Santa Monica",
    county: "Los Angeles",
    jurisdiction: "Santa Monica",
    segment: "P1",
    source: "website",
    sourceDetail: "Agent Referral Form",
    stage: "Active",
    type: "partner",
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: true, smsOptIn: true, consentSource: "agent_opt_in", consentText: "Consent to all partnership contact.", consentIp: "127.0.0.1" },
    activities: [
      { kind: "form", summary: "Joined agent referral panel" },
      { kind: "stage_change", summary: "Moved from Vetting to Active" }
    ]
  },
  // P3: Mortgage Brokers (San Jose)
  {
    name: "General Mortgage Capital Corp",
    email: "info@gmccloan.com",
    phone: "650-340-7800",
    city: "San Jose",
    county: "Santa Clara",
    jurisdiction: "San Jose",
    segment: "P3",
    source: "outreach",
    sourceDetail: "NMLS Registry lookup",
    stage: "Vetting",
    type: "partner",
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "manual", consentText: "NMLS public registry B2B CAN-SPAM check", consentIp: "127.0.0.1" },
    activities: [
      { kind: "email_sent", summary: "Sent welcome email regarding financing ADU builds" }
    ]
  },
  {
    name: "Cedar Mortgage",
    email: "info@cedarmortgage.com",
    phone: "408-879-9011",
    city: "San Jose",
    county: "Santa Clara",
    jurisdiction: "San Jose",
    segment: "P3",
    source: "website",
    sourceDetail: "Broker Application Form",
    stage: "Active",
    type: "partner",
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: true, smsOptIn: false, consentSource: "broker_opt_in", consentText: "Consent to mortgage partnership program.", consentIp: "127.0.0.1" },
    activities: [
      { kind: "form", summary: "Submitted mortgage broker partnership application" },
      { kind: "stage_change", summary: "Moved from Applied to Active" }
    ]
  },
  {
    name: "The Mortgage Outlet",
    email: "loans@themortgageoutlet.com",
    phone: "408-352-5120",
    city: "San Jose",
    county: "Santa Clara",
    jurisdiction: "San Jose",
    segment: "P3",
    source: "website",
    sourceDetail: "Broker Application Form",
    stage: "Terms sent",
    type: "partner",
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: true, smsOptIn: false, consentSource: "broker_opt_in", consentText: "Consent to lending network updates.", consentIp: "127.0.0.1" },
    activities: [
      { kind: "form", summary: "Submitted lending referral profile" },
      { kind: "stage_change", summary: "Moved from Vetting to Terms sent" }
    ]
  },
  // P4: Property Managers (San Francisco)
  {
    name: "Gordon Property Management",
    email: "contactgpm@gpmsf.com",
    phone: "415-554-8812",
    city: "San Francisco",
    county: "San Francisco",
    jurisdiction: "San Francisco",
    segment: "P4",
    source: "website",
    sourceDetail: "Affiliate Opt-in",
    stage: "Active",
    type: "partner",
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: true, smsOptIn: false, consentSource: "pm_opt_in", consentText: "Consent to PM reseller updates.", consentIp: "127.0.0.1" },
    activities: [
      { kind: "form", summary: "Enrolled in Property Manager ADU affiliate network" },
      { kind: "stage_change", summary: "Moved from Vetting to Active" }
    ]
  },
  {
    name: "Structure Properties",
    email: "info@structureproperties.com",
    phone: "415-552-6900",
    city: "San Francisco",
    county: "San Francisco",
    jurisdiction: "San Francisco",
    segment: "P4",
    source: "outreach",
    sourceDetail: "SFAA Member List",
    stage: "Applied",
    type: "partner",
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "manual", consentText: "B2B commercial introductory outreach", consentIp: "127.0.0.1" },
    activities: [
      { kind: "email_sent", summary: "Sent portfolio ADU income blueprint" }
    ]
  },
  {
    name: "West Coast Property Management",
    email: "info@wcpm.com",
    phone: "415-621-5550",
    city: "San Francisco",
    county: "San Francisco",
    jurisdiction: "San Francisco",
    segment: "P4",
    source: "website",
    sourceDetail: "Affiliate Opt-in",
    stage: "Vetting",
    type: "partner",
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: true, smsOptIn: false, consentSource: "pm_opt_in", consentText: "Consent to marketing updates.", consentIp: "127.0.0.1" },
    activities: [
      { kind: "form", summary: "Registered interest in modular ADU additions for SF landlords" }
    ]
  },
  // P2: Contractors (Irvine/Orange County)
  {
    name: "Tixan Construction",
    email: "info@tixanconstruction.com",
    phone: "949-354-2900",
    city: "Irvine",
    county: "Orange",
    jurisdiction: "Orange County",
    segment: "P2",
    source: "website",
    sourceDetail: "Become a Contractor Form",
    stage: "Active",
    type: "partner",
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: true, smsOptIn: true, consentSource: "contractor_opt_in", consentText: "Consent to installer onboarding updates.", consentIp: "127.0.0.1" },
    activities: [
      { kind: "form", summary: "Submitted GC network installer application" },
      { kind: "stage_change", summary: "Moved from applied to Active" }
    ]
  },
  {
    name: "Irvine Custom Builders",
    email: "info@irvinecustombuilders.com",
    phone: "949-415-8822",
    city: "Irvine",
    county: "Orange",
    jurisdiction: "Orange County",
    segment: "P2",
    source: "website",
    sourceDetail: "Become a Contractor Form",
    stage: "Terms sent",
    type: "partner",
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: true, smsOptIn: false, consentSource: "contractor_opt_in", consentText: "Consent to contractor communications.", consentIp: "127.0.0.1" },
    activities: [
      { kind: "form", summary: "Registered interest in modular site-prep subcontracting" },
      { kind: "stage_change", summary: "Moved from Vetting to Terms sent" }
    ]
  }
];

// Helper to calculate score based on central formula
function getCalculatedScore(lead) {
  let score = 0;
  const activityKinds = lead.activities.map(a => a.kind);
  
  if (activityKinds.includes('quiz')) score += 25;
  if (activityKinds.includes('consult')) score += 30;
  if (activityKinds.includes('financing_pdf')) score += 15;
  
  const visits = activityKinds.filter(k => k === 'visit').length;
  if (visits >= 2) score += 10;
  else if (visits === 1) score += 5;

  if (lead.lotSizeSqft) {
    if (lead.lotSizeSqft >= 5000) score += 10;
    else if (lead.lotSizeSqft >= 3500) score += 7;
  }

  if (lead.segment === 'H1' || lead.segment === 'H8') score += 10;
  else if (['H2', 'H3', 'H7'].includes(lead.segment)) score += 5;

  if (lead.ab1033Eligible) score += 5;

  return Math.min(Math.max(score, 0), 100);
}

async function seed() {
  console.log("Seeding real public partner leads...");

  for (const l of realPartners) {
    const finalScore = getCalculatedScore(l);
    
    const lead = await prisma.lead.create({
      data: {
        name: l.name,
        email: l.email,
        phone: l.phone,
        city: l.city,
        county: l.county,
        jurisdiction: l.jurisdiction,
        lotSizeSqft: null,
        segment: l.segment,
        source: l.source,
        sourceDetail: l.sourceDetail,
        stage: l.stage,
        type: l.type,
        estValue: null,
        ab1033Eligible: l.ab1033Eligible,
        score: finalScore,
        consent: {
          create: {
            emailOptIn: l.consent.emailOptIn,
            phoneOptIn: l.consent.phoneOptIn,
            smsOptIn: l.consent.smsOptIn,
            consentSource: l.consent.consentSource,
            consentText: l.consent.consentText,
            consentIp: l.consent.consentIp,
          }
        },
        activities: {
          create: l.activities.map(a => ({
            kind: a.kind,
            summary: a.summary,
          }))
        }
      }
    });

    // Enroll leads in sequence if applicable
    const seq = await prisma.sequence.findUnique({ where: { segment: l.segment } });
    if (seq && l.stage === 'New' && l.consent.emailOptIn) {
      await prisma.enrollmentState.create({
        data: {
          leadId: lead.id,
          sequenceId: seq.id,
          currentStep: 0,
          nextDueAt: new Date(),
          status: "active"
        }
      });
    }
  }

  console.log(`Successfully seeded ${realPartners.length} real B2B partner leads!`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
