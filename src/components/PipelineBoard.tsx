'use client';

import React, { useState, useTransition } from 'react';
import { updateLeadStageAction } from '@/app/actions';
import { 
  ArrowLeft, 
  ArrowRight, 
  Flame, 
  DollarSign, 
  Users, 
  Briefcase 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { LeadWithDetails } from './LeadsTable';

interface PipelineBoardProps {
  initialLeads: LeadWithDetails[];
}

export default function PipelineBoard({ initialLeads }: PipelineBoardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Active pipeline tab: homeowner or partner
  const [pipelineType, setPipelineType] = useState<'homeowner' | 'partner'>('homeowner');

  // Local state copy of leads to enable instant visual updates before server action completes
  const [leads, setLeads] = useState<LeadWithDetails[]>(initialLeads);

  // Sync state copy when initialLeads prop changes
  React.useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  // Stage lists
  const homeownerStages = ['New', 'Contacted', 'Consult booked', 'In design', 'Won'];
  const partnerStages = ['Applied', 'Vetting', 'Terms sent', 'Active', 'Inactive'];

  const activeStages = pipelineType === 'homeowner' ? homeownerStages : partnerStages;

  // Move lead stage
  const moveLead = (leadId: string, direction: 'left' | 'right') => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const currentStageIdx = activeStages.indexOf(lead.stage);
    if (currentStageIdx === -1) return;

    let newStageIdx = currentStageIdx;
    if (direction === 'left' && currentStageIdx > 0) {
      newStageIdx -= 1;
    } else if (direction === 'right' && currentStageIdx < activeStages.length - 1) {
      newStageIdx += 1;
    }

    if (newStageIdx === currentStageIdx) return;
    const newStage = activeStages[newStageIdx];

    // Optimistic Update
    setLeads(prevLeads => 
      prevLeads.map(l => l.id === leadId ? { ...l, stage: newStage } : l)
    );

    // Call server action
    startTransition(async () => {
      try {
        await updateLeadStageAction(leadId, newStage);
        router.refresh();
      } catch (err) {
        console.error("Failed to update stage:", err);
        // Revert on error
        setLeads(initialLeads);
      }
    });
  };

  // Filter leads by current pipeline type
  const filteredLeads = leads.filter(lead => lead.type === pipelineType);

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-6">
      {/* Pipeline Toggle */}
      <div className="flex justify-start">
        <div className="bg-white border border-[#e4dfd3] p-1 rounded-lg flex shadow-sm">
          <button
            onClick={() => setPipelineType('homeowner')}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-semibold rounded-md transition duration-150",
              pipelineType === 'homeowner'
                ? "bg-[#16352a] text-white"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            <Users className="h-4 w-4 mr-2" />
            Homeowners Sales Pipeline
          </button>
          <button
            onClick={() => setPipelineType('partner')}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-semibold rounded-md transition duration-150",
              pipelineType === 'partner'
                ? "bg-[#16352a] text-white"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Partner Network Pipeline
          </button>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto min-h-[500px] pb-6">
        {activeStages.map((stage) => {
          const stageLeads = filteredLeads.filter(l => l.stage === stage);
          const stageValue = stageLeads.reduce((sum, l) => sum + (l.estValue || 0), 0);

          return (
            <div 
              key={stage} 
              className="bg-white/60 border border-[#e4dfd3] rounded-lg flex flex-col h-full min-w-[220px]"
            >
              {/* Column Header */}
              <div className="p-4 border-b border-[#e4dfd3] bg-[#faf9f6] rounded-t-lg flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-bold font-display text-gray-800 text-sm tracking-wide">
                    {stage}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs font-bold rounded-full">
                    {stageLeads.length}
                  </span>
                </div>
                {pipelineType === 'homeowner' && (
                  <div className="flex items-center text-xs text-[#2f7d54] font-bold mt-1.5">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span>{stageValue.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Column Cards */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[600px] bg-[#fbfbfa]/30">
                {stageLeads.length === 0 ? (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed border-[#e4dfd3]/60 rounded-md text-gray-400 text-xs font-medium">
                    Empty Stage
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const isHot = lead.score >= 80;
                    return (
                      <div 
                        key={lead.id}
                        className={cn(
                          "bg-white border border-[#e4dfd3] p-4 rounded-md shadow-sm hover:shadow transition duration-150 space-y-3",
                          isHot ? "border-l-4 border-l-[#dd8420]" : ""
                        )}
                      >
                        {/* Title & Tag */}
                        <div>
                          <div className="font-bold text-gray-900 text-sm leading-tight truncate">
                            {lead.name}
                          </div>
                          <div className="text-[11px] text-gray-400 font-semibold mt-0.5">
                            {lead.city}
                          </div>
                        </div>

                        {/* Segment & Score */}
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#f6f4ee] border border-[#e4dfd3] text-gray-500">
                            {lead.segment}
                          </span>

                          <div className="flex items-center text-xs">
                            {isHot && <Flame className="h-3.5 w-3.5 text-[#dd8420] mr-0.5 fill-[#dd8420]/20" />}
                            <span className={cn(
                              "font-bold",
                              isHot ? "text-[#dd8420]" : "text-gray-500"
                            )}>
                              {lead.score}
                            </span>
                          </div>
                        </div>

                        {/* Estimated Value */}
                        {lead.estValue && (
                          <div className="text-xs font-semibold text-[#2f7d54]">
                            ${lead.estValue.toLocaleString()}
                          </div>
                        )}

                        {/* Move Actions */}
                        <div className="flex items-center justify-between border-t border-gray-50 pt-2 text-gray-400">
                          <button
                            onClick={() => moveLead(lead.id, 'left')}
                            disabled={lead.stage === activeStages[0] || isPending}
                            className="p-1 hover:text-[#27537d] disabled:opacity-30 rounded hover:bg-gray-50 transition"
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </button>
                          
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-300">
                            Move
                          </span>

                          <button
                            onClick={() => moveLead(lead.id, 'right')}
                            disabled={lead.stage === activeStages[activeStages.length - 1] || isPending}
                            className="p-1 hover:text-[#27537d] disabled:opacity-30 rounded hover:bg-gray-50 transition"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
