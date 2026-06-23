import React from 'react';
import { getLeadsAction, getJurisdictionsAction, getSuppressionsAction } from '@/app/actions';
import LeadsTable from '@/components/LeadsTable';

export const revalidate = 0; // Disable caching for leads list

export default async function LeadsPage() {
  const [leads, jurisdictions, suppressions] = await Promise.all([
    getLeadsAction({}),
    getJurisdictionsAction(),
    getSuppressionsAction(),
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">Leads Management</h1>
        <p className="text-gray-500 mt-1">Review, filter, score, and contact homeowner and partner leads.</p>
      </div>

      <LeadsTable 
        initialLeads={leads} 
        jurisdictions={jurisdictions} 
        initialSuppressions={suppressions} 
      />
    </div>
  );
}
