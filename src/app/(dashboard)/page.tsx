import React from 'react';
import { getDashboardStatsAction, getLeadsAction } from '@/app/actions';
import { 
  TrendingUp, 
  Users, 
  Flame, 
  DollarSign, 
  ShieldAlert, 
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0; // Disable caching for dashboard

export default async function DashboardPage() {
  const stats = await getDashboardStatsAction();
  
  // Get hot leads (score >= 80)
  const leads = await getLeadsAction({ minScore: 80 });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Today's operational metrics, pipeline valuation, and active suppressions.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Total Leads */}
        <div className="bg-white border border-[#e4dfd3] shadow-sm rounded-lg p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Leads</span>
            <div className="p-2 bg-[#27537d]/10 text-[#27537d] rounded-full">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold font-display text-gray-900">{stats.totalLeads}</span>
            <span className="text-xs text-gray-500 block mt-1">Captured leads</span>
          </div>
        </div>

        {/* New Leads */}
        <div className="bg-white border border-[#e4dfd3] shadow-sm rounded-lg p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">New Stage</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold font-display text-gray-900">{stats.newLeads}</span>
            <span className="text-xs text-gray-500 block mt-1">Needs outreach</span>
          </div>
        </div>

        {/* Hot Leads */}
        <div className="bg-white border border-[#e4dfd3] shadow-sm rounded-lg p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hot Leads</span>
            <div className="p-2 bg-[#dd8420]/15 text-[#dd8420] rounded-full">
              <Flame className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold font-display text-[#dd8420]">{stats.hotLeads}</span>
            <span className="text-xs text-gray-500 block mt-1">Score ≥ 80</span>
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="bg-white border border-[#e4dfd3] shadow-sm rounded-lg p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pipeline Value</span>
            <div className="p-2 bg-[#2f7d54]/10 text-[#2f7d54] rounded-full">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold font-display text-[#2f7d54]">
              ${stats.pipelineValue.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 block mt-1">Est. value active</span>
          </div>
        </div>

        {/* Active Suppressions */}
        <div className="bg-white border border-[#e4dfd3] shadow-sm rounded-lg p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Suppressed</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-full">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold font-display text-red-600">{stats.suppressions}</span>
            <span className="text-xs text-gray-500 block mt-1">Unsubscribed/Bounces</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hot Leads Table */}
        <div className="bg-white border border-[#e4dfd3] shadow-sm rounded-lg p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold font-display text-gray-900 flex items-center">
              <Flame className="h-5 w-5 text-[#dd8420] mr-2" />
              Hot Leads (Priority Nurture)
            </h2>
            <Link href="/leads?minScore=80" className="text-xs font-bold text-[#27537d] hover:underline flex items-center">
              View all
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {leads.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                No hot leads currently. Leads with score ≥80 will appear here.
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">City</th>
                    <th className="pb-3">Segment</th>
                    <th className="pb-3">Score</th>
                    <th className="pb-3 text-right">Pipeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leads.slice(0, 5).map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50/50">
                      <td className="py-3 font-medium text-gray-900">
                        <Link href={`/leads?id=${lead.id}`} className="hover:text-[#27537d] hover:underline">
                          {lead.name}
                        </Link>
                      </td>
                      <td className="py-3 text-gray-500">{lead.city}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 bg-[#f6f4ee] border border-[#e4dfd3] rounded text-xs text-gray-600 font-medium">
                          {lead.segment}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center">
                          <span className="text-[#dd8420] font-bold mr-1.5">{lead.score}</span>
                          <div className="w-12 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-[#dd8420] h-full" 
                              style={{ width: `${lead.score}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right text-gray-900 font-semibold">
                        {lead.estValue ? `$${lead.estValue.toLocaleString()}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Lead Sources & Compliance info */}
        <div className="space-y-8">
          {/* Lead Sources */}
          <div className="bg-white border border-[#e4dfd3] shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-bold font-display text-gray-900 mb-4 border-b border-gray-100 pb-4">
              Lead Channels
            </h2>
            <div className="space-y-4">
              {stats.sources.length === 0 ? (
                <div className="text-center py-4 text-gray-400 text-sm">
                  No source data available.
                </div>
              ) : (
                stats.sources.map((source) => {
                  const percentage = Math.round((source.value / stats.totalLeads) * 100);
                  return (
                    <div key={source.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-gray-700 capitalize">{source.name}</span>
                        <span className="text-gray-500 font-medium">{source.value} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-[#27537d] h-full" 
                          style={{ width: `${percentage}%` }} 
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Compliance Card */}
          <div className="bg-white border border-[#e4dfd3] shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-bold font-display text-gray-900 mb-4 border-b border-gray-100 pb-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-[#2f7d54] mr-2" />
              Compliance Engines
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start">
                <div className="mt-0.5 p-1 bg-green-50 text-[#2f7d54] rounded-full mr-3">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">CAN-SPAM Guard</h4>
                  <p className="text-gray-500 text-xs mt-0.5">suppression list matching active; one-click unsubscribe footers injected.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mt-0.5 p-1 bg-green-50 text-[#2f7d54] rounded-full mr-3">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">TCPA Consent Gating</h4>
                  <p className="text-gray-500 text-xs mt-0.5">Phone and SMS outreach buttons programmatically locked based on explicit consent.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mt-0.5 p-1 bg-green-50 text-[#2f7d54] rounded-full mr-3">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">AB 1033 Truth Filter</h4>
                  <p className="text-gray-500 text-xs mt-0.5">Condo sales references permitted only in opt-in jurisdictions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
