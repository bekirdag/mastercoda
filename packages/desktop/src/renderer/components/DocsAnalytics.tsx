
import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_DRIFT_RECORDS, MOCK_SEARCH_GAPS, MOCK_DOC_FEEDBACK } from '../constants';
import { DriftRecord, SearchGap, DocFeedbackItem } from '../types';
import Button from './Button';
import Badge from './Badge';
import { 
  ActivityIcon, 
  ClockIcon, 
  SearchIcon, 
  ShieldIcon, 
  SparklesIcon, 
  ArrowRightIcon, 
  AlertTriangleIcon, 
  CheckCircleIcon, 
  PlusIcon,
  TrashIcon,
  UserIcon,
  HistoryIcon,
  RefreshCwIcon,
  Edit2Icon
} from './Icons';

const DocsAnalytics: React.FC = () => {
  const [isScanning, setIsScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [driftRecords, setDriftRecords] = useState<DriftRecord[]>(MOCK_DRIFT_RECORDS);
  const [searchGaps, setSearchGaps] = useState<SearchGap[]>(MOCK_SEARCH_GAPS);
  const [feedback, setFeedback] = useState<DocFeedbackItem[]>(MOCK_DOC_FEEDBACK);

  useEffect(() => {
    const timer = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsScanning(false), 500);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 200);
    return () => clearInterval(timer);
  }, []);

  const handleResolveFeedback = (id: string) => {
    setFeedback(prev => prev.map(item => item.id === id ? { ...item, status: 'resolved' as const } : item));
  };

  const handleCreatePage = (term: string) => {
    const evt = new CustomEvent('app-navigate', { detail: `/docs/edit/new?title=${encodeURIComponent(term)}` });
    window.dispatchEvent(evt);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 font-sans">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Content Health & Insights</h1>
          <p className="text-slate-400 mt-1">Documentation performance and drift analysis</p>
        </div>
        <div className="flex items-center space-x-3">
           <Button variant="secondary" size="sm" icon={<RefreshCwIcon size={14}/>} onClick={() => { setIsScanning(true); setScanProgress(0); }}>Refresh Health Check</Button>
           <Button variant="primary" size="sm" icon={<ShieldIcon size={14}/>}>Verify All Links</Button>
        </div>
      </div>

      {/* 2. KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <HealthKpiCard label="Documentation Coverage" value="72%" sub="Modules with linked docs" icon={<ShieldIcon size={16} />} color="indigo" />
        <HealthKpiCard label="Content Freshness" value="85%" sub="Up to date (< 3 months)" icon={<ClockIcon size={16} />} color="emerald" />
        <HealthKpiCard label="Search Success" value="92%" sub="Queries found a result" icon={<SearchIcon size={16} />} color="blue" />
        <HealthKpiCard label="User Sentiment" value="4.2/5" sub="Helpfulness rating" icon={<ActivityIcon size={16} />} color="amber" />
      </div>

      {/* 3. Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Drift Detection (Left) */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden flex flex-col shadow-xl">
           <div className="p-6 border-b border-slate-700 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center space-x-3">
                 <HistoryIcon size={18} className="text-red-400" />
                 <h2 className="text-sm font-bold text-white uppercase tracking-widest">Likely Outdated Pages (Drift)</h2>
              </div>
              <Badge variant="error">{driftRecords.filter(d => d.score === 'high').length} CRITICAL</Badge>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar relative min-h-[400px]">
              {isScanning ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-12 bg-slate-900/50 backdrop-blur-sm z-10 animate-in fade-in">
                    <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
                       <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                    </div>
                    <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest animate-pulse">Scanning Git History...</span>
                 </div>
              ) : (
                 <div className="divide-y divide-slate-800/50">
                    {driftRecords.map(record => (
                       <div key={record.id} className="p-4 hover:bg-slate-800/50 transition-colors group">
                          <div className="flex items-center justify-between mb-2">
                             <h4 className="text-sm font-bold text-white truncate">{record.title}</h4>
                             <DriftScoreBadge score={record.score} />
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                             <div className="space-y-1">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Documentation</span>
                                <div className="text-[10px] text-slate-400 font-mono truncate">{record.docPath}</div>
                                <div className="text-[10px] text-slate-600">Last edit: {record.lastDocEdit}</div>
                             </div>
                             <div className="space-y-1">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Related Codebase</span>
                                <div className="text-[10px] text-indigo-400 font-mono truncate">{record.codePath}</div>
                                <div className="text-[10px] text-slate-600">Last change: {record.lastCodeEdit}</div>
                             </div>
                          </div>
                          <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Button variant="ghost" size="sm" className="text-[10px]">Mark Neutral</Button>
                             <Button variant="primary" size="sm" className="text-[10px]" icon={<Edit2Icon size={12}/>}>Fix Outdated Doc</Button>
                          </div>
                       </div>
                    ))}
                 </div>
              )}
           </div>
        </div>

        {/* Search Gaps (Right) */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden flex flex-col shadow-xl">
           <div className="p-6 border-b border-slate-700 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center space-x-3">
                 <SearchIcon size={18} className="text-indigo-400" />
                 <h2 className="text-sm font-bold text-white uppercase tracking-widest">Search Gap Analysis</h2>
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
              <table className="w-full text-left">
                 <thead className="bg-slate-900 sticky top-0 z-10 border-b border-slate-800">
                    <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       <th className="px-6 py-3">Failed Query Term</th>
                       <th className="px-6 py-3 text-center">Frequency</th>
                       <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800/50">
                    {searchGaps.map(gap => (
                       <tr key={gap.id} className="hover:bg-slate-800/30 transition-colors group">
                          <td className="px-6 py-4">
                             <div className="flex items-center">
                                <span className="text-sm font-bold text-slate-200">"{gap.term}"</span>
                                <span className="ml-2 text-[9px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded uppercase font-bold">0 Results</span>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                             <span className="text-sm font-mono text-slate-400">{gap.count} searches</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <button 
                               onClick={() => handleCreatePage(gap.term)}
                               className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest flex items-center justify-end ml-auto group/btn"
                             >
                                Create Page <ArrowRightIcon size={12} className="ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
                             </button>
                          </td>
                       </tr>
                    ))}
                    {searchGaps.length === 0 && (
                       <tr>
                          <td colSpan={3} className="px-6 py-20 text-center text-slate-600 italic">No search gaps identified yet.</td>
                       </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>

      </div>

      {/* 4. Feedback Queue (Bottom) */}
      <section className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
         <div className="p-6 border-b border-slate-700 bg-slate-900/50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
               <ActivityIcon size={18} className="text-amber-400" />
               <h2 className="text-sm font-bold text-white uppercase tracking-widest">Unresolved Feedback Queue</h2>
            </div>
            <button className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-tighter">View Resolved &rsaquo;</button>
         </div>

         <div className="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {feedback.filter(f => f.status === 'open').map(item => (
               <div key={item.id} className="p-5 bg-slate-900/50 border border-slate-700 rounded-xl hover:border-slate-500 transition-all flex flex-col group animate-in slide-in-from-bottom-2">
                  <div className="flex items-start justify-between mb-4">
                     <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-700">
                           {item.user[0]}
                        </div>
                        <div>
                           <div className="text-xs font-bold text-slate-200">{item.user}</div>
                           <div className="text-[9px] font-mono text-slate-600 uppercase">{item.timestamp}</div>
                        </div>
                     </div>
                     {!item.helpful && <Badge variant="error">👎 Unhelpful</Badge>}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                     <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Context: {item.context}</div>
                     <p className="text-xs text-slate-400 leading-relaxed italic">"{item.comment}"</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                     <button className="text-[10px] font-bold text-slate-500 hover:text-indigo-400 uppercase">View Page</button>
                     <Button 
                        variant="primary" 
                        size="sm" 
                        className="text-[10px] h-7 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 uppercase"
                        onClick={() => handleResolveFeedback(item.id)}
                     >
                        Mark Resolved
                     </Button>
                  </div>
               </div>
            ))}
            {feedback.filter(f => f.status === 'open').length === 0 && (
               <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-700">
                  <CheckCircleIcon size={48} className="mb-4 opacity-10" />
                  <p className="font-bold uppercase tracking-widest">No pending feedback</p>
               </div>
            )}
         </div>
      </section>

      {/* Global Status Bar Overlay */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center space-x-3 z-50 border border-indigo-400/30 animate-in slide-in-from-bottom-4">
         <SparklesIcon size={14} className="animate-pulse" />
         <span className="text-[10px] font-bold uppercase tracking-widest">AI Engine Correlating git:HEAD to docs:main</span>
         <div className="h-4 w-px bg-indigo-400" />
         <span className="text-[9px] font-mono opacity-80 uppercase">Status: Nominal</span>
      </div>

    </div>
  );
};

// Sub-components

const HealthKpiCard: React.FC<{ label: string; value: string; sub: string; icon: React.ReactNode; color: string }> = ({ label, value, sub, icon, color }) => (
   <div className="bg-slate-850 p-5 rounded-2xl border border-slate-700 shadow-sm relative overflow-hidden group hover:border-slate-500 transition-all">
      <div className={`absolute top-0 right-0 w-16 h-16 bg-${color}-500/5 rounded-bl-full -mr-8 -mt-8`} />
      <div className="flex items-center text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 group-hover:text-slate-400">
         <span className={`mr-2 text-${color}-400`}>{icon}</span>
         {label}
      </div>
      <div className="text-3xl font-bold text-white tracking-tight mb-1">{value}</div>
      <div className="text-[10px] text-slate-500 uppercase font-mono">{sub}</div>
   </div>
);

const DriftScoreBadge: React.FC<{ score: 'high' | 'medium' | 'low' }> = ({ score }) => {
   const colors = {
      high: 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]',
      medium: 'bg-amber-500 text-white',
      low: 'bg-emerald-500 text-white'
   };
   return (
      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest ${colors[score]}`}>
         Drift: {score}
      </span>
   );
};

export default DocsAnalytics;
