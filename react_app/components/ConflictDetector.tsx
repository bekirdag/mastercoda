
import React, { useState, useMemo } from 'react';
import { ArchitectureIssue, IssueSeverity, IssueCategory } from '../types';
import { MOCK_ARCHITECTURE_ISSUES } from '../constants';
import Button from './Button';
import Badge from './Badge';
// Added XCircleIcon to the imports to fix the error on line 348.
import { 
  AlertTriangleIcon, 
  SearchIcon, 
  SparklesIcon, 
  CheckCircleIcon, 
  ActivityIcon, 
  RotateCwIcon, 
  ShieldIcon, 
  TrashIcon, 
  PlusIcon, 
  ChevronRightIcon, 
  XIcon, 
  ArrowRightIcon, 
  LockIcon,
  FilterIcon,
  CodeIcon,
  ZapIcon,
  XCircleIcon
} from './Icons';
import { GoogleGenAI } from "@google/genai";

const ConflictDetector: React.FC = () => {
  const [issues, setIssues] = useState<ArchitectureIssue[]>(MOCK_ARCHITECTURE_ISSUES);
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_ARCHITECTURE_ISSUES[0].id);
  const [isScanning, setIsScanning] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [customResolution, setCustomResolution] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<IssueSeverity | 'all'>('all');

  const selectedIssue = useMemo(() => issues.find(i => i.id === selectedId), [issues, selectedId]);

  const stats = useMemo(() => ({
    gaps: issues.filter(i => i.category === 'gap' && i.status === 'unresolved').length,
    conflicts: issues.filter(i => i.category === 'conflict' && i.status === 'unresolved').length,
    unresolved: issues.filter(i => i.status === 'unresolved').length
  }), [issues]);

  const handleScan = async () => {
    setIsScanning(true);
    // Simulating Cross-Document Cross-Referencing Logic
    await new Promise(r => setTimeout(r, 2500));
    setIsScanning(false);
    // In a real app, this would refresh the list from the AI backend
  };

  const handleApplyResolution = async (optionId: string | 'custom') => {
    setIsResolving(true);
    // Simulating "Healing" Animation specified in doc
    await new Promise(r => setTimeout(r, 1200));
    
    setIssues(prev => prev.map(i => {
      if (i.id === selectedId) {
        return { ...i, status: 'resolved' as const };
      }
      return i;
    }));
    
    setIsResolving(false);
    setCustomResolution('');
    
    // Auto-select next unresolved issue
    const nextUnresolved = issues.find(i => i.id !== selectedId && i.status === 'unresolved');
    if (nextUnresolved) setSelectedId(nextUnresolved.id);
    else setSelectedId(null);
  };

  const filteredIssues = useMemo(() => {
    return issues.filter(i => {
      const matchSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSeverity = filterSeverity === 'all' || i.severity === filterSeverity;
      return matchSearch && matchSeverity;
    });
  }, [issues, searchQuery, filterSeverity]);

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Page Header & Global Actions */}
      <header className="h-[64px] border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 flex items-center justify-between px-8 z-30 sticky top-0 shadow-lg">
         <div className="flex items-center space-x-8">
            <div className="flex items-center">
               <ShieldIcon className="mr-3 text-red-400" size={24} />
               <div>
                  <h1 className="text-sm font-bold text-white uppercase tracking-widest leading-none">Gap & Conflict Detector</h1>
                  <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">LOGICAL_QA_ENGINE_v2.0</p>
               </div>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            {/* Stats HUD */}
            <div className="flex items-center space-x-6">
               <HudMiniStat label="Gaps" value={stats.gaps} color="text-indigo-400" />
               <HudMiniStat label="Conflicts" value={stats.conflicts} color="text-red-400" />
               <HudMiniStat label="Unresolved" value={stats.unresolved} color="text-amber-400" />
            </div>
         </div>

         <div className="flex items-center space-x-3">
            <Button 
               variant="secondary" 
               size="sm" 
               icon={<RotateCwIcon size={14} className={isScanning ? 'animate-spin' : ''} />}
               onClick={handleScan}
               disabled={isScanning}
            >
               {isScanning ? 'Analyzing Lineage...' : 'Scan Project'}
            </Button>
            <Button variant="primary" size="sm" icon={<ZapIcon size={14}/>}>Auto-Resolve All</Button>
         </div>
      </header>

      {/* 2. Main content Split View */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* LEFT: Issue List (The Radar) */}
         <aside className="w-[400px] border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
               <div className="relative group flex-1 mr-4">
                  <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                     type="text" 
                     placeholder="Filter issues..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:border-indigo-500 outline-none"
                  />
               </div>
               <button className="p-1.5 text-slate-500 hover:text-white"><FilterIcon size={16}/></button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
               {filteredIssues.map(issue => (
                  <div 
                     key={issue.id}
                     onClick={() => setSelectedId(issue.id)}
                     className={`p-4 rounded-2xl border-2 transition-all cursor-pointer group relative overflow-hidden ${
                        selectedId === issue.id 
                           ? 'bg-indigo-600/10 border-indigo-500/50 shadow-xl' 
                           : 'bg-transparent border-transparent hover:bg-slate-800/50'
                     } ${issue.status === 'resolved' ? 'opacity-40 grayscale' : ''}`}
                  >
                     <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                           <SeverityIcon severity={issue.severity} />
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{issue.category}</span>
                        </div>
                        {issue.status === 'resolved' && <CheckCircleIcon size={14} className="text-emerald-500" />}
                     </div>
                     <h3 className={`text-sm font-bold transition-colors ${selectedId === issue.id ? 'text-white' : 'text-slate-300'}`}>
                        {issue.title}
                     </h3>
                     <p className="text-[11px] text-slate-500 leading-relaxed mt-2 line-clamp-2">{issue.description}</p>
                     
                     <div className="mt-4 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-600 uppercase">{issue.affectedPath}</span>
                        <ChevronRightIcon size={14} className={`text-slate-700 transition-transform ${selectedId === issue.id ? 'text-indigo-400 translate-x-1' : ''}`} />
                     </div>
                  </div>
               ))}
               
               {filteredIssues.length === 0 && (
                  <div className="py-20 text-center space-y-4 opacity-20">
                     <CheckCircleIcon size={64} className="mx-auto" />
                     <p className="text-xl font-bold uppercase tracking-widest">No issues found</p>
                  </div>
               )}
            </div>
         </aside>

         {/* RIGHT: Resolution Workspace (The Fix-It Area) */}
         <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#0d1117]">
            {selectedIssue ? (
               <div className="max-w-[800px] mx-auto p-12 space-y-10 animate-in fade-in duration-500">
                  
                  {/* Problem Analysis */}
                  <section className="space-y-6">
                     <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] flex items-center">
                           <ActivityIcon size={14} className="mr-2 animate-pulse" />
                           Logical Collision Analysis
                        </h3>
                        <Badge variant={selectedIssue.severity === 'critical' ? 'error' : 'warning'}>
                           {selectedIssue.severity.toUpperCase()} IMPACT
                        </Badge>
                     </div>

                     <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-1 h-full ${
                           selectedIssue.severity === 'critical' ? 'bg-red-500' : 'bg-amber-500'
                        }`} />
                        
                        <div className="flex items-start gap-4">
                           <AlertTriangleIcon size={24} className={selectedIssue.severity === 'critical' ? 'text-red-500' : 'text-amber-500'} />
                           <div className="space-y-4">
                              <p className="text-xl font-medium text-slate-100 leading-snug">
                                 {selectedIssue.problemStatement}
                              </p>
                              <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500">
                                 <LockIcon size={12} className="text-indigo-400" />
                                 <span>IDENTIFIED VIA CROSS-DOCUMENT_ANALYSIS</span>
                              </div>
                           </div>
                        </div>

                        {/* Affected Path Map Mini-UI */}
                        <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-700/50 flex items-center justify-center space-x-6">
                           <div className="flex flex-col items-center">
                              <span className="text-[8px] font-bold text-slate-600 mb-1">SOURCE</span>
                              <Badge variant="info">RFP</Badge>
                           </div>
                           <ArrowRightIcon size={16} className="text-slate-700" />
                           <div className="flex flex-col items-center">
                              <span className="text-[8px] font-bold text-slate-600 mb-1">TARGET</span>
                              <Badge variant="neutral">PDR</Badge>
                           </div>
                           <div className="h-8 w-px bg-slate-800 mx-2" />
                           <button 
                             onClick={() => { const evt = new CustomEvent('app-navigate', { detail: '/agents/traceability' }); window.dispatchEvent(evt); }}
                             className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors underline uppercase tracking-tighter"
                           >
                             View in Traceability Matrix
                           </button>
                        </div>
                     </div>
                  </section>

                  {/* Resolution Strategy */}
                  <section className={`space-y-6 ${selectedIssue.status === 'resolved' ? 'opacity-30 pointer-events-none' : ''}`}>
                     <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                        <SparklesIcon size={14} className="mr-2 text-indigo-400" />
                        AI-Generated Resolution Strategies
                     </h3>

                     <div className="grid grid-cols-1 gap-4">
                        {selectedIssue.aiSuggestions.map(opt => (
                           <div 
                              key={opt.id}
                              onClick={() => handleApplyResolution(opt.id)}
                              className="group p-6 bg-slate-800/40 border border-slate-700 rounded-2xl hover:border-indigo-500/50 hover:bg-slate-800 transition-all cursor-pointer relative overflow-hidden"
                           >
                              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <PlusIcon size={20} className="text-indigo-400" />
                              </div>
                              <div className="space-y-3">
                                 <div className="text-sm font-bold text-white uppercase tracking-widest group-hover:text-indigo-300 transition-colors">{opt.label}</div>
                                 <p className="text-sm text-slate-300 leading-relaxed font-light">{opt.description}</p>
                                 <div className="pt-2 flex items-center text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-tighter">
                                    <ActivityIcon size={12} className="mr-2" />
                                    Impact: {opt.impact}
                                 </div>
                              </div>
                           </div>
                        ))}

                        {/* Option C: User Compromise */}
                        <div className="p-6 bg-slate-900 border border-slate-700 border-dashed rounded-2xl space-y-4">
                           <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Option C: Technical Compromise</div>
                           <textarea 
                              value={customResolution}
                              onChange={(e) => setCustomResolution(e.target.value)}
                              placeholder="Provide a specific architectural override or compromise..."
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 focus:border-indigo-500 outline-none resize-none h-24 transition-all"
                           />
                           <div className="flex justify-end">
                              <Button 
                                 variant="primary" 
                                 size="sm" 
                                 disabled={!customResolution.trim() || isResolving}
                                 onClick={() => handleApplyResolution('custom')}
                              >
                                 {isResolving ? 'Rewriting Docs...' : 'Apply Custom Decision'}
                              </Button>
                           </div>
                        </div>
                     </div>
                  </section>

                  {/* Resolution Success State */}
                  {selectedIssue.status === 'resolved' && (
                     <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl flex flex-col items-center text-center space-y-4 animate-in zoom-in-95">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                           <CheckCircleIcon size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-emerald-400">Issue Resolved</h3>
                        <p className="text-sm text-slate-500 max-w-sm">Architectural Decision Record (ADR) generated and document sync complete. Traceability updated across all lifecycle points.</p>
                        <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">View Generated ADR &rsaquo;</button>
                     </div>
                  )}

                  <div className="h-32" />
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center h-full text-slate-700 opacity-20">
                  <ShieldIcon size={80} className="mb-4" />
                  <p className="text-2xl font-bold uppercase tracking-[0.3em]">No Conflict Selected</p>
               </div>
            )}
         </main>
      </div>

      {/* Global Status Footer */}
      <footer className="h-10 bg-slate-900 border-t border-slate-800 shrink-0 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
         <div className="flex items-center space-x-12">
            <div className="flex items-center">
               <RotateCwIcon size={12} className="mr-2 text-indigo-400" />
               AUDIT_STATUS: <span className={`ml-2 font-mono ${stats.unresolved > 0 ? 'text-red-400' : 'text-emerald-500'}`}>{stats.unresolved > 0 ? 'BLOCKED' : 'NOMINAL'}</span>
            </div>
            <div className="flex items-center">
               <ActivityIcon size={12} className="mr-2 text-indigo-400" />
               HEALING_ENGINE: <span className="ml-2 text-slate-300">ACTIVE</span>
            </div>
         </div>
         <div className="flex items-center space-x-4">
            <span className="text-slate-600 font-mono">NODE_HASH: QA_DETECT_84X</span>
            <div className="h-3 w-px bg-slate-800" />
            <div className="flex items-center text-indigo-400">
               <LockIcon size={12} className="mr-2" />
               ENCLAVE_VALIDATED
            </div>
         </div>
      </footer>

      {/* Healing Animation Overlay (CSS specified in style tag of index.html) */}
      {isResolving && (
         <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-emerald-500/5 animate-flash-green" />
      )}

    </div>
  );
};

const HudMiniStat: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
   <div className="flex items-baseline space-x-2">
      <span className="text-[10px] font-bold text-slate-500 uppercase">{label}:</span>
      <span className={`text-sm font-bold font-mono ${color}`}>{value}</span>
   </div>
);

const SeverityIcon: React.FC<{ severity: IssueSeverity }> = ({ severity }) => {
   switch (severity) {
      case 'critical': return <XCircleIcon size={14} className="text-red-500 shadow-[0_0_8px_#ef4444]" />;
      case 'warning': return <AlertTriangleIcon size={14} className="text-amber-500" />;
      case 'optimization': return <ActivityIcon size={14} className="text-indigo-400" />;
   }
};

export default ConflictDetector;
