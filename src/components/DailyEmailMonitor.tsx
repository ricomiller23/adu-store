'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  ShieldAlert, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  RefreshCw 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface SendRecord {
  id: string;
  subject: string;
  status: string;
  resendId: string | null;
  createdAt: Date;
  lead: {
    name: string;
    email: string;
    segment: string;
  };
}

interface DailyEmailMonitorProps {
  initialSends: SendRecord[];
  activeEnrollments: number;
  totalSuppressions: number;
  cronSecret: string;
}

export default function DailyEmailMonitor({ 
  initialSends, 
  activeEnrollments, 
  totalSuppressions,
  cronSecret 
}: DailyEmailMonitorProps) {
  const router = useRouter();
  
  // Trigger cron execution state
  const [triggering, setTriggering] = useState(false);
  const [cronResult, setCronResult] = useState<any | null>(null);
  const [cronError, setCronError] = useState<string | null>(null);

  // Trigger Cron execution API call
  const handleTriggerCron = async () => {
    setTriggering(true);
    setCronResult(null);
    setCronError(null);

    try {
      const res = await fetch('/api/cron/daily', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cronSecret}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setCronResult(data);
        router.refresh();
      } else {
        setCronError(data.error || 'Failed to execute daily nurture cron.');
      }
    } catch (err: any) {
      console.error(err);
      setCronError(err.message || 'An unexpected networking error occurred.');
    } finally {
      setTriggering(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Stats Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#e4dfd3] shadow-sm rounded-lg p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Sent Today</span>
            <span className="text-2xl font-bold font-display text-gray-900 mt-1 block">
              {initialSends.length}
            </span>
            <span className="text-xs text-gray-500 block mt-1">Sequence emails delivered</span>
          </div>
          <div className="p-3 bg-blue-50 text-[#27537d] rounded-full">
            <Send className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white border border-[#e4dfd3] shadow-sm rounded-lg p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Active Enrollments</span>
            <span className="text-2xl font-bold font-display text-gray-900 mt-1 block">
              {activeEnrollments}
            </span>
            <span className="text-xs text-gray-500 block mt-1">Leads active in tracks</span>
          </div>
          <div className="p-3 bg-[#16352a]/10 text-[#16352a] rounded-full">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white border border-[#e4dfd3] shadow-sm rounded-lg p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Suppressed Contacts</span>
            <span className="text-2xl font-bold font-display text-red-600 mt-1 block">
              {totalSuppressions}
            </span>
            <span className="text-xs text-gray-500 block mt-1">Blocked addresses (Opt-Outs)</span>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-full">
            <ShieldAlert className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Manual Trigger Section */}
      <div className="bg-white border border-[#e4dfd3] shadow-sm rounded-lg p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold font-display text-gray-900">Run Automation Cron</h2>
          <p className="text-sm text-gray-500 mt-1">
            Trigger the daily sequence delivery job manually. The engine runs idempotently to ensure no double-sends occur on the same day.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <button
            onClick={handleTriggerCron}
            disabled={triggering}
            className="flex items-center px-4 py-2.5 bg-[#dd8420] hover:bg-[#c27116] text-white text-sm font-bold rounded shadow transition disabled:opacity-50"
          >
            {triggering ? (
              <RefreshCw className="animate-spin h-4 w-4 mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2 fill-white" />
            )}
            Trigger Nurture Cron Now
          </button>
          <div className="text-xs text-gray-400">
            Authorization: Authorization Header Bearer configured.
          </div>
        </div>

        {cronError && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{cronError}</span>
          </div>
        )}

        {cronResult && (
          <div className="p-4 bg-green-50 border-l-4 border-green-600 text-gray-800 text-sm rounded space-y-3 shadow-inner">
            <div className="flex items-center text-[#2f7d54] font-bold">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span>Cron execution finished successfully!</span>
            </div>
            <pre className="text-xs bg-white/80 p-3 rounded font-mono text-gray-700 border border-green-100 overflow-x-auto">
              {JSON.stringify(cronResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Today's Send Log */}
      <div className="bg-white border border-[#e4dfd3] shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-bold font-display text-gray-900 mb-4 border-b border-gray-100 pb-4">
          Today's Sent Email Log
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="pb-3">Recipient</th>
                <th className="pb-3">Segment</th>
                <th className="pb-3">Subject</th>
                <th className="pb-3">Resend Msg ID</th>
                <th className="pb-3">Time Sent</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
              {initialSends.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 text-sm">
                    No emails sent today. Run the Cron above to process sequence steps.
                  </td>
                </tr>
              ) : (
                initialSends.map((send) => (
                  <tr key={send.id} className="hover:bg-gray-50/50">
                    <td className="py-3">
                      <div className="text-gray-900 font-semibold">{send.lead.name}</div>
                      <div className="text-xs text-gray-400">{send.lead.email}</div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 bg-[#f6f4ee] border border-[#e4dfd3] rounded text-xs text-gray-600 font-semibold">
                        {send.lead.segment}
                      </span>
                    </td>
                    <td className="py-3 text-gray-800 max-w-xs truncate">{send.subject}</td>
                    <td className="py-3 font-mono text-xs text-gray-500">
                      {send.resendId || '—'}
                    </td>
                    <td className="py-3 text-xs text-gray-400">
                      {new Date(send.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="py-3 text-right">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase",
                        send.status === 'sent' ? "bg-green-50 text-[#2f7d54]" : "bg-red-50 text-red-700"
                      )}>
                        {send.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
