
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
  CodeIcon,
  FolderIcon,
  FileTextIcon
} from './Icons';

const QualityHub: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [runProgress, setRunProgress] = useState(0);
  const [results, setResults] = useState<TestResult[]>(MOCK_TEST_RESULTS);
  const [showFailuresOnly, setShowFailuresOnly] = useState(false);
  const [watchMode, setWatchMode] = useState(false);
  const [expandedSuites, setExpandedSuites] = useState<Set<string>>(new Set(['Dashboard', 'AuthFlow']));
  const [collapsedInsights, setCollapsedInsights] = useState<Set<string>>(new Set());

  const handleRunAll = () => {
    setIsRunning(true);
    setRunProgress(0);
    // Simulation of test execution
    const interval = setInterval(() => {
      setRunProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const toggleInsight = (id: string) => {
    const next = new Set(collapsedInsights);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCollapsedInsights(next);
  };

  const filteredResults = showFailuresOnly 
    ? results.filter(r => r.status === 'fail') 
    : results;

  // Group tests by Suite for the Explorer
  const suites = Array.from(new Set(results.map(r => r.suite)));
  
  const stats = {
    total: results.length,
    passed: results.filter(r => r.status === 'pass').length,
    failed: results.filter(r => r.status === 'fail').length,
    skipped: results.filter(r => r.status === 'skipped').length,
  };

  const hasFailuresInRun = isRunning && filteredResults.some(r => r.status === 'fail');

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans relative">
      
      {/* Global Progress Bar (Top-most) */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-slate-800 z-50 overflow-hidden">
        {isRunning && (
          <div 
            className={`h-full transition-all duration-300 shadow-[0_0_10px] ${hasFailuresInRun ? 'bg-red-500 shadow-red-500/50' : 'bg-emerald-500 shadow-emerald-500/50'}`} 
            style={{ width: `${runProgress}%` }} 
          />
        )}
      </div>

      {/* 1. Toolbar (60px) */}
      <header className="h-[60px] border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0 z-20">
         <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center group cursor-default">
               <ShieldIcon className="mr-2 text-indigo-400 group-hover:animate-pulse" size={22} />
               Quality Hub
            </h1>

            <div className="h-6 w-px bg-slate-800" />

            <div className="flex items-center space-x-4">
               {/* Environment Selector */}
               <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Environment</span>
                  <select className="bg-transparent border-none text-xs font-semibold text-slate-300 outline-none p-0 cursor-pointer hover:text-white transition-colors">
                     <option>Local (Vitest)</option>
                     <option>Docker (Isolated)</option>
                     <option>Staging (E2E)</option>
                  </select>
               </div>

               {/* Failure Filter Toggle */}
               <div className="flex items-center space-x-2 bg-slate-800/50 hover:bg-slate-800 rounded px-3 py-1.5 border border-slate-700 transition-colors">
                  <FilterIcon size={12} className="text-slate-500" />
                  <label className="flex items-center cursor-pointer select-none">
                     <input 
                        type="checkbox" 
                        checked={showFailuresOnly} 
                        onChange={() => setShowFailuresOnly(!showFailuresOnly)}
                        className="mr-2 accent-indigo-500 rounded-sm w-3 h-3"
                     />
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Failures Only</span>
                  </label>
               </div>

               {/* Watch Mode Toggle */}
               <button 
                  onClick={() => setWatchMode(!watchMode)}
                  className={`p-2 rounded border transition-all flex items-center space-x-2 ${
                    watchMode 
                    ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300'
                  }`}
                  title="Watch Mode: Run tests on save"
               >
                  <EyeIcon size={16} />
                  <span className="text-[10px] font-bold uppercase hidden md:inline">Watch</span>
               </button>
            </div>
         </div>

         <div className="flex items-center space-x-3">
            <Button 
              variant="secondary" 
              size="sm" 
              icon={<RotateCwIcon size={14} className={isRunning ? 'animate-spin' : ''} />}
              disabled={isRunning}
              onClick={() => setResults(MOCK_TEST_RESULTS)}
            >
              Reset
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              icon={isRunning ? <RotateCwIcon size={14} className="animate-spin" /> : <PlayIcon size={14} />} 
              onClick={handleRunAll}
              disabled={isRunning}
              className="bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all active:scale-95"
            >
              {isRunning ? 'Executing...' : 'Run All Tests'}
            </Button>
         </div>
      </header>

      {/* 2. Main 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* Left: Test Explorer (Independent Scroll) */}
         <aside className="w-[280px] border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
            <div className="p-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/50">
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                  <FolderIcon size={12} className="mr-2" />
                  Test Explorer
               </span>
               <div className="relative group">
                  <SearchIcon size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input type="text" placeholder="Filter..." className="bg-slate-800 border border-slate-700 rounded pl-7 pr-2 py-1 text-[10px] w-32 focus:outline-none focus:border-indigo-500/50 transition-all" />
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
                        className="w-full flex items-center px-2 py-1.5 rounded hover:bg-slate-800/80 text-xs text-slate-400 group transition-all"
                     >
                        {expandedSuites.has(suiteName) ? <ChevronDownIcon size={14} className="mr-1 text-slate-600" /> : <ChevronRightIcon size={14} className="mr-1 text-slate-600" />}
                        <span className={`flex-1 text-left font-semibold ${expandedSuites.has(suiteName) ? 'text-slate-200' : ''}`}>{suiteName}</span>
                        <span className="text-[9px] font-mono opacity-50 bg-slate-800 px-1.5 py-0.5 rounded ml-2">
                           {results.filter(r => r.suite === suiteName).length}
                        </span>
                     </button>
                     
                     {expandedSuites.has(suiteName) && (
                        <div className="ml-4 mt-1 border-l border-slate-800/60 space-y-0.5 animate-in slide-in-from-left-1 duration-200">
                           {results.filter(r => r.suite === suiteName).map(test => (
                              <button 
                                 key={test.id}
                                 className="w-full flex items-center px-3 py-1.5 rounded-r text-[11px] text-slate-500 hover:bg-slate-800/60 hover:text-slate-300 transition-colors group/item"
                              >
                                 <div className={`w-1.5 h-1.5 rounded-full mr-2.5 shrink-0 transition-all ${
                                    test.status === 'pass' ? 'bg-emerald-500/60' :
                                    test.status === 'fail' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] scale-110' :
                                    'bg-slate-600'
                                 }`} />
                                 <span className="truncate group-hover/item:translate-x-0.5 transition-transform">{test.name}</span>
                              </button>
                           ))}
                        </div>
                     )}
                  </div>
               ))}
               
               <div className="mt-6 px-2">
                  <button className="w-full py-2 border border-dashed border-slate-800 rounded text-[10px] font-bold text-slate-600 hover:text-slate-400 hover:border-slate-700 transition-all uppercase tracking-widest">
                     + New Test Suite
                  </button>
               </div>
            </div>
         </aside>

         {/* Center: Execution Console (Independent Scroll) */}
         <main className="flex-1 flex flex-col bg-[#0f172a] overflow-hidden border-r border-slate-800">
            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-4 p-6 bg-slate-900/40 border-b border-slate-800 shadow-inner">
               <SummaryCard label="Total Tests" value={stats.total} color="slate" />
               <SummaryCard label="Passed" value={stats.passed} color="emerald" />
               <SummaryCard label="Failed" value={stats.failed} color="red" />
               <SummaryCard label="Duration" value="4.2s" color="indigo" />
            </div>

            {/* Failure Detail List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                     <TerminalIcon size={14} className="mr-2" />
                     Live Results Console
                  </h2>
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-600">
                     <span>PID: 84210</span>
                     <span>|</span>
                     <span>WORKERS: 4</span>
                  </div>
               </div>

               {filteredResults.filter(r => r.status === 'fail').map(fail => (
                  <div key={fail.id} className="bg-slate-800/40 border border-red-500/20 rounded-xl overflow-hidden animate-in slide-in-from-bottom-2 duration-300 hover:border-red-500/40 transition-colors">
                     <div className="bg-red-500/5 px-4 py-3 flex items-center justify-between border-b border-red-500/10">
                        <div className="flex items-center space-x-3">
                           <XCircleIcon size={16} className="text-red-500" />
                           <span className="text-xs font-bold text-red-100">{fail.suite} &rsaquo; {fail.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                           <span className="text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">{fail.file}</span>
                           <button className="text-slate-600 hover:text-indigo-400 transition-colors">
                              <CodeIcon size={14} />
                           </button>
                        </div>
                     </div>
                     
                     <div className="p-4 space-y-4">
                        <div className="font-mono text-[11px] text-red-300 bg-red-950/20 p-4 rounded-lg border border-red-900/30 whitespace-pre overflow-x-auto custom-scrollbar">
                           <span className="opacity-50 select-none mr-2">1 |</span> Expected <span className="text-white font-bold">401</span>, but received <span className="text-red-400 font-bold">200</span>
                           {"\n"}<span className="opacity-50 select-none mr-2">2 |</span> at src/auth/middleware.test.ts:42:15
                        </div>

                        {fail.aiInsight && (
                           <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-lg overflow-hidden group">
                              <button 
                                 onClick={() => toggleInsight(fail.id)}
                                 className="w-full flex items-center justify-between p-4 hover:bg-indigo-900/20 transition-colors"
                              >
                                 <div className="flex items-center text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                                    <SparklesIcon size={14} className="mr-2 animate-pulse" />
                                    ✨ AI Debug Insight
                                 </div>
                                 <ChevronDownIcon size={14} className={`text-indigo-500 transition-transform duration-300 ${collapsedInsights.has(fail.id) ? '-rotate-90' : ''}`} />
                              </button>
                              
                              {!collapsedInsights.has(fail.id) && (
                                 <div className="px-4 pb-4 animate-in slide-in-from-top-1 duration-200">
                                    <p className="text-xs text-indigo-200/80 leading-relaxed mb-4 p-3 bg-indigo-950/30 rounded border border-indigo-500/10">
                                       {fail.aiInsight}
                                    </p>
                                    <div className="flex items-center space-x-3">
                                       <Button variant="primary" size="sm" className="bg-indigo-600 text-white border-none text-[10px] shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                                          Apply AI Fix
                                       </Button>
                                       <Button variant="ghost" size="sm" className="text-[10px] hover:bg-indigo-500/10">Compare with Last Success</Button>
                                    </div>
                                 </div>
                              )}
                           </div>
                        )}
                     </div>
                  </div>
               ))}

               {stats.failed === 0 && !isRunning && (
                  <div className="flex flex-col items-center justify-center py-24 animate-in zoom-in duration-700">
                     <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                        <CheckCircleIcon size={48} className="text-emerald-500" />
                     </div>
                     <h3 className="text-xl font-bold text-white mb-2">Systems Nominal</h3>
                     <p className="text-slate-500 max-w-xs text-center text-sm">All tests passed. Regression suite cleared at {new Date().toLocaleTimeString()}.</p>
                  </div>
               )}
            </div>
         </main>

         {/* Right: Coverage & Insights (Independent Scroll) */}
         <aside className="w-[320px] border-l border-slate-800 bg-[#1e293b]/30 flex flex-col shrink-0">
            <div className="p-6 space-y-10 overflow-y-auto custom-scrollbar">
               
               {/* Coverage Section */}
               <section className="space-y-4">
                  <div className="flex items-center justify-between">
                     <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Code Coverage</h3>
                     <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-emerald-400">84.3%</span>
                        <span className="text-[8px] text-slate-600 font-mono">PROJECT AVG</span>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     {MOCK_COVERAGE.map(item => (
                        <div key={item.id} className="group cursor-pointer">
                           <div className="flex items-center justify-between text-[11px] mb-2">
                              <div className="flex items-center">
                                 <FileTextIcon size={12} className="text-slate-600 mr-2 group-hover:text-slate-300 transition-colors" />
                                 <span className="text-slate-300 truncate w-40 font-mono group-hover:text-white" title={item.path}>
                                    {item.path.split('/').pop()}
                                 </span>
                              </div>
                              <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                                 item.percentage > 80 ? 'text-emerald-400 bg-emerald-500/10' : 
                                 item.percentage > 50 ? 'text-amber-400 bg-amber-500/10' : 
                                 'text-red-400 bg-red-500/10'
                              }`}>
                                 {item.percentage}%
                              </span>
                           </div>
                           <div className="h-1 w-full bg-slate-800/50 rounded-full overflow-hidden">
                              <div 
                                 className={`h-full transition-all duration-1000 ease-out ${
                                    item.percentage > 80 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 
                                    item.percentage > 50 ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]' : 
                                    'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                                 }`} 
                                 style={{ width: `${item.percentage}%` }} 
                              />
                           </div>
                           {item.percentage < 50 && (
                              <button className="mt-3 w-full py-1.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-bold text-indigo-400 hover:bg-indigo-500/20 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center uppercase tracking-widest">
                                 <SparklesIcon size={10} className="mr-2" /> 
                                 Increase Coverage
                              </button>
                           )}
                        </div>
                     ))}
                  </div>
               </section>

               <div className="h-px bg-slate-800/50" />

               {/* Flakiness Section */}
               <section className="space-y-4">
                  <div className="flex items-center justify-between">
                     <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Flakiness Detector</h3>
                     <AlertTriangleIcon size={14} className="text-amber-500 animate-pulse" />
                  </div>
                  <div className="space-y-3">
                     {MOCK_FLAKY_TESTS.map(flaky => (
                        <div key={flaky.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 hover:border-amber-500/30 transition-all cursor-pointer group shadow-sm">
                           <div className="flex items-center justify-between mb-3">
                              <span className="text-[11px] font-bold text-slate-200 truncate w-32">{flaky.name}</span>
                              <span className="text-[9px] font-mono font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                                 {flaky.failRate}% FAIL
                              </span>
                           </div>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1.5">
                                 <div className="flex space-x-1">
                                    {Array.from({ length: 10 }).map((_, i) => (
                                       <div 
                                          key={i} 
                                          className={`w-1 h-3 rounded-full ${
                                             i > 7 ? 'bg-red-500' : 
                                             i === 5 ? 'bg-amber-500' : 'bg-emerald-500/50'
                                          }`} 
                                          title={`Run ${10-i} ago: ${i > 7 ? 'Fail' : 'Pass'}`}
                                       />
                                    ))}
                                 </div>
                                 <span className="text-[8px] text-slate-600 font-bold uppercase ml-1">history</span>
                              </div>
                              <button className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-all uppercase tracking-tighter">
                                 Ask AI to Stabilize
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>

               {/* Run Metrics Table */}
               <section className="bg-indigo-900/5 border border-indigo-500/10 rounded-xl p-5 mt-auto">
                  <div className="flex items-center text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                     <ActivityIcon size={12} className="mr-2" />
                     Engine Performance
                  </div>
                  <div className="space-y-3 font-mono text-[10px]">
                     <div className="flex justify-between border-b border-slate-800/50 pb-1.5">
                        <span className="text-slate-500">Worker Utilization:</span>
                        <span className="text-slate-300">85.4%</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-800/50 pb-1.5">
                        <span className="text-slate-500">Peak Memory:</span>
                        <span className="text-slate-300">1.2 GB</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-slate-500">I/O Wait:</span>
                        <span className="text-emerald-500">45ms</span>
                     </div>
                  </div>
               </section>

            </div>
         </aside>

      </div>

      {/* Floating Status Bar for Watch Mode */}
      {watchMode && (
         <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center space-x-3 z-50 border border-indigo-400/30 animate-in slide-in-from-bottom-4">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">Watch Mode Active</span>
            <div className="h-4 w-px bg-indigo-400" />
            <span className="text-[10px] font-mono opacity-80">Listening for changes...</span>
         </div>
      )}
    </div>
  );
};

const SummaryCard: React.FC<{ label: string; value: number | string; color: 'slate' | 'emerald' | 'red' | 'indigo' }> = ({ label, value, color }) => (
   <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:bg-slate-800/60 transition-colors group">
      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 group-hover:text-slate-400 transition-colors">{label}</div>
      <div className={`text-3xl font-bold tracking-tight ${
         color === 'emerald' ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.2)]' :
         color === 'red' ? 'text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.2)]' :
         color === 'indigo' ? 'text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.2)]' :
         'text-slate-200'
      }`}>
         {value}
      </div>
   </div>
);

export default QualityHub;
