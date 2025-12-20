
import React, { useState, useEffect, useMemo } from 'react';
import { AgentPersona, EvalSuite, EvalCase, EvalStatus } from '../types';
import { MOCK_AGENTS, MOCK_EVAL_SUITES } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  SparklesIcon, 
  ActivityIcon, 
  PlayIcon, 
  ChevronRightIcon, 
  ChevronDownIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  AlertTriangleIcon, 
  ClockIcon, 
  TerminalIcon, 
  ShieldIcon, 
  ZapIcon,
  RotateCwIcon,
  SearchIcon,
  PlusIcon,
  CodeIcon,
  XIcon
} from './Icons';
import { GoogleGenAI } from "@google/genai";

const AgentGym: React.FC = () => {
  const [suites, setSuites] = useState<EvalSuite[]>(MOCK_EVAL_SUITES);
  const [selectedSuiteIds, setSelectedSuiteIds] = useState<Set<string>>(new Set([MOCK_EVAL_SUITES[0].id]));
  const [targetAgentId, setTargetAgentId] = useState<string>(MOCK_AGENTS[0].id);
  const [baselineAgentId, setBaselineAgentId] = useState<string>(MOCK_AGENTS[1].id);
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [runProgress, setRunProgress] = useState(0);

  const activeSuites = useMemo(() => suites.filter(s => selectedSuiteIds.has(s.id)), [suites, selectedSuiteIds]);
  const allActiveCases = useMemo(() => activeSuites.flatMap(s => s.cases), [activeSuites]);

  const handleRunAssessment = async () => {
    setIsRunning(true);
    setRunProgress(0);
    
    // Simulation logic
    const total = allActiveCases.length;
    for (let i = 0; i <= total; i++) {
        await new Promise(r => setTimeout(r, 800));
        setRunProgress(Math.round((i / total) * 100));
    }
    
    setIsRunning(false);
  };

  const toggleSuite = (id: string) => {
    const next = new Set(selectedSuiteIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedSuiteIds(next);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Gymnasium Header */}
      <header className="h-[64px] border-b border-slate-800 bg-slate-900 flex items-center justify-between px-8 shrink-0 z-30 shadow-lg">
         <div className="flex items-center space-x-8">
            <div className="flex items-center">
               <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mr-4">
                  <ActivityIcon size={24} className="text-indigo-400" />
               </div>
               <div>
                  <h1 className="text-lg font-bold text-white tracking-tight uppercase">Agent Gymnasium</h1>
                  <p className="text-[10px] text-slate-500 font-mono uppercase">BENCHMARK_ENGINE_v4.2</p>
               </div>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            <div className="flex items-center space-x-4">
               <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Target Agent</span>
                  <select 
                     value={targetAgentId}
                     onChange={(e) => setTargetAgentId(e.target.value)}
                     className="bg-transparent border-none text-xs font-bold text-indigo-400 outline-none p-0 cursor-pointer"
                  >
                     {MOCK_AGENTS.map(a => <option key={a.id} value={a.id}>{a.name} (v2.1)</option>)}
                  </select>
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Baseline</span>
                  <select 
                     value={baselineAgentId}
                     onChange={(e) => setBaselineAgentId(e.target.value)}
                     className="bg-transparent border-none text-xs font-bold text-slate-500 outline-none p-0 cursor-pointer"
                  >
                     <option value="none">None (Zero-Shot)</option>
                     {MOCK_AGENTS.map(a => <option key={a.id} value={a.id}>{a.name} (v2.0)</option>)}
                  </select>
               </div>
            </div>
         </div>

         <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-[10px] font-mono text-slate-500">
               <div className="flex items-center"><ZapIcon size={12} className="mr-1.5 text-amber-500" /> EST_COST: $0.15</div>
               <div className="flex items-center"><ClockIcon size={12} className="mr-1.5 text-blue-400" /> EST_TIME: 2M</div>
            </div>
            <Button 
               variant="primary" 
               size="sm" 
               icon={isRunning ? <RotateCwIcon size={14} className="animate-spin" /> : <PlayIcon size={14} fill="currentColor" />}
               onClick={handleRunAssessment}
               disabled={isRunning || allActiveCases.length === 0}
               className="bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] min-w-[160px]"
            >
               {isRunning ? `Running (${runProgress}%)` : 'Run Assessment'}
            </Button>
         </div>
      </header>

      {/* 2. Main Studio Split Area */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* LEFT: The Curriculum (Test Suites) */}
         <aside className="w-[300px] border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
            <div className="h-10 border-b border-slate-800 bg-slate-900/50 flex items-center px-4 justify-between shrink-0">
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Test Curriculum</span>
               <button className="text-slate-600 hover:text-white transition-colors"><PlusIcon size={14}/></button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
               {suites.map(suite => (
                  <div 
                     key={suite.id}
                     onClick={() => toggleSuite(suite.id)}
                     className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                        selectedSuiteIds.has(suite.id) 
                           ? 'bg-indigo-600/10 border-indigo-500/30 shadow-lg' 
                           : 'bg-transparent border-transparent hover:bg-slate-800/50'
                     }`}
                  >
                     <div className="flex items-center justify-between mb-2">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                           selectedSuiteIds.has(suite.id) ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700'
                        }`}>
                           {selectedSuiteIds.has(suite.id) && <CheckCircleIcon size={10} />}
                        </div>
                        <span className="text-[9px] font-mono text-slate-600">{suite.cases.length} CASES</span>
                     </div>
                     <h3 className={`text-xs font-bold transition-colors ${selectedSuiteIds.has(suite.id) ? 'text-white' : 'text-slate-400'}`}>
                        {suite.name}
                     </h3>
                     <p className="text-[10px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {suite.description}
                     </p>
                  </div>
               ))}
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-900/50 space-y-4">
               <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Evaluation Judge</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[10px] text-indigo-400 outline-none">
                     <option>Gemini 3 Pro (Primary Judge)</option>
                     <option>GPT-4 Turbo (Verify)</option>
                  </select>
               </div>
            </div>
         </aside>

         {/* CENTER: Result Matrix */}
         <main className="flex-1 flex flex-col bg-[#0d1117] overflow-hidden">
            <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center px-6 justify-between shrink-0">
               <div className="flex items-center space-x-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <div className="flex items-center">
                     <ActivityIcon size={12} className="mr-2 text-indigo-400" />
                     {allActiveCases.length} Benchmark Scenarios
                  </div>
                  <div className="flex items-center">
                     <ShieldIcon size={12} className="mr-2 text-emerald-400" />
                     Judge Level: Advanced
                  </div>
               </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
               <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="bg-slate-900 sticky top-0 z-20">
                     <tr className="text-[10px] font-bold text-slate-600 uppercase tracking-widest border-b border-slate-800">
                        <th className="px-6 py-4 w-[40%]">Benchmark Scenario</th>
                        <th className="px-6 py-4 text-center">Candidate (v2.1)</th>
                        <th className="px-6 py-4 text-center">Baseline (v2.0)</th>
                        <th className="px-6 py-4 text-right">Performance Delta</th>
                     </tr>
                  </thead>
                  <tbody>
                     {allActiveCases.map((c, i) => (
                        <React.Fragment key={c.id}>
                           <tr 
                              onClick={() => setExpandedCaseId(expandedCaseId === c.id ? null : c.id)}
                              className={`group border-b border-slate-800/50 hover:bg-slate-800/30 transition-all cursor-pointer ${isRunning && runProgress < (i+1)*(100/allActiveCases.length) ? 'opacity-30' : ''}`}
                           >
                              <td className="px-6 py-5">
                                 <div className="flex items-center space-x-4">
                                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-slate-700 transition-colors">
                                       {i+1}
                                    </div>
                                    <div className="min-w-0">
                                       <div className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors truncate">{c.name}</div>
                                       <div className="text-[10px] font-mono text-slate-600 truncate">{c.prompt}</div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <ScoreCell score={c.targetResult?.score} status={c.targetResult?.status} />
                              </td>
                              <td className="px-6 py-4">
                                 <ScoreCell score={c.baselineResult?.score} status={c.baselineResult?.status} />
                              </td>
                              <td className="px-6 py-4 text-right">
                                 {c.targetResult && c.baselineResult ? (
                                    <DeltaBadge current={c.targetResult.score} baseline={c.baselineResult.score} />
                                 ) : <span className="text-[10px] text-slate-700 font-mono">--</span>}
                              </td>
                           </tr>
                           {expandedCaseId === c.id && c.targetResult && (
                              <tr className="bg-slate-900/40 border-b border-slate-800">
                                 <td colSpan={4} className="px-8 py-8 animate-in slide-in-from-top-1 duration-300">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                       {/* Grader Critique */}
                                       <div className="space-y-6">
                                          <div className="flex items-center justify-between">
                                             <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] flex items-center">
                                                <SparklesIcon size={14} className="mr-2 animate-pulse" />
                                                Judge's Audit Report
                                             </h4>
                                             <Badge variant="info">VERIFIED BY GEMINI 3 PRO</Badge>
                                          </div>
                                          <div className="bg-[#0f172a] border border-indigo-500/20 rounded-2xl p-6 shadow-inner relative group">
                                             <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-slate-800 rounded text-slate-500 hover:text-white transition-colors"><ActivityIcon size={16}/></button>
                                             </div>
                                             <p className="text-sm text-slate-300 leading-relaxed italic">
                                                "{c.targetResult.reasoning}"
                                             </p>
                                          </div>
                                          <div className="grid grid-cols-3 gap-4">
                                             <MetaStat label="Accuracy" value="98%" />
                                             <MetaStat label="Tool Usage" value="100%" />
                                             <MetaStat label="Style Sync" value="84%" />
                                          </div>
                                       </div>

                                       {/* Raw Comparison */}
                                       <div className="space-y-6">
                                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center">
                                             <TerminalIcon size={14} className="mr-2" />
                                             Agent Response Payload
                                          </h4>
                                          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                                             <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between">
                                                <div className="flex space-x-1.5">
                                                   <div className="w-2 h-2 rounded-full bg-red-500/20" />
                                                   <div className="w-2 h-2 rounded-full bg-amber-500/20" />
                                                   <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
                                                </div>
                                                <span className="text-[9px] font-mono text-slate-600 uppercase">UTF-8 • JSON</span>
                                             </div>
                                             <pre className="p-6 text-xs font-mono text-indigo-300/80 leading-relaxed max-h-[250px] overflow-y-auto custom-scrollbar whitespace-pre-wrap">
                                                {c.targetResult.output}
                                             </pre>
                                          </div>
                                          <div className="flex justify-end space-x-3">
                                             <Button variant="ghost" size="sm" className="text-[10px]">Flag for Fine-Tuning</Button>
                                             <Button variant="primary" size="sm" className="text-[10px]" icon={<CodeIcon size={12}/>}>Debug in Studio</Button>
                                          </div>
                                       </div>
                                    </div>
                                 </td>
                              </tr>
                           )}
                        </React.Fragment>
                     ))}
                  </tbody>
               </table>
            </div>
         </main>

      </div>

      {/* 3. Status Bar Footer */}
      <footer className="h-12 bg-slate-900 border-t border-slate-800 shrink-0 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
         <div className="flex items-center space-x-12">
            <div className="flex items-center">
               <ActivityIcon size={14} className="mr-2 text-indigo-400" />
               EVALUATION_MODE: <span className="ml-2 text-indigo-300">SCIENTIFIC_COMPARISON</span>
            </div>
            <div className="flex items-center">
               <RotateCwIcon size={14} className="mr-2 text-indigo-400" />
               CONCURRENCY: <span className="ml-2 text-slate-300">4_WORKERS_ACTIVE</span>
            </div>
         </div>
         <div className="flex items-center space-x-6">
            <div className="flex items-center text-emerald-500">
               <CheckCircleIcon size={14} className="mr-2" />
               GRADES_VERIFIED
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <span className="text-slate-700 font-mono">STAMP: {new Date().toISOString().split('T')[0]}</span>
         </div>
      </footer>
    </div>
  );
};

// Sub-components

const ScoreCell: React.FC<{ score?: number; status?: EvalStatus }> = ({ score, status }) => {
   if (status === 'pending' || score === undefined) return <div className="text-center opacity-20 italic text-[10px]">Pending</div>;
   
   const getColor = () => {
      if (status === 'fail') return 'bg-red-500 shadow-red-500/20';
      if (status === 'marginal') return 'bg-amber-500 shadow-amber-500/20';
      if (status === 'unstable') return 'bg-orange-600 shadow-orange-600/20';
      return 'bg-emerald-500 shadow-emerald-500/20';
   };

   return (
      <div className="flex flex-col items-center space-y-2">
         <div className="flex items-center space-x-2">
            {status === 'unstable' && <AlertTriangleIcon size={12} className="text-orange-500 animate-pulse" />}
            <span className="text-xs font-bold text-white font-mono">{score}%</span>
         </div>
         <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <div 
               className={`h-full transition-all duration-1000 ${getColor()}`}
               style={{ width: `${score}%` }} 
            />
         </div>
      </div>
   );
};

const DeltaBadge: React.FC<{ current: number; baseline: number }> = ({ current, baseline }) => {
   const diff = current - baseline;
   if (diff === 0) return <span className="text-[10px] font-bold text-slate-600 font-mono">0%</span>;
   
   return (
      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${
         diff > 0 ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20' : 'text-red-400 bg-red-500/5 border-red-500/20'
      }`}>
         {diff > 0 ? '+' : ''}{diff}%
      </span>
   );
};

const MetaStat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
   <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
      <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter mb-1">{label}</span>
      <span className="text-sm font-bold text-white font-mono">{value}</span>
   </div>
);

export default AgentGym;
