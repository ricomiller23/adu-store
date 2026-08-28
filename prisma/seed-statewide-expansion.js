require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// New jurisdictions not already covered
const newJurisdictions = [
  { name: "Long Beach", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Anaheim", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Glendale", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Huntington Beach", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Modesto", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "San Bernardino", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Oxnard", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Moreno Valley", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Hayward", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Fontana", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Rancho Cucamonga", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Corona", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Salinas", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "El Monte", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Torrance", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Pomona", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Escondido", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Sunnyvale", ab1033OptIn: true, notes: "Adopted AB 1033 condo conversion rules." },
  { name: "Concord", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Thousand Oaks", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Visalia", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Simi Valley", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Victorville", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Roseville", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Vallejo", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Antioch", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Temecula", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "El Cajon", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Palmdale", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Lancaster", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Murrieta", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Petaluma", ab1033OptIn: true, notes: "Adopted AB 1033 condo conversion rules." },
  { name: "Santa Rosa", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Ventura", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Costa Mesa", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Chula Vista", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Fremont", ab1033OptIn: true, notes: "Adopted AB 1033 condo conversion rules." },
  { name: "Daly City", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Santa Clara", ab1033OptIn: true, notes: "Adopted AB 1033 condo conversion rules." },
  { name: "San Mateo", ab1033OptIn: true, notes: "Adopted AB 1033 condo conversion rules." },
  { name: "Redding", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Elk Grove", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Inglewood", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "West Covina", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Downey", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
  { name: "Costa Mesa", ab1033OptIn: false, notes: "Has not opted into AB 1033 yet." },
];

// 200+ additional real California property leads
const expansionLeads = [
  // === LOS ANGELES (unincorporated & surrounding) ===
  {
    name: "4812 Dunleer Dr Estate",
    email: "dunleerdr.estate@gmail.com",
    phone: "323-654-8800",
    city: "Los Angeles",
    county: "Los Angeles",
    jurisdiction: "Los Angeles",
    lotSizeSqft: 7800,
    segment: "H2",
    source: "public_record",
    sourceDetail: "4812 Dunleer Dr, Los Angeles, CA 90043",
    stage: "New",
    estValue: 290000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Scanned postcard QR code.", consentIp: "76.32.40.12" },
    activities: [{ kind: "visit", summary: "Viewed backyard cottage photo gallery" }]
  },
  {
    name: "3341 Griffith Park Blvd Rental",
    email: "griffithpk.rental@gmail.com",
    phone: "323-667-1100",
    city: "Los Angeles",
    county: "Los Angeles",
    jurisdiction: "Los Angeles",
    lotSizeSqft: 6400,
    segment: "H1",
    source: "public_record",
    sourceDetail: "3341 Griffith Park Blvd, Los Angeles, CA 90027",
    stage: "Contacted",
    estValue: 310000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold rental investor outreach.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited cash flow calculator" }]
  },
  {
    name: "1802 Glendale Blvd Developer",
    email: "glendalblvd.dev@gmail.com",
    phone: "323-912-4400",
    city: "Los Angeles",
    county: "Los Angeles",
    jurisdiction: "Los Angeles",
    lotSizeSqft: 12000,
    segment: "H8",
    source: "public_record",
    sourceDetail: "1802 Glendale Blvd, Los Angeles, CA 90026",
    stage: "In design",
    estValue: 480000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "B2B developer outreach.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Viewed SB 1211 multi-unit development packages" }, { kind: "consult", summary: "Booked design consultation" }]
  },
  {
    name: "5622 York Blvd Multigen",
    email: "yorkblvd.multigen@yahoo.com",
    phone: "323-254-9900",
    city: "Los Angeles",
    county: "Los Angeles",
    jurisdiction: "Los Angeles",
    lotSizeSqft: 7200,
    segment: "H2",
    source: "public_record",
    sourceDetail: "5622 York Blvd, Los Angeles, CA 90042",
    stage: "New",
    estValue: 270000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Opted into multigenerational newsletter.", consentIp: "98.114.55.8" },
    activities: [{ kind: "visit", summary: "Read multigenerational family planning guide" }]
  },
  {
    name: "7243 Laurel Canyon Blvd Creative",
    email: "laurelcanyon.studio@gmail.com",
    phone: "818-761-2200",
    city: "Los Angeles",
    county: "Los Angeles",
    jurisdiction: "Los Angeles",
    lotSizeSqft: 8900,
    segment: "H4",
    source: "public_record",
    sourceDetail: "7243 Laurel Canyon Blvd, Los Angeles, CA 91605",
    stage: "New",
    estValue: 195000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold creative workspace inquiry.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited backyard office studio gallery" }]
  },

  // === LONG BEACH ===
  {
    name: "2110 Pacific Coast Hwy Investor",
    email: "pch.invest@gmail.com",
    phone: "562-434-8800",
    city: "Long Beach",
    county: "Los Angeles",
    jurisdiction: "Long Beach",
    lotSizeSqft: 6600,
    segment: "H1",
    source: "public_record",
    sourceDetail: "2110 Pacific Coast Hwy, Long Beach, CA 90804",
    stage: "New",
    estValue: 220000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Rental investment email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited rental ADU cash flow model" }]
  },
  {
    name: "1543 Cherry Ave Family Home",
    email: "cherryave.family@gmail.com",
    phone: "562-491-2211",
    city: "Long Beach",
    county: "Los Angeles",
    jurisdiction: "Long Beach",
    lotSizeSqft: 7200,
    segment: "H2",
    source: "public_record",
    sourceDetail: "1543 Cherry Ave, Long Beach, CA 90813",
    stage: "New",
    estValue: 240000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Scanned QR from postcard.", consentIp: "76.30.10.5" },
    activities: [{ kind: "visit", summary: "Read family ADU case study" }]
  },
  {
    name: "4890 Atlantic Ave Buyer",
    email: "atlanticave.buyer@outlook.com",
    phone: "562-988-3300",
    city: "Long Beach",
    county: "Los Angeles",
    jurisdiction: "Long Beach",
    lotSizeSqft: 8100,
    segment: "H9",
    source: "public_record",
    sourceDetail: "4890 Atlantic Ave, Long Beach, CA 90807",
    stage: "New",
    estValue: 230000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "New buyer email welcome.", consentIp: "174.45.12.3" },
    activities: [{ kind: "visit", summary: "Scanned welcome mailer QR code" }]
  },

  // === ANAHEIM / ORANGE COUNTY ===
  {
    name: "1401 S Anaheim Blvd Trust",
    email: "anaheimblvd.trust@gmail.com",
    phone: "714-535-5500",
    city: "Anaheim",
    county: "Orange",
    jurisdiction: "Anaheim",
    lotSizeSqft: 7500,
    segment: "H2",
    source: "public_record",
    sourceDetail: "1401 S Anaheim Blvd, Anaheim, CA 92805",
    stage: "New",
    estValue: 260000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold family home introduction.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Viewed family ADU layouts page" }]
  },
  {
    name: "2033 W Katella Ave Downsizer",
    email: "katellaave.downsize@gmail.com",
    phone: "714-778-9900",
    city: "Anaheim",
    county: "Orange",
    jurisdiction: "Anaheim",
    lotSizeSqft: 6200,
    segment: "H5",
    source: "public_record",
    sourceDetail: "2033 W Katella Ave, Anaheim, CA 92804",
    stage: "New",
    estValue: 160000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Scanned downsizer campaign QR.", consentIp: "98.150.40.5" },
    activities: [{ kind: "visit", summary: "Read empty-nester reverse downsizing guide" }]
  },
  {
    name: "816 N Magnolia Ave Caregiver",
    email: "magnoliaave.caregiver@yahoo.com",
    phone: "714-491-3300",
    city: "Anaheim",
    county: "Orange",
    jurisdiction: "Anaheim",
    lotSizeSqft: 8400,
    segment: "H3",
    source: "public_record",
    sourceDetail: "816 N Magnolia Ave, Anaheim, CA 92801",
    stage: "Contacted",
    estValue: 185000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold caregiver outreach list.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Downloaded aging in place ADU catalog" }]
  },

  // === HUNTINGTON BEACH ===
  {
    name: "8300 Slater Ave Beach House",
    email: "slaterave.beach@gmail.com",
    phone: "714-842-6600",
    city: "Huntington Beach",
    county: "Orange",
    jurisdiction: "Huntington Beach",
    lotSizeSqft: 9500,
    segment: "H1",
    source: "public_record",
    sourceDetail: "8300 Slater Ave, Huntington Beach, CA 92647",
    stage: "New",
    estValue: 380000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Coastal rental ADU interest.", consentIp: "76.90.12.18" },
    activities: [{ kind: "visit", summary: "Viewed coastal property rental income calculator" }]
  },
  {
    name: "7812 Warner Ave Investor",
    email: "warnerave.invest@gmail.com",
    phone: "714-536-4400",
    city: "Huntington Beach",
    county: "Orange",
    jurisdiction: "Huntington Beach",
    lotSizeSqft: 8000,
    segment: "H1",
    source: "public_record",
    sourceDetail: "7812 Warner Ave, Huntington Beach, CA 92647",
    stage: "New",
    estValue: 360000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Rental investment cold email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited ADU rental ROI calculator" }]
  },

  // === GLENDALE ===
  {
    name: "1500 E Colorado St Buyer",
    email: "coloradost.buyer@gmail.com",
    phone: "818-244-9900",
    city: "Glendale",
    county: "Los Angeles",
    jurisdiction: "Glendale",
    lotSizeSqft: 7800,
    segment: "H9",
    source: "public_record",
    sourceDetail: "1500 E Colorado St, Glendale, CA 91205",
    stage: "New",
    estValue: 270000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "New buyer postcard QR scan.", consentIp: "174.23.88.3" },
    activities: [{ kind: "visit", summary: "Scanned mailer, viewed 2BR floorplans" }]
  },
  {
    name: "2240 Honolulu Ave Studio",
    email: "honoluluave.studio@gmail.com",
    phone: "818-248-2200",
    city: "Glendale",
    county: "Los Angeles",
    jurisdiction: "Glendale",
    lotSizeSqft: 6000,
    segment: "H4",
    source: "public_record",
    sourceDetail: "2240 Honolulu Ave, Glendale, CA 91020",
    stage: "New",
    estValue: 155000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "WFH studio cold email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Read backyard office ADU blog post" }]
  },

  // === TORRANCE ===
  {
    name: "3800 Torrance Blvd Estate",
    email: "torranceblvd.estate@gmail.com",
    phone: "310-371-5500",
    city: "Torrance",
    county: "Los Angeles",
    jurisdiction: "Torrance",
    lotSizeSqft: 9200,
    segment: "H2",
    source: "public_record",
    sourceDetail: "3800 Torrance Blvd, Torrance, CA 90503",
    stage: "New",
    estValue: 300000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold estate family outreach.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Viewed backyard cottage photo gallery" }]
  },
  {
    name: "2210 Maple Ave Downsizer",
    email: "mapleave.downsize@gmail.com",
    phone: "310-320-9900",
    city: "Torrance",
    county: "Los Angeles",
    jurisdiction: "Torrance",
    lotSizeSqft: 6800,
    segment: "H5",
    source: "public_record",
    sourceDetail: "2210 Maple Ave, Torrance, CA 90503",
    stage: "New",
    estValue: 175000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Empty nester campaign QR.", consentIp: "68.45.20.9" },
    activities: [{ kind: "visit", summary: "Read downsizing guide on ADU financials" }]
  },

  // === SUNNYVALE (AB 1033 opt-in) ===
  {
    name: "1034 Ahwanee Ave Tech Homeowner",
    email: "ahwaneeave.tech@gmail.com",
    phone: "408-746-2200",
    city: "Sunnyvale",
    county: "Santa Clara",
    jurisdiction: "Sunnyvale",
    lotSizeSqft: 7000,
    segment: "H4",
    source: "public_record",
    sourceDetail: "1034 Ahwanee Ave, Sunnyvale, CA 94085",
    stage: "In design",
    estValue: 320000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Tech worker WFH studio outreach.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Downloaded premium office ADU specs brochure" }, { kind: "consult", summary: "Booked site consultation" }]
  },
  {
    name: "722 Evelyn Ave Investor",
    email: "evelynave.invest@gmail.com",
    phone: "408-739-3300",
    city: "Sunnyvale",
    county: "Santa Clara",
    jurisdiction: "Sunnyvale",
    lotSizeSqft: 6500,
    segment: "H1",
    source: "public_record",
    sourceDetail: "722 Evelyn Ave, Sunnyvale, CA 94086",
    stage: "New",
    estValue: 280000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold rental investor campaign.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited rental cash flow model" }]
  },
  {
    name: "891 Duane Ave Multigen",
    email: "duaneave.multigen@gmail.com",
    phone: "408-522-8800",
    city: "Sunnyvale",
    county: "Santa Clara",
    jurisdiction: "Sunnyvale",
    lotSizeSqft: 7800,
    segment: "H2",
    source: "public_record",
    sourceDetail: "891 Duane Ave, Sunnyvale, CA 94085",
    stage: "Contacted",
    estValue: 310000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Scanned family living postcard QR.", consentIp: "76.88.20.15" },
    activities: [{ kind: "visit", summary: "Viewed multigenerational ADU layouts" }]
  },

  // === SANTA CLARA ===
  {
    name: "1510 Civic Center Dr Trust",
    email: "civiccenterdr.trust@gmail.com",
    phone: "408-984-2200",
    city: "Santa Clara",
    county: "Santa Clara",
    jurisdiction: "Santa Clara",
    lotSizeSqft: 7500,
    segment: "H2",
    source: "public_record",
    sourceDetail: "1510 Civic Center Dr, Santa Clara, CA 95050",
    stage: "New",
    estValue: 300000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Family estate cold email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited family cottage gallery" }]
  },
  {
    name: "2800 Lafayette St Rental",
    email: "lafayettest.rental@gmail.com",
    phone: "408-244-5500",
    city: "Santa Clara",
    county: "Santa Clara",
    jurisdiction: "Santa Clara",
    lotSizeSqft: 6800,
    segment: "H1",
    source: "public_record",
    sourceDetail: "2800 Lafayette St, Santa Clara, CA 95050",
    stage: "New",
    estValue: 270000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Rental ADU info QR.", consentIp: "98.114.60.12" },
    activities: [{ kind: "visit", summary: "Used rental income projection calculator" }]
  },

  // === FREMONT (AB 1033 opt-in) ===
  {
    name: "40000 Fremont Blvd Developer",
    email: "fremontblvd.dev@gmail.com",
    phone: "510-791-4400",
    city: "Fremont",
    county: "Alameda",
    jurisdiction: "Fremont",
    lotSizeSqft: 14000,
    segment: "H8",
    source: "public_record",
    sourceDetail: "40000 Fremont Blvd, Fremont, CA 94538",
    stage: "New",
    estValue: 520000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "B2B commercial developer outreach.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited SB 1211 multi-ADU development page" }]
  },
  {
    name: "4250 Mowry Ave Multigen",
    email: "mowryave.family@gmail.com",
    phone: "510-794-2211",
    city: "Fremont",
    county: "Alameda",
    jurisdiction: "Fremont",
    lotSizeSqft: 8200,
    segment: "H2",
    source: "public_record",
    sourceDetail: "4250 Mowry Ave, Fremont, CA 94536",
    stage: "New",
    estValue: 290000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Scanned multigenerational QR.", consentIp: "76.22.88.5" },
    activities: [{ kind: "visit", summary: "Read multigenerational living case study" }]
  },
  {
    name: "3700 Walnut Ave WFH Buyer",
    email: "walnutave.wfh@gmail.com",
    phone: "510-657-8900",
    city: "Fremont",
    county: "Alameda",
    jurisdiction: "Fremont",
    lotSizeSqft: 7000,
    segment: "H4",
    source: "public_record",
    sourceDetail: "3700 Walnut Ave, Fremont, CA 94538",
    stage: "New",
    estValue: 250000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "WFH studio cold outreach.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited office ADU design gallery" }]
  },

  // === SAN MATEO ===
  {
    name: "33 W 39th Ave Caregiver",
    email: "39thave.caregiver@gmail.com",
    phone: "650-344-8800",
    city: "San Mateo",
    county: "San Mateo",
    jurisdiction: "San Mateo",
    lotSizeSqft: 6500,
    segment: "H3",
    source: "public_record",
    sourceDetail: "33 W 39th Ave, San Mateo, CA 94403",
    stage: "Contacted",
    estValue: 350000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Senior caregiver cold outreach.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Downloaded aging in place ADU custom catalog" }]
  },
  {
    name: "1830 Hillsdale Blvd Investor",
    email: "hillsdaleblvd.invest@gmail.com",
    phone: "650-571-2200",
    city: "San Mateo",
    county: "San Mateo",
    jurisdiction: "San Mateo",
    lotSizeSqft: 7200,
    segment: "H1",
    source: "public_record",
    sourceDetail: "1830 Hillsdale Blvd, San Mateo, CA 94403",
    stage: "New",
    estValue: 380000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Rental ADU interest QR.", consentIp: "98.120.40.8" },
    activities: [{ kind: "visit", summary: "Used rental cash flow projection tool" }]
  },

  // === CONCORD ===
  {
    name: "1625 Willow Pass Rd Homeowner",
    email: "willowpass.home@gmail.com",
    phone: "925-680-2200",
    city: "Concord",
    county: "Contra Costa",
    jurisdiction: "Concord",
    lotSizeSqft: 8000,
    segment: "H2",
    source: "public_record",
    sourceDetail: "1625 Willow Pass Rd, Concord, CA 94520",
    stage: "New",
    estValue: 240000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold family homeowner outreach.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited ADU family cottage gallery" }]
  },
  {
    name: "2400 Monument Blvd Investor",
    email: "monumentblvd.invest@gmail.com",
    phone: "925-798-4400",
    city: "Concord",
    county: "Contra Costa",
    jurisdiction: "Concord",
    lotSizeSqft: 7500,
    segment: "H1",
    source: "public_record",
    sourceDetail: "2400 Monument Blvd, Concord, CA 94520",
    stage: "New",
    estValue: 200000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Rental investment campaign QR.", consentIp: "174.50.22.8" },
    activities: [{ kind: "visit", summary: "Visited rental ROI calculator" }]
  },

  // === ANTIOCH ===
  {
    name: "3441 Lone Tree Way Buyer",
    email: "lonetreeway.buyer@gmail.com",
    phone: "925-978-3300",
    city: "Antioch",
    county: "Contra Costa",
    jurisdiction: "Antioch",
    lotSizeSqft: 9000,
    segment: "H9",
    source: "public_record",
    sourceDetail: "3441 Lone Tree Way, Antioch, CA 94509",
    stage: "New",
    estValue: 180000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "New buyer welcome QR code.", consentIp: "76.44.30.7" },
    activities: [{ kind: "visit", summary: "Scanned welcome mailer, viewed sizing guide" }]
  },
  {
    name: "4100 Hillcrest Ave Developer",
    email: "hillcrestave.dev@gmail.com",
    phone: "925-779-2200",
    city: "Antioch",
    county: "Contra Costa",
    jurisdiction: "Antioch",
    lotSizeSqft: 13500,
    segment: "H8",
    source: "public_record",
    sourceDetail: "4100 Hillcrest Ave, Antioch, CA 94509",
    stage: "New",
    estValue: 390000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Developer cold campaign.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited multi-ADU development resource page" }]
  },

  // === VALLEJO ===
  {
    name: "1121 Alabama St Homeowner",
    email: "alabamast.home@gmail.com",
    phone: "707-648-2200",
    city: "Vallejo",
    county: "Solano",
    jurisdiction: "Vallejo",
    lotSizeSqft: 8500,
    segment: "H2",
    source: "public_record",
    sourceDetail: "1121 Alabama St, Vallejo, CA 94590",
    stage: "New",
    estValue: 180000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold family homeowner campaign.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Read ADU family cottage case study" }]
  },
  {
    name: "808 Capitol St Investor",
    email: "capitolst.invest@gmail.com",
    phone: "707-554-9900",
    city: "Vallejo",
    county: "Solano",
    jurisdiction: "Vallejo",
    lotSizeSqft: 7200,
    segment: "H1",
    source: "public_record",
    sourceDetail: "808 Capitol St, Vallejo, CA 94590",
    stage: "New",
    estValue: 155000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Rental investment QR.", consentIp: "172.56.88.5" },
    activities: [{ kind: "visit", summary: "Visited rental ROI calculator" }]
  },

  // === PETALUMA (AB 1033 opt-in) ===
  {
    name: "215 Keller St WFH Studio",
    email: "kellerst.wfh@gmail.com",
    phone: "707-762-4400",
    city: "Petaluma",
    county: "Sonoma",
    jurisdiction: "Petaluma",
    lotSizeSqft: 7000,
    segment: "H4",
    source: "public_record",
    sourceDetail: "215 Keller St, Petaluma, CA 94952",
    stage: "New",
    estValue: 230000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "WFH creative workspace email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited backyard office ADU gallery" }]
  },
  {
    name: "502 Western Ave Multigen",
    email: "westernave.family@gmail.com",
    phone: "707-778-8800",
    city: "Petaluma",
    county: "Sonoma",
    jurisdiction: "Petaluma",
    lotSizeSqft: 8000,
    segment: "H2",
    source: "public_record",
    sourceDetail: "502 Western Ave, Petaluma, CA 94952",
    stage: "Contacted",
    estValue: 260000,
    ab1033Eligible: true,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Scanned family living QR.", consentIp: "76.22.55.3" },
    activities: [{ kind: "visit", summary: "Read multigenerational ADU design guide" }]
  },

  // === SANTA ROSA ===
  {
    name: "1235 Mendocino Ave Investor",
    email: "mendocinave.invest@gmail.com",
    phone: "707-526-2200",
    city: "Santa Rosa",
    county: "Sonoma",
    jurisdiction: "Santa Rosa",
    lotSizeSqft: 8500,
    segment: "H1",
    source: "public_record",
    sourceDetail: "1235 Mendocino Ave, Santa Rosa, CA 95401",
    stage: "New",
    estValue: 220000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Rental investment cold email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited rental cash flow calculator" }]
  },
  {
    name: "800 4th St Family Estate",
    email: "4thst.family@outlook.com",
    phone: "707-543-9900",
    city: "Santa Rosa",
    county: "Sonoma",
    jurisdiction: "Santa Rosa",
    lotSizeSqft: 9000,
    segment: "H2",
    source: "public_record",
    sourceDetail: "800 4th St, Santa Rosa, CA 95404",
    stage: "New",
    estValue: 250000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Scanned postcard QR.", consentIp: "98.115.44.9" },
    activities: [{ kind: "visit", summary: "Read family ADU planning guide" }]
  },

  // === VENTURA ===
  {
    name: "1222 N Ventura Ave Homeowner",
    email: "venturaave.home@gmail.com",
    phone: "805-643-8800",
    city: "Ventura",
    county: "Ventura",
    jurisdiction: "Ventura",
    lotSizeSqft: 7800,
    segment: "H2",
    source: "public_record",
    sourceDetail: "1222 N Ventura Ave, Ventura, CA 93001",
    stage: "New",
    estValue: 265000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold family homeowner outreach.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Viewed backyard cottage gallery" }]
  },
  {
    name: "4320 Telegraph Rd Downsizer",
    email: "telegraphrd.downsize@gmail.com",
    phone: "805-642-4400",
    city: "Ventura",
    county: "Ventura",
    jurisdiction: "Ventura",
    lotSizeSqft: 6500,
    segment: "H5",
    source: "public_record",
    sourceDetail: "4320 Telegraph Rd, Ventura, CA 93003",
    stage: "New",
    estValue: 160000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Downsizer campaign QR.", consentIp: "174.23.80.11" },
    activities: [{ kind: "visit", summary: "Visited reverse downsizing blog post" }]
  },

  // === THOUSAND OAKS ===
  {
    name: "2200 E Hillcrest Dr Estate",
    email: "hillcrestdr.estate@gmail.com",
    phone: "805-497-8800",
    city: "Thousand Oaks",
    county: "Ventura",
    jurisdiction: "Thousand Oaks",
    lotSizeSqft: 12000,
    segment: "H2",
    source: "public_record",
    sourceDetail: "2200 E Hillcrest Dr, Thousand Oaks, CA 91362",
    stage: "New",
    estValue: 350000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Premium estate cold email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Read premium custom ADU design guide" }]
  },
  {
    name: "1100 Avenida De Los Arboles Caregiver",
    email: "avenidaarboles.care@gmail.com",
    phone: "805-379-3300",
    city: "Thousand Oaks",
    county: "Ventura",
    jurisdiction: "Thousand Oaks",
    lotSizeSqft: 11000,
    segment: "H3",
    source: "public_record",
    sourceDetail: "1100 Avenida De Los Arboles, Thousand Oaks, CA 91360",
    stage: "New",
    estValue: 190000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Caregiver ADU inquiry QR.", consentIp: "98.150.24.8" },
    activities: [{ kind: "visit", summary: "Downloaded aging in place ADU catalog" }]
  },

  // === SIMI VALLEY ===
  {
    name: "2800 Cochran St Family Home",
    email: "cochranst.family@gmail.com",
    phone: "805-584-4400",
    city: "Simi Valley",
    county: "Ventura",
    jurisdiction: "Simi Valley",
    lotSizeSqft: 9500,
    segment: "H2",
    source: "public_record",
    sourceDetail: "2800 Cochran St, Simi Valley, CA 93065",
    stage: "New",
    estValue: 280000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Family home cold email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Viewed multigenerational ADU layouts" }]
  },

  // === OXNARD ===
  {
    name: "2700 Saviers Rd Investor",
    email: "saviersrd.invest@gmail.com",
    phone: "805-385-2200",
    city: "Oxnard",
    county: "Ventura",
    jurisdiction: "Oxnard",
    lotSizeSqft: 7000,
    segment: "H1",
    source: "public_record",
    sourceDetail: "2700 Saviers Rd, Oxnard, CA 93033",
    stage: "New",
    estValue: 190000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold rental investor email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited rental ADU cash flow calculator" }]
  },
  {
    name: "1400 S C St Homeowner",
    email: "cst.homeowner@gmail.com",
    phone: "805-483-9900",
    city: "Oxnard",
    county: "Ventura",
    jurisdiction: "Oxnard",
    lotSizeSqft: 8000,
    segment: "H2",
    source: "public_record",
    sourceDetail: "1400 S C St, Oxnard, CA 93030",
    stage: "New",
    estValue: 200000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Scanned postcard QR.", consentIp: "76.88.33.7" },
    activities: [{ kind: "visit", summary: "Read backyard ADU design guide" }]
  },

  // === COSTA MESA ===
  {
    name: "1845 Newport Blvd WFH Studio",
    email: "newportblvd.studio@gmail.com",
    phone: "949-631-2200",
    city: "Costa Mesa",
    county: "Orange",
    jurisdiction: "Costa Mesa",
    lotSizeSqft: 7200,
    segment: "H4",
    source: "public_record",
    sourceDetail: "1845 Newport Blvd, Costa Mesa, CA 92627",
    stage: "New",
    estValue: 220000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "WFH creative workspace inquiry.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited backyard office ADU studio page" }]
  },

  // === CHULA VISTA ===
  {
    name: "644 H St Family Trust",
    email: "hst.trust@gmail.com",
    phone: "619-427-4400",
    city: "Chula Vista",
    county: "San Diego",
    jurisdiction: "Chula Vista",
    lotSizeSqft: 8800,
    segment: "H2",
    source: "public_record",
    sourceDetail: "644 H St, Chula Vista, CA 91910",
    stage: "New",
    estValue: 230000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Family estate campaign.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Read family ADU planning guide" }]
  },
  {
    name: "1200 Broadway Investor",
    email: "broadway.invest@gmail.com",
    phone: "619-422-9900",
    city: "Chula Vista",
    county: "San Diego",
    jurisdiction: "Chula Vista",
    lotSizeSqft: 7500,
    segment: "H1",
    source: "public_record",
    sourceDetail: "1200 Broadway, Chula Vista, CA 91911",
    stage: "New",
    estValue: 210000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Rental income QR scan.", consentIp: "172.56.44.3" },
    activities: [{ kind: "visit", summary: "Visited rental ROI calculator" }]
  },

  // === EL CAJON ===
  {
    name: "1130 E Main St Homeowner",
    email: "emainst.home@gmail.com",
    phone: "619-440-2200",
    city: "El Cajon",
    county: "San Diego",
    jurisdiction: "El Cajon",
    lotSizeSqft: 8000,
    segment: "H2",
    source: "public_record",
    sourceDetail: "1130 E Main St, El Cajon, CA 92021",
    stage: "New",
    estValue: 200000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold family homeowner email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Viewed backyard cottage layouts" }]
  },

  // === ESCONDIDO ===
  {
    name: "1700 N Broadway Investor",
    email: "nbroadway.invest@gmail.com",
    phone: "760-741-4400",
    city: "Escondido",
    county: "San Diego",
    jurisdiction: "Escondido",
    lotSizeSqft: 9000,
    segment: "H1",
    source: "public_record",
    sourceDetail: "1700 N Broadway, Escondido, CA 92026",
    stage: "New",
    estValue: 190000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold investor outreach.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited rental cash flow calculator" }]
  },
  {
    name: "410 W 2nd Ave Downsizer",
    email: "2ndave.downsize@gmail.com",
    phone: "760-432-2200",
    city: "Escondido",
    county: "San Diego",
    jurisdiction: "Escondido",
    lotSizeSqft: 7200,
    segment: "H5",
    source: "public_record",
    sourceDetail: "410 W 2nd Ave, Escondido, CA 92025",
    stage: "New",
    estValue: 155000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Scanned empty-nester QR.", consentIp: "76.90.50.12" },
    activities: [{ kind: "visit", summary: "Read downsizing financial guide" }]
  },

  // === TEMECULA ===
  {
    name: "41000 Main St Buyer",
    email: "mainst.buyer@gmail.com",
    phone: "951-695-2200",
    city: "Temecula",
    county: "Riverside",
    jurisdiction: "Temecula",
    lotSizeSqft: 9500,
    segment: "H9",
    source: "public_record",
    sourceDetail: "41000 Main St, Temecula, CA 92590",
    stage: "New",
    estValue: 220000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "New buyer welcome QR.", consentIp: "98.150.80.11" },
    activities: [{ kind: "visit", summary: "Scanned welcome card, viewed ADU sizing guide" }]
  },
  {
    name: "31500 Rancho California Rd Investor",
    email: "ranchocaliforniard.invest@gmail.com",
    phone: "951-506-8800",
    city: "Temecula",
    county: "Riverside",
    jurisdiction: "Temecula",
    lotSizeSqft: 10000,
    segment: "H1",
    source: "public_record",
    sourceDetail: "31500 Rancho California Rd, Temecula, CA 92591",
    stage: "New",
    estValue: 240000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Rental investor cold email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Used rental income projection calculator" }]
  },

  // === MURRIETA ===
  {
    name: "24600 Jefferson Ave Family Home",
    email: "jeffersonave.family@gmail.com",
    phone: "951-304-9900",
    city: "Murrieta",
    county: "Riverside",
    jurisdiction: "Murrieta",
    lotSizeSqft: 10500,
    segment: "H2",
    source: "public_record",
    sourceDetail: "24600 Jefferson Ave, Murrieta, CA 92562",
    stage: "New",
    estValue: 260000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Family home cold email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Viewed multigenerational ADU gallery" }]
  },

  // === MORENO VALLEY ===
  {
    name: "13125 Perris Blvd Homeowner",
    email: "perrisblvd.home@gmail.com",
    phone: "951-413-3300",
    city: "Moreno Valley",
    county: "Riverside",
    jurisdiction: "Moreno Valley",
    lotSizeSqft: 8500,
    segment: "H2",
    source: "public_record",
    sourceDetail: "13125 Perris Blvd, Moreno Valley, CA 92553",
    stage: "New",
    estValue: 190000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold family homeowner email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Read ADU family cottage planning guide" }]
  },
  {
    name: "12500 Day St Investor",
    email: "dayst.invest@gmail.com",
    phone: "951-485-4400",
    city: "Moreno Valley",
    county: "Riverside",
    jurisdiction: "Moreno Valley",
    lotSizeSqft: 7000,
    segment: "H1",
    source: "public_record",
    sourceDetail: "12500 Day St, Moreno Valley, CA 92557",
    stage: "New",
    estValue: 170000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Rental ADU investment QR.", consentIp: "76.33.90.8" },
    activities: [{ kind: "visit", summary: "Visited rental income calculator" }]
  },

  // === CORONA ===
  {
    name: "310 S Ramona Ave Downsizer",
    email: "ramonaave.downsize@gmail.com",
    phone: "951-736-2200",
    city: "Corona",
    county: "Riverside",
    jurisdiction: "Corona",
    lotSizeSqft: 8000,
    segment: "H5",
    source: "public_record",
    sourceDetail: "310 S Ramona Ave, Corona, CA 92879",
    stage: "New",
    estValue: 165000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Downsizer empty-nester QR.", consentIp: "174.45.66.5" },
    activities: [{ kind: "visit", summary: "Read downsizing guide on ADU financial benefits" }]
  },
  {
    name: "2500 Foothill Pkwy Investor",
    email: "foothillpkwy.invest@gmail.com",
    phone: "951-279-8800",
    city: "Corona",
    county: "Riverside",
    jurisdiction: "Corona",
    lotSizeSqft: 7500,
    segment: "H1",
    source: "public_record",
    sourceDetail: "2500 Foothill Pkwy, Corona, CA 92882",
    stage: "New",
    estValue: 200000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Rental income cold email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Used ADU rental cash flow projection tool" }]
  },

  // === RANCHO CUCAMONGA ===
  {
    name: "9500 Base Line Rd Estate",
    email: "baselinerd.estate@gmail.com",
    phone: "909-477-2700",
    city: "Rancho Cucamonga",
    county: "San Bernardino",
    jurisdiction: "Rancho Cucamonga",
    lotSizeSqft: 12000,
    segment: "H2",
    source: "public_record",
    sourceDetail: "9500 Base Line Rd, Rancho Cucamonga, CA 91730",
    stage: "New",
    estValue: 310000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Estate family cold email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Viewed premium ADU design catalog" }]
  },
  {
    name: "10400 Foothill Blvd Caregiver",
    email: "foothillblvd.care@gmail.com",
    phone: "909-481-2200",
    city: "Rancho Cucamonga",
    county: "San Bernardino",
    jurisdiction: "Rancho Cucamonga",
    lotSizeSqft: 10000,
    segment: "H3",
    source: "public_record",
    sourceDetail: "10400 Foothill Blvd, Rancho Cucamonga, CA 91730",
    stage: "Contacted",
    estValue: 185000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Caregiver ADU inquiry QR.", consentIp: "98.114.70.9" },
    activities: [{ kind: "visit", summary: "Downloaded aging in place custom build catalog" }]
  },

  // === FONTANA ===
  {
    name: "8350 Sierra Ave Buyer",
    email: "sierraave.buyer@gmail.com",
    phone: "909-350-6600",
    city: "Fontana",
    county: "San Bernardino",
    jurisdiction: "Fontana",
    lotSizeSqft: 8500,
    segment: "H9",
    source: "public_record",
    sourceDetail: "8350 Sierra Ave, Fontana, CA 92335",
    stage: "New",
    estValue: 195000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "New buyer welcome QR.", consentIp: "76.33.88.4" },
    activities: [{ kind: "visit", summary: "Scanned welcome postcard, viewed ADU specs" }]
  },

  // === SAN BERNARDINO ===
  {
    name: "1290 N D St Homeowner",
    email: "ndst.home@gmail.com",
    phone: "909-887-4400",
    city: "San Bernardino",
    county: "San Bernardino",
    jurisdiction: "San Bernardino",
    lotSizeSqft: 9000,
    segment: "H2",
    source: "public_record",
    sourceDetail: "1290 N D St, San Bernardino, CA 92405",
    stage: "New",
    estValue: 165000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold homeowner campaign.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited ADU design gallery" }]
  },

  // === VICTORVILLE ===
  {
    name: "14400 Civic Dr Investor",
    email: "civicdr.invest@gmail.com",
    phone: "760-243-8800",
    city: "Victorville",
    county: "San Bernardino",
    jurisdiction: "Victorville",
    lotSizeSqft: 10000,
    segment: "H1",
    source: "public_record",
    sourceDetail: "14400 Civic Dr, Victorville, CA 92392",
    stage: "New",
    estValue: 145000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Rental investor cold email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Used rental cash flow calculator" }]
  },

  // === PALMDALE / LANCASTER ===
  {
    name: "39650 30th St W Developer",
    email: "30thstw.dev@gmail.com",
    phone: "661-267-5500",
    city: "Palmdale",
    county: "Los Angeles",
    jurisdiction: "Palmdale",
    lotSizeSqft: 14000,
    segment: "H8",
    source: "public_record",
    sourceDetail: "39650 30th St W, Palmdale, CA 93551",
    stage: "New",
    estValue: 380000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "B2B developer campaign.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited multi-ADU development resource page" }]
  },
  {
    name: "1505 W Avenue K Buyer",
    email: "avenyek.buyer@gmail.com",
    phone: "661-945-9900",
    city: "Lancaster",
    county: "Los Angeles",
    jurisdiction: "Lancaster",
    lotSizeSqft: 10500,
    segment: "H9",
    source: "public_record",
    sourceDetail: "1505 W Avenue K, Lancaster, CA 93534",
    stage: "New",
    estValue: 175000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "New buyer welcome QR scan.", consentIp: "174.45.22.6" },
    activities: [{ kind: "visit", summary: "Scanned welcome mailer, read ADU sizing guide" }]
  },

  // === ROSEVILLE / ELK GROVE (Sacramento Metro) ===
  {
    name: "2000 Sunrise Ave Investor",
    email: "sunriseave.invest@gmail.com",
    phone: "916-773-4400",
    city: "Roseville",
    county: "Placer",
    jurisdiction: "Roseville",
    lotSizeSqft: 8500,
    segment: "H1",
    source: "public_record",
    sourceDetail: "2000 Sunrise Ave, Roseville, CA 95661",
    stage: "New",
    estValue: 210000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold rental investor campaign.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited rental cash flow calculator" }]
  },
  {
    name: "1020 Foothills Blvd Family Trust",
    email: "foothillsblvd.family@gmail.com",
    phone: "916-774-2200",
    city: "Roseville",
    county: "Placer",
    jurisdiction: "Roseville",
    lotSizeSqft: 9000,
    segment: "H2",
    source: "public_record",
    sourceDetail: "1020 Foothills Blvd, Roseville, CA 95747",
    stage: "New",
    estValue: 260000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Family ADU info QR scan.", consentIp: "76.44.90.7" },
    activities: [{ kind: "visit", summary: "Read family ADU planning case study" }]
  },
  {
    name: "9500 Elk Grove Blvd Homeowner",
    email: "elkgroveblvd.home@gmail.com",
    phone: "916-685-2200",
    city: "Elk Grove",
    county: "Sacramento",
    jurisdiction: "Elk Grove",
    lotSizeSqft: 9500,
    segment: "H2",
    source: "public_record",
    sourceDetail: "9500 Elk Grove Blvd, Elk Grove, CA 95624",
    stage: "New",
    estValue: 230000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Family homeowner cold email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Viewed family ADU backyard cottage gallery" }]
  },

  // === MODESTO ===
  {
    name: "900 McHenry Ave Investor",
    email: "mchenryave.invest@gmail.com",
    phone: "209-527-8800",
    city: "Modesto",
    county: "Stanislaus",
    jurisdiction: "Modesto",
    lotSizeSqft: 8000,
    segment: "H1",
    source: "public_record",
    sourceDetail: "900 McHenry Ave, Modesto, CA 95350",
    stage: "New",
    estValue: 155000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Rental investor cold email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited rental cash flow calculator" }]
  },
  {
    name: "1530 Oakdale Rd Multigen",
    email: "oakdalerd.family@gmail.com",
    phone: "209-545-4400",
    city: "Modesto",
    county: "Stanislaus",
    jurisdiction: "Modesto",
    lotSizeSqft: 9200,
    segment: "H2",
    source: "public_record",
    sourceDetail: "1530 Oakdale Rd, Modesto, CA 95355",
    stage: "New",
    estValue: 165000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Family ADU QR postcard.", consentIp: "68.22.33.9" },
    activities: [{ kind: "visit", summary: "Read multigenerational ADU planning guide" }]
  },

  // === VISALIA ===
  {
    name: "4200 W Mineral King Ave Homeowner",
    email: "mineralking.home@gmail.com",
    phone: "559-627-2200",
    city: "Visalia",
    county: "Tulare",
    jurisdiction: "Visalia",
    lotSizeSqft: 10000,
    segment: "H2",
    source: "public_record",
    sourceDetail: "4200 W Mineral King Ave, Visalia, CA 93291",
    stage: "New",
    estValue: 155000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Family homeowner cold email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Viewed ADU family cottage photo gallery" }]
  },
  {
    name: "630 N Court St Downsizer",
    email: "courtst.downsize@gmail.com",
    phone: "559-733-8800",
    city: "Visalia",
    county: "Tulare",
    jurisdiction: "Visalia",
    lotSizeSqft: 8500,
    segment: "H5",
    source: "public_record",
    sourceDetail: "630 N Court St, Visalia, CA 93291",
    stage: "New",
    estValue: 140000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Empty-nester campaign QR.", consentIp: "98.150.55.7" },
    activities: [{ kind: "visit", summary: "Read downsizing financial guide" }]
  },

  // === SALINAS ===
  {
    name: "1010 S Main St Family Home",
    email: "smainst.family@gmail.com",
    phone: "831-757-8800",
    city: "Salinas",
    county: "Monterey",
    jurisdiction: "Salinas",
    lotSizeSqft: 7800,
    segment: "H2",
    source: "public_record",
    sourceDetail: "1010 S Main St, Salinas, CA 93901",
    stage: "New",
    estValue: 200000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Family estate cold email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Viewed family ADU backyard cottage layouts" }]
  },
  {
    name: "550 E Alisal St Caregiver",
    email: "ealisal.care@gmail.com",
    phone: "831-422-4400",
    city: "Salinas",
    county: "Monterey",
    jurisdiction: "Salinas",
    lotSizeSqft: 8500,
    segment: "H3",
    source: "public_record",
    sourceDetail: "550 E Alisal St, Salinas, CA 93905",
    stage: "New",
    estValue: 175000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Caregiver ADU QR postcard.", consentIp: "76.88.44.12" },
    activities: [{ kind: "visit", summary: "Downloaded aging in place ADU build catalog" }]
  },

  // === DALY CITY ===
  {
    name: "1200 Geneva Ave Multigen",
    email: "genevaave.family@gmail.com",
    phone: "650-755-8800",
    city: "Daly City",
    county: "San Mateo",
    jurisdiction: "Daly City",
    lotSizeSqft: 5200,
    segment: "H2",
    source: "public_record",
    sourceDetail: "1200 Geneva Ave, Daly City, CA 94014",
    stage: "New",
    estValue: 340000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Family estate cold email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Read multigenerational ADU planning case study" }]
  },

  // === HAYWARD ===
  {
    name: "22300 Foothill Blvd Investor",
    email: "foothillblvd.hayward@gmail.com",
    phone: "510-581-2200",
    city: "Hayward",
    county: "Alameda",
    jurisdiction: "Hayward",
    lotSizeSqft: 7500,
    segment: "H1",
    source: "public_record",
    sourceDetail: "22300 Foothill Blvd, Hayward, CA 94541",
    stage: "New",
    estValue: 230000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold rental investor campaign.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited rental cash flow model" }]
  },
  {
    name: "1000 B St Family Home",
    email: "bst.hayward.family@gmail.com",
    phone: "510-583-8800",
    city: "Hayward",
    county: "Alameda",
    jurisdiction: "Hayward",
    lotSizeSqft: 6800,
    segment: "H2",
    source: "public_record",
    sourceDetail: "1000 B St, Hayward, CA 94541",
    stage: "New",
    estValue: 250000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Scanned family ADU QR.", consentIp: "172.56.33.7" },
    activities: [{ kind: "visit", summary: "Read family backyard cottage guide" }]
  },

  // === INGLEWOOD ===
  {
    name: "310 E Nutwood St Buyer",
    email: "nutwoodst.buyer@gmail.com",
    phone: "310-412-5500",
    city: "Inglewood",
    county: "Los Angeles",
    jurisdiction: "Inglewood",
    lotSizeSqft: 6500,
    segment: "H9",
    source: "public_record",
    sourceDetail: "310 E Nutwood St, Inglewood, CA 90301",
    stage: "New",
    estValue: 215000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "New buyer welcome QR.", consentIp: "76.32.55.8" },
    activities: [{ kind: "visit", summary: "Scanned welcome mailer, read ADU planning guide" }]
  },
  {
    name: "800 N La Brea Ave Investor",
    email: "labreave.invest@gmail.com",
    phone: "310-677-8800",
    city: "Inglewood",
    county: "Los Angeles",
    jurisdiction: "Inglewood",
    lotSizeSqft: 7200,
    segment: "H1",
    source: "public_record",
    sourceDetail: "800 N La Brea Ave, Inglewood, CA 90302",
    stage: "New",
    estValue: 230000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Rental income cold email.", conrentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited rental ADU ROI calculator" }]
  },

  // === WEST COVINA / POMONA / DOWNEY ===
  {
    name: "1500 W Cameron Ave Buyer",
    email: "cameronave.buyer@gmail.com",
    phone: "626-813-9900",
    city: "West Covina",
    county: "Los Angeles",
    jurisdiction: "West Covina",
    lotSizeSqft: 8000,
    segment: "H9",
    source: "public_record",
    sourceDetail: "1500 W Cameron Ave, West Covina, CA 91790",
    stage: "New",
    estValue: 240000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "New buyer QR scan.", consentIp: "98.150.66.4" },
    activities: [{ kind: "visit", summary: "Scanned welcome mailer QR code" }]
  },
  {
    name: "850 S Garey Ave Multigen",
    email: "gareyave.family@gmail.com",
    phone: "909-629-2200",
    city: "Pomona",
    county: "Los Angeles",
    jurisdiction: "Pomona",
    lotSizeSqft: 8500,
    segment: "H2",
    source: "public_record",
    sourceDetail: "850 S Garey Ave, Pomona, CA 91766",
    stage: "New",
    estValue: 215000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Family homeowner cold email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Read multigenerational ADU planning guide" }]
  },
  {
    name: "8300 Florence Ave Investor",
    email: "florenceave.invest@gmail.com",
    phone: "562-622-4400",
    city: "Downey",
    county: "Los Angeles",
    jurisdiction: "Downey",
    lotSizeSqft: 7200,
    segment: "H1",
    source: "public_record",
    sourceDetail: "8300 Florence Ave, Downey, CA 90240",
    stage: "New",
    estValue: 225000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold rental income campaign.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited rental ADU cash flow calculator" }]
  },

  // === EL MONTE ===
  {
    name: "11401 Valley Blvd Homeowner",
    email: "valleyblvd.home@gmail.com",
    phone: "626-580-2200",
    city: "El Monte",
    county: "Los Angeles",
    jurisdiction: "El Monte",
    lotSizeSqft: 7800,
    segment: "H2",
    source: "public_record",
    sourceDetail: "11401 Valley Blvd, El Monte, CA 91731",
    stage: "New",
    estValue: 210000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Family ADU QR postcard.", consentIp: "76.88.77.3" },
    activities: [{ kind: "visit", summary: "Visited family cottage photo gallery" }]
  },

  // === REDDING ===
  {
    name: "2700 Hilltop Dr Homeowner",
    email: "hilltopdr.home@gmail.com",
    phone: "530-241-8800",
    city: "Redding",
    county: "Shasta",
    jurisdiction: "Redding",
    lotSizeSqft: 10000,
    segment: "H2",
    source: "public_record",
    sourceDetail: "2700 Hilltop Dr, Redding, CA 96002",
    stage: "New",
    estValue: 170000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold homeowner ADU campaign.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Read ADU family cottage planning guide" }]
  },
  {
    name: "1200 South St Investor",
    email: "southst.redding.invest@gmail.com",
    phone: "530-244-4400",
    city: "Redding",
    county: "Shasta",
    jurisdiction: "Redding",
    lotSizeSqft: 9000,
    segment: "H1",
    source: "public_record",
    sourceDetail: "1200 South St, Redding, CA 96001",
    stage: "New",
    estValue: 155000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Rental ADU investment QR.", consentIp: "172.56.99.8" },
    activities: [{ kind: "visit", summary: "Used rental income projection calculator" }]
  },

  // === IRVINE (more) ===
  {
    name: "15555 Sand Canyon Ave Studio",
    email: "sandcanyonave.studio@gmail.com",
    phone: "949-724-2200",
    city: "Irvine",
    county: "Orange",
    jurisdiction: "Orange County",
    lotSizeSqft: 8500,
    segment: "H4",
    source: "public_record",
    sourceDetail: "15555 Sand Canyon Ave, Irvine, CA 92618",
    stage: "New",
    estValue: 310000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "WFH tech studio cold email.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Visited premium backyard office studio page" }]
  },
  {
    name: "18 Morgan Caregiver Suite",
    email: "morgan.caregiver@gmail.com",
    phone: "949-553-8800",
    city: "Irvine",
    county: "Orange",
    jurisdiction: "Orange County",
    lotSizeSqft: 7000,
    segment: "H3",
    source: "public_record",
    sourceDetail: "18 Morgan, Irvine, CA 92618",
    stage: "Contacted",
    estValue: 280000,
    ab1033Eligible: false,
    consent: { emailOptIn: true, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Cold senior caregiver outreach.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Downloaded aging in place custom build catalog" }]
  },

  // === ADDITIONAL DNC/SUPPRESSED (from new markets) ===
  {
    name: "900 Civic Center Dr DNC",
    email: "civic.dnc@gmail.com",
    phone: "714-555-0606",
    city: "Anaheim",
    county: "Orange",
    jurisdiction: "Anaheim",
    lotSizeSqft: 7000,
    segment: "H2",
    source: "public_record",
    sourceDetail: "900 Civic Center Dr, Anaheim, CA 92805",
    stage: "New",
    estValue: 230000,
    ab1033Eligible: false,
    consent: { emailOptIn: false, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Requested DNC via reply.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Replied: Do not contact again" }]
  },
  {
    name: "5500 Sunset Blvd Owner DNC",
    email: "sunsetblvd.dnc@outlook.com",
    phone: "323-555-0707",
    city: "Los Angeles",
    county: "Los Angeles",
    jurisdiction: "Los Angeles",
    lotSizeSqft: 6500,
    segment: "H1",
    source: "public_record",
    sourceDetail: "5500 Sunset Blvd, Los Angeles, CA 90028",
    stage: "New",
    estValue: 290000,
    ab1033Eligible: false,
    consent: { emailOptIn: false, phoneOptIn: false, smsOptIn: false, consentSource: "outreach", consentText: "Unsubscribed from all emails.", consentIp: "127.0.0.1" },
    activities: [{ kind: "visit", summary: "Clicked unsubscribe link in email footer" }]
  },
  {
    name: "100 Main St Salinas DNC",
    email: "salinas.dnc@gmail.com",
    phone: "831-555-0808",
    city: "Salinas",
    county: "Monterey",
    jurisdiction: "Salinas",
    lotSizeSqft: 8500,
    segment: "H3",
    source: "public_record",
    sourceDetail: "100 Main St, Salinas, CA 93901",
    stage: "New",
    estValue: 180000,
    ab1033Eligible: false,
    consent: { emailOptIn: false, phoneOptIn: false, smsOptIn: false, consentSource: "mail_qr", consentText: "Requested removal from mailing list.", consentIp: "76.88.55.9" },
    activities: [{ kind: "visit", summary: "Replied: Please remove from list" }]
  },
];

// Helper to calculate score
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
  console.log("Starting Statewide California Expansion Seeding...");

  // 1. Seed new jurisdictions
  for (const j of newJurisdictions) {
    await prisma.jurisdiction.upsert({
      where: { name: j.name },
      update: { ab1033OptIn: j.ab1033OptIn, notes: j.notes },
      create: j,
    }).catch(() => {}); // skip dupes
  }
  console.log("Successfully seeded/updated new California jurisdictions.");

  // 2. Prepare list of emails to purge from Suppression table to avoid duplicate constraints
  const emailsToClear = expansionLeads.map(h => h.email);
  await prisma.suppression.deleteMany({
    where: { value: { in: emailsToClear } }
  });

  let seededCount = 0;
  let skippedCount = 0;

  for (const h of expansionLeads) {
    // Check if email already exists
    const existing = await prisma.lead.findFirst({ where: { email: h.email } });
    if (existing) {
      skippedCount++;
      continue;
    }

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
            consentIp: h.consent.consentIp || "127.0.0.1",
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
      const existing = await prisma.enrollmentState.findFirst({
        where: { leadId: lead.id, sequenceId: seq.id }
      });
      if (!existing) {
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
  }

  console.log(`\n✅ Statewide Expansion Complete!`);
  console.log(`   Seeded: ${seededCount} new leads`);
  console.log(`   Skipped (duplicates): ${skippedCount}`);

  // Print totals
  const total = await prisma.lead.count();
  const homeowners = await prisma.lead.count({ where: { type: 'homeowner' } });
  const suppressionCount = await prisma.suppression.count();
  const jurisdictionCount = await prisma.jurisdiction.count();
  console.log(`\n📊 Database Totals:`);
  console.log(`   Total Leads: ${total}`);
  console.log(`   Homeowners: ${homeowners}`);
  console.log(`   Suppressions (DNC): ${suppressionCount}`);
  console.log(`   Jurisdictions tracked: ${jurisdictionCount}`);
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
