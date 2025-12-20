import React, { useState, useMemo } from 'react';
import { AdrRecord, AdrStatus } from '../types';
import { MOCK_ADRS } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  HistoryIcon, 
  SearchIcon, 
  PlusIcon, 
  FilterIcon, 
  ChevronRightIcon, 
  ChevronDownIcon, 
  ArrowRightIcon, 
  ExternalLinkIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
  RotateCwIcon,
  ShieldIcon,
  UserIcon,
  ClockIcon,
  XIcon,
  HelpCircleIcon
} from './Icons';

const DecisionLog: React.FC = () => {
  const [adrs, setAdrs] = useState<AdrRecord[]>(MOCK_ADRS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AdrStatus | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredAdrs = useMemo(() => {
    return adrs.filter(adr => {
      const matchSearch = adr.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          adr.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || adr.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [adrs, searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    total: adrs.length,
    proposed: adrs.filter(a => a.status === 'proposed').length,
    accepted: adrs.filter(a => a.status === 'accepted').length,
    rejected: adrs.filter(a => a.status === 'rejected').length
  }), [adrs]);

  const selectedAdr = adrs.find(a => a.id === selectedId);

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans relative">
      
      {/* 1. Dashboard Header (Stats Cards) */}
      <section className="shrink-0 p-6 border-b border-slate-800 bg-slate-900/50">
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div>
               <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
                  <HistoryIcon className="mr-3 text-indigo-400" size={32} />
                  Decision Log (ADRs)
               </h1>
               <p className="text-slate-400 mt-1">Immutable registry of technical architecture choices.</p>
            </div>
            <Button variant="primary" icon={<PlusIcon size={16}/>} className="shadow-lg shadow-indigo-500/20">
               New Proposal
            </Button>
         </div>

         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard label="Total Records" value={stats.total.toString()} icon={<ActivityIconProxy size={14}/>} />
            <StatCard label="Proposed" value={stats.proposed.toString()} color="text-amber-400" icon={<RotateCwIcon size={14}/>} />
            <StatCard label="Accepted" value={stats.accepted.toString()} color="text-emerald-400" icon={<CheckCircleIcon size={14}/>} />
            <StatCard label="Rejected" value={stats.rejected.toString()} color="text-red-400" icon={<XCircleIcon size={14}/>} />
         </div>
      </section>

      {/* 2. Filter Bar */}
      <div className="h-14 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-8 shrink-0 z-20">
         <div className="flex items-center space-x-6">
            <div className="relative group">
               <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
               <input 
                  type="text" 
                  placeholder="Filter decisions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg py-1.5 pl-9 pr-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 w-64 transition-all"
               />
            </div>
            
            <div className="flex items-center space-x-2">
               <FilterIcon size={14} className="text-slate-600" />
               {(['all', 'proposed', 'accepted', 'rejected', 'deprecated'] as const).map(s => (
                  <button 
                     key={s}
                     onClick={() => setStatusFilter(s)}
                     className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                        statusFilter === s 
                        ? 'bg-indigo-600 border-indigo-500 text-white' 
                        : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
                     }`}
                  >
                     {s}
                  </button>
               ))}
            </div>
         </div>
         <div className="flex items-center space-x-2">
            <button className="p-1.5 text-slate-500 hover:text-white transition-colors" title="Decision Guidelines">
               <HelpCircleIcon size={18} />
            </button>
         </div>
      </div>

      {/* 3. Registry List */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
         <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-500 pb-20">
            {filteredAdrs.map(adr => (
               <AdrCard 
                  key={adr.id} 
                  adr={adr} 
                  isSelected={selectedId === adr.id}
                  onClick={() => setSelectedId(adr.id)} 
               />
            ))}

            {filteredAdrs.length === 0 && (
               <div className="py-20 flex flex-col items-center justify-center text-slate-600">
                  <HistoryIcon size={64} className="mb-4 opacity-10" />
                  <p className="text-lg font-medium">No decisions found matching your filter</p>
                  <Button variant="ghost" className="mt-4" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>Reset Filters</Button>
               </div>
            )}
         </div>
      </main>

      {/* 4. Detail Drawer */}
      {selectedAdr && (
         <AdrDetailDrawer 
            adr={selectedAdr} 
            onClose={() => setSelectedId(null)}
            onSupersede={(id) => {
               alert(`Initiating new ADR to supersede ${id}...`);
               setSelectedId(null);
            }}
         />
      )}

    </div>
  );
};

// Sub-components

const AdrCard: React.FC<{ adr: AdrRecord; isSelected: boolean; onClick: () => void }> = ({ adr, isSelected, onClick }) => {
   const statusStyles = {
      draft: 'bg-slate-700 text-slate-300 border-slate-600',
      proposed: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      accepted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
      deprecated: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
   };

   return (
      <div 
         onClick={onClick}
         className={`group relative flex items-center p-5 bg-slate-800/40 border rounded-2xl cursor-pointer transition-all duration-300 hover:bg-slate-800 hover:-translate-y-1 shadow-sm hover:shadow-xl ${
            isSelected ? 'border-indigo-500 bg-slate-800' : 'border-slate-700/50 hover:border-slate-600'
         }`}
      >
         {/* Status Sidebar Stripe */}
         <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r transition-colors ${
            adr.status === 'accepted' ? 'bg-emerald-500' : 
            adr.status === 'proposed' ? 'bg-amber-500' :
            adr.status === 'rejected' ? 'bg-red-500' :
            adr.status === 'deprecated' ? 'bg-orange-500' :
            'bg-slate-600'
         }`} />

         <div className="flex-1 flex items-center min-w-0 px-4">
            <div className="w-20 shrink-0 font-mono text-xs font-bold text-slate-500 group-hover:text-indigo-400 transition-colors">
               {adr.id}
            </div>
            <div className="min-w-0 flex-1 pr-6">
               <h3 className={`text-sm font-bold truncate transition-colors ${isSelected ? 'text-indigo-300' : 'text-slate-200 group-hover:text-white'}`}>
                  {adr.title}
               </h3>
               <div className="flex items-center text-[10px] text-slate-500 font-mono mt-0.5 space-x-3">
                  <span className="uppercase">{adr.category}</span>
                  <span>•</span>
                  <span>BY {adr.author.toUpperCase()}</span>
               </div>
            </div>
         </div>

         <div className="flex items-center space-x-6 shrink-0">
            <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${statusStyles[adr.status]}`}>
               {adr.status}
            </div>
            <div className="text-[10px] font-mono text-slate-600 w-24 text-right">
               {adr.date}
            </div>
            <ChevronRightIcon size={16} className="text-slate-700 group-hover:text-slate-400 transition-colors" />
         </div>
      </div>
   );
};

const AdrDetailDrawer: React.FC<{ adr: AdrRecord; onClose: () => void; onSupersede: (id: string) => void }> = ({ adr, onClose, onSupersede }) => {
   return (
      <div className="fixed inset-0 z-[60] flex items-center justify-end font-sans pointer-events-none" role="dialog">
         <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto" onClick={onClose} />
         <div className="relative h-full w-[650px] bg-[#0f172a] shadow-2xl border-l border-slate-800 transition-all duration-300 ease-in-out pointer-events-auto flex flex-col animate-in slide-in-from-right-full">
            
            <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 bg-slate-900/50 backdrop-blur">
               <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-indigo-400">
                     <HistoryIcon size={20} />
                  </div>
                  <div>
                     <h3 className="font-bold text-white leading-tight uppercase tracking-wider">{adr.id}</h3>
                     <span className="text-[10px] text-slate-500 font-mono uppercase">Versioned Document</span>
                  </div>
               </div>
               <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <XIcon size={24} />
               </button>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
               {/* Decision Header */}
               <section className="space-y-4">
                  <div className="flex items-center space-x-3">
                     <h1 className="text-2xl font-bold text-white tracking-tight">{adr.title}</h1>
                  </div>
                  <div className="flex flex-wrap gap-4 items-center">
                     <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <UserIcon size={14} className="text-slate-600" />
                        <span>Author: <strong className="text-slate-200">{adr.author}</strong></span>
                     </div>
                     <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <ClockIcon size={14} className="text-slate-600" />
                        <span>Created: <strong className="text-slate-200">{adr.date}</strong></span>
                     </div>
                     <Badge variant={adr.status === 'accepted' ? 'success' : 'warning'}>{adr.status.toUpperCase()}</Badge>
                  </div>
               </section>

               {/* Standard Sections */}
               <DetailSection title="Context" icon={<HelpCircleIcon size={14}/>}>
                  <p className="text-sm text-slate-400 leading-relaxed">{adr.context}</p>
               </DetailSection>

               <DetailSection title="Decision" icon={<CheckCircleIcon size={14}/>} highlight>
                  <p className="text-sm text-white font-medium leading-relaxed">{adr.decision}</p>
               </DetailSection>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <DetailSection title="Consequences (+)" icon={<ArrowRightIcon size={14} className="text-emerald-500"/>}>
                     <ul className="space-y-2">
                        {adr.consequences.positive.map((c, i) => (
                           <li key={i} className="text-xs text-emerald-400/80 flex items-start">
                              <span className="mr-2 opacity-50">+</span> {c}
                           </li>
                        ))}
                     </ul>
                  </DetailSection>
                  <DetailSection title="Consequences (-)" icon={<ArrowRightIcon size={14} className="text-red-500 rotate-180"/>}>
                     <ul className="space-y-2">
                        {adr.consequences.negative.map((c, i) => (
                           <li key={i} className="text-xs text-red-400/80 flex items-start">
                              <span className="mr-2 opacity-50">-</span> {c}
                           </li>
                        ))}
                     </ul>
                  </DetailSection>
               </div>

               {/* Meta Context */}
               {(adr.supersedes || adr.supersededBy || adr.implementationUrl) && (
                  <section className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
                     <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Linked Resources</h4>
                     <div className="space-y-3">
                        {adr.supersededBy && (
                           <div className="flex items-center justify-between p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                              <div className="flex items-center text-xs text-amber-500 font-bold">
                                 <AlertTriangleIcon size={14} className="mr-2" />
                                 SUPERSEDED BY {adr.supersededBy}
                              </div>
                              <button className="text-[10px] font-bold text-slate-400 hover:text-white underline">VIEW NEW ADR</button>
                           </div>
                        )}
                        {adr.implementationUrl && (
                           <a href={adr.implementationUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-slate-850 border border-slate-700 rounded-xl hover:border-indigo-500/30 group transition-all">
                              <div className="flex items-center text-xs text-slate-300">
                                 <CodeIconProxy size={14} className="mr-2 text-slate-500 group-hover:text-indigo-400" />
                                 Implementation Source
                              </div>
                              <ExternalLinkIcon size={12} className="text-slate-600 group-hover:text-white" />
                           </a>
                        )}
                     </div>
                  </section>
               )}

               {/* Voting Panel */}
               <section className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                     <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Consensus Tracking</h4>
                     <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-emerald-500 font-bold uppercase">Consensus Reached</span>
                        <CheckCircleIcon size={12} className="text-emerald-500" />
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     {adr.reviewers.map(reviewer => (
                        <div key={reviewer.id} className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl">
                           <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold">
                                 {reviewer.name[0]}
                              </div>
                              <span className="text-xs font-bold text-slate-300">{reviewer.name}</span>
                           </div>
                           <div className={`p-1 rounded-md border ${
                              reviewer.vote === 'yes' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                              reviewer.vote === 'no' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                              'bg-slate-800 border-slate-700 text-slate-600'
                           }`}>
                              {reviewer.vote === 'yes' ? <CheckCircleIcon size={12}/> : 
                               reviewer.vote === 'no' ? <XCircleIcon size={12}/> : 
                               <ClockIcon size={12}/>}
                           </div>
                        </div>
                     ))}
                  </div>
               </section>
            </div>

            <footer className="h-20 border-t border-slate-800 bg-slate-950/50 px-8 flex items-center justify-between shrink-0">
               <div className="flex items-center text-[10px] text-slate-600 font-mono">
                  MD5_SUM: {btoa(adr.id).slice(0, 12).toLowerCase()}
               </div>
               
               <div className="flex items-center space-x-3">
                  <Button variant="ghost" onClick={onClose}>Close Detail</Button>
                  {(adr.status === 'accepted' || adr.status === 'rejected') && (
                     <Button 
                        variant="primary" 
                        onClick={() => onSupersede(adr.id)}
                        icon={<RotateCwIcon size={16}/>}
                        className="bg-amber-600 hover:bg-amber-500 border-amber-500/20"
                     >
                        Draft Superseding ADR
                     </Button>
                  )}
               </div>
            </footer>

         </div>
      </div>
   );
};

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode; color?: string }> = ({ label, value, icon, color = 'text-white' }) => (
   <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex flex-col hover:border-slate-600 transition-all group">
      <div className="flex items-center text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 group-hover:text-slate-400">
         <span className="mr-2 opacity-70">{icon}</span>
         {label}
      </div>
      <div className={`text-2xl font-bold tracking-tight ${color}`}>{value}</div>
   </div>
);

const DetailSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; highlight?: boolean }> = ({ title, icon, children, highlight }) => (
   <section className="space-y-3">
      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
         <span className="mr-2 text-indigo-400 opacity-70">{icon}</span>
         {title}
      </h4>
      <div className={`p-4 rounded-xl border transition-all ${highlight ? 'bg-indigo-900/10 border-indigo-500/30' : 'bg-slate-900 border-slate-800'}`}>
         {children}
      </div>
   </section>
);

const ActivityIconProxy: React.FC<any> = (props) => (
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
     <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
   </svg>
);

const CodeIconProxy: React.FC<any> = (props) => (
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
     <polyline points="16 18 22 12 16 6" />
     <polyline points="8 6 2 12 8 18" />
   </svg>
);

export default DecisionLog;