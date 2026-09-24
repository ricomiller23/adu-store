import { fallbackStore } from '../src/lib/fallback-store';
import { getDashboardStatsAction, getLeadsAction, getSequencesAction } from '../src/app/actions';

async function main() {
  console.log("=== Running Pre-Build Resilience & Whole-Chain Parity Assertion (with Outbound CRM) ===");

  // 1. Validate Fallback Store Initialization
  const stats = fallbackStore.getDashboardStats();
  console.log(`[Assertion 1/7] Leads Count: ${stats.totalLeads} (Required >= 300)`);
  if (stats.totalLeads < 300) {
    throw new Error(`Parity Assertion Failed: Expected at least 300 leads, found ${stats.totalLeads}`);
  }

  // 2. Validate Sequences
  const sequences = fallbackStore.getSequences();
  console.log(`[Assertion 2/7] Sequences: ${sequences.length} (Required == 13)`);
  if (sequences.length !== 13) {
    throw new Error(`Parity Assertion Failed: Expected 13 sequences, found ${sequences.length}`);
  }

  // 3. Validate Jurisdictions
  const jurisdictions = fallbackStore.getJurisdictions();
  console.log(`[Assertion 3/7] Jurisdictions: ${jurisdictions.length} (Required >= 60)`);
  if (jurisdictions.length < 60) {
    throw new Error(`Parity Assertion Failed: Expected at least 60 jurisdictions, found ${jurisdictions.length}`);
  }

  // 4. Validate Suppressions
  const suppressions = fallbackStore.getSuppressions();
  console.log(`[Assertion 4/7] DNC Suppressions: ${suppressions.length} (Required >= 12)`);
  if (suppressions.length < 12) {
    throw new Error(`Parity Assertion Failed: Expected at least 12 suppressions, found ${suppressions.length}`);
  }

  // 5. Anti-Decay Assertion: Ensure dates are dynamic relative to current runtime
  const leads = fallbackStore.getLeads({});
  const now = Date.now();
  const latestLeadAgeHours = (now - leads[0].createdAt.getTime()) / 3600000;
  console.log(`[Assertion 5/7] Latest Lead Age: ${latestLeadAgeHours.toFixed(1)} hours (Dynamic Runtime Anchored)`);
  if (latestLeadAgeHours > 48 || latestLeadAgeHours < 0) {
    throw new Error(`Anti-Decay Guard Failed: Latest lead date is not anchored to runtime (age: ${latestLeadAgeHours}h)`);
  }

  // 6. Action Resiliency Test under Quota Failure
  console.log("[Assertion 6/7] Testing server action resilience under database failure...");
  const actionStats = await getDashboardStatsAction();
  if (!actionStats || actionStats.totalLeads < 300) {
    throw new Error(`Action Resilience Failed: Action stats did not match expected totals`);
  }

  // 7. Validate Outbound Email CRM Engine & theADUstore.com Personalization
  const outboundProps = fallbackStore.getOutboundProperties();
  console.log(`[Assertion 7/7] Outbound Properties: ${outboundProps.length} (Required >= 300)`);
  if (outboundProps.length < 300) {
    throw new Error(`Outbound CRM Assertion Failed: Expected at least 300 properties, found ${outboundProps.length}`);
  }
  const sampleEmail = fallbackStore.getOutboundEmail(outboundProps[0].leadId);
  if (!sampleEmail || !sampleEmail.html.includes("theADUstore.com") || !sampleEmail.subject) {
    throw new Error("Outbound CRM Assertion Failed: Sample email is missing theADUstore.com branding or subject");
  }

  console.log("✓ ALL 7 PRE-BUILD ASSERTIONS PASSED! Whole-chain resilience & Outbound CRM verified.");
}

main().catch(err => {
  console.error("FATAL PRE-BUILD ASSERTION FAILURE:", err);
  process.exit(1);
});
