import React, { useState, useMemo } from 'react';
import Button from './Button';
import Badge from './Badge';
import { 
  HardDriveIcon, 
  RotateCwIcon, 
  TrashIcon, 
  AlertTriangleIcon, 
  CheckCircleIcon, 
  PlusIcon, 
  DownloadIcon, 
  ShieldIcon, 
  ActivityIcon,
  ChevronRightIcon,
  SearchIcon,
  LockIcon,
  ArrowRightIcon,
  DatabaseIcon,
  SparklesIcon,
  ChevronDownIcon
} from './Icons';

interface StorageCategory {
  id: string;
  label: string;
  size: number; // in MB
  color: string;
  description: string;
  actionLabel: string;
}

const INITIAL_CATEGORIES: StorageCategory[] = [
  { id: 'vector', label: 'Vector Indices', size: 4300, color: 'bg-indigo-500', description: 'Contains semantic embeddings for 12 projects.', actionLabel: 'Clear Unused Embeddings' },
  { id: 'logs', label: 'Conversation Logs', size: 1120, color: 'bg-emerald-500', description: 'Detailed execution traces and agent thought chains.', actionLabel: 'Purge Old Logs' },
  { id: 'models', label: 'Model Binaries', size: 12288, color: 'bg-purple-500', description: 'Downloaded local weights for Ollama / GGML.', actionLabel: 'Manage Binaries' },
  { id: 'cache', label: 'Web Cache', size: 800, color: 'bg-slate-500', description: 'Offline documentation and image previews.', actionLabel: 'Clear Cache' },
];

const StorageManager: React.FC = () => {
  const [categories, setCategories] = useState<StorageCategory[]>(INITIAL_CATEGORIES);
  const [isScanning, setIsScanning] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleteInput, setDeleteInput] = useState('');

  const totalSize = useMemo(() => categories.reduce((acc, c) => acc + c.size, 0), [categories]);
  const totalSizeGB = (totalSize / 1024).toFixed(1);

  const handleRefresh = async () => {
    setIsScanning(true);
    await new Promise(r => setTimeout(r, 1500));
    // Simulate small changes
    setCategories(prev => prev.map(c => ({ ...c, size: c.size + (Math.random() * 50 - 25) })));
    setIsScanning(false);
  };

  const handlePurge = (id: string) => {
    if (confirmDelete === id && deleteInput === 'DELETE') {
       setCategories(prev => prev.map(c => c.id === id ? { ...c, size: 0 } : c));
       setConfirmDelete(null);
       setDeleteInput('');
    } else {
       setConfirmDelete(id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-y-auto custom-scrollbar font-sans p-8">
      <div className="max-w-[1000px] mx-auto w-full space-y-12 animate-in fade-in duration-500 pb-20">
        
        {/* 1. Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-8">
           <div className="space-y-1">
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
                 <HardDriveIcon className="mr-3 text-indigo-400" size={32} />
                 Storage & Data Management
              </h1>
              <p className="text-slate-400">Optimize local footprint and manage application metadata.</p>
           </div>
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

        {/* 2. Storage Overview (Stacked Bar) */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Usage Breakdown</h3>
              <div className="text-sm font-bold text-white font-mono">
                 TOTAL FOOTPRINT: <span className="text-indigo-400">{totalSizeGB} GB</span>
              </div>
           </div>

           <div className="bg-slate-800/40 border border-slate-700 p-8 rounded-3xl space-y-8 shadow-2xl relative overflow-hidden">
              <div className="h-6 w-full bg-slate-900 rounded-full flex overflow-hidden border border-slate-700 shadow-inner">
                 {categories.map((cat, i) => (
                    <div 
                       key={cat.id} 
                       className={`${cat.color} transition-all duration-1000 ease-out h-full border-r border-black/10 last:border-0`}
                       style={{ width: `${(cat.size / totalSize) * 100}%` }}
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
                       <div className="text-lg font-bold text-white font-mono">
                          {cat.size > 1024 ? `${(cat.size / 1024).toFixed(1)} GB` : `${Math.round(cat.size)} MB`}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* 3. Category Management (The Cleanup Crew) */}
        <section className="space-y-6">
           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] px-1">Maintenance Tools</h3>
           
           <div className="space-y-4">
              {categories.map(cat => (
                 <div key={cat.id} className="bg-slate-800/40 border border-slate-700 rounded-3xl p-6 hover:border-slate-500 transition-all group overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                       <div className="flex items-start space-x-5">
                          <div className={`p-3 rounded-2xl bg-slate-900 border border-slate-700 group-hover:scale-110 transition-transform ${cat.color.replace('bg-', 'text-')}`}>
                             {cat.id === 'vector' ? <DatabaseIcon size={24}/> : 
                              cat.id === 'logs' ? <TerminalIcon size={24}/> : 
                              cat.id === 'models' ? <CpuIcon size={24}/> : 
                              <GlobeIcon size={24}/>}
                          </div>
                          <div>
                             <h4 className="text-base font-bold text-white">{cat.label}</h4>
                             <p className="text-sm text-slate-500 leading-relaxed mt-1 max-w-lg">{cat.description}</p>
                          </div>
                       </div>

                       <div className="shrink-0 flex items-center">
                          {confirmDelete === cat.id ? (
                             <div className="flex items-center space-x-3 animate-in slide-in-from-right-4">
                                <span className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">Type DELETE:</span>
                                <input 
                                   autoFocus
                                   value={deleteInput}
                                   onChange={(e) => setDeleteInput(e.target.value)}
                                   className="w-24 bg-slate-950 border border-red-500/30 rounded px-2 py-1 text-xs text-white outline-none focus:border-red-500 font-mono"
                                />
                                <Button variant="destructive" size="sm" onClick={() => handlePurge(cat.id)}>Purge</Button>
                                <button onClick={() => setConfirmDelete(null)} className="p-1 text-slate-500 hover:text-white"><XIcon size={16}/></button>
                             </div>
                          ) : (
                             <Button 
                                variant="secondary" 
                                size="sm" 
                                className="text-red-400 hover:text-red-300 hover:bg-red-950/20 border-red-500/20"
                                onClick={() => handlePurge(cat.id)}
                                disabled={cat.size === 0}
                             >
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
           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] px-1">Portability & Persistence</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 space-y-6 hover:border-indigo-500/50 transition-all shadow-xl group">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                    <DownloadIcon size={24} />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-xl font-bold text-white">Export Environment</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                       Pack your entire environment into a encrypted <code className="text-indigo-400 font-mono">.mcdbundle</code> file. 
                       Includes personas, skills, and projects.
                    </p>
                 </div>
                 <Button variant="primary" className="w-full h-12 shadow-lg shadow-indigo-900/20" icon={<ShieldIcon size={16}/>}>Create Secure Backup</Button>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 space-y-6 hover:border-emerald-500/50 transition-all shadow-xl group">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <PlusIcon size={24} />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-xl font-bold text-white">Migrate / Restore</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                       Import an existing <code className="text-emerald-400 font-mono">.mcdbundle</code> from another machine 
                       to instantly restore your entire AI configuration.
                    </p>
                 </div>
                 <Button variant="secondary" className="w-full h-12 hover:bg-emerald-500/10 hover:border-emerald-500/30" icon={<RotateCwIcon size={16}/>}>Upload Bundle</Button>
              </div>
           </div>
        </section>

        {/* 5. Warning Footnote */}
        <div className="p-6 bg-amber-950/10 border border-amber-500/20 rounded-2xl flex items-start gap-4">
           <AlertTriangleIcon size={20} className="text-amber-500 mt-0.5 shrink-0" />
           <div className="text-xs text-amber-200/80 leading-relaxed italic">
              <strong className="block mb-1 uppercase font-bold tracking-widest text-amber-400">Irreversible Action Warning</strong>
              Clearing the Vector Database or Agent Logs is permanent. Deleting indices will force all agents to re-scan your codebases on next interaction, which may take significant time for large repositories.
           </div>
        </div>

      </div>

      {/* Global Status Bar Overlay */}
      <footer className="h-10 shrink-0 bg-slate-900 border-t border-slate-800 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-30 fixed bottom-0 left-0 right-0">
         <div className="flex items-center space-x-12">
            <div className="flex items-center">
               <ShieldIcon size={12} className="mr-2 text-indigo-400" />
               ENCLAVE_SECURITY: <span className="ml-2 text-emerald-500">AES-256-READY</span>
            </div>
            <div className="flex items-center">
               <RotateCwIcon size={12} className="mr-2 text-indigo-400" />
               SYNC_AGENT: <span className="ml-2 text-slate-300 font-mono">STABLE</span>
            </div>
         </div>
         <div className="flex items-center space-x-4">
            <span className="text-slate-700 font-mono italic">SY-10_v4.2.1</span>
         </div>
      </footer>
    </div>
  );
};

export default StorageManager;