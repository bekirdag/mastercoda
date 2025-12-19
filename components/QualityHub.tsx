
import React, { useState, useEffect } from 'react';
import { MOCK_TEST_RESULTS, MOCK_COVERAGE, MOCK_FLAKY_TESTS } from '../constants';
import { TestResult, CoverageMetric, TestStatus, FlakyTest } from '../types';
import Button from './Button';
import { 
  PlayIcon, 
  RotateCwIcon, 
  EyeIcon, 
  SearchIcon, 
  ShieldIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ChevronRightIcon, 
  ChevronDownIcon, 
  SparklesIcon, 
  ActivityIcon,
  AlertTriangleIcon,
  ClockIcon,
  FilterIcon,
  TerminalIcon,
  SaveIcon
} from './Icons';

const QualityHub: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [runProgress, setRunProgress] = useState(0);
  const [results, setResults] = useState<TestResult[]>(MOCK_TEST_RESULTS);
  const [showFailuresOnly, setShowFailuresOnly] = useState(false);
  const [watchMode, setWatchMode] = useState(false);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [expandedSuites, setExpandedSuites] = useState<Set<string>>(new Set(['Dashboard', 'AuthFlow']));

  const handleRunAll = () => {
    setIsRunning(true);
    setRunProgress(0);
    // Mock run logic
    const interval = setInterval(() => {
      setRunProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const filteredResults = showFailuresOnly 
    ? results.filter(r => r.status === 'fail') 
    : results;

  const suites = Array.from(new Set(results.map(r => r.suite)));
  
  const stats = {
    total: results.length,
    passed: results.filter(r => r.status === 'pass').length,
    failed: results.filter(r => r.status === 'fail').length,
    skipped: results.filter(r => r.status === 'skipped').length,
  };

  const hasFailuresInRun = isRunning && filteredResults.some(r => r.status === 'fail');

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* progress bar line at top */}
      {isRunning && (
        <div className="h-0.5 w-full bg-slate-800 overflow-hidden shrink-0">
          <div 
            className={`h-full transition-all duration-300 ${hasFailuresInRun ? 'bg-red-500' : 'bg-emerald-500'}`} 
            style={{ width: `${runProgress}%` }} 
          />
        </div>
      )}

      {/* 1. Toolbar (60px) */}
      <header className="h-[60px] border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0 z-20">
         <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
               <ShieldIcon className="mr-2 text-indigo-400" size={20} />
               Quality Hub
            </h1>

            <div className="h-6 w-px bg-slate-700" />

            <div className="flex items-center space-x-4">
               <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Environment</span>
                  <select className="bg-transparent border-none text-xs font-semibold text-slate-300 outline-none p-0 cursor-pointer hover:text-white transition-colors">
                     <option>Local (Vitest)</option>
                     <option>Docker (Isolated)</option>
                     <option>Staging (E2E)</option>
                  </select>
               </div>

               <div className="flex items-center space-x-2 bg-slate-800 rounded px-2 py-1 border border-slate-700">
                  <FilterIcon size={12} className="text-slate-500" />
                  <label className="flex items-center cursor-pointer select-none">
                     <input 
                        type="checkbox" 
                        checked={showFailuresOnly} 
                        onChange={() => setShowFailuresOnly(!showFailuresOnly)}
                        className="mr-2 accent-indigo-500"
                     />
                     <span className="text-[10px] font-bold text-slate-400 uppercase">Failures Only</span>
                  </label>
               </div>

               <button 
                  onClick={() => setWatchMode(!watchMode)}
                  className={`p-2 rounded border transition-all ${
                    watchMode ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
                  }`}
                  title="Toggle Watch Mode"
               >
                  <EyeIcon size={16} />
               </button>
            </div>
         </div>

         <div className="flex items-center space-x-3">
            <Button 
              variant="secondary" 
              size="sm" 
              icon={<RotateCwIcon size={14} className={isRunning ? 'animate-spin' : ''} />}
              disabled={isRunning}
            >
              Reset
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              icon={isRunning ? <RotateCwIcon size={14} className="animate-spin" /> : <PlayIcon size={14} />} 
              onClick={handleRunAll}
              disabled={isRunning}
              className="bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
            >
              {isRunning ? 'Running...' : 'Run All Tests'}
            </Button>
         </div>
      </header>

      {/* 2. Main 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* Left: Test Explorer (250px) */}
         <aside className="w-[280px] border-r border-slate-800 bg-slate-900/50 flex flex-col shrink-0">
            <div className="p-4 flex items-center justify-between border-b border-slate-800">
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Test Explorer</span>
               <div className="relative">
                  <SearchIcon size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="text" placeholder="Filter suites..." className="bg-slate-800 border border-slate-700 rounded pl-7 pr-2 py-1 text-[10px] w-32 focus:outline-none" />
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
               {suites.map(suiteName => (
                  <div key={suiteName} className="mb-1">
                     <button 
                        onClick={() => {
                           const next = new Set(expandedSuites);
                           if (next.has(suiteName)) next.delete(suiteName);
                           else next.add(suiteName);
                           setExpandedSuites(next);
                        }}
                        className="w-full flex items-center px-2 py-1.5 rounded hover:bg-slate-800 text-xs text-slate-400 group transition-colors"
                     >
                        {expandedSuites.has(suiteName) ? <ChevronDownIcon size={14} className="mr-1" /> : <ChevronRightIcon size={14} className="mr-1" />}
                        <span className="flex-1 text-left font-semibold">{suiteName}</span>
                        <span className="text-[10px] font-mono opacity-50">{results.filter(r => r.suite === suiteName).length}</span>
                     </button>
                     
                     {expandedSuites.has(suiteName) && (
                        <div className="ml-4 mt-1 border-l border-slate-800 space-y-0.5">
                           {results.filter(r => r.suite === suiteName).map(test => (
                              <button 
                                 key={test.id}
                                 className="w-full flex items-center px-3 py-1.5 rounded-r text-[11px] text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors"
                              >
                                 <div className={`w-1.5 h-1.5 rounded-full mr-2 shrink-0 ${
                                    test.status === 'pass' ? 'bg-emerald-500' :
                                    test.status === 'fail' ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]' :
                                    'bg-slate-600'
                                 }`} />
                                 <span className="truncate">{test.name}</span>
                              </button>
                           ))}
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </aside>

         {/* Center: Execution Console (Fluid) */}
         <main className="flex-1 flex flex-col bg-[#0f172a] overflow-hidden">
            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-4 p-6 bg-slate-900/30 border-b border-slate-800">
               <SummaryCard label="Total Tests" value={stats.total} color="slate" />
               <SummaryCard label="Passed" value={stats.passed} color="emerald" />
               <SummaryCard label="Failed" value={stats.failed} color="red" />
               <SummaryCard label="Duration" value="4.2s" color="indigo" />
            </div>

            {/* Failure Detail List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
               {filteredResults.filter(r => r.status === 'fail').map(fail => (
                  <div key={fail.id} className="bg-slate-800/40 border border-red-500/20 rounded-xl overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
                     <div className="bg-red-500/5 px-4 py-3 flex items-center justify-between border-b border-red-500/10">
                        <div className="flex items-center space-x-3">
                           <XCircleIcon size={16} className="text-red-500" />
                           <span className="text-xs font-bold text-red-100">{fail.suite} &rsaquo; {fail.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{fail.file}</span>
                     </div>
                     
                     <div className="p-4 space-y-4">
                        <div className="font-mono text-[11px] text-red-300 bg-red-950/20 p-3 rounded border border-red-900/30 whitespace-pre">
                           Error: {fail.error}
                        </div>

                        {fail.aiInsight && (
                           <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-lg p-4">
                              <div className="flex items-center text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">
                                 <SparklesIcon size={12} className="mr-2" />
                                 AI Debug Insight
                              </div>
                              <p className="text-xs text-indigo-200/70 leading-relaxed mb-4">
                                 {fail.aiInsight}
                              </p>
                              <div className="flex items-center space-x-3">
                                 <Button variant="primary" size="sm" className="bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-[10px]">Apply AI Fix</Button>
                                 <Button variant="ghost" size="sm" className="text-[10px]">Open Code</Button>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               ))}

               {stats.failed === 0 && !isRunning && (
                  <div className="flex flex-col items-center justify-center py-20 opacity-30">
                     <CheckCircleIcon size={64} className="text-emerald-500 mb-4" />
                     <p className="text-lg font-medium">All tests passed. System stable.</p>
                  </div>
               )}
            </div>
         </main>

         {/* Right: Coverage & Insights (300px) */}
         <aside className="w-[320px] border-l border-slate-800 bg-[#1e293b]/50 flex flex-col shrink-0">
            <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar">
               
               {/* Coverage Section */}
               <section className="space-y-4">
                  <div className="flex items-center justify-between">
                     <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Code Coverage</h3>
                     <span className="text-xs font-bold text-emerald-400">84.3% AVG</span>
                  </div>
                  <div className="space-y-3">
                     {MOCK_COVERAGE.map(item => (
                        <div key={item.id} className="group cursor-pointer">
                           <div className="flex items-center justify-between text-[11px] mb-1.5">
                              <span className="text-slate-300 truncate w-40 font-mono" title={item.path}>{item.path.split('/').pop()}</span>
                              <span className={`font-bold ${item.percentage > 80 ? 'text-emerald-400' : item.percentage > 50 ? 'text-amber-400' : 'text-red-400'}`}>
                                 {item.percentage}%
                              </span>
                           </div>
                           <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                 className={`h-full transition-all duration-1000 ${item.percentage > 80 ? 'bg-emerald-500' : item.percentage > 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
                                 style={{ width: `${item.percentage}%` }} 
                              />
                           </div>
                           {item.percentage < 50 && (
                              <button className="mt-2 text-[9px] font-bold text-indigo-400 hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                                 <SparklesIcon size={10} className="mr-1" /> GENERATE TESTS
                              </button>
                           )}
                        </div>
                     ))}
                  </div>
               </section>

               <div className="h-px bg-slate-800" />

               {/* Flakiness Section */}
               <section className="space-y-4">
                  <div className="flex items-center justify-between">
                     <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Flakiness Detector</h3>
                     <AlertTriangleIcon size={14} className="text-amber-500" />
                  </div>
                  <div className="space-y-3">
                     {MOCK_FLAKY_TESTS.map(flaky => (
                        <div key={flaky.id} className="bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-amber-500/50 transition-colors cursor-pointer group">
                           <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-medium text-slate-300 truncate w-32">{flaky.name}</span>
                              <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">{flaky.failRate}% FAIL</span>
                           </div>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                 {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className={`w-1.5 h-3 rounded-sm ${i === 4 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                 ))}
                                 <span className="text-[9px] text-slate-500 ml-1">history</span>
                              </div>
                              <button className="text-[9px] font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-all">STABILIZE</button>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>

               {/* Run Log Summary */}
               <section className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-4 mt-auto">
                  <div className="flex items-center text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                     <TerminalIcon size={12} className="mr-2" />
                     Execution Summary
                  </div>
                  <div className="space-y-2 font-mono text-[10px] text-indigo-300/70">
                     <div className="flex justify-between">
                        <span>Worker threads:</span>
                        <span>4</span>
                     </div>
                     <div className="flex justify-between">
                        <span>Memory used:</span>
                        <span>412 MB</span>
                     </div>
                     <div className="flex justify-between">
                        <span>Heap limit:</span>
                        <span>2048 MB</span>
                     </div>
                  </div>
               </section>

            </div>
         </aside>

      </div>
    </div>
  );
};

const SummaryCard: React.FC<{ label: string; value: number | string; color: 'slate' | 'emerald' | 'red' | 'indigo' }> = ({ label, value, color }) => (
   <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</div>
      <div className={`text-2xl font-bold tracking-tight ${
         color === 'emerald' ? 'text-emerald-400' :
         color === 'red' ? 'text-red-400' :
         color === 'indigo' ? 'text-indigo-400' : 'text-slate-200'
      }`}>
         {value}
      </div>
   </div>
);

export default QualityHub;
