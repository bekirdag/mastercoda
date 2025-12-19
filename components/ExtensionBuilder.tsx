
import React, { useState, useEffect, useRef } from 'react';
import { DevExtensionProject } from '../types';
import Button from './Button';
import Badge from './Badge';
import { 
  ZapIcon, 
  RocketIcon, 
  PlusIcon, 
  SearchIcon, 
  TerminalIcon, 
  FolderIcon, 
  CodeIcon, 
  RefreshCwIcon, 
  ChevronDownIcon, 
  ShieldIcon, 
  FileTextIcon,
  RotateCwIcon,
  TrashIcon,
  ActivityIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  // Fix: Import missing ChevronRightIcon and FilterIcon from standard Icons component
  ChevronRightIcon,
  FilterIcon
} from './Icons';

const MOCK_DEV_PROJECTS: DevExtensionProject[] = [
  {
    id: 'dev-sql-agent',
    name: 'custom-sql-agent',
    path: '~/dev/mcoda-extensions/sql-agent',
    version: '0.1.0-alpha',
    status: 'linked',
    manifest: {
      publisher: 'alex_dev',
      activationEvents: ['onCommand:sql.runQuery', 'onView:sql-explorer'],
      contributions: {
        commands: [
          { command: 'sql.runQuery', title: 'Run SQL Query' },
          { command: 'sql.analyzeSchema', title: 'Analyze Database Schema' }
        ],
        views: [
          { id: 'sql-explorer', name: 'SQL Explorer' }
        ],
        configuration: {
          'sql.connectionString': { type: 'string', description: 'DB URI' }
        }
      }
    }
  },
  {
    id: 'dev-neon-theme',
    name: 'dark-neon-theme',
    path: '~/dev/mcoda-themes/neon',
    version: '1.0.4',
    status: 'linked',
    manifest: {
      publisher: 'alex_dev',
      activationEvents: ['*'],
      contributions: {
        views: [{ id: 'theme-preview', name: 'Theme Preview' }]
      }
    }
  },
  {
    id: 'dev-missing',
    name: 'legacy-helper',
    path: '~/old-projects/helper',
    version: '0.0.1',
    status: 'missing',
    manifest: {
      publisher: 'alex_dev',
      activationEvents: [],
      contributions: {}
    }
  }
];

const ExtensionBuilder: React.FC = () => {
  const [projects, setProjects] = useState<DevExtensionProject[]>(MOCK_DEV_PROJECTS);
  const [selectedId, setSelectedId] = useState<string>(MOCK_DEV_PROJECTS[0].id);
  const [isReloading, setIsReloading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStep, setPublishStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    "[10:45:01] Extension Host initialized.",
    "[10:45:02] Loading local extension: custom-sql-agent...",
    "[10:45:02] Extension 'custom-sql-agent' is now active."
  ]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const activeProject = projects.find(p => p.id === selectedId);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString([], { hour12: false })}] ${msg}`]);
  };

  const handleReload = async () => {
    setIsReloading(true);
    addLog(`Reloading extension host for ${activeProject?.name}...`);
    await new Promise(r => setTimeout(r, 1000));
    addLog(`Extension reloaded successfully.`);
    setIsReloading(false);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishStep(1); // Validating
    addLog("Starting publication process...");
    await new Promise(r => setTimeout(r, 1200));
    
    setPublishStep(2); // Packing
    addLog("Packing extension into .vsix bundle...");
    await new Promise(r => setTimeout(r, 1500));
    
    setPublishStep(3); // Uploading
    addLog("Uploading to Master Coda Registry...");
    await new Promise(r => setTimeout(r, 2000));
    
    setPublishStep(4); // Verifying
    addLog("Verifying integrity and signing package...");
    await new Promise(r => setTimeout(r, 1000));
    
    addLog("Publication successful! Redirecting to marketplace...");
    await new Promise(r => setTimeout(r, 1000));
    setIsPublishing(false);
    setPublishStep(0);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Toolbar (EX-04.4) */}
      <header className="h-[60px] border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0 z-20">
         <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
               <CodeIcon className="mr-2 text-indigo-400" size={22} />
               Extension Builder
            </h1>

            <div className="h-6 w-px bg-slate-800" />

            <div className="flex items-center space-x-3">
               <div className="relative group">
                  <button className="flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-indigo-500 transition-all">
                     <span>{activeProject?.name || 'Select Project'}</span>
                     <ChevronDownIcon size={12} className="text-slate-500" />
                  </button>
                  {/* Dropdown Menu Mock */}
                  <div className="absolute top-full left-0 mt-1 w-48 bg-slate-800 border border-slate-700 rounded shadow-2xl py-1 hidden group-hover:block z-50">
                     {projects.map(p => (
                        <button 
                           key={p.id}
                           onClick={() => setSelectedId(p.id)}
                           className="w-full text-left px-3 py-2 text-xs hover:bg-slate-700 text-slate-300 flex items-center justify-between"
                        >
                           <span className="truncate">{p.name}</span>
                           <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'linked' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        </button>
                     ))}
                  </div>
               </div>

               {activeProject?.status === 'linked' && (
                  <div className="flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                     <ActivityIcon size={10} className="mr-1.5 animate-pulse" />
                     WATCHING FOR CHANGES
                  </div>
               )}
            </div>
         </div>

         <div className="flex items-center space-x-3">
            <button 
              onClick={handleReload}
              disabled={isReloading || isPublishing}
              className={`p-2 rounded border border-slate-700 text-slate-400 hover:text-white transition-all ${isReloading ? 'bg-indigo-600/20 animate-pulse' : 'bg-slate-800/50 hover:bg-slate-800'}`}
              title="Reload Extension Host"
            >
               <ZapIcon size={18} className={isReloading ? 'text-indigo-400' : ''} />
            </button>
            <Button 
               variant="primary" 
               size="sm" 
               icon={<RocketIcon size={14} />} 
               onClick={handlePublish}
               disabled={isPublishing || activeProject?.status !== 'linked'}
               className="shadow-[0_0_20px_rgba(79,70,229,0.3)]"
            >
               {isPublishing ? 'Publishing...' : 'Publish to Registry'}
            </Button>
         </div>
      </header>

      {/* 2. Main Layout Split */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* Sidebar: Projects (EX-04.4) */}
         <aside className="w-[250px] border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-800">
               <Button variant="secondary" size="sm" icon={<PlusIcon size={14} />} className="w-full justify-center border-dashed">
                  New Extension
               </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
               <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Dev Workspaces</h3>
               {projects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`w-full flex items-center p-3 rounded-lg border transition-all text-left group ${
                      selectedId === p.id 
                        ? 'bg-indigo-600/10 border-indigo-500/30' 
                        : 'bg-transparent border-transparent hover:bg-slate-800/50'
                    }`}
                  >
                     <div className={`p-2 rounded bg-slate-800 border border-slate-700 mr-3 group-hover:scale-110 transition-transform ${selectedId === p.id ? 'text-indigo-400 border-indigo-500/30' : 'text-slate-500'}`}>
                        {p.name.includes('theme') ? '🎨' : '🔧'}
                     </div>
                     <div className="min-w-0 flex-1">
                        <div className={`text-sm font-bold truncate ${selectedId === p.id ? 'text-white' : 'text-slate-400'}`}>{p.name}</div>
                        <div className={`text-[10px] font-mono truncate ${p.status === 'missing' ? 'text-red-400' : 'text-slate-600'}`}>
                           {p.status === 'missing' ? 'Path not found' : p.path}
                        </div>
                     </div>
                  </button>
               ))}
            </div>
         </aside>

         {/* Main Dashboard Pane (EX-04.4) */}
         <main className="flex-1 flex flex-col overflow-hidden relative">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
               <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                  
                  {activeProject ? (
                     <>
                        {/* Publishing Progress Overlay */}
                        {isPublishing && (
                           <div className="bg-indigo-900/10 border border-indigo-500/30 rounded-2xl p-8 mb-8 animate-in zoom-in-95">
                              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                                 <RocketIcon size={24} className="mr-3 text-indigo-400" />
                                 Publishing: {activeProject.name}
                              </h3>
                              <div className="space-y-6">
                                 <StepItem label="Validating Manifest" status={publishStep > 1 ? 'complete' : publishStep === 1 ? 'active' : 'pending'} />
                                 <StepItem label="Packaging artifacts" status={publishStep > 2 ? 'complete' : publishStep === 2 ? 'active' : 'pending'} />
                                 <StepItem label="Uploading to Registry" status={publishStep > 3 ? 'complete' : publishStep === 3 ? 'active' : 'pending'} />
                                 <StepItem label="Finalizing & Signing" status={publishStep > 4 ? 'complete' : publishStep === 4 ? 'active' : 'pending'} />
                              </div>
                           </div>
                        )}

                        {/* Card 1: Manifest Summary */}
                        <section className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden shadow-sm">
                           <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                 <FileTextIcon size={18} className="text-slate-500" />
                                 <h2 className="text-sm font-bold text-white uppercase tracking-widest">Manifest (package.json)</h2>
                              </div>
                              <Button variant="ghost" size="sm" icon={<CodeIcon size={14} />}>Edit Source</Button>
                           </div>
                           <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                              <MetaField label="Publisher" value={activeProject.manifest.publisher} />
                              <MetaField label="Version" value={activeProject.version} mono />
                              <MetaField label="ID" value={activeProject.id} mono />
                              <MetaField label="Min Coda" value="v0.3.0" mono />
                           </div>
                           <div className="px-6 pb-6 space-y-2">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Activation Events</label>
                              <div className="flex flex-wrap gap-2">
                                 {activeProject.manifest.activationEvents.map(ev => (
                                    <span key={ev} className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-indigo-300">
                                       {ev}
                                    </span>
                                 ))}
                                 {activeProject.manifest.activationEvents.length === 0 && <span className="text-xs text-slate-600 italic">None defined</span>}
                              </div>
                           </div>
                        </section>

                        {/* Card 2: Contributions */}
                        <section className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden shadow-sm">
                           <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                 <PlusIcon size={18} className="text-slate-500" />
                                 <h2 className="text-sm font-bold text-white uppercase tracking-widest">Contributions</h2>
                              </div>
                           </div>
                           <div className="p-6 space-y-6">
                              {activeProject.manifest.contributions.commands && (
                                 <ContributionGroup title="Commands" items={activeProject.manifest.contributions.commands.map(c => ({ label: c.title, sub: c.command }))} />
                              )}
                              {activeProject.manifest.contributions.views && (
                                 <ContributionGroup title="Views" items={activeProject.manifest.contributions.views.map(v => ({ label: v.name, sub: v.id }))} />
                              )}
                              {activeProject.manifest.contributions.configuration && (
                                 <div className="space-y-3">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Configuration</h3>
                                    <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 font-mono text-[11px] text-emerald-400/80">
                                       {JSON.stringify(activeProject.manifest.contributions.configuration, null, 2)}
                                    </div>
                                 </div>
                              )}
                           </div>
                        </section>

                        {/* Card 3: Packaging */}
                        <section className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden shadow-sm">
                           <div className="p-6 border-b border-slate-700/50">
                              <h2 className="text-sm font-bold text-white uppercase tracking-widest">Release Management</h2>
                           </div>
                           <div className="p-6 space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Registry Token</label>
                                    <input 
                                       type="password" 
                                       placeholder="mc_tk_...................."
                                       className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 font-mono outline-none focus:border-indigo-500"
                                    />
                                 </div>
                                 <div className="flex items-end space-x-3">
                                    <Button variant="secondary" className="flex-1">Pack (.vsix)</Button>
                                    <Button variant="secondary" className="flex-1">Clean Build</Button>
                                 </div>
                              </div>
                              <div className="bg-red-950/10 border border-red-500/20 rounded-xl p-4 flex items-start space-x-3">
                                 <AlertTriangleIcon size={18} className="text-red-500 mt-0.5" />
                                 <div className="text-xs text-red-300/80 leading-relaxed">
                                    <strong>Validation Alert:</strong> Description field in package.json is too short. Quality score will be penalized.
                                 </div>
                              </div>
                           </div>
                        </section>
                     </>
                  ) : (
                     <div className="py-20 flex flex-col items-center justify-center text-slate-600">
                        <FolderIcon size={64} className="mb-4 opacity-10" />
                        <h3 className="text-xl font-bold">No Project Selected</h3>
                        <p className="mt-2">Select a dev project from the sidebar to begin.</p>
                     </div>
                  )}
               </div>
            </div>

            {/* 3. Debugging Panel (EX-04.4 Bottom) */}
            <div className="h-[250px] border-t border-slate-800 bg-[#0f1117] flex flex-col shrink-0">
               <div className="h-10 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-4 shrink-0">
                  <div className="flex items-center space-x-4">
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                        <TerminalIcon size={12} className="mr-2" />
                        Extension Host Logs
                     </span>
                     <div className="flex items-center space-x-2">
                        <FilterIcon size={12} className="text-slate-600" />
                        <select className="bg-transparent border-none text-[10px] font-bold text-slate-400 uppercase outline-none p-0 cursor-pointer hover:text-white transition-colors">
                           <option>All Logs</option>
                           <option>Errors Only</option>
                           <option>System</option>
                        </select>
                     </div>
                  </div>
                  <div className="flex items-center space-x-2">
                     <button onClick={() => setLogs([])} className="p-1.5 text-slate-600 hover:text-red-400 transition-colors" title="Clear Logs">
                        <TrashIcon size={14} />
                     </button>
                     <button onClick={handleReload} className="p-1.5 text-slate-600 hover:text-indigo-400 transition-colors" title="Restart Extension Host">
                        <RotateCwIcon size={14} className={isReloading ? 'animate-spin' : ''} />
                     </button>
                  </div>
               </div>
               <div className="flex-1 overflow-y-auto custom-scrollbar p-4 font-mono text-xs space-y-1.5 selection:bg-indigo-500/30">
                  {logs.map((log, i) => (
                     <div key={i} className={`flex animate-in fade-in slide-in-from-left-1 duration-200 ${log.includes('error') ? 'text-red-400' : log.includes('Reload') ? 'text-indigo-400' : 'text-slate-500'}`}>
                        <span className="opacity-40 mr-3 select-none">{(i + 1).toString().padStart(3, '0')}</span>
                        <span className="break-all">{log}</span>
                     </div>
                  ))}
                  <div ref={logEndRef} />
               </div>
            </div>

         </main>
      </div>
    </div>
  );
};

// Sub-components for clean rendering

const MetaField: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
   <div className="space-y-1">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
      <div className={`text-sm font-bold text-slate-200 truncate ${mono ? 'font-mono' : ''}`}>{value}</div>
   </div>
);

const ContributionGroup: React.FC<{ title: string; items: { label: string; sub: string }[] }> = ({ title, items }) => (
   <div className="space-y-3">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
         {items.map(item => (
            <div key={item.sub} className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl group hover:border-slate-700 transition-all">
               <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-200 truncate">{item.label}</div>
                  <div className="text-[9px] font-mono text-slate-600 truncate">{item.sub}</div>
               </div>
               <ChevronRightIcon size={12} className="text-slate-700 group-hover:text-indigo-500 transition-colors" />
            </div>
         ))}
      </div>
   </div>
);

const StepItem: React.FC<{ label: string; status: 'pending' | 'active' | 'complete' }> = ({ label, status }) => (
   <div className="flex items-center justify-between">
      <div className="flex items-center">
         <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 border transition-all ${
            status === 'complete' ? 'bg-emerald-500 border-emerald-500 text-white' : 
            status === 'active' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 animate-pulse' : 
            'bg-slate-800 border-slate-700 text-slate-600'
         }`}>
            {status === 'complete' ? <CheckCircleIcon size={12} /> : status === 'active' ? <RotateCwIcon size={12} className="animate-spin" /> : null}
         </div>
         <span className={`text-sm font-medium transition-colors ${status === 'pending' ? 'text-slate-500' : 'text-slate-200'}`}>{label}</span>
      </div>
      {status === 'complete' && <span className="text-[10px] font-bold text-emerald-500 font-mono">OK</span>}
   </div>
);

export default ExtensionBuilder;
