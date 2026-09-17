'use client';

import React, { useState, useTransition } from 'react';
import { updateSequenceStepAction } from '@/app/actions';
import { 
  Mail, 
  Sliders, 
  CheckCircle2, 
  RefreshCw, 
  Eye, 
  Code2, 
  Sparkles, 
  Clock, 
  Building2, 
  Users, 
  Target, 
  ChevronRight,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { 
  MERGE_FIELD_DOCS, 
  renderEmailTemplate, 
  renderEmailSubject, 
  SAMPLE_PREVIEW_LEADS 
} from '@/lib/email-templates';

export interface SequenceStep {
  id: string;
  dayOffset: number;
  channel: string;
  subject: string | null;
  bodyTemplate: string;
}

export interface Sequence {
  id: string;
  name: string;
  segment: string;
  steps: SequenceStep[];
}

interface SequencesEditorProps {
  initialSequences: Sequence[];
}

type GroupTab = 'homeowner' | 'partner' | 'cold';

export default function SequencesEditor({ initialSequences }: SequencesEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Group tab state
  const [activeGroup, setActiveGroup] = useState<GroupTab>('homeowner');

  // Filter sequences by group
  const homeownerSeqs = initialSequences.filter(s => s.segment.startsWith('H'));
  const partnerSeqs = initialSequences.filter(s => s.segment.startsWith('P'));
  const coldSeqs = initialSequences.filter(s => s.segment === 'COLD');

  const currentGroupSeqs = activeGroup === 'homeowner' 
    ? homeownerSeqs 
    : activeGroup === 'partner' 
    ? partnerSeqs 
    : coldSeqs;

  // Selected sequence
  const [selectedSeqId, setSelectedSeqId] = useState<string>(
    currentGroupSeqs[0]?.id || initialSequences[0]?.id || ''
  );
  const selectedSequence = initialSequences.find(s => s.id === selectedSeqId) || currentGroupSeqs[0];

  // Editing state
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Live preview toggle per step
  const [previewSteps, setPreviewSteps] = useState<Record<string, boolean>>({});

  // Switch group tab
  const handleTabChange = (group: GroupTab) => {
    setActiveGroup(group);
    setEditingStepId(null);
    setSuccessMessage(null);
    const targetSeqs = group === 'homeowner' ? homeownerSeqs : group === 'partner' ? partnerSeqs : coldSeqs;
    if (targetSeqs.length > 0) {
      setSelectedSeqId(targetSeqs[0].id);
    }
  };

  // Start editing a step
  const startEditing = (step: SequenceStep) => {
    setEditingStepId(step.id);
    setEditSubject(step.subject || '');
    setEditBody(step.bodyTemplate);
    setSuccessMessage(null);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingStepId(null);
    setSuccessMessage(null);
  };

  // Toggle preview mode for a step
  const togglePreview = (stepId: string) => {
    setPreviewSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  // Insert merge field into body template
  const insertMergeTag = (tag: string) => {
    setEditBody(prev => prev + ' ' + tag);
  };

  // Save changes
  const handleSave = (stepId: string) => {
    startTransition(async () => {
      try {
        await updateSequenceStepAction(stepId, editSubject || null, editBody);
        
        // Update local sequence step state in place
        const seq = initialSequences.find(s => s.id === selectedSequence?.id);
        if (seq) {
          const step = seq.steps.find(st => st.id === stepId);
          if (step) {
            step.subject = editSubject || null;
            step.bodyTemplate = editBody;
          }
        }

        setEditingStepId(null);
        setSuccessMessage('Template changes saved successfully!');
        setTimeout(() => setSuccessMessage(null), 4000);
        router.refresh();
      } catch (err: any) {
        console.error(err);
        alert('Failed to save step: ' + (err.message || err));
      }
    });
  };

  // Sample lead for live preview
  const previewLead = selectedSequence?.segment.startsWith('P')
    ? SAMPLE_PREVIEW_LEADS.P1
    : selectedSequence?.segment === 'COLD'
    ? SAMPLE_PREVIEW_LEADS.COLD
    : SAMPLE_PREVIEW_LEADS.H1;

  return (
    <div className="space-y-6">
      {/* Category Group Selector Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#e4dfd3] pb-3">
        <button
          onClick={() => handleTabChange('homeowner')}
          className={cn(
            "flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm",
            activeGroup === 'homeowner'
              ? "bg-[#16352a] text-white"
              : "bg-white text-gray-600 border border-[#e4dfd3] hover:bg-gray-50"
          )}
        >
          <Users className="h-4 w-4 mr-2" />
          Homeowner Nurture (H1–H9)
          <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-white/20 text-white font-mono">
            {homeownerSeqs.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('partner')}
          className={cn(
            "flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm",
            activeGroup === 'partner'
              ? "bg-[#16352a] text-white"
              : "bg-white text-gray-600 border border-[#e4dfd3] hover:bg-gray-50"
          )}
        >
          <Building2 className="h-4 w-4 mr-2" />
          Partner Referral Tracks (P1–P4)
          <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-white/20 text-white font-mono">
            {partnerSeqs.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('cold')}
          className={cn(
            "flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm",
            activeGroup === 'cold'
              ? "bg-[#16352a] text-white"
              : "bg-white text-gray-600 border border-[#e4dfd3] hover:bg-gray-50"
          )}
        >
          <Target className="h-4 w-4 mr-2" />
          Cold Outreach Track
          <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-white/20 text-white font-mono">
            {coldSeqs.length}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sequences List Pane */}
        <div className="bg-white border border-[#e4dfd3] shadow-sm rounded-lg p-3 space-y-1.5">
          <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
            <span>{activeGroup === 'homeowner' ? 'Homeowner Segments' : activeGroup === 'partner' ? 'Partner Channels' : 'Cold Track'}</span>
            <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono">
              {currentGroupSeqs.length} Tracks
            </span>
          </div>

          <div className="space-y-1 max-h-[700px] overflow-y-auto pr-1">
            {currentGroupSeqs.map((seq) => (
              <button
                key={seq.id}
                onClick={() => {
                  setSelectedSeqId(seq.id);
                  setEditingStepId(null);
                  setSuccessMessage(null);
                }}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between text-sm transition duration-150",
                  selectedSequence?.id === seq.id
                    ? "bg-[#16352a] text-white shadow font-semibold"
                    : "text-gray-700 hover:bg-[#faf9f6] hover:text-gray-900 font-medium"
                )}
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase",
                    selectedSequence?.id === seq.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
                  )}>
                    {seq.segment}
                  </span>
                  <span className="truncate text-xs">{seq.name}</span>
                </div>
                <div className="text-[10px] opacity-70 ml-2 font-mono flex-shrink-0">
                  {seq.steps.length} {seq.steps.length === 1 ? 'step' : 'steps'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Steps Editor Pane */}
        <div className="md:col-span-3 space-y-6">
          {selectedSequence ? (
            <div className="bg-white border border-[#e4dfd3] shadow-sm rounded-lg p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 text-xs font-bold rounded bg-[#16352a]/10 text-[#16352a] font-mono uppercase">
                      {selectedSequence.segment}
                    </span>
                    <h2 className="text-xl font-bold font-display text-gray-900">
                      {selectedSequence.name}
                    </h2>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedSequence.segment.startsWith('H')
                      ? '4-step warm nurture sequence (Day 0, Day 2, Day 5, Day 12) delivering quiz value and consulting invites.'
                      : selectedSequence.segment.startsWith('P')
                      ? 'B2B partner referral sequence with tailored value hooks and commission incentives.'
                      : 'Cold homeowner parcel check track converting un-enrolled contacts into quiz-takers.'}
                  </p>
                </div>

                <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded border border-gray-200/60 font-mono">
                  Active Cadence: {selectedSequence.steps.length} Steps Total
                </div>
              </div>

              {successMessage && (
                <div className="p-3 bg-green-50 border-l-4 border-green-600 text-[#2f7d54] text-sm rounded flex items-center shadow-sm">
                  <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Steps List */}
              <div className="space-y-6">
                {selectedSequence.steps.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-[#e4dfd3] rounded text-gray-400 text-sm">
                    No steps defined in this sequence.
                  </div>
                ) : (
                  selectedSequence.steps.map((step, idx) => {
                    const isEditing = editingStepId === step.id;
                    const isPreview = !!previewSteps[step.id];

                    // Render preview content
                    const renderedSubject = renderEmailSubject(step.subject, previewLead);
                    const renderedBody = renderEmailTemplate(step.bodyTemplate, previewLead);

                    // Step label
                    let stepTitle = `Step ${idx + 1}`;
                    if (step.dayOffset === 0) stepTitle = `Step ${idx + 1}: First Touch (Day 0)`;
                    else if (step.dayOffset === 2 || step.dayOffset === 3) stepTitle = `Step ${idx + 1}: Value & Proof (Day ${step.dayOffset})`;
                    else if (step.dayOffset === 5) stepTitle = `Step ${idx + 1}: Objection & Reassurance (Day ${step.dayOffset})`;
                    else if (step.dayOffset === 12) stepTitle = `Step ${idx + 1}: Breakup & Long-Tail (Day ${step.dayOffset})`;
                    else if (step.dayOffset === 4) stepTitle = `Step ${idx + 1}: Partnership Follow-up (Day ${step.dayOffset})`;
                    else if (step.dayOffset === 7) stepTitle = `Step ${idx + 1}: Last Touch (Day ${step.dayOffset})`;

                    return (
                      <div 
                        key={step.id} 
                        className="border border-[#e4dfd3] rounded-xl overflow-hidden shadow-sm transition hover:border-gray-300"
                      >
                        {/* Step Header */}
                        <div className="bg-[#faf9f6] border-b border-[#e4dfd3] px-5 py-3 flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-sm">
                            <span className="font-bold text-[#16352a]">
                              {stepTitle}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase bg-blue-50 text-blue-700">
                              <Mail className="h-3 w-3 mr-1" />
                              {step.channel}
                            </span>
                          </div>

                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => togglePreview(step.id)}
                              className={cn(
                                "flex items-center text-xs font-semibold px-2.5 py-1 rounded transition",
                                isPreview
                                  ? "bg-[#27537d] text-white"
                                  : "text-gray-600 hover:bg-gray-100"
                              )}
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              {isPreview ? 'Show Source' : 'Live Preview'}
                            </button>

                            {!isEditing && (
                              <button
                                onClick={() => startEditing(step)}
                                className="text-xs font-bold text-[#27537d] hover:underline"
                              >
                                Edit Template
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Step Body */}
                        <div className="p-5 space-y-4">
                          {isEditing ? (
                            <div className="space-y-4">
                              {step.channel === 'email' && (
                                <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Email Subject
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-[#e4dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16352a] text-sm"
                                    value={editSubject}
                                    onChange={(e) => setEditSubject(e.target.value)}
                                  />
                                </div>
                              )}

                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Body Template
                                  </label>
                                  <span className="text-[11px] text-gray-400">
                                    Click any tag below to insert into copy
                                  </span>
                                </div>

                                {/* Merge Field Pills */}
                                <div className="flex flex-wrap gap-1.5 p-2 bg-[#faf9f6] border border-[#e4dfd3] rounded-lg mb-2">
                                  {MERGE_FIELD_DOCS.map((f) => (
                                    <button
                                      key={f.tag}
                                      type="button"
                                      onClick={() => insertMergeTag(f.tag)}
                                      title={f.desc}
                                      className="px-2 py-1 bg-white hover:bg-blue-50 border border-gray-200 text-[#27537d] text-xs font-mono rounded shadow-2xs transition hover:border-blue-300"
                                    >
                                      {f.tag}
                                    </button>
                                  ))}
                                </div>

                                <textarea
                                  rows={12}
                                  className="w-full px-3.5 py-3 border border-[#e4dfd3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16352a] text-xs font-mono leading-relaxed"
                                  value={editBody}
                                  onChange={(e) => setEditBody(e.target.value)}
                                />
                              </div>

                              <div className="flex justify-end space-x-3 pt-2">
                                <button
                                  onClick={cancelEditing}
                                  className="px-4 py-2 border border-[#e4dfd3] text-gray-600 rounded-lg hover:bg-gray-50 text-xs font-semibold transition"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSave(step.id)}
                                  disabled={isPending}
                                  className="flex items-center px-4 py-2 bg-[#16352a] text-white rounded-lg hover:bg-[#112920] text-xs font-semibold transition shadow disabled:opacity-50"
                                >
                                  {isPending && <RefreshCw className="animate-spin h-3.5 w-3.5 mr-1.5" />}
                                  Save Template
                                </button>
                              </div>
                            </div>
                          ) : isPreview ? (
                            /* Live Rendered View */
                            <div className="space-y-4 bg-gray-50/50 p-4 rounded-lg border border-blue-100">
                              <div className="flex items-center justify-between pb-2 border-b border-gray-200 text-xs text-gray-500">
                                <div className="flex items-center space-x-2">
                                  <Sparkles className="h-4 w-4 text-amber-500" />
                                  <span className="font-semibold text-gray-700">Rendered Client Simulation</span>
                                </div>
                                <span className="font-mono text-[11px] text-gray-400">
                                  Sample Lead: {previewLead.contactName || previewLead.name} ({previewLead.city})
                                </span>
                              </div>

                              <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Subject:</span>
                                <div className="text-sm font-semibold text-gray-900 mt-0.5">
                                  {renderedSubject}
                                </div>
                              </div>

                              <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Email Body:</span>
                                <div className="bg-white border border-gray-200 rounded-lg p-4 text-xs text-gray-800 font-sans whitespace-pre-wrap leading-relaxed mt-1 shadow-xs">
                                  {renderedBody}
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Raw Template View */
                            <div className="space-y-3">
                              {step.subject && (
                                <div>
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Subject:</span>
                                  <div className="text-sm font-semibold text-gray-900 mt-0.5">
                                    {step.subject}
                                  </div>
                                </div>
                              )}
                              <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Template Body:</span>
                                <pre className="text-xs text-gray-600 bg-gray-50/70 border border-gray-100 p-3.5 rounded-lg mt-1 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
                                  {step.bodyTemplate}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#e4dfd3] rounded-lg p-12 text-center text-gray-400 text-sm">
              Select a sequence from the left panel to edit its nurture steps.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
