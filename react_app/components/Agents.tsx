
import React, { useState } from 'react';
import { AgentPersona, AgentStatus } from '../types';
import { MOCK_AGENTS } from '../constants';
import Button from './Button';
import { 
  SparklesIcon, 
  SearchIcon, 
  PlusIcon, 
  SettingsIcon, 
  ChevronRightIcon, 
  ZapIcon, 
  ShieldIcon, 
  TerminalIcon, 
  HardDriveIcon,
  ActivityIcon,
  RotateCwIcon,
  CrownIcon,
  LockIcon,
  CpuIcon,
  CloudIcon
} from './Icons';

const Agents: React.FC = () => {
  const [agents, setAgents] = useState<AgentPersona[]>(MOCK_AGENTS);
  const [activeAgentId, setActiveAgentId] = useState<string>(MOCK_AGENTS[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const activeAgent = agents.find(a => a.id === activeAgentId);

  const toggleCapability = (agentId: string, capId: string) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id !== agentId) return agent;
      return {
        ...agent,
        capabilities: agent.capabilities.map(cap => 
          cap.id === capId ? { ...cap, enabled: !cap.enabled } : cap
        )
      };
    }));
  };

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'online': return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
      case 'idle': return 'bg-amber-500';
      case 'offline': return 'bg-slate-600';
      case 'error': return 'bg-red-500 animate-pulse';
    }
  };

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full bg-slate-900 text-slate-200 overflow-hidden">
      
      {/* 1. Agent Directory */}
      <aside className="w-[320px] border-r border-slate-800 bg-slate-900 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Persona Directory</h2>
          <button className="p-1.5 hover:bg-slate-800 rounded text-indigo-400 transition-colors">
            <PlusIcon size={16} />
          </button>
        </div>

        <div className="p-4 border-b border-slate-800">
           <div className="relative">
              <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-md py-1.5 pl-9 pr-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
           {filteredAgents.map(agent => (
             <button
               key={agent.id}
               onClick={() => setActiveAgentId(agent.id)}
               className={`w-full flex items-center p-3 rounded-lg border transition-all text-left group ${
                 activeAgentId === agent.id 
                   ? 'bg-indigo-600/10 border-indigo-500/30' 
                   : 'bg-transparent border-transparent hover:bg-slate-800/50'
               }`}
             >
                <div className="relative shrink-0">
                  <div className={`w-10 h-10 rounded-full bg-${agent.avatarColor}-500/20 text-${agent.avatarColor}-400 flex items-center justify-center border border-${agent.avatarColor}-500/20`}>
                    {agent.isPrimary ? <CrownIcon size={18} /> : <SparklesIcon size={18} />}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${getStatusColor(agent.status)}`} />
                </div>

                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-sm font-bold truncate ${activeAgentId === agent.id ? 'text-white' : 'text-slate-300'}`}>
                      {agent.name}
                    </span>
                    {agent.isPrimary && <span className="text-[10px] text-indigo-400 font-mono font-bold">PRI</span>}
                  </div>
                  <p className="text-[10px] text-slate-500 truncate uppercase tracking-tighter">{agent.role}</p>
                </div>
                
                <ChevronRightIcon size={14} className={`ml-2 text-slate-600 group-hover:text-slate-400 transition-colors ${activeAgentId === agent.id ? 'opacity-100' : 'opacity-0'}`} />
             </button>
           ))}
        </div>
      </aside>

      {/* 2. Agent Stage */}
      <main className="flex-1 flex flex-col bg-[#0f172a] relative overflow-hidden">
        {activeAgent ? (
          <>
            {/* Header / Meta */}
            <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex items-center justify-between px-8 shrink-0 z-10">
               <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg bg-${activeAgent.avatarColor}-500/10 flex items-center justify-center mr-4 border border-${activeAgent.avatarColor}-500/20`}>
                     <SparklesIcon size={20} className={`text-${activeAgent.avatarColor}-400`} />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white tracking-tight">{activeAgent.name}</h1>
                    <div className="flex items-center space-x-3 text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">
                       <span className="flex items-center"><CloudIcon size={10} className="mr-1" /> {activeAgent.provider}</span>
                       <span className="text-slate-700">/</span>
                       <span className="text-indigo-400 font-bold">{activeAgent.model}</span>
                    </div>
                  </div>
               </div>
               
               <div className="flex items-center space-x-3">
                  <Button variant="secondary" size="sm" icon={<RotateCwIcon size={14} />}>Reset Memory</Button>
                  <Button variant="primary" size="sm" icon={<ZapIcon size={14} />}>Update Persona</Button>
               </div>
            </header>

            {/* Content Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
               <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                  
                  {/* Status & Quick Metrics Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <MetricCard icon={<CpuIcon size={16} />} label="Usage History" value={`${(activeAgent.metrics.tokensUsed / 1000).toFixed(1)}k tokens`} sub="Total session cost" />
                     <MetricCard icon={<HardDriveIcon size={16} />} label="Tasks Solved" value={activeAgent.metrics.tasksCompleted.toString()} sub="Completed this cycle" />
                     <MetricCard icon={<ActivityIcon size={16} />} label="Performance" value={activeAgent.metrics.avgLatency} sub="Avg Response Time" />
                  </div>

                  {/* System Prompt Editor */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Instructions</h3>
                       <span className="text-[10px] font-mono text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 bg-indigo-500/5">RAG_AWARE</span>
                    </div>
                    <div className="relative group">
                       <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                       <textarea 
                          className="relative w-full h-[320px] bg-slate-950 border border-slate-700 rounded-xl p-6 text-sm font-mono leading-relaxed text-slate-300 focus:outline-none focus:border-indigo-500 transition-all custom-scrollbar selection:bg-indigo-500/30"
                          defaultValue={activeAgent.systemPrompt}
                       />
                       <div className="absolute bottom-4 right-6 flex items-center space-x-3 text-[10px] text-slate-500 font-mono">
                          <span>Chars: {activeAgent.systemPrompt.length}</span>
                          <span>|</span>
                          <span className="text-emerald-500">Synchronized</span>
                       </div>
                    </div>
                  </div>

                  {/* Security Policy Header */}
                  <div className="pt-4 space-y-6">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-3">Agentic Guardrails</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {activeAgent.capabilities.map(cap => (
                         <div key={cap.id} className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:border-slate-600 transition-colors group">
                            <div className="flex items-center">
                               <div className={`p-2 rounded-lg mr-4 ${cap.enabled ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-700 text-slate-500'}`}>
                                  {cap.id === 'shell' ? <TerminalIcon size={18} /> : 
                                   cap.id === 'fs_write' ? <HardDriveIcon size={18} /> : 
                                   cap.id === 'search' ? <SearchIcon size={18} /> : 
                                   <ZapIcon size={18} />}
                               </div>
                               <div>
                                  <div className="text-sm font-bold text-white mb-0.5">{cap.label}</div>
                                  <div className="flex items-center text-[10px] text-slate-500 font-mono">
                                     <LockIcon size={10} className="mr-1" />
                                     LEVEL: <span className={`ml-1 font-bold ${cap.level === 'exec' ? 'text-red-400' : cap.level === 'write' ? 'text-amber-400' : 'text-emerald-400'}`}>{cap.level.toUpperCase()}</span>
                                  </div>
                               </div>
                            </div>
                            <button 
                              onClick={() => toggleCapability(activeAgent.id, cap.id)}
                              className={`w-12 h-6 rounded-full p-1 transition-all duration-300 relative ${cap.enabled ? 'bg-indigo-600' : 'bg-slate-700'}`}
                            >
                               <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${cap.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                         </div>
                       ))}
                    </div>
                  </div>

               </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-600">
             <SparklesIcon size={48} className="mb-4 opacity-10 animate-pulse" />
             <p>Select an agent to configure persona</p>
          </div>
        )}
      </main>

      {/* 3. Global Agent Settings */}
      <aside className="w-[300px] border-l border-slate-800 bg-slate-900 flex flex-col shrink-0">
         <div className="p-6 border-b border-slate-800">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Orchestration Settings</h3>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-bold flex justify-between">
                     CONCURRENT_AGENTS
                     <span className="text-indigo-400">4 / 10</span>
                  </label>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-500 w-2/5" />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-bold">DEFAULT_MODEL</label>
                  <select className="w-full bg-slate-950 border border-slate-700 rounded-md py-1.5 px-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 appearance-none">
                     <option>gemini-3-pro-preview</option>
                     <option>gemini-3-flash-preview</option>
                     <option>gpt-4o</option>
                  </select>
               </div>
            </div>
         </div>

         <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Security Logs</h3>
            <div className="space-y-3">
               <SecurityLogEntry time="10:45" msg="Audit Zero requested Terminal access" status="blocked" />
               <SecurityLogEntry time="10:42" msg="Architect Prime indexed 14 files" status="success" />
               <SecurityLogEntry time="10:30" msg="Logic Synth initialized Memory_Write" status="success" />
               <SecurityLogEntry time="09:15" msg="Auth failure on Google Vertex endpoint" status="error" />
            </div>
         </div>

         <div className="p-6 bg-indigo-900/10 border-t border-indigo-500/20">
            <div className="flex items-center text-indigo-400 text-xs font-bold mb-2">
               <ShieldIcon size={14} className="mr-2" />
               Local Enclave: ACTIVE
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
               All system prompts and capabilities are stored in your local encrypted storage. No persona data is synced to cloud providers.
            </p>
         </div>
      </aside>

    </div>
  );
};

const MetricCard: React.FC<{ icon: React.ReactNode, label: string, value: string, sub: string }> = ({ icon, label, value, sub }) => (
   <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:bg-slate-800/60 transition-colors">
      <div className="flex items-center text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">
         <span className="mr-2 text-indigo-400">{icon}</span>
         {label}
      </div>
      <div className="text-xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-[10px] text-slate-500">{sub}</div>
   </div>
);

const SecurityLogEntry: React.FC<{ time: string, msg: string, status: 'success' | 'blocked' | 'error' }> = ({ time, msg, status }) => (
   <div className="flex items-start space-x-2">
      <span className="text-[9px] font-mono text-slate-600 mt-0.5">{time}</span>
      <div className="flex-1 min-w-0">
         <div className="text-[11px] text-slate-400 truncate">{msg}</div>
         <div className={`text-[8px] font-bold uppercase ${status === 'success' ? 'text-emerald-500' : status === 'blocked' ? 'text-amber-500' : 'text-red-500'}`}>
            {status}
         </div>
      </div>
   </div>
);

export default Agents;
