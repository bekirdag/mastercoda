import React, { useState, useMemo, useEffect } from 'react';
import Button from './Button';
import Badge from './Badge';
// Added PlusIcon to imports to fix "Cannot find name 'PlusIcon'" error.
import { 
  HardDriveIcon, 
  RotateCwIcon, 
  TrashIcon, 
  AlertTriangleIcon, 
  CheckCircleIcon, 
  DownloadIcon, 
  ShieldIcon, 
  ActivityIcon,
  ChevronRightIcon,
  SearchIcon,
  LockIcon,
  ArrowRightIcon,
  DatabaseIcon,
  SparklesIcon,
  ChevronDownIcon,
  XIcon,
  GlobeIcon,
  CpuIcon,
  TerminalIcon,
  PlusIcon
} from './Icons';

interface StorageCategory {
  id: string;
  label: string;
  size: number; // in MB
  color: string;
  description: string;
  actionLabel: string;
  canOptimize?: boolean;
}

const INITIAL_CATEGORIES: StorageCategory[] = [
  { id: 'vector', label: 'Vector Indices', size: 4300, color: 'bg-indigo-500', description: 'Contains semantic embeddings for 12 projects. Essential for RAG performance.', actionLabel: 'Clear Unused Embeddings', canOptimize: true },
  { id: 'logs', label: 'Conversation Logs', size: 1120, color: 'bg-emerald-500', description: 'Detailed execution traces and agent thought chains from previous sessions.', actionLabel: 'Purge Old Logs' },
  { id: 'models', label: 'Model Binaries', size: 12288, color: 'bg-purple-500', description: 'Downloaded local weights for Ollama / GGML inference engines.', actionLabel: 'Manage Binaries' },
  { id: 'cache', label: 'Web Cache', size: 800, color: 'bg-slate-500', description: 'Offline documentation, image previews, and temporary build artifacts.', actionLabel: 'Clear Cache' },
];

const StorageManager: React.FC = () => {
  const [categories, setCategories] = useState<StorageCategory[]>(INITIAL_CATEGORIES);
  const [isScanning, setIsScanning] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleteInput, setDeleteInput] = useState('');
  const [isOptimizing, setIsOptimizing] = useState<string | null>(null);
  
  // Spec: Low Disk Warning state
  const [diskRemaining, setDiskRemaining] = useState(1.4); // 1.4 GB (Mocked < 2GB)
  const [showLowDiskAlert, setShowLowDiskAlert] = useState(true);

  // Spec: Double confirmation for Vector DB
  const [showVectorConfirm, setShowVectorConfirm] = useState(false);

  const totalSize = useMemo(() => categories.reduce((acc, c) => acc + c.size, 0), [categories]);
  const totalSizeGB = (totalSize / 1024).toFixed(1);

  const handleRefresh = async () => {
    setIsScanning(true);
    // Spec: "Refresh" icon rotates while scanning
    await new Promise(r => setTimeout(r, 1500));
    setCategories(prev => prev.map(c => ({ ...c, size: c.size + (Math.random() * 50 - 25) })));
    setIsScanning(false);
  };

  const handlePurge = (id: string) => {
    // Spec: Irreversible action for Vector DB requires double confirmation
    if (id === 'vector' && !showVectorConfirm) {
      setShowVectorConfirm(true);
      return;
    }

    if (confirmDelete === id && deleteInput === 'DELETE') {
       setCategories(prev => prev.map(c => c.id === id ? { ...c, size: 0 } : c));
       setConfirmDelete(null);
       setDeleteInput('');
       setShowVectorConfirm(false);
       // Re-calculate disk space after purge (mock)
       setDiskRemaining(prev => prev + 2.5);
    } else {
       setConfirmDelete(id);
    }
  };

  const handleOptimize = async (id: string) => {
    setIsOptimizing(id);
    // Spec: Performs VACUUM commands on SQLite databases
    await new Promise(r => setTimeout(r, 2000));
    setCategories(prev => prev.map(c => c.id === id ? { ...c, size: Math.max(0, c.size * 0.9) } : c));
    setIsOptimizing(null);
  };

  const navigateToBilling = () => {
    const evt = new CustomEvent('app-navigate', { detail: '/settings/billing' });
    window.dispatchEvent(evt);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-y-auto custom-scrollbar font-sans p-8">
      <div className="max-w-[1000px] mx-auto w-full space-y-12 animate-in fade-in duration-500 pb-32">
        
        {/* 1. Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-8">
           <div className="space-y-1">
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
                 <HardDriveIcon className="mr-3 text-indigo-400" size={32} />
                 Storage & Data Management
              </h1>
              <p className="text-slate-400">Optimize local footprint and manage application metadata enclaves.</p>
           </div>
           <div className="flex items-center space-x-3">
              <Button 
                variant="secondary" 
                size="sm" 
                icon={<RotateCwIcon size={14} className={isScanning ? 'animate-spin' : ''} />}
                onClick={handleRefresh}
                disabled={isScanning}
              >
                {isScanning ? 'Scanning Disk...' : 'Recalculate Sizes'}
              </Button>
           </div>
        </div>

        {/* Spec: Low Disk Warning Alert */}
        {diskRemaining < 2 && showLowDiskAlert && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
             <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center animate-pulse">
                   <AlertTriangleIcon size={24} />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-white uppercase tracking-tight">Critical Storage Warning</h3>
                   <p className="text-sm text-red-300/70">Remaining disk space is low (<span className="font-bold">{diskRemaining} GB</span>). Application performance and agent indexing may be suppressed.</p>
                </div>
             </div>
             <div className="flex items-center space-x-3">
                <Button variant="primary" size="sm" className="bg-red-600 hover:bg-red-500 border-none shadow-lg shadow-red-900/30" onClick={() => handleRefresh()}>Emergency Cleanup</Button>
                <button onClick={() => setShowLowDiskAlert(false)} className="p-1 text-slate-500 hover:text-white"><XIcon size={20}/></button>
             </div>
          </div>
        )}

        {/* 2. Storage Overview (Stacked Bar) */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Local Application Footprint</h3>
              <div className="text-sm font-bold text-white font-mono">
                 TOTAL SIZE: <span className="text-indigo-400">{totalSizeGB} GB</span>
              </div>
           </div>

           <div className="bg-slate-800/40 border border-slate-700 p-8 rounded-3xl space-y-8 shadow-2xl relative overflow-hidden group">
              {/* Progress Track */}
              <div className="h-8 w-full bg-slate-900 rounded-2xl flex overflow-hidden border border-slate-700 shadow-inner p-1">
                 {categories.map((cat) => (
                    <div 
                       key={cat.id} 
                       className={`${cat.color} transition-all duration-1000 ease-out h-full border-r border-black/20 last:border-0 rounded-sm hover:brightness-110`}
                       style={{ width: `${(cat.size / totalSize) * 100}%` }}
                       title={`${cat.label}: ${Math.round(cat.size)} MB`}
                    />
                 ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {categories.map(cat => (
                    <div key={cat.id} className="space-y-1">
                       <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          <div className={`w-2 h-2 rounded-full ${cat.color} mr-2`} />
                          {cat.label}
                       </div>
                       <div className="text-2xl font-bold text-white font-mono tracking-tighter">
                          {cat.size > 1024 ? `${(cat.size / 1024).toFixed(1)} GB` : `${Math.round(cat.size)} MB`}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* 3. Category Management (The Cleanup Crew) */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Maintenance & Housekeeping</h3>
              <span className="text-[10px] text-slate-600 font-mono">DAEMON_WATCHER: ACTIVE</span>
           </div>
           
           <div className="space-y-4">
              {categories.map(cat => (
                 <div key={cat.id} className={`bg-slate-800/40 border border-slate-700 rounded-3xl p-6 transition-all group overflow-hidden ${confirmDelete === cat.id ? 'border-red-500/30 ring-1 ring-red-500/10' : 'hover:border-slate-500'}`}>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                       <div className="flex items-start space-x-6">
                          <div className={`p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-lg group-hover:scale-110 transition-transform ${cat.color.replace('bg-', 'text-')}`}>
                             {cat.id === 'vector' ? <DatabaseIcon size={24}/> : 
                              cat.id === 'logs' ? <TerminalIcon size={24}/> : 
                              cat.id === 'models' ? <CpuIcon size={24}/> : 
                              <GlobeIcon size={24}/>}
                          </div>
                          <div className="space-y-1">
                             <div className="flex items-center space-x-3">
                                <h4 className="text-lg font-bold text-white">{cat.label}</h4>
                                <Badge variant="neutral">{cat.size > 1024 ? `${(cat.size / 1024).toFixed(1)} GB` : `${Math.round(cat.size)} MB`}</Badge>
                             </div>
                             <p className="text-sm text-slate-500 leading-relaxed max-w-xl">{cat.description}</p>
                          </div>
                       </div>

                       <div className="shrink-0 flex items-center space-x-3">
                          {cat.canOptimize && !confirmDelete && (
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="text-indigo-400 hover:text-indigo-300 border-indigo-500/20"
                              onClick={() => handleOptimize(cat.id)}
                              disabled={isOptimizing === cat.id || cat.size === 0}
                            >
                              {isOptimizing === cat.id ? <RotateCwIcon size={14} className="animate-spin mr-2" /> : <SparklesIcon size={14} className="mr-2" />}
                              Optimize Index
                            </Button>
                          )}

                          {confirmDelete === cat.id ? (
                             <div className="flex items-center space-x-3 animate-in slide-in-from-right-4">
                                <div className="flex flex-col items-end">
                                   <span className="text-[10px] font-bold text-red-400 uppercase tracking-tighter mb-1">Type DELETE to confirm</span>
                                   <input 
                                      autoFocus
                                      value={deleteInput}
                                      onChange={(e) => setDeleteInput(e.target.value)}
                                      className="w-24 bg-slate-950 border border-red-500/40 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-red-500 font-mono shadow-inner"
                                      onKeyDown={(e) => e.key === 'Enter' && handlePurge(cat.id)}
                                   />
                                </div>
                                <Button variant="destructive" size="sm" className="shadow-lg shadow-red-900/20" onClick={() => handlePurge(cat.id)}>Confirm Purge</Button>
                                <button onClick={() => { setConfirmDelete(null); setDeleteInput(''); }} className="p-1 text-slate-500 hover:text-white"><XIcon size={16}/></button>
                             </div>
                          ) : (
                             <Button 
                                variant="secondary" 
                                size="sm" 
                                className="text-red-400 hover:text-red-300 hover:bg-red-950/20 border-red-500/20"
                                onClick={() => handlePurge(cat.id)}
                                disabled={cat.size === 0 || isOptimizing === cat.id}
                             >
                                <TrashIcon size={14} className="mr-2" />
                                {cat.actionLabel}
                             </Button>
                          )}
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </section>

        {/* 4. Backup & Migration (Portability Cards) */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Portability & Persistence</h3>
              {/* Spec: Manage Cloud Backup outbound link */}
              <button 
                onClick={navigateToBilling}
                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-all flex items-center"
              >
                 <GlobeIcon size={12} className="mr-1.5" /> Manage Cloud Sync
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-10 space-y-8 hover:border-indigo-500/50 transition-all shadow-xl group relative overflow-hidden">
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all" />
                 <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform shadow-lg">
                    <DownloadIcon size={28} />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-2xl font-bold text-white tracking-tight">Export Environment</h4>
                    <p className="text-slate-400 leading-relaxed font-light">
                       Pack your entire localized persona, custom skills, and indexed project metadata into an encrypted <code className="text-indigo-400 font-mono text-xs">.mcdbundle</code> file for migration.
                    </p>
                 </div>
                 <Button variant="primary" className="w-full h-14 text-base shadow-lg shadow-indigo-900/30 uppercase font-bold tracking-widest" icon={<ShieldIcon size={18}/>}>Create Secure Backup</Button>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-10 space-y-8 hover:border-emerald-500/50 transition-all shadow-xl group relative overflow-hidden">
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all" />
                 <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-lg">
                    <PlusIcon size={28} />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-2xl font-bold text-white tracking-tight">Migrate / Restore</h4>
                    <p className="text-slate-400 leading-relaxed font-light">
                       Import a valid <code className="text-emerald-400 font-mono text-xs">.mcdbundle</code> from another instance to instantly provision this node with your existing engineering intelligence.
                    </p>
                 </div>
                 <Button variant="secondary" className="w-full h-14 text-base hover:bg-emerald-500/10 hover:border-emerald-500/40 uppercase font-bold tracking-widest" icon={<RotateCwIcon size={18}/>}>Upload Bundle</Button>
              </div>
           </div>
        </section>

        {/* 5. Warning Footnote */}
        <div className="p-8 bg-amber-950/10 border border-amber-500/20 rounded-3xl flex items-start gap-6 shadow-sm">
           <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 shrink-0">
              <AlertTriangleIcon size={24} />
           </div>
           <div className="text-sm text-amber-200/80 leading-relaxed font-light">
              <strong className="block mb-2 uppercase font-bold tracking-[0.2em] text-amber-400">Irreversible Action Warning</strong>
              Manual purging of the **Vector Database** or **Agent Logs** is a permanent operation. 
              Deleting project indices will force all agents to re-scan your source repositories on next interaction, 
              which may take several hours for high-density codebases.
           </div>
        </div>

      </div>

      {/* Global Status Bar Overlay */}
      <footer className="h-12 shrink-0 bg-slate-900 border-t border-slate-800 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-30 fixed bottom-0 left-0 right-0">
         <div className="flex items-center space-x-12">
            <div className="flex items-center">
               <ShieldIcon size={14} className="mr-2 text-indigo-400" />
               ENCLAVE_SECURITY: <span className="ml-2 text-emerald-500">AES-256-GCM_ACTIVE</span>
            </div>
            <div className="flex items-center">
               <RotateCwIcon size={14} className="mr-2 text-indigo-400" />
               SYNC_AGENT: <span className="ml-2 text-slate-300 font-mono uppercase">Node_Enclave_01</span>
            </div>
         </div>
         <div className="flex items-center space-x-6">
            <div className="flex items-center text-indigo-400">
               <LockIcon size={12} className="mr-1.5" />
               LOCAL_DISK_ONLY
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <span className="text-slate-600 font-mono italic">SY-10_v4.2.1-PRO</span>
         </div>
      </footer>

      {/* Spec: Double Confirmation Modal for Vector DB */}
      {showVectorConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-md bg-slate-900 border border-red-500/30 rounded-3xl shadow-[0_0_100px_rgba(239,68,68,0.1)] overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 text-center space-y-6">
                 <div className="w-20 h-20 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/20">
                    <DatabaseIcon size={40} />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">Re-Index Required?</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                       Deleting indices will force all agents to **re-scan and re-embed** your codebases. This may take several hours and consume significant API tokens.
                    </p>
                 </div>
                 <div className="pt-4 flex flex-col space-y-3">
                    <Button 
                       variant="primary" 
                       className="w-full bg-red-600 hover:bg-red-500 border-none h-12 uppercase font-bold tracking-widest"
                       onClick={() => handlePurge('vector')}
                    >
                       Continue with Purge
                    </Button>
                    <Button variant="ghost" className="w-full" onClick={() => { setShowVectorConfirm(false); setConfirmDelete(null); }}>
                       Abort Operation
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default StorageManager;