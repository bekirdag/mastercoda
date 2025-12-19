
import React, { useState, useMemo } from 'react';
import { AIProvider, AIModel } from '../types';
import { MOCK_AI_PROVIDERS } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  CpuIcon, 
  SearchIcon, 
  RotateCwIcon, 
  // Added RefreshCwIcon to resolve missing name error on line 323
  RefreshCwIcon,
  CloudIcon, 
  ServerIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  AlertTriangleIcon, 
  ChevronRightIcon, 
  ChevronDownIcon,
  ShieldIcon,
  ZapIcon,
  LockIcon,
  ActivityIcon,
  HelpCircleIcon
} from './Icons';

const ModelRegistry: React.FC = () => {
  const [providers, setProviders] = useState<AIProvider[]>(MOCK_AI_PROVIDERS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Global Routing State
  const [fastModel, setFastModel] = useState('gpt-3.5-turbo');
  const [smartModel, setSmartModel] = useState('claude-3-5-sonnet');
  const [embedModel, setEmbedModel] = useState('text-embedding-3-small');
  
  // Cost Control State
  const [budget, setBudget] = useState('20.00');
  const [threshold, setThreshold] = useState(80);
  const [hardStop, setHardStop] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  const handleTestConnection = async (id: string) => {
    setProviders(prev => prev.map(p => p.id === id ? { ...p, status: 'loading' } : p));
    await new Promise(r => setTimeout(r, 1500));
    setProviders(prev => prev.map(p => p.id === id ? { ...p, status: 'connected' } : p));
  };

  const allModels = useMemo(() => {
    return providers.flatMap(p => p.models);
  }, [providers]);

  return (
    <div className="p-8 max-w-[900px] mx-auto space-y-10 animate-in fade-in duration-500 pb-32">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Model Registry</h1>
          <p className="text-slate-400 mt-1">Configure brain providers and global routing rules</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" size="sm" icon={<ActivityIcon size={14} />}>View Usage</Button>
          <Button variant="primary" size="sm" icon={<RotateCwIcon size={14} />}>Refresh Models</Button>
        </div>
      </div>

      {/* 2. Global Routing Section */}
      <section className="bg-slate-850 rounded-2xl border border-slate-700 shadow-xl overflow-hidden relative group">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
         <div className="p-6">
            <div className="flex items-center mb-6">
               <ZapIcon size={18} className="text-indigo-400 mr-3" />
               <h2 className="text-sm font-bold text-white uppercase tracking-widest">Global Routing Logic</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <RoutingSelect 
                  label="Fast Model" 
                  description="Simple chat & completion" 
                  value={fastModel} 
                  onChange={setFastModel} 
                  models={allModels} 
               />
               <RoutingSelect 
                  label="Smart Model" 
                  description="Reasoning & Complex Tasks" 
                  value={smartModel} 
                  onChange={setSmartModel} 
                  models={allModels} 
               />
               <RoutingSelect 
                  label="Search Embed" 
                  description="Vector indexing" 
                  value={embedModel} 
                  onChange={setEmbedModel} 
                  models={allModels} 
               />
            </div>
         </div>
      </section>

      {/* 3. Provider List Section */}
      <section className="space-y-4">
         <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Configured Providers</h2>
            <span className="text-[10px] text-slate-600 font-mono">ADAPTER_VERSION: V2.4</span>
         </div>

         <div className="space-y-3">
            {providers.map(provider => (
               <ProviderCard 
                  key={provider.id} 
                  provider={provider} 
                  isExpanded={expandedId === provider.id}
                  onToggle={() => setExpandedId(expandedId === provider.id ? null : provider.id)}
                  onTest={() => handleTestConnection(provider.id)}
               />
            ))}
         </div>
      </section>

      {/* 4. Local Server Bridge Section */}
      <section className="bg-[#0f1117] border-2 border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
         <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
            <div className="flex items-center space-x-3">
               <ServerIcon size={14} className="text-slate-400" />
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Local Inference Bridge</span>
            </div>
            <div className="flex items-center space-x-2">
               <div className={`w-1.5 h-1.5 rounded-full ${offlineMode ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-slate-700'}`} />
               <span className="text-[10px] font-mono text-slate-500 uppercase">OFFLINE_ENCLAVE</span>
            </div>
         </div>

         <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 uppercase">Base API URL</label>
                     <input 
                        type="text" 
                        defaultValue="http://localhost:11434"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm font-mono text-emerald-400 focus:border-indigo-500 outline-none"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 uppercase">Parallel Instances</label>
                     <div className="flex items-center space-x-4">
                        <input type="range" className="flex-1 accent-indigo-500" min="1" max="8" defaultValue="4" />
                        <span className="text-xs font-mono text-slate-300">4x VRAM</span>
                     </div>
                  </div>
               </div>

               <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 space-y-4">
                  <div 
                    onClick={() => setOfflineMode(!offlineMode)}
                    className="flex items-start justify-between group cursor-pointer"
                  >
                     <div className="flex-1 pr-6">
                        <h4 className="text-sm font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">Enforce Local Enclave</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Blocks all external API calls. Forces agents to use local models for everything. Maximum privacy.</p>
                     </div>
                     <button 
                        className={`w-10 h-5 rounded-full p-1 transition-all duration-300 relative shrink-0 ${offlineMode ? 'bg-indigo-600' : 'bg-slate-700'}`}
                     >
                        <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-300 ${offlineMode ? 'translate-x-5' : 'translate-x-0'}`} />
                     </button>
                  </div>
               </div>
            </div>

            <div className="pt-4 flex justify-end">
               <Button variant="secondary" icon={<ActivityIcon size={14} />}>Scan Local Models</Button>
            </div>
         </div>
      </section>

      {/* 5. Cost Control Section */}
      <section className="bg-slate-800/40 border border-slate-700 rounded-2xl p-8 space-y-8">
         <div className="flex items-center space-x-3 border-b border-slate-700 pb-4">
            <ShieldIcon size={20} className="text-emerald-500" />
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Financial Guardrails</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase">Monthly Token Budget ($)</label>
               <input 
                  type="text" 
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-xl font-bold text-white focus:border-indigo-500 outline-none"
               />
               <p className="text-[10px] text-slate-600">Current Spend: <span className="text-emerald-500 font-bold">$4.12</span></p>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase">Warning Threshold (%)</label>
               <div className="flex items-center space-x-4 pt-3">
                  <input 
                    type="range" 
                    className="flex-1 accent-indigo-500" 
                    min="50" max="100" 
                    value={threshold}
                    onChange={(e) => setThreshold(parseInt(e.target.value))}
                  />
                  <span className="text-sm font-bold text-white font-mono w-10">{threshold}%</span>
               </div>
            </div>

            <div className="space-y-4">
               <div 
                 onClick={() => setHardStop(!hardStop)}
                 className="flex items-center justify-between p-3 bg-slate-900 border border-slate-700 rounded-xl cursor-pointer group hover:border-red-500/30 transition-all"
               >
                  <div>
                     <p className="text-xs font-bold text-white">Hard Cap</p>
                     <p className="text-[10px] text-slate-500">Auto-kill session on overflow</p>
                  </div>
                  <button className={`w-8 h-4 rounded-full p-0.5 relative transition-colors ${hardStop ? 'bg-red-500' : 'bg-slate-700'}`}>
                     <div className={`w-3 h-3 bg-white rounded-full transition-transform ${hardStop ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
};

// Sub-components

const RoutingSelect: React.FC<{ label: string; description: string; value: string; onChange: (v: string) => void; models: AIModel[] }> = ({ label, description, value, onChange, models }) => (
   <div className="space-y-3">
      <div>
         <label className="text-xs font-bold text-white uppercase">{label}</label>
         <p className="text-[10px] text-slate-500 leading-tight">{description}</p>
      </div>
      <div className="relative">
         <select 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-3 pr-8 py-2 text-xs text-indigo-300 font-bold focus:border-indigo-500 outline-none appearance-none cursor-pointer"
         >
            {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
         </select>
         <ChevronDownIcon size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
      </div>
   </div>
);

const ProviderCard: React.FC<{ provider: AIProvider; isExpanded: boolean; onToggle: () => void; onTest: () => void }> = ({ provider, isExpanded, onToggle, onTest }) => (
   <article className={`bg-slate-800/40 border rounded-2xl transition-all duration-300 overflow-hidden ${isExpanded ? 'border-slate-500 shadow-2xl' : 'border-slate-700 hover:border-slate-600'}`}>
      <div 
         onClick={onToggle}
         className="px-6 py-4 flex items-center justify-between cursor-pointer group"
      >
         <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
               {provider.icon}
            </div>
            <div>
               <h3 className="font-bold text-white group-hover:text-indigo-200 transition-colors">{provider.name}</h3>
               <div className="flex items-center space-x-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                     provider.status === 'connected' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                     provider.status === 'error' ? 'bg-red-500' : 'bg-slate-600'
                  }`} />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${
                     provider.status === 'connected' ? 'text-emerald-400' : 
                     provider.status === 'error' ? 'text-red-400' : 'text-slate-500'
                  }`}>{provider.status}</span>
               </div>
            </div>
         </div>

         <div className="flex items-center space-x-4">
            <div className="text-[10px] text-slate-600 font-mono mr-4 hidden md:block">
               {provider.models.length} MODELS AVAILABLE
            </div>
            <button className={`p-2 text-slate-500 hover:text-white transition-all ${isExpanded ? 'rotate-180 text-indigo-400' : ''}`}>
               <ChevronDownIcon size={16} />
            </button>
         </div>
      </div>

      {isExpanded && (
         <div className="px-6 pb-6 pt-2 border-t border-slate-700/50 animate-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
               <div className="space-y-4">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">API Secret Key</label>
                     <div className="relative">
                        <input 
                           type="password" 
                           value={provider.apiKey || ''} 
                           readOnly
                           className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-3 pr-10 py-2 text-xs font-mono text-slate-300 focus:border-indigo-500 outline-none"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white">
                           <LockIcon size={14} />
                        </button>
                     </div>
                  </div>
                  {provider.orgId && (
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Org ID</label>
                        <input 
                           type="text" 
                           defaultValue={provider.orgId}
                           className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:border-indigo-500 outline-none"
                        />
                     </div>
                  )}
                  <div className="pt-4 flex items-center space-x-3">
                     <Button 
                        variant="primary" 
                        size="sm" 
                        className="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                        onClick={onTest}
                        disabled={provider.status === 'loading'}
                     >
                        {provider.status === 'loading' ? <RotateCwIcon size={14} className="animate-spin mr-2" /> : <RefreshCwIcon size={14} className="mr-2" />}
                        Test Connection
                     </Button>
                     <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-950/20">Disconnect</Button>
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Known Capabilities</label>
                  <div className="space-y-1 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                     {provider.models.map(model => (
                        <div key={model.id} className="flex items-center justify-between p-2 bg-slate-900 border border-slate-800 rounded group hover:border-indigo-500/30 transition-all">
                           <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-200">{model.id}</span>
                              <span className="text-[9px] text-slate-500 uppercase font-mono">{(model.contextWindow/1000)}k Context</span>
                           </div>
                           <Badge variant={model.type === 'reasoning' ? 'success' : model.type === 'embedding' ? 'info' : 'neutral'}>
                              {model.type}
                           </Badge>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      )}
   </article>
);

export default ModelRegistry;
