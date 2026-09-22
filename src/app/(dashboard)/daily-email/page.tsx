import React from 'react';
import { getDailyEmailDataAction } from '@/app/actions';
import DailyEmailMonitor from '@/components/DailyEmailMonitor';

export const revalidate = 0; // Disable caching

export default async function DailyEmailPage() {
  const { sends, activeEnrollments, totalSuppressions } = await getDailyEmailDataAction();
  const cronSecret = process.env.CRON_SECRET || 'cron-secret-123';

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">Daily Nurture Monitor</h1>
        <p className="text-gray-500 mt-1">Review today's automated outreach, trigger manual execution, and monitor delivery statistics.</p>
      </div>

      <DailyEmailMonitor 
        initialSends={sends} 
        activeEnrollments={activeEnrollments} 
        totalSuppressions={totalSuppressions}
        cronSecret={cronSecret}
      />
    </div>
  );
}
