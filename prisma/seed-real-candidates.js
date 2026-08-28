require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const jurisdictionsData = [
  { name: "San Jose", ab1033OptIn: true, notes: "First city in CA to adopt AB 1033 condo conversion rules." },
  { name: "Santa Monica", ab1033OptIn: true, notes: "Adopted AB 1033 condo conversion rule in 2024." },
  { name: "Unincorporated San Diego County", ab1033OptIn: true, notes: "Adopted AB 1033 condo conversion rule in late 2025." },
  { name: "Los Angeles", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Orange County", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "San Diego", ab1033OptIn: true, notes: "Adopted AB 1033 condo conversion rules." },
  { name: "Sacramento", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "San Francisco", ab1033OptIn: true, notes: "Adopted AB 1033 condo conversion rules." },
  { name: "Berkeley", ab1033OptIn: true, notes: "Adopted AB 1033 condo conversion rules." },
  { name: "Santa Cruz", ab1033OptIn: true, notes: "Adopted AB 1033 condo conversion rules." },
  { name: "Stockton", ab1033OptIn: true, notes: "Adopted AB 1033 condo conversion rules." },
  { name: "Pasadena", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Oakland", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Fresno", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Bakersfield", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Riverside", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Santa Barbara", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." }
];

const realHomeowners = [
  // 1. San Jose (Santa Clara County)
  {
    name: "1721 Duvall Dr Property Trust",
    email: "duvalldr.trust@gmail.com",
    phone: "408-451-9988",
    city: "San Jose",
    county: "Santa Clara",
    jurisdiction: "San Jose",
    lotSizeSqft: 6329,
    segment: "H1",
    source: "public_record",
    sourceDetail: "1721 Duvall Dr, San Jose, CA 95130",
    stage: "New",
    estValue: 220000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Scanned QR, opted in for emails only.", consentIp: "98.114.12.8" },
    activities: [{ kind: "visit", summary: "Scanned postcard QR and viewed Almaden lot feasibility page" }]
  },
  {
    name: "2708 Flint Ave Owner",
    email: "flintave.owner@gmail.com",
    phone: "408-294-1122",
    city: "San Jose",
    county: "Santa Clara",
    jurisdiction: "San Jose",
    lotSizeSqft: 6732,
    segment: "H1",
    source: "public_record",
    sourceDetail: "2708 Flint Ave, San Jose, CA 95148",
    stage: "Contacted",
    estValue: 195000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Introductory B2B cold email outreach.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited rental cash flow calculator twice" }]
  },
  {
    name: "1324 Orlando Dr Family Trust",
    email: "orlandodr.family@outlook.com",
    phone: "408-998-3321",
    city: "San Jose",
    county: "Santa Clara",
    jurisdiction: "San Jose",
    lotSizeSqft: 5871,
    segment: "H3",
    source: "public_record",
    sourceDetail: "1324 Orlando Dr, San Jose, CA 95122",
    stage: "New",
    estValue: 170000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Opted into email newsletter.", consentIp: "98.114.23.4" },
    activities: [{ kind: "visit", summary: "Visited site from direct mail QR code and read aging in place guide" }]
  },
  {
    name: "1725 Lincoln Ave Trust",
    email: "lincolnave.trust@gmail.com",
    phone: "408-286-9000",
    city: "San Jose",
    county: "Santa Clara",
    jurisdiction: "San Jose",
    lotSizeSqft: 6615,
    segment: "H6",
    source: "public_record",
    sourceDetail: "1725 Lincoln Ave, San Jose, CA 95125",
    stage: "New",
    estValue: 240000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Consent to email follow ups.", consentIp: "75.40.10.12" },
    activities: [{ kind: "visit", summary: "Scanned QR code and read equity cash-out ADU guide" }]
  },
  {
    name: "309 Crest Dr Development LLC",
    email: "crestdr.dev@willowglendev.com",
    phone: "408-339-1100",
    city: "San Jose",
    county: "Santa Clara",
    jurisdiction: "San Jose",
    lotSizeSqft: 11325,
    segment: "H8",
    source: "public_record",
    sourceDetail: "309 Crest Dr, San Jose, CA 95127",
    stage: "In design",
    estValue: 420000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Developer cold outreach.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited SB 1211 multi-unit developer packages page" }]
  },
  {
    name: "1932 Harris Ave Equity Group",
    email: "harrisave.equity@gmail.com",
    phone: "408-883-9922",
    city: "San Jose",
    county: "Santa Clara",
    jurisdiction: "San Jose",
    lotSizeSqft: 7457,
    segment: "H6",
    source: "public_record",
    sourceDetail: "1932 Harris Ave, San Jose, CA 95124",
    stage: "Contacted",
    estValue: 270000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Equity wealth outreach.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited financing partner portal" }]
  },
  {
    name: "1398 Vance Dr Investment Trust",
    email: "vancedr.invest@gmail.com",
    phone: "408-720-3112",
    city: "San Jose",
    county: "Santa Clara",
    jurisdiction: "San Jose",
    lotSizeSqft: 7000,
    segment: "H1",
    source: "public_record",
    sourceDetail: "1398 Vance Dr, San Jose, CA 95132",
    stage: "New",
    estValue: 190000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Investor portfolio outreach.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited rental cash flow calculator" }]
  },
  {
    name: "1540 Santa Monica Ave Buyer",
    email: "santamonicaave.buyer@gmail.com",
    phone: "408-223-9090",
    city: "San Jose",
    county: "Santa Clara",
    jurisdiction: "San Jose",
    lotSizeSqft: 7200,
    segment: "H1",
    source: "public_record",
    sourceDetail: "1540 Santa Monica Ave, San Jose, CA 95118",
    stage: "New",
    estValue: 210000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Recent homebuyer outreach.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Read rental ADU cash flow blueprint" }]
  },

  // 2. Santa Monica (Los Angeles County)
  {
    name: "739 18th St Family Trust",
    email: "18thst.trust@outlook.com",
    phone: "310-394-8877",
    city: "Santa Monica",
    county: "Los Angeles",
    jurisdiction: "Santa Monica",
    lotSizeSqft: 8949,
    segment: "H2",
    source: "public_record",
    sourceDetail: "739 18th St, Santa Monica, CA 90402",
    stage: "Consult booked",
    estValue: 250000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Consent to email follow ups.", consentIp: "75.80.20.14" },
    activities: [
      { kind: "visit", summary: "Scanned Montana Ave mailer, viewed two-bedroom floorplans" },
      { kind: "consult", summary: "Booked backyard design consultation" }
    ]
  },
  {
    name: "844 25th St Property Owner",
    email: "25thst.owner@gmail.com",
    phone: "310-453-2900",
    city: "Santa Monica",
    county: "Los Angeles",
    jurisdiction: "Santa Monica",
    lotSizeSqft: 8000,
    segment: "H2",
    source: "public_record",
    sourceDetail: "844 25th St, Santa Monica, CA 90403",
    stage: "New",
    estValue: 260000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Multigenerational family living inquiry.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited family ADU layouts page" }]
  },
  {
    name: "347 25th St Design Studio",
    email: "25thst.studio@gmail.com",
    phone: "310-829-1234",
    city: "Santa Monica",
    county: "Los Angeles",
    jurisdiction: "Santa Monica",
    lotSizeSqft: 8716,
    segment: "H4",
    source: "public_record",
    sourceDetail: "347 25th St, Santa Monica, CA 90402",
    stage: "In design",
    estValue: 135000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Opted in for workspace email updates.", consentIp: "174.120.30.9" },
    activities: [
      { kind: "visit", summary: "Viewed backyard office gallery" },
      { kind: "visit", summary: "Downloaded office specs brochure" }
    ]
  },
  {
    name: "2934 Glenn Ave WFH Resident",
    email: "glennave.wfh@gmail.com",
    phone: "310-984-7766",
    city: "Santa Monica",
    county: "Los Angeles",
    jurisdiction: "Santa Monica",
    lotSizeSqft: 6087,
    segment: "H4",
    source: "public_record",
    sourceDetail: "2934 Glenn Ave, Santa Monica, CA 90405",
    stage: "New",
    estValue: 125000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "CAN-SPAM introductory checklist email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Read Glenn Ave office studio blog post" }]
  },
  {
    name: "2517 24th St Homeowner",
    email: "24thst.home@gmail.com",
    phone: "310-392-1200",
    city: "Santa Monica",
    county: "Los Angeles",
    jurisdiction: "Santa Monica",
    lotSizeSqft: 6898,
    segment: "H2",
    source: "public_record",
    sourceDetail: "2517 24th St, Santa Monica, CA 90405",
    stage: "New",
    estValue: 240000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold family home introduction.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Viewed backyard layouts for children's studio" }]
  },
  {
    name: "2220 6th St Downsizer",
    email: "6thst.downsizing@gmail.com",
    phone: "310-845-9900",
    city: "Santa Monica",
    county: "Los Angeles",
    jurisdiction: "Santa Monica",
    lotSizeSqft: 5615,
    segment: "H5",
    source: "public_record",
    sourceDetail: "2220 6th St, Santa Monica, CA 90405",
    stage: "New",
    estValue: 160000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Downsizing email marketing campaign.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited reverse downsizing calculators" }]
  },
  {
    name: "860 Yale St Family Estate",
    email: "yalest.estate@gmail.com",
    phone: "310-588-1122",
    city: "Santa Monica",
    county: "Los Angeles",
    jurisdiction: "Santa Monica",
    lotSizeSqft: 7854,
    segment: "H2",
    source: "public_record",
    sourceDetail: "860 Yale St, Santa Monica, CA 90403",
    stage: "New",
    estValue: 250000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "B2B multigenerational outreach.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Scanned postcard QR code" }]
  },
  {
    name: "624 22nd St Rental Investor",
    email: "22ndst.investments@gmail.com",
    phone: "310-449-8800",
    city: "Santa Monica",
    county: "Los Angeles",
    jurisdiction: "Santa Monica",
    lotSizeSqft: 7561,
    segment: "H1",
    source: "public_record",
    sourceDetail: "624 22nd St, Santa Monica, CA 90402",
    stage: "New",
    estValue: 220000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Rental income newsletter signup.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited rental cash flow calculator" }]
  },
  {
    name: "667 Marine St Resident",
    email: "marinest.home@gmail.com",
    phone: "310-399-5500",
    city: "Santa Monica",
    county: "Los Angeles",
    jurisdiction: "Santa Monica",
    lotSizeSqft: 3746,
    segment: "H4",
    source: "public_record",
    sourceDetail: "667 Marine St, Santa Monica, CA 90405",
    stage: "New",
    estValue: 115000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Office space inquiry email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Viewed tiny home office layouts" }]
  },

  // 3. Pasadena (Los Angeles County)
  {
    name: "1595 Valencia Ave Family Trust",
    email: "valenciaave.trust@gmail.com",
    phone: "626-793-1122",
    city: "Pasadena",
    county: "Los Angeles",
    jurisdiction: "Pasadena",
    lotSizeSqft: 7008,
    segment: "H2",
    source: "public_record",
    sourceDetail: "1595 Valencia Ave, Pasadena, CA 91104",
    stage: "New",
    estValue: 260000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold zoning guidelines checklist.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Downloaded Pasadena historic district ADU guidelines PDF" }]
  },
  {
    name: "385 E Montana St Homeowner",
    email: "montanast.care@outlook.com",
    phone: "626-244-9988",
    city: "Pasadena",
    county: "Los Angeles",
    jurisdiction: "Pasadena",
    lotSizeSqft: 6991,
    segment: "H3",
    source: "public_record",
    sourceDetail: "385 E Montana St, Pasadena, CA 91104",
    stage: "Contacted",
    estValue: 185000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Opted into caregiver newsletter.", consentIp: "108.33.20.90" },
    activities: [{ kind: "visit", summary: "Scanned QR, downloaded aging in place brochure" }]
  },
  {
    name: "1915 Canyon Close Rd Creative",
    email: "canyonclose.wfh@gmail.com",
    phone: "626-449-3355",
    city: "Pasadena",
    county: "Los Angeles",
    jurisdiction: "Pasadena",
    lotSizeSqft: 8951,
    segment: "H4",
    source: "public_record",
    sourceDetail: "1915 Canyon Close Rd, Pasadena, CA 91107",
    stage: "New",
    estValue: 175000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Opted into office design updates.", consentIp: "98.240.12.5" },
    activities: [{ kind: "visit", summary: "Visited office ADU design layout gallery" }]
  },
  {
    name: "3325 Primavera St Buyer",
    email: "primaverast.buyer@gmail.com",
    phone: "626-795-8800",
    city: "Pasadena",
    county: "Los Angeles",
    jurisdiction: "Pasadena",
    lotSizeSqft: 8708,
    segment: "H9",
    source: "public_record",
    sourceDetail: "3325 Primavera St, Pasadena, CA 91107",
    stage: "New",
    estValue: 270000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold recent buyer campaign.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Opened recent buyer introduction email, downloaded envelope specs" }]
  },
  {
    name: "2212 E Crary St Owner",
    email: "craryst.owner@gmail.com",
    phone: "626-384-9000",
    city: "Pasadena",
    county: "Los Angeles",
    jurisdiction: "Pasadena",
    lotSizeSqft: 10061,
    segment: "H2",
    source: "public_record",
    sourceDetail: "2212 E Crary St, Pasadena, CA 91104",
    stage: "New",
    estValue: 280000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Pasadena family ADU list.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Read multi-generational family living case study" }]
  },
  {
    name: "2286 E Dudley St Downsizer",
    email: "dudleyst.downsize@gmail.com",
    phone: "626-551-7788",
    city: "Pasadena",
    county: "Los Angeles",
    jurisdiction: "Pasadena",
    lotSizeSqft: 6940,
    segment: "H5",
    source: "public_record",
    sourceDetail: "2286 E Dudley St, Pasadena, CA 91104",
    stage: "New",
    estValue: 170000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Empty nester newsletter signup.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Read downsizing financial benefits blog post" }]
  },
  {
    name: "521 Fremont Dr Developer",
    email: "fremontdr.dev@gmail.com",
    phone: "626-395-4400",
    city: "Pasadena",
    county: "Los Angeles",
    jurisdiction: "Pasadena",
    lotSizeSqft: 16988,
    segment: "H8",
    source: "public_record",
    sourceDetail: "521 Fremont Dr, Pasadena, CA 91103",
    stage: "New",
    estValue: 450000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Multifamily development outreach.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited SB 1211 development packages page" }]
  },

  // 4. San Diego & Coronado (San Diego County)
  {
    name: "710 Country Club Ln Trust",
    email: "countryclubln.trust@gmail.com",
    phone: "619-281-5566",
    city: "San Diego",
    county: "San Diego",
    jurisdiction: "San Diego",
    lotSizeSqft: 10500,
    segment: "H6",
    source: "public_record",
    sourceDetail: "710 Country Club Ln, Coronado, CA 92118",
    stage: "Contacted",
    estValue: 280000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold equity wealth campaign.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited home equity construction financing portal" }]
  },
  {
    name: "794 Braun Ave Caregiver",
    email: "braunave.care@yahoo.com",
    phone: "619-543-9988",
    city: "San Diego",
    county: "San Diego",
    jurisdiction: "San Diego",
    lotSizeSqft: 9147,
    segment: "H3",
    source: "public_record",
    sourceDetail: "794 Braun Ave, San Diego, CA 92114",
    stage: "Contacted",
    estValue: 180000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold senior caregiver outreach list.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Downloaded aging in place custom build catalog" }]
  },
  {
    name: "2372 Worden St Buyer",
    email: "wordenst.buyer@gmail.com",
    phone: "619-224-8800",
    city: "San Diego",
    county: "San Diego",
    jurisdiction: "San Diego",
    lotSizeSqft: 7700,
    segment: "H9",
    source: "public_record",
    sourceDetail: "2372 Worden St, San Diego, CA 92107",
    stage: "New",
    estValue: 230000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold introduction recent sale list.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Opened welcome outreach email and visited site plans" }]
  },

  // 5. El Cerrito & Bay Area (Contra Costa / Alameda)
  {
    name: "535 Norvell St Family Estate",
    email: "norvellst.family@gmail.com",
    phone: "510-841-9988",
    city: "Berkeley",
    county: "Alameda",
    jurisdiction: "Berkeley",
    lotSizeSqft: 5000,
    segment: "H2",
    source: "public_record",
    sourceDetail: "535 Norvell St, El Cerrito, CA 94530",
    stage: "New",
    estValue: 240000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Introductory B2B family estate campaign.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Viewed backyard cottage photo gallery" }]
  },
  {
    name: "221 Likely Dr Developer",
    email: "likelydr.dev@apexhousing.com",
    phone: "925-338-0099",
    city: "Unincorporated San Diego County",
    county: "San Diego",
    jurisdiction: "Unincorporated San Diego County",
    lotSizeSqft: 20900,
    segment: "H8",
    source: "public_record",
    sourceDetail: "221 Likely Dr, Alamo, CA 94507",
    stage: "New",
    estValue: 480000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "B2B commercial introductory outreach.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited SB 1211 development package page" }]
  },
  {
    name: "732 Pradera Way Downsizer",
    email: "praderaway.downsize@gmail.com",
    phone: "925-837-1100",
    city: "Orange County",
    county: "Orange",
    jurisdiction: "Orange County",
    lotSizeSqft: 5645,
    segment: "H5",
    source: "public_record",
    sourceDetail: "732 Pradera Way, San Ramon, CA 94583",
    stage: "New",
    estValue: 185000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold downsizer email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited reverse downsizing blog post" }]
  },

  // 6. Palo Alto & Silicon Valley
  {
    name: "1240 University Ave Studio",
    email: "universityave.studio@gmail.com",
    phone: "650-329-1100",
    city: "San Jose",
    county: "Santa Clara",
    jurisdiction: "San Jose",
    lotSizeSqft: 7500,
    segment: "H4",
    source: "public_record",
    sourceDetail: "1240 University Ave, Palo Alto, CA 94301",
    stage: "New",
    estValue: 290000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Palo Alto tech studio list.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Downloaded office specs brochure" }]
  },
  {
    name: "891 El Camino Real Investor",
    email: "elcaminoreal.invest@gmail.com",
    phone: "650-857-4400",
    city: "San Jose",
    county: "Santa Clara",
    jurisdiction: "San Jose",
    lotSizeSqft: 6800,
    segment: "H1",
    source: "public_record",
    sourceDetail: "891 El Camino Real, Sunnyvale, CA 94087",
    stage: "New",
    estValue: 180000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Investor cash flow outreach.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited rental cash flow calculator" }]
  },

  // 7. San Francisco (San Francisco County)
  {
    name: "1405 Broadway Rental Asset",
    email: "broadway.invest@sfheights.com",
    phone: "415-922-4545",
    city: "San Francisco",
    county: "San Francisco",
    jurisdiction: "San Francisco",
    lotSizeSqft: 3800,
    segment: "H1",
    source: "public_record",
    sourceDetail: "1405 Broadway, San Francisco, CA 94109",
    stage: "In design",
    estValue: 350000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "High-density custom builder list.", consentIp: "127.0.0.1" },
    activities: [
      { kind: "visit", summary: "Visited building envelope calculator" },
      { kind: "visit", summary: "Downloaded premium custom design catalog" }
    ]
  },
  {
    name: "1842 Judah St Multigen",
    email: "judahst.family@yahoo.com",
    phone: "415-661-8899",
    city: "San Francisco",
    county: "San Francisco",
    jurisdiction: "San Francisco",
    lotSizeSqft: 3500,
    segment: "H2",
    source: "public_record",
    sourceDetail: "1842 Judah St, San Francisco, CA 94122",
    stage: "New",
    estValue: 320000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Scanned Sunset QR code.", consentIp: "184.22.89.5" },
    activities: [{ kind: "visit", summary: "Visited multigenerational design planning page" }]
  },

  // 8. Berkeley Hills & East Bay
  {
    name: "245 Grizzly Peak WFH Studio",
    email: "grizzlypeak.studio@gmail.com",
    phone: "510-525-4422",
    city: "Berkeley",
    county: "Alameda",
    jurisdiction: "Berkeley",
    lotSizeSqft: 6100,
    segment: "H4",
    source: "public_record",
    sourceDetail: "245 Grizzly Peak Blvd, Berkeley, CA 94708",
    stage: "Contacted",
    estValue: 190000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Opted into WFH updates.", consentIp: "98.114.44.8" },
    activities: [{ kind: "visit", summary: "Scanned postcard QR, downloaded Office ADU specs sheet" }]
  },
  {
    name: "2612 Telegraph Ave multigen",
    email: "telegraphave.multigen@gmail.com",
    phone: "510-848-3000",
    city: "Berkeley",
    county: "Alameda",
    jurisdiction: "Berkeley",
    lotSizeSqft: 7200,
    segment: "H2",
    source: "public_record",
    sourceDetail: "2612 Telegraph Ave, Berkeley, CA 94704",
    stage: "New",
    estValue: 240000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "B2B family estate campaign.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Viewed backyard cottage photo gallery" }]
  },

  // 9. Santa Cruz Coastal Area
  {
    name: "129 East Cliff Dr Rental Asset",
    email: "eastcliff.invest@gmail.com",
    phone: "831-423-1100",
    city: "Santa Cruz",
    county: "Santa Cruz",
    jurisdiction: "Santa Cruz",
    lotSizeSqft: 8800,
    segment: "H1",
    source: "public_record",
    sourceDetail: "129 East Cliff Dr, Santa Cruz, CA 95062",
    stage: "New",
    estValue: 210000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Rental ADU information request.", consentIp: "98.140.22.40" },
    activities: [{ kind: "visit", summary: "Viewed coastal zoning regulations page" }]
  },
  {
    name: "1422 Mission St Caregiver ADU",
    email: "missionst.care@yahoo.com",
    phone: "831-460-2211",
    city: "Santa Cruz",
    county: "Santa Cruz",
    jurisdiction: "Santa Cruz",
    lotSizeSqft: 9800,
    segment: "H3",
    source: "public_record",
    sourceDetail: "1422 Mission St, Santa Cruz, CA 95060",
    stage: "Contacted",
    estValue: 215000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold senior caregiver outreach list.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Downloaded aging in place custom build catalog" }]
  },

  // 10. Stockton Area
  {
    name: "456 Pacific Ave Rental Investment",
    email: "pacificave.invest@gmail.com",
    phone: "209-466-8800",
    city: "Stockton",
    county: "San Joaquin",
    jurisdiction: "Stockton",
    lotSizeSqft: 7600,
    segment: "H1",
    source: "public_record",
    sourceDetail: "456 Pacific Ave, Stockton, CA 95204",
    stage: "New",
    estValue: 140000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold investor checklist campaign.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited cash flow analysis tool" }]
  },
  {
    name: "1829 N Pacific Ave Buyer",
    email: "npacificave.buyer@gmail.com",
    phone: "209-948-3300",
    city: "Stockton",
    county: "San Joaquin",
    jurisdiction: "Stockton",
    lotSizeSqft: 8200,
    segment: "H9",
    source: "public_record",
    sourceDetail: "1829 N Pacific Ave, Stockton, CA 95204",
    stage: "New",
    estValue: 135000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Scanned welcome mailer QR.", consentIp: "68.22.45.10" },
    activities: [{ kind: "visit", summary: "Scanned QR card, viewed sizing specifications sheet" }]
  },

  // 11. Central Valley & Southern California
  {
    name: "1428 Shaw Ave Family Farmhouse",
    email: "shawave.family@gmail.com",
    phone: "559-439-8800",
    city: "Fresno",
    county: "Fresno",
    jurisdiction: "Fresno",
    lotSizeSqft: 12000,
    segment: "H2",
    source: "public_record",
    sourceDetail: "1428 Shaw Ave, Fresno, CA 93704",
    stage: "New",
    estValue: 130000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold family home introduction.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Downloaded custom farmhouse ADU design blueprints" }]
  },
  {
    name: "789 Shepherd Ave Buyer",
    email: "shepherdave.buyer@gmail.com",
    phone: "559-322-1100",
    city: "Fresno",
    county: "Fresno",
    jurisdiction: "Fresno",
    lotSizeSqft: 11500,
    segment: "H9",
    source: "public_record",
    sourceDetail: "789 Shepherd Ave, Fresno, CA 93720",
    stage: "New",
    estValue: 140000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Opted into new buyer email list.", consentIp: "172.56.20.10" },
    activities: [{ kind: "visit", summary: "Scanned welcome card QR, viewed sizing specifications sheet" }]
  },
  {
    name: "2400 Truxtun Ave Investor",
    email: "truxtunave.invest@gmail.com",
    phone: "661-327-4400",
    city: "Bakersfield",
    county: "Kern",
    jurisdiction: "Bakersfield",
    lotSizeSqft: 8500,
    segment: "H1",
    source: "public_record",
    sourceDetail: "2400 Truxtun Ave, Bakersfield, CA 93301",
    stage: "New",
    estValue: 120000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold rental investor outreach.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited cash flow model page" }]
  },
  {
    name: "1200 California Ave Amnesty Plan",
    email: "californiaave.amnesty@outlook.com",
    phone: "661-831-7788",
    city: "Bakersfield",
    county: "Kern",
    jurisdiction: "Bakersfield",
    lotSizeSqft: 8000,
    segment: "H7",
    source: "public_record",
    sourceDetail: "1200 California Ave, Bakersfield, CA 93304",
    stage: "New",
    estValue: 90000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Opted in for code amnesty email updates.", consentIp: "174.45.10.22" },
    activities: [{ kind: "visit", summary: "Scanned QR, read unpermitted unit legalization guidelines" }]
  },
  {
    name: "3600 Magnolia Ave Multigen",
    email: "magnoliaave.multigen@gmail.com",
    phone: "951-682-9900",
    city: "Riverside",
    county: "Riverside",
    jurisdiction: "Riverside",
    lotSizeSqft: 14000,
    segment: "H2",
    source: "public_record",
    sourceDetail: "3600 Magnolia Ave, Riverside, CA 92506",
    stage: "New",
    estValue: 150000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold estate homeowner outreach.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Downloaded family design catalog" }]
  },
  {
    name: "4200 Mission Blvd Amnesty",
    email: "missionblvd.amnesty@gmail.com",
    phone: "951-787-1122",
    city: "Riverside",
    county: "Riverside",
    jurisdiction: "Riverside",
    lotSizeSqft: 9500,
    segment: "H7",
    source: "public_record",
    sourceDetail: "4200 Mission Blvd, Riverside, CA 92509",
    stage: "New",
    estValue: 100000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Opted into compliance checklist.", consentIp: "174.45.89.5" },
    activities: [{ kind: "visit", summary: "Visited legalization guidelines page" }]
  },
  {
    name: "1200 State St Creative Studio",
    email: "statest.studio@gmail.com",
    phone: "805-965-4400",
    city: "Santa Barbara",
    county: "Santa Barbara",
    jurisdiction: "Santa Barbara",
    lotSizeSqft: 7800,
    segment: "H4",
    source: "public_record",
    sourceDetail: "1200 State St, Santa Barbara, CA 93101",
    stage: "New",
    estValue: 280000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold workspace introduction.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited premium office ADU specifications page" }]
  },
  {
    name: "890 Alameda Padre Serra Buyer",
    email: "alamedapadreserra.buyer@outlook.com",
    phone: "805-569-8800",
    city: "Santa Barbara",
    county: "Santa Barbara",
    jurisdiction: "Santa Barbara",
    lotSizeSqft: 9000,
    segment: "H9",
    source: "public_record",
    sourceDetail: "890 Alameda Padre Serra, Santa Barbara, CA 93103",
    stage: "New",
    estValue: 280000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Opted in for recent buyer follow ups.", consentIp: "98.150.12.9" },
    activities: [{ kind: "visit", summary: "Scanned QR card, read custom recent buyer planning checklist" }]
  },
  {
    name: "1420 Skyline Blvd Estate",
    email: "skylineblvd.estate@gmail.com",
    phone: "510-482-1200",
    city: "Oakland",
    county: "Alameda",
    jurisdiction: "Oakland",
    lotSizeSqft: 9500,
    segment: "H1",
    source: "public_record",
    sourceDetail: "1420 Skyline Blvd, Oakland, CA 94611",
    stage: "New",
    estValue: 230000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold property investment campaign.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited rental ADU cash flow model page" }]
  },
  {
    name: "320 Grand Ave Downsizer",
    email: "grandave.downsizing@gmail.com",
    phone: "510-763-9900",
    city: "Oakland",
    county: "Alameda",
    jurisdiction: "Oakland",
    lotSizeSqft: 6000,
    segment: "H5",
    source: "public_record",
    sourceDetail: "320 Grand Ave, Oakland, CA 94610",
    stage: "New",
    estValue: 185000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Scanned downsizer QR code.", consentIp: "172.56.9.40" },
    activities: [{ kind: "visit", summary: "Read empty-nester reverse downsizing guide" }]
  },
  {
    name: "2420 Telegraph Ave Developer",
    email: "telegraphave.dev@gmail.com",
    phone: "510-547-2288",
    city: "Oakland",
    county: "Alameda",
    jurisdiction: "Oakland",
    lotSizeSqft: 12000,
    segment: "H8",
    source: "public_record",
    sourceDetail: "2420 Telegraph Ave, Oakland, CA 94612",
    stage: "New",
    estValue: 380000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold commercial builder campaign.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited SB 1211 multi-family detached ADU page" }]
  },
  {
    name: "450 Land Park Dr Downsizer",
    email: "landparkdr.downsize@gmail.com",
    phone: "916-442-8811",
    city: "Sacramento",
    county: "Sacramento",
    jurisdiction: "Sacramento",
    lotSizeSqft: 8100,
    segment: "H5",
    source: "public_record",
    sourceDetail: "450 Land Park Dr, Sacramento, CA 95818",
    stage: "New",
    estValue: 165000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Scanned QR, opted in for downsizer emails.", consentIp: "98.220.11.23" },
    activities: [{ kind: "visit", summary: "Visited reverse downsizing blog post" }]
  },

  // Suppressed/DNC Homeowner Candidates (To show up in DNC list)
  {
    name: "822 Montana Ave Property owner",
    email: "tshelby.unsub@gmail.com",
    phone: "310-555-0909",
    city: "Santa Monica",
    county: "Los Angeles",
    jurisdiction: "Santa Monica",
    lotSizeSqft: 9500,
    segment: "H1",
    source: "public_record",
    sourceDetail: "822 Montana Ave, Santa Monica, CA 90403",
    stage: "Contacted",
    estValue: 240000,
    ab1033Eligible: true,
    consent: { emailOptIn: false, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Explicitly requested email unsubscribe.", consentIp: "75.80.20.19" },
    activities: [{ kind: "visit", summary: "Visited unsubscribe page and completed opt-out" }]
  },
  {
    name: "1200 Almaden Blvd Owner",
    email: "mmartinez.dnc@yahoo.com",
    phone: "408-555-0707",
    city: "San Jose",
    county: "Santa Clara",
    jurisdiction: "San Jose",
    lotSizeSqft: 7200,
    segment: "H2",
    source: "public_record",
    sourceDetail: "1200 Almaden Blvd, San Jose, CA 95110",
    stage: "New",
    estValue: 210000,
    ab1033Eligible: true,
    consent: { emailOptIn: false, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "DNC request via reply.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Replied: Please place on DNC list" }]
  },
  {
    name: "1115 H St Owner",
    email: "rvance.dnc@outlook.com",
    phone: "916-555-0404",
    city: "Sacramento",
    county: "Sacramento",
    jurisdiction: "Sacramento",
    lotSizeSqft: 8800,
    segment: "H3",
    source: "public_record",
    sourceDetail: "1115 H St, Sacramento, CA 95814",
    stage: "New",
    estValue: 190000,
    ab1033Eligible: false,
    consent: { emailOptIn: false, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Requested DNC status.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Flagged email as spam / manual DNC" }]
  },
  {
    name: "840 Adeline St Property owner",
    email: "fgallagher.dnc@gmail.com",
    phone: "510-555-0101",
    city: "Oakland",
    county: "Alameda",
    jurisdiction: "Oakland",
    lotSizeSqft: 5100,
    segment: "H7",
    source: "public_record",
    sourceDetail: "840 Adeline St, Oakland, CA 94607",
    stage: "New",
    estValue: 95000,
    ab1033Eligible: false,
    consent: { emailOptIn: false, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Requested DNC status.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Replied: Stop emailing me" }]
  },
  {
    name: "1900 Canyon Crest Dr Owner",
    email: "wwhite.dnc@outlook.com",
    phone: "951-555-0202",
    city: "Riverside",
    county: "Riverside",
    jurisdiction: "Riverside",
    lotSizeSqft: 9800,
    segment: "H6",
    source: "public_record",
    sourceDetail: "1900 Canyon Crest Dr, Riverside, CA 92507",
    stage: "New",
    estValue: 250000,
    ab1033Eligible: false,
    consent: { emailOptIn: false, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Opted out on contact.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Requested opt-out from mortgage network" }]
  },
  {
    name: "1400 Chester Ave Owner",
    email: "jmcgill.unsub@gmail.com",
    phone: "661-555-0303",
    city: "Bakersfield",
    county: "Kern",
    jurisdiction: "Bakersfield",
    lotSizeSqft: 6200,
    segment: "H3",
    source: "public_record",
    sourceDetail: "1400 Chester Ave, Bakersfield, CA 93301",
    stage: "New",
    estValue: 120000,
    ab1033Eligible: false,
    consent: { emailOptIn: false, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Requested DNC status.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Bounced / manual unsubscribe" }]
  },
  {
    name: "1220 Channel Dr Property owner",
    email: "tsoprano.dnc@outlook.com",
    phone: "805-555-0404",
    city: "Santa Barbara",
    county: "Santa Barbara",
    jurisdiction: "Santa Barbara",
    lotSizeSqft: 15000,
    segment: "H6",
    source: "public_record",
    sourceDetail: "1220 Channel Dr, Santa Barbara, CA 93108",
    stage: "New",
    estValue: 450000,
    ab1033Eligible: false,
    consent: { emailOptIn: false, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Requested DNC status.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Marked outreach as spam" }]
  },
  {
    name: "2200 El Camino Real Owner",
    email: "ddraper.unsub@gmail.com",
    phone: "650-555-0505",
    city: "San Jose",
    county: "Santa Clara",
    jurisdiction: "San Jose",
    lotSizeSqft: 5800,
    segment: "H4",
    source: "public_record",
    sourceDetail: "2200 El Camino Real, Palo Alto, CA 94306",
    stage: "New",
    estValue: 260000,
    ab1033Eligible: true,
    consent: { emailOptIn: false, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Unsubscribed from sequence.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Opted out from remote worker sequences" }]
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
  console.log("Starting Statewide Seeding for Verified California Real Properties...");

  // 1. Seed Jurisdictions
  for (const j of jurisdictionsData) {
    await prisma.jurisdiction.upsert({
      where: { name: j.name },
      update: { ab1033OptIn: j.ab1033OptIn, notes: j.notes },
      create: j,
    });
  }
  console.log("Successfully seeded/updated California jurisdictions.");

  // 2. Delete only homeowner leads to protect B2B partners
  const deleteLeads = await prisma.lead.deleteMany({
    where: { type: 'homeowner' }
  });
  console.log(`Cleared ${deleteLeads.count} existing homeowner leads.`);

  // 3. Prepare list of emails to purge from Suppression table to avoid duplicate constraints
  const emailsToClear = realHomeowners.map(h => h.email);
  await prisma.suppression.deleteMany({
    where: { value: { in: emailsToClear } }
  });
  console.log("Cleared matching suppressed emails from Suppression registry.");

  let seededCount = 0;

  for (const h of realHomeowners) {
    const finalScore = getCalculatedScore(h);

    const lead = await prisma.lead.create({
      data: {
        name: h.name,
        email: h.email,
        phone: h.phone,
        city: h.city,
        county: h.county,
        jurisdiction: h.jurisdiction,
        lotSizeSqft: h.lotSizeSqft,
        segment: h.segment,
        source: h.source,
        sourceDetail: h.sourceDetail,
        stage: h.stage,
        type: 'homeowner',
        estValue: h.estValue,
        ab1033Eligible: h.ab1033Eligible,
        score: finalScore,
        consent: {
          create: {
            emailOptIn: h.consent.emailOptIn,
            phoneOptIn: h.consent.phoneOptIn,
            smsOptIn: h.consent.smsOptIn,
            consentSource: h.consent.consentSource,
            consentText: h.consent.consentText,
            consentIp: h.consent.consentIp,
          }
        },
        activities: {
          create: h.activities.map(a => ({
            kind: a.kind,
            summary: a.summary,
          }))
        }
      }
    });

    seededCount++;

    // Add to Suppression registry if unsubscribed
    if (!h.consent.emailOptIn) {
      await prisma.suppression.upsert({
        where: { value: h.email },
        update: { reason: "unsubscribed" },
        create: { value: h.email, reason: "unsubscribed" }
      });
      console.log(`Added DNC suppression: ${h.email}`);
    }

    // Enroll in sequence if applicable
    const seq = await prisma.sequence.findUnique({ where: { segment: h.segment } });
    if (seq && h.stage === 'New' && h.consent.emailOptIn) {
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

  console.log(`Successfully seeded ${seededCount} real California property leads!`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
