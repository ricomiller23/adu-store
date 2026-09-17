require("dotenv").config();
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const expansionLeads = [
  {
    "name": "7417 Alton Pkwy Property Owner",
    "contactName": "Daniel Kim",
    "email": "danielkim.adu7417@gmail.com",
    "phone": "926-555-3001",
    "city": "Irvine",
    "county": "Orange",
    "jurisdiction": "Irvine",
    "lotSizeSqft": 6200,
    "segment": "H4",
    "source": "public_record",
    "sourceDetail": "7417 Alton Pkwy, Irvine, CA 92618",
    "stage": "New",
    "estValue": 184600,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.1.3"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Irvine ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7434 Culver Dr Property Owner",
    "contactName": "Christine Wu",
    "email": "christinewu.adu7434@yahoo.com",
    "phone": "926-555-3002",
    "city": "Irvine",
    "county": "Orange",
    "jurisdiction": "Irvine",
    "lotSizeSqft": 7100,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "7434 Culver Dr, Irvine, CA 92618",
    "stage": "Contacted",
    "estValue": 326500,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.2.6"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Irvine ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      }
    ]
  },
  {
    "name": "7451 Harvard Ave Property Owner",
    "contactName": "Robert Anderson",
    "email": "robertanderson.adu7451@outlook.com",
    "phone": "926-555-3003",
    "city": "Irvine",
    "county": "Orange",
    "jurisdiction": "Irvine",
    "lotSizeSqft": 8400,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "7451 Harvard Ave, Irvine, CA 92618",
    "stage": "New",
    "estValue": 264000,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.3.9"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Irvine ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7468 Yale Ave Property Owner",
    "contactName": "Michael Chang",
    "email": "michaelchang.adu7468@gmail.com",
    "phone": "926-555-3004",
    "city": "Irvine",
    "county": "Orange",
    "jurisdiction": "Irvine",
    "lotSizeSqft": 6800,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "7468 Yale Ave, Irvine, CA 92618",
    "stage": "New",
    "estValue": 248000,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.4.12"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Irvine ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7485 Bryan Ave Property Owner",
    "contactName": "Sophia Patel",
    "email": "sophiapatel.adu7485@yahoo.com",
    "phone": "926-555-3005",
    "city": "Irvine",
    "county": "Orange",
    "jurisdiction": "Irvine",
    "lotSizeSqft": 9500,
    "segment": "H8",
    "source": "public_record",
    "sourceDetail": "7485 Bryan Ave, Irvine, CA 92618",
    "stage": "New",
    "estValue": 362500,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.5.15"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Irvine ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7502 Jeffrey Rd Property Owner",
    "contactName": "William Evans",
    "email": "williamevans.adu7502@outlook.com",
    "phone": "926-555-3006",
    "city": "Irvine",
    "county": "Orange",
    "jurisdiction": "Irvine",
    "lotSizeSqft": 7500,
    "segment": "H3",
    "source": "public_record",
    "sourceDetail": "7502 Jeffrey Rd, Irvine, CA 92618",
    "stage": "New",
    "estValue": 195000,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.6.18"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Irvine ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7519 Barranca Pkwy Property Owner",
    "contactName": "Jessica Liu",
    "email": "jessicaliu.adu7519@gmail.com",
    "phone": "926-555-3007",
    "city": "Irvine",
    "county": "Orange",
    "jurisdiction": "Irvine",
    "lotSizeSqft": 6300,
    "segment": "H9",
    "source": "public_record",
    "sourceDetail": "7519 Barranca Pkwy, Irvine, CA 92618",
    "stage": "New",
    "estValue": 185400,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.7.21"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Irvine ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7536 Sand Canyon Rd Property Owner",
    "contactName": "David Tanaka",
    "email": "davidtanaka.adu7536@yahoo.com",
    "phone": "926-555-3008",
    "city": "Irvine",
    "county": "Orange",
    "jurisdiction": "Irvine",
    "lotSizeSqft": 8800,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "7536 Sand Canyon Rd, Irvine, CA 92618",
    "stage": "New",
    "estValue": 352000,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.8.24"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Irvine ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7553 Bayside Dr Property Owner",
    "contactName": "Victoria Sterling",
    "email": "victoriasterling.adu7553@outlook.com",
    "phone": "926-555-3009",
    "city": "Newport Beach",
    "county": "Orange",
    "jurisdiction": "Newport Beach",
    "lotSizeSqft": 7800,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "7553 Bayside Dr, Newport Beach, CA 92660",
    "stage": "Contacted",
    "estValue": 337000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.9.27"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Newport Beach ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      }
    ]
  },
  {
    "name": "7570 MacArthur Blvd Property Owner",
    "contactName": "Harrison Wells",
    "email": "harrisonwells.adu7570@gmail.com",
    "phone": "926-555-3010",
    "city": "Newport Beach",
    "county": "Orange",
    "jurisdiction": "Newport Beach",
    "lotSizeSqft": 9200,
    "segment": "H8",
    "source": "public_record",
    "sourceDetail": "7570 MacArthur Blvd, Newport Beach, CA 92660",
    "stage": "New",
    "estValue": 358000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.10.30"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Newport Beach ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7587 Irvine Ave Property Owner",
    "contactName": "Catherine Vance",
    "email": "catherinevance.adu7587@yahoo.com",
    "phone": "926-555-3011",
    "city": "Newport Beach",
    "county": "Orange",
    "jurisdiction": "Newport Beach",
    "lotSizeSqft": 8100,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "7587 Irvine Ave, Newport Beach, CA 92660",
    "stage": "New",
    "estValue": 261000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.11.33"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Newport Beach ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7604 Dover Dr Property Owner",
    "contactName": "Brian Callahan",
    "email": "briancallahan.adu7604@outlook.com",
    "phone": "926-555-3012",
    "city": "Newport Beach",
    "county": "Orange",
    "jurisdiction": "Newport Beach",
    "lotSizeSqft": 6900,
    "segment": "H4",
    "source": "public_record",
    "sourceDetail": "7604 Dover Dr, Newport Beach, CA 92660",
    "stage": "New",
    "estValue": 190200,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.12.36"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Newport Beach ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7621 Jamboree Rd Property Owner",
    "contactName": "Jonathan Reed",
    "email": "jonathanreed.adu7621@gmail.com",
    "phone": "926-555-3013",
    "city": "Newport Beach",
    "county": "Orange",
    "jurisdiction": "Newport Beach",
    "lotSizeSqft": 11000,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "7621 Jamboree Rd, Newport Beach, CA 92660",
    "stage": "New",
    "estValue": 290000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.13.39"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Newport Beach ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7638 Adams Ave Property Owner",
    "contactName": "Gary Thompson",
    "email": "garythompson.adu7638@yahoo.com",
    "phone": "926-555-3014",
    "city": "Huntington Beach",
    "county": "Orange",
    "jurisdiction": "Huntington Beach",
    "lotSizeSqft": 6500,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "7638 Adams Ave, Huntington Beach, CA 92648",
    "stage": "In design",
    "estValue": 317500,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.14.42"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Huntington Beach ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      },
      {
        "kind": "consult",
        "summary": "Scheduled Feasibility Site Evaluation"
      }
    ]
  },
  {
    "name": "7655 Bushard St Property Owner",
    "contactName": "Laura Martinez",
    "email": "lauramartinez.adu7655@outlook.com",
    "phone": "926-555-3015",
    "city": "Huntington Beach",
    "county": "Orange",
    "jurisdiction": "Huntington Beach",
    "lotSizeSqft": 7200,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "7655 Bushard St, Huntington Beach, CA 92648",
    "stage": "New",
    "estValue": 252000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.15.45"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Huntington Beach ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7672 Brookhurst St Property Owner",
    "contactName": "Kevin O'Connor",
    "email": "kevinoconnor.adu7672@gmail.com",
    "phone": "926-555-3016",
    "city": "Huntington Beach",
    "county": "Orange",
    "jurisdiction": "Huntington Beach",
    "lotSizeSqft": 8300,
    "segment": "H7",
    "source": "public_record",
    "sourceDetail": "7672 Brookhurst St, Huntington Beach, CA 92648",
    "stage": "Contacted",
    "estValue": 201400,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.16.48"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Huntington Beach ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      }
    ]
  },
  {
    "name": "7689 Indianapolis Ave Property Owner",
    "contactName": "Nancy Higgins",
    "email": "nancyhiggins.adu7689@yahoo.com",
    "phone": "926-555-3017",
    "city": "Huntington Beach",
    "county": "Orange",
    "jurisdiction": "Huntington Beach",
    "lotSizeSqft": 6800,
    "segment": "H3",
    "source": "public_record",
    "sourceDetail": "7689 Indianapolis Ave, Huntington Beach, CA 92648",
    "stage": "New",
    "estValue": 189400,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.17.51"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Huntington Beach ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7706 Garfield Ave Property Owner",
    "contactName": "Steven Ross",
    "email": "stevenross.adu7706@outlook.com",
    "phone": "926-555-3018",
    "city": "Huntington Beach",
    "county": "Orange",
    "jurisdiction": "Huntington Beach",
    "lotSizeSqft": 7400,
    "segment": "H4",
    "source": "public_record",
    "sourceDetail": "7706 Garfield Ave, Huntington Beach, CA 92648",
    "stage": "New",
    "estValue": 194200,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.18.54"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Huntington Beach ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7723 Atlanta Ave Property Owner",
    "contactName": "Ashley Crawford",
    "email": "ashleycrawford.adu7723@gmail.com",
    "phone": "926-555-3019",
    "city": "Huntington Beach",
    "county": "Orange",
    "jurisdiction": "Huntington Beach",
    "lotSizeSqft": 6100,
    "segment": "H9",
    "source": "public_record",
    "sourceDetail": "7723 Atlanta Ave, Huntington Beach, CA 92648",
    "stage": "New",
    "estValue": 183800,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.19.57"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Huntington Beach ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7740 Brookhurst St Property Owner",
    "contactName": "Eduardo Morales",
    "email": "eduardomorales.adu7740@yahoo.com",
    "phone": "928-555-3020",
    "city": "Anaheim",
    "county": "Orange",
    "jurisdiction": "Anaheim",
    "lotSizeSqft": 7500,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "7740 Brookhurst St, Anaheim, CA 92804",
    "stage": "New",
    "estValue": 332500,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.20.60"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Anaheim ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7757 Euclid St Property Owner",
    "contactName": "Fatima Al-Mansoor",
    "email": "fatimaal-mansoor.adu7757@outlook.com",
    "phone": "928-555-3021",
    "city": "Anaheim",
    "county": "Orange",
    "jurisdiction": "Anaheim",
    "lotSizeSqft": 8200,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "7757 Euclid St, Anaheim, CA 92804",
    "stage": "New",
    "estValue": 262000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.21.63"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Anaheim ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7774 Ball Rd Property Owner",
    "contactName": "Jason Nguyen",
    "email": "jasonnguyen.adu7774@gmail.com",
    "phone": "928-555-3022",
    "city": "Anaheim",
    "county": "Orange",
    "jurisdiction": "Anaheim",
    "lotSizeSqft": 6700,
    "segment": "H7",
    "source": "public_record",
    "sourceDetail": "7774 Ball Rd, Anaheim, CA 92804",
    "stage": "New",
    "estValue": 188600,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.22.66"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Anaheim ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7791 Lincoln Ave Property Owner",
    "contactName": "Carlos Mendez",
    "email": "carlosmendez.adu7791@yahoo.com",
    "phone": "928-555-3023",
    "city": "Anaheim",
    "county": "Orange",
    "jurisdiction": "Anaheim",
    "lotSizeSqft": 7900,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "7791 Lincoln Ave, Anaheim, CA 92804",
    "stage": "Contacted",
    "estValue": 259000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.23.69"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Anaheim ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      }
    ]
  },
  {
    "name": "7808 Cerritos Ave Property Owner",
    "contactName": "Sandeep Sharma",
    "email": "sandeepsharma.adu7808@outlook.com",
    "phone": "928-555-3024",
    "city": "Anaheim",
    "county": "Orange",
    "jurisdiction": "Anaheim",
    "lotSizeSqft": 9000,
    "segment": "H8",
    "source": "public_record",
    "sourceDetail": "7808 Cerritos Ave, Anaheim, CA 92804",
    "stage": "New",
    "estValue": 355000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.24.72"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Anaheim ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7825 State College Blvd Property Owner",
    "contactName": "Michelle Tran",
    "email": "michelletran.adu7825@gmail.com",
    "phone": "928-555-3025",
    "city": "Anaheim",
    "county": "Orange",
    "jurisdiction": "Anaheim",
    "lotSizeSqft": 6400,
    "segment": "H4",
    "source": "public_record",
    "sourceDetail": "7825 State College Blvd, Anaheim, CA 92804",
    "stage": "New",
    "estValue": 186200,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.25.75"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Anaheim ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7842 Malvern Ave Property Owner",
    "contactName": "Thomas Bradley",
    "email": "thomasbradley.adu7842@yahoo.com",
    "phone": "928-555-3026",
    "city": "Fullerton",
    "county": "Orange",
    "jurisdiction": "Fullerton",
    "lotSizeSqft": 8600,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "7842 Malvern Ave, Fullerton, CA 92832",
    "stage": "New",
    "estValue": 266000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.26.78"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Fullerton ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7859 Chapman Ave Property Owner",
    "contactName": "Eric Gustafson",
    "email": "ericgustafson.adu7859@outlook.com",
    "phone": "928-555-3027",
    "city": "Fullerton",
    "county": "Orange",
    "jurisdiction": "Fullerton",
    "lotSizeSqft": 7400,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "7859 Chapman Ave, Fullerton, CA 92832",
    "stage": "New",
    "estValue": 331000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.27.81"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Fullerton ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7876 Euclid St Property Owner",
    "contactName": "Barbara Jensen",
    "email": "barbarajensen.adu7876@gmail.com",
    "phone": "928-555-3028",
    "city": "Fullerton",
    "county": "Orange",
    "jurisdiction": "Fullerton",
    "lotSizeSqft": 6900,
    "segment": "H3",
    "source": "public_record",
    "sourceDetail": "7876 Euclid St, Fullerton, CA 92832",
    "stage": "New",
    "estValue": 190200,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.28.84"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Fullerton ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7893 Gilbert St Property Owner",
    "contactName": "Anthony Ricci",
    "email": "anthonyricci.adu7893@yahoo.com",
    "phone": "928-555-3029",
    "city": "Fullerton",
    "county": "Orange",
    "jurisdiction": "Fullerton",
    "lotSizeSqft": 9100,
    "segment": "H7",
    "source": "public_record",
    "sourceDetail": "7893 Gilbert St, Fullerton, CA 92832",
    "stage": "New",
    "estValue": 207800,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.29.87"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Fullerton ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7910 Bastanchury Rd Property Owner",
    "contactName": "Patrick Hennessey",
    "email": "patrickhennessey.adu7910@outlook.com",
    "phone": "928-555-3030",
    "city": "Fullerton",
    "county": "Orange",
    "jurisdiction": "Fullerton",
    "lotSizeSqft": 12500,
    "segment": "H8",
    "source": "public_record",
    "sourceDetail": "7910 Bastanchury Rd, Fullerton, CA 92832",
    "stage": "Contacted",
    "estValue": 407500,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.30.90"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Fullerton ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      }
    ]
  },
  {
    "name": "7927 Baker St Property Owner",
    "contactName": "Travis Barker",
    "email": "travisbarker.adu7927@gmail.com",
    "phone": "926-555-3031",
    "city": "Costa Mesa",
    "county": "Orange",
    "jurisdiction": "Costa Mesa",
    "lotSizeSqft": 6700,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "7927 Baker St, Costa Mesa, CA 92626",
    "stage": "New",
    "estValue": 320500,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.31.93"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Costa Mesa ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7944 Newport Blvd Property Owner",
    "contactName": "Chloe Bennett",
    "email": "chloebennett.adu7944@yahoo.com",
    "phone": "926-555-3032",
    "city": "Costa Mesa",
    "county": "Orange",
    "jurisdiction": "Costa Mesa",
    "lotSizeSqft": 7800,
    "segment": "H4",
    "source": "public_record",
    "sourceDetail": "7944 Newport Blvd, Costa Mesa, CA 92626",
    "stage": "New",
    "estValue": 197400,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.32.96"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Costa Mesa ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7961 Fair Dr Property Owner",
    "contactName": "Marcus Holloway",
    "email": "marcusholloway.adu7961@outlook.com",
    "phone": "926-555-3033",
    "city": "Costa Mesa",
    "county": "Orange",
    "jurisdiction": "Costa Mesa",
    "lotSizeSqft": 8100,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "7961 Fair Dr, Costa Mesa, CA 92626",
    "stage": "In design",
    "estValue": 261000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.33.99"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Costa Mesa ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      },
      {
        "kind": "consult",
        "summary": "Scheduled Feasibility Site Evaluation"
      }
    ]
  },
  {
    "name": "7978 Adams Ave Property Owner",
    "contactName": "Rachel Green",
    "email": "rachelgreen.adu7978@gmail.com",
    "phone": "926-555-3034",
    "city": "Costa Mesa",
    "county": "Orange",
    "jurisdiction": "Costa Mesa",
    "lotSizeSqft": 6400,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "7978 Adams Ave, Costa Mesa, CA 92626",
    "stage": "New",
    "estValue": 244000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.34.102"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Costa Mesa ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "7995 Marguerite Pkwy Property Owner",
    "contactName": "Scott Phillips",
    "email": "scottphillips.adu7995@yahoo.com",
    "phone": "926-555-3035",
    "city": "Mission Viejo",
    "county": "Orange",
    "jurisdiction": "Mission Viejo",
    "lotSizeSqft": 8800,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "7995 Marguerite Pkwy, Mission Viejo, CA 92691",
    "stage": "New",
    "estValue": 268000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.35.105"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Mission Viejo ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8012 Alicia Pkwy Property Owner",
    "contactName": "Donna Summerfield",
    "email": "donnasummerfield.adu8012@outlook.com",
    "phone": "926-555-3036",
    "city": "Mission Viejo",
    "county": "Orange",
    "jurisdiction": "Mission Viejo",
    "lotSizeSqft": 7300,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "8012 Alicia Pkwy, Mission Viejo, CA 92691",
    "stage": "New",
    "estValue": 253000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.36.108"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Mission Viejo ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8029 Olympiad Rd Property Owner",
    "contactName": "Raymond Cruz",
    "email": "raymondcruz.adu8029@gmail.com",
    "phone": "926-555-3037",
    "city": "Mission Viejo",
    "county": "Orange",
    "jurisdiction": "Mission Viejo",
    "lotSizeSqft": 9600,
    "segment": "H3",
    "source": "public_record",
    "sourceDetail": "8029 Olympiad Rd, Mission Viejo, CA 92691",
    "stage": "Contacted",
    "estValue": 211800,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.37.111"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Mission Viejo ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      }
    ]
  },
  {
    "name": "8046 Los Alisos Blvd Property Owner",
    "contactName": "Amanda Fletcher",
    "email": "amandafletcher.adu8046@yahoo.com",
    "phone": "926-555-3038",
    "city": "Mission Viejo",
    "county": "Orange",
    "jurisdiction": "Mission Viejo",
    "lotSizeSqft": 6800,
    "segment": "H4",
    "source": "public_record",
    "sourceDetail": "8046 Los Alisos Blvd, Mission Viejo, CA 92691",
    "stage": "New",
    "estValue": 189400,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.38.114"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Mission Viejo ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8063 Victoria Ave Property Owner",
    "contactName": "Franklin Castillo",
    "email": "franklincastillo.adu8063@outlook.com",
    "phone": "925-555-3039",
    "city": "Riverside",
    "county": "Riverside",
    "jurisdiction": "Riverside",
    "lotSizeSqft": 14500,
    "segment": "H8",
    "source": "public_record",
    "sourceDetail": "8063 Victoria Ave, Riverside, CA 92506",
    "stage": "New",
    "estValue": 437500,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.39.117"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Riverside ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8080 Magnolia Ave Property Owner",
    "contactName": "Lillian Ward",
    "email": "lillianward.adu8080@gmail.com",
    "phone": "925-555-3040",
    "city": "Riverside",
    "county": "Riverside",
    "jurisdiction": "Riverside",
    "lotSizeSqft": 7800,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "8080 Magnolia Ave, Riverside, CA 92506",
    "stage": "New",
    "estValue": 337000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.40.120"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Riverside ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8097 Arlington Ave Property Owner",
    "contactName": "Hector Ramirez",
    "email": "hectorramirez.adu8097@yahoo.com",
    "phone": "925-555-3041",
    "city": "Riverside",
    "county": "Riverside",
    "jurisdiction": "Riverside",
    "lotSizeSqft": 8200,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "8097 Arlington Ave, Riverside, CA 92506",
    "stage": "New",
    "estValue": 262000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.41.123"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Riverside ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8114 Van Buren Blvd Property Owner",
    "contactName": "Samuel Washington",
    "email": "samuelwashington.adu8114@outlook.com",
    "phone": "925-555-3042",
    "city": "Riverside",
    "county": "Riverside",
    "jurisdiction": "Riverside",
    "lotSizeSqft": 9400,
    "segment": "H7",
    "source": "public_record",
    "sourceDetail": "8114 Van Buren Blvd, Riverside, CA 92506",
    "stage": "New",
    "estValue": 210200,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.42.126"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Riverside ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8131 Overlook Pkwy Property Owner",
    "contactName": "Charles Montgomery",
    "email": "charlesmontgomery.adu8131@gmail.com",
    "phone": "925-555-3043",
    "city": "Riverside",
    "county": "Riverside",
    "jurisdiction": "Riverside",
    "lotSizeSqft": 11200,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "8131 Overlook Pkwy, Riverside, CA 92506",
    "stage": "New",
    "estValue": 292000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.43.129"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Riverside ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8148 Central Ave Property Owner",
    "contactName": "Valerie Soto",
    "email": "valeriesoto.adu8148@yahoo.com",
    "phone": "925-555-3044",
    "city": "Riverside",
    "county": "Riverside",
    "jurisdiction": "Riverside",
    "lotSizeSqft": 6900,
    "segment": "H4",
    "source": "public_record",
    "sourceDetail": "8148 Central Ave, Riverside, CA 92506",
    "stage": "Contacted",
    "estValue": 190200,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.44.132"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Riverside ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      }
    ]
  },
  {
    "name": "8165 Canyon Crest Dr Property Owner",
    "contactName": "Peter Drummond",
    "email": "peterdrummond.adu8165@outlook.com",
    "phone": "925-555-3045",
    "city": "Riverside",
    "county": "Riverside",
    "jurisdiction": "Riverside",
    "lotSizeSqft": 8500,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "8165 Canyon Crest Dr, Riverside, CA 92506",
    "stage": "New",
    "estValue": 265000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.45.135"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Riverside ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8182 Ontario Ave Property Owner",
    "contactName": "Manuel Ortiz",
    "email": "manuelortiz.adu8182@gmail.com",
    "phone": "928-555-3046",
    "city": "Corona",
    "county": "Riverside",
    "jurisdiction": "Corona",
    "lotSizeSqft": 8400,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "8182 Ontario Ave, Corona, CA 92882",
    "stage": "New",
    "estValue": 346000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.46.138"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Corona ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8199 Lincoln Ave Property Owner",
    "contactName": "Stephanie Briggs",
    "email": "stephaniebriggs.adu8199@yahoo.com",
    "phone": "928-555-3047",
    "city": "Corona",
    "county": "Riverside",
    "jurisdiction": "Corona",
    "lotSizeSqft": 7600,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "8199 Lincoln Ave, Corona, CA 92882",
    "stage": "New",
    "estValue": 256000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.47.141"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Corona ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8216 Main St Property Owner",
    "contactName": "Donald Vance",
    "email": "donaldvance.adu8216@outlook.com",
    "phone": "928-555-3048",
    "city": "Corona",
    "county": "Riverside",
    "jurisdiction": "Corona",
    "lotSizeSqft": 6900,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "8216 Main St, Corona, CA 92882",
    "stage": "New",
    "estValue": 249000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.48.144"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Corona ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8233 Foothill Pkwy Property Owner",
    "contactName": "Arthur Pendelton",
    "email": "arthurpendelton.adu8233@gmail.com",
    "phone": "928-555-3049",
    "city": "Corona",
    "county": "Riverside",
    "jurisdiction": "Corona",
    "lotSizeSqft": 10500,
    "segment": "H8",
    "source": "public_record",
    "sourceDetail": "8233 Foothill Pkwy, Corona, CA 92882",
    "stage": "New",
    "estValue": 377500,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.49.147"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Corona ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8250 Green River Rd Property Owner",
    "contactName": "Kelly Donovan",
    "email": "kellydonovan.adu8250@yahoo.com",
    "phone": "928-555-3050",
    "city": "Corona",
    "county": "Riverside",
    "jurisdiction": "Corona",
    "lotSizeSqft": 8900,
    "segment": "H4",
    "source": "public_record",
    "sourceDetail": "8250 Green River Rd, Corona, CA 92882",
    "stage": "New",
    "estValue": 206200,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.50.150"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Corona ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8267 Border Ave Property Owner",
    "contactName": "Ramon Gutierrez",
    "email": "ramongutierrez.adu8267@outlook.com",
    "phone": "928-555-3051",
    "city": "Corona",
    "county": "Riverside",
    "jurisdiction": "Corona",
    "lotSizeSqft": 7200,
    "segment": "H7",
    "source": "public_record",
    "sourceDetail": "8267 Border Ave, Corona, CA 92882",
    "stage": "Contacted",
    "estValue": 192600,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.51.153"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Corona ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      }
    ]
  },
  {
    "name": "8284 Rancho California Rd Property Owner",
    "contactName": "Gregory Thorne",
    "email": "gregorythorne.adu8284@gmail.com",
    "phone": "925-555-3052",
    "city": "Temecula",
    "county": "Riverside",
    "jurisdiction": "Temecula",
    "lotSizeSqft": 18500,
    "segment": "H8",
    "source": "public_record",
    "sourceDetail": "8284 Rancho California Rd, Temecula, CA 92591",
    "stage": "In design",
    "estValue": 497500,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.52.156"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Temecula ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      },
      {
        "kind": "consult",
        "summary": "Scheduled Feasibility Site Evaluation"
      }
    ]
  },
  {
    "name": "8301 Pechanga Pkwy Property Owner",
    "contactName": "Debra Callahan",
    "email": "debracallahan.adu8301@yahoo.com",
    "phone": "925-555-3053",
    "city": "Temecula",
    "county": "Riverside",
    "jurisdiction": "Temecula",
    "lotSizeSqft": 8900,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "8301 Pechanga Pkwy, Temecula, CA 92591",
    "stage": "New",
    "estValue": 269000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.53.159"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Temecula ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8318 Butterfield Stage Rd Property Owner",
    "contactName": "Kenneth Alvarez",
    "email": "kennethalvarez.adu8318@outlook.com",
    "phone": "925-555-3054",
    "city": "Temecula",
    "county": "Riverside",
    "jurisdiction": "Temecula",
    "lotSizeSqft": 9600,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "8318 Butterfield Stage Rd, Temecula, CA 92591",
    "stage": "New",
    "estValue": 364000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.54.162"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Temecula ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8335 Ynez Rd Property Owner",
    "contactName": "Megan Zimmerman",
    "email": "meganzimmerman.adu8335@gmail.com",
    "phone": "925-555-3055",
    "city": "Temecula",
    "county": "Riverside",
    "jurisdiction": "Temecula",
    "lotSizeSqft": 7400,
    "segment": "H4",
    "source": "public_record",
    "sourceDetail": "8335 Ynez Rd, Temecula, CA 92591",
    "stage": "New",
    "estValue": 194200,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.55.165"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Temecula ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8352 Margarita Rd Property Owner",
    "contactName": "Curtis Vance",
    "email": "curtisvance.adu8352@yahoo.com",
    "phone": "925-555-3056",
    "city": "Temecula",
    "county": "Riverside",
    "jurisdiction": "Temecula",
    "lotSizeSqft": 8100,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "8352 Margarita Rd, Temecula, CA 92591",
    "stage": "New",
    "estValue": 261000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.56.168"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Temecula ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8369 California Oaks Rd Property Owner",
    "contactName": "Vincent Navarro",
    "email": "vincentnavarro.adu8369@outlook.com",
    "phone": "925-555-3057",
    "city": "Murrieta",
    "county": "Riverside",
    "jurisdiction": "Murrieta",
    "lotSizeSqft": 8300,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "8369 California Oaks Rd, Murrieta, CA 92562",
    "stage": "New",
    "estValue": 263000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.57.171"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Murrieta ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8386 Murrieta Hot Springs Rd Property Owner",
    "contactName": "Bradley Scott",
    "email": "bradleyscott.adu8386@gmail.com",
    "phone": "925-555-3058",
    "city": "Murrieta",
    "county": "Riverside",
    "jurisdiction": "Murrieta",
    "lotSizeSqft": 7700,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "8386 Murrieta Hot Springs Rd, Murrieta, CA 92562",
    "stage": "Contacted",
    "estValue": 335500,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.58.174"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Murrieta ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      }
    ]
  },
  {
    "name": "8403 Whitewood Rd Property Owner",
    "contactName": "Diane Kowalski",
    "email": "dianekowalski.adu8403@yahoo.com",
    "phone": "925-555-3059",
    "city": "Murrieta",
    "county": "Riverside",
    "jurisdiction": "Murrieta",
    "lotSizeSqft": 9200,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "8403 Whitewood Rd, Murrieta, CA 92562",
    "stage": "New",
    "estValue": 272000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.59.177"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Murrieta ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8420 Clinton Keith Rd Property Owner",
    "contactName": "Trevor Blackwood",
    "email": "trevorblackwood.adu8420@outlook.com",
    "phone": "925-555-3060",
    "city": "Murrieta",
    "county": "Riverside",
    "jurisdiction": "Murrieta",
    "lotSizeSqft": 11500,
    "segment": "H8",
    "source": "public_record",
    "sourceDetail": "8420 Clinton Keith Rd, Murrieta, CA 92562",
    "stage": "New",
    "estValue": 392500,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.60.180"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Murrieta ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8437 Haven Ave Property Owner",
    "contactName": "Leonard Harris",
    "email": "leonardharris.adu8437@gmail.com",
    "phone": "917-555-3061",
    "city": "Rancho Cucamonga",
    "county": "San Bernardino",
    "jurisdiction": "Rancho Cucamonga",
    "lotSizeSqft": 8800,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "8437 Haven Ave, Rancho Cucamonga, CA 91730",
    "stage": "New",
    "estValue": 352000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.61.183"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Rancho Cucamonga ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8454 Milliken Ave Property Owner",
    "contactName": "Joanne Wheeler",
    "email": "joannewheeler.adu8454@yahoo.com",
    "phone": "917-555-3062",
    "city": "Rancho Cucamonga",
    "county": "San Bernardino",
    "jurisdiction": "Rancho Cucamonga",
    "lotSizeSqft": 7400,
    "segment": "H4",
    "source": "public_record",
    "sourceDetail": "8454 Milliken Ave, Rancho Cucamonga, CA 91730",
    "stage": "New",
    "estValue": 194200,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.62.186"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Rancho Cucamonga ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8471 Base Line Rd Property Owner",
    "contactName": "Oscar Medina",
    "email": "oscarmedina.adu8471@outlook.com",
    "phone": "917-555-3063",
    "city": "Rancho Cucamonga",
    "county": "San Bernardino",
    "jurisdiction": "Rancho Cucamonga",
    "lotSizeSqft": 9900,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "8471 Base Line Rd, Rancho Cucamonga, CA 91730",
    "stage": "New",
    "estValue": 279000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.63.189"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Rancho Cucamonga ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8488 Day Creek Blvd Property Owner",
    "contactName": "Angela Rossi",
    "email": "angelarossi.adu8488@gmail.com",
    "phone": "917-555-3064",
    "city": "Rancho Cucamonga",
    "county": "San Bernardino",
    "jurisdiction": "Rancho Cucamonga",
    "lotSizeSqft": 8200,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "8488 Day Creek Blvd, Rancho Cucamonga, CA 91730",
    "stage": "New",
    "estValue": 262000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.64.192"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Rancho Cucamonga ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8505 Archibald Ave Property Owner",
    "contactName": "Craig Sterling",
    "email": "craigsterling.adu8505@yahoo.com",
    "phone": "917-555-3065",
    "city": "Rancho Cucamonga",
    "county": "San Bernardino",
    "jurisdiction": "Rancho Cucamonga",
    "lotSizeSqft": 10400,
    "segment": "H8",
    "source": "public_record",
    "sourceDetail": "8505 Archibald Ave, Rancho Cucamonga, CA 91730",
    "stage": "Contacted",
    "estValue": 376000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.65.195"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Rancho Cucamonga ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      }
    ]
  },
  {
    "name": "8522 Euclid Ave Property Owner",
    "contactName": "Salvador Gomez",
    "email": "salvadorgomez.adu8522@outlook.com",
    "phone": "917-555-3066",
    "city": "Ontario",
    "county": "San Bernardino",
    "jurisdiction": "Ontario",
    "lotSizeSqft": 9500,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "8522 Euclid Ave, Ontario, CA 91764",
    "stage": "New",
    "estValue": 275000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.66.198"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Ontario ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8539 Mountain Ave Property Owner",
    "contactName": "Teresa Delgado",
    "email": "teresadelgado.adu8539@gmail.com",
    "phone": "917-555-3067",
    "city": "Ontario",
    "county": "San Bernardino",
    "jurisdiction": "Ontario",
    "lotSizeSqft": 7800,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "8539 Mountain Ave, Ontario, CA 91764",
    "stage": "New",
    "estValue": 337000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.67.201"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Ontario ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8556 Fourth St Property Owner",
    "contactName": "Derrick Washington",
    "email": "derrickwashington.adu8556@yahoo.com",
    "phone": "917-555-3068",
    "city": "Ontario",
    "county": "San Bernardino",
    "jurisdiction": "Ontario",
    "lotSizeSqft": 8400,
    "segment": "H7",
    "source": "public_record",
    "sourceDetail": "8556 Fourth St, Ontario, CA 91764",
    "stage": "New",
    "estValue": 202200,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.68.204"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Ontario ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8573 Grove Ave Property Owner",
    "contactName": "Eileen Morris",
    "email": "eileenmorris.adu8573@outlook.com",
    "phone": "917-555-3069",
    "city": "Ontario",
    "county": "San Bernardino",
    "jurisdiction": "Ontario",
    "lotSizeSqft": 7200,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "8573 Grove Ave, Ontario, CA 91764",
    "stage": "New",
    "estValue": 252000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.69.207"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Ontario ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8590 Redlands Blvd Property Owner",
    "contactName": "Howard Hughes",
    "email": "howardhughes.adu8590@gmail.com",
    "phone": "923-555-3070",
    "city": "Redlands",
    "county": "San Bernardino",
    "jurisdiction": "Redlands",
    "lotSizeSqft": 8600,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "8590 Redlands Blvd, Redlands, CA 92373",
    "stage": "New",
    "estValue": 349000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.70.210"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Redlands ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8607 Lugonia Ave Property Owner",
    "contactName": "Janet Coleman",
    "email": "janetcoleman.adu8607@yahoo.com",
    "phone": "923-555-3071",
    "city": "Redlands",
    "county": "San Bernardino",
    "jurisdiction": "Redlands",
    "lotSizeSqft": 10200,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "8607 Lugonia Ave, Redlands, CA 92373",
    "stage": "In design",
    "estValue": 282000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.71.213"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Redlands ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      },
      {
        "kind": "consult",
        "summary": "Scheduled Feasibility Site Evaluation"
      }
    ]
  },
  {
    "name": "8624 Barton Rd Property Owner",
    "contactName": "Philip Chen",
    "email": "philipchen.adu8624@outlook.com",
    "phone": "923-555-3072",
    "city": "Redlands",
    "county": "San Bernardino",
    "jurisdiction": "Redlands",
    "lotSizeSqft": 9100,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "8624 Barton Rd, Redlands, CA 92373",
    "stage": "Contacted",
    "estValue": 271000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.72.216"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Redlands ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      }
    ]
  },
  {
    "name": "8641 San Mateo St Property Owner",
    "contactName": "Hannah Goldberg",
    "email": "hannahgoldberg.adu8641@gmail.com",
    "phone": "923-555-3073",
    "city": "Redlands",
    "county": "San Bernardino",
    "jurisdiction": "Redlands",
    "lotSizeSqft": 7700,
    "segment": "H4",
    "source": "public_record",
    "sourceDetail": "8641 San Mateo St, Redlands, CA 92373",
    "stage": "New",
    "estValue": 196600,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.73.219"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Redlands ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8658 University Ave Property Owner",
    "contactName": "Sean O'Malley",
    "email": "seanomalley.adu8658@yahoo.com",
    "phone": "921-555-3074",
    "city": "San Diego",
    "county": "San Diego",
    "jurisdiction": "San Diego",
    "lotSizeSqft": 6200,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "8658 University Ave, San Diego, CA 92104",
    "stage": "New",
    "estValue": 313000,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.74.222"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed San Diego ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8675 El Cajon Blvd Property Owner",
    "contactName": "DeMarcus Jackson",
    "email": "demarcusjackson.adu8675@outlook.com",
    "phone": "921-555-3075",
    "city": "San Diego",
    "county": "San Diego",
    "jurisdiction": "San Diego",
    "lotSizeSqft": 7100,
    "segment": "H8",
    "source": "public_record",
    "sourceDetail": "8675 El Cajon Blvd, San Diego, CA 92104",
    "stage": "New",
    "estValue": 326500,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.75.225"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed San Diego ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8692 Adams Ave Property Owner",
    "contactName": "Zoe Kravitz",
    "email": "zoekravitz.adu8692@gmail.com",
    "phone": "921-555-3076",
    "city": "San Diego",
    "county": "San Diego",
    "jurisdiction": "San Diego",
    "lotSizeSqft": 6800,
    "segment": "H4",
    "source": "public_record",
    "sourceDetail": "8692 Adams Ave, San Diego, CA 92104",
    "stage": "New",
    "estValue": 189400,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.76.228"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed San Diego ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8709 Clairemont Mesa Blvd Property Owner",
    "contactName": "Geraldine Wu",
    "email": "geraldinewu.adu8709@yahoo.com",
    "phone": "921-555-3077",
    "city": "San Diego",
    "county": "San Diego",
    "jurisdiction": "San Diego",
    "lotSizeSqft": 7900,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "8709 Clairemont Mesa Blvd, San Diego, CA 92104",
    "stage": "New",
    "estValue": 259000,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.77.231"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed San Diego ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8726 Balboa Ave Property Owner",
    "contactName": "Martin Brody",
    "email": "martinbrody.adu8726@outlook.com",
    "phone": "921-555-3078",
    "city": "San Diego",
    "county": "San Diego",
    "jurisdiction": "San Diego",
    "lotSizeSqft": 8500,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "8726 Balboa Ave, San Diego, CA 92104",
    "stage": "New",
    "estValue": 265000,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.78.234"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed San Diego ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8743 Mira Mesa Blvd Property Owner",
    "contactName": "Anand Verma",
    "email": "anandverma.adu8743@gmail.com",
    "phone": "921-555-3079",
    "city": "San Diego",
    "county": "San Diego",
    "jurisdiction": "San Diego",
    "lotSizeSqft": 7400,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "8743 Mira Mesa Blvd, San Diego, CA 92104",
    "stage": "Contacted",
    "estValue": 331000,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.79.237"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed San Diego ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      }
    ]
  },
  {
    "name": "8760 Rancho Bernardo Rd Property Owner",
    "contactName": "Eugene Fletcher",
    "email": "eugenefletcher.adu8760@yahoo.com",
    "phone": "921-555-3080",
    "city": "San Diego",
    "county": "San Diego",
    "jurisdiction": "San Diego",
    "lotSizeSqft": 9800,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "8760 Rancho Bernardo Rd, San Diego, CA 92104",
    "stage": "New",
    "estValue": 278000,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.80.240"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed San Diego ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8777 Tierrasanta Blvd Property Owner",
    "contactName": "Beverly Sills",
    "email": "beverlysills.adu8777@outlook.com",
    "phone": "921-555-3081",
    "city": "San Diego",
    "county": "San Diego",
    "jurisdiction": "San Diego",
    "lotSizeSqft": 8100,
    "segment": "H3",
    "source": "public_record",
    "sourceDetail": "8777 Tierrasanta Blvd, San Diego, CA 92104",
    "stage": "New",
    "estValue": 199800,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.81.243"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed San Diego ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8794 Carlsbad Blvd Property Owner",
    "contactName": "Trevor Hastings",
    "email": "trevorhastings.adu8794@gmail.com",
    "phone": "920-555-3082",
    "city": "Carlsbad",
    "county": "San Diego",
    "jurisdiction": "Carlsbad",
    "lotSizeSqft": 7800,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "8794 Carlsbad Blvd, Carlsbad, CA 92008",
    "stage": "New",
    "estValue": 337000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.82.246"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Carlsbad ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8811 El Camino Real Property Owner",
    "contactName": "Cameron Diaz",
    "email": "camerondiaz.adu8811@yahoo.com",
    "phone": "920-555-3083",
    "city": "Carlsbad",
    "county": "San Diego",
    "jurisdiction": "Carlsbad",
    "lotSizeSqft": 9200,
    "segment": "H8",
    "source": "public_record",
    "sourceDetail": "8811 El Camino Real, Carlsbad, CA 92008",
    "stage": "New",
    "estValue": 358000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.83.249"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Carlsbad ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8828 Palomar Airport Rd Property Owner",
    "contactName": "Lucas Vance",
    "email": "lucasvance.adu8828@outlook.com",
    "phone": "920-555-3084",
    "city": "Carlsbad",
    "county": "San Diego",
    "jurisdiction": "Carlsbad",
    "lotSizeSqft": 8400,
    "segment": "H4",
    "source": "public_record",
    "sourceDetail": "8828 Palomar Airport Rd, Carlsbad, CA 92008",
    "stage": "New",
    "estValue": 202200,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.84.2"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Carlsbad ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8845 Poinsettia Ln Property Owner",
    "contactName": "Allison Becker",
    "email": "allisonbecker.adu8845@gmail.com",
    "phone": "920-555-3085",
    "city": "Carlsbad",
    "county": "San Diego",
    "jurisdiction": "Carlsbad",
    "lotSizeSqft": 7900,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "8845 Poinsettia Ln, Carlsbad, CA 92008",
    "stage": "New",
    "estValue": 259000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.85.5"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Carlsbad ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8862 Mission Ave Property Owner",
    "contactName": "Dominic Toretto",
    "email": "dominictoretto.adu8862@yahoo.com",
    "phone": "920-555-3086",
    "city": "Oceanside",
    "county": "San Diego",
    "jurisdiction": "Oceanside",
    "lotSizeSqft": 7400,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "8862 Mission Ave, Oceanside, CA 92054",
    "stage": "Contacted",
    "estValue": 331000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.86.8"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Oceanside ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      }
    ]
  },
  {
    "name": "8879 Oceanside Blvd Property Owner",
    "contactName": "Raul Espinoza",
    "email": "raulespinoza.adu8879@outlook.com",
    "phone": "920-555-3087",
    "city": "Oceanside",
    "county": "San Diego",
    "jurisdiction": "Oceanside",
    "lotSizeSqft": 8300,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "8879 Oceanside Blvd, Oceanside, CA 92054",
    "stage": "New",
    "estValue": 263000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.87.11"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Oceanside ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8896 Vista Way Property Owner",
    "contactName": "Craig Robinson",
    "email": "craigrobinson.adu8896@gmail.com",
    "phone": "920-555-3088",
    "city": "Oceanside",
    "county": "San Diego",
    "jurisdiction": "Oceanside",
    "lotSizeSqft": 6900,
    "segment": "H7",
    "source": "public_record",
    "sourceDetail": "8896 Vista Way, Oceanside, CA 92054",
    "stage": "New",
    "estValue": 190200,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.88.14"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Oceanside ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8913 Douglas Dr Property Owner",
    "contactName": "Evelyn Carter",
    "email": "evelyncarter.adu8913@yahoo.com",
    "phone": "920-555-3089",
    "city": "Oceanside",
    "county": "San Diego",
    "jurisdiction": "Oceanside",
    "lotSizeSqft": 9100,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "8913 Douglas Dr, Oceanside, CA 92054",
    "stage": "New",
    "estValue": 271000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.89.17"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Oceanside ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8930 Third Ave Property Owner",
    "contactName": "Guillermo Del Toro",
    "email": "guillermodeltoro.adu8930@outlook.com",
    "phone": "919-555-3090",
    "city": "Chula Vista",
    "county": "San Diego",
    "jurisdiction": "Chula Vista",
    "lotSizeSqft": 7700,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "8930 Third Ave, Chula Vista, CA 91910",
    "stage": "In design",
    "estValue": 257000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.90.20"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Chula Vista ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      },
      {
        "kind": "consult",
        "summary": "Scheduled Feasibility Site Evaluation"
      }
    ]
  },
  {
    "name": "8947 H St Property Owner",
    "contactName": "Maricela Santos",
    "email": "maricelasantos.adu8947@gmail.com",
    "phone": "919-555-3091",
    "city": "Chula Vista",
    "county": "San Diego",
    "jurisdiction": "Chula Vista",
    "lotSizeSqft": 8500,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "8947 H St, Chula Vista, CA 91910",
    "stage": "New",
    "estValue": 347500,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.91.23"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Chula Vista ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8964 Eastlake Pkwy Property Owner",
    "contactName": "Rogelio Martinez",
    "email": "rogeliomartinez.adu8964@yahoo.com",
    "phone": "919-555-3092",
    "city": "Chula Vista",
    "county": "San Diego",
    "jurisdiction": "Chula Vista",
    "lotSizeSqft": 9600,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "8964 Eastlake Pkwy, Chula Vista, CA 91910",
    "stage": "New",
    "estValue": 276000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.92.26"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Chula Vista ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "8981 Telegraph Canyon Rd Property Owner",
    "contactName": "Consuelo Reyes",
    "email": "consueloreyes.adu8981@outlook.com",
    "phone": "919-555-3093",
    "city": "Chula Vista",
    "county": "San Diego",
    "jurisdiction": "Chula Vista",
    "lotSizeSqft": 8800,
    "segment": "H3",
    "source": "public_record",
    "sourceDetail": "8981 Telegraph Canyon Rd, Chula Vista, CA 91910",
    "stage": "Contacted",
    "estValue": 205400,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.93.29"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Chula Vista ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      }
    ]
  },
  {
    "name": "8998 Grand Ave Property Owner",
    "contactName": "Lorenzo De Leon",
    "email": "lorenzodeleon.adu8998@gmail.com",
    "phone": "920-555-3094",
    "city": "Escondido",
    "county": "San Diego",
    "jurisdiction": "Escondido",
    "lotSizeSqft": 9400,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "8998 Grand Ave, Escondido, CA 92025",
    "stage": "New",
    "estValue": 274000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.94.32"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Escondido ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "115 Valley Pkwy Property Owner",
    "contactName": "Wade Wilson",
    "email": "wadewilson.adu115@yahoo.com",
    "phone": "920-555-3095",
    "city": "Escondido",
    "county": "San Diego",
    "jurisdiction": "Escondido",
    "lotSizeSqft": 8100,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "115 Valley Pkwy, Escondido, CA 92025",
    "stage": "New",
    "estValue": 341500,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.95.35"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Escondido ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "132 Felicita Rd Property Owner",
    "contactName": "Geoffrey Chaucer",
    "email": "geoffreychaucer.adu132@outlook.com",
    "phone": "920-555-3096",
    "city": "Escondido",
    "county": "San Diego",
    "jurisdiction": "Escondido",
    "lotSizeSqft": 13500,
    "segment": "H8",
    "source": "public_record",
    "sourceDetail": "132 Felicita Rd, Escondido, CA 92025",
    "stage": "New",
    "estValue": 422500,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.96.38"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Escondido ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "149 Bear Valley Pkwy Property Owner",
    "contactName": "Rhonda Rousey",
    "email": "rhondarousey.adu149@gmail.com",
    "phone": "920-555-3097",
    "city": "Escondido",
    "county": "San Diego",
    "jurisdiction": "Escondido",
    "lotSizeSqft": 10200,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "149 Bear Valley Pkwy, Escondido, CA 92025",
    "stage": "New",
    "estValue": 282000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.97.41"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Escondido ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "166 Colorado Blvd Property Owner",
    "contactName": "Franklin Pierce",
    "email": "franklinpierce.adu166@yahoo.com",
    "phone": "911-555-3098",
    "city": "Pasadena",
    "county": "Los Angeles",
    "jurisdiction": "Pasadena",
    "lotSizeSqft": 8800,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "166 Colorado Blvd, Pasadena, CA 91101",
    "stage": "New",
    "estValue": 352000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.98.44"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Pasadena ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "183 Fair Oaks Ave Property Owner",
    "contactName": "Regina King",
    "email": "reginaking.adu183@outlook.com",
    "phone": "911-555-3099",
    "city": "Pasadena",
    "county": "Los Angeles",
    "jurisdiction": "Pasadena",
    "lotSizeSqft": 7900,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "183 Fair Oaks Ave, Pasadena, CA 91101",
    "stage": "New",
    "estValue": 259000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.99.47"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Pasadena ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "200 Lake Ave Property Owner",
    "contactName": "Stewart Copeland",
    "email": "stewartcopeland.adu200@gmail.com",
    "phone": "911-555-3100",
    "city": "Pasadena",
    "county": "Los Angeles",
    "jurisdiction": "Pasadena",
    "lotSizeSqft": 9200,
    "segment": "H8",
    "source": "public_record",
    "sourceDetail": "200 Lake Ave, Pasadena, CA 91101",
    "stage": "Contacted",
    "estValue": 358000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.100.50"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Pasadena ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      }
    ]
  },
  {
    "name": "217 Orange Grove Blvd Property Owner",
    "contactName": "Alistair Cooke",
    "email": "alistaircooke.adu217@yahoo.com",
    "phone": "911-555-3101",
    "city": "Pasadena",
    "county": "Los Angeles",
    "jurisdiction": "Pasadena",
    "lotSizeSqft": 12500,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "217 Orange Grove Blvd, Pasadena, CA 91101",
    "stage": "New",
    "estValue": 305000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.101.53"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Pasadena ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "234 Altadena Dr Property Owner",
    "contactName": "Gwendolyn Brooks",
    "email": "gwendolynbrooks.adu234@outlook.com",
    "phone": "911-555-3102",
    "city": "Pasadena",
    "county": "Los Angeles",
    "jurisdiction": "Pasadena",
    "lotSizeSqft": 10500,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "234 Altadena Dr, Pasadena, CA 91101",
    "stage": "New",
    "estValue": 285000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.102.56"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Pasadena ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "251 Brand Blvd Property Owner",
    "contactName": "Armen Sarkissian",
    "email": "armensarkissian.adu251@gmail.com",
    "phone": "912-555-3103",
    "city": "Glendale",
    "county": "Los Angeles",
    "jurisdiction": "Glendale",
    "lotSizeSqft": 7300,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "251 Brand Blvd, Glendale, CA 91204",
    "stage": "New",
    "estValue": 329500,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.103.59"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Glendale ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "268 Glenoaks Blvd Property Owner",
    "contactName": "Vahan Cardashian",
    "email": "vahancardashian.adu268@yahoo.com",
    "phone": "912-555-3104",
    "city": "Glendale",
    "county": "Los Angeles",
    "jurisdiction": "Glendale",
    "lotSizeSqft": 8200,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "268 Glenoaks Blvd, Glendale, CA 91204",
    "stage": "New",
    "estValue": 262000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.104.62"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Glendale ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "285 Verdugo Rd Property Owner",
    "contactName": "Anoush Krikorian",
    "email": "anoushkrikorian.adu285@outlook.com",
    "phone": "912-555-3105",
    "city": "Glendale",
    "county": "Los Angeles",
    "jurisdiction": "Glendale",
    "lotSizeSqft": 7900,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "285 Verdugo Rd, Glendale, CA 91204",
    "stage": "New",
    "estValue": 259000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.105.65"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Glendale ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "302 Colorado St Property Owner",
    "contactName": "Hayk Petrosyan",
    "email": "haykpetrosyan.adu302@gmail.com",
    "phone": "912-555-3106",
    "city": "Glendale",
    "county": "Los Angeles",
    "jurisdiction": "Glendale",
    "lotSizeSqft": 6800,
    "segment": "H4",
    "source": "public_record",
    "sourceDetail": "302 Colorado St, Glendale, CA 91204",
    "stage": "New",
    "estValue": 189400,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.106.68"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Glendale ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "319 Magnolia Blvd Property Owner",
    "contactName": "Spike Jonze",
    "email": "spikejonze.adu319@yahoo.com",
    "phone": "915-555-3107",
    "city": "Burbank",
    "county": "Los Angeles",
    "jurisdiction": "Burbank",
    "lotSizeSqft": 7200,
    "segment": "H4",
    "source": "public_record",
    "sourceDetail": "319 Magnolia Blvd, Burbank, CA 91505",
    "stage": "Contacted",
    "estValue": 192600,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.107.71"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Burbank ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      }
    ]
  },
  {
    "name": "336 Olive Ave Property Owner",
    "contactName": "Clint Eastwood",
    "email": "clinteastwood.adu336@outlook.com",
    "phone": "915-555-3108",
    "city": "Burbank",
    "county": "Los Angeles",
    "jurisdiction": "Burbank",
    "lotSizeSqft": 8100,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "336 Olive Ave, Burbank, CA 91505",
    "stage": "New",
    "estValue": 341500,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.108.74"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Burbank ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "353 Victory Blvd Property Owner",
    "contactName": "Penny Marshall",
    "email": "pennymarshall.adu353@gmail.com",
    "phone": "915-555-3109",
    "city": "Burbank",
    "county": "Los Angeles",
    "jurisdiction": "Burbank",
    "lotSizeSqft": 6900,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "353 Victory Blvd, Burbank, CA 91505",
    "stage": "In design",
    "estValue": 249000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.109.77"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Burbank ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      },
      {
        "kind": "consult",
        "summary": "Scheduled Feasibility Site Evaluation"
      }
    ]
  },
  {
    "name": "370 Glenoaks Blvd Property Owner",
    "contactName": "Ridley Scott",
    "email": "ridleyscott.adu370@yahoo.com",
    "phone": "915-555-3110",
    "city": "Burbank",
    "county": "Los Angeles",
    "jurisdiction": "Burbank",
    "lotSizeSqft": 7600,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "370 Glenoaks Blvd, Burbank, CA 91505",
    "stage": "New",
    "estValue": 256000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.110.80"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Burbank ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "387 Hawthorne Blvd Property Owner",
    "contactName": "Hiroshi Tanaka",
    "email": "hiroshitanaka.adu387@outlook.com",
    "phone": "905-555-3111",
    "city": "Torrance",
    "county": "Los Angeles",
    "jurisdiction": "Torrance",
    "lotSizeSqft": 7500,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "387 Hawthorne Blvd, Torrance, CA 90503",
    "stage": "New",
    "estValue": 332500,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.111.83"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Torrance ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "404 Sepulveda Blvd Property Owner",
    "contactName": "Kenji Sato",
    "email": "kenjisato.adu404@gmail.com",
    "phone": "905-555-3112",
    "city": "Torrance",
    "county": "Los Angeles",
    "jurisdiction": "Torrance",
    "lotSizeSqft": 8400,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "404 Sepulveda Blvd, Torrance, CA 90503",
    "stage": "New",
    "estValue": 264000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.112.86"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Torrance ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "421 Torrance Blvd Property Owner",
    "contactName": "Mariko Mori",
    "email": "marikomori.adu421@yahoo.com",
    "phone": "905-555-3113",
    "city": "Torrance",
    "county": "Los Angeles",
    "jurisdiction": "Torrance",
    "lotSizeSqft": 6900,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "421 Torrance Blvd, Torrance, CA 90503",
    "stage": "New",
    "estValue": 249000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.113.89"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Torrance ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "438 Crenshaw Blvd Property Owner",
    "contactName": "Daisuke Takahashi",
    "email": "daisuketakahashi.adu438@outlook.com",
    "phone": "905-555-3114",
    "city": "Torrance",
    "county": "Los Angeles",
    "jurisdiction": "Torrance",
    "lotSizeSqft": 8900,
    "segment": "H8",
    "source": "public_record",
    "sourceDetail": "438 Crenshaw Blvd, Torrance, CA 90503",
    "stage": "Contacted",
    "estValue": 353500,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.114.92"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Torrance ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      }
    ]
  },
  {
    "name": "455 Atlantic Ave Property Owner",
    "contactName": "Calvin Broadus",
    "email": "calvinbroadus.adu455@gmail.com",
    "phone": "908-555-3115",
    "city": "Long Beach",
    "county": "Los Angeles",
    "jurisdiction": "Long Beach",
    "lotSizeSqft": 6800,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "455 Atlantic Ave, Long Beach, CA 90807",
    "stage": "New",
    "estValue": 322000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.115.95"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Long Beach ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "472 Long Beach Blvd Property Owner",
    "contactName": "Nate Dogg",
    "email": "natedogg.adu472@yahoo.com",
    "phone": "908-555-3116",
    "city": "Long Beach",
    "county": "Los Angeles",
    "jurisdiction": "Long Beach",
    "lotSizeSqft": 7400,
    "segment": "H7",
    "source": "public_record",
    "sourceDetail": "472 Long Beach Blvd, Long Beach, CA 90807",
    "stage": "New",
    "estValue": 194200,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.116.98"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Long Beach ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "489 Pacific Coast Hwy Property Owner",
    "contactName": "Warren Griffin",
    "email": "warrengriffin.adu489@outlook.com",
    "phone": "908-555-3117",
    "city": "Long Beach",
    "county": "Los Angeles",
    "jurisdiction": "Long Beach",
    "lotSizeSqft": 8200,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "489 Pacific Coast Hwy, Long Beach, CA 90807",
    "stage": "New",
    "estValue": 262000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.117.101"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Long Beach ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "506 Willow St Property Owner",
    "contactName": "Dina Meyer",
    "email": "dinameyer.adu506@gmail.com",
    "phone": "908-555-3118",
    "city": "Long Beach",
    "county": "Los Angeles",
    "jurisdiction": "Long Beach",
    "lotSizeSqft": 7700,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "506 Willow St, Long Beach, CA 90807",
    "stage": "New",
    "estValue": 257000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.118.104"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Long Beach ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "523 Spring St Property Owner",
    "contactName": "Darnell Farris",
    "email": "darnellfarris.adu523@yahoo.com",
    "phone": "908-555-3119",
    "city": "Long Beach",
    "county": "Los Angeles",
    "jurisdiction": "Long Beach",
    "lotSizeSqft": 9100,
    "segment": "H8",
    "source": "public_record",
    "sourceDetail": "523 Spring St, Long Beach, CA 90807",
    "stage": "New",
    "estValue": 356500,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.119.107"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Long Beach ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "540 Meridian Ave Property Owner",
    "contactName": "Prashant Nair",
    "email": "prashantnair.adu540@outlook.com",
    "phone": "951-555-3120",
    "city": "San Jose",
    "county": "Santa Clara",
    "jurisdiction": "San Jose",
    "lotSizeSqft": 7800,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "540 Meridian Ave, San Jose, CA 95125",
    "stage": "New",
    "estValue": 337000,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.120.110"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed San Jose ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "557 Willow St Property Owner",
    "contactName": "Srinivas Rao",
    "email": "srinivasrao.adu557@gmail.com",
    "phone": "951-555-3121",
    "city": "San Jose",
    "county": "Santa Clara",
    "jurisdiction": "San Jose",
    "lotSizeSqft": 6900,
    "segment": "H4",
    "source": "public_record",
    "sourceDetail": "557 Willow St, San Jose, CA 95125",
    "stage": "Contacted",
    "estValue": 190200,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.121.113"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed San Jose ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      }
    ]
  },
  {
    "name": "574 Almaden Rd Property Owner",
    "contactName": "Ravi Shankar",
    "email": "ravishankar.adu574@yahoo.com",
    "phone": "951-555-3122",
    "city": "San Jose",
    "county": "Santa Clara",
    "jurisdiction": "San Jose",
    "lotSizeSqft": 8900,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "574 Almaden Rd, San Jose, CA 95125",
    "stage": "New",
    "estValue": 269000,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.122.116"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed San Jose ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "591 Capitol Expy Property Owner",
    "contactName": "Venkatraman Ram",
    "email": "venkatramanram.adu591@outlook.com",
    "phone": "951-555-3123",
    "city": "San Jose",
    "county": "Santa Clara",
    "jurisdiction": "San Jose",
    "lotSizeSqft": 7400,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "591 Capitol Expy, San Jose, CA 95125",
    "stage": "New",
    "estValue": 254000,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.123.119"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed San Jose ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "608 Bascom Ave Property Owner",
    "contactName": "Girish Mathur",
    "email": "girishmathur.adu608@gmail.com",
    "phone": "951-555-3124",
    "city": "San Jose",
    "county": "Santa Clara",
    "jurisdiction": "San Jose",
    "lotSizeSqft": 8200,
    "segment": "H8",
    "source": "public_record",
    "sourceDetail": "608 Bascom Ave, San Jose, CA 95125",
    "stage": "New",
    "estValue": 343000,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.124.122"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed San Jose ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "625 El Camino Real Property Owner",
    "contactName": "Satya Nadella",
    "email": "satyanadella.adu625@yahoo.com",
    "phone": "940-555-3125",
    "city": "Sunnyvale",
    "county": "Santa Clara",
    "jurisdiction": "Sunnyvale",
    "lotSizeSqft": 7400,
    "segment": "H4",
    "source": "public_record",
    "sourceDetail": "625 El Camino Real, Sunnyvale, CA 94086",
    "stage": "New",
    "estValue": 194200,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.125.125"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Sunnyvale ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "642 Mathilda Ave Property Owner",
    "contactName": "Sundar Pichai",
    "email": "sundarpichai.adu642@outlook.com",
    "phone": "940-555-3126",
    "city": "Sunnyvale",
    "county": "Santa Clara",
    "jurisdiction": "Sunnyvale",
    "lotSizeSqft": 8100,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "642 Mathilda Ave, Sunnyvale, CA 94086",
    "stage": "New",
    "estValue": 341500,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.126.128"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Sunnyvale ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "659 Fremont Ave Property Owner",
    "contactName": "Tim Cook",
    "email": "timcook.adu659@gmail.com",
    "phone": "940-555-3127",
    "city": "Sunnyvale",
    "county": "Santa Clara",
    "jurisdiction": "Sunnyvale",
    "lotSizeSqft": 8900,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "659 Fremont Ave, Sunnyvale, CA 94086",
    "stage": "New",
    "estValue": 269000,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.127.131"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Sunnyvale ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "676 Sunnyvale Saratoga Rd Property Owner",
    "contactName": "Jensen Huang",
    "email": "jensenhuang.adu676@yahoo.com",
    "phone": "940-555-3128",
    "city": "Sunnyvale",
    "county": "Santa Clara",
    "jurisdiction": "Sunnyvale",
    "lotSizeSqft": 9200,
    "segment": "H8",
    "source": "public_record",
    "sourceDetail": "676 Sunnyvale Saratoga Rd, Sunnyvale, CA 94086",
    "stage": "Contacted",
    "estValue": 358000,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.128.134"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Sunnyvale ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      }
    ]
  },
  {
    "name": "693 Fremont Blvd Property Owner",
    "contactName": "Arun Kumar",
    "email": "arunkumar.adu693@outlook.com",
    "phone": "945-555-3129",
    "city": "Fremont",
    "county": "Alameda",
    "jurisdiction": "Fremont",
    "lotSizeSqft": 7900,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "693 Fremont Blvd, Fremont, CA 94538",
    "stage": "New",
    "estValue": 338500,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.129.137"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Fremont ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "710 Mission Blvd Property Owner",
    "contactName": "Deepak Chopra",
    "email": "deepakchopra.adu710@gmail.com",
    "phone": "945-555-3130",
    "city": "Fremont",
    "county": "Alameda",
    "jurisdiction": "Fremont",
    "lotSizeSqft": 9400,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "710 Mission Blvd, Fremont, CA 94538",
    "stage": "New",
    "estValue": 274000,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.130.140"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Fremont ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "727 Mowry Ave Property Owner",
    "contactName": "Ramesh Patel",
    "email": "rameshpatel.adu727@yahoo.com",
    "phone": "945-555-3131",
    "city": "Fremont",
    "county": "Alameda",
    "jurisdiction": "Fremont",
    "lotSizeSqft": 8200,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "727 Mowry Ave, Fremont, CA 94538",
    "stage": "New",
    "estValue": 262000,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.131.143"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Fremont ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "744 Paseo Padre Pkwy Property Owner",
    "contactName": "Karthik Raja",
    "email": "karthikraja.adu744@outlook.com",
    "phone": "945-555-3132",
    "city": "Fremont",
    "county": "Alameda",
    "jurisdiction": "Fremont",
    "lotSizeSqft": 8700,
    "segment": "H4",
    "source": "public_record",
    "sourceDetail": "744 Paseo Padre Pkwy, Fremont, CA 94538",
    "stage": "New",
    "estValue": 204600,
    "ab1033Eligible": true,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.132.146"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Fremont ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "761 J St Property Owner",
    "contactName": "Gregory Peck",
    "email": "gregorypeck.adu761@gmail.com",
    "phone": "958-555-3133",
    "city": "Sacramento",
    "county": "Sacramento",
    "jurisdiction": "Sacramento",
    "lotSizeSqft": 7200,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "761 J St, Sacramento, CA 95816",
    "stage": "New",
    "estValue": 328000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.133.149"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Sacramento ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "778 Folsom Blvd Property Owner",
    "contactName": "Bette Davis",
    "email": "bettedavis.adu778@yahoo.com",
    "phone": "958-555-3134",
    "city": "Sacramento",
    "county": "Sacramento",
    "jurisdiction": "Sacramento",
    "lotSizeSqft": 8800,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "778 Folsom Blvd, Sacramento, CA 95816",
    "stage": "New",
    "estValue": 268000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.134.152"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Sacramento ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "795 Stockton Blvd Property Owner",
    "contactName": "Humphrey Bogart",
    "email": "humphreybogart.adu795@outlook.com",
    "phone": "958-555-3135",
    "city": "Sacramento",
    "county": "Sacramento",
    "jurisdiction": "Sacramento",
    "lotSizeSqft": 7900,
    "segment": "H7",
    "source": "public_record",
    "sourceDetail": "795 Stockton Blvd, Sacramento, CA 95816",
    "stage": "Contacted",
    "estValue": 198200,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.135.155"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Sacramento ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      }
    ]
  },
  {
    "name": "812 Freeport Blvd Property Owner",
    "contactName": "Lauren Bacall",
    "email": "laurenbacall.adu812@gmail.com",
    "phone": "958-555-3136",
    "city": "Sacramento",
    "county": "Sacramento",
    "jurisdiction": "Sacramento",
    "lotSizeSqft": 8400,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "812 Freeport Blvd, Sacramento, CA 95816",
    "stage": "New",
    "estValue": 264000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.136.158"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Sacramento ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "829 Fair Oaks Blvd Property Owner",
    "contactName": "Spencer Tracy",
    "email": "spencertracy.adu829@yahoo.com",
    "phone": "958-555-3137",
    "city": "Sacramento",
    "county": "Sacramento",
    "jurisdiction": "Sacramento",
    "lotSizeSqft": 12000,
    "segment": "H8",
    "source": "public_record",
    "sourceDetail": "829 Fair Oaks Blvd, Sacramento, CA 95816",
    "stage": "New",
    "estValue": 400000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.137.161"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Sacramento ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "846 Broadway Property Owner",
    "contactName": "Katharine Hepburn",
    "email": "katharinehepburn.adu846@outlook.com",
    "phone": "958-555-3138",
    "city": "Sacramento",
    "county": "Sacramento",
    "jurisdiction": "Sacramento",
    "lotSizeSqft": 6900,
    "segment": "H4",
    "source": "public_record",
    "sourceDetail": "846 Broadway, Sacramento, CA 95816",
    "stage": "New",
    "estValue": 190200,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.138.164"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Sacramento ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "863 Douglas Blvd Property Owner",
    "contactName": "Kirk Douglas",
    "email": "kirkdouglas.adu863@gmail.com",
    "phone": "956-555-3139",
    "city": "Roseville",
    "county": "Placer",
    "jurisdiction": "Roseville",
    "lotSizeSqft": 9800,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "863 Douglas Blvd, Roseville, CA 95661",
    "stage": "New",
    "estValue": 278000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.139.167"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Roseville ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "880 Sunrise Ave Property Owner",
    "contactName": "Michael Douglas",
    "email": "michaeldouglas.adu880@yahoo.com",
    "phone": "956-555-3140",
    "city": "Roseville",
    "county": "Placer",
    "jurisdiction": "Roseville",
    "lotSizeSqft": 8400,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "880 Sunrise Ave, Roseville, CA 95661",
    "stage": "New",
    "estValue": 346000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.140.170"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Roseville ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "897 Pleasant Grove Blvd Property Owner",
    "contactName": "Catherine Zeta",
    "email": "catherinezeta.adu897@outlook.com",
    "phone": "956-555-3141",
    "city": "Roseville",
    "county": "Placer",
    "jurisdiction": "Roseville",
    "lotSizeSqft": 10500,
    "segment": "H8",
    "source": "public_record",
    "sourceDetail": "897 Pleasant Grove Blvd, Roseville, CA 95661",
    "stage": "New",
    "estValue": 377500,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.141.173"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Roseville ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "914 Foothills Blvd Property Owner",
    "contactName": "Diana Rigg",
    "email": "dianarigg.adu914@gmail.com",
    "phone": "956-555-3142",
    "city": "Roseville",
    "county": "Placer",
    "jurisdiction": "Roseville",
    "lotSizeSqft": 8100,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "914 Foothills Blvd, Roseville, CA 95661",
    "stage": "Contacted",
    "estValue": 261000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.142.176"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Roseville ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      }
    ]
  },
  {
    "name": "931 Blackstone Ave Property Owner",
    "contactName": "Joaquin Murrieta",
    "email": "joaquinmurrieta.adu931@yahoo.com",
    "phone": "937-555-3143",
    "city": "Fresno",
    "county": "Fresno",
    "jurisdiction": "Fresno",
    "lotSizeSqft": 8900,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "931 Blackstone Ave, Fresno, CA 93720",
    "stage": "New",
    "estValue": 353500,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.143.179"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Fresno ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "948 Herndon Ave Property Owner",
    "contactName": "Cesar Chavez",
    "email": "cesarchavez.adu948@outlook.com",
    "phone": "937-555-3144",
    "city": "Fresno",
    "county": "Fresno",
    "jurisdiction": "Fresno",
    "lotSizeSqft": 11200,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "948 Herndon Ave, Fresno, CA 93720",
    "stage": "New",
    "estValue": 292000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.144.182"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Fresno ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "965 Shaw Ave Property Owner",
    "contactName": "Dolores Huerta",
    "email": "doloreshuerta.adu965@gmail.com",
    "phone": "937-555-3145",
    "city": "Fresno",
    "county": "Fresno",
    "jurisdiction": "Fresno",
    "lotSizeSqft": 7900,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "965 Shaw Ave, Fresno, CA 93720",
    "stage": "New",
    "estValue": 259000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.145.185"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Fresno ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "982 Friant Rd Property Owner",
    "contactName": "Edward James Olmos",
    "email": "edwardjamesolmos.adu982@yahoo.com",
    "phone": "937-555-3146",
    "city": "Fresno",
    "county": "Fresno",
    "jurisdiction": "Fresno",
    "lotSizeSqft": 14000,
    "segment": "H8",
    "source": "public_record",
    "sourceDetail": "982 Friant Rd, Fresno, CA 93720",
    "stage": "New",
    "estValue": 430000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.146.188"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Fresno ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "999 Ming Ave Property Owner",
    "contactName": "Buck Owens",
    "email": "buckowens.adu999@outlook.com",
    "phone": "933-555-3147",
    "city": "Bakersfield",
    "county": "Kern",
    "jurisdiction": "Bakersfield",
    "lotSizeSqft": 9400,
    "segment": "H2",
    "source": "public_record",
    "sourceDetail": "999 Ming Ave, Bakersfield, CA 93309",
    "stage": "In design",
    "estValue": 274000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.147.191"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Bakersfield ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      },
      {
        "kind": "consult",
        "summary": "Scheduled Feasibility Site Evaluation"
      }
    ]
  },
  {
    "name": "1016 California Ave Property Owner",
    "contactName": "Merle Haggard",
    "email": "merlehaggard.adu1016@gmail.com",
    "phone": "933-555-3148",
    "city": "Bakersfield",
    "county": "Kern",
    "jurisdiction": "Bakersfield",
    "lotSizeSqft": 8200,
    "segment": "H1",
    "source": "public_record",
    "sourceDetail": "1016 California Ave, Bakersfield, CA 93309",
    "stage": "New",
    "estValue": 343000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": true,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.148.194"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Bakersfield ADU setback & zoning limits"
      }
    ]
  },
  {
    "name": "1033 Truxtun Ave Property Owner",
    "contactName": "Dwight Yoakam",
    "email": "dwightyoakam.adu1033@yahoo.com",
    "phone": "933-555-3149",
    "city": "Bakersfield",
    "county": "Kern",
    "jurisdiction": "Bakersfield",
    "lotSizeSqft": 8800,
    "segment": "H6",
    "source": "public_record",
    "sourceDetail": "1033 Truxtun Ave, Bakersfield, CA 93309",
    "stage": "Contacted",
    "estValue": 268000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": false,
      "smsOptIn": false,
      "consentSource": "property_records_outreach",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.149.197"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Bakersfield ADU setback & zoning limits"
      },
      {
        "kind": "quiz",
        "summary": "Completed Online ADU Feasibility Quiz"
      }
    ]
  },
  {
    "name": "1050 Coffee Rd Property Owner",
    "contactName": "Kris Kristofferson",
    "email": "kriskristofferson.adu1050@outlook.com",
    "phone": "933-555-3150",
    "city": "Bakersfield",
    "county": "Kern",
    "jurisdiction": "Bakersfield",
    "lotSizeSqft": 10800,
    "segment": "H8",
    "source": "public_record",
    "sourceDetail": "1050 Coffee Rd, Bakersfield, CA 93309",
    "stage": "New",
    "estValue": 382000,
    "ab1033Eligible": false,
    "consent": {
      "emailOptIn": true,
      "phoneOptIn": true,
      "smsOptIn": false,
      "consentSource": "county_assessor_qr",
      "consentText": "Opted in for California ADU feasibility & zoning reports.",
      "consentIp": "172.56.150.200"
    },
    "activities": [
      {
        "kind": "visit",
        "summary": "Viewed Bakersfield ADU setback & zoning limits"
      }
    ]
  }
];

async function seed() {
  console.log(`Starting Fall Statewide Expansion: ${expansionLeads.length} leads to process...`);
  
  let seededCount = 0;
  let skippedCount = 0;

  for (const h of expansionLeads) {
    // Check if already exists
    const existing = await prisma.lead.findFirst({ where: { email: h.email } });
    if (existing) {
      skippedCount++;
      continue;
    }

    // Ensure jurisdiction exists
    await prisma.jurisdiction.upsert({
      where: { name: h.city },
      update: { ab1033OptIn: h.ab1033Eligible },
      create: { 
        name: h.city, 
        ab1033OptIn: h.ab1033Eligible,
        notes: h.ab1033Eligible ? "Adopted AB 1033 condo conversion rules." : "Has not opted into AB 1033 yet."
      }
    });

    // Compute lead score
    let score = 0;
    const actKinds = h.activities.map(a => a.kind);
    if (actKinds.includes("quiz")) score += 25;
    if (actKinds.includes("consult")) score += 30;
    if (actKinds.includes("visit")) score += 10;
    if (h.lotSizeSqft >= 5000) score += 10;
    else if (h.lotSizeSqft >= 3500) score += 7;
    if (h.segment === "H1" || h.segment === "H8") score += 10;
    else score += 5;
    if (h.ab1033Eligible) score += 5;
    score = Math.min(Math.max(score, 0), 100);

    // Create lead
    const lead = await prisma.lead.create({
      data: {
        type: "homeowner",
        name: h.name,
        contactName: h.contactName,
        email: h.email,
        phone: h.phone,
        city: h.city,
        county: h.county,
        jurisdiction: h.jurisdiction,
        lotSizeSqft: h.lotSizeSqft,
        segment: h.segment,
        source: h.source,
        sourceDetail: h.sourceDetail,
        score,
        stage: h.stage,
        estValue: h.estValue,
        ab1033Eligible: h.ab1033Eligible,
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
            summary: a.summary
          }))
        }
      }
    });

    seededCount++;

    // Enroll in nurture sequence
    const seq = await prisma.sequence.findUnique({ where: { segment: h.segment } });
    if (seq && h.stage === "New" && h.consent.emailOptIn) {
      await prisma.enrollmentState.create({
        data: {
          leadId: lead.id,
          sequenceId: seq.id,
          currentStep: 0,
          nextDueAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          status: "active"
        }
      });
    }
  }

  console.log(`\n✅ Fall Expansion Ingestion Complete!`);
  console.log(`   Newly Ingested: ${seededCount} leads`);
  console.log(`   Skipped (already in DB): ${skippedCount}`);

  const total = await prisma.lead.count();
  const homeowners = await prisma.lead.count({ where: { type: "homeowner" } });
  const jurisdictions = await prisma.jurisdiction.count();
  const enrollments = await prisma.enrollmentState.count({ where: { status: "active" } });

  console.log(`\n📊 New CRM Totals:`);
  console.log(`   Total Leads: ${total}`);
  console.log(`   Homeowner Leads: ${homeowners}`);
  console.log(`   Active Sequence Enrollments: ${enrollments}`);
  console.log(`   Jurisdictions Tracked: ${jurisdictions}`);
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
