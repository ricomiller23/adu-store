import React from 'react';
import { getLeadsAction, getJurisdictionsAction, getSuppressionsAction } from '@/app/actions';
import LeadsTable from '@/components/LeadsTable';
import Link from 'next/link';
import { Columns } from 'lucide-react';

export const revalidate = 0; // Disable caching

export default async function PartnersPage() {
  // Load partner type leads
  const [partners, jurisdictions, suppressions] = await Promise.all([
    getLeadsAction({ type: 'partner' }),
    getJurisdictionsAction(),
    getSuppressionsAction(),
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Affiliates &amp; Contractors</h1>
          <p className="text-gray-500 mt-1">Manage the contractor installation network, broker agreements, and agency affiliates.</p>
        </div>
        <Link 
          href="/pipeline"
          className="inline-flex items-center px-4 py-2 bg-[#27537d] text-white text-sm font-semibold rounded hover:bg-[#1f4366] transition shadow"
        >
          <Columns className="h-4 w-4 mr-2" />
          View Kanban Board
        </Link>
      </div>

      <LeadsTable 
        initialLeads={partners} 
        jurisdictions={jurisdictions} 
        initialSuppressions={suppressions} 
      />
    </div>
  );
}
