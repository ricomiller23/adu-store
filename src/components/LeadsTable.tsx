'use client';

import React, { useState, useTransition } from 'react';
import { 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MessageSquare, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ChevronRight,
  X,
  FileText,
  Clock,
  Plus,
  Compass,
  ShieldAlert,
  ArrowUpDown,
  User,
  Building2
} from 'lucide-react';
import { updateLeadStageAction, addLeadActivityAction } from '@/app/actions';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export interface LeadWithDetails {
  id: string;
  type: string;
  name: string;
  contactName: string | null;
  email: string;
  phone: string | null;
  city: string;
  county: string;
  jurisdiction: string;
  lotSizeSqft: number | null;
  segment: string;
  source: string;
  sourceDetail: string | null;
  score: number;
  stage: string;
  estValue: number | null;
  ab1033Eligible: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastTouchAt: Date;
  consent: {
    emailOptIn: boolean;
    phoneOptIn: boolean;
    smsOptIn: boolean;
    consentSource: string;
    consentText: string;
    consentIp: string;
    consentAt: Date;
  } | null;
  activities: {
    id: string;
    kind: string;
    summary: string;
    createdAt: Date;
  }[];
}

interface Suppression {
  id: string;
  value: string;
  reason: string;
  createdAt: Date;
}

interface LeadsTableProps {
  initialLeads: LeadWithDetails[];
  jurisdictions: { name: string; ab1033OptIn: boolean }[];
  initialSuppressions: Suppression[];
}

export default function LeadsTable({ initialLeads, jurisdictions, initialSuppressions }: LeadsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Tab State: 'leads' or 'dnc'
  const [activeTab, setActiveTab] = useState<'leads' | 'dnc'>('leads');

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [leadType, setLeadType] = useState('all');
  const [segment, setSegment] = useState('all');
  const [source, setSource] = useState('all');
  const [consent, setConsent] = useState('all');
  const [ab1033, setAb1033] = useState('all');

  // Sort order: 'individuals' = individuals first, 'companies' = companies first, 'az' = alphabetical by contact name
  const [sortOrder, setSortOrder] = useState<'individuals' | 'companies' | 'az'>('individuals');

  // Cycle through sort modes
  const cycleSortOrder = () => {
    setSortOrder(prev =>
      prev === 'individuals' ? 'companies' : prev === 'companies' ? 'az' : 'individuals'
    );
  };

  const sortLabel = sortOrder === 'individuals'
    ? 'Individuals First'
    : sortOrder === 'companies'
    ? 'Companies First'
    : 'A–Z Name';

  const SortIcon = sortOrder === 'individuals' ? User : sortOrder === 'companies' ? Building2 : ArrowUpDown;

  // Helper: is this lead an individual (has a real contactName that isn't a company/LLC/Trust keyword)?
  const isIndividual = (lead: LeadWithDetails) => {
    if (!lead.contactName) return false;
    const n = lead.name.toLowerCase();
    return !n.includes('llc') && !n.includes('trust') && !n.includes('inc') &&
           !n.includes('corp') && !n.includes('group') && !n.includes('dev') &&
           !n.includes('properties') && !n.includes('investment') && !n.includes('asset') &&
           !n.includes('equity') && !n.includes('studio') && !n.includes('estate');
  };

  // Selected lead for drawer
  const [selectedLead, setSelectedLead] = useState<LeadWithDetails | null>(null);

  // New activity form state
  const [newNote, setNewNote] = useState('');
  const [activityKind, setActivityKind] = useState('note');

  // Filter logic
  const filteredLeads = initialLeads.filter(lead => {
    // 1. Search filter
    if (search) {
      const q = search.toLowerCase();
      const matchName = lead.name.toLowerCase().includes(q);
      const matchContact = (lead.contactName || '').toLowerCase().includes(q);
      const matchEmail = lead.email.toLowerCase().includes(q);
      const matchCity = lead.city.toLowerCase().includes(q);
      const matchJuris = lead.jurisdiction.toLowerCase().includes(q);
      if (!matchName && !matchContact && !matchEmail && !matchCity && !matchJuris) return false;
    }

    // 2. Lead Type filter
    if (leadType !== 'all' && lead.type !== leadType) return false;

    // 3. Segment filter
    if (segment !== 'all' && lead.segment !== segment) return false;

    // 4. Source filter
    if (source !== 'all' && lead.source !== source) return false;

    // 5. Consent filter
    if (consent !== 'all') {
      const email = lead.consent?.emailOptIn;
      const phone = lead.consent?.phoneOptIn;
      const sms = lead.consent?.smsOptIn;
      if (consent === 'call_email' && !(email && phone)) return false;
      if (consent === 'email_only' && !(email && !phone)) return false;
      if (consent === 'no_consent' && (email || phone || sms)) return false;
    }

    // 6. AB 1033 filter
    if (ab1033 !== 'all') {
      const isEligible = lead.ab1033Eligible;
      if (ab1033 === 'eligible' && !isEligible) return false;
      if (ab1033 === 'not_eligible' && isEligible) return false;
    }

    return true;
  });

  const filteredSuppressions = initialSuppressions.filter(supp => {
    if (search) {
      const q = search.toLowerCase();
      return supp.value.toLowerCase().includes(q) || supp.reason.toLowerCase().includes(q);
    }
    return true;
  });

  // Apply sort to filtered leads
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortOrder === 'az') {
      const nameA = (a.contactName || a.name).toLowerCase();
      const nameB = (b.contactName || b.name).toLowerCase();
      return nameA.localeCompare(nameB);
    }
    if (sortOrder === 'individuals') {
      const aInd = isIndividual(a) ? 0 : 1;
      const bInd = isIndividual(b) ? 0 : 1;
      if (aInd !== bInd) return aInd - bInd;
      return (a.contactName || a.name).localeCompare(b.contactName || b.name);
    }
    // companies first
    const aComp = isIndividual(a) ? 1 : 0;
    const bComp = isIndividual(b) ? 1 : 0;
    if (aComp !== bComp) return aComp - bComp;
    return (a.contactName || a.name).localeCompare(b.contactName || b.name);
  });

  // Get consent label/state
  const getConsentState = (lead: LeadWithDetails) => {
    const email = lead.consent?.emailOptIn;
    const phone = lead.consent?.phoneOptIn;
    const sms = lead.consent?.smsOptIn;

    if (email && phone) return { label: 'Call + Email', color: 'bg-green-50 text-[#2f7d54] border-[#2f7d54]/20' };
    if (email) return { label: 'Email Only', color: 'bg-blue-50 text-[#27537d] border-[#27537d]/20' };
    return { label: 'No Consent', color: 'bg-red-50 text-red-700 border-red-200' };
  };

  // Recommended hooks based on segments
  const getSegmentHooks = (seg: string) => {
    switch (seg) {
      case 'H1':
        return [
          "AB 976 Rent rules: rent both the main house and ADU permanently.",
          "Cash flow math: Modular construction gives fixed pricing for predictable rental ROI.",
          "Route to financing: check home equity options to fund the build."
        ];
      case 'H2':
        return [
          "Privacy & proximity: live close to family while maintaining independent entryways.",
          "Aging parent safety: accessibility details (single-story, custom walk-in showers).",
          "Condo exit: AB 1033 lets you convert the ADU to a condo and sell separately where opted in."
        ];
      case 'H3':
        return [
          "Cost vs assisted living: a modular ADU is a one-time asset vs. $7k/mo nursing fees.",
          "Caregiver accommodation: house a live-in support caregiver on-site.",
          "Single-story accessible layout options."
        ];
      case 'H4':
        return [
          "Distraction-free backyard workspace away from the main home.",
          "Tax reassessment: CA reassesses only the new ADU structure, keeping home Prop 13 baseline.",
          "Lower utility costs: energy-efficient, solar-ready structures."
        ];
      case 'H5':
        return [
          "Reverse downsize logic: live in the ADU, rent the main house to fund retirement.",
          "Low-maintenance backyard living with maximum property control.",
          "Reduce yard maintenance and house utility costs."
        ];
      case 'H6':
        return [
          "Unlock high home equity using low-interest HELOC or construction loans.",
          "Projected ADU rental income can count toward loan qualifications.",
          "Boost resale valuation while shielding your primary tax base under Prop 13."
        ];
      case 'H7':
        return [
          "AB 2533 Legalization checklist: pre-2020 unpermitted ADUs can be legalized via a safety audit.",
          "Unlock equity: legalize to support refinancing or raise property value.",
          "Liability reduction: avoid zoning violations or tenant disputes."
        ];
      case 'H8':
        return [
          "SB 1211: Up to 8 detached ADUs allowed on multifamily lots.",
          "AB 1033 condo conversion opportunities for direct build-to-sell plays.",
          "Developer-focused volume discounts and modular build speed."
        ];
      case 'H9':
        return [
          "Lot optimization: adding an ADU is cheaper than purchasing a larger home.",
          "Factory modular speed means delivery in weeks and minimal site noise.",
          "Boost total resale value by up to 35% to 50% immediately."
        ];
      case 'P1':
        return [
          "Partner referral program: earn competitive referral commissions.",
          "Provide free site feasibility reports to increase client listing appeal.",
          "Collaborative agent webinars on California ADU regulations."
        ];
      case 'P2':
        return [
          "GC installer network: steady flow of qualified project leads.",
          "Modular convenience: factory-finished ADUs simplify on-site foundation & connection builds.",
          "Milestone-based partner payouts."
        ];
      case 'P3':
        return [
          "Mortgage broker cross-referrals: finance leads referred to your team.",
          "Leverage ADU-specific rental income calculations to qualify buyers.",
          "Vetted lender network participation."
        ];
      case 'P4':
        return [
          "PM portfolio expansion: increase recurring management fees by adding backyard ADUs to single-family rentals.",
          "Reseller commission tiers on modular ADU contracts.",
          "Dedicated marketing materials to share with property owners."
        ];
      default:
        return [
          "End-to-end convenience: We handle design, permits, and delivery.",
          "Modular builds mean minimal construction noise and neighbor disruption.",
          "Property appreciation: typical California ADUs boost resale values."
        ];
    }
  };

  // Handle stage change
  const handleStageChange = async (newStage: string) => {
    if (!selectedLead) return;
    startTransition(async () => {
      const updated = await updateLeadStageAction(selectedLead.id, newStage);
      // Update selected lead details in state
      setSelectedLead(prev => prev ? { ...prev, stage: newStage, activities: [
        { id: Math.random().toString(), kind: 'stage_change', summary: `Stage updated to ${newStage}`, createdAt: new Date() },
        ...prev.activities
      ]} : null);
      router.refresh();
    });
  };

  // Handle new activity note submit
  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNote.trim()) return;

    startTransition(async () => {
      const activity = await addLeadActivityAction(selectedLead.id, activityKind, newNote.trim());
      // Refresh timeline in drawer
      setSelectedLead(prev => prev ? {
        ...prev,
        lastTouchAt: new Date(),
        activities: [
          { id: activity.id, kind: activityKind, summary: newNote.trim(), createdAt: new Date() },
          ...prev.activities
        ]
      } : null);
      setNewNote('');
      router.refresh();
    });
  };

  // Close drawer
  const closeDrawer = () => {
    setSelectedLead(null);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-[#e4dfd3] bg-white rounded-lg px-4 pt-1 shadow-sm">
        <button
          onClick={() => { setActiveTab('leads'); setSearch(''); }}
          className={cn(
            "px-6 py-3.5 text-sm font-bold border-b-2 transition-all flex items-center",
            activeTab === 'leads'
              ? "border-[#16352a] text-[#16352a]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          )}
        >
          <Compass className="h-4 w-4 mr-2" />
          Leads Directory ({filteredLeads.length})
        </button>
        <button
          onClick={() => { setActiveTab('dnc'); setSearch(''); }}
          className={cn(
            "px-6 py-3.5 text-sm font-bold border-b-2 transition-all flex items-center",
            activeTab === 'dnc'
              ? "border-[#16352a] text-[#16352a]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          )}
        >
          <ShieldAlert className="h-4 w-4 mr-2 text-red-600" />
          DNC & Suppression Registry ({filteredSuppressions.length})
        </button>
      </div>

      {activeTab === 'leads' ? (
        <div className="bg-white border border-[#e4dfd3] shadow-sm rounded-lg overflow-hidden relative">
          {/* Table Filters Panel */}
          <div className="p-6 border-b border-[#e4dfd3] bg-[#faf9f6] space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, city..."
                  className="w-full pl-9 pr-4 py-2 border border-[#e4dfd3] rounded focus:outline-none focus:ring-2 focus:ring-[#27537d] text-sm bg-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-3">
                {/* Sort toggle */}
                <button
                  onClick={cycleSortOrder}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded border border-[#e4dfd3] bg-white text-sm font-semibold text-gray-700 hover:border-[#27537d] hover:text-[#27537d] transition-all shadow-sm"
                  title="Cycle sort order"
                >
                  <SortIcon className="h-4 w-4" />
                  <span>{sortLabel}</span>
                </button>
                <div className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
                  <Filter className="h-4 w-4 text-[#27537d]" />
                  <span>Filters</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {/* Type Filter */}
              <select
                className="px-3 py-2 border border-[#e4dfd3] rounded text-sm bg-white"
                value={leadType}
                onChange={(e) => setLeadType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="homeowner">Homeowners</option>
                <option value="partner">Partners</option>
              </select>

              {/* Segment Filter */}
              <select
                className="px-3 py-2 border border-[#e4dfd3] rounded text-sm bg-white"
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
              >
                <option value="all">All Segments</option>
                <option value="H1">H1 — Rental Investor</option>
                <option value="H2">H2 — Multigenerational Family</option>
                <option value="H3">H3 — Aging Parent / Caregiver</option>
                <option value="H4">H4 — Remote Office / Studio</option>
                <option value="H5">H5 — Empty-Nester Downsize</option>
                <option value="H6">H6 — Equity-Rich Owner</option>
                <option value="H7">H7 — Unpermitted Unit (Legalize)</option>
                <option value="H8">H8 — Multifamily Developer</option>
                <option value="H9">H9 — Recent Buyer / Large Lot</option>
                <option value="P1">P1 — Real Estate Agent Affiliate</option>
                <option value="P2">P2 — Contractor / Installer Network</option>
                <option value="P3">P3 — Mortgage Broker Partner</option>
                <option value="P4">P4 — Property Manager Affiliate</option>
              </select>

              {/* Source Filter */}
              <select
                className="px-3 py-2 border border-[#e4dfd3] rounded text-sm bg-white"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                <option value="all">All Sources</option>
                <option value="quiz">Feasibility Quiz</option>
                <option value="website">Website Form</option>
                <option value="google">Google Search</option>
                <option value="referral">Referral Match</option>
              </select>

              {/* Consent Filter */}
              <select
                className="px-3 py-2 border border-[#e4dfd3] rounded text-sm bg-white"
                value={consent}
                onChange={(e) => setConsent(e.target.value)}
              >
                <option value="all">All Consent States</option>
                <option value="call_email">Call + Email</option>
                <option value="email_only">Email Only</option>
                <option value="no_consent">No Consent</option>
              </select>

              {/* AB 1033 Filter */}
              <select
                className="px-3 py-2 border border-[#e4dfd3] rounded text-sm bg-white"
                value={ab1033}
                onChange={(e) => setAb1033(e.target.value)}
              >
                <option value="all">All AB 1033 States</option>
                <option value="eligible">AB 1033 Eligible</option>
                <option value="not_eligible">Not Eligible</option>
              </select>
            </div>
          </div>

          {/* Leads Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e4dfd3] bg-[#faf9f6] text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">
                    <button onClick={cycleSortOrder} className="flex items-center space-x-1 hover:text-[#27537d] transition">
                      <span>Contact / Property</span>
                      <SortIcon className="h-3.5 w-3.5 ml-1" />
                    </button>
                  </th>
                  <th className="px-6 py-4">Jurisdiction</th>
                  <th className="px-6 py-4">Segment</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Consent</th>
                  <th className="px-6 py-4">Stage</th>
                  <th className="px-6 py-4">Last Touch</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {sortedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                      No leads found matching current filter parameters.
                    </td>
                  </tr>
                ) : (
                  sortedLeads.map((lead) => {
                    const cState = getConsentState(lead);
                    return (
                      <tr 
                        key={lead.id} 
                        className="hover:bg-gray-50/50 cursor-pointer transition duration-150"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <td className="px-6 py-4">
                          {/* Human contact name (primary) */}
                          {lead.contactName ? (
                            <div className="flex items-center space-x-1.5">
                              <User className="h-3.5 w-3.5 text-[#27537d] flex-shrink-0" />
                              <span className="font-bold text-gray-900">{lead.contactName}</span>
                            </div>
                          ) : null}
                          {/* Property / company name (secondary) */}
                          <div className={cn(
                            "text-xs font-medium",
                            lead.contactName ? "text-gray-400 mt-0.5" : "font-semibold text-gray-900"
                          )}>
                            {lead.name}
                          </div>
                          <div className="text-xs text-gray-400">{lead.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-gray-700 font-medium">{lead.jurisdiction}</span>
                            {lead.ab1033Eligible && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#dd8420]/15 text-[#dd8420] border border-[#dd8420]/25">
                                AB 1033 Opt-In
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#f6f4ee] border border-[#e4dfd3] text-gray-600">
                            {lead.segment}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className={cn(
                              "font-bold text-xs",
                              lead.score >= 80 ? "text-[#dd8420]" : "text-gray-500"
                            )}>
                              {lead.score}
                            </span>
                            <div className="w-12 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full",
                                  lead.score >= 80 ? "bg-[#dd8420]" : "bg-[#27537d]"
                                )} 
                                style={{ width: `${lead.score}%` }} 
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center px-2 py-0.5 border rounded text-xs font-semibold",
                            cState.color
                          )}>
                            {cState.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider",
                            lead.stage === 'Won' || lead.stage === 'Active'
                              ? "bg-green-50 text-[#2f7d54]"
                              : lead.stage === 'New' || lead.stage === 'Applied'
                              ? "bg-blue-50 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          )}>
                            {lead.stage}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-medium">
                          {new Date(lead.lastTouchAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => setSelectedLead(lead)}
                            className="p-1 text-gray-400 hover:text-[#27537d] rounded hover:bg-gray-100 transition"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#e4dfd3] shadow-sm rounded-lg overflow-hidden p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-2 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-gray-900 font-display">Do Not Contact (DNC) Registry</h3>
              <p className="text-xs text-gray-500 mt-1">Blocked email addresses and phone numbers screened before any sales or sequence outreach is conducted.</p>
            </div>
            {/* Search bar inside DNC */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search suppressed contacts..."
                className="w-full pl-9 pr-4 py-2 border border-[#e4dfd3] rounded focus:outline-none focus:ring-2 focus:ring-[#27537d] text-sm bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-[#e4dfd3] rounded-lg">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#e4dfd3] bg-[#faf9f6] text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Blocked Email/Phone</th>
                  <th className="px-6 py-4">Reason / Source</th>
                  <th className="px-6 py-4">Enforcement Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredSuppressions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                      No blocked contacts found in registry.
                    </td>
                  </tr>
                ) : (
                  filteredSuppressions.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-mono font-semibold text-gray-900 text-xs">
                        {s.value}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200 capitalize">
                          {s.reason.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">
                        {new Date(s.createdAt).toLocaleDateString()} {new Date(s.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-out Drawer Overlay */}
      {selectedLead && (
        <div 
          className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-sm"
          onClick={closeDrawer}
        >
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            {/* Drawer Content */}
            <div 
              className="w-screen max-w-lg bg-[#f6f4ee] border-l border-[#e4dfd3] shadow-2xl flex flex-col h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header in Deep Pine */}
              <div className="bg-[#16352a] text-white px-6 py-5 flex items-center justify-between">
                <div>
                  {/* Human contact name — primary identity */}
                  {selectedLead.contactName && (
                    <div className="flex items-center space-x-1.5 mb-1">
                      <User className="h-4 w-4 text-[#a3b899]" />
                      <h3 className="text-lg font-bold font-display text-white">{selectedLead.contactName}</h3>
                    </div>
                  )}
                  {/* Property / company name */}
                  <p className={cn(
                    "font-medium text-[#a3b899]",
                    selectedLead.contactName ? "text-sm" : "text-lg font-bold font-display text-white"
                  )}>
                    {selectedLead.name}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="px-2 py-0.5 bg-[#27537d] border border-[#27537d]/20 rounded text-[11px] font-bold text-white uppercase tracking-wider">
                      {selectedLead.segment}
                    </span>
                    {selectedLead.ab1033Eligible && (
                      <span className="px-2 py-0.5 bg-[#dd8420]/20 border border-[#dd8420]/30 rounded text-[10px] font-bold text-[#f2a146]">
                        AB 1033 Opt-In
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={closeDrawer}
                  className="p-1 rounded-full text-[#a3b899] hover:text-white hover:bg-[#1a3f32] transition"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Drawer Body Scroll */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Score bar & Consent Chip */}
                <div className="bg-white border border-[#e4dfd3] rounded-lg p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Lead Score</span>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className={cn(
                        "text-2xl font-bold font-display",
                        selectedLead.score >= 80 ? "text-[#dd8420]" : "text-[#27537d]"
                      )}>
                        {selectedLead.score}
                      </span>
                      {selectedLead.score >= 80 && (
                        <span className="inline-flex items-center px-1.5 py-0.5 bg-[#dd8420]/10 text-[#dd8420] text-[10px] font-bold rounded uppercase tracking-wider">
                          <Flame className="h-3 w-3 mr-1" />
                          Hot Lead
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Consent Level</span>
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-1 border rounded font-semibold text-xs",
                      getConsentState(selectedLead).color
                    )}>
                      {getConsentState(selectedLead).label}
                    </span>
                  </div>
                </div>

                {/* Stage dropdown */}
                <div className="bg-white border border-[#e4dfd3] rounded-lg p-4 shadow-sm">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Outreach Pipeline Stage
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-[#e4dfd3] rounded text-sm bg-white font-semibold text-gray-700"
                    value={selectedLead.stage}
                    onChange={(e) => handleStageChange(e.target.value)}
                    disabled={isPending}
                  >
                    {selectedLead.type === 'homeowner' ? (
                      <>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Consult booked">Consult Booked</option>
                        <option value="In design">In design</option>
                        <option value="Won">Won</option>
                      </>
                    ) : (
                      <>
                        <option value="Applied">Applied</option>
                        <option value="Vetting">Vetting</option>
                        <option value="Terms sent">Terms Sent</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Contact Information */}
                <div className="bg-white border border-[#e4dfd3] rounded-lg p-4 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
                    Lead Details
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                    <div>
                      <span className="text-gray-400 text-xs block">Email</span>
                      <span className="font-medium text-gray-800 break-all">{selectedLead.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">Phone</span>
                      <span className="font-medium text-gray-800">{selectedLead.phone || '—'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">Location</span>
                      <span className="font-medium text-gray-800">{selectedLead.city}, {selectedLead.county}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">Lot Size (Sqft)</span>
                      <span className="font-medium text-gray-800">
                        {selectedLead.lotSizeSqft ? `${selectedLead.lotSizeSqft.toLocaleString()} sqft` : '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">Estimated Value</span>
                      <span className="font-medium text-[#2f7d54] font-semibold">
                        {selectedLead.estValue ? `$${selectedLead.estValue.toLocaleString()}` : '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">Source Channel</span>
                      <span className="font-medium text-gray-800 capitalize">
                        {selectedLead.source} {selectedLead.sourceDetail ? `(${selectedLead.sourceDetail})` : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommended Hooks (from Benefit Library) */}
                <div className="bg-white border border-[#e4dfd3] rounded-lg p-4 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center text-[#dd8420] border-b border-gray-100 pb-2">
                    <Sparkles className="h-4 w-4 mr-1.5" />
                    Recommended Benefit Hooks
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-600 list-disc list-inside">
                    {getSegmentHooks(selectedLead.segment).map((hook, idx) => (
                      <li key={idx} className="leading-relaxed font-medium">
                        {hook}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Gated Outreach Actions */}
                <div className="bg-white border border-[#e4dfd3] rounded-lg p-4 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
                    Outreach Channels (Consent Gated)
                  </h4>
                  <div className="flex gap-2">
                    {/* Email button: always enabled if lead has email */}
                    <button 
                      onClick={() => alert(`Queueing email to: ${selectedLead.email}`)}
                      className="flex-1 flex items-center justify-center py-2 px-3 bg-[#27537d] text-white text-xs font-bold rounded shadow hover:bg-[#1f4366] transition"
                    >
                      <Mail className="h-4 w-4 mr-1.5" />
                      Email
                    </button>

                    {/* Phone call button */}
                    {selectedLead.consent?.phoneOptIn ? (
                      <button 
                        onClick={() => alert(`Simulating outbound call to: ${selectedLead.phone}`)}
                        className="flex-1 flex items-center justify-center py-2 px-3 bg-[#2f7d54] text-white text-xs font-bold rounded shadow hover:bg-[#225c3c] transition"
                      >
                        <Phone className="h-4 w-4 mr-1.5" />
                        Call
                      </button>
                    ) : (
                      <div className="flex-1 group relative">
                        <button 
                          disabled 
                          className="w-full flex items-center justify-center py-2 px-3 bg-gray-100 text-gray-400 text-xs font-bold rounded border border-gray-200 cursor-not-allowed"
                        >
                          <Phone className="h-4 w-4 mr-1.5" />
                          Call
                        </button>
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-36 px-2 py-1 bg-gray-900 text-white text-[10px] rounded text-center opacity-0 group-hover:opacity-100 pointer-events-none transition duration-150 shadow-md">
                          No Phone Consent
                        </span>
                      </div>
                    )}

                    {/* SMS button */}
                    {selectedLead.consent?.smsOptIn ? (
                      <button 
                        onClick={() => alert(`Simulating SMS outbound to: ${selectedLead.phone}`)}
                        className="flex-1 flex items-center justify-center py-2 px-3 bg-[#dd8420] text-white text-xs font-bold rounded shadow hover:bg-[#c27116] transition"
                      >
                        <MessageSquare className="h-4 w-4 mr-1.5" />
                        SMS
                      </button>
                    ) : (
                      <div className="flex-1 group relative">
                        <button 
                          disabled 
                          className="w-full flex items-center justify-center py-2 px-3 bg-gray-100 text-gray-400 text-xs font-bold rounded border border-gray-200 cursor-not-allowed"
                        >
                          <MessageSquare className="h-4 w-4 mr-1.5" />
                          SMS
                        </button>
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-36 px-2 py-1 bg-gray-900 text-white text-[10px] rounded text-center opacity-0 group-hover:opacity-100 pointer-events-none transition duration-150 shadow-md">
                          No SMS Consent
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline / Activity Logs */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Interaction Timeline
                  </h4>

                  {/* Add manual activity */}
                  <form onSubmit={handleAddActivity} className="bg-white border border-[#e4dfd3] rounded-lg p-3 shadow-sm space-y-2">
                    <div className="flex gap-2">
                      <select
                        className="px-2 py-1 border border-[#e4dfd3] rounded text-xs bg-white font-semibold text-gray-600"
                        value={activityKind}
                        onChange={(e) => setActivityKind(e.target.value)}
                      >
                        <option value="note">Add Note</option>
                        <option value="call">Log Call</option>
                        <option value="email_sent">Log Email</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Log contact or add internal note..."
                        className="flex-1 px-3 py-1.5 border border-[#e4dfd3] rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#27537d]"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                      />
                      <button
                        type="submit"
                        disabled={isPending || !newNote.trim()}
                        className="p-1.5 bg-[#27537d] text-white rounded hover:bg-[#1f4366] transition disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </form>

                  {/* Timeline list */}
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {selectedLead.activities.map((act, actIdx) => (
                        <li key={act.id}>
                          <div className="relative pb-8">
                            {actIdx !== selectedLead.activities.length - 1 ? (
                              <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className={cn(
                                  "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white text-white",
                                  act.kind === 'quiz' ? "bg-purple-500" :
                                  act.kind === 'stage_change' ? "bg-blue-500" :
                                  act.kind === 'email_sent' ? "bg-[#27537d]" :
                                  act.kind === 'call' ? "bg-[#2f7d54]" : "bg-gray-400"
                                )}>
                                  {act.kind === 'quiz' ? <Compass className="h-4 w-4" /> :
                                   act.kind === 'email_sent' ? <Mail className="h-4 w-4" /> :
                                   act.kind === 'call' ? <Phone className="h-4 w-4" /> :
                                   act.kind === 'stage_change' ? <Clock className="h-4 w-4" /> :
                                   <FileText className="h-4 w-4" />}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0 pt-1.5">
                                <p className="text-xs font-semibold text-gray-800">
                                  {act.summary}
                                </p>
                                <div className="text-right text-[10px] whitespace-nowrap text-gray-400 font-medium mt-0.5">
                                  {new Date(act.createdAt).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
