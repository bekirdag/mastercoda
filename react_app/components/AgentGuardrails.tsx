
import React, { useState, useMemo } from 'react';
import { GuardrailRule, InterventionLogEntry } from '../types';
import { MOCK_GUARDRAIL_RULES, MOCK_INTERVENTIONS } from '../constants';
import Button from './Button';
import Badge from './Badge';
// Added missing SettingsIcon, SearchIcon, SparklesIcon to the imports
import { 
  ShieldIcon, 
  ActivityIcon, 
  AlertTriangleIcon, 
  LockIcon, 
  TrashIcon, 
  PlusIcon, 
  ChevronDownIcon, 
  ChevronRightIcon, 
  RotateCwIcon, 
  TerminalIcon, 
  CheckCircleIcon,
  XIcon,
  HardDriveIcon,
  ZapIcon,
  GlobeIcon,
  SettingsIcon,
  SearchIcon,
  SparklesIcon
} from './Icons';

const AgentGuardrails: React.FC = () => {
  const [rules, setRules] = useState<GuardrailRule[]>(MOCK_GUARDRAIL_RULES);
  const [interventions, setInterventions] = useState<InterventionLogEntry[]>(MOCK_INTERVENTIONS);
  const [emergencyStop, setEmergencyStop] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = useMemo(() => {
    return interventions.filter(int => 
      int.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      int.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      int.policyName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [interventions, searchQuery]);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const handleResolve = (id: string) => {
    // In a real app, this would authorize the action
    alert(`Action from log ${id} authorized manually.`);
    setInterventions(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="p-8 max-w-[1000px] mx-auto space-y-10 animate-in fade-in duration-500 pb-32 font-sans">
      
      {/* 1. Policy Status HUD (Hero Section) */}
      <section className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl relative group">
         <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-1000 ${emergencyStop ? 'from-red-900/40 via-slate-800 to-slate-900' : 'from-indigo-900/20 via-slate-800 to-slate-900'} -z-10`} />
         
         <div className="p-10 flex flex-col md:flex-row items-center gap-10">
            <div className="relative">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-700 ${
                   emergencyStop 
                   ? 'bg-red-500/10 text-red-500 shadow-[0_0_50px_rgba(239,68,68,0.4)] animate-pulse' 
                   : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.2)]'
                }`}>
                   <ShieldIcon size={48} className={!emergencyStop ? 'animate-pulse-subtle' : ''} />
                </div>
                {emergencyStop && (
                   <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-red-600 border-4 border-slate-800 flex items-center justify-center text-white animate-bounce">
                      <AlertTriangleIcon size={14} />
                   </div>
                )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
               <div className="flex items-center justify-center md:justify-start space-x-3">
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                     {emergencyStop ? 'Fleet Suspended' : 'Safety Engine Active'}
                  </h1>
                  <Badge variant={emergencyStop ? 'error' : 'success'}>
                     {emergencyStop ? 'HALTED' : 'STRICT MODE'}
                  </Badge>
               </div>
               <p className="text-slate-400 text-lg font-light leading-relaxed">
                  {emergencyStop 
                    ? 'All agent processes are currently locked. Manual override required.' 
                    : 'Monitoring execution against 12 governance policies across the fleet.'}
               </p>
               <div className="pt-4 flex items-center justify-center md:justify-start space-x-8 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500">
                  <div className="flex items-center">
                     <LockIcon size={12} className="mr-2 text-indigo-400" />
                     ENCLAVE: SECURE
                  </div>
                  <div className="flex items-center">
                     <RotateCwIcon size={12} className="mr-2 text-indigo-400" />
                     POLICIES: SYNCED
                  </div>
               </div>
            </div>

            <div className="flex flex-col items-center gap-3 shrink-0 bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
               <label className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${emergencyStop ? 'text-red-400' : 'text-slate-500'}`}>
                  Emergency Stop
               </label>
               <button 
                  onClick={() => setEmergencyStop(!emergencyStop)}
                  className={`w-14 h-8 rounded-full p-1.5 transition-all duration-500 relative border-2 ${
                    emergencyStop 
                    ? 'bg-red-600 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
                    : 'bg-slate-800 border-slate-700'
                  }`}
               >
                  <div className={`w-4 h-4 rounded-full shadow-lg transition-all duration-500 ${
                    emergencyStop ? 'translate-x-6 bg-white' : 'translate-x-0 bg-slate-500'
                  }`} />
               </button>
            </div>
         </div>
      </section>

      {/* 2. Rule Configuration Grid (The Ruleset) */}
      <section className="space-y-6">
         <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center">
               <SettingsIcon size={16} className="mr-2 text-indigo-400" />
               Governance Ruleset
            </h2>
            <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest flex items-center">
               <PlusIcon size={12} className="mr-1.5" /> Define New Rule
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map(rule => (
               <div key={rule.id} className={`p-5 rounded-2xl border transition-all duration-300 flex items-start space-x-4 group ${
                  rule.enabled ? 'bg-slate-800/40 border-slate-700 hover:border-indigo-500/50' : 'bg-slate-900/40 border-slate-800 opacity-60'
               }`}>
                  <div className={`p-2.5 rounded-xl border transition-colors ${
                     !rule.enabled ? 'bg-slate-900 border-slate-800 text-slate-600' :
                     rule.category === 'dlp' ? 'bg-blue-600/10 border-blue-500/20 text-blue-400' :
                     rule.category === 'safety' ? 'bg-red-600/10 border-red-500/20 text-red-400' :
                     rule.category === 'cost' ? 'bg-amber-600/10 border-amber-500/20 text-amber-400' :
                     'bg-emerald-600/10 border-emerald-500/20 text-emerald-400'
                  }`}>
                     {getCategoryIcon(rule.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors">{rule.label}</h3>
                        <Badge variant={rule.severity === 'high' ? 'error' : rule.severity === 'medium' ? 'warning' : 'neutral'}>
                           {rule.severity.toUpperCase()}
                        </Badge>
                     </div>
                     <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">{rule.description}</p>
                     
                     <div className="flex items-center justify-between">
                        <button className="text-[9px] font-bold text-slate-500 hover:text-white uppercase tracking-widest flex items-center group/edit">
                           CONFIGURE PARAMS <ChevronRightIcon size={10} className="ml-1 group-hover/edit:translate-x-1 transition-transform" />
                        </button>
                        <button 
                           onClick={() => toggleRule(rule.id)}
                           className={`w-9 h-4 rounded-full p-0.5 relative transition-colors ${rule.enabled ? 'bg-indigo-600' : 'bg-slate-700'}`}
                        >
                           <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${rule.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* 3. Intervention Log (The Black Box) */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
         <header className="h-14 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center space-x-4">
               <TerminalIcon size={18} className="text-slate-400" />
               <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Intervention & Audit Log</h3>
            </div>
            <div className="relative group">
               <SearchIcon size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" />
               <input 
                  type="text" 
                  placeholder="Filter log..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-indigo-500 w-48"
               />
            </div>
         </header>

         <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-950/50 border-b border-slate-800 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                     <th className="px-6 py-3">Time</th>
                     <th className="px-6 py-3">Agent</th>
                     <th className="px-6 py-3">Action Attempted</th>
                     <th className="px-6 py-3">Policy Hit</th>
                     <th className="px-6 py-3 text-right">Outcome</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800/50 font-mono text-[11px]">
                  {filteredLogs.map(log => (
                     <React.Fragment key={log.id}>
                        <tr 
                           onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                           className={`group hover:bg-slate-800/60 transition-all cursor-pointer ${log.outcome === 'blocked' ? 'bg-red-950/5' : ''}`}
                        >
                           <td className="px-6 py-4 text-slate-500">{log.timestamp}</td>
                           <td className="px-6 py-4">
                              <span className="font-bold text-slate-300 group-hover:text-indigo-400 transition-colors">{log.agentName}</span>
                           </td>
                           <td className="px-6 py-4 max-w-[200px] truncate text-slate-400">{log.action}</td>
                           <td className="px-6 py-4 text-slate-500">{log.policyName}</td>
                           <td className="px-6 py-4 text-right">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
                                 log.outcome === 'blocked' ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]' :
                                 log.outcome === 'redacted' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              }`}>
                                 {log.outcome.replace('_', ' ')}
                              </span>
                           </td>
                        </tr>
                        {expandedLogId === log.id && (
                           <tr className="bg-slate-950/50">
                              <td colSpan={5} className="px-8 py-6 animate-in slide-in-from-top-1 duration-200">
                                 <div className="flex gap-8">
                                    <div className="flex-1 space-y-4">
                                       <div className="flex items-center text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                                          <SparklesIcon size={12} className="mr-2" />
                                          Cognitive Context (Prompt Trace)
                                       </div>
                                       <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-slate-300 leading-relaxed italic h-24 overflow-y-auto custom-scrollbar">
                                          {log.context || 'Thinking: Deletion required to satisfy the "clean repo" constraint specified in the system instructions...'}
                                       </div>
                                       <div className="flex items-center space-x-4">
                                          <button 
                                             onClick={(e) => { e.stopPropagation(); const evt = new CustomEvent('app-navigate', { detail: `/agents/manage/${log.agentId}` }); window.dispatchEvent(evt); }}
                                             className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase underline"
                                          >
                                             Configure Agent DNA &rsaquo;
                                          </button>
                                          <button className="text-[10px] font-bold text-slate-500 hover:text-slate-300 uppercase underline">Download Full Audit Payload</button>
                                       </div>
                                    </div>
                                    <div className="w-[180px] space-y-4 shrink-0 border-l border-slate-800 pl-8">
                                       <div className="text-[9px] font-bold text-slate-600 uppercase">Recovery Action</div>
                                       <div className="space-y-2">
                                          <Button variant="primary" size="sm" className="w-full text-[10px] h-7 uppercase font-bold" onClick={() => handleResolve(log.id)}>
                                             {log.outcome === 'pending_approval' ? 'Authorize Action' : 'Create Exception'}
                                          </Button>
                                          <Button variant="ghost" size="sm" className="w-full text-[10px] h-7 uppercase font-bold text-slate-500" onClick={() => setExpandedLogId(null)}>Discard</Button>
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
      </section>

      {/* 4. Infrastructure Guardrail Info */}
      <footer className="pt-10 flex items-start gap-4 p-8 bg-indigo-900/5 border border-indigo-500/10 rounded-3xl">
         <GlobeIcon size={20} className="text-indigo-400 shrink-0 mt-1" />
         <div className="text-xs text-slate-500 leading-relaxed">
            <strong className="text-indigo-300 block mb-1">Local Policy Interceptor</strong>
            These guardrails operate at the proxy layer between the Master Coda runtime and the LLM providers. All inspection logic runs on your local machine using regular expressions and static analysis. Dangerous commands are intercepted **before** the sub-shell is spawned.
         </div>
      </footer>

    </div>
  );
};

// Sub-components

const getCategoryIcon = (category: string) => {
   switch (category) {
      case 'dlp': return <LockIcon size={20} />;
      case 'safety': return <ShieldIcon size={20} />;
      case 'cost': return <ZapIcon size={20} />;
      case 'ethics': return <ActivityIcon size={20} />;
      default: return <SettingsIcon size={20} />;
   }
};

const StatCard: React.FC<{ label: string; value: string; color?: string; icon: React.ReactNode }> = ({ label, value, color = 'text-white', icon }) => (
   <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex flex-col hover:border-slate-600 transition-all group">
      <div className="flex items-center text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-1 group-hover:text-slate-400">
         <span className="mr-2 opacity-70">{icon}</span>
         {label}
      </div>
      <div className={`text-xl font-bold tracking-tight ${color}`}>{value}</div>
   </div>
);

export default AgentGuardrails;
