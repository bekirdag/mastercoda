
import React, { useState, useEffect } from 'react';
import { AgentPersona, FleetActivity, AgentStatus } from '../types';
import { MOCK_AGENTS, MOCK_FLEET_ACTIVITY } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  SparklesIcon, 
  ActivityIcon, 
  RotateCwIcon, 
  TerminalIcon, 
  ShieldIcon, 
  ActivityIcon as PulseIcon,
  ChevronRightIcon,
  SearchIcon,
  PlusIcon,
  PauseIcon,
  PlayIcon,
  SettingsIcon,
  MessageSquareIcon,
  AlertTriangleIcon,
  HardDriveIcon,
  CloudIcon,
  ZapIcon,
  CrownIcon,
  ClockIcon
} from './Icons';

const AgentFleet: React.FC = () => {
  const [agents, setAgents] = useState<AgentPersona[]>(MOCK_AGENTS);
  const [activities, setActivities] = useState<FleetActivity[]>(MOCK_FLEET_ACTIVITY);
  const [searchQuery, setSearchQuery] = useState('');

  // Simulation: Add random activities
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        const newAct: FleetActivity = {
          id: `act-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour12: false }),
          agentName: randomAgent.name,
          message: ['syncing local state...', 'analyzing test coverage', 'waiting for API response', 'task completed successfully'][Math.floor(Math.random() * 4)],
          type: Math.random() > 0.9 ? 'warn' : 'info'
        };
        setActivities(prev => [newAct, ...prev].slice(0, 50));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [agents]);

  const stats = {
    active: agents.filter(a => a.status === 'online' || a.status === 'rate-limited').length,
    total: agents.length,
    pendingTasks: 12,
    tokenVelocity: 450,
    costRate: 0.42
  };

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-500 pb-32 font-sans bg-[#0f172a]">
      
      {/* 1. Fleet Metrics HUD (EX-01 Header Section) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <HudCard 
           label="Active Agents" 
           value={`${stats.active} / ${stats.total}`} 
           sub="Agents Online" 
           icon={<ActivityIcon size={20} className="text-emerald-400" />} 
         />
         <HudCard 
           label="Workforce Load" 
           value={`${stats.pendingTasks} Tasks`} 
           sub="Across current project" 
           icon={<ShieldIcon size={20} className="text-blue-400" />} 
         />
         <HudCard 
           label="Token Velocity" 
           value={`${stats.tokenVelocity}`} 
           sub="tokens / minute" 
           icon={<ZapIcon size={20} className="text-amber-400" />} 
           renderVisual={<VelocityGauge value={stats.tokenVelocity} />}
         />
         <HudCard 
           label="Cost Run-rate" 
           value={`$${stats.costRate}`} 
           sub="per hour (Est.)" 
           icon={<CloudIcon size={20} className="text-indigo-400" />} 
         />
      </section>

      {/* 2. Roster Grid (AG-01 Main Body) */}
      <section className="space-y-6">
         <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-4">
               <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center">
                  <PulseIcon size={16} className="mr-2 text-indigo-400" />
                  Active Project Fleet
               </h2>
               <div className="relative group">
                  <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400" />
                  <input 
                    type="text" 
                    placeholder="Filter fleet..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-md py-1 pl-9 pr-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 w-48 transition-all"
                  />
               </div>
            </div>
            <div className="flex items-center space-x-3">
               <Button variant="secondary" size="sm" icon={<RotateCwIcon size={14} />}>Sync Roster</Button>
               <Button variant="primary" size="sm" icon={<PlusIcon size={14} />} onClick={() => { const evt = new CustomEvent('app-navigate', { detail: '/agents' }); window.dispatchEvent(evt); }}>Provision Agent</Button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAgents.map(agent => (
               <AgentCard key={agent.id} agent={agent} />
            ))}
            {filteredAgents.length === 0 && (
               <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-3xl">
                  <SparklesIcon size={48} className="mb-4 opacity-10" />
                  <p className="text-lg font-medium uppercase tracking-widest">No agents deployed matching criteria</p>
               </div>
            )}
         </div>
      </section>

      {/* 3. Live Activity Feed (AG-01 Lower Section) */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[400px]">
         <header className="h-12 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center space-x-4">
               <TerminalIcon size={16} className="text-slate-400" />
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Fleet Activity Feed</h3>
            </div>
            <div className="flex items-center space-x-2">
               <span className="text-[10px] font-mono text-slate-600 uppercase tracking-tighter">WS_SECURE_CHANNEL: OK</span>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
         </header>
         <div className="flex-1 overflow-y-auto custom-scrollbar p-6 font-mono text-xs space-y-1.5 bg-[#0a0f1e]">
            {activities.map(act => (
               <div key={act.id} className="flex items-start animate-in fade-in slide-in-from-left-2 duration-300 group">
                  <span className="text-slate-700 mr-4 shrink-0">[{act.timestamp}]</span>
                  <span className={`font-bold mr-3 shrink-0 ${
                    act.agentName === 'Grace' ? 'text-purple-400' :
                    act.agentName === 'Logic Synth' ? 'text-emerald-400' :
                    act.agentName === 'Architect Prime' ? 'text-indigo-400' :
                    'text-blue-400'
                  }`}>{act.agentName.toUpperCase()}:</span>
                  <span className={`break-all ${
                    act.type === 'error' ? 'text-red-400' :
                    act.type === 'warn' ? 'text-amber-400' :
                    act.type === 'success' ? 'text-emerald-400' :
                    'text-slate-300'
                  }`}>{act.message}</span>
               </div>
            ))}
            <div className="pt-2 animate-pulse text-indigo-500/50">_</div>
         </div>
      </section>

    </div>
  );
};

// Sub-components

const HudCard: React.FC<{ label: string; value: string; sub: string; icon: React.ReactNode; renderVisual?: React.ReactNode }> = ({ label, value, sub, icon, renderVisual }) => (
   <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-slate-600 transition-all">
      <div className="flex items-center justify-between mb-4">
         <div className="flex items-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            <span className="mr-2 opacity-70 group-hover:scale-110 transition-transform">{icon}</span>
            {label}
         </div>
         {renderVisual}
      </div>
      <div className="text-3xl font-bold text-white tracking-tight mb-1">{value}</div>
      <div className="text-[10px] text-slate-500 uppercase font-mono">{sub}</div>
   </div>
);

const VelocityGauge: React.FC<{ value: number }> = ({ value }) => (
   <div className="w-12 h-6 relative overflow-hidden">
      <svg viewBox="0 0 100 50" className="w-full h-full">
         <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1e293b" strokeWidth="10" />
         <path 
           d="M 10 50 A 40 40 0 0 1 90 50" 
           fill="none" 
           stroke="#fbbf24" 
           strokeWidth="10" 
           strokeDasharray="126" 
           strokeDashoffset={126 - (126 * Math.min(100, (value / 600) * 100)) / 100}
           className="transition-all duration-1000 ease-out"
         />
      </svg>
   </div>
);

const AgentCard: React.FC<{ agent: AgentPersona }> = ({ agent }) => {
   const isOnline = agent.status === 'online' || agent.status === 'idle' || agent.status === 'rate-limited';
   const isError = agent.status === 'error';
   const isRateLimited = agent.status === 'rate-limited';

   const handleDetails = () => {
      // Deep link to AG-02
      console.log(`Opening detail for ${agent.id}`);
   };

   return (
      <div className={`group relative flex flex-col bg-slate-900 border rounded-3xl p-6 transition-all duration-500 hover:shadow-2xl overflow-hidden ${
        isError ? 'border-red-500/30 bg-red-950/5' : 
        isRateLimited ? 'border-blue-500/30' :
        'border-slate-800 hover:border-indigo-500/50'
      }`}>
         {/* Thinking Pulse Glow */}
         {agent.status === 'online' && (
            <div className="absolute top-0 right-0 p-6">
               <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_15px_#6366f1] animate-pulse" />
            </div>
         )}

         {/* Header */}
         <div className="flex items-start space-x-4 mb-6">
            <div className="relative">
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg border transition-transform duration-500 group-hover:scale-105 bg-${agent.avatarColor}-500/10 border-${agent.avatarColor}-500/20`}>
                  {agent.isPrimary ? <CrownIcon size={24} className={`text-${agent.avatarColor}-400`} /> : <SparklesIcon size={24} className={`text-${agent.avatarColor}-400`} />}
               </div>
               <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-slate-900 ${
                  agent.status === 'online' ? 'bg-emerald-500' :
                  agent.status === 'idle' ? 'bg-amber-500' :
                  agent.status === 'error' ? 'bg-red-500 animate-pulse' :
                  'bg-slate-600'
               }`} />
            </div>
            
            <div className="min-w-0 flex-1">
               <h3 className="text-lg font-bold text-white truncate group-hover:text-indigo-200 transition-colors">{agent.name}</h3>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">{agent.role}</p>
               <div className="flex items-center mt-2 space-x-2">
                  <Badge variant="neutral">{agent.model}</Badge>
                  {agent.isPrimary && <span className="text-[9px] font-bold text-indigo-400 bg-indigo-400/5 px-1.5 py-0.5 rounded border border-indigo-400/10">LEAD</span>}
               </div>
            </div>
         </div>

         {/* Activity & Progress */}
         <div className="space-y-4 flex-1">
            <div className="space-y-2">
               <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                  <span>Current Activity</span>
                  {agent.progress !== undefined && <span className="text-indigo-400 font-mono">{agent.progress}%</span>}
               </div>
               <p className={`text-xs leading-relaxed min-h-[32px] ${isError ? 'text-red-400' : 'text-slate-300'}`}>
                  {agent.currentActivity}
               </p>
               {agent.progress !== undefined && (
                  <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                     <div 
                        className={`h-full transition-all duration-1000 ${isError ? 'bg-red-500' : 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]'}`} 
                        style={{ width: `${agent.progress}%` }} 
                     />
                  </div>
               )}
            </div>

            {/* Vital Signs Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
               <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800">
                  <div className="flex items-center text-[9px] font-bold text-slate-500 uppercase mb-1">
                     <HardDriveIcon size={10} className="mr-1 text-indigo-400" /> Memory
                  </div>
                  <div className="flex items-center justify-between">
                     <span className={`text-[10px] font-mono font-bold ${agent.memoryUsage && agent.memoryUsage > 80 ? 'text-amber-400' : 'text-slate-300'}`}>{agent.memoryUsage}% full</span>
                     {agent.memoryUsage && agent.memoryUsage > 80 && <AlertTriangleIcon size={10} className="text-amber-400" />}
                  </div>
               </div>
               <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800">
                  <div className="flex items-center text-[9px] font-bold text-slate-500 uppercase mb-1">
                     <ShieldIcon size={10} className="mr-1 text-emerald-400" /> Tool Access
                  </div>
                  <div className="flex -space-x-1">
                     {agent.capabilities.slice(0, 3).map(c => (
                        <div key={c.id} className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center" title={c.label}>
                           <ActivityIcon size={8} className="text-slate-400" />
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* Actions Bar */}
         <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex space-x-2">
               <ActionButton icon={<MessageSquareIcon size={14} />} title="Direct Chat" />
               <ActionButton icon={<TerminalIcon size={14} />} title="View Thoughts" />
               <ActionButton icon={<SettingsIcon size={14} />} title="Provisioning" />
            </div>

            <div className="flex items-center space-x-2">
               {isError ? (
                  <Button variant="primary" size="sm" className="bg-red-600 hover:bg-red-500 border-none text-[10px] h-7 px-3">System Restart</Button>
               ) : (
                  <button className={`p-1.5 rounded-lg transition-all ${agent.status === 'idle' ? 'text-slate-600' : 'text-amber-500 hover:bg-amber-500/10'}`} title="Pause Agent">
                     <PauseIcon size={18} fill="currentColor" />
                  </button>
               )}
               <button 
                  onClick={handleDetails}
                  className="p-1.5 text-slate-500 hover:text-white transition-colors"
               >
                  <ChevronRightIcon size={20} />
               </button>
            </div>
         </div>

         {/* Throttled Overlay */}
         {isRateLimited && (
            <div className="absolute inset-0 z-10 bg-indigo-950/20 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
               <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 mb-3 border border-blue-500/30">
                  <ClockIcon size={24} />
               </div>
               <h4 className="text-sm font-bold text-blue-200 uppercase tracking-widest mb-1">Throttling Protocol</h4>
               <p className="text-[10px] text-blue-400/80 font-mono">PROVIDER_429: RESUMING IN 42S</p>
               <button className="mt-4 text-[10px] font-bold text-white uppercase tracking-widest px-3 py-1 bg-blue-600 rounded-md hover:bg-blue-500">Retry Manual</button>
            </div>
         )}
      </div>
   );
};

const ActionButton: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
   <button 
      className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/5 rounded-lg transition-all" 
      title={title}
   >
      {icon}
   </button>
);

export default AgentFleet;
