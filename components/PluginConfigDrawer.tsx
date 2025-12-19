
import React, { useState } from 'react';
import { Plugin, PluginAuthMethod } from '../types';
import Button from './Button';
import Badge from './Badge';
// Added missing XCircleIcon import
import { 
  XIcon, 
  LockIcon, 
  ShieldIcon, 
  CheckCircleIcon, 
  ZapIcon, 
  RotateCwIcon, 
  GlobeIcon, 
  ChevronDownIcon, 
  ActivityIcon,
  HardDriveIcon,
  SparklesIcon,
  CodeIcon,
  TrashIcon,
  XCircleIcon
} from './Icons';

interface PluginConfigDrawerProps {
  plugin: Plugin;
  onClose: () => void;
}

const PluginConfigDrawer: React.FC<PluginConfigDrawerProps> = ({ plugin, onClose }) => {
  const [authMethod, setAuthMethod] = useState<PluginAuthMethod>(plugin.authMethod);
  const [credential, setCredential] = useState('sk-************************');
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [scopes, setScopes] = useState<Record<string, boolean>>({
    'read_issues': true,
    'write_issues': false,
    'delete_repo': false
  });

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestStatus('idle');
    await new Promise(r => setTimeout(r, 1500));
    setTestStatus('success');
    setIsTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end font-sans pointer-events-none" role="dialog" aria-modal="true">
       {/* Backdrop */}
       <div 
         className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto"
         onClick={onClose}
       />

       {/* Panel */}
       <div className="relative h-full w-[500px] bg-[#0f172a] shadow-2xl border-l border-slate-800 transition-all duration-300 ease-in-out pointer-events-auto flex flex-col animate-in slide-in-from-right-full">
          
          <header className="h-20 border-b border-slate-800 px-8 flex items-center justify-between shrink-0 bg-slate-900/50 backdrop-blur">
             <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shadow-lg">
                   {plugin.icon}
                </div>
                <div>
                   <h2 className="text-lg font-bold text-white tracking-tight uppercase">{plugin.title} Config</h2>
                   <div className="flex items-center text-[10px] font-mono text-slate-500 uppercase">
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${plugin.healthStatus === 'healthy' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      ADAPTER_INSTANCE_01
                   </div>
                </div>
             </div>
             <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                <XIcon size={24} />
             </button>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
             
             {/* Section: Authentication */}
             <section className="space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center">
                      <LockIcon size={14} className="mr-2 text-indigo-400" />
                      Security & Auth
                   </h3>
                   <Badge variant="info">AES-256</Badge>
                </div>
                
                <div className="space-y-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Authentication Method</label>
                      <div className="relative">
                         <select 
                           value={authMethod}
                           onChange={(e) => setAuthMethod(e.target.value as any)}
                           className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                         >
                            <option value="OAuth2">OAuth 2.0 (Single Sign-On)</option>
                            <option value="API Key">Standard API Key</option>
                            <option value="PAT">Personal Access Token</option>
                         </select>
                         <ChevronDownIcon size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={14} />
                      </div>
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Credential Identifier</label>
                      <div className="relative group">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-700">
                            <ShieldIcon size={14} />
                         </div>
                         <input 
                            type="password" 
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
                            placeholder="Enter token or secret..."
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-indigo-400 font-mono focus:border-indigo-500 outline-none"
                         />
                         <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                            <button className="p-1.5 bg-slate-800 rounded-lg text-[10px] font-bold text-indigo-400 uppercase">SECURE_SET</button>
                         </div>
                      </div>
                   </div>

                   <Button 
                      variant="secondary" 
                      className="w-full justify-between group"
                      onClick={handleTestConnection}
                      disabled={isTesting}
                   >
                      <span className="flex items-center">
                         {isTesting ? <RotateCwIcon size={14} className="animate-spin mr-2" /> : <ZapIcon size={14} className="mr-2" />}
                         {isTesting ? 'Testing Connectivity...' : 'Test Connection'}
                      </span>
                      {testStatus === 'success' && <CheckCircleIcon size={16} className="text-emerald-500" />}
                      {testStatus === 'error' && <XCircleIcon size={16} className="text-red-500" />}
                   </Button>
                </div>
             </section>

             <div className="h-px bg-slate-800" />

             {/* Section: Access Scope */}
             <section className="space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Enforced Scopes</h3>
                   <span className="text-[9px] text-slate-600 font-mono">GRANULAR_PROXY</span>
                </div>
                <div className="space-y-2">
                   {Object.keys(scopes).map(key => (
                      <div 
                         key={key} 
                         onClick={() => setScopes({...scopes, [key]: !scopes[key]})}
                         className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
                      >
                         <span className="text-xs font-mono text-slate-400 group-hover:text-white uppercase tracking-tighter">{key.replace('_', ' ')}</span>
                         <div className={`w-9 h-5 rounded-full p-1 transition-all relative ${scopes[key] ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                            <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${scopes[key] ? 'translate-x-4' : 'translate-x-0'}`} />
                         </div>
                      </div>
                   ))}
                </div>
             </section>

             {/* Section: Provided Tools */}
             <section className="space-y-4">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center">
                   <ActivityIcon size={14} className="mr-2 text-indigo-400" />
                   Tools Exported to Registry
                </h3>
                <div className="space-y-2">
                   {plugin.tools.map(tool => (
                      <div key={tool.name} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                         <div className="min-w-0">
                            <div className="text-xs font-bold text-indigo-400 font-mono truncate">{tool.name}</div>
                            <div className="text-[10px] text-slate-600 truncate">{tool.description}</div>
                         </div>
                         <button 
                            className="p-1.5 text-slate-700 hover:text-white transition-colors"
                            onClick={() => { const evt = new CustomEvent('app-navigate', { detail: '/agents/skills' }); window.dispatchEvent(evt); }}
                         >
                            <CodeIcon size={14} />
                         </button>
                      </div>
                   ))}
                </div>
             </section>

          </div>

          <footer className="p-8 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between shrink-0">
             <Button variant="ghost" className="text-red-400 hover:bg-red-950/20" icon={<TrashIcon size={16}/>}>Deactivate</Button>
             <div className="flex space-x-3">
                <Button variant="ghost" onClick={onClose}>Discard</Button>
                <Button variant="primary" className="shadow-[0_0_20px_rgba(79,70,229,0.3)]">Save Settings</Button>
             </div>
          </footer>

       </div>
    </div>
  );
};

export default PluginConfigDrawer;
