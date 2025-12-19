
import React, { useState, useMemo } from 'react';
import { Mission, MissionStatus } from '../types';
import { MOCK_MISSIONS, MOCK_AGENTS } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  PlusIcon, 
  ActivityIcon, 
  RotateCwIcon, 
  TerminalIcon, 
  ShieldIcon, 
  ClockIcon, 
  SparklesIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  AlertTriangleIcon, 
  SearchIcon, 
  FilterIcon, 
  ChevronDownIcon, 
  ChevronRightIcon, 
  XIcon,
  ZapIcon,
  LockIcon,
  CodeIcon,
  TrashIcon,
  /* Fix: Added missing icon imports to resolve errors on lines 114, 163, 189, and 192 */
  MoreVerticalIcon,
  UserIcon,
  FileTextIcon,
  ArrowRightIcon
} from './Icons';

const COLUMN_CONFIG = [
  { id: 'queued', title: 'Queued', color: 'border-slate-500' },
  { id: 'in-progress', title: 'Executing', color: 'border-indigo-500' },
  { id: 'blocked', title: 'Intervention', color: 'border-red-500' },
  { id: 'archive', title: 'Archive', color: 'border-emerald-500' }
];

const MissionControl: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>(MOCK_MISSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);

  const filteredMissions = useMemo(() => {
    return missions.filter(m => 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [missions, searchQuery]);

  const selectedMission = useMemo(() => missions.find(m => m.id === selectedMissionId), [missions, selectedMissionId]);

  const getMissionsByStatus = (statusId: string) => {
    if (statusId === 'archive') {
      return filteredMissions.filter(m => m.status === 'completed' || m.status === 'failed');
    }
    return filteredMissions.filter(m => m.status === statusId);
  };

  const handleApprove = (id: string) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, status: 'in-progress' as MissionStatus, blockerReason: undefined } : m));
  };

  const handleCancel = (id: string) => {
    setMissions(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Header & Metrics HUD */}
      <header className="shrink-0 p-6 border-b border-slate-800 bg-slate-900/50">
         <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
               <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
                     <ActivityIcon className="mr-3 text-amber-500" size={24} />
                     Mission Control
                  </h1>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-mono mt-1">Job_Queue_v4.2 • Node: mcoda-local-01</p>
               </div>
               <div className="flex items-center space-x-3">
                  <div className="relative group">
                     <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400" />
                     <input 
                        type="text" 
                        placeholder="Search mission ID or agent..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 outline-none w-64 transition-all"
                     />
                  </div>
                  <Button variant="secondary" size="sm" icon={<RotateCwIcon size={14} />}>Purge Queue</Button>
                  <Button variant="primary" size="sm" icon={<PlusIcon size={14} />}>New Mission</Button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <HudStat label="Pending Missions" value={missions.filter(m => m.status === 'queued').length.toString()} icon={<ClockIcon size={14} />} color="indigo" />
               <HudStat label="Active Execution" value={missions.filter(m => m.status === 'in-progress').length.toString()} icon={<ZapIcon size={14} />} color="emerald" />
               <HudStat label="Success Rate (24h)" value="92%" icon={<CheckCircleIcon size={14} />} color="blue" />
               <HudStat label="Token Consumption" value="1.2M" sub="Budget: 5M" icon={<SparklesIcon size={14} />} color="amber" />
            </div>
         </div>
      </header>

      {/* 2. Main Kanban Board */}
      <main className="flex-1 flex overflow-x-auto custom-scrollbar bg-[#0d1117] p-6 gap-6 select-none">
         {COLUMN_CONFIG.map(col => (
            <div key={col.id} className="flex-1 min-w-[320px] flex flex-col h-full bg-slate-900/40 rounded-3xl border border-slate-800/50 shadow-inner">
               <header className={`px-6 py-4 border-b-2 ${col.color} flex items-center justify-between sticky top-0 bg-slate-900/60 backdrop-blur rounded-t-3xl z-10`}>
                  <div className="flex items-center space-x-3">
                     <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest">{col.title}</h2>
                     <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded-full">{getMissionsByStatus(col.id).length}</span>
                  </div>
                  <MoreVerticalIcon size={14} className="text-slate-600 hover:text-slate-400 cursor-pointer" />
               </header>

               <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                  {getMissionsByStatus(col.id).map(mission => (
                     <MissionCard 
                        key={mission.id} 
                        mission={mission} 
                        onClick={() => setSelectedMissionId(mission.id)}
                        onApprove={() => handleApprove(mission.id)}
                        onReject={() => handleCancel(mission.id)}
                     />
                  ))}
                  {getMissionsByStatus(col.id).length === 0 && (
                     <div className="h-24 rounded-2xl border-2 border-dashed border-slate-800/50 flex items-center justify-center text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                        Queue Empty
                     </div>
                  )}
               </div>
            </div>
         ))}
      </main>

      {/* 3. Detail Drawer */}
      {selectedMission && (
         <div className="fixed inset-y-0 right-0 w-[500px] bg-slate-900 border-l border-slate-700 shadow-[-20px_0_60px_rgba(0,0,0,0.5)] z-50 animate-in slide-in-from-right-full duration-300 flex flex-col">
            <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 bg-slate-950/50 backdrop-blur">
               <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-xl border ${selectedMission.status === 'failed' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
                     <TerminalIcon size={20} />
                  </div>
                  <div>
                     <h3 className="font-bold text-white text-sm uppercase tracking-widest">Mission Audit</h3>
                     <span className="text-[10px] font-mono text-slate-500 uppercase">{selectedMission.id}</span>
                  </div>
               </div>
               <button onClick={() => setSelectedMissionId(null)} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <XIcon size={24} />
               </button>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
               <section className="space-y-4">
                  <h1 className="text-2xl font-bold text-white leading-tight">{selectedMission.title}</h1>
                  <div className="flex flex-wrap gap-4">
                     <Badge variant={selectedMission.status === 'completed' ? 'success' : selectedMission.status === 'failed' ? 'error' : 'info'}>
                        {selectedMission.status.toUpperCase()}
                     </Badge>
                     <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <UserIcon size={12} className="text-indigo-400" />
                        <span>Agent: {selectedMission.agentName}</span>
                     </div>
                  </div>
               </section>

               <section className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                     <CodeIcon size={14} className="mr-2 text-indigo-400" />
                     Execution Prompt
                  </h4>
                  <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-xs text-indigo-300 leading-relaxed shadow-inner">
                     {selectedMission.prompt || "No explicit prompt recorded for this background task."}
                  </div>
               </section>

               {selectedMission.artifacts && selectedMission.artifacts.length > 0 && (
                  <section className="space-y-4">
                     <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                        <PlusIcon size={14} className="mr-2 text-indigo-400" />
                        Generated Artifacts
                     </h4>
                     <div className="space-y-2">
                        {selectedMission.artifacts.map(art => (
                           <div key={art.path} className="flex items-center justify-between p-3 bg-slate-800/40 border border-slate-700 rounded-xl group hover:border-indigo-500/30 transition-all cursor-pointer">
                              <div className="flex items-center space-x-3">
                                 <FileTextIcon size={14} className="text-slate-500 group-hover:text-indigo-400" />
                                 <span className="text-xs font-bold text-slate-300">{art.name}</span>
                              </div>
                              <ArrowRightIcon size={14} className="text-slate-700 group-hover:text-white" />
                           </div>
                        ))}
                     </div>
                  </section>
               )}

               <section className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                     <div className="text-[9px] font-bold text-slate-600 uppercase mb-1">Resource Cost</div>
                     <div className="text-lg font-bold text-emerald-400 font-mono">${selectedMission.cost?.toFixed(4) || '0.00'}</div>
                  </div>
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                     <div className="text-[9px] font-bold text-slate-600 uppercase mb-1">Duration</div>
                     <div className="text-lg font-bold text-white font-mono">{selectedMission.duration || 'Running...'}</div>
                  </div>
               </section>
               
               <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
                  <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-tighter flex items-center group">
                     View Complete Reasoning Trace <ChevronRightIcon size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>

            <footer className="p-8 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between shrink-0">
               <Button variant="secondary" onClick={() => handleCancel(selectedMission.id)} icon={<TrashIcon size={14}/>}>Cancel Job</Button>
               <Button variant="primary" onClick={() => setSelectedMissionId(null)}>Close Detail</Button>
            </footer>
         </div>
      )}

      {/* 4. Global Footer Status */}
      <footer className="h-10 bg-slate-900 border-t border-slate-800 shrink-0 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-30">
         <div className="flex items-center space-x-12">
            <div className="flex items-center">
               <RotateCwIcon size={12} className="mr-2 text-indigo-400" />
               SCHEDULER_STATUS: <span className="ml-2 text-emerald-500 uppercase">Operational</span>
            </div>
            <div className="flex items-center">
               <ShieldIcon size={12} className="mr-2 text-indigo-400" />
               WORKER_UTIL: <span className="ml-2 text-slate-300">4 / 16 THREADS</span>
            </div>
         </div>
         <div className="flex items-center space-x-4">
            <span className="text-slate-700 font-mono uppercase">Node_ID: local_alpha_01</span>
            <div className="h-3 w-px bg-slate-800" />
            <button className="text-indigo-400 hover:text-indigo-300">Queue Settings &rsaquo;</button>
         </div>
      </footer>
    </div>
  );
};

// Sub-components

const HudStat: React.FC<{ label: string; value: string; sub?: string; icon: React.ReactNode; color: string }> = ({ label, value, sub, icon, color }) => (
   <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl flex flex-col group hover:border-slate-600 transition-all">
      <div className="flex items-center text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 group-hover:text-slate-400">
         <span className={`mr-2 text-${color}-400`}>{icon}</span>
         {label}
      </div>
      <div className="flex items-baseline space-x-3">
         <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
         {sub && <span className="text-[10px] font-mono text-slate-600 uppercase">{sub}</span>}
      </div>
   </div>
);

const MissionCard: React.FC<{ 
  mission: Mission; 
  onClick: () => void; 
  onApprove: () => void; 
  onReject: () => void; 
}> = ({ mission, onClick, onApprove, onReject }) => {
   const isBlocked = mission.status === 'blocked';
   const isExecuting = mission.status === 'in-progress';

   return (
      <div 
         onClick={onClick}
         className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col cursor-pointer group hover:-translate-y-1 hover:shadow-xl ${
            isBlocked ? 'bg-red-950/10 border-red-500/20 hover:border-red-500/40' :
            isExecuting ? 'bg-indigo-600/5 border-indigo-500/20 hover:border-indigo-500/50 ring-1 ring-indigo-500/10' :
            'bg-slate-800/40 border-slate-700 hover:border-slate-500'
         }`}
      >
         <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2 text-[10px] font-mono font-bold text-slate-600 group-hover:text-indigo-400 transition-colors">
               <span>{mission.id}</span>
               <span className="opacity-30">/</span>
               <span className="uppercase">{mission.agentName}</span>
            </div>
            <div className="flex items-center">
               <MissionPriorityTag priority={mission.priority} />
            </div>
         </div>

         <h3 className={`text-sm font-bold leading-snug mb-3 line-clamp-2 transition-colors ${isExecuting ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
            {mission.title}
         </h3>

         <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center space-x-3 text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
               <span className="flex items-center"><ActivityIcon size={12} className="mr-1 text-slate-600" /> {mission.trigger}</span>
            </div>
            {isExecuting && (
               <div className="relative w-8 h-8 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                     <circle cx="16" cy="16" r="14" fill="none" stroke="#1e293b" strokeWidth="3" />
                     <circle 
                        cx="16" cy="16" r="14" fill="none" stroke="#6366f1" strokeWidth="3" 
                        strokeDasharray="88" strokeDashoffset={88 - (88 * mission.progress) / 100} 
                        className="transition-all duration-1000"
                     />
                  </svg>
                  <span className="text-[8px] font-mono text-white font-bold">{mission.progress}%</span>
               </div>
            )}
            {mission.status === 'completed' && <CheckCircleIcon size={18} className="text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />}
            {mission.status === 'failed' && <XCircleIcon size={18} className="text-red-500" />}
         </div>

         {isBlocked && (
            <div className="mt-4 pt-4 border-t border-red-500/10 space-y-3">
               <div className="flex items-start space-x-2 text-[10px] text-red-400 font-medium leading-relaxed italic">
                  <AlertTriangleIcon size={14} className="shrink-0 animate-pulse" />
                  <span>{mission.blockerReason}</span>
               </div>
               <div className="grid grid-cols-2 gap-2" onClick={e => e.stopPropagation()}>
                  <button 
                     onClick={onApprove}
                     className="py-1.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 transition-all"
                  >Approve</button>
                  <button 
                     onClick={onReject}
                     className="py-1.5 rounded-lg bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-white hover:bg-red-600 transition-all"
                  >Reject</button>
               </div>
            </div>
         )}
      </div>
   );
};

const MissionPriorityTag: React.FC<{ priority: string }> = ({ priority }) => {
   const colors = {
      low: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
      medium: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      high: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      urgent: 'text-red-400 bg-red-500/10 border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]'
   };
   return (
      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest border ${colors[priority as keyof typeof colors]}`}>
         {priority}
      </span>
   );
};

export default MissionControl;
