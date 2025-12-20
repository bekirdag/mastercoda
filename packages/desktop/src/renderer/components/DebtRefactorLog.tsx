
import React, { useState, useMemo } from 'react';
import { TechnicalDebtItem, DebtSeverity, DebtCategory } from '../types';
import { MOCK_TECHNICAL_DEBT } from '../constants';
import Button from './Button';
import Badge from './Badge';
import DiffViewer from './DiffViewer';
import { 
  ActivityIcon, 
  RotateCwIcon, 
  ShieldIcon, 
  TrashIcon, 
  SearchIcon, 
  AlertTriangleIcon, 
  SparklesIcon, 
  CheckCircleIcon, 
  XIcon, 
  ChevronRightIcon, 
  ChevronDownIcon, 
  CodeIcon, 
  ZapIcon, 
  LockIcon,
  FileTextIcon,
  ArrowRightIcon,
  FilterIcon
} from './Icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const DebtRefactorLog: React.FC = () => {
  const [debtItems, setDebtItems] = useState<TechnicalDebtItem[]>(MOCK_TECHNICAL_DEBT);
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_TECHNICAL_DEBT[0].id);
  const [isScanning, setIsScanning] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<DebtCategory | 'all'>('all');

  const selectedItem = useMemo(() => debtItems.find(i => i.id === selectedId), [debtItems, selectedId]);

  const stats = useMemo(() => {
    const total = debtItems.filter(i => i.status === 'unresolved').length;
    const critical = debtItems.filter(i => i.severity === 'critical' && i.status === 'unresolved').length;
    const totalPoints = debtItems.filter(i => i.status === 'unresolved').reduce((acc, i) => acc + i.effortPoints, 0);
    
    // Group by category for pie chart
    const byCat = debtItems.filter(i => i.status === 'unresolved').reduce((acc, i) => {
        acc[i.category] = (acc[i.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(byCat).map(([name, value]) => ({ 
        name: name.toUpperCase(), 
        value,
        color: name === 'security' ? '#ef4444' : name === 'scalability' ? '#6366f1' : name === 'smell' ? '#fbbf24' : '#64748b'
    }));

    return { total, critical, totalPoints, chartData };
  }, [debtItems]);

  const handleScan = async () => {
    setIsScanning(true);
    // Simulate static analysis
    await new Promise(r => setTimeout(r, 2000));
    setIsScanning(false);
  };

  const handleApplyRefactor = async () => {
    if (!selectedId) return;
    setIsResolving(true);
    // Simulation: Refactor merging
    await new Promise(r => setTimeout(r, 1500));
    setDebtItems(prev => prev.map(i => i.id === selectedId ? { ...i, status: 'refactored' } : i));
    setIsResolving(false);
    
    // Select next
    const next = debtItems.find(i => i.id !== selectedId && i.status === 'unresolved');
    if (next) setSelectedId(next.id);
  };

  const handleIgnore = (id: string) => {
    setDebtItems(prev => prev.map(i => i.id === id ? { ...i, status: 'ignored' } : i));
  };

  const filteredItems = useMemo(() => {
    return debtItems.filter(i => {
      const matchSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          i.filePath.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = filterCategory === 'all' || i.category === filterCategory;
      return matchSearch && matchCat && i.status === 'unresolved';
    });
  }, [debtItems, searchQuery, filterCategory]);

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Header & Metrics HUD */}
      <header className="shrink-0 p-6 border-b border-slate-800 bg-slate-900/50">
         <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
               <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
                     <HistoryIconProxy size={24} className="mr-3 text-amber-500" />
                     Technical Debt & Refactor Log
                  </h1>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-mono mt-1">Audit_Registry_v1.0 • Project_Health: 84%</p>
               </div>
               <div className="flex items-center space-x-3">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    icon={<RotateCwIcon size={14} className={isScanning ? 'animate-spin' : ''} />}
                    onClick={handleScan}
                    disabled={isScanning}
                  >
                    {isScanning ? 'Scanning Source...' : 'Rescan Project'}
                  </Button>
                  <Button variant="primary" size="sm" icon={<ZapIcon size={14}/>}>Bulk Refactor</Button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <HudStat label="Total Debt Items" value={stats.total.toString()} icon={<ActivityIcon size={14} />} color="indigo" />
               <HudStat label="Critical Hacks" value={stats.critical.toString()} icon={<AlertTriangleIcon size={14} />} color="red" />
               <HudStat label="Estimated Cleanup" value={`${stats.totalPoints} pts`} icon={<ZapIcon size={14} />} color="amber" />
               <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex items-center h-[76px]">
                  <div className="flex-1 h-full min-w-0">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie 
                              data={stats.chartData} 
                              innerRadius={20} 
                              outerRadius={30} 
                              paddingAngle={5} 
                              dataKey="value"
                           >
                              {stats.chartData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                           </Pie>
                        </PieChart>
                     </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col items-end justify-center ml-2">
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Composition</span>
                     <span className="text-xs font-bold text-white">4 Types</span>
                  </div>
               </div>
            </div>
         </div>
      </header>

      {/* 2. Main Workspace (Split View) */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* LEFT: Debt Registry */}
         <aside className="w-[400px] border-r border-slate-800 bg-slate-900/40 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-800 flex items-center space-x-3 bg-slate-900/50">
               <div className="relative group flex-1">
                  <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400" />
                  <input 
                     type="text" 
                     placeholder="Filter debt log..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:border-indigo-500 outline-none transition-all"
                  />
               </div>
               <select 
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as any)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase outline-none cursor-pointer"
               >
                  <option value="all">All</option>
                  <option value="security">Security</option>
                  <option value="scalability">Scaling</option>
                  <option value="smell">Smell</option>
               </select>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
               {filteredItems.map(item => (
                  <div 
                     key={item.id}
                     onClick={() => setSelectedId(item.id)}
                     className={`p-4 rounded-2xl border-2 transition-all cursor-pointer group relative overflow-hidden ${
                        selectedId === item.id 
                           ? 'bg-indigo-600/10 border-indigo-500/50 shadow-xl' 
                           : 'bg-transparent border-transparent hover:bg-slate-800/50'
                     }`}
                  >
                     <div className={`absolute top-0 left-0 w-1 h-full ${
                        item.severity === 'critical' ? 'bg-red-500' : 
                        item.severity === 'high' ? 'bg-amber-500' : 
                        'bg-slate-700'
                     }`} />
                     
                     <div className="flex items-center justify-between mb-2">
                        <Badge variant={item.severity === 'critical' ? 'error' : item.severity === 'high' ? 'warning' : 'neutral'}>
                           {item.severity.toUpperCase()}
                        </Badge>
                        <span className="text-[8px] font-mono text-slate-600 uppercase">{item.category}</span>
                     </div>
                     
                     <h3 className={`text-sm font-bold leading-tight mb-2 transition-colors ${selectedId === item.id ? 'text-white' : 'text-slate-300'}`}>
                        {item.title}
                     </h3>
                     
                     <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-800/50">
                        <div className="flex items-center text-[10px] font-mono text-slate-500 uppercase truncate max-w-[200px]">
                           <FileTextIcon size={12} className="mr-1.5 shrink-0" />
                           {item.filePath.split('/').pop()}
                        </div>
                        <ChevronRightIcon size={14} className={`text-slate-700 transition-all ${selectedId === item.id ? 'text-indigo-400 translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                     </div>
                  </div>
               ))}
               
               {filteredItems.length === 0 && (
                  <div className="py-20 text-center space-y-4 opacity-20">
                     <CheckCircleIcon size={64} className="mx-auto" />
                     <p className="text-xl font-bold uppercase tracking-widest">Repository Clean</p>
                  </div>
               )}
            </div>
         </aside>

         {/* RIGHT: Detail & Refactor Preview */}
         <main className="flex-1 flex flex-col bg-[#0d1117] overflow-hidden">
            {selectedItem ? (
               <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500">
                  
                  {/* Item Header */}
                  <div className="p-8 border-b border-slate-800 space-y-6">
                     <div className="flex items-start justify-between">
                        <div className="space-y-1">
                           <h2 className="text-2xl font-bold text-white tracking-tight">{selectedItem.title}</h2>
                           <div className="flex items-center space-x-3 text-xs text-slate-500">
                              <span className="font-mono text-indigo-400">{selectedItem.filePath}</span>
                              <span>•</span>
                              <span>{selectedItem.origin}</span>
                           </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                           <div className="flex items-center space-x-2 text-[10px] font-bold text-red-400 uppercase tracking-widest bg-red-500/5 px-2 py-1 rounded border border-red-500/20">
                              <ZapIcon size={12} className="animate-pulse" />
                              INTEREST SCORE: {selectedItem.interestScore}%
                           </div>
                           <span className="text-[10px] text-slate-600 font-mono italic">Complexity spike detected during v2.4 audit</span>
                        </div>
                     </div>
                     <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                        {selectedItem.context}
                     </p>
                  </div>

                  {/* Refactor Preview Workspace */}
                  <div className="flex-1 flex overflow-hidden">
                     
                     {/* Left: AI Analysis */}
                     <aside className="w-[320px] border-r border-slate-800 p-6 flex flex-col space-y-8 overflow-y-auto custom-scrollbar">
                        <section className="space-y-4">
                           <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                              <SparklesIcon size={14} className="mr-2 text-indigo-400" />
                              Agent's Confession
                           </h4>
                           <div className="p-4 bg-indigo-900/10 border border-indigo-500/20 rounded-2xl text-xs text-indigo-200/80 leading-relaxed italic shadow-inner">
                              "{selectedItem.agentAnalysis}"
                           </div>
                        </section>

                        <section className="space-y-4">
                           <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cleanup Effort</h4>
                           <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                                 <div className="text-[8px] font-bold text-slate-600 uppercase mb-1">Effort</div>
                                 <div className="text-sm font-bold text-white font-mono">{selectedItem.effortPoints} pts</div>
                              </div>
                              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                                 <div className="text-[8px] font-bold text-slate-600 uppercase mb-1">Time (Est)</div>
                                 <div className="text-sm font-bold text-white font-mono">15m</div>
                              </div>
                           </div>
                        </section>

                        <div className="mt-auto space-y-3 pt-6 border-t border-slate-800">
                           <Button 
                              variant="primary" 
                              className="w-full h-12 shadow-[0_0_20px_rgba(79,70,229,0.3)] group"
                              onClick={handleApplyRefactor}
                              disabled={isResolving}
                           >
                              {isResolving ? (
                                 <><RotateCwIcon size={14} className="animate-spin mr-2" /> Syncing Files...</>
                              ) : (
                                 <><RotateCwIcon size={14} className="mr-2 group-hover:rotate-180 transition-transform duration-500" /> Approve AI Refactor</>
                              )}
                           </Button>
                           <Button 
                              variant="secondary" 
                              className="w-full" 
                              onClick={() => { const evt = new CustomEvent('app-navigate', { detail: '/project/backlog/generator' }); window.dispatchEvent(evt); }}
                           >
                              Convert to Jira Task
                           </Button>
                           <button 
                             onClick={() => handleIgnore(selectedItem.id)}
                             className="w-full py-2 text-[10px] font-bold text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors"
                           >
                              Ignore Permanently
                           </button>
                        </div>
                     </aside>

                     {/* Center: Diff Viewer */}
                     <div className="flex-1 flex flex-col relative">
                        <header className="h-10 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
                           <div className="flex items-center space-x-6 text-[10px] font-bold uppercase tracking-widest">
                              <span className="text-red-400">Current Hack</span>
                              <ArrowRightIcon size={12} className="text-slate-700" />
                              <span className="text-emerald-400">Proposed Solution</span>
                           </div>
                           <button className="text-[10px] font-bold text-slate-600 hover:text-white uppercase tracking-widest">FULLSCREEN DIFF &rsaquo;</button>
                        </header>
                        <div className="flex-1 overflow-hidden">
                           <DiffViewer 
                              original={selectedItem.codeBefore} 
                              modified={selectedItem.codeAfter} 
                           />
                        </div>
                        
                        {/* Interactive Banner */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-full shadow-2xl flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 z-10">
                           <ActivityIcon size={14} className="text-indigo-400" />
                           <span>Simulating code transformation via Agent Host</span>
                        </div>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center h-full text-slate-700 opacity-20">
                  <ShieldIcon size={80} className="mb-4" />
                  <p className="text-2xl font-bold uppercase tracking-[0.3em]">Refactor Log Empty</p>
               </div>
            )}
         </main>

      </div>

      {/* Global Status Footer */}
      <footer className="h-10 bg-slate-900 border-t border-slate-800 shrink-0 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-30">
         <div className="flex items-center space-x-12">
            <div className="flex items-center">
               <ShieldIcon size={12} className="mr-2 text-indigo-400" />
               HEALTH_SCORE: <span className="ml-2 text-emerald-500 font-mono">84.2%</span>
            </div>
            <div className="flex items-center">
               <RotateCwIcon size={12} className="mr-2 text-indigo-400" />
               DEBT_INTEREST: <span className="ml-2 text-amber-500">MODERATE</span>
            </div>
         </div>
         <div className="flex items-center space-x-4">
            <span className="text-slate-600 font-mono">NODE_HASH: AUDIT_8902_FT</span>
            <div className="h-3 w-px bg-slate-800" />
            <div className="flex items-center text-indigo-400">
               <LockIcon size={12} className="mr-2" />
               ENCLAVE_VALIDATED
            </div>
         </div>
      </footer>

      {/* Resolving Animation Overlay */}
      {isResolving && (
         <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-emerald-500/5 animate-flash-green" />
      )}
    </div>
  );
};

// Sub-components

const HudStat: React.FC<{ label: string; value: string; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
   <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl flex flex-col group hover:border-slate-600 transition-all shadow-sm">
      <div className="flex items-center text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-1 group-hover:text-slate-400">
         <span className={`mr-2 text-${color}-400`}>{icon}</span>
         {label}
      </div>
      <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
   </div>
);

const HistoryIconProxy: React.FC<any> = (props) => (
   <svg
     xmlns="http://www.w3.org/2000/svg"
     width={props.size || 20}
     height={props.size || 20}
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     strokeWidth="2"
     strokeLinecap="round"
     strokeLinejoin="round"
     {...props}
   >
     <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
     <path d="M3 3v5h5" />
     <path d="M12 7v5l4 2" />
   </svg>
 );

export default DebtRefactorLog;
