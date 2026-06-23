import React from 'react';
import { getSequencesAction } from '@/app/actions';
import SequencesEditor from '@/components/SequencesEditor';

export const revalidate = 0; // Disable caching for sequences

export default async function SequencesPage() {
  const sequences = await getSequencesAction();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">Nurture Sequences</h1>
        <p className="text-gray-500 mt-1">Configure and edit segment-matched email marketing and nurture tracks.</p>
      </div>

      <SequencesEditor initialSequences={sequences} />
    </div>
  );
}
