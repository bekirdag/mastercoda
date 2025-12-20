import React, { useState, useEffect, useRef } from 'react';
import { NetworkRequest, FirewallRule } from '../types';
import { MOCK_NETWORK_REQUESTS, MOCK_FIREWALL_RULES } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  ShieldIcon, 
  GlobeIcon, 
  ActivityIcon, 
  TrashIcon, 
  SearchIcon, 
  PlusIcon, 
  XIcon, 
  ChevronRightIcon, 
  RotateCwIcon, 
  CheckCircleIcon,
  AlertTriangleIcon,
  LockIcon,
  FilterIcon,
  CodeIcon,
  ArrowRightIcon,
  TerminalIcon
} from './Icons';

const NetworkFirewall: React.FC = () => {
  const [requests, setRequests] = useState<NetworkRequest[]>(MOCK_NETWORK_REQUESTS);
  const [rules, setRules] = useState<FirewallRule[]>(MOCK_FIREWALL_RULES);
  const [firewallMode, setFirewallMode] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);
  const [isSampledMode, setIsSampledMode] = useState(false);
  const [ruleSearch, setRuleSearch] = useState('');
  const [newRuleDomain, setNewRuleDomain] = useState('');

  const selectedRequest = requests.find(r => r.id === selectedReqId);

  // Simulation: Add random new requests to the live feed
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const id = `req-${Date.now()}`;
        const newReq: NetworkRequest = {
          id,
          timestamp: new Date().toLocaleTimeString([], { hour12: false }),
          extensionId: 'ext-dracula',
          extensionName: 'Dracula Theme',
          method: 'GET',
          domain: 'api.github.com',
          url: 'https://api.github.com/zen',
          status: 200,
          size: '0.2kb',
          initiator: 'theme-engine.js:24'
        };
        setRequests(prev => [newReq, ...prev.slice(0, 49)]); // Keep last 50
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleAddRule = (type: 'allow' | 'block') => {
    if (!newRuleDomain) return;
    const newRule: FirewallRule = {
      id: `rule-${Date.now()}`,
      domain: newRuleDomain,
      type
    };
    setRules([...rules, newRule]);
    setNewRuleDomain('');
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const stats = {
    sent: '1.2 MB',
    received: '5.4 MB',
    activeSockets: 3,
    blocked: requests.filter(r => r.status === 'BLOCKED').length
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans relative">
      
      {/* 1. Dashboard Header (Stats Strip) */}
      <header className="h-[64px] bg-slate-800 border-b border-slate-700 shrink-0 flex items-center justify-between px-8 z-30 shadow-lg">
         <div className="flex items-center space-x-12">
            <div className="flex items-center">
               <ShieldIcon className="mr-3 text-indigo-400" size={24} />
               <div>
                  <h1 className="text-sm font-bold text-white uppercase tracking-widest leading-none">Privacy Firewall</h1>
                  <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">EXTENSION_GUARD_v1.4</p>
               </div>
            </div>

            <div className="flex items-center space-x-8">
               <StatItem label="Traffic Egress" value={`${stats.sent} / ${stats.received}`} icon={<ActivityIcon size={14} className="text-blue-400" />} />
               <StatItem label="Active Sockets" value={stats.activeSockets.toString()} icon={<GlobeIcon size={14} className="text-emerald-400" />} />
               <StatItem label="Blocked Requests" value={stats.blocked.toString()} icon={<AlertTriangleIcon size={14} className="text-red-400" />} />
            </div>
         </div>

         <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-700">
               <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-white uppercase leading-none">Firewall Mode</span>
                  <span className={`text-[9px] font-mono ${firewallMode ? 'text-indigo-400' : 'text-slate-500'}`}>
                     {firewallMode ? 'ENFORCED (BLOCK_BY_DEFAULT)' : 'LOGGING (ALLOW_BY_DEFAULT)'}
                  </span>
               </div>
               <button 
                  onClick={() => setFirewallMode(!firewallMode)}
                  className={`w-12 h-6 rounded-full p-1 transition-all duration-300 relative ${firewallMode ? 'bg-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-slate-700'}`}
               >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${firewallMode ? 'translate-x-6' : 'translate-x-0'}`} />
               </button>
            </div>
         </div>
      </header>

      {/* 2. Main content Area (Split Layout) */}
      <div className="flex-1 flex flex-col overflow-hidden">
         
         {/* Top Pane: Real-time Traffic Log */}
         <div className="flex-1 flex flex-col min-h-0 bg-[#0f1117] relative">
            <div className="h-10 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 shrink-0">
               <div className="flex items-center space-x-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                     <TerminalIcon size={12} className="mr-2" />
                     Live Traffic Log
                  </span>
                  {isSampledMode && (
                     <Badge variant="warning">Sampled Mode (High Load)</Badge>
                  )}
               </div>
               <div className="flex items-center space-x-4">
                  <button onClick={() => setRequests([])} className="text-slate-500 hover:text-red-400 transition-colors" title="Clear Buffer">
                     <TrashIcon size={16} />
                  </button>
               </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
               <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-900 sticky top-0 z-20">
                     <tr className="text-[10px] font-bold text-slate-600 uppercase tracking-widest border-b border-slate-800">
                        <th className="px-6 py-3">Time</th>
                        <th className="px-6 py-3">Source Extension</th>
                        <th className="px-6 py-3">Method</th>
                        <th className="px-6 py-3">Domain</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Size</th>
                     </tr>
                  </thead>
                  <tbody>
                     {requests.map((req) => (
                        <tr 
                           key={req.id} 
                           onClick={() => setSelectedReqId(req.id)}
                           className={`group border-b border-slate-800/40 hover:bg-slate-800/30 transition-all cursor-pointer animate-in slide-in-from-top-2 duration-300 ${req.status === 'BLOCKED' ? 'bg-red-500/5 animate-flash-red' : ''} ${selectedReqId === req.id ? 'bg-indigo-500/10' : ''}`}
                        >
                           <td className="px-6 py-3 font-mono text-xs text-slate-500">{req.timestamp}</td>
                           <td className="px-6 py-3">
                              <div className="flex items-center space-x-2">
                                 <span className="text-xs font-bold text-slate-300 group-hover:text-indigo-300 transition-colors">{req.extensionName}</span>
                              </div>
                           </td>
                           <td className="px-6 py-3">
                              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                 req.method === 'POST' ? 'text-blue-400 bg-blue-500/10' : 
                                 req.method === 'GET' ? 'text-emerald-400 bg-emerald-500/10' : 
                                 'text-slate-400 bg-slate-700/50'
                              }`}>{req.method}</span>
                           </td>
                           <td className="px-6 py-3 text-xs font-mono text-slate-400 group-hover:text-slate-200">{req.domain}</td>
                           <td className="px-6 py-3">
                              {req.status === 'BLOCKED' ? (
                                 <span className="flex items-center text-red-500 text-[10px] font-bold tracking-tighter uppercase">
                                    <ShieldIcon size={12} className="mr-1.5" /> Blocked
                                 </span>
                              ) : (
                                 <span className="text-emerald-500 text-[10px] font-bold">{req.status} OK</span>
                              )}
                           </td>
                           <td className="px-6 py-3 text-right font-mono text-[10px] text-slate-500">{req.size}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Bottom Pane: Domain Rules & Allowlist */}
         <div className="h-[300px] border-t-2 border-slate-800 bg-[#0f172a] flex flex-col shrink-0">
            <div className="h-12 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0">
               <div className="flex items-center space-x-6">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Policy Enforcement Rules</span>
                  
                  {/* Add Rule Input */}
                  <div className="flex items-center space-x-2 bg-slate-950 rounded-lg border border-slate-800 px-3 py-1 group focus-within:border-indigo-500 transition-all">
                     <GlobeIcon size={12} className="text-slate-600 group-focus-within:text-indigo-400" />
                     <input 
                        type="text" 
                        placeholder="Add domain rule (e.g. *.track.io)" 
                        value={newRuleDomain}
                        onChange={(e) => setNewRuleDomain(e.target.value)}
                        className="bg-transparent border-none text-[11px] text-white focus:ring-0 w-48 font-mono"
                     />
                     <div className="flex items-center space-x-1">
                        <button 
                           onClick={() => handleAddRule('allow')}
                           className="px-2 py-0.5 rounded bg-emerald-600/10 text-emerald-500 text-[9px] font-bold hover:bg-emerald-600 hover:text-white transition-all border border-emerald-500/20"
                        >ALLOW</button>
                        <button 
                           onClick={() => handleAddRule('block')}
                           className="px-2 py-0.5 rounded bg-red-600/10 text-red-500 text-[9px] font-bold hover:bg-red-600 hover:text-white transition-all border border-red-500/20"
                        >BLOCK</button>
                     </div>
                  </div>
               </div>

               <div className="relative">
                  <SearchIcon size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input 
                     type="text" 
                     placeholder="Filter rules..." 
                     value={ruleSearch}
                     onChange={(e) => setRuleSearch(e.target.value)}
                     className="bg-slate-800/50 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-indigo-500 w-48"
                  />
               </div>
            </div>

            <div className="flex-1 flex divide-x divide-slate-800 overflow-hidden">
               {/* Allowed List */}
               <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="px-6 py-2 bg-emerald-500/5 text-emerald-500 text-[9px] font-bold uppercase tracking-widest border-b border-slate-800">Trusted Domains</div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                     {rules.filter(r => r.type === 'allow' && r.domain.toLowerCase().includes(ruleSearch.toLowerCase())).map(rule => (
                        <RuleItem key={rule.id} rule={rule} onRemove={() => removeRule(rule.id)} />
                     ))}
                  </div>
               </div>

               {/* Blocked List */}
               <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="px-6 py-2 bg-red-500/5 text-red-500 text-[9px] font-bold uppercase tracking-widest border-b border-slate-800">Restricted Domains</div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                     {rules.filter(r => r.type === 'block' && r.domain.toLowerCase().includes(ruleSearch.toLowerCase())).map(rule => (
                        <RuleItem key={rule.id} rule={rule} onRemove={() => removeRule(rule.id)} />
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 3. Request Detail Drawer (Slide-over) */}
      {selectedRequest && (
         <div className="absolute inset-y-0 right-0 w-[450px] bg-slate-900 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] border-l border-slate-700 z-[40] animate-in slide-in-from-right-full duration-300 flex flex-col">
            <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 bg-slate-900/50 backdrop-blur">
               <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${selectedRequest.status === 'BLOCKED' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                     <GlobeIcon size={20} />
                  </div>
                  <div>
                     <h3 className="font-bold text-white leading-tight">Request Audit</h3>
                     <span className="text-[10px] text-slate-500 font-mono uppercase">{selectedRequest.id}</span>
                  </div>
               </div>
               <button onClick={() => setSelectedReqId(null)} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <XIcon size={24} />
               </button>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
               {/* Quick Action Bar */}
               <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-red-400 transition-all font-bold text-xs">
                     <ShieldIcon size={14} />
                     <span>BLOCK DOMAIN</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 transition-all font-bold text-xs">
                     <CodeIcon size={14} />
                     <span>VIEW SOURCE</span>
                  </button>
               </div>

               {/* Request Line */}
               <section className="space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Endpoint</h4>
                  <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs break-all leading-relaxed relative group">
                     <span className="text-indigo-400 font-bold mr-2">{selectedRequest.method}</span>
                     <span className="text-slate-300">{selectedRequest.url}</span>
                     <button className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 rounded">
                        <ActivityIcon size={12} className="text-slate-400" />
                     </button>
                  </div>
               </section>

               {/* Metadata Details */}
               <section className="grid grid-cols-2 gap-6">
                  <MetaBlock label="Initiator" value={selectedRequest.extensionName} sub={selectedRequest.initiator} />
                  <MetaBlock label="Status" value={selectedRequest.status.toString()} color={selectedRequest.status === 'BLOCKED' ? 'text-red-500' : 'text-emerald-500'} />
                  <MetaBlock label="Payload Size" value={selectedRequest.size} />
                  <MetaBlock label="Timestamp" value={selectedRequest.timestamp} mono />
               </section>

               {/* Payload Preview */}
               <section className="space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                     <ActivityIcon size={12} className="mr-2" />
                     Payload Preview (Intercepted)
                  </h4>
                  {selectedRequest.body ? (
                     <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-[11px] text-emerald-400/80 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar">
                        {selectedRequest.body}
                     </div>
                  ) : (
                     <div className="py-12 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center opacity-40">
                        <CodeIcon size={32} className="mb-2" />
                        <p className="text-[10px] uppercase font-bold tracking-widest">No request body</p>
                     </div>
                  )}
               </section>

               <div className="h-px bg-slate-800" />

               {/* Warning Box for questionable domains */}
               {selectedRequest.domain.includes('analytics') && (
                  <div className="bg-amber-950/10 border border-amber-500/20 rounded-xl p-4 flex items-start space-x-3">
                     <AlertTriangleIcon size={18} className="text-amber-500 shrink-0 mt-0.5" />
                     <p className="text-xs text-amber-200/80 leading-relaxed">
                        <strong>Security Alert:</strong> This request appears to be telemetry or tracking. Many developers block this domain to ensure maximum prompt privacy.
                     </p>
                  </div>
               )}
            </div>

            <footer className="p-6 border-t border-slate-800 bg-slate-900 shrink-0 flex items-center justify-between">
               <div className="flex items-center text-[10px] text-slate-600 font-mono">
                  MD5_HASH: {btoa(selectedRequest.id).slice(0, 16).toLowerCase()}
               </div>
               <Button variant="ghost" onClick={() => setSelectedReqId(null)}>Close Audit</Button>
            </footer>
         </div>
      )}

    </div>
  );
};

// Sub-components

const StatItem: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
   <div className="flex flex-col">
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1 flex items-center">
         <span className="mr-1.5">{icon}</span>
         {label}
      </span>
      <span className="text-xs font-bold text-slate-200 font-mono">{value}</span>
   </div>
);

const RuleItem: React.FC<{ rule: FirewallRule; onRemove: () => void }> = ({ rule, onRemove }) => (
   <div className={`flex items-center justify-between p-2 rounded-lg border group transition-all ${rule.type === 'block' ? 'bg-red-500/5 border-red-500/10 hover:border-red-500/30' : 'bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/30'}`}>
      <div className="flex items-center space-x-3 min-w-0">
         <div className={`w-1.5 h-1.5 rounded-full ${rule.type === 'block' ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]' : 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]'}`} />
         <span className="text-xs font-mono text-slate-300 truncate">{rule.domain}</span>
         {rule.isSystem && <LockIcon size={10} className="text-slate-600" title="System domain cannot be blocked" />}
      </div>
      {!rule.isSystem && (
         <button onClick={onRemove} className="p-1 text-slate-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <TrashIcon size={14} />
         </button>
      )}
   </div>
);

const MetaBlock: React.FC<{ label: string; value: string; sub?: string; color?: string; mono?: boolean }> = ({ label, value, sub, color = 'text-slate-200', mono = false }) => (
   <div className="space-y-1">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
      <div className={`text-sm font-bold truncate ${color} ${mono ? 'font-mono' : ''}`}>{value}</div>
      {sub && <div className="text-[10px] font-mono text-slate-600 truncate">{sub}</div>}
   </div>
);

export default NetworkFirewall;