import React from 'react';
import { getLeadsAction } from '@/app/actions';
import PipelineBoard from '@/components/PipelineBoard';

export const revalidate = 0; // Disable caching for pipeline

export default async function PipelinePage() {
  const leads = await getLeadsAction({});

  return (
    <div className="space-y-8 max-w-7xl mx-auto h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">Pipeline Board</h1>
        <p className="text-gray-500 mt-1">Manage leads across stages. Toggle between Homeowner sales and Partner networks.</p>
      </div>

      <PipelineBoard initialLeads={leads} />
    </div>
  );
}
