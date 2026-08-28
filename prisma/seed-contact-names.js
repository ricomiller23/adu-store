require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Map email → human contact name
// Covers all 149 homeowner leads + 16 partner leads
const contactNames = {
  // === SAN JOSE ===
  "duvalldr.trust@gmail.com": "Michael Torres",
  "flintave.owner@gmail.com": "David Kim",
  "orlandodr.family@outlook.com": "Linda Nguyen",
  "lincolnave.trust@gmail.com": "Robert Chen",
  "crestdr.dev@willowglendev.com": "Andrew Patel",
  "harrisave.equity@gmail.com": "James Williams",
  "vancedr.invest@gmail.com": "Kevin Park",
  "santamonicaave.buyer@gmail.com": "Maria Sanchez",
  "universityave.studio@gmail.com": "Eric Johnson",
  "elcaminoreal.invest@gmail.com": "Sarah Thompson",
  "ddraper.unsub@gmail.com": "Donald Draper",
  "mmartinez.dnc@yahoo.com": "Miguel Martinez",

  // === SANTA MONICA ===
  "18thst.trust@outlook.com": "Barbara Thompson",
  "25thst.owner@gmail.com": "Richard Owens",
  "25thst.studio@gmail.com": "Jennifer Lee",
  "glennave.wfh@gmail.com": "Mark Stevens",
  "24thst.home@gmail.com": "Patricia Hansen",
  "6thst.downsizing@gmail.com": "Carol Reed",
  "yalest.estate@gmail.com": "Thomas White",
  "22ndst.investments@gmail.com": "Gary Hoffman",
  "marinest.home@gmail.com": "Angela Cruz",
  "tshelby.unsub@gmail.com": "Thomas Shelby",

  // === PASADENA ===
  "valenciaave.trust@gmail.com": "Susan Alvarez",
  "montanast.care@outlook.com": "William Foster",
  "canyonclose.wfh@gmail.com": "Nancy Brooks",
  "primaverast.buyer@gmail.com": "George Ramirez",
  "craryst.owner@gmail.com": "Dorothy Price",
  "dudleyst.downsize@gmail.com": "Kenneth Evans",
  "fremontdr.dev@gmail.com": "Paul Mitchell",

  // === SAN DIEGO / CORONADO ===
  "countryclubln.trust@gmail.com": "Helen Garcia",
  "braunave.care@yahoo.com": "Frank Murphy",
  "wordenst.buyer@gmail.com": "Betty Collins",

  // === BAY AREA / EL CERRITO ===
  "norvellst.family@gmail.com": "Walter Nelson",
  "likelydr.dev@apexhousing.com": "Scott Baker",
  "praderaway.downsize@gmail.com": "Donna Hill",

  // === SAN FRANCISCO ===
  "broadway.invest@sfheights.com": "Raymond Carter",
  "judahst.family@yahoo.com": "Gloria Adams",

  // === BERKELEY ===
  "grizzlypeak.studio@gmail.com": "Harold Wright",
  "telegraphave.multigen@gmail.com": "Diana Mitchell",

  // === SANTA CRUZ ===
  "eastcliff.invest@gmail.com": "Arthur Campbell",
  "missionst.care@yahoo.com": "Ruth Parker",

  // === STOCKTON ===
  "pacificave.invest@gmail.com": "Larry Stewart",
  "npacificave.buyer@gmail.com": "Brenda Phillips",

  // === CENTRAL VALLEY ===
  "shawave.family@gmail.com": "Roger Watson",
  "shepherdave.buyer@gmail.com": "Shirley Morgan",
  "truxtunave.invest@gmail.com": "Howard Bennett",
  "californiaave.amnesty@outlook.com": "Virginia Flores",
  "magnoliaave.multigen@gmail.com": "Carl Reed",
  "missionblvd.amnesty@gmail.com": "Christine Peterson",
  "statest.studio@gmail.com": "Philip Rivera",
  "alamedapadreserra.buyer@outlook.com": "Janet Gray",

  // === OAKLAND ===
  "skylineblvd.estate@gmail.com": "Russell Simmons",
  "grandave.downsizing@gmail.com": "Judith Coleman",
  "telegraphave.dev@gmail.com": "Jonathan Pierce",
  "fgallagher.dnc@gmail.com": "Frank Gallagher",

  // === SACRAMENTO ===
  "landparkdr.downsize@gmail.com": "Deborah Long",
  "rvance.dnc@outlook.com": "Robert Vance",
  "1115hst.dnc@gmail.com": "Rachel Vance",

  // === RIVERSIDE ===
  "wwhite.dnc@outlook.com": "Walter White",
  "1900canyoncrestdr.dnc@gmail.com": "Walter White",

  // === BAKERSFIELD ===
  "jmcgill.unsub@gmail.com": "Jimmy McGill",
  "tsoprano.dnc@outlook.com": "Tony Soprano",

  // === IRVINE / ORANGE COUNTY ===
  "sandcanyonave.studio@gmail.com": "Timothy Harris",
  "morgan.caregiver@gmail.com": "Sharon Morgan",

  // === LOS ANGELES EXPANSION ===
  "dunleerdr.estate@gmail.com": "Charles Robertson",
  "griffithpk.rental@gmail.com": "Melissa Torres",
  "glendalblvd.dev@gmail.com": "Bruce Ingram",
  "yorkblvd.multigen@yahoo.com": "Catherine Lam",
  "laurelcanyon.studio@gmail.com": "Jason Monroe",

  // === LONG BEACH ===
  "pch.invest@gmail.com": "Dennis Moran",
  "cherryave.family@gmail.com": "Pamela Burke",
  "atlanticave.buyer@outlook.com": "Clarence Webb",

  // === ANAHEIM ===
  "anaheimblvd.trust@gmail.com": "Teresa Diaz",
  "katellaave.downsize@gmail.com": "Eugene Larson",
  "magnoliaave.caregiver@yahoo.com": "Kathleen Fox",
  "civic.dnc@gmail.com": "Civic Owner DNC",

  // === HUNTINGTON BEACH ===
  "slaterave.beach@gmail.com": "Brandon Walsh",
  "warnerave.invest@gmail.com": "Nicole Sanders",

  // === GLENDALE ===
  "coloradost.buyer@gmail.com": "Ryan Hoffman",
  "honoluluave.studio@gmail.com": "Stephanie Yoon",

  // === TORRANCE ===
  "torranceblvd.estate@gmail.com": "Gregory Burns",
  "mapleave.downsize@gmail.com": "Joan Sutton",

  // === SUNNYVALE ===
  "ahwaneeave.tech@gmail.com": "Kevin Zhang",
  "evelynave.invest@gmail.com": "Rachel Kim",
  "duaneave.multigen@gmail.com": "Eric Huang",

  // === SANTA CLARA ===
  "civiccenterdr.trust@gmail.com": "Laura Perez",
  "lafayettest.rental@gmail.com": "Derek Mason",

  // === FREMONT ===
  "fremontblvd.dev@gmail.com": "Oscar Reyes",
  "mowryave.family@gmail.com": "Carmen Ortega",
  "walnutave.wfh@gmail.com": "Nathan Clarke",

  // === SAN MATEO ===
  "39thave.caregiver@gmail.com": "Phyllis Chang",
  "hillsdaleblvd.invest@gmail.com": "Victor Ngo",

  // === CONCORD ===
  "willowpass.home@gmail.com": "Samantha Green",
  "monumentblvd.invest@gmail.com": "Patrick Dunn",

  // === ANTIOCH ===
  "lonetreeway.buyer@gmail.com": "Tiffany Cole",
  "hillcrestave.dev@gmail.com": "Marcus Bell",

  // === VALLEJO ===
  "alabamast.home@gmail.com": "Amanda Price",
  "capitolst.invest@gmail.com": "Zachary Hunt",

  // === PETALUMA ===
  "kellerst.wfh@gmail.com": "Bethany Ross",
  "westernave.family@gmail.com": "Dustin Carr",

  // === SANTA ROSA ===
  "mendocinave.invest@gmail.com": "Adrianne Fowler",
  "4thst.family@outlook.com": "Nathaniel Gibson",

  // === VENTURA ===
  "venturaave.home@gmail.com": "Cynthia Warren",
  "telegraphrd.downsize@gmail.com": "Dale Spencer",

  // === THOUSAND OAKS ===
  "hillcrestdr.estate@gmail.com": "Harriet Sullivan",
  "avenidaarboles.care@gmail.com": "Floyd Harper",

  // === SIMI VALLEY ===
  "cochranst.family@gmail.com": "Lucinda Bradley",

  // === OXNARD ===
  "saviersrd.invest@gmail.com": "Clarence Dixon",
  "cst.homeowner@gmail.com": "Renee Thornton",

  // === COSTA MESA ===
  "newportblvd.studio@gmail.com": "Xavier Pope",

  // === CHULA VISTA ===
  "hst.trust@gmail.com": "Ignacio Medina",
  "broadway.invest@gmail.com": "Loraine Castillo",

  // === EL CAJON ===
  "emainst.home@gmail.com": "Wendell Aguilar",

  // === ESCONDIDO ===
  "nbroadway.invest@gmail.com": "Colleen Wade",
  "2ndave.downsize@gmail.com": "Sherman Bowman",

  // === TEMECULA ===
  "mainst.buyer@gmail.com": "Rosemary Chavez",
  "ranchocaliforniard.invest@gmail.com": "Maurice Garrett",

  // === MURRIETA ===
  "jeffersonave.family@gmail.com": "Iris Walters",

  // === MORENO VALLEY ===
  "perrisblvd.home@gmail.com": "Lionel Hawkins",
  "dayst.invest@gmail.com": "Adrienne Shaw",

  // === CORONA ===
  "ramonaave.downsize@gmail.com": "Clyde Steele",
  "foothillpkwy.invest@gmail.com": "Marcia Holmes",

  // === RANCHO CUCAMONGA ===
  "baselinerd.estate@gmail.com": "Chester Crawford",
  "foothillblvd.care@gmail.com": "Viola Ryan",

  // === FONTANA ===
  "sierraave.buyer@gmail.com": "Brent Simmons",

  // === SAN BERNARDINO ===
  "ndst.home@gmail.com": "Antoinette Jenkins",

  // === VICTORVILLE ===
  "civicdr.invest@gmail.com": "Damon Fuller",

  // === PALMDALE / LANCASTER ===
  "30thstw.dev@gmail.com": "Elaine Cobb",
  "avenyek.buyer@gmail.com": "Clifton Powers",

  // === ROSEVILLE / ELK GROVE ===
  "sunriseave.invest@gmail.com": "Hector Byrd",
  "foothillsblvd.family@gmail.com": "Mildred Doyle",
  "elkgroveblvd.home@gmail.com": "Vernon Higgins",

  // === MODESTO ===
  "mchenryave.invest@gmail.com": "Leroy Griffith",
  "oakdalerd.family@gmail.com": "Priscilla Moss",

  // === VISALIA ===
  "mineralking.home@gmail.com": "Cedric Payne",
  "courtst.downsize@gmail.com": "Yvonne Holt",

  // === SALINAS ===
  "smainst.family@gmail.com": "Alvin Singleton",
  "ealisal.care@gmail.com": "Roberta Curry",
  "salinas.dnc@gmail.com": "Salinas Owner DNC",

  // === DALY CITY ===
  "genevaave.family@gmail.com": "Terrence Bowers",

  // === HAYWARD ===
  "foothillblvd.hayward@gmail.com": "Geraldine Fleming",
  "bst.hayward.family@gmail.com": "Roosevelt Cannon",

  // === INGLEWOOD ===
  "nutwoodst.buyer@gmail.com": "Loretta Chambers",
  "labreave.invest@gmail.com": "Cornelius Barton",

  // === WEST COVINA / POMONA / DOWNEY ===
  "cameronave.buyer@gmail.com": "Sylvia Watkins",
  "gareyave.family@gmail.com": "Elmer Ortiz",
  "florenceave.invest@gmail.com": "Alma Nichols",

  // === EL MONTE ===
  "valleyblvd.home@gmail.com": "Owen Saunders",

  // === REDDING ===
  "hilltopdr.home@gmail.com": "Pauline Hooper",
  "southst.redding.invest@gmail.com": "Emmett Lyons",

  // === DNC ===
  "sunsetblvd.dnc@outlook.com": "Don Draper",
};

async function updateContactNames() {
  console.log("Updating leads with real human contact names...");

  const leads = await prisma.lead.findMany({ select: { id: true, email: true, name: true, type: true } });
  
  let updated = 0;
  let skipped = 0;

  for (const lead of leads) {
    const contactName = contactNames[lead.email];
    if (contactName) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { contactName }
      });
      updated++;
    } else {
      // For partners or unmapped, derive from email (capitalize parts)
      const emailLocal = lead.email.split('@')[0];
      const parts = emailLocal.replace(/[._-]/g, ' ').split(' ');
      // Try to make a plausible name from email
      const derived = parts
        .filter(p => p.length > 1 && !/^\d+$/.test(p))
        .slice(0, 2)
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');
      
      if (derived.length > 2) {
        await prisma.lead.update({
          where: { id: lead.id },
          data: { contactName: derived }
        });
        updated++;
      } else {
        skipped++;
      }
    }
  }

  console.log(`\n✅ Contact Name Update Complete!`);
  console.log(`   Updated: ${updated} leads`);
  console.log(`   Skipped: ${skipped} leads`);

  // Verify
  const sample = await prisma.lead.findMany({
    take: 8,
    select: { name: true, contactName: true, email: true, city: true }
  });
  console.log('\nSample verification:');
  sample.forEach(l => console.log(`  [${l.city}] ${l.contactName} | ${l.name} | ${l.email}`));
}

updateContactNames()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
