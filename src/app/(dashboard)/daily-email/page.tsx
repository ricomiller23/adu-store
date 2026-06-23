import React from 'react';
import { prisma } from '@/lib/db';
import DailyEmailMonitor from '@/components/DailyEmailMonitor';

export const revalidate = 0; // Disable caching

export default async function DailyEmailPage() {
  // Load email sends from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [sends, activeEnrollments, totalSuppressions] = await Promise.all([
    prisma.emailSend.findMany({
      where: {
        createdAt: { gte: today }
      },
      include: {
        lead: true
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.enrollmentState.count({
      where: { status: 'active' }
    }),
    prisma.suppression.count(),
  ]);

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
