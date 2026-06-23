export interface LeadScoringInput {
  segment: string;
  city: string;
  lotSizeSqft?: number | null;
  activities: { kind: string }[];
  isAb1033Eligible: boolean;
}

export function calculateLeadScore(input: LeadScoringInput): number {
  let score = 0;

  // 1. Intent Signals from Activities
  const activityKinds = input.activities.map(a => a.kind);
  
  if (activityKinds.includes('quiz')) {
    score += 25; // Quiz completed
  }
  if (activityKinds.includes('consult')) {
    score += 30; // Consult booked
  }
  if (activityKinds.includes('financing_pdf')) {
    score += 15; // Financing PDF downloaded
  }
  
  // Count visits (multiple visits = 2 or more visit events)
  const visitCount = activityKinds.filter(k => k === 'visit').length;
  if (visitCount >= 2) {
    score += 10;
  } else if (visitCount === 1) {
    score += 5;
  }

  // 2. Fit Signals
  // Lot size fit (e.g., lot sizes between 3,500 and 10,000 sqft are ideal for detached ADUs)
  if (input.lotSizeSqft) {
    if (input.lotSizeSqft >= 5000) {
      score += 10;
    } else if (input.lotSizeSqft >= 3500) {
      score += 7;
    }
  }

  // 3. Segment Weight
  // H1 (Rental investor) and H8 (Developer) have high commercial intent
  if (input.segment === 'H1' || input.segment === 'H8') {
    score += 10;
  } else if (input.segment === 'H2' || input.segment === 'H3' || input.segment === 'H7') {
    score += 5; // Family, Aging, Unpermitted have moderate intent
  }

  // 4. Geography Bonus
  // Jurisdiction opted into AB 1033
  if (input.isAb1033Eligible) {
    score += 5;
  }

  // Cap score between 0 and 100
  return Math.min(Math.max(score, 0), 100);
}

export function isHotLead(score: number): boolean {
  return score >= 80;
}
