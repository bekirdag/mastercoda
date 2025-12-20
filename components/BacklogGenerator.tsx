
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SdsSectionRef, TaskDraft, DraftCategory } from '../types';
import { MOCK_SDS_SECTIONS, MOCK_TASK_DRAFTS } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  PlusIcon, 
  SparklesIcon, 
  RotateCwIcon, 
  ChevronRightIcon, 
  CheckCircleIcon, 
  ActivityIcon, 
  TerminalIcon, 
  ShieldIcon, 
  FileTextIcon, 
  LockIcon, 
  CodeIcon, 
  ArrowRightIcon, 
  SearchIcon, 
  PlusIcon as AddIcon,
  XIcon,
  TrashIcon,
  SettingsIcon,
  ZapIcon,
  AlertTriangleIcon,
  HelpCircleIcon,
  /* Added FilterIcon, GlobeIcon, and CloudIcon to fix "Cannot find name" errors on lines 231, 483, and 485 */
  FilterIcon,
  GlobeIcon,
  CloudIcon
} from './Icons';
import { GoogleGenAI } from "@google/genai";

const BacklogGenerator: React.FC = () => {
  const [sdsSections, setSdsSections] = useState<SdsSectionRef[]>(MOCK_SDS_SECTIONS);
  const [drafts, setDrafts] = useState<TaskDraft[]>(MOCK_TASK_DRAFTS);
  const [selectedSectionId, setSelectedSectionId] = useState<string>(MOCK_SDS_SECTIONS[0].id);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(MOCK_TASK_DRAFTS[0].id);
  const [isDecomposing, setIsDecomposing] = useState(false);
  const [decomposingSectionId, setDecomposingSectionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedSection = useMemo(() => sdsSections.find(s => s.id === selectedSectionId), [sdsSections, selectedSectionId]);
  const activeDraft = useMemo(() => drafts.find(d => d.id === activeDraftId), [drafts, activeDraftId]);

  const handleDecompose = async (sectionId: string) => {
    setDecomposingSectionId(sectionId);
    setIsDecomposing(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const section = sdsSections.find(s => s.id === sectionId);
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Decompose the following Software Design Specification (SDS) section into atomic, actionable engineering tasks: "${section?.content}". 
                   Context stack: Node.js, React, Tailwind. 
                   For each task, provide: title, category (Frontend/Backend/DevOps/Test), technical instructions, acceptance criteria (list), and estimated points (1,2,3,5,8).
                   Return as a JSON array of task objects.`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const newTasksRaw = JSON.parse(response.text || '[]');
      const newTasks: TaskDraft[] = newTasksRaw.map((t: any, i: number) => ({
        id: `td-gen-${Date.now()}-${i}`,
        title: t.title || 'Untitled Task',
        category: t.category || 'Backend',
        parentId: sectionId,
        confidence: 90 + Math.floor(Math.random() * 10),
        status: 'draft',
        points: t.points || 3,
        technicalInstructions: t.technicalInstructions || '',
        acceptanceCriteria: (t.acceptanceCriteria || []).map((label: string, j: number) => ({ id: `ac-${j}`, label, checked: false })),
        dependencies: []
      }));

      // Animation "Explosion" effect simulation: add delay
      await new Promise(r => setTimeout(r, 1500));

      setDrafts(prev => [...newTasks, ...prev]);
      setSdsSections(prev => prev.map(s => s.id === sectionId ? { ...s, isDecomposed: true } : s));
      
      if (newTasks.length > 0) setActiveDraftId(newTasks[0].id);

    } catch (e) {
      console.error("Decomposition failed", e);
    } finally {
      setIsDecomposing(false);
      setDecomposingSectionId(null);
    }
  };

  const handleApprove = (id: string) => {
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' } : d));
  };

  const handleUpdateDraft = (id: string, updates: Partial<TaskDraft>) => {
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const stats = {
    total: drafts.length,
    approved: drafts.filter(d => d.status === 'approved').length,
    stale: drafts.filter(d => d.status === 'stale').length
  };

  return (
    <div className="flex flex-col h-full bg-[#020617] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Planning Header */}
      <header className="h-[60px] border-b border-slate-800 bg-slate-900 flex items-center justify-between px-8 shrink-0 z-30 shadow-lg">
         <div className="flex items-center space-x-8">
            <div className="flex items-center">
               <ActivityIcon className="mr-3 text-indigo-400" size={24} />
               <div>
                  <h1 className="text-sm font-bold text-white uppercase tracking-widest leading-none">Task Decomposition</h1>
                  <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">SDS_TO_BACKLOG_ENGINE_v1.0</p>
               </div>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            <div className="flex items-center space-x-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
               <div className="flex items-center">
                  <Badge variant="neutral" className="mr-2">{stats.total}</Badge>
                  DRAFTS
               </div>
               <div className="flex items-center text-emerald-400">
                  <Badge variant="success" className="mr-2">{stats.approved}</Badge>
                  READY
               </div>
               {stats.stale > 0 && (
                  <div className="flex items-center text-red-400 animate-pulse">
                     <Badge variant="error" className="mr-2">{stats.stale}</Badge>
                     STALE
                  </div>
               )}
            </div>
         </div>

         <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm" icon={<RotateCwIcon size={14} />}>Reset View</Button>
            <Button 
               variant="primary" 
               size="sm" 
               icon={<CheckCircleIcon size={14} />}
               className="shadow-[0_0_20px_rgba(79,70,229,0.3)]"
               disabled={stats.approved === 0}
            >
               Sync to Jira ( {stats.approved} )
            </Button>
         </div>
      </header>

      {/* 2. Main Workspace Three-Column View */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* COLUMN 1: SDS Navigator (Source) */}
         <aside className="w-[300px] border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
            <div className="h-10 border-b border-slate-800 bg-slate-900/50 flex items-center px-4 justify-between shrink-0">
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SDS Source Nodes</span>
               <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" title="SDS Status: Approved" />
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
               {sdsSections.map(section => (
                  <div 
                     key={section.id}
                     onClick={() => setSelectedSectionId(section.id)}
                     className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                        selectedSectionId === section.id 
                           ? 'bg-indigo-600/10 border-indigo-500/50 shadow-lg' 
                           : 'bg-transparent border-transparent hover:bg-slate-800/50'
                     }`}
                  >
                     <div className="flex items-center justify-between mb-2">
                        <Badge variant={section.isDecomposed ? 'success' : 'neutral'}>
                           {section.isDecomposed ? 'DECOMPOSED' : 'PENDING'}
                        </Badge>
                        <span className="text-[8px] font-mono text-slate-600 uppercase">{section.id}</span>
                     </div>
                     <h3 className={`text-xs font-bold leading-tight transition-colors ${selectedSectionId === section.id ? 'text-white' : 'text-slate-400'}`}>
                        {section.title}
                     </h3>
                     
                     {selectedSectionId === section.id && (
                        <div className="mt-4 pt-4 border-t border-slate-800/50 animate-in slide-in-from-top-1">
                           <button 
                              onClick={(e) => { e.stopPropagation(); handleDecompose(section.id); }}
                              disabled={isDecomposing}
                              className="w-full flex items-center justify-center py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold uppercase tracking-widest text-white transition-all shadow-lg"
                           >
                              {isDecomposing && decomposingSectionId === section.id ? (
                                 <RotateCwIcon size={12} className="animate-spin mr-2" />
                              ) : (
                                 <SparklesIcon size={12} className="mr-2" />
                              )}
                              {section.isDecomposed ? 'Re-Decompose' : 'Analyze Section'}
                           </button>
                        </div>
                     )}
                  </div>
               ))}
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
               <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                  <RotateCwIcon size={12} className="mr-2" /> SDS Revision
               </div>
               <div className="flex items-center justify-between text-[10px] text-emerald-500 font-mono">
                  <span>v2.0-STABLE</span>
                  <span>SYNC_OK</span>
               </div>
            </div>
         </aside>

         {/* COLUMN 2: Task Drafts (Inbox) */}
         <main className="flex-1 border-r border-slate-800 flex flex-col bg-[#0b0f1a] relative min-w-0">
            {isDecomposing && (
               <div className="absolute inset-0 z-40 bg-indigo-950/20 backdrop-blur-[2px] flex flex-col items-center justify-center animate-in fade-in">
                  <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mb-6" />
                  <h2 className="text-xl font-bold text-white tracking-widest uppercase animate-pulse">Exploding Logic Into Tasks...</h2>
                  <p className="text-slate-400 mt-2 text-sm font-light">Analyzing architectural constraints and patterns</p>
               </div>
            )}

            <div className="h-10 border-b border-slate-800 bg-slate-900/50 flex items-center px-6 justify-between shrink-0">
               <div className="flex items-center space-x-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <span>Task Proposal Inbox</span>
                  <div className="flex items-center space-x-2">
                     <FilterIcon size={12} className="text-slate-600" />
                     <select className="bg-transparent border-none text-[10px] font-bold text-slate-400 uppercase outline-none p-0 cursor-pointer hover:text-white transition-colors">
                        <option>All Types</option>
                        <option>Frontend</option>
                        <option>Backend</option>
                     </select>
                  </div>
               </div>
               <div className="flex items-center space-x-2">
                  <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-all">Bulk Approve</button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
               {drafts.filter(d => !selectedSectionId || d.parentId === selectedSectionId).map((draft, idx) => (
                  <div 
                     key={draft.id} 
                     onClick={() => setActiveDraftId(draft.id)}
                     className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col animate-in slide-in-from-top-4 duration-500 ${
                        activeDraftId === draft.id 
                           ? 'bg-slate-800 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.1)] scale-[1.02]' 
                           : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                     } ${draft.status === 'approved' ? 'border-emerald-500/30' : ''}`}
                     style={{ animationDelay: `${idx * 50}ms` }}
                  >
                     <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                           <div className={`p-2 rounded-lg bg-slate-800 border border-slate-700 ${getCategoryColor(draft.category)}`}>
                              {getCategoryIcon(draft.category)}
                           </div>
                           <div>
                              <h3 className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors">{draft.title}</h3>
                              <div className="flex items-center text-[10px] text-slate-500 font-mono mt-0.5 space-x-2">
                                 <span>{draft.category.toUpperCase()}</span>
                                 <span>•</span>
                                 <span>CONFIDENCE: {draft.confidence}%</span>
                              </div>
                           </div>
                        </div>
                        {draft.status === 'approved' && <CheckCircleIcon size={16} className="text-emerald-500" />}
                     </div>
                     <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                           <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Estimate</span>
                           <span className="text-xs font-mono text-indigo-400 font-bold">{draft.points} pts</span>
                        </div>
                        <ChevronRightIcon size={16} className={`text-slate-700 group-hover:text-indigo-400 transition-transform ${activeDraftId === draft.id ? 'translate-x-1' : ''}`} />
                     </div>
                  </div>
               ))}
               
               {drafts.length === 0 && !isDecomposing && (
                  <div className="py-20 flex flex-col items-center justify-center text-slate-700 opacity-20">
                     <ActivityIcon size={64} className="mb-4" />
                     <p className="text-lg font-bold uppercase tracking-[0.2em]">No drafts available</p>
                     <p className="text-xs mt-2">Select an SDS section to decompose.</p>
                  </div>
               )}
            </div>
         </main>

         {/* COLUMN 3: Task Deep-Dive (Refining) */}
         <aside className="w-[500px] bg-slate-900 flex flex-col shrink-0 z-20 overflow-hidden shadow-2xl relative">
            {activeDraft ? (
               <>
                  <header className="h-[60px] border-b border-slate-800 px-6 flex items-center justify-between shrink-0 bg-slate-950/50 backdrop-blur">
                     <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-indigo-400">
                           <SettingsIcon size={20} />
                        </div>
                        <div>
                           <h3 className="font-bold text-white text-sm uppercase tracking-wider">Ticket Architect</h3>
                           <span className="text-[10px] text-slate-500 font-mono uppercase">REFINE_DRAFT_{activeDraft.id.split('-').pop()}</span>
                        </div>
                     </div>
                     <button onClick={() => setActiveDraftId(null)} className="p-2 text-slate-500 hover:text-white transition-colors">
                        <XIcon size={20} />
                     </button>
                  </header>

                  <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
                     <section className="space-y-4">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Task Title</label>
                        <input 
                           type="text" 
                           value={activeDraft.title}
                           onChange={(e) => handleUpdateDraft(activeDraft.id, { title: e.target.value })}
                           className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-lg font-bold text-white focus:border-indigo-500 outline-none"
                        />
                     </section>

                     <section className="space-y-4">
                        <div className="flex items-center justify-between">
                           <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center">
                              <TerminalIcon size={14} className="mr-2" />
                              Technical Instructions
                           </h4>
                           <button className="text-[10px] text-slate-500 hover:text-white font-mono uppercase">SYNC_TO_EDITOR</button>
                        </div>
                        <div className="relative group">
                           <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000" />
                           <textarea 
                              value={activeDraft.technicalInstructions}
                              onChange={(e) => handleUpdateDraft(activeDraft.id, { technicalInstructions: e.target.value })}
                              className="relative w-full h-40 bg-slate-950 border border-slate-700 rounded-2xl p-4 text-xs font-mono leading-relaxed text-indigo-200 outline-none focus:border-indigo-500 resize-none shadow-inner"
                              placeholder="Implementation details..."
                           />
                        </div>
                     </section>

                     <section className="space-y-4">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                           <CheckCircleIcon size={14} className="mr-2" />
                           Acceptance Criteria
                        </h4>
                        <div className="space-y-2">
                           {activeDraft.acceptanceCriteria.map((ac, i) => (
                              <div key={ac.id} className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-3 group">
                                 <input 
                                    type="checkbox" 
                                    checked={ac.checked}
                                    onChange={() => {
                                       const newAC = [...activeDraft.acceptanceCriteria];
                                       newAC[i].checked = !newAC[i].checked;
                                       handleUpdateDraft(activeDraft.id, { acceptanceCriteria: newAC });
                                    }}
                                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0"
                                 />
                                 <input 
                                    value={ac.label}
                                    onChange={(e) => {
                                       const newAC = [...activeDraft.acceptanceCriteria];
                                       newAC[i].label = e.target.value;
                                       handleUpdateDraft(activeDraft.id, { acceptanceCriteria: newAC });
                                    }}
                                    className="flex-1 bg-transparent border-none text-xs text-slate-300 ml-3 focus:ring-0 outline-none p-0"
                                 />
                                 <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-700 hover:text-red-400 transition-all"><TrashIcon size={12}/></button>
                              </div>
                           ))}
                           <button className="w-full py-2 border border-dashed border-slate-800 rounded-xl text-[10px] font-bold text-slate-600 hover:text-indigo-400 hover:border-indigo-500 transition-all uppercase tracking-widest">
                              + Add Criteria
                           </button>
                        </div>
                     </section>

                     <section className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-500 uppercase">Effort (Points)</label>
                           <select 
                              value={activeDraft.points}
                              onChange={(e) => handleUpdateDraft(activeDraft.id, { points: parseInt(e.target.value) })}
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:border-indigo-500 outline-none appearance-none"
                           >
                              <option value={1}>1 - Trivial</option>
                              <option value={2}>2 - Simple</option>
                              <option value={3}>3 - Standard</option>
                              <option value={5}>5 - Complex</option>
                              <option value={8}>8 - Epic</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                           <select 
                              value={activeDraft.category}
                              onChange={(e) => handleUpdateDraft(activeDraft.id, { category: e.target.value as DraftCategory })}
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:border-indigo-500 outline-none appearance-none"
                           >
                              <option>Backend</option>
                              <option>Frontend</option>
                              <option>DevOps</option>
                              <option>Test</option>
                           </select>
                        </div>
                     </section>
                  </div>

                  <footer className="h-20 border-t border-slate-800 bg-slate-950/80 p-6 flex items-center justify-between shrink-0">
                     <div className="flex items-center text-[10px] text-slate-600 font-mono">
                        <ShieldIcon size={12} className="mr-2 text-indigo-400" />
                        DoD_VERIFIED: PASS
                     </div>
                     <div className="flex items-center space-x-3">
                        <Button variant="ghost" onClick={() => setActiveDraftId(null)}>Discard</Button>
                        <Button 
                           variant="primary" 
                           onClick={() => handleApprove(activeDraft.id)}
                           className="shadow-lg shadow-indigo-500/20"
                           disabled={activeDraft.status === 'approved'}
                           icon={<CheckCircleIcon size={16} />}
                        >
                           {activeDraft.status === 'approved' ? 'Approved' : 'Approve Draft'}
                        </Button>
                     </div>
                  </footer>
               </>
            ) : (
               <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-800 flex items-center justify-center opacity-30">
                     <FileTextIcon size={40} className="text-slate-500" />
                  </div>
                  <div className="max-w-xs">
                     <h3 className="text-lg font-bold text-slate-300 uppercase tracking-wider">Draft Refining Station</h3>
                     <p className="text-xs text-slate-500 mt-2 leading-relaxed">Select an AI-suggested task from the middle column to audit technical instructions and acceptance criteria.</p>
                  </div>
               </div>
            )}
         </aside>

      </div>

      {/* Global Status Bar */}
      <footer className="h-10 bg-slate-900 border-t border-slate-800 shrink-0 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-40 relative">
         <div className="flex items-center space-x-12">
            <div className="flex items-center">
               <RotateCwIcon size={12} className="mr-2 text-indigo-400" />
               DECOMPOSITION_ENGINE: <span className="ml-2 text-emerald-500 uppercase">Active</span>
            </div>
            <div className="flex items-center">
               <LockIcon size={12} className="mr-2 text-indigo-400" />
               RECONCILER: <span className="ml-2 text-slate-300">SYNCED_v2.0</span>
            </div>
         </div>
         <div className="flex items-center space-x-4">
            <span className="text-slate-700 font-mono uppercase">Build: AG_18_8902_ALPHA</span>
            <div className="h-3 w-px bg-slate-800 mx-2" />
            <button className="text-indigo-400 hover:text-indigo-300 flex items-center">
               <HelpCircleIcon size={12} className="mr-1.5" /> Documentation
            </button>
         </div>
      </footer>

    </div>
  );
};

// Sub-components

const HudMiniStat: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
   <div className="flex items-baseline space-x-2">
      <span className="text-[10px] font-bold text-slate-500 uppercase">{label}:</span>
      <span className={`text-sm font-bold font-mono ${color}`}>{value}</span>
   </div>
);

const SeverityIcon: React.FC<{ severity: string }> = ({ severity }) => {
   // Reusing logic for scannability icons
   return <ActivityIcon size={14} className="text-indigo-400" />;
};

const getCategoryIcon = (cat: string) => {
   switch (cat) {
      case 'Frontend': return <GlobeIcon size={16} />;
      case 'Backend': return <TerminalIcon size={16} />;
      case 'DevOps': return <CloudIcon size={16} />;
      case 'Test': return <ShieldIcon size={16} />;
      default: return <CodeIcon size={16} />;
   }
};

const getCategoryColor = (cat: string) => {
   switch (cat) {
      case 'Frontend': return 'text-emerald-400';
      case 'Backend': return 'text-indigo-400';
      case 'DevOps': return 'text-purple-400';
      case 'Test': return 'text-amber-400';
      default: return 'text-slate-400';
   }
};

export default BacklogGenerator;
