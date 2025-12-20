
import React, { useState, useMemo } from 'react';
import { AgentPersona, MemoryItem, ToolUsageRecord, ThoughtStep } from '../types';
import { MOCK_AGENTS, MOCK_MEMORIES, MOCK_TOOL_LOGS, MOCK_THOUGHT_TRACE } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  SparklesIcon, 
  RotateCwIcon, 
  TrashIcon, 
  Edit2Icon, 
  MessageSquareIcon, 
  ChevronRightIcon, 
  ArrowRightIcon, 
  CheckCircleIcon, 
  ShieldIcon, 
  ActivityIcon, 
  ZapIcon, 
  ClockIcon, 
  SearchIcon, 
  PlusIcon, 
  TerminalIcon, 
  HardDriveIcon, 
  LockIcon, 
  GlobeIcon, 
  AlertTriangleIcon,
  XIcon,
  CrownIcon,
  /* Added for the prompt template view */
  CodeIcon,
  /* Fix: Added missing CloudIcon and BookOpenIcon imports to resolve compilation errors */
  CloudIcon,
  BookOpenIcon
} from './Icons';

interface AgentProfileProps {
  agentId: string;
  onBack: () => void;
}

type Tab = 'context' | 'knowledge' | 'tools' | 'logs';

const AgentProfile: React.FC<AgentProfileProps> = ({ agentId, onBack }) => {
  const [activeTab, setActiveTab] = useState<Tab>('context');
  const [memories, setMemories] = useState<MemoryItem[]>(MOCK_MEMORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [shreddingId, setShreddingId] = useState<string | null>(null);

  const agent = useMemo(() => MOCK_AGENTS.find(a => a.id === agentId) || MOCK_AGENTS[2], [agentId]);

  const filteredMemories = useMemo(() => {
    return memories.filter(m => m.fact.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                m.source.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [memories, searchQuery]);

  const handleDeleteMemory = (id: string) => {
    setShreddingId(id);
    setTimeout(() => {
      setMemories(prev => prev.filter(m => m.id !== id));
      setShreddingId(null);
    }, 500);
  };

  const contextUsage = 124000;
  const contextLimit = 200000;
  const contextPercentage = (contextUsage / contextLimit) * 100;
  const isContextCritical = contextPercentage > 90;

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Header Toolbar */}
      <header className="h-[64px] border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 flex items-center justify-between px-8 z-30 sticky top-0 shadow-lg">
         <div className="flex items-center space-x-6">
            <button onClick={onBack} className="p-2 text-slate-500 hover:text-white transition-colors">
               <ArrowRightIcon className="rotate-180" size={20} />
            </button>
            <div className="flex items-center">
               <div className={`w-10 h-10 rounded-xl bg-${agent.avatarColor}-500/10 flex items-center justify-center mr-4 border border-${agent.avatarColor}-500/20`}>
                  {agent.isPrimary ? <CrownIcon size={24} className={`text-${agent.avatarColor}-400`} /> : <SparklesIcon size={24} className={`text-${agent.avatarColor}-400`} />}
               </div>
               <div>
                  <h1 className="text-xl font-bold text-white tracking-tight leading-none">{agent.name}</h1>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{agent.role}</p>
               </div>
            </div>
         </div>

         <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm" icon={<MessageSquareIcon size={14} />}>Chat</Button>
            <Button variant="secondary" size="sm" icon={<RotateCwIcon size={14} />}>Reset Memory</Button>
            <Button variant="primary" size="sm" icon={<Edit2Icon size={14} />}>Edit Persona</Button>
         </div>
      </header>

      {/* 2. Main Content Split */}
      <div className="flex-1 flex flex-col overflow-hidden">
         
         {/* Hero Metadata Summary */}
         <section className="bg-slate-900/30 border-b border-slate-800 p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
               <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Base Model</span>
                  <div className="text-lg font-bold text-white flex items-center">
                     <CloudIcon size={16} className="mr-2 text-indigo-400" />
                     {agent.model}
                  </div>
               </div>
               <div className="md:col-span-2 space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Prompt Preview</span>
                  <p className="text-xs text-slate-400 leading-relaxed italic line-clamp-2">
                     "{agent.systemPrompt}"
                  </p>
               </div>
               <div className="flex flex-col items-end justify-center">
                  <div className={`flex items-center px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)]`}>
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                     Status: {agent.status}
                  </div>
               </div>
            </div>
         </section>

         {/* Tab Switcher */}
         <div className="flex border-b border-slate-800 bg-slate-900/50 px-8 shrink-0">
            <ProfileTab active={activeTab === 'context'} onClick={() => setActiveTab('context')} label="Context" icon={<ActivityIcon size={14} />} />
            <ProfileTab active={activeTab === 'knowledge'} onClick={() => setActiveTab('knowledge')} label="Knowledge" icon={<BookOpenIcon size={14} />} />
            <ProfileTab active={activeTab === 'tools'} onClick={() => setActiveTab('tools')} label="Tools" icon={<ShieldIcon size={14} />} />
            <ProfileTab active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} label="Trace Logs" icon={<TerminalIcon size={14} />} />
         </div>

         {/* Tab Content Area */}
         <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#0f172a]">
            <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-20">
               
               {activeTab === 'context' && (
                  <div className="space-y-10">
                     <section className="space-y-4">
                        <div className="flex items-center justify-between">
                           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Short-term Memory Usage</h3>
                           <span className={`text-xs font-mono font-bold ${isContextCritical ? 'text-red-400' : 'text-indigo-400'}`}>
                              {Math.round(contextUsage/1000)}k / {Math.round(contextLimit/1000)}k tokens
                           </span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                           <div 
                              className={`h-full transition-all duration-1000 ease-out ${isContextCritical ? 'bg-red-500 animate-pulse' : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'}`} 
                              style={{ width: `${contextPercentage}%` }} 
                           />
                        </div>
                        {isContextCritical && (
                           <div className="flex items-start p-3 bg-red-950/20 border border-red-500/20 rounded-xl text-red-400 text-[10px] uppercase font-bold animate-pulse">
                              <AlertTriangleIcon size={14} className="mr-2 shrink-0" />
                              Critical: Context window overflow likely. Consider clearing old messages or optimizing system prompt.
                           </div>
                        )}
                     </section>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <section className="space-y-4">
                           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                              <CodeIcon size={14} className="mr-2" /> Current Prompt Buffer
                           </h3>
                           <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 font-mono text-xs leading-relaxed text-indigo-300/80 shadow-inner max-h-[400px] overflow-y-auto custom-scrollbar">
                              <span className="text-slate-600"># SYSTEM:</span> {agent.systemPrompt}
                              {"\n\n"}<span className="text-slate-600"># USER:</span> Can you help me audit the src/auth/middleware.ts file? 
                              {"\n\n"}<span className="text-slate-600"># ATTACHED_FILES:</span> 
                              {"\n"}- src/auth/middleware.ts (245 lines)
                              {"\n"}- src/types.ts (56 lines)
                           </div>
                        </section>

                        <section className="space-y-4">
                           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                              <ActivityIcon size={14} className="mr-2" /> Recent Thread State
                           </h3>
                           <div className="space-y-3">
                              <ContextMessage role="user" text="Fix the cookie overflow bug." time="10m ago" />
                              <ContextMessage role="agent" text="Searching for cookie headers in middleware.ts..." time="9m ago" />
                              <ContextMessage role="user" text="Also check the session timeout." time="2m ago" />
                           </div>
                        </section>
                     </div>
                  </div>
               )}

               {activeTab === 'knowledge' && (
                  <div className="space-y-8">
                     <div className="flex items-center justify-between">
                        <div className="relative group flex-1 max-w-md">
                           <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={14} />
                           <input 
                              type="text" 
                              placeholder="Query agent's long-term memory..." 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                           />
                        </div>
                        <Button variant="primary" size="sm" icon={<PlusIcon size={14}/>}>Add Memory</Button>
                     </div>

                     <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                           <thead className="bg-slate-900 sticky top-0 z-20">
                              <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800">
                                 <th className="px-6 py-3">Fact / Observation</th>
                                 <th className="px-6 py-3">Source</th>
                                 <th className="px-6 py-3">Vector Score</th>
                                 <th className="px-6 py-3 text-right">Action</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-800/50">
                              {filteredMemories.map(item => (
                                 <tr key={item.id} className={`group hover:bg-slate-800 transition-all ${shreddingId === item.id ? 'opacity-0 scale-95 duration-500' : ''}`}>
                                    <td className="px-6 py-4">
                                       <div className="flex flex-col space-y-1">
                                          <div className="text-sm font-medium text-slate-200">{item.fact}</div>
                                          <div className="flex items-center text-[10px] text-slate-500 font-mono">
                                             <ClockIcon size={10} className="mr-1.5" /> {item.timestamp}
                                             {item.needsReview && <span className="ml-3 px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-bold uppercase border border-red-500/20">Review Needed</span>}
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-6 py-4">
                                       <Badge variant="neutral">{item.source}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                       <div className="flex items-center space-x-2">
                                          <div className="w-12 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                             <div className="h-full bg-indigo-500" style={{ width: `${item.relevanceScore * 100}%` }} />
                                          </div>
                                          <span className="text-[10px] font-mono text-slate-500">{item.relevanceScore.toFixed(2)}</span>
                                       </div>
                                    </td>
                                    <td className="px-6 py-4">
                                       <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button className="p-2 text-slate-500 hover:text-white transition-colors"><Edit2Icon size={14}/></button>
                                          <button 
                                             onClick={() => handleDeleteMemory(item.id)}
                                             className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                                          >
                                             <TrashIcon size={14}/>
                                          </button>
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               )}

               {activeTab === 'tools' && (
                  <div className="space-y-10">
                     <section className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Enabled Capabilities</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           {agent.capabilities.map(cap => (
                              <div key={cap.id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between h-32 group hover:border-indigo-500/30 transition-all">
                                 <div className="flex items-start justify-between">
                                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-indigo-400 group-hover:scale-110 transition-transform">
                                       {getToolIcon(cap.id)}
                                    </div>
                                    <Badge variant={cap.level === 'exec' ? 'error' : cap.level === 'write' ? 'warning' : 'success'}>
                                       {cap.level.toUpperCase()}
                                    </Badge>
                                 </div>
                                 <div>
                                    <div className="text-sm font-bold text-white mb-0.5">{cap.label}</div>
                                    <div className="text-[10px] text-slate-500 font-mono truncate">ID: {cap.id}</div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </section>

                     <section className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                           <ActivityIcon size={14} className="mr-2" /> Recent Tool Activity
                        </h3>
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                           <div className="divide-y divide-slate-800">
                              {MOCK_TOOL_LOGS.map(log => (
                                 <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-850 transition-colors cursor-default group">
                                    <div className="flex items-center space-x-6">
                                       <div className={`p-2 rounded-lg ${log.status === 'failed' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                          {getToolIcon(log.tool.split('.')[0])}
                                       </div>
                                       <div>
                                          <div className="text-xs font-mono font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">{log.call}</div>
                                          <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">PID: {Math.floor(Math.random()*9000)+1000} • {log.timestamp}</div>
                                       </div>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                       <span className="text-[10px] font-mono text-slate-600">{log.latency || '-'}</span>
                                       <span className={`text-[10px] font-bold uppercase tracking-tighter ${log.status === 'failed' ? 'text-red-500' : 'text-emerald-500'}`}>
                                          {log.status}
                                       </span>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </section>
                  </div>
               )}

               {activeTab === 'logs' && (
                  <div className="space-y-8">
                     <div className="flex items-center justify-between px-2">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                           <TerminalIcon size={14} className="mr-2" /> Reasoning Trace (Chain-of-Thought)
                        </h3>
                        <div className="flex items-center space-x-4 text-[10px] font-mono text-slate-600">
                           <span>SESSION_ID: mc_742x</span>
                           <button className="text-indigo-400 hover:text-indigo-300 font-bold">EXPORT_TRACE</button>
                        </div>
                     </div>

                     <div className="relative pl-8 space-y-12">
                        {/* Timeline Line */}
                        <div className="absolute left-[15px] top-4 bottom-4 w-px bg-slate-800" />

                        {MOCK_THOUGHT_TRACE.map((step, idx) => (
                           <div key={step.id} className="relative animate-in slide-in-from-left-2 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                              {/* Pulse Dot */}
                              <div className="absolute left-[-23px] top-1.5 w-3 h-3 rounded-full bg-slate-700 border-2 border-[#0f172a] group-hover:bg-indigo-500 transition-colors" />
                              
                              <div className="space-y-4">
                                 <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Step {idx + 1}</span>
                                    <span className="text-[10px] font-mono text-slate-600">{step.timestamp}</span>
                                 </div>
                                 <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-inner relative group hover:border-indigo-500/30 transition-all">
                                    <div className="flex items-start space-x-4">
                                       <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                                          <SparklesIcon size={18} />
                                       </div>
                                       <div className="flex-1 space-y-4">
                                          <div className="text-sm text-slate-300 leading-relaxed font-light italic">
                                             "{step.thought}"
                                          </div>
                                          
                                          {step.action && (
                                             <div className="space-y-2">
                                                <div className="text-[9px] font-bold text-slate-500 uppercase flex items-center">
                                                   <ZapIcon size={10} className="mr-1.5 text-amber-500" /> Action Performed
                                                </div>
                                                <div className="bg-slate-950 rounded-lg p-3 font-mono text-xs text-emerald-400 border border-emerald-500/20">
                                                   {step.action}
                                                </div>
                                             </div>
                                          )}

                                          {step.observation && (
                                             <div className="space-y-2">
                                                <div className="text-[9px] font-bold text-slate-500 uppercase flex items-center">
                                                   <ActivityIcon size={10} className="mr-1.5 text-blue-500" /> Observation
                                                </div>
                                                <div className="text-xs text-slate-400 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                                                   {step.observation}
                                                </div>
                                             </div>
                                          )}
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))}
                        
                        <div className="pt-6 flex flex-col items-center">
                           <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce mb-2" />
                           <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Reasoning Continues...</span>
                        </div>
                     </div>
                  </div>
               )}

            </div>
         </div>
      </div>

      {/* 3. Global Status Bar (Footer) */}
      <footer className="h-10 bg-slate-900 border-t border-slate-800 shrink-0 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-30">
         <div className="flex items-center space-x-8">
            <div className="flex items-center">
               <ActivityIcon size={12} className="mr-2 text-indigo-400" />
               VIRTUAL_VRAM: <span className="ml-2 text-emerald-500">OPTIMIZED</span>
            </div>
            <div className="flex items-center">
               <ShieldIcon size={12} className="mr-2 text-indigo-400" />
               SECURE_ENCLAVE: <span className="ml-2 text-slate-300">ACTIVE</span>
            </div>
         </div>
         <div className="flex items-center space-x-4">
            <span className="text-slate-600 font-mono">NODE_HASH: AGENT_PROF_v2</span>
         </div>
      </footer>

    </div>
  );
};

// Sub-components

const ProfileTab: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
   <button 
      onClick={onClick}
      className={`px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative flex items-center group ${
         active ? 'text-white' : 'text-slate-500 hover:text-slate-300'
      }`}
   >
      <span className={`mr-2.5 transition-transform group-hover:scale-110 ${active ? 'text-indigo-400' : ''}`}>{icon}</span>
      {label}
      {active && (
         <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-in fade-in slide-in-from-bottom-1" />
      )}
   </button>
);

const ContextMessage: React.FC<{ role: 'user' | 'agent'; text: string; time: string }> = ({ role, text, time }) => (
   <div className={`p-4 rounded-2xl border flex flex-col space-y-2 ${role === 'user' ? 'bg-slate-800/40 border-slate-700' : 'bg-indigo-900/10 border-indigo-500/20'}`}>
      <div className="flex items-center justify-between">
         <span className={`text-[9px] font-bold uppercase tracking-widest ${role === 'user' ? 'text-slate-500' : 'text-indigo-400'}`}>{role === 'user' ? 'User Intent' : 'Agent Response'}</span>
         <span className="text-[9px] font-mono text-slate-600">{time}</span>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed italic">"{text}"</p>
   </div>
);

const getToolIcon = (id: string) => {
   const tool = id.toLowerCase();
   if (tool.includes('fs')) return <HardDriveIcon size={16} />;
   if (tool.includes('terminal') || tool.includes('shell')) return <TerminalIcon size={16} />;
   if (tool.includes('browser')) return <GlobeIcon size={16} />;
   if (tool.includes('search')) return <SearchIcon size={16} />;
   if (tool.includes('memory')) return <LockIcon size={16} />;
   return <ZapIcon size={16} />;
};

export default AgentProfile;
