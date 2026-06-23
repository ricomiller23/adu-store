'use client';

import React, { useState, useTransition } from 'react';
import { updateJurisdictionAction, addSuppressionAction } from '@/app/actions';
import { 
  Building2, 
  ShieldAlert, 
  Mail, 
  Compass, 
  Plus, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Jurisdiction {
  id: string;
  name: string;
  ab1033OptIn: boolean;
  notes: string | null;
}

interface Suppression {
  id: string;
  value: string;
  reason: string;
  createdAt: Date;
}

interface SettingsManagerProps {
  initialJurisdictions: Jurisdiction[];
  initialSuppressions: Suppression[];
  envs: {
    resendFrom: string;
    ownerDigestEmail: string;
    physicalAddress: string;
    adminEmail: string;
  };
}

export default function SettingsManager({ 
  initialJurisdictions, 
  initialSuppressions, 
  envs 
}: SettingsManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Tab State
  const [activeTab, setActiveTab] = useState<'general' | 'jurisdictions' | 'suppression'>('general');

  // Local State copies
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>(initialJurisdictions);
  const [suppressions, setSuppressions] = useState<Suppression[]>(initialSuppressions);

  // Sync state copy when props change
  React.useEffect(() => {
    setJurisdictions(initialJurisdictions);
    setSuppressions(initialSuppressions);
  }, [initialJurisdictions, initialSuppressions]);

  // Form State for new suppression
  const [newSuppValue, setNewSuppValue] = useState('');
  const [suppReason, setSuppReason] = useState('manual_dnc');
  const [suppSuccess, setSuppSuccess] = useState(false);

  // Toggle AB 1033 Opt-In
  const handleToggleAb1033 = (id: string, currentVal: boolean) => {
    const newVal = !currentVal;
    
    // Optimistic Update
    setJurisdictions(prev => 
      prev.map(j => j.id === id ? { ...j, ab1033OptIn: newVal } : j)
    );

    startTransition(async () => {
      try {
        const j = jurisdictions.find(item => item.id === id);
        if (j) {
          await updateJurisdictionAction(id, newVal, j.notes || undefined);
          router.refresh();
        }
      } catch (err) {
        console.error("Failed to toggle AB 1033:", err);
        setJurisdictions(initialJurisdictions);
      }
    });
  };

  // Add suppression
  const handleAddSuppression = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuppValue.trim()) return;

    startTransition(async () => {
      try {
        const result = await addSuppressionAction(newSuppValue.trim(), suppReason);
        setSuppressions(prev => [
          { id: result.id, value: result.value, reason: result.reason, createdAt: new Date() },
          ...prev
        ]);
        setNewSuppValue('');
        setSuppSuccess(true);
        setTimeout(() => setSuppSuccess(false), 3000);
        router.refresh();
      } catch (err) {
        console.error("Failed to add suppression:", err);
      }
    });
  };

  return (
    <div className="bg-white border border-[#e4dfd3] shadow-sm rounded-lg overflow-hidden flex flex-col md:flex-row h-full min-h-[500px]">
      {/* Navigation Tabs */}
      <div className="w-full md:w-64 border-r border-[#e4dfd3] bg-[#faf9f6] p-4 flex flex-col space-y-1">
        <button
          onClick={() => setActiveTab('general')}
          className={cn(
            "flex items-center px-4 py-3 text-sm font-semibold rounded transition duration-150 text-left",
            activeTab === 'general'
              ? "bg-[#16352a] text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          <Mail className="h-4 w-4 mr-3" />
          General & Emails
        </button>

        <button
          onClick={() => setActiveTab('jurisdictions')}
          className={cn(
            "flex items-center px-4 py-3 text-sm font-semibold rounded transition duration-150 text-left",
            activeTab === 'jurisdictions'
              ? "bg-[#16352a] text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          <Building2 className="h-4 w-4 mr-3" />
          CA Jurisdictions (AB 1033)
        </button>

        <button
          onClick={() => setActiveTab('suppression')}
          className={cn(
            "flex items-center px-4 py-3 text-sm font-semibold rounded transition duration-150 text-left",
            activeTab === 'suppression'
              ? "bg-[#16352a] text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          <ShieldAlert className="h-4 w-4 mr-3" />
          Suppression Suppression
        </button>
      </div>

      {/* Pane Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* TAB 1: GENERAL */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold font-display text-gray-900">Email & Profile Configuration</h2>
              <p className="text-sm text-gray-500 mt-1">
                SMTP sending identities and CAN-SPAM requirements read from system configurations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="bg-[#fcfcfa] border border-[#e4dfd3] p-4 rounded-lg space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Sender Identity (RESEND_FROM)</span>
                <span className="text-sm font-semibold text-gray-800 block">{envs.resendFrom}</span>
                <span className="text-[10px] text-gray-400 block mt-1">All sequence emails are delivered from this address.</span>
              </div>

              <div className="bg-[#fcfcfa] border border-[#e4dfd3] p-4 rounded-lg space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Digest Destination (OWNER_DIGEST_EMAIL)</span>
                <span className="text-sm font-semibold text-gray-800 block">{envs.ownerDigestEmail}</span>
                <span className="text-[10px] text-gray-400 block mt-1">Owner ops digest email sent here at 7:05 AM PT daily.</span>
              </div>

              <div className="bg-[#fcfcfa] border border-[#e4dfd3] p-4 rounded-lg md:col-span-2 space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">CAN-SPAM Footer Address</span>
                <span className="text-sm font-semibold text-gray-800 block">{envs.physicalAddress}</span>
                <span className="text-[10px] text-gray-400 block mt-1">Required physical address appended to every outbound nurture email footer.</span>
              </div>

              <div className="bg-[#fcfcfa] border border-[#e4dfd3] p-4 rounded-lg space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Administrator Account</span>
                <span className="text-sm font-semibold text-gray-800 block">{envs.adminEmail}</span>
                <span className="text-[10px] text-gray-400 block mt-1">Internal login credentials verified against password hash.</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: JURISDICTIONS */}
        {activeTab === 'jurisdictions' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold font-display text-gray-900">California Jurisdiction Registry</h2>
              <p className="text-sm text-gray-500 mt-1">
                Toggle AB 1033 condo-conversion eligibility per city. When changed, lead scores recalculate automatically.
              </p>
            </div>

            <div className="overflow-x-auto border border-[#e4dfd3] rounded-lg">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#e4dfd3] bg-[#faf9f6] text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-3">City / Jurisdiction</th>
                    <th className="px-4 py-3 text-center">AB 1033 Condo-Sale Eligible</th>
                    <th className="px-4 py-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {jurisdictions.map((j) => (
                    <tr key={j.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-semibold text-gray-900">{j.name}</td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded text-[#27537d] focus:ring-[#27537d] cursor-pointer"
                          checked={j.ab1033OptIn}
                          onChange={() => handleToggleAb1033(j.id, j.ab1033OptIn)}
                          disabled={isPending}
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{j.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SUPPRESSION LIST */}
        {activeTab === 'suppression' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold font-display text-gray-900">Global suppression Suppression</h2>
              <p className="text-sm text-gray-500 mt-1">
                Addresses listed here are fully suppressed from automated campaigns, regardless of sequence enrollment.
              </p>
            </div>

            {/* Add suppression form */}
            <form onSubmit={handleAddSuppression} className="bg-[#fcfcfa] border border-[#e4dfd3] p-5 rounded-lg space-y-4 max-w-xl">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Manually Suppress Contact</h3>

              {suppSuccess && (
                <div className="p-3 bg-green-50 border-l-4 border-green-600 text-[#2f7d54] text-xs rounded">
                  Suppression address added successfully.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Email or Phone
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="email@domain.com or phone"
                    className="w-full px-3 py-2 border border-[#e4dfd3] rounded focus:outline-none focus:ring-2 focus:ring-[#27537d] text-sm bg-white"
                    value={newSuppValue}
                    onChange={(e) => setNewSuppValue(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Suppression Reason
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-[#e4dfd3] rounded text-sm bg-white font-semibold text-gray-600"
                    value={suppReason}
                    onChange={(e) => setSuppReason(e.target.value)}
                  >
                    <option value="unsubscribed">Unsubscribed (One-Click Link)</option>
                    <option value="bounced">Bounced (Email Hard Bounce)</option>
                    <option value="complaint">Complaint (Spam Report)</option>
                    <option value="manual_dnc">Manual suppression Request</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isPending || !newSuppValue.trim()}
                  className="flex items-center px-4 py-2 bg-[#27537d] text-white rounded hover:bg-[#1f4366] text-xs font-bold transition shadow disabled:opacity-50"
                >
                  {isPending ? (
                    <RefreshCw className="animate-spin h-3.5 w-3.5 mr-1.5" />
                  ) : (
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  Add to suppression
                </button>
              </div>
            </form>

            {/* List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Suppressed Addresses ({suppressions.length})
              </h3>

              <div className="overflow-x-auto border border-[#e4dfd3] rounded-lg">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#e4dfd3] bg-[#faf9f6] text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <th className="px-4 py-3">Suppressed Value</th>
                      <th className="px-4 py-3">Reason</th>
                      <th className="px-4 py-3">Added Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {suppressions.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-center text-gray-400 text-xs">
                          No suppressions listed in database.
                        </td>
                      </tr>
                    ) : (
                      suppressions.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 text-gray-900 font-mono text-xs">{s.value}</td>
                          <td className="px-4 py-3 text-gray-600">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-700 capitalize">
                              {s.reason.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {new Date(s.createdAt).toLocaleDateString()} {new Date(s.createdAt).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
