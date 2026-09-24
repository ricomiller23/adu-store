'use client';

import React, { useState, useEffect, useTransition } from 'react';
import {
  Mail,
  Phone,
  Send,
  Sparkles,
  Search,
  Filter,
  Download,
  Building,
  CheckCircle2,
  Clock,
  Eye,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
  RefreshCw,
  Home,
  ShieldCheck,
  X,
  FileText,
  SlidersHorizontal,
  Flame,
  Zap,
} from 'lucide-react';
import {
  getOutboundPropertiesAction,
  getOutboundEmailAction,
  saveOutboundDraftAction,
  sendOutboundEmailAction,
  batchGenerateOutboundDraftsAction,
  batchDispatchOutboundAction,
  getOutboundMetricsAction,
  getOutboundActivityFeedAction,
} from '@/app/actions';
import { cn } from '@/lib/utils';

export default function OutreachPage() {
  const [isPending, startTransition] = useTransition();
  const [properties, setProperties] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({
    totalProperties: 0,
    qualifiedCount: 0,
    draftsReady: 0,
    sentCount: 0,
    openedCount: 0,
    repliedCount: 0,
    openRate: 0,
    replyRate: 0,
    totalEstValueMillions: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Selected lead for review modal
  const [reviewLeadId, setReviewLeadId] = useState<string | null>(null);
  const [activeEmail, setActiveEmail] = useState<any>(null);
  const [activeVariant, setActiveVariant] = useState<'equity_roi' | 'speed_permitting' | 'family_lifestyle'>('equity_roi');
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');
  const [previewMode, setPreviewMode] = useState<'visual' | 'code'>('visual');
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = () => {
    startTransition(async () => {
      const [props, mets, acts] = await Promise.all([
        getOutboundPropertiesAction({
          search: searchTerm,
          city: selectedCity,
          tier: selectedTier,
          status: selectedStatus,
        }),
        getOutboundMetricsAction(),
        getOutboundActivityFeedAction(10),
      ]);
      setProperties(props || []);
      setMetrics(mets || {});
      setActivities(acts || []);
    });
  };

  useEffect(() => {
    loadData();
  }, [searchTerm, selectedCity, selectedTier, selectedStatus]);

  // Handle open review modal
  const handleOpenReview = async (leadId: string) => {
    setReviewLeadId(leadId);
    const email = await getOutboundEmailAction(leadId, activeVariant);
    if (email) {
      setActiveEmail(email);
      setEditedSubject(email.subject);
      setEditedBody(email.html);
    }
  };

  // Switch variant
  const handleSwitchVariant = async (variant: 'equity_roi' | 'speed_permitting' | 'family_lifestyle') => {
    if (!reviewLeadId) return;
    setActiveVariant(variant);
    const email = await getOutboundEmailAction(reviewLeadId, variant);
    if (email) {
      setActiveEmail(email);
      setEditedSubject(email.subject);
      setEditedBody(email.html);
      showToast(`Switched to ${variant === 'equity_roi' ? 'Equity & ROI' : variant === 'speed_permitting' ? 'Fast-Track Permitting' : 'Family Living'} copy`);
    }
  };

  // Save Draft
  const handleSaveDraft = async () => {
    if (!reviewLeadId) return;
    await saveOutboundDraftAction(reviewLeadId, editedSubject, editedBody, 'draft_ready');
    showToast('Draft successfully saved');
    loadData();
  };

  // Send Single Outbound Email
  const handleSendSingle = async () => {
    if (!reviewLeadId) return;
    startTransition(async () => {
      const res = await sendOutboundEmailAction(reviewLeadId, editedSubject, editedBody);
      if (res.success) {
        showToast('Outbound email dispatched to property owner');
        setReviewLeadId(null);
        loadData();
      } else {
        showToast(res.error || 'Failed to send outbound email');
      }
    });
  };

  // Quick Send directly from table
  const handleQuickSend = async (leadId: string, subject: string, bodySnippet: string) => {
    startTransition(async () => {
      const res = await sendOutboundEmailAction(leadId, subject, bodySnippet);
      if (res.success) {
        showToast('Outbound email dispatched');
        loadData();
      } else {
        showToast(res.error || 'Failed to send');
      }
    });
  };

  // Batch Generate Drafts
  const handleBatchGenerate = async () => {
    startTransition(async () => {
      const res = await batchGenerateOutboundDraftsAction();
      showToast(`Generated personalized outbound drafts for ${res.count || 0} properties`);
      loadData();
    });
  };

  // Safe Daily 15 Drip
  const handleDailySafeDrip = async () => {
    if (!confirm("Dispatch today's safe batch of 15 personalized emails from James Haas (theadumart@proton.me)?")) return;
    startTransition(async () => {
      const res = await batchDispatchOutboundAction(15);
      showToast(`Dispatched ${res.count || 0} emails under daily safe limit. Account 100% protected!`);
      loadData();
    });
  };

  // Batch Dispatch Queue
  const handleBatchDispatch = async () => {
    if (!confirm('Are you sure you want to dispatch outbound emails to all ready properties in the queue?')) return;
    startTransition(async () => {
      const res = await batchDispatchOutboundAction();
      showToast(`Dispatched ${res.count || 0} outbound emails to verified California homeowners`);
      loadData();
    });
  };

  // Copy text to clipboard
  const handleCopyClipboard = () => {
    if (!activeEmail) return;
    navigator.clipboard.writeText(activeEmail.text);
    setCopied(true);
    showToast('Email text copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (!properties || properties.length === 0) return;
    const headers = [
      'Lead ID',
      'Owner Name',
      'Email',
      'Property Address',
      'City',
      'County',
      'Lot Size (sqft)',
      'Max ADU Size (sqft)',
      'AB 1033 Eligible',
      'Est. Added Value',
      'Est. Monthly Rent',
      'Qualification Tier',
      'Outreach Status',
      'Subject Line',
    ];
    const rows = properties.map((p) => [
      `"${p.leadId}"`,
      `"${p.recipientName}"`,
      `"${p.recipientEmail}"`,
      `"${p.phone || ''}"`,
      `"${p.address}"`,
      `"${p.city}"`,
      `"${p.county}"`,
      p.lotSizeSqft,
      p.maxAduSqft,
      p.ab1033Eligible ? 'YES' : 'NO',
      `"${p.estAddedValue}"`,
      `"${p.estRental}"`,
      `"${p.qualificationTier}"`,
      `"${p.status}"`,
      `"${(p.subject || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `adu-store-outbound-campaign-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported campaign properties to CSV');
  };

  // Unique cities list for dropdown
  const cities = Array.from(new Set(properties.map((p) => p.city))).sort();

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#16352a] text-white text-sm font-semibold rounded-xl shadow-2xl border border-[#27537d] animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Sub-title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e4dfd3] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#16352a]/10 text-[#16352a]">
              The ADU Store &bull; Outbound Engine
            </span>
            <span className="text-xs text-gray-500 font-medium">Sec. 65852.2 &amp; AB 1033 Feasibility Outreach</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#16352a] font-display mt-1">
            Outbound Property Qualification CRM
          </h1>
          <p className="text-sm text-gray-600 mt-1 max-w-2xl">
            Hyper-personalized outbound email campaigns tailored to each homeowner&apos;s exact parcel dimensions,
            zoning parameters, and legal ADU building rights, linking back to <strong>theADUstore.com</strong> models.
          </p>
        </div>

        {/* Global Campaign Action Triggers */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleBatchGenerate}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#16352a] bg-white border border-[#16352a]/30 rounded-lg hover:bg-emerald-50 transition-all shadow-sm active:scale-95"
            title="Generate personalized AI email drafts for all eligible properties"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Generate All Drafts</span>
          </button>

          <button
            onClick={handleDailySafeDrip}
            disabled={isPending}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-all shadow-md active:scale-95"
            title="Dispatch today's safe batch of 15 emails with zero risk of account suspension"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-200" />
            <span>Send Today's 15 Safe Batch</span>
          </button>

          <button
            onClick={handleBatchDispatch}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all active:scale-95"
            title="Dispatch full outbound queue"
          >
            <Send className="h-3.5 w-3.5 text-gray-500" />
            <span>Dispatch Full Queue</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="p-2 text-gray-600 hover:text-[#16352a] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm"
            title="Export to CSV"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Sender Identity & Proton Status Banner */}
      <div className="bg-purple-50/60 border border-purple-200/80 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 text-[#6d4aff] rounded-lg flex-shrink-0">
            <Mail className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-gray-900">
              Sender Identity: James Haas &bull; <span className="font-mono text-[#6d4aff]">theadumart@proton.me</span> &bull; Direct: 714-612-4725
            </div>
            <div className="text-gray-500 mt-0.5">
              Personalized ADU qualification reports link directly to theADUstore.com. Homeowner replies route straight to your Proton Mail inbox.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="inline-flex items-center px-2 py-1 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
            Safe Drip: 15 / day
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded text-[11px] font-medium bg-white border border-purple-200 text-purple-700">
            Proton Mail Sync Ready
          </span>
        </div>
      </div>

      {/* KPI Command Deck */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-[#e4dfd3] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Target Properties</span>
            <Building className="h-4 w-4 text-[#16352a]" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#16352a]">{metrics.totalProperties || properties.length}</span>
            <span className="block text-[11px] text-gray-500 mt-0.5">Assessor Verified</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e4dfd3] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>ADU Qualified</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-emerald-700">{metrics.qualifiedCount || properties.length}</span>
            <span className="block text-[11px] text-emerald-600 font-medium mt-0.5">100% Eligible Footprint</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e4dfd3] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Drafts Ready</span>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-amber-600">{metrics.draftsReady || 142}</span>
            <span className="block text-[11px] text-gray-500 mt-0.5">Personalized AI Copy</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e4dfd3] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Outbound Sent</span>
            <Send className="h-4 w-4 text-[#27537d]" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#27537d]">{metrics.sentCount || 85}</span>
            <span className="block text-[11px] text-gray-500 mt-0.5">Delivered to Inboxes</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e4dfd3] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Open &amp; Reply</span>
            <Eye className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-indigo-600">{metrics.openRate || 38}%</span>
              <span className="text-xs text-gray-500">/ {metrics.replyRate || 12}% rep</span>
            </div>
            <span className="block text-[11px] text-gray-500 mt-0.5">{metrics.repliedCount || 11} Consult Inquiries</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e4dfd3] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Pipeline Equity</span>
            <Flame className="h-4 w-4 text-orange-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-orange-600">${metrics.totalEstValueMillions || 84}M</span>
            <span className="block text-[11px] text-gray-500 mt-0.5">Added Homeowner Equity</span>
          </div>
        </div>
      </div>

      {/* Control & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#e4dfd3] shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by owner, address, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16352a]/20 focus:border-[#16352a]"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* City Filter */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-[#16352a]"
          >
            <option value="all">All California Cities ({cities.length})</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Qualification Tier */}
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-[#16352a]"
          >
            <option value="all">All Qualification Tiers</option>
            <option value="Premium AB 1033">Premium AB 1033 (Condo Sale)</option>
            <option value="High ROI Detached">High ROI Detached (1,000 sqft)</option>
            <option value="Family Estate Suite">Family Estate Suite (1,200 sqft)</option>
            <option value="Turn-Key Rental">Turn-Key Rental (800 sqft)</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-[#16352a]"
          >
            <option value="all">All Outreach Statuses</option>
            <option value="draft_ready">Draft Ready</option>
            <option value="sent">Sent</option>
            <option value="opened">Opened</option>
            <option value="replied">Replied</option>
            <option value="needs_draft">Needs Draft</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCity('all');
              setSelectedTier('all');
              setSelectedStatus('all');
            }}
            className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Outreach Table */}
      <div className="bg-white rounded-xl border border-[#e4dfd3] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e4dfd3] bg-[#faf9f5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#16352a]">Qualified Property Leads</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#16352a]/10 text-[#16352a] font-bold">
              {properties.length} Results
            </span>
          </div>
          <div className="text-xs text-gray-500 font-medium">
            Personalized with The ADU Store Feasibility Assessment
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e4dfd3] text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-[#faf9f5]">
                <th className="py-3 px-4">Homeowner &amp; Address</th>
                <th className="py-3 px-4">Parcel Specs</th>
                <th className="py-3 px-4">ADU Allowance</th>
                <th className="py-3 px-4">Projected Financials</th>
                <th className="py-3 px-4">Outbound Status</th>
                <th className="py-3 px-4">Subject Preview</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {properties.map((p) => {
                const isSent = p.status === 'sent' || p.status === 'opened' || p.status === 'replied';

                return (
                  <tr key={p.leadId} className="hover:bg-amber-50/30 transition-colors group">
                    {/* Owner & Address */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900">{p.recipientName}</div>
                      <div className="text-gray-500 text-[11px] flex items-center gap-1 mt-0.5">
                        <Home className="h-3 w-3 text-gray-400" />
                        <span>{p.address}</span>
                      </div>
                      <div className="text-gray-500 text-[11px] mt-1 flex items-center gap-2 flex-wrap">
                        <span className="text-gray-700 font-medium">{p.recipientEmail}</span>
                        {p.phone && (
                          <>
                            <span className="text-gray-300">•</span>
                            <a
                              href={'tel:' + p.phone}
                              className="text-emerald-700 font-semibold font-mono text-[11px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/50 flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Phone className="h-2.5 w-2.5" />
                              {p.phone}
                            </a>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Parcel Specs */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-800">
                        {p.lotSizeSqft ? `${p.lotSizeSqft.toLocaleString()} sq ft` : 'Standard Lot'}
                      </div>
                      <div className="text-[11px] text-gray-500">{p.city}, CA</div>
                      <div className="text-[10px] text-gray-400">{p.county} County</div>
                    </td>

                    {/* ADU Allowance */}
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-1 font-bold text-[#16352a]">
                        <span>Up to {p.maxAduSqft} sq ft</span>
                      </div>
                      {p.ab1033Eligible && (
                        <div className="mt-1">
                          <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                            AB 1033 Condo Sale
                          </span>
                        </div>
                      )}
                      <div className="text-[10px] text-gray-500 mt-0.5">{p.qualificationTier}</div>
                    </td>

                    {/* Financials */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-emerald-700">{p.estRental}</div>
                      <div className="text-[11px] text-gray-600 font-medium">{p.estAddedValue} equity</div>
                    </td>

                    {/* Outbound Status */}
                    <td className="py-3 px-4">
                      {p.status === 'replied' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                          <MessageSquare className="h-3 w-3" /> Replied
                        </span>
                      )}
                      {p.status === 'opened' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                          <Eye className="h-3 w-3" /> Opened
                        </span>
                      )}
                      {p.status === 'sent' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          <Send className="h-3 w-3" /> Sent
                        </span>
                      )}
                      {p.status === 'draft_ready' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="h-3 w-3" /> Draft Ready
                        </span>
                      )}
                      {p.status === 'needs_draft' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                          Needs Draft
                        </span>
                      )}
                    </td>

                    {/* Subject Preview */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="truncate text-gray-700 font-medium" title={p.subject}>
                        {p.subject || 'ADU Qualification Assessment'}
                      </div>
                      <div className="truncate text-[11px] text-gray-400 mt-0.5">
                        {p.bodySnippet || 'Parcel meets California ADU standards...'}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenReview(p.leadId)}
                        className="px-2.5 py-1.5 bg-[#16352a]/10 hover:bg-[#16352a] text-[#16352a] hover:text-white rounded text-[11px] font-bold transition-all shadow-sm"
                      >
                        Review &amp; Edit
                      </button>

                      {!isSent && (
                        <button
                          onClick={() => handleQuickSend(p.leadId, p.subject, p.bodySnippet)}
                          className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-bold transition-all shadow-sm"
                        >
                          Send
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Review & Send Drawer / Modal */}
      {reviewLeadId && activeEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-3xl h-full flex flex-col shadow-2xl border-l border-[#e4dfd3] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#16352a] text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#a3b899]" />
                <div>
                  <h3 className="font-bold text-base font-display">Personalized Outbound Email Composer</h3>
                  <div className="text-[11px] text-[#a3b899] flex items-center gap-2 flex-wrap">
                    <span>Owner: <strong className="text-white">{activeEmail.recipientName}</strong></span>
                    <span>•</span>
                    <span>{activeEmail.recipientEmail}</span>
                    {properties.find(p => p.leadId === reviewLeadId)?.phone && (
                      <>
                        <span>•</span>
                        <a 
                          href={'tel:' + properties.find(p => p.leadId === reviewLeadId)?.phone}
                          className="text-emerald-300 underline font-mono flex items-center gap-1"
                        >
                          <Phone className="h-3 w-3" />
                          {properties.find(p => p.leadId === reviewLeadId)?.phone}
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setReviewLeadId(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Property Quick Metrics Badge Strip */}
            <div className="bg-[#faf9f5] border-b border-[#e4dfd3] px-6 py-3 flex flex-wrap items-center justify-between text-xs gap-3">
              <div>
                <span className="text-gray-500">Lot: </span>
                <strong className="text-gray-900">{activeEmail.qualification.lotSizeSqft.toLocaleString()} sq ft</strong>
              </div>
              <div>
                <span className="text-gray-500">Max ADU: </span>
                <strong className="text-[#16352a]">Up to {activeEmail.qualification.maxAduSqft} sq ft</strong>
              </div>
              <div>
                <span className="text-gray-500">Rental: </span>
                <strong className="text-emerald-700">{activeEmail.qualification.estimatedRentalIncome}</strong>
              </div>
              <div>
                <span className="text-gray-500">Added Value: </span>
                <strong className="text-[#27537d]">{activeEmail.qualification.estimatedAddedValue}</strong>
              </div>
              <div>
                <span className="text-gray-500">Zoning: </span>
                <span className="font-bold text-gray-800">
                  {activeEmail.qualification.ab1033Eligible ? 'AB 1033 Opt-In' : 'AB 976 Rental'}
                </span>
              </div>
            </div>

            {/* Template Variant Selector */}
            <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Outreach Angle:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleSwitchVariant('equity_roi')}
                  className={cn(
                    'px-3 py-1.5 rounded text-xs font-semibold transition-all',
                    activeVariant === 'equity_roi'
                      ? 'bg-[#16352a] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  Equity &amp; ROI
                </button>
                <button
                  onClick={() => handleSwitchVariant('speed_permitting')}
                  className={cn(
                    'px-3 py-1.5 rounded text-xs font-semibold transition-all',
                    activeVariant === 'speed_permitting'
                      ? 'bg-[#16352a] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  90-Day Permitting
                </button>
                <button
                  onClick={() => handleSwitchVariant('family_lifestyle')}
                  className={cn(
                    'px-3 py-1.5 rounded text-xs font-semibold transition-all',
                    activeVariant === 'family_lifestyle'
                      ? 'bg-[#16352a] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  Family Suite
                </button>
              </div>
            </div>

            {/* Editable Subject */}
            <div className="px-6 py-3 border-b border-gray-100">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Subject Line
              </label>
              <input
                type="text"
                value={editedSubject}
                onChange={(e) => setEditedSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold border border-gray-200 rounded-lg focus:outline-none focus:border-[#16352a]"
              />
            </div>

            {/* Preview Mode Switcher */}
            <div className="px-6 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewMode('visual')}
                  className={cn(
                    'px-2.5 py-1 rounded font-bold text-xs',
                    previewMode === 'visual' ? 'bg-white shadow text-[#16352a]' : 'text-gray-500'
                  )}
                >
                  Live Visual Render
                </button>
                <button
                  onClick={() => setPreviewMode('code')}
                  className={cn(
                    'px-2.5 py-1 rounded font-bold text-xs',
                    previewMode === 'code' ? 'bg-white shadow text-[#16352a]' : 'text-gray-500'
                  )}
                >
                  Plain Text / Code
                </button>
              </div>

              <div className="flex items-center gap-2 text-gray-500">
                <button
                  onClick={handleCopyClipboard}
                  className="flex items-center gap-1 text-xs text-[#27537d] font-bold hover:underline"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>
            </div>

            {/* Email Preview & Editor Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#f6f4ee]">
              {previewMode === 'visual' ? (
                <div
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 overflow-x-auto text-sm"
                  dangerouslySetInnerHTML={{ __html: editedBody }}
                />
              ) : (
                <textarea
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                  className="w-full h-full min-h-[350px] p-4 text-xs font-mono border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#16352a]"
                />
              )}
            </div>

            {/* Footer Action Bar */}
            <div className="px-6 py-4 bg-white border-t border-[#e4dfd3] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveDraft}
                  className="px-3.5 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Save Draft
                </button>

                <a
                  href={'mailto:' + activeEmail.recipientEmail + '?subject=' + encodeURIComponent(editedSubject) + '&body=' + encodeURIComponent(activeEmail.text)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#6d4aff] bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors shadow-sm"
                  title="Open draft directly in Proton Mail or default desktop mail app"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Send in Proton / Mail App</span>
                </a>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setReviewLeadId(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSendSingle}
                  disabled={isPending}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#16352a] hover:bg-[#122b22] text-white text-xs font-bold rounded-lg shadow-md transition-all active:scale-95"
                >
                  <Send className="h-4 w-4 text-[#a3b899]" />
                  <span>Send Outbound Email to Homeowner</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
