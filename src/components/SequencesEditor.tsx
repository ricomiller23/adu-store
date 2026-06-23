'use client';

import React, { useState, useTransition } from 'react';
import { updateSequenceStepAction } from '@/app/actions';
import { Mail, Sliders, CheckCircle2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

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

export default function SequencesEditor({ initialSequences }: SequencesEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Selected sequence
  const [selectedSeqId, setSelectedSeqId] = useState<string>(initialSequences[0]?.id || '');
  const selectedSequence = initialSequences.find(s => s.id === selectedSeqId);

  // Editing state
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  // Save changes
  const handleSave = (stepId: string) => {
    startTransition(async () => {
      try {
        await updateSequenceStepAction(stepId, editSubject || null, editBody);
        setSuccessMessage('Sequence step updated successfully!');
        setEditingStepId(null);
        router.refresh();
      } catch (err) {
        console.error("Failed to update step:", err);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sequences List Pane */}
      <div className="bg-white border border-[#e4dfd3] shadow-sm rounded-lg p-4 space-y-2">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
          Target Segments
        </h3>
        {initialSequences.map((seq) => (
          <button
            key={seq.id}
            onClick={() => {
              setSelectedSeqId(seq.id);
              setEditingStepId(null);
              setSuccessMessage(null);
            }}
            className={cn(
              "w-full text-left px-3 py-3 rounded flex items-center justify-between text-sm font-semibold transition duration-150",
              selectedSeqId === seq.id
                ? "bg-[#16352a] text-white shadow"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <div className="flex items-center space-x-2">
              <Sliders className="h-4 w-4" />
              <span>{seq.name}</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-200 text-gray-700 font-bold">
              {seq.segment}
            </span>
          </button>
        ))}
      </div>

      {/* Steps Editor Pane */}
      <div className="md:col-span-3 space-y-6">
        {selectedSequence ? (
          <div className="bg-white border border-[#e4dfd3] shadow-sm rounded-lg p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold font-display text-gray-900">
                {selectedSequence.name} Steps
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Day offsets indicate when each step will fire relative to lead enrollment.
              </p>
            </div>

            {successMessage && (
              <div className="p-3 bg-green-50 border-l-4 border-green-600 text-[#2f7d54] text-sm rounded flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="space-y-6">
              {selectedSequence.steps.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-[#e4dfd3] rounded text-gray-400 text-sm">
                  No steps defined in this sequence.
                </div>
              ) : (
                selectedSequence.steps.map((step) => {
                  const isEditing = editingStepId === step.id;
                  return (
                    <div 
                      key={step.id} 
                      className="border border-[#e4dfd3] rounded-lg overflow-hidden"
                    >
                      {/* Step Header */}
                      <div className="bg-[#faf9f6] border-b border-[#e4dfd3] px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-sm">
                          <span className="font-bold text-[#27537d]">
                            Day {step.dayOffset}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase bg-blue-50 text-blue-700">
                            <Mail className="h-3 w-3 mr-1" />
                            {step.channel}
                          </span>
                        </div>

                        {!isEditing && (
                          <button
                            onClick={() => startEditing(step)}
                            className="text-xs font-bold text-[#27537d] hover:underline"
                          >
                            Edit Template
                          </button>
                        )}
                      </div>

                      {/* Step Body */}
                      <div className="p-4 space-y-4">
                        {isEditing ? (
                          <div className="space-y-4">
                            {step.channel === 'email' && (
                              <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                  Email Subject
                                </label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-[#e4dfd3] rounded focus:outline-none focus:ring-2 focus:ring-[#27537d] text-sm"
                                  value={editSubject}
                                  onChange={(e) => setEditSubject(e.target.value)}
                                />
                              </div>
                            )}

                            <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                Body Template (supports `{"{{name}}"}` and `{"{{city}}"}`)
                              </label>
                              <textarea
                                rows={8}
                                className="w-full px-3 py-2 border border-[#e4dfd3] rounded focus:outline-none focus:ring-2 focus:ring-[#27537d] text-sm font-mono"
                                value={editBody}
                                onChange={(e) => setEditBody(e.target.value)}
                              />
                            </div>

                            <div className="flex justify-end space-x-3 pt-2">
                              <button
                                onClick={cancelEditing}
                                className="px-4 py-2 border border-[#e4dfd3] text-gray-500 rounded hover:bg-gray-50 text-sm font-semibold transition"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSave(step.id)}
                                disabled={isPending}
                                className="flex items-center px-4 py-2 bg-[#27537d] text-white rounded hover:bg-[#1f4366] text-sm font-semibold transition shadow disabled:opacity-50"
                              >
                                {isPending && <RefreshCw className="animate-spin h-4 w-4 mr-2" />}
                                Save Changes
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {step.subject && (
                              <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Subject:</span>
                                <div className="text-sm font-semibold text-gray-900 mt-0.5">{step.subject}</div>
                              </div>
                            )}
                            <div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Body:</span>
                              <pre className="text-xs text-gray-600 bg-gray-50/50 border border-gray-100 p-3 rounded mt-1 font-sans whitespace-pre-wrap leading-relaxed">
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
  );
}
