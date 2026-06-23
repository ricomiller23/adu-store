require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const companyFooter = `
Best regards,
The ADU Store Team
info@TheADUStore.com | 714-485-9914
${process.env.PHYSICAL_ADDRESS || "123 Modular Way, Sacramento, CA 95814"}
If you no longer wish to receive these emails, you can unsubscribe instantly by replying with 'stop' or clicking the unsubscribe link in this email.`;

async function main() {
  console.log("Seeding database jurisdictions & sequences...");

  // 1. Seed Jurisdictions
  const jurisdictions = [
    { name: "San Jose", ab1033OptIn: true, notes: "First city in CA to adopt AB 1033 condo conversion rules." },
    { name: "Santa Monica", ab1033OptIn: true, notes: "Adopted AB 1033 condo conversion rule in 2024." },
    { name: "Unincorporated San Diego County", ab1033OptIn: true, notes: "Adopted AB 1033 condo conversion rule in late 2025." },
    { name: "Los Angeles", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
    { name: "Orange County", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
    { name: "San Diego", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
    { name: "Sacramento", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
    { name: "San Francisco", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  ];

  for (const j of jurisdictions) {
    await prisma.jurisdiction.upsert({
      where: { name: j.name },
      update: { ab1033OptIn: j.ab1033OptIn, notes: j.notes },
      create: j,
    });
  }
  console.log("Jurisdictions seeded.");

  // 2. Define sequences and steps for H1 - H9 & P1 - P4
  const sequencesData = [
    {
      segment: "H1",
      name: "Rental Investor Sequence",
      steps: [
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
${companyFooter}`
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
${companyFooter}`
        }
      ]
    },
    {
      segment: "H2",
      name: "Multigenerational Family Sequence",
      steps: [
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
${companyFooter}`
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
${companyFooter}`
        }
      ]
    },
    {
      segment: "H3",
      name: "Aging-in-Place / Caregiver Sequence",
      steps: [
        {
          dayOffset: 0,
          channel: "email",
          subject: "Designing a Safe Haven: Accessible Single-Story Living Spaces",
          bodyTemplate: `Hi {{name}},

As our loved ones age, their safety and proximity become our highest priorities. An ADU offers a safe, accessible, single-story living space allowing elderly parents to stay near family instead of moving to costly senior facilities.

We focus on critical accessibility features:
- Zero-step entry thresholds
- Wider doorways and hallways for easy mobility
- Custom walk-in curbless showers and safety grab bars
- Slip-resistant flooring and smart home automation

Let's protect your family's comfort and dignity. Reply to schedule a safety-focused layout review.
${companyFooter}`
        },
        {
          dayOffset: 4,
          channel: "email",
          subject: "Housing a Dedicated Caregiver on Your Property",
          bodyTemplate: `Hi {{name}},

Finding and keeping quality care for aging relatives is much easier when you can offer dedicated, private housing on-site.

An ADU provides the perfect balance:
- Professional care is just a few steps away in your backyard.
- Caregivers enjoy their own private living space, kitchen, and bathroom.
- Substantially lower costs compared to full-time nursing home care.

Let's explore our custom detached plans designed specifically for care and comfort.
${companyFooter}`
        }
      ]
    },
    {
      segment: "H4",
      name: "Remote Worker / Studio Sequence",
      steps: [
        {
          dayOffset: 0,
          channel: "email",
          subject: "Upgrade Your WFH: A Custom Backyard Office Studio",
          bodyTemplate: `Hi {{name}},

Working from home shouldn't mean sharing your kitchen table or living room with your Zoom meetings. A detached backyard office/studio ADU is the ultimate workspace upgrade.

Our quiet office ADUs feature:
- Complete sound isolation from the main house
- Abundant natural light and energy-efficient climate control
- Dedicated electrical and high-speed data wiring
- A professional backdrop for client calls and video sessions

Reclaim your home's living spaces and design a workspace that inspires productivity.
${companyFooter}`
        },
        {
          dayOffset: 3,
          channel: "email",
          subject: "Tax Advantages and Prop 13 Rules for ADU Workspace",
          bodyTemplate: `Hi {{name}},

Building a detached workspace ADU is not only great for focus, it's also highly tax-efficient.

Under California's tax rules:
- Building an ADU triggers a reassessment of the new structure only.
- Your primary home's original Prop 13 tax base remains completely untouched.
- You may also qualify for home office tax write-offs for the new detached business space.

Let's design a studio that fits your yard and your budget.
${companyFooter}`
        }
      ]
    },
    {
      segment: "H5",
      name: "Empty-Nester Downsizing Sequence",
      steps: [
        {
          dayOffset: 0,
          channel: "email",
          subject: "The Reverse Downsize: Move to the ADU, Rent the Main Home",
          bodyTemplate: `Hi {{name}},

If your main house has empty bedrooms, you might be sitting on a goldmine. The "reverse downsize" is a smart financial strategy popular among California empty-nesters:

How it works:
1. Build a modern, single-story modular ADU designed to your taste.
2. Move into the new, low-maintenance ADU.
3. Rent out your larger primary home for premium rental income!

This gives you passive income to fund retirement, downsized maintenance, and keeps you on the property you love.
${companyFooter}`
        }
      ]
    },
    {
      segment: "H6",
      name: "Equity-Rich Owner Sequence",
      steps: [
        {
          dayOffset: 0,
          channel: "email",
          subject: "Unlock Your Home Equity to Build a Cash-Flowing ADU",
          bodyTemplate: `Hi {{name}},

With home equity at record highs in California, you can fund an ADU construction project with zero out-of-pocket costs.

Why use equity to build:
- Leverage low-interest Home Equity Lines of Credit (HELOC) or construction loans.
- Projected ADU rental income can often count toward qualifying for the loan.
- The monthly ADU rent can cover the loan payment and generate immediate net cash flow.

Let's connect you with our vetted ADU financing partners to see what you qualify for.
${companyFooter}`
        }
      ]
    },
    {
      segment: "H7",
      name: "Unpermitted Unit Legalization Sequence",
      steps: [
        {
          dayOffset: 0,
          channel: "email",
          subject: "AB 2533: How to Legalize Your Backyard Unit Without Penalty",
          bodyTemplate: `Hi {{name}},

Do you have an unpermitted garage conversion or backyard unit? California's new AB 2533 law gives homeowners a clear, safe amnesty pathway to legalize pre-2020 structures.

Under AB 2533:
- Local cities cannot deny your application based on minor zoning violations.
- Legalization is performed via a basic health-and-safety checklist rather than strict current building codes.
- Once legalized, you convert a potential liability into a safe, value-adding, refinanceable asset.

Let us help you navigate the safety checklist and legalize your unit.
${companyFooter}`
        }
      ]
    },
    {
      segment: "H8",
      name: "Multifamily Developer Sequence",
      steps: [
        {
          dayOffset: 0,
          channel: "email",
          subject: "SB 1211: Up to 8 Detached ADUs on Multifamily Lots",
          bodyTemplate: `Hi {{name}},

California multifamily property owners are leveraging SB 1211 to build up to 8 detached ADUs on their lots without trigger-happy zoning reviews.

Maximize your portfolio returns:
- Install multiple pre-engineered modular ADUs in record time.
- Rent BOTH the existing building and new ADUs with no owner-occupancy rules.
- Benefit from volume pricing discounts on our manufacturing runs.

Reply to this email to schedule a portfolio feasibility assessment.
${companyFooter}`
        }
      ]
    },
    {
      segment: "H9",
      name: "Recent Buyer Sequence",
      steps: [
        {
          dayOffset: 0,
          channel: "email",
          subject: "Maximize Your New Lot: Cheaper Than Moving",
          bodyTemplate: `Hi {{name}},

Congratulations on your recent home purchase! If your new property has a large yard, you have the perfect canvas to add a modular ADU.

Why build now:
- It is significantly cheaper to expand usable space on your current lot than to pay transaction fees and premiums to move to a larger home later.
- Boost your property's resale value by up to 35% to 50% immediately.
- Use modular factory construction to complete the build with minimal backyard noise and disruption.

Let's check the municipal setbacks for your address and find your build envelope.
${companyFooter}`
        }
      ]
    },
    {
      segment: "P1",
      name: "Real Estate Agent Affiliate Sequence",
      steps: [
        {
          dayOffset: 0,
          channel: "email",
          subject: "Unlock New Client Value and Earn ADU Referral Commissions",
          bodyTemplate: `Hi {{name}},

As a real estate agent, helping clients identify ADU potential can make or break a listing or purchase deal. 

By partnering with The ADU Store:
- Access fast, free lot feasibility reports for your clients.
- Offer clients modular ADU options with fixed, predictable pricing.
- Earn competitive referral commissions on every buyer client who builds with us.

Join our upcoming agent webinar to learn how to pitch ADU value to your listings.
${companyFooter}`
        }
      ]
    },
    {
      segment: "P2",
      name: "Contractor Network Sequence",
      steps: [
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
${companyFooter}`
        }
      ]
    },
    {
      segment: "P3",
      name: "Mortgage Broker Sequence",
      steps: [
        {
          dayOffset: 0,
          channel: "email",
          subject: "Financing ADU Builds: Vetted Lending Partnerships",
          bodyTemplate: `Hi {{name}},

Many of our ADU buyers need specialized construction loans, HELOCs, or renovation financing. We are looking to establish local mortgage partnerships to build a two-way referral loop.

Partnering benefits:
- We refer buyers searching for financing directly to your lending team.
- Offer client-focused ADU products where projected rents count toward debt-to-income qualification.
- Fast site plan turnarounds to support appraisals and loan underwriting.

Let's discuss setting up a mutual referral channel.
${companyFooter}`
        }
      ]
    },
    {
      segment: "P4",
      name: "Property Manager / Retail Affiliate Sequence",
      steps: [
        {
          dayOffset: 0,
          channel: "email",
          subject: "Expand Your Under-Management Portfolio with Backyard ADUs",
          bodyTemplate: `Hi {{name}},

Property managers in California are driving massive revenue by helping their landlord clients add modular ADUs to existing rental lots.

How we partner:
- You introduce ADU options to your existing single-family rental owners.
- We build and install the modular ADU.
- You manage the newly added unit, instantly boosting your recurring property management fees.
- Plus, earn direct affiliate commissions on the ADU sale itself!

Let's review marketing materials you can share with your property owners.
${companyFooter}`
        }
      ]
    }
  ];

  for (const seq of sequencesData) {
    const sequence = await prisma.sequence.upsert({
      where: { segment: seq.segment },
      update: { name: seq.name },
      create: {
        name: seq.name,
        segment: seq.segment,
      },
    });

    for (const step of seq.steps) {
      await prisma.sequenceStep.upsert({
        where: {
          sequenceId_dayOffset: {
            sequenceId: sequence.id,
            dayOffset: step.dayOffset,
          }
        },
        update: {
          subject: step.subject,
          bodyTemplate: step.bodyTemplate,
        },
        create: {
          sequenceId: sequence.id,
          dayOffset: step.dayOffset,
          channel: step.channel,
          subject: step.subject,
          bodyTemplate: step.bodyTemplate,
        }
      });
    }
  }

  console.log("Sequences and steps seeded for all 13 segments.");
  console.log("Database sequences seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
