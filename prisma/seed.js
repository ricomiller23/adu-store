require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


async function main() {
  console.log("Seeding database...");

  // 1. Seed Jurisdictions
  const jurisdictions = [
    { name: "San Jose", ab1033OptIn: true, notes: "First city in CA to adopt AB 1033 condo conversion rules." },
    { name: "Santa Monica", ab1033OptIn: true, notes: "Adopted AB 1033 condo conversion rule in 2024." },
    { name: "Unincorporated San Diego County", ab1033OptIn: true, notes: "Adopted AB 1033 condo conversion rule in late 2025." },
    { name: "Los Angeles", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
    { name: "Orange County", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
    { name: "San Diego", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  ];

  for (const j of jurisdictions) {
    await prisma.jurisdiction.upsert({
      where: { name: j.name },
      update: { ab1033OptIn: j.ab1033OptIn, notes: j.notes },
      create: j,
    });
  }
  console.log("Jurisdictions seeded.");

  // 2. Seed Nurture Sequences
  // Investor Sequence (H1)
  const investorSeq = await prisma.sequence.upsert({
    where: { segment: "H1" },
    update: { name: "Rental Investor Sequence" },
    create: {
      name: "Rental Investor Sequence",
      segment: "H1",
    },
  });

  const investorSteps = [
    {
      dayOffset: 0,
      channel: "email",
      subject: "Maximize Your Lot: The 2026 California ADU Cash Flow Blueprint",
      bodyTemplate: `Hi {{name}},

Renting out an ADU is one of the strongest passive income engines in California today. With sweeping legislative updates in 2026, it is now easier than ever to build.

Key Financial Tailwinds:
1. No Owner-Occupancy Requirement (AB 976): You can permanently rent out BOTH the main house and the ADU, turning your lot into a pure multi-unit investment.
2. Property Value Boost: Appraisers recognize ADUs as separate living units, increasing total property resale value by up to 35% to 50% on average.
3. Tax Efficiency: In California, building an ADU triggers a separate, minor reassessment of the new structure only. Your primary home's original Prop 13 tax base remains intact!

Let's discuss how we can turn your backyard into a cash-flowing asset. 

Best regards,
The ADU Store Team
info@TheADUStore.com | 714-485-9914`
    },
    {
      dayOffset: 3,
      channel: "email",
      subject: "Is Your Lot Eligible for the AB 1033 Condo Sale Loophole?",
      bodyTemplate: `Hi {{name}},

Did you know that in selected California cities, you can now sell an ADU separately from the main home as a condo? 

This is thanks to AB 1033, which allows cities to opt-in to separate condo conversions. In opted-in areas like {{city}} (or other early adopters like San Jose and Santa Monica), this unlocks a massive build-to-sell exit strategy.

If your jurisdiction has opted in, you could build a modular ADU with fixed construction pricing and sell it independently for immediate liquidity, or keep it as a high-yield rental.

If you would like to run a feasibility report on your address, reply to this email or give us a call.

Best,
The ADU Store Team
info@TheADUStore.com | 714-485-9914`
    },
    {
      dayOffset: 7,
      channel: "email",
      subject: "Modular vs. Stick-Built: Speed and Price Certainty",
      bodyTemplate: `Hi {{name}},

When building an ADU, the two biggest risks are project delays and budget overruns. Traditional "stick-built" backyard construction frequently suffers from both.

At The ADU Store, we build our units in a state-of-the-art facility using modular manufacturing:
- Price Certainty: Fixed factory pricing means no surprise change-orders.
- Speed: Ready for delivery in weeks, minimizing on-site noise and labor delays.
- Quality: Built to exact structural standards, fully energy-efficient and solar-ready.

We also have pre-approved plans (AB 434) that speed up local permitting timelines. 

Let's get started on a site plan. Reply here to schedule a consult.

Best,
The ADU Store Team
info@TheADUStore.com | 714-485-9914`
    }
  ];

  for (const step of investorSteps) {
    await prisma.sequenceStep.upsert({
      where: {
        sequenceId_dayOffset: {
          sequenceId: investorSeq.id,
          dayOffset: step.dayOffset,
        }
      },
      update: {
        subject: step.subject,
        bodyTemplate: step.bodyTemplate,
      },
      create: {
        sequenceId: investorSeq.id,
        dayOffset: step.dayOffset,
        channel: step.channel,
        subject: step.subject,
        bodyTemplate: step.bodyTemplate,
      }
    });
  }

  // Multigenerational Family Sequence (H2)
  const familySeq = await prisma.sequence.upsert({
    where: { segment: "H2" },
    update: { name: "Multigenerational Family Sequence" },
    create: {
      name: "Multigenerational Family Sequence",
      segment: "H2",
    },
  });

  const familySteps = [
    {
      dayOffset: 0,
      channel: "email",
      subject: "Keeping Family Close: The Modern Multigenerational ADU Guide",
      bodyTemplate: `Hi {{name}},

Building an ADU is a beautiful way to keep your family close while maintaining distinct privacy and independence.

An accessory dwelling unit offers:
- Independent Living: Separate entryways, full kitchens, and private amenities.
- Aging in Place: Accessible, single-story layouts that are safer and more comfortable for aging parents than expensive, institutional senior care facilities.
- Estate Planning: A lasting asset that builds long-term equity and legacy value on your family property.

We design our ADUs to feel like warm, high-quality, permanent homes. 

Let's discuss design layouts that would fit your backyard.

Warmly,
The ADU Store Team
info@TheADUStore.com | 714-485-9914`
    },
    {
      dayOffset: 4,
      channel: "email",
      subject: "ADU vs. Assisted Living: The Real Numbers",
      bodyTemplate: `Hi {{name}},

Assisted living and nursing home facilities in California can easily cost between $5,000 and $9,000+ per month. That is a substantial, recurring wealth drain.

An ADU is a one-time investment that remains in your family's control:
- Massive Savings: Eliminates monthly rent/care facility fees.
- Real Estate Equity: Increases the market value of your property by 30% or more.
- Proximity: Enables family members to assist with daily needs, keeping loved ones near.

Our modular units are built to the highest accessibility and efficiency standards. We can customize entryways and bathrooms for ultimate safety.

Reply to schedule a custom walkthrough.

Warmly,
The ADU Store Team
info@TheADUStore.com | 714-485-9914`
    }
  ];

  for (const step of familySteps) {
    await prisma.sequenceStep.upsert({
      where: {
        sequenceId_dayOffset: {
          sequenceId: familySeq.id,
          dayOffset: step.dayOffset,
        }
      },
      update: {
        subject: step.subject,
        bodyTemplate: step.bodyTemplate,
      },
      create: {
        sequenceId: familySeq.id,
        dayOffset: step.dayOffset,
        channel: step.channel,
        subject: step.subject,
        bodyTemplate: step.bodyTemplate,
      }
    });
  }

  // Partner / Contractor Sequence (P2)
  const partnerSeq = await prisma.sequence.upsert({
    where: { segment: "P2" },
    update: { name: "Contractor Onboarding Sequence" },
    create: {
      name: "Contractor Onboarding Sequence",
      segment: "P2",
    },
  });

  const partnerSteps = [
    {
      dayOffset: 0,
      channel: "email",
      subject: "Welcome to The ADU Store Builder & Installer Network",
      bodyTemplate: `Hi {{name}},

Thank you for your interest in joining The ADU Store network of certified installers and general contractors.

Why partners choose to work with us:
- Consistent Project Flow: We handle marketing, lead generation, feasibility, and design. You focus on site prep, foundation, and final installations.
- Predictable Modular Installs: Our factory-built modules arrive fully finished, reducing on-site build times and minimizing risk.
- Fast Turnaround: Get paid quickly upon successful installation stages.

We are currently reviewing your network application. A partnerships representative will reach out shortly.

Best,
The ADU Store Network
info@TheADUStore.com | 714-485-9914`
    }
  ];

  for (const step of partnerSteps) {
    await prisma.sequenceStep.upsert({
      where: {
        sequenceId_dayOffset: {
          sequenceId: partnerSeq.id,
          dayOffset: step.dayOffset,
        }
      },
      update: {
        subject: step.subject,
        bodyTemplate: step.bodyTemplate,
      },
      create: {
        sequenceId: partnerSeq.id,
        dayOffset: step.dayOffset,
        channel: step.channel,
        subject: step.subject,
        bodyTemplate: step.bodyTemplate,
      }
    });
  }

  console.log("Sequences and steps seeded.");
  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
