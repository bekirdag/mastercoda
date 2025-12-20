
import React, { useState, useEffect, useRef } from 'react';
import { DocSiteConfig, DocSiteNavItem } from '../types';
import Button from './Button';
import Badge from './Badge';
import { 
  GlobeIcon, 
  CheckCircleIcon, 
  RotateCwIcon, 
  ActivityIcon, 
  ChevronRightIcon, 
  PlusIcon, 
  SearchIcon, 
  ArrowRightIcon, 
  SettingsIcon, 
  FolderIcon, 
  FileTextIcon, 
  TrashIcon, 
  TagIcon, 
  LockIcon, 
  ShieldIcon, 
  ExternalLinkIcon,
  MinimizeIcon,
  MaximizeIcon,
  TerminalIcon,
  ChevronDownIcon,
  /**
   * Fix: Added CodeIcon to the imports to resolve the "Cannot find name 'CodeIcon'" error on line 254.
   */
  CodeIcon
} from './Icons';

type ConfigTab = 'general' | 'branding' | 'navigation' | 'versions' | 'domains';

const DocSiteManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ConfigTab>('general');
  const [buildStatus, setBuildStatus] = useState<'idle' | 'building' | 'success' | 'error'>('success');
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  
  const [config, setConfig] = useState<DocSiteConfig>({
    siteName: 'Master Coda API Docs',
    description: 'High-density technical documentation for the Master Coda orchestrator.',
    access: 'public',
    primaryColor: '#6366f1',
    customCss: '/* Add your overrides here */\n.sidebar { border-radius: 0; }',
    navigation: [
      { id: 'n1', label: 'Getting Started', type: 'folder', children: [
        { id: 'f1', label: 'Authentication', type: 'file' },
        { id: 'f2', label: 'Quick Start Guide', type: 'file' }
      ]},
      { id: 'n2', label: 'API Reference', type: 'folder', children: [
        { id: 'f3', label: 'Endpoints v1', type: 'file' },
        { id: 'f4', label: 'Model Registry', type: 'file' }
      ]}
    ],
    versions: [
      { tag: 'v2.0', status: 'active' },
      { tag: 'v1.0', status: 'legacy' }
    ]
  });

  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString([], { hour12: false })}] ${msg}`]);
  };

  const triggerBuild = async () => {
    setBuildStatus('building');
    setIsLogsOpen(true);
    setLogs([]);
    addLog('mcoda docs build --output ./dist');
    addLog('Optimizing vector search indices...');
    await new Promise(r => setTimeout(r, 800));
    addLog('Generating sitemap...');
    await new Promise(r => setTimeout(r, 1000));
    addLog('Prerendering 42 markdown pages...');
    await new Promise(r => setTimeout(r, 1500));
    addLog('Uploading to Vercel production...');
    await new Promise(r => setTimeout(r, 1200));
    addLog('Build successful. Site live at https://docs.mastercoda.com');
    setBuildStatus('success');
  };

  const tabs: { id: ConfigTab; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <SettingsIcon size={14} /> },
    { id: 'branding', label: 'Branding', icon: <ActivityIcon size={14} /> },
    { id: 'navigation', label: 'Navigation', icon: <FolderIcon size={14} /> },
    { id: 'versions', label: 'Versions', icon: <TagIcon size={14} /> },
    { id: 'domains', label: 'Domains', icon: <GlobeIcon size={14} /> },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Deployment Status Hero (Hero Card) */}
      <section className="shrink-0 p-6 border-b border-slate-800 bg-slate-900/50">
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            
            <div className="flex items-center space-x-6">
               <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all ${
                 buildStatus === 'building' ? 'bg-indigo-500/10 border-indigo-500/30' : 
                 buildStatus === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]' :
                 'bg-red-500/10 border-red-500/30'
               }`}>
                  {buildStatus === 'building' ? <RotateCwIcon size={32} className="animate-spin text-indigo-400" /> : <CheckCircleIcon size={32} className="text-emerald-500" />}
               </div>
               
               <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                     <h2 className="text-xl font-bold text-white tracking-tight">https://docs.mastercoda.com</h2>
                     <ExternalLinkIcon size={14} className="text-slate-500 hover:text-indigo-400 cursor-pointer" />
                  </div>
                  <div className="flex items-center space-x-4 text-xs">
                     <span className="flex items-center text-emerald-400 font-bold uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                        Build Passing
                     </span>
                     <span className="text-slate-500">•</span>
                     <span className="text-slate-500 font-mono uppercase">Last deploy: 2 mins ago by CI/CD</span>
                  </div>
               </div>
            </div>

            <div className="flex items-center space-x-3">
               <Button variant="secondary" size="sm" onClick={() => setIsLogsOpen(!isLogsOpen)}>
                  {isLogsOpen ? 'Hide Logs' : 'View Logs'}
               </Button>
               <Button 
                  variant="primary" 
                  size="sm" 
                  icon={<RotateCwIcon size={14} className={buildStatus === 'building' ? 'animate-spin' : ''} />}
                  disabled={buildStatus === 'building'}
                  onClick={triggerBuild}
                  className="bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
               >
                  Trigger New Build
               </Button>
            </div>
         </div>
         
         {/* Expandable Logs Terminal */}
         {isLogsOpen && (
            <div className="max-w-6xl mx-auto mt-4 animate-in slide-in-from-top-2 duration-300">
               <div className="bg-[#0d1117] rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
                  <div className="h-8 bg-slate-900 flex items-center px-4 justify-between border-b border-slate-800">
                     <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Build Console</span>
                     <div className="flex space-x-1.5">
                        <div className="w-2 h-2 rounded-full bg-slate-800" />
                        <div className="w-2 h-2 rounded-full bg-slate-800" />
                        <div className="w-2 h-2 rounded-full bg-slate-800" />
                     </div>
                  </div>
                  <div className="p-4 h-48 overflow-y-auto font-mono text-xs text-slate-400 space-y-1 custom-scrollbar">
                     {logs.map((log, i) => (
                        <div key={i} className="animate-in fade-in slide-in-from-left-1">
                           <span className="text-slate-600 mr-2">[{i+1}]</span> {log}
                        </div>
                     ))}
                     {buildStatus === 'building' && <div className="w-2 h-4 bg-indigo-500 animate-pulse mt-1" />}
                     <div ref={logEndRef} />
                  </div>
               </div>
            </div>
         )}
      </section>

      {/* 2. Main Workspace (Split View) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
         
         {/* CONFIG AREA (LEFT) */}
         <div className="w-full md:w-[500px] border-r border-slate-800 flex flex-col shrink-0 bg-slate-900/30">
            {/* Tabs */}
            <div className="flex items-center bg-slate-900 border-b border-slate-800 shrink-0">
               {tabs.map(tab => (
                  <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`flex-1 py-4 flex flex-col items-center justify-center transition-all relative ${
                        activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                     }`}
                  >
                     <span className={`mb-1 transition-transform ${activeTab === tab.id ? 'text-indigo-400 scale-110' : ''}`}>{tab.icon}</span>
                     <span className="text-[9px] font-bold uppercase tracking-widest">{tab.label}</span>
                     {activeTab === tab.id && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-500 animate-in fade-in" />}
                  </button>
               ))}
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
               <div className="animate-in fade-in duration-500">
                  {activeTab === 'general' && (
                     <div className="space-y-8">
                        <section className="space-y-4">
                           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Basic Information</h3>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Site Name</label>
                              <input 
                                 type="text" 
                                 value={config.siteName}
                                 onChange={(e) => setConfig({...config, siteName: e.target.value})}
                                 className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">SEO Description</label>
                              <textarea 
                                 value={config.description}
                                 onChange={(e) => setConfig({...config, description: e.target.value})}
                                 className="w-full h-24 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-slate-300 resize-none focus:border-indigo-500 outline-none leading-relaxed"
                              />
                           </div>
                        </section>

                        <section className="space-y-4">
                           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Access Control</h3>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Visibility</label>
                              <select 
                                 value={config.access}
                                 onChange={(e) => setConfig({...config, access: e.target.value as any})}
                                 className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-indigo-500 outline-none appearance-none"
                              >
                                 <option value="public">Public (Open Web)</option>
                                 <option value="password">Password Protected</option>
                                 <option value="sso">SSO Required (SAML/OAuth)</option>
                              </select>
                           </div>
                        </section>
                     </div>
                  )}

                  {activeTab === 'branding' && (
                     <div className="space-y-8">
                        <section className="space-y-6">
                           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Theming</h3>
                           
                           <div className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl">
                              <div>
                                 <p className="text-sm font-bold text-white">Brand Primary</p>
                                 <p className="text-[10px] text-slate-500 uppercase font-mono">{config.primaryColor}</p>
                              </div>
                              <input 
                                 type="color" 
                                 value={config.primaryColor}
                                 onChange={(e) => setConfig({...config, primaryColor: e.target.value})}
                                 className="w-10 h-10 rounded border border-slate-700 bg-slate-900 cursor-pointer overflow-hidden p-0"
                              />
                           </div>

                           <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                                    <CodeIcon size={12} className="mr-2" /> Custom CSS Overrides
                                 </label>
                                 <Badge variant="info">ADVANCED</Badge>
                              </div>
                              <textarea 
                                 value={config.customCss}
                                 onChange={(e) => setConfig({...config, customCss: e.target.value})}
                                 className="w-full h-64 bg-slate-950 border border-slate-700 rounded-xl p-4 text-xs font-mono text-indigo-300 focus:border-indigo-500 outline-none resize-none leading-relaxed"
                              />
                           </div>
                        </section>
                     </div>
                  )}

                  {activeTab === 'navigation' && (
                     <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sidebar Hierarchy</h3>
                           <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest flex items-center">
                              <PlusIcon size={12} className="mr-1" /> ADD SECTION
                           </button>
                        </div>
                        
                        <div className="space-y-2">
                           {config.navigation.map(item => (
                              <NavItemEditor key={item.id} item={item} />
                           ))}
                        </div>

                        <div className="p-4 bg-indigo-900/5 border border-indigo-500/10 rounded-xl">
                           <p className="text-[10px] text-slate-500 leading-relaxed italic">
                              Tip: Drag and drop items to reorder the structural hierarchy of your generated site navigation.
                           </p>
                        </div>
                     </div>
                  )}

                  {activeTab === 'versions' && (
                     <div className="space-y-8">
                        <section className="space-y-4">
                           <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Published Versions</h3>
                              <Button variant="primary" size="sm" icon={<PlusIcon size={14} />}>Freeze Current</Button>
                           </div>
                           <div className="space-y-3">
                              {config.versions.map(v => (
                                 <div key={v.tag} className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700 rounded-xl group hover:border-slate-600 transition-all">
                                    <div className="flex items-center space-x-3">
                                       <TagIcon size={16} className="text-indigo-400" />
                                       <div>
                                          <div className="text-sm font-bold text-white">{v.tag}</div>
                                          <div className="text-[10px] font-mono text-slate-500 uppercase">{v.status}</div>
                                       </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                       {v.status === 'legacy' && (
                                          <button className="text-[9px] font-bold text-amber-500 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/20">HIDE DEPRECATION BANNER</button>
                                       )}
                                       <button className="p-1.5 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                          <TrashIcon size={16} />
                                       </button>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </section>
                     </div>
                  )}

                  {activeTab === 'domains' && (
                     <div className="space-y-8">
                        <section className="space-y-6">
                           <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Custom Domains</h3>
                              <Button variant="secondary" size="sm" icon={<PlusIcon size={14} />}>Add Domain</Button>
                           </div>
                           
                           <div className="p-6 bg-slate-800/40 border border-slate-700 rounded-2xl space-y-6">
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center space-x-3">
                                    <GlobeIcon size={20} className="text-indigo-400" />
                                    <span className="text-lg font-bold text-white">docs.example.com</span>
                                 </div>
                                 <Badge variant="warning">PENDING VERIFICATION</Badge>
                              </div>

                              <div className="space-y-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
                                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">DNS Instructions</div>
                                 <div className="flex items-center justify-between text-xs border-b border-slate-800/50 pb-2">
                                    <span className="font-mono text-slate-400">TYPE: CNAME</span>
                                    <span className="font-mono text-indigo-400">cname.vercel-dns.com</span>
                                 </div>
                                 <div className="flex items-center justify-between text-xs pt-1">
                                    <span className="font-mono text-slate-400">NAME: docs</span>
                                    <button className="text-[9px] font-bold text-slate-500 hover:text-white uppercase tracking-tighter">Copy Value</button>
                                 </div>
                              </div>

                              <Button variant="primary" className="w-full">Check DNS Records</Button>
                           </div>
                        </section>
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* PREVIEW WINDOW (RIGHT) */}
         <div className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden group/preview">
            <header className="h-12 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 shrink-0 z-20">
               <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Build Preview</span>
               </div>
               
               <div className="flex bg-slate-800 rounded p-0.5 border border-slate-700">
                  <button 
                     onClick={() => setDevice('desktop')}
                     className={`p-1.5 rounded transition-all ${device === 'desktop' ? 'bg-slate-700 text-white shadow-inner' : 'text-slate-500'}`}
                  >
                     <MonitorIconProxy size={14} />
                  </button>
                  <button 
                     onClick={() => setDevice('mobile')}
                     className={`p-1.5 rounded transition-all ${device === 'mobile' ? 'bg-slate-700 text-white shadow-inner' : 'text-slate-500'}`}
                  >
                     <SmartphoneIconProxy size={14} />
                  </button>
               </div>
            </header>

            <div className="flex-1 overflow-hidden p-12 flex items-center justify-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-100">
               {/* Device Frame */}
               <div 
                  className={`bg-slate-900 border-2 border-slate-700 shadow-2xl transition-all duration-700 ease-in-out relative overflow-hidden flex flex-col ${
                     device === 'desktop' ? 'w-full h-full rounded-2xl' : 'w-[320px] h-[560px] rounded-[40px] border-[8px]'
                  }`}
               >
                  {device === 'mobile' && <div className="h-6 w-32 bg-slate-700 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-50" />}
                  
                  {/* Mock Site Header */}
                  <div className="h-12 border-b border-slate-800 bg-slate-900 flex items-center px-6 shrink-0 justify-between">
                     <div className="flex items-center">
                        <div className="w-6 h-6 rounded-md bg-indigo-500 mr-2" style={{ backgroundColor: config.primaryColor }} />
                        <span className="text-xs font-bold text-white truncate max-w-[120px]">{config.siteName}</span>
                     </div>
                     <div className="flex space-x-3 opacity-30">
                        <div className="w-8 h-2 bg-slate-700 rounded-full" />
                        <div className="w-8 h-2 bg-slate-700 rounded-full" />
                     </div>
                  </div>

                  <div className="flex-1 flex overflow-hidden">
                     {/* Mock Site Sidebar */}
                     {device === 'desktop' && (
                        <div className="w-[180px] border-r border-slate-800 bg-slate-900 p-4 space-y-4 shrink-0">
                           {config.navigation.map(nav => (
                              <div key={nav.id} className="space-y-2">
                                 <div className="text-[10px] font-bold text-slate-500 uppercase">{nav.label}</div>
                                 <div className="space-y-1 pl-1">
                                    {nav.children?.map(c => (
                                       <div key={c.id} className="h-1 w-20 bg-slate-800 rounded-full opacity-50" />
                                    ))}
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}

                     {/* Mock Site Content */}
                     <div className="flex-1 bg-slate-900 p-8 overflow-y-auto custom-scrollbar">
                        <div className="max-w-xl mx-auto space-y-6">
                           <div className="h-8 w-48 bg-slate-800 rounded-lg animate-pulse" />
                           <div className="space-y-2">
                              <div className="h-2 w-full bg-slate-800 rounded-full opacity-60" />
                              <div className="h-2 w-full bg-slate-800 rounded-full opacity-60" />
                              <div className="h-2 w-3/4 bg-slate-800 rounded-full opacity-60" />
                           </div>
                           <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 border-l-4" style={{ borderLeftColor: config.primaryColor }}>
                              <div className="h-1 w-24 bg-slate-700 rounded-full mb-3" />
                              <div className="h-2 w-full bg-slate-800 rounded-full opacity-40" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Sync Status Badge Overlay */}
            <div className="absolute bottom-6 right-6 bg-slate-900/80 backdrop-blur border border-indigo-500/30 px-3 py-1.5 rounded-full flex items-center space-x-2 shadow-2xl animate-in fade-in duration-1000">
               <ShieldIcon size={12} className="text-indigo-400" />
               <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Real-time Sandbox Active</span>
            </div>
         </div>

      </div>

    </div>
  );
};

// Sub-components

const NavItemEditor: React.FC<{ item: DocSiteNavItem }> = ({ item }) => {
   const [expanded, setExpanded] = useState(true);
   return (
      <div className="space-y-1">
         <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-700 group hover:border-indigo-500/30 transition-all cursor-grab active:cursor-grabbing">
            <div className="flex items-center space-x-3">
               <button onClick={() => setExpanded(!expanded)} className="text-slate-600 hover:text-slate-300">
                  {item.type === 'folder' ? (expanded ? <ChevronDownIcon size={12}/> : <ChevronRightIcon size={12}/>) : <FileTextIcon size={12} className="text-slate-500" />}
               </button>
               <span className={`text-xs ${item.type === 'folder' ? 'font-bold text-white' : 'text-slate-300'}`}>{item.label}</span>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
               <button className="p-1 text-slate-500 hover:text-white"><Edit2IconProxy size={12}/></button>
               <button className="p-1 text-slate-500 hover:text-red-400"><TrashIcon size={12}/></button>
            </div>
         </div>
         {expanded && item.children && (
            <div className="ml-6 border-l border-slate-800 pl-4 py-1 space-y-1">
               {item.children.map(child => (
                  <NavItemEditor key={child.id} item={child} />
               ))}
            </div>
         )}
      </div>
   );
};

const MonitorIconProxy: React.FC<any> = (props) => (
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
     <rect width="20" height="14" x="2" y="3" rx="2" />
     <line x1="8" x2="16" y1="21" y2="21" />
     <line x1="12" x2="12" y1="17" y2="21" />
   </svg>
 );

 const SmartphoneIconProxy: React.FC<any> = (props) => (
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
     <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
     <path d="M12 18h.01" />
   </svg>
 );

 const Edit2IconProxy: React.FC<any> = (props) => (
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
     <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
   </svg>
 );

export default DocSiteManager;
