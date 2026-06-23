require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const demoLeads = [
  // H1: Investor
  {
    name: "John Rodriguez",
    email: "john.rod@gmail.com",
    phone: "714-555-0192",
    city: "San Jose",
    county: "Santa Clara",
    jurisdiction: "San Jose",
    lotSizeSqft: 6200,
    segment: "H1",
    source: "quiz",
    sourceDetail: "Feasibility Quiz",
    stage: "New",
    type: "homeowner",
    estValue: 155000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: true, smsOptIn: true, consentSource: "quiz", consentText: "I consent to email, phone, and text communications.", consentIp: "192.168.1.5" },
    activities: [
      { kind: "quiz", summary: "Completed ADU Feasibility Quiz" },
      { kind: "visit", summary: "Visited pricing page" },
      { kind: "visit", summary: "Visited gallery" }
    ]
  },
  // H2: Multigenerational
  {
    name: "Sarah and Mark Chen",
    email: "schen99@yahoo.com",
    phone: "408-555-8831",
    city: "Santa Monica",
    county: "Los Angeles",
    jurisdiction: "Santa Monica",
    lotSizeSqft: 4800,
    segment: "H2",
    source: "google",
    sourceDetail: "Paid Search",
    stage: "Consult booked",
    type: "homeowner",
    estValue: 185000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: true, smsOptIn: false, consentSource: "consult_form", consentText: "Send me email updates and call me.", consentIp: "192.168.1.12" },
    activities: [
      { kind: "form", summary: "Submitted contact form" },
      { kind: "quiz", summary: "Completed ADU Feasibility Quiz" },
      { kind: "consult", summary: "Booked initial design consultation" }
    ]
  },
  // H3: Aging Parent (email only)
  {
    name: "Eleanor Vance",
    email: "eleanor.v@outlook.com",
    phone: "310-555-4029",
    city: "Los Angeles",
    county: "Los Angeles",
    jurisdiction: "Los Angeles",
    lotSizeSqft: 7500,
    segment: "H3",
    source: "direct_mail",
    sourceDetail: "June Postcard QR",
    stage: "Contacted",
    type: "homeowner",
    estValue: 160000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "qr_landing", consentText: "Receive monthly newsletter via email.", consentIp: "74.12.89.4" },
    activities: [
      { kind: "form", summary: "Opted into newsletter via postcard scan" },
      { kind: "email_sent", summary: "Sent Welcome Email: Aging in Place Guide" },
      { kind: "email_open", summary: "Opened Welcome Email" }
    ]
  },
  // H4: Remote Office
  {
    name: "David Miller",
    email: "david@millermedia.io",
    phone: "619-555-9012",
    city: "San Diego",
    county: "San Diego",
    jurisdiction: "San Diego",
    lotSizeSqft: 3200,
    segment: "H4",
    source: "instagram",
    sourceDetail: "Design Gallery Ad",
    stage: "In design",
    type: "homeowner",
    estValue: 120000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: true, smsOptIn: true, consentSource: "gallery_download", consentText: "Contact me regarding design specs.", consentIp: "68.4.120.43" },
    activities: [
      { kind: "form", summary: "Downloaded Design Catalog PDF" },
      { kind: "financing_pdf", summary: "Downloaded ADU Financing Guide" },
      { kind: "visit", summary: "Visited gallery" },
      { kind: "visit", summary: "Visited specifications sheet" },
      { kind: "consult", summary: "Completed site feasibility call" },
      { kind: "stage_change", summary: "Moved lead from Contacted to In design" }
    ]
  },
  // H7: Unpermitted Unit (legalization)
  {
    name: "Carlos Mendez",
    email: "carlos_m55@hotmail.com",
    phone: "714-555-7721",
    city: "Orange County",
    county: "Orange",
    jurisdiction: "Orange County",
    lotSizeSqft: 5800,
    segment: "H7",
    source: "blog",
    sourceDetail: "AB 2533 Article",
    stage: "Contacted",
    type: "homeowner",
    estValue: 90000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: true, smsOptIn: true, consentSource: "legalize_checklist", consentText: "Receive AB 2533 checklist and follow-up.", consentIp: "98.14.22.110" },
    activities: [
      { kind: "form", summary: "Downloaded AB 2533 Legalization Checklist" },
      { kind: "visit", summary: "Visited blog article twice" },
      { kind: "visit", summary: "Visited blog" }
    ]
  },
  // H8: Small developer
  {
    name: "Pacific Heights Properties",
    email: "deals@pacificheightsca.com",
    phone: "415-555-8900",
    city: "Unincorporated San Diego County",
    county: "San Diego",
    jurisdiction: "Unincorporated San Diego County",
    lotSizeSqft: 12500,
    segment: "H8",
    source: "referral",
    sourceDetail: "Agent Partner",
    stage: "New",
    type: "homeowner",
    estValue: 450000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "manual", consentText: "CAN-SPAM Cold Outreach (Referral Match)", consentIp: "127.0.0.1" },
    activities: [
      { kind: "form", summary: "Referred by Real Estate Agent partner" }
    ]
  },
  // Partner P1: Real estate agent
  {
    name: "Jessica Taylor (Compass)",
    email: "jessica.taylor@compass.com",
    phone: "310-555-7788",
    city: "Santa Monica",
    county: "Los Angeles",
    jurisdiction: "Santa Monica",
    segment: "P1",
    source: "outreach",
    sourceDetail: "LinkedIn Agent Campaign",
    stage: "Vetting",
    type: "partner",
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: true, smsOptIn: false, consentSource: "linkedin_inbox", consentText: "LinkedIn Opt-In", consentIp: "127.0.0.1" },
    activities: [
      { kind: "form", summary: "Submitted Referral Partner Application" }
    ]
  },
  // Partner P2: Contractor
  {
    name: "BuildWise Construction",
    email: "info@buildwiseca.com",
    phone: "949-555-3344",
    city: "Irvine",
    county: "Orange",
    jurisdiction: "Orange County",
    segment: "P2",
    source: "website",
    sourceDetail: "Become a Contractor Form",
    stage: "Active",
    type: "partner",
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: true, smsOptIn: true, consentSource: "contractor_form", consentText: "Become a certified installer consent.", consentIp: "172.56.21.90" },
    activities: [
      { kind: "form", summary: "Submitted Contractor Network Application" },
      { kind: "stage_change", summary: "Moved from Applied to Vetting" },
      { kind: "stage_change", summary: "Moved from Vetting to Terms sent" },
      { kind: "stage_change", summary: "Moved from Terms sent to Active" }
    ]
  },
  // Homeowner with NO Consent (suppressed/unsubscribed)
  {
    name: "Robert Downey",
    email: "robert.d@gmail.com",
    phone: "213-555-6677",
    city: "Los Angeles",
    county: "Los Angeles",
    jurisdiction: "Los Angeles",
    lotSizeSqft: 5000,
    segment: "H1",
    source: "quiz",
    sourceDetail: "Feasibility Quiz",
    stage: "Contacted",
    type: "homeowner",
    estValue: 140000,
    ab1033Eligible: false,
    consent: { emailOptIn: false, phoneOptIn: false, smsOptIn: false, consentSource: "quiz", consentText: "Unsubscribed from all communications.", consentIp: "192.168.1.44" },
    activities: [
      { kind: "quiz", summary: "Completed ADU Feasibility Quiz" },
      { kind: "email_sent", summary: "Sent Sequence Step 1 Email" },
      { kind: "email_reply", summary: "Replied: Stop sending emails" },
      { kind: "stage_change", summary: "Lead unsubscribed. Adding to suppression list." }
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
  console.log("Seeding demo leads...");

  // Delete existing leads
  await prisma.lead.deleteMany();
  console.log("Cleared existing leads.");

  for (const l of demoLeads) {
    const finalScore = getCalculatedScore(l);
    
    const lead = await prisma.lead.create({
      data: {
        name: l.name,
        email: l.email,
        phone: l.phone,
        city: l.city,
        county: l.county,
        jurisdiction: l.jurisdiction,
        lotSizeSqft: l.lotSizeSqft,
        segment: l.segment,
        source: l.source,
        sourceDetail: l.sourceDetail,
        stage: l.stage,
        type: l.type,
        estValue: l.estValue,
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

    // Also add to suppressions if unsubscribed
    if (!l.consent.emailOptIn) {
      await prisma.suppression.upsert({
        where: { value: l.email },
        update: { reason: "unsubscribed" },
        create: { value: l.email, reason: "unsubscribed" }
      });
    }

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

  console.log("Successfully seeded 9 high-fidelity demo leads!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
