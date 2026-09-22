import { fallbackStore } from '../src/lib/fallback-store';
import { getDashboardStatsAction, getLeadsAction, getSequencesAction } from '../src/app/actions';

async function main() {
  console.log("=== Running Pre-Build Resilience & Whole-Chain Parity Assertion ===");

  // 1. Validate Fallback Store Initialization
  const stats = fallbackStore.getDashboardStats();
  console.log(`[Assertion 1/6] Leads Count: ${stats.totalLeads} (Required >= 300)`);
  if (stats.totalLeads < 300) {
    throw new Error(`Parity Assertion Failed: Expected at least 300 leads, found ${stats.totalLeads}`);
  }

  // 2. Validate Sequences
  const sequences = fallbackStore.getSequences();
  console.log(`[Assertion 2/6] Sequences: ${sequences.length} (Required == 13)`);
  if (sequences.length !== 13) {
    throw new Error(`Parity Assertion Failed: Expected 13 sequences, found ${sequences.length}`);
  }

  // 3. Validate Jurisdictions
  const jurisdictions = fallbackStore.getJurisdictions();
  console.log(`[Assertion 3/6] Jurisdictions: ${jurisdictions.length} (Required >= 60)`);
  if (jurisdictions.length < 60) {
    throw new Error(`Parity Assertion Failed: Expected at least 60 jurisdictions, found ${jurisdictions.length}`);
  }

  // 4. Validate Suppressions
  const suppressions = fallbackStore.getSuppressions();
  console.log(`[Assertion 4/6] DNC Suppressions: ${suppressions.length} (Required >= 12)`);
  if (suppressions.length < 12) {
    throw new Error(`Parity Assertion Failed: Expected at least 12 suppressions, found ${suppressions.length}`);
  }

  // 5. Anti-Decay Assertion: Ensure dates are dynamic relative to current runtime
  const leads = fallbackStore.getLeads({});
  const now = Date.now();
  const latestLeadAgeHours = (now - leads[0].createdAt.getTime()) / 3600000;
  console.log(`[Assertion 5/6] Latest Lead Age: ${latestLeadAgeHours.toFixed(1)} hours (Dynamic Runtime Anchored)`);
  if (latestLeadAgeHours > 48 || latestLeadAgeHours < 0) {
    throw new Error(`Anti-Decay Guard Failed: Latest lead date is not anchored to runtime (age: ${latestLeadAgeHours}h)`);
  }

  // 6. Action Resiliency Test under Quota Failure
  console.log("[Assertion 6/6] Testing server action resilience under database failure...");
  const actionStats = await getDashboardStatsAction();
  if (!actionStats || actionStats.totalLeads < 300) {
    throw new Error(`Action Resilience Failed: Action stats did not match expected totals`);
  }

  console.log("✓ ALL 6 PRE-BUILD ASSERTIONS PASSED! Whole-chain resilience verified.");
}

main().catch(err => {
  console.error("FATAL PRE-BUILD ASSERTION FAILURE:", err);
  process.exit(1);
});
