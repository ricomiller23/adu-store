export interface LeadContext {
  id?: string;
  name?: string | null;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  address?: string | null;
  segment?: string | null;
  lotSizeSqft?: number | null;
}

export const SEGMENT_HOOKS: Record<string, (city: string) => string> = {
  H1: (city: string) =>
    `Under current law (AB 976) you can rent it out for income without living on-site — so the real question is payback, and the numbers in ${city} are usually better than people expect.`,
  H2: () =>
    `It's the option most families land on when they want parents or adult kids close — private space, without the cost of moving or a care facility.`,
  H3: () =>
    `A lot of families use one to keep a parent nearby and safe — often for far less than assisted living. No rush; happy to just share the options.`,
  H4: () =>
    `A detached office or studio is the fastest, lowest-friction build — many are permitted and installed in months, not years.`,
  H5: () =>
    `Some owners live in the ADU and rent or sell the main house — a way to unlock the home's value without leaving the neighborhood.`,
  H6: () =>
    `There are financing paths that let you build against your equity, so the project can pay for itself over time rather than out of pocket.`,
  H7: () =>
    `If that older unit was built without permits, AB 2533 may let you legalize it on a safety checklist — turning a liability into a refinanceable, rentable asset.`,
  H8: () =>
    `On a multifamily lot you may be able to add several detached units (SB 1211) — the build-to-rent math is worth running properly.`,
  H9: () =>
    `No rush at all — but with a lot your size it's worth knowing your options now so you can plan around them.`,
};

export const PARTNER_HOOKS: Record<string, string> = {
  P1: `an ADU is often the thing that wins a listing or closes a hesitant buyer on a big lot.`,
  P2: `we have steady modular install work and could use a reliable local crew.`,
  P3: `ADU financing is a natural add-on to your pipeline — we can send referrals both ways.`,
  P4: `more rentable units on the properties you manage means more doors under management.`,
};

export const MERGE_FIELD_DOCS = [
  { tag: '{{firstName}}', desc: 'First name of contact (or "Neighbor" / "Homeowner")' },
  { tag: '{{city}}', desc: 'Property city (e.g. San Jose, Irvine)' },
  { tag: '{{repName}}', desc: 'Sender rep name (e.g. David Miller)' },
  { tag: '{{brand}}', desc: 'Brand name (The ADU Store)' },
  { tag: '{{lotSizeText}}', desc: 'Formatted lot capability read' },
  { tag: '{{segmentHook}}', desc: 'Tailored segment hook (H1-H9)' },
  { tag: '{{partnerHook}}', desc: 'Tailored partner hook (P1-P4)' },
  { tag: '{{bookingLink}}', desc: '15-minute consult booking link' },
  { tag: '{{companyAddress}}', desc: 'CAN-SPAM physical business address' },
  { tag: '{{unsubscribeLink}}', desc: 'Instant one-click opt-out URL' },
  { tag: '{{quizLink}}', desc: 'Attributed feasibility quiz link for cold outreach' },
  { tag: '{{address}}', desc: 'Full property address if available' },
];

export function extractFirstName(fullNameOrContact?: string | null): string {
  if (!fullNameOrContact) return 'Neighbor';
  const clean = fullNameOrContact.trim();
  const lower = clean.toLowerCase();
  if (lower.includes('llc') || lower.includes('trust') || lower.includes('inc') || lower.includes('corp') || lower.includes('holdings')) {
    return 'Homeowner';
  }
  const first = clean.split(/\s+/)[0];
  if (!first) return 'Neighbor';
  return first.charAt(0).toUpperCase() + first.slice(1);
}

export function renderEmailTemplate(template: string, lead: LeadContext): string {
  if (!template) return '';

  const city = lead.city?.trim() || 'California';
  const firstName = extractFirstName(lead.contactName || lead.name);
  const repName = process.env.REP_NAME || 'David Miller';
  const brand = process.env.BRAND_NAME || 'The ADU Store';

  const lotSizeText = lead.lotSizeSqft
    ? `a detached modular ADU up to 1,200 sqft on your ${lead.lotSizeSqft.toLocaleString()} sqft lot`
    : `a detached modular ADU up to 1,200 sqft`;

  const segment = (lead.segment || 'H1').toUpperCase();
  const segmentHook = SEGMENT_HOOKS[segment]
    ? SEGMENT_HOOKS[segment](city)
    : SEGMENT_HOOKS['H1'](city);

  const partnerHook = PARTNER_HOOKS[segment] || PARTNER_HOOKS['P1'];

  const bookingLink = process.env.BOOKING_LINK || 'https://theadustore.com/book';
  const companyAddress = process.env.PHYSICAL_ADDRESS || '123 Modular Way, Sacramento, CA 95814';

  const baseUrl = process.env.NEXTAUTH_URL || process.env.APP_URL || 'https://hass-lead-generator.vercel.app';
  const emailParam = lead.email ? encodeURIComponent(lead.email) : '';
  const unsubscribeLink = `${baseUrl}/api/unsubscribe?email=${emailParam}`;

  const quizBase = process.env.QUIZ_URL || 'https://theadustore.com/quiz';
  const quizLink = `${quizBase}?ref=${lead.id || 'direct'}&city=${encodeURIComponent(city)}`;
  const address = lead.address || `${city}, CA`;

  return template
    .replaceAll('{{firstName}}', firstName)
    .replaceAll('{{name}}', firstName)
    .replaceAll('{{city}}', city)
    .replaceAll('{{repName}}', repName)
    .replaceAll('{{brand}}', brand)
    .replaceAll('{{lotSizeText}}', lotSizeText)
    .replaceAll('{{segmentHook}}', segmentHook)
    .replaceAll('{{partnerHook}}', partnerHook)
    .replaceAll('{{bookingLink}}', bookingLink)
    .replaceAll('{{companyAddress}}', companyAddress)
    .replaceAll('{{unsubscribeLink}}', unsubscribeLink)
    .replaceAll('{{quizLink}}', quizLink)
    .replaceAll('{{address}}', address);
}

export function renderEmailSubject(subject: string | null | undefined, lead: LeadContext): string {
  if (!subject) return '';
  return renderEmailTemplate(subject, lead);
}

export const SAMPLE_PREVIEW_LEADS: Record<string, LeadContext> = {
  H1: {
    id: 'sample-h1',
    name: 'Marcus & Elena Vance',
    contactName: 'Marcus Vance',
    email: 'marcus.vance@example.com',
    city: 'San Jose',
    address: '1428 Willow Glen Way, San Jose, CA',
    segment: 'H1',
    lotSizeSqft: 7200,
  },
  H2: {
    id: 'sample-h2',
    name: 'Robert Chen',
    contactName: 'Robert Chen',
    email: 'rchen@example.com',
    city: 'Pasadena',
    address: '890 Orange Grove Blvd, Pasadena, CA',
    segment: 'H2',
    lotSizeSqft: 8500,
  },
  P1: {
    id: 'sample-p1',
    name: 'Sarah Jenkins Realty Group',
    contactName: 'Sarah Jenkins',
    email: 'sarah@jenkinsrealty.com',
    city: 'San Diego',
    address: 'San Diego, CA',
    segment: 'P1',
  },
  COLD: {
    id: 'sample-cold',
    name: 'David & Karen Miller',
    contactName: 'David Miller',
    email: 'dmiller@example.com',
    city: 'Sacramento',
    address: '3200 Elm Street, Sacramento, CA',
    segment: 'COLD',
    lotSizeSqft: 6100,
  }
};
