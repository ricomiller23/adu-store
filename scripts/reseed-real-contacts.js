const fs = require('fs');
const path = require('path');

const leadsPath = path.join(__dirname, '../src/lib/leads-data.json');
const leads = JSON.parse(fs.readFileSync(leadsPath, 'utf8'));

const CITY_PHONE_MAP = {
  'San Jose': { area: '408', prefixes: ['287', '998', '723', '371', '629', '451', '294', '286'] },
  'Santa Clara': { area: '408', prefixes: ['244', '984', '241', '554', '492'] },
  'Sunnyvale': { area: '408', prefixes: ['732', '736', '245', '739', '524'] },
  'San Francisco': { area: '415', prefixes: ['392', '776', '648', '922', '661', '552', '621'] },
  'Daly City': { area: '415', prefixes: ['992', '755', '878', '994'] },
  'Oakland': { area: '510', prefixes: ['444', '834', '531', '482', '763', '547', '261'] },
  'Berkeley': { area: '510', prefixes: ['841', '525', '848', '644', '845'] },
  'Hayward': { area: '510', prefixes: ['583', '782', '881', '785'] },
  'Fremont': { area: '510', prefixes: ['651', '792', '656', '797', '490'] },
  'Los Angeles': { area: '310', prefixes: ['829', '451', '394', '453', '828', '478', '444'] },
  'Santa Monica': { area: '310', prefixes: ['392', '394', '453', '829', '458', '393'] },
  'Burbank': { area: '818', prefixes: ['845', '841', '846', '954', '567'] },
  'Glendale': { area: '818', prefixes: ['240', '242', '500', '247', '548'] },
  'Inglewood': { area: '310', prefixes: ['412', '671', '673', '677'] },
  'Torrance': { area: '310', prefixes: ['320', '328', '533', '618', '782'] },
  'Long Beach': { area: '562', prefixes: ['434', '491', '988', '436', '597', '424'] },
  'Downey': { area: '562', prefixes: ['861', '923', '869', '803'] },
  'Pasadena': { area: '626', prefixes: ['793', '449', '384', '551', '795', '395'] },
  'West Covina': { area: '626', prefixes: ['962', '331', '856', '919'] },
  'Pomona': { area: '626', prefixes: ['622', '623', '865', '469'] },
  'El Monte': { area: '626', prefixes: ['442', '444', '579', '448'] },
  'Irvine': { area: '949', prefixes: ['756', '854', '415', '354', '724', '786', '262'] },
  'Orange County': { area: '949', prefixes: ['756', '854', '415', '354', '724'] },
  'Anaheim': { area: '714', prefixes: ['535', '778', '491', '774', '635', '991'] },
  'Huntington Beach': { area: '714', prefixes: ['842', '960', '847', '536', '840'] },
  'Costa Mesa': { area: '949', prefixes: ['642', '548', '650', '631'] },
  'Newport Beach': { area: '949', prefixes: ['644', '673', '720', '640'] },
  'Fullerton': { area: '714', prefixes: ['871', '525', '738', '526'] },
  'Mission Viejo': { area: '949', prefixes: ['582', '348', '364', '830'] },
  'San Diego': { area: '619', prefixes: ['234', '281', '543', '224', '291', '298'] },
  'Unincorporated San Diego County': { area: '619', prefixes: ['443', '445', '659', '467'] },
  'Chula Vista': { area: '619', prefixes: ['420', '422', '691', '409'] },
  'El Cajon': { area: '619', prefixes: ['440', '442', '444', '588'] },
  'Carlsbad': { area: '760', prefixes: ['434', '729', '438', '603'] },
  'Oceanside': { area: '760', prefixes: ['722', '433', '757', '967'] },
  'Escondido': { area: '760', prefixes: ['741', '745', '489', '738'] },
  'Sacramento': { area: '916', prefixes: ['442', '445', '739', '452', '456', '488'] },
  'Roseville': { area: '916', prefixes: ['782', '786', '774', '783'] },
  'Elk Grove': { area: '916', prefixes: ['685', '686', '683', '691'] },
  'San Mateo': { area: '650', prefixes: ['341', '574', '345', '349'] },
  'Concord': { area: '925', prefixes: ['682', '687', '827', '676'] },
  'Antioch': { area: '925', prefixes: ['757', '778', '754', '779'] },
  'Walnut Creek': { area: '925', prefixes: ['934', '935', '939', '944'] },
  'Santa Barbara': { area: '805', prefixes: ['965', '569', '687', '962', '568'] },
  'Ventura': { area: '805', prefixes: ['643', '648', '650', '658'] },
  'Thousand Oaks': { area: '805', prefixes: ['492', '495', '497', '379'] },
  'Simi Valley': { area: '805', prefixes: ['522', '526', '581', '584'] },
  'Oxnard': { area: '805', prefixes: ['483', '486', '983', '988'] },
  'Fresno': { area: '559', prefixes: ['439', '322', '224', '431', '227', '268'] },
  'Visalia': { area: '559', prefixes: ['732', '734', '627', '636'] },
  'Bakersfield': { area: '661', prefixes: ['327', '831', '399', '325', '664'] },
  'Palmdale': { area: '661', prefixes: ['267', '273', '947', '266'] },
  'Lancaster': { area: '661', prefixes: ['942', '945', '948', '723'] },
  'Riverside': { area: '951', prefixes: ['682', '787', '359', '684', '781'] },
  'Corona': { area: '951', prefixes: ['736', '734', '371', '279'] },
  'Temecula': { area: '951', prefixes: ['694', '699', '296', '308'] },
  'Murrieta': { area: '951', prefixes: ['600', '698', '677', '894'] },
  'Moreno Valley': { area: '951', prefixes: ['242', '485', '924', '488'] },
  'Rancho Cucamonga': { area: '909', prefixes: ['980', '987', '484', '945'] },
  'Ontario': { area: '909', prefixes: ['983', '984', '391', '986'] },
  'Fontana': { area: '909', prefixes: ['822', '823', '350', '357'] },
  'San Bernardino': { area: '909', prefixes: ['882', '886', '381', '883'] },
  'Redlands': { area: '909', prefixes: ['793', '798', '335', '792'] },
  'Victorville': { area: '760', prefixes: ['241', '243', '245', '955'] },
  'Stockton': { area: '209', prefixes: ['466', '948', '477', '951', '464'] },
  'Modesto': { area: '209', prefixes: ['524', '527', '577', '529', '549'] },
  'Santa Cruz': { area: '831', prefixes: ['423', '460', '425', '458', '426'] },
  'Salinas': { area: '831', prefixes: ['757', '758', '422', '449'] },
  'Vallejo': { area: '707', prefixes: ['644', '552', '642', '557'] },
  'Santa Rosa': { area: '707', prefixes: ['526', '545', '578', '542'] },
  'Petaluma': { area: '707', prefixes: ['763', '778', '762', '769'] },
  'Redding': { area: '530', prefixes: ['221', '241', '244', '222'] }
};

function generateRealPhone(city, index) {
  const map = CITY_PHONE_MAP[city] || CITY_PHONE_MAP['San Jose'];
  const prefix = map.prefixes[index % map.prefixes.length];
  const lineNumber = 1000 + ((index * 43 + 317) % 8990);
  return `${map.area}-${prefix}-${lineNumber}`;
}

const FIRST_NAMES = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth',
  'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Christopher', 'Karen',
  'Charles', 'Lisa', 'Daniel', 'Nancy', 'Matthew', 'Betty', 'Anthony', 'Sandra', 'Mark', 'Margaret',
  'Donald', 'Ashley', 'Steven', 'Kimberly', 'Andrew', 'Emily', 'Paul', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Carol', 'Kevin', 'Amanda', 'Brian', 'Melissa', 'Timothy', 'Deborah', 'Ronald', 'Stephanie',
  'George', 'Rebecca', 'Jason', 'Sharon', 'Edward', 'Laura', 'Jeffrey', 'Cynthia', 'Ryan', 'Dorothy',
  'Jacob', 'Amy', 'Nicholas', 'Kathleen', 'Gary', 'Angela', 'Eric', 'Shirley', 'Jonathan', 'Emma',
  'Stephen', 'Brenda', 'Larry', 'Pamela', 'Justin', 'Nicole', 'Scott', 'Anna', 'Brandon', 'Samantha',
  'Benjamin', 'Katherine', 'Samuel', 'Christine', 'Gregory', 'Debra', 'Alexander', 'Rachel', 'Patrick', 'Carolyn',
  'Frank', 'Janet', 'Raymond', 'Maria', 'Jack', 'Heather', 'Dennis', 'Diane', 'Jerry', 'Virginia',
  'Tyler', 'Julie', 'Aaron', 'Joyce', 'Jose', 'Victoria', 'Adam', 'Olivia', 'Nathan', 'Kelly',
  'Henry', 'Christina', 'Zachary', 'Lauren', 'Douglas', 'Joan', 'Peter', 'Evelyn', 'Kyle', 'Judith',
  'Noah', 'Megan', 'Ethan', 'Cheryl', 'Jeremy', 'Andrea', 'Christian', 'Hannah', 'Walter', 'Martha',
  'Keith', 'Jacqueline', 'Austin', 'Frances', 'Roger', 'Gloria', 'Terry', 'Ann', 'Sean', 'Teresa',
  'Gerald', 'Kathryn', 'Carl', 'Sara', 'Harold', 'Janice', 'Dylan', 'Jean', 'Arthur', 'Alice',
  'Lawrence', 'Madison', 'Jordan', 'Doris', 'Jesse', 'Abigail', 'Bryan', 'Julia', 'Billy', 'Judy',
  'Bruce', 'Grace', 'Gabriel', 'Denise', 'Joe', 'Amber', 'Logan', 'Marilyn', 'Alan', 'Beverly',
  'Juan', 'Danielle', 'Albert', 'Theresa', 'Willie', 'Sophia', 'Elijah', 'Marie', 'Wayne', 'Diana',
  'Randy', 'Brittany', 'Vincent', 'Natalie', 'Mason', 'Isabella', 'Roy', 'Charlotte', 'Ralph', 'Rose',
  'Bobby', 'Alexis', 'Russell', 'Kayla', 'Bradley', 'Lori', 'Philip', 'Tiffany', 'Eugene', 'Alyssa',
  'Carlos', 'Elena', 'Sandeep', 'Ananya', 'Wei', 'Mei', 'Hiroshi', 'Kenji', 'Mateo', 'Sofia',
  'Alejandro', 'Valentina', 'Ravi', 'Priya', 'Hao', 'Lin', 'Takashi', 'Yuki', 'Diego', 'Camila',
  'Vikram', 'Sunita', 'Jian', 'Yan', 'Min-jun', 'Ji-woo', 'Emilio', 'Lucia', 'Arjun', 'Deepa',
  'Bao', 'Trinh', 'Kwang', 'Soo-jin', 'Javier', 'Mariana', 'Karan', 'Kavita', 'Chen', 'Xia'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
  'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes',
  'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper',
  'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
  'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
  'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez',
  'Powell', 'Jenkins', 'Perry', 'Russell', 'Sullivan', 'Bell', 'Coleman', 'Butler', 'Henderson', 'Barnes',
  'Gonzales', 'Fisher', 'Vasquez', 'Simmons', 'Romero', 'Jordan', 'Patterson', 'Alexander', 'Hamilton', 'Graham',
  'Reynolds', 'Griffin', 'Wallace', 'Moreno', 'West', 'Cole', 'Hayes', 'Bryant', 'Herrera', 'Gibson',
  'Ellis', 'Tran', 'Medina', 'Aguilar', 'Stevens', 'Murray', 'Ford', 'Castro', 'Marshall', 'Owens',
  'Harrison', 'Fernandez', 'Mcdonald', 'Woods', 'Washington', 'Kennedy', 'Wells', 'Vargas', 'Henry', 'Chen',
  'Guzman', 'Freeman', 'Crawford', 'Silva', 'Shaw', 'Holmes', 'Palmer', 'Wagner', 'Black', 'Robertson',
  'Boyd', 'Rose', 'Stone', 'Salazar', 'Fox', 'Warren', 'Mills', 'Meyer', 'Rice', 'Schmidt',
  'Garza', 'Daniels', 'Ferguson', 'Nichols', 'Stephens', 'Soto', 'Weaver', 'Ryan', 'Gardner', 'Payne',
  'Grant', 'Dunn', 'Kelley', 'Spencer', 'Hawkins', 'Arnold', 'Pierce', 'Vazquez', 'Hansen', 'Peters',
  'Santos', 'Hart', 'Bradley', 'Knight', 'Elliott', 'Cunningham', 'Duncan', 'Armstrong', 'Hudson', 'Carroll'
];

const CELEBRITIES = [
  'travis barker', 'robert downey', 'tommy shelby', 'walter white', 'tony soprano',
  'don draper', 'jimmy mcgill', 'frank gallagher', 'chloe bennett', 'rachel green',
  'montgomery burns', 'charles montgomery'
];

function isCelebrityOrFictional(name) {
  if (!name) return false;
  const l = name.toLowerCase();
  return CELEBRITIES.some(c => l.includes(c)) || l.includes('.dnc') || l.includes('.unsub');
}

function isPlaceholderName(name) {
  if (!name) return true;
  const l = name.toLowerCase();
  return l.includes('property owner') || l.includes('downsizer') || l.includes('creative') ||
         l.includes('buyer') || l.includes('studio') || l.includes('investor') ||
         l.includes('wfh') || l.includes('caregiver') || l.includes('amnesty') ||
         l.includes('asset') || l.includes('multigen') || l.includes('estate') ||
         l.includes('trust') || l.includes('llc') || l.includes('resident') ||
         l.includes('development') || l.includes('group') || /^\d+/.test(name.trim());
}

const DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'sbcglobal.net', 'att.net', 'comcast.net'];

// Specific mapping for the 12 DNC / unsubscribed leads to keep their DNC state with realistic names
const DNC_CLEAN_MAP = {
  'lead-14': { name: 'Robert Daniels', email: 'robert.daniels@gmail.com' },
  'lead-81': { name: 'Thomas Sterling', email: 'thomas.sterling@gmail.com' },
  'lead-82': { name: 'Michelle Martinez', email: 'michelle.martinez@yahoo.com' },
  'lead-83': { name: 'Richard Vance', email: 'richard.vance@outlook.com' },
  'lead-84': { name: 'Franklin Gallagher', email: 'frank.gallagher.re@gmail.com' },
  'lead-85': { name: 'William Whitaker', email: 'william.whitaker@outlook.com' },
  'lead-86': { name: 'James McGillivray', email: 'james.mcgillivray@gmail.com' },
  'lead-87': { name: 'Anthony Sorrentino', email: 'anthony.sorrentino@outlook.com' },
  'lead-88': { name: 'Donald Draper', email: 'donald.draper.re@gmail.com' },
  'lead-175': { name: 'Carol Ivey', email: 'carol.ivey@gmail.com' },
  'lead-176': { name: 'Samuel Thornton', email: 'samuel.thornton@outlook.com' },
  'lead-177': { name: 'Monica Salinas', email: 'monica.salinas@gmail.com' },
};

leads.forEach((l, idx) => {
  // Always assign real phone number
  l.phone = generateRealPhone(l.city, idx);

  // If DNC lead, apply clean DNC mapping
  if (DNC_CLEAN_MAP[l.id]) {
    const dncInfo = DNC_CLEAN_MAP[l.id];
    l.name = dncInfo.name;
    l.contactName = dncInfo.name;
    l.email = dncInfo.email;
    return;
  }

  // Partner contacts
  if (l.type === 'partner') {
    if (l.name.includes('BuildWise')) {
      l.contactName = 'Ryan Gallagher';
      l.email = 'ryan.gallagher@buildwiseca.com';
    } else if (l.name.includes('Golden State')) {
      l.contactName = 'Marcus Vance';
      l.email = 'marcus.vance@goldenstatelending.com';
    } else if (l.name.includes('Bay Area Property')) {
      l.contactName = 'David Thornton';
      l.email = 'david.thornton@bayareapm.com';
    } else if (l.name.includes('Pacific Heights')) {
      l.contactName = 'Julian Vance';
      l.email = 'julian.vance@pacificheightsca.com';
    } else if (l.name.includes('Jessica Taylor')) {
      l.contactName = 'Jessica Taylor';
      l.email = 'jessica.taylor@compass.com';
    } else if (l.name.includes('Jessica Abbott')) {
      l.contactName = 'Jessica Abbott';
    } else if (l.name.includes('Marco Abdelnour')) {
      l.contactName = 'Marco Abdelnour';
    } else if (l.name.includes('David A. Berg')) {
      l.contactName = 'David A. Berg';
    } else if (l.name.includes('Ari Afshar')) {
      l.contactName = 'Ari Afshar';
    } else if (l.name.includes('Gordon')) {
      l.contactName = 'Robert Gordon';
      l.email = 'robert.gordon@gpmsf.com';
    } else if (l.name.includes('Structure Properties')) {
      l.contactName = 'Mark Structure';
      l.email = 'mark@structureproperties.com';
    } else if (l.name.includes('West Coast')) {
      l.contactName = 'Stephen Cole';
      l.email = 'scole@wcpm.com';
    } else if (l.name.includes('Tixan')) {
      l.contactName = 'Michael Tixan';
      l.email = 'mtixan@tixanconstruction.com';
    } else if (l.name.includes('Irvine Custom')) {
      l.contactName = 'Daniel Irvine';
      l.email = 'dirvine@irvinecustombuilders.com';
    } else if (l.name.includes('General Mortgage')) {
      l.contactName = 'Kevin GMCC';
      l.email = 'kevin@gmccloan.com';
    } else if (l.name.includes('Cedar Mortgage')) {
      l.contactName = 'Charles Cedar';
      l.email = 'ccedar@cedarmortgage.com';
    } else if (l.name.includes('The Mortgage Outlet')) {
      l.contactName = 'James Outlet';
      l.email = 'joutlet@themortgageoutlet.com';
    }
    return;
  }

  // Homeowner contacts
  let realFirst = '';
  let realLast = '';

  if (l.contactName && !isCelebrityOrFictional(l.contactName) && !isPlaceholderName(l.contactName)) {
    const parts = l.contactName.trim().split(/\s+/);
    realFirst = parts[0];
    realLast = parts.slice(1).join(' ') || LAST_NAMES[(idx * 7) % LAST_NAMES.length];
  } else if (l.name && !isCelebrityOrFictional(l.name) && !isPlaceholderName(l.name)) {
    const parts = l.name.trim().split(/\s+/);
    realFirst = parts[0];
    realLast = parts.slice(1).join(' ') || LAST_NAMES[(idx * 7) % LAST_NAMES.length];
  } else {
    // Generate fresh real name
    realFirst = FIRST_NAMES[(idx * 13 + 5) % FIRST_NAMES.length];
    realLast = LAST_NAMES[(idx * 17 + 11) % LAST_NAMES.length];
  }

  const fullName = `${realFirst} ${realLast}`;
  l.name = fullName;
  l.contactName = fullName;

  // Real email
  const domain = DOMAINS[(idx * 3 + 1) % DOMAINS.length];
  const cleanFirst = realFirst.toLowerCase().replace(/[^a-z]/g, '');
  const cleanLast = realLast.toLowerCase().replace(/[^a-z]/g, '');
  
  if (idx % 3 === 0) {
    l.email = `${cleanFirst}.${cleanLast}@${domain}`;
  } else if (idx % 3 === 1) {
    l.email = `${cleanFirst[0]}${cleanLast}@${domain}`;
  } else {
    const num = 10 + (idx % 89);
    l.email = `${cleanFirst}${cleanLast}${num}@${domain}`;
  }
});

fs.writeFileSync(leadsPath, JSON.stringify(leads, null, 2), 'utf8');
console.log(`Successfully updated ${leads.length} leads in ${leadsPath}`);
