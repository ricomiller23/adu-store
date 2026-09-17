require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SEGMENT_HOOKS = {
  H1: "Under current law (AB 976) you can rent it out for income without living on-site — so the real question is payback, and the numbers in {{city}} are usually better than people expect.",
  H2: "It's the option most families land on when they want parents or adult kids close — private space, without the cost of moving or a care facility.",
  H3: "A lot of families use one to keep a parent nearby and safe — often for far less than assisted living. No rush; happy to just share the options.",
  H4: "A detached office or studio is the fastest, lowest-friction build — many are permitted and installed in months, not years.",
  H5: "Some owners live in the ADU and rent or sell the main house — a way to unlock the home's value without leaving the neighborhood.",
  H6: "There are financing paths that let you build against your equity, so the project can pay for itself over time rather than out of pocket.",
  H7: "If that older unit was built without permits, AB 2533 may let you legalize it on a safety checklist — turning a liability into a refinanceable, rentable asset.",
  H8: "On a multifamily lot you may be able to add several detached units (SB 1211) — the build-to-rent math is worth running properly.",
  H9: "No rush at all — but with a lot your size it's worth knowing your options now so you can plan around them."
};

const PARTNER_HOOKS = {
  P1: "an ADU is often the thing that wins a listing or closes a hesitant buyer on a big lot.",
  P2: "we have steady modular install work and could use a reliable local crew.",
  P3: "ADU financing is a natural add-on to your pipeline — we can send referrals both ways.",
  P4: "more rentable units on the properties you manage means more doors under management."
};

// Warm homeowner nurture sequences (H1-H9)
const HOMEOWNER_SEGMENTS = [
  { code: 'H1', name: 'Rental Investor Sequence' },
  { code: 'H2', name: 'Multigenerational Family Sequence' },
  { code: 'H3', name: 'Aging Parent / Caregiver Sequence' },
  { code: 'H4', name: 'Office / Studio Sequence' },
  { code: 'H5', name: 'Empty-Nester Downsize Sequence' },
  { code: 'H6', name: 'Equity-Rich Owner Sequence' },
  { code: 'H7', name: 'Unpermitted Unit Legalization Sequence' },
  { code: 'H8', name: 'Multifamily / Developer Sequence' },
  { code: 'H9', name: 'Recent Buyer / Large Lot Sequence' },
];

const PARTNER_SEGMENTS = [
  { code: 'P1', name: 'Real Estate Agent Affiliate Track' },
  { code: 'P2', name: 'Contractor / Installer Network Track' },
  { code: 'P3', name: 'Mortgage Broker Lending Track' },
  { code: 'P4', name: 'Property Manager Portfolio Track' },
];

function getHomeownerSteps(segmentCode) {
  const hook = SEGMENT_HOOKS[segmentCode];

  return [
    {
      dayOffset: 0,
      channel: 'email',
      subject: 'Your ADU result for {{city}}',
      bodyTemplate: `Hi {{firstName}},

Thanks for checking your lot on {{brand}}. Here's the short version:

Based on what you told us, your property in {{city}} looks like it can support {{lotSizeText}}. ${hook}

I put together a quick feasibility read for your specific lot — what fits, the current {{city}} rules that apply, and a ballpark on cost and timeline. Want me to walk you through it on a 15-minute call? No pressure and no obligation — just a straight answer so you can decide if it's worth pursuing.

Grab a time here: {{bookingLink}}
Or just reply and tell me what you're hoping the ADU does for you.

{{repName}}
{{brand}}

{{companyAddress}} · Unsubscribe: {{unsubscribeLink}}`
    },
    {
      dayOffset: 2,
      channel: 'email',
      subject: 'One thing most {{city}} owners miss',
      bodyTemplate: `Hi {{firstName}},

Following up with the one thing that trips people up on ADUs in {{city}}: the rules changed a lot recently, and what your lot could do two years ago isn't what it can do today.

That's usually the difference between an ADU that pencils out and one that doesn't — and it's exactly what I'd cover on a quick call. We handle design, permits, the factory build, delivery, and install, so you get one price and one process instead of chasing five contractors.

Want me to run your numbers? {{bookingLink}}

{{repName}}, {{brand}}
{{companyAddress}} · Unsubscribe: {{unsubscribeLink}}`
    },
    {
      dayOffset: 5,
      channel: 'email',
      subject: 'Still thinking about the ADU?',
      bodyTemplate: `Hi {{firstName}},

Totally normal to sit on this — it's a real decision. The two things people ask me most:

"What does it actually cost?" — It depends on size and site, which is why the 15-minute call is useful; I can give you a real range for your lot, not a brochure number.

"How long does it take?" — Modular is faster and more predictable than site-built because most of it happens in the factory.

If it's helpful, here's a time: {{bookingLink}}. If now's not right, just tell me roughly when and I'll check back then.

{{repName}}, {{brand}}
{{companyAddress}} · Unsubscribe: {{unsubscribeLink}}`
    },
    {
      dayOffset: 12,
      channel: 'email',
      subject: 'Should I close your file?',
      bodyTemplate: `Hi {{firstName}},

I don't want to clutter your inbox, so this is my last note for now — unless you tell me otherwise.

If an ADU in {{city}} is still on your mind, even months out, reply "keep me posted" and I'll only send the occasional update when the rules or costs change in a way that matters to you. If not, no hard feelings and I'll close your file.

Either way, thanks for considering {{brand}}.

{{repName}}
{{companyAddress}} · Unsubscribe: {{unsubscribeLink}}`
    }
  ];
}

function getPartnerSteps(segmentCode) {
  const hook = PARTNER_HOOKS[segmentCode];

  return [
    {
      dayOffset: 0,
      channel: 'email',
      subject: 'Referral partnership for {{city}} ADUs',
      bodyTemplate: `Hi {{firstName}},

I work with {{brand}} — we design and build ADUs across California, factory-built with fixed pricing. I'm reaching out because ${hook}

We pay referral partners on closed projects and handle everything end to end, so your client gets a clean process and you get a differentiator (and a check) without doing the work.

Open to a quick call to see if it's a fit? {{bookingLink}}

{{repName}}, {{brand}}
{{companyAddress}} · Unsubscribe: {{unsubscribeLink}}`
    },
    {
      dayOffset: 4,
      channel: 'email',
      subject: 'Quick follow-up: ADU referral partnership for {{city}}',
      bodyTemplate: `Hi {{firstName}},

Touching base on my previous note regarding modular ADU referral partnerships in {{city}}.

Our pre-engineered modular units streamline permitting and installation, giving your clients fixed pricing with zero construction surprises.

Let me know if you have 10 minutes this week to connect: {{bookingLink}}

{{repName}}, {{brand}}
{{companyAddress}} · Unsubscribe: {{unsubscribeLink}}`
    }
  ];
}

const COLD_STEPS = [
  {
    dayOffset: 0,
    channel: 'email',
    subject: 'ADUs are now allowed in {{city}}',
    bodyTemplate: `Hi {{firstName}},

California's ADU laws changed — and most single-family lots in {{city}} can now add a backyard home (an "ADU") for rental income, family, or resale value. Whether yours qualifies depends on your specific lot.

We built a free 60-second check that tells you what your property can support and which new rules apply to it — no cost, no obligation:

{{quizLink}}

{{repName}}, {{brand}}
{{companyAddress}} · Not interested? Unsubscribe: {{unsubscribeLink}}`
  },
  {
    dayOffset: 3,
    channel: 'email',
    subject: 'What a {{city}} ADU can earn',
    bodyTemplate: `Hi {{firstName}},

Quick follow-up. Why people in {{city}} are looking at ADUs right now:

• Rent it out — you can now rent both the ADU and your main home (AB 976)
• House family — parents or adult kids, close but private
• Add value — a permitted unit adds real, appraisable square footage

Two minutes tells you what your lot can do: {{quizLink}}

{{repName}}, {{brand}}
{{companyAddress}} · Unsubscribe: {{unsubscribeLink}}`
  },
  {
    dayOffset: 7,
    channel: 'email',
    subject: 'Last note about your {{city}} lot',
    bodyTemplate: `Hi {{firstName}},

I'll leave it here so I'm not cluttering your inbox. If you've ever wondered whether your backyard could pay for itself, the free check is the easiest way to find out — specific to your property, under a minute:

{{quizLink}}

If it's not for you, no problem at all.

{{repName}}, {{brand}}
{{companyAddress}} · Unsubscribe: {{unsubscribeLink}}`
  }
];

async function main() {
  console.log("=== Seeding The ADU Store Outbound Email Kit ===");

  // 1. Seed Homeowner Sequences (H1-H9)
  for (const h of HOMEOWNER_SEGMENTS) {
    const seq = await prisma.sequence.upsert({
      where: { segment: h.code },
      update: { name: h.name },
      create: { segment: h.code, name: h.name }
    });

    const steps = getHomeownerSteps(h.code);
    const validOffsets = steps.map(s => s.dayOffset);

    // Delete obsolete steps that don't match our new schedule
    await prisma.sequenceStep.deleteMany({
      where: {
        sequenceId: seq.id,
        dayOffset: { notIn: validOffsets }
      }
    });

    for (const step of steps) {
      await prisma.sequenceStep.upsert({
        where: {
          sequenceId_dayOffset: {
            sequenceId: seq.id,
            dayOffset: step.dayOffset
          }
        },
        update: {
          channel: step.channel,
          subject: step.subject,
          bodyTemplate: step.bodyTemplate
        },
        create: {
          sequenceId: seq.id,
          dayOffset: step.dayOffset,
          channel: step.channel,
          subject: step.subject,
          bodyTemplate: step.bodyTemplate
        }
      });
    }
    console.log(`✓ Seeded ${h.code} (${h.name}) with ${steps.length} steps`);
  }

  // 2. Seed Partner Sequences (P1-P4)
  for (const p of PARTNER_SEGMENTS) {
    const seq = await prisma.sequence.upsert({
      where: { segment: p.code },
      update: { name: p.name },
      create: { segment: p.code, name: p.name }
    });

    const steps = getPartnerSteps(p.code);
    const validOffsets = steps.map(s => s.dayOffset);

    await prisma.sequenceStep.deleteMany({
      where: {
        sequenceId: seq.id,
        dayOffset: { notIn: validOffsets }
      }
    });

    for (const step of steps) {
      await prisma.sequenceStep.upsert({
        where: {
          sequenceId_dayOffset: {
            sequenceId: seq.id,
            dayOffset: step.dayOffset
          }
        },
        update: {
          channel: step.channel,
          subject: step.subject,
          bodyTemplate: step.bodyTemplate
        },
        create: {
          sequenceId: seq.id,
          dayOffset: step.dayOffset,
          channel: step.channel,
          subject: step.subject,
          bodyTemplate: step.bodyTemplate
        }
      });
    }
    console.log(`✓ Seeded ${p.code} (${p.name}) with ${steps.length} steps`);
  }

  // 3. Seed Cold Outreach Track (COLD)
  const coldSeq = await prisma.sequence.upsert({
    where: { segment: 'COLD' },
    update: { name: 'Cold Homeowner Outreach Track' },
    create: { segment: 'COLD', name: 'Cold Homeowner Outreach Track' }
  });

  const coldOffsets = COLD_STEPS.map(s => s.dayOffset);
  await prisma.sequenceStep.deleteMany({
    where: {
      sequenceId: coldSeq.id,
      dayOffset: { notIn: coldOffsets }
    }
  });

  for (const step of COLD_STEPS) {
    await prisma.sequenceStep.upsert({
      where: {
        sequenceId_dayOffset: {
          sequenceId: coldSeq.id,
          dayOffset: step.dayOffset
        }
      },
      update: {
        channel: step.channel,
        subject: step.subject,
        bodyTemplate: step.bodyTemplate
      },
      create: {
        sequenceId: coldSeq.id,
        dayOffset: step.dayOffset,
        channel: step.channel,
        subject: step.subject,
        bodyTemplate: step.bodyTemplate
      }
    });
  }
  console.log(`✓ Seeded COLD (Cold Homeowner Outreach Track) with ${COLD_STEPS.length} steps`);

  console.log("=== All Sequences & Email Kit Steps Successfully Seeded! ===");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
