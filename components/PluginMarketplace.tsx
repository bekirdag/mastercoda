
import React, { useState, useMemo } from 'react';
import { Plugin, PluginCategory, PluginStatus } from '../types';
import { MOCK_PLUGINS } from '../constants';
import Button from './Button';
import Badge from './Badge';
import PluginConfigDrawer from './PluginConfigDrawer';
import { 
  SearchIcon, 
  RotateCwIcon, 
  PlusIcon, 
  ChevronRightIcon, 
  CheckCircleIcon, 
  AlertTriangleIcon, 
  ShieldIcon, 
  ZapIcon, 
  GlobeIcon, 
  LockIcon, 
  ActivityIcon,
  TrashIcon,
  SettingsIcon,
  StarIcon,
  RefreshCwIcon,
  XIcon,
  LinkIcon,
  FilterIcon
} from './Icons';

type Tab = 'Marketplace' | 'Installed' | 'Local';

const PluginMarketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Marketplace');
  const [plugins, setPlugins] = useState<Plugin[]>(MOCK_PLUGINS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<PluginCategory | 'All'>('All');
  const [configuringPluginId, setConfiguringPluginId] = useState<string | null>(null);

  const categories: (PluginCategory | 'All')[] = ['All', 'Productivity', 'Communication', 'Database', 'Dev Tools'];

  const filteredPlugins = useMemo(() => {
    return plugins.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTab = activeTab === 'Marketplace' || (activeTab === 'Installed' && p.status === 'installed');
      const matchCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchSearch && matchTab && matchCategory;
    });
  }, [plugins, searchQuery, activeTab, activeCategory]);

  const handleInstall = async (id: string) => {
    setPlugins(prev => prev.map(p => p.id === id ? { ...p, status: 'installing' } : p));
    
    // Simulate install latency
    await new Promise(r => setTimeout(r, 2000));
    
    setPlugins(prev => prev.map(p => p.id === id ? { ...p, status: 'installed' } : p));
  };

  const handleUpdate = async (id: string) => {
    setPlugins(prev => prev.map(p => p.id === id ? { ...p, status: 'installing' } : p));
    await new Promise(r => setTimeout(r, 1500));
    setPlugins(prev => prev.map(p => p.id === id ? { ...p, status: 'installed', updateAvailable: undefined } : p));
  };

  const stats = {
    installed: plugins.filter(p => p.status === 'installed').length,
    updates: plugins.filter(p => p.updateAvailable).length
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Header Toolbar */}
      <header className="h-[64px] border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 flex items-center justify-between px-8 z-30 sticky top-0 shadow-lg">
         <div className="flex items-center space-x-8">
            <div className="flex items-center">
               <LinkIcon className="mr-3 text-indigo-400" size={24} />
               <h1 className="text-xl font-bold text-white tracking-tight uppercase">Integrations Hub</h1>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            {/* Metrics HUD */}
            <div className="flex items-center space-x-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
               <div className="flex items-center">
                  <Badge variant="neutral" className="mr-2">{stats.installed}</Badge>
                  INSTALLED
               </div>
               {stats.updates > 0 && (
                  <div className="flex items-center text-amber-400">
                     <Badge variant="warning" className="mr-2">{stats.updates}</Badge>
                     UPDATES READY
                  </div>
               )}
            </div>
         </div>

         <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm" icon={<RefreshCwIcon size={14} />}>Update All</Button>
            <Button variant="primary" size="sm" icon={<PlusIcon size={14} />}>Import Plugin</Button>
         </div>
      </header>

      {/* 2. Filter & Search Bar */}
      <div className="h-14 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between px-8 shrink-0 z-20">
         <div className="flex items-center space-x-6">
            <div className="flex bg-slate-800 rounded p-1 border border-slate-700">
               {(['Marketplace', 'Installed', 'Local'] as Tab[]).map(t => (
                  <button
                     key={t}
                     onClick={() => setActiveTab(t)}
                     className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${
                        activeTab === t 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'text-slate-500 hover:text-slate-300'
                     }`}
                  >
                     {t}
                  </button>
               ))}
            </div>

            <div className="relative group">
               <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-all" />
               <input 
                  type="text" 
                  placeholder="Find integrations (Jira, Linear, GitHub)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:border-indigo-500 outline-none w-64 transition-all"
               />
            </div>
         </div>

         <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
               <FilterIcon size={14} className="text-slate-600" />
               {categories.map(cat => (
                  <button
                     key={cat}
                     onClick={() => setActiveCategory(cat)}
                     className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-tighter transition-all border ${
                        activeCategory === cat 
                        ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' 
                        : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                     }`}
                  >
                     {cat}
                  </button>
               ))}
            </div>
         </div>
      </div>

      {/* 3. Main Grid */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#0d1117]">
         <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500 pb-20">
            {filteredPlugins.map(plugin => (
               <PluginCard 
                  key={plugin.id} 
                  plugin={plugin} 
                  onInstall={() => handleInstall(plugin.id)}
                  onConfigure={() => setConfiguringPluginId(plugin.id)}
                  onUpdate={() => handleUpdate(plugin.id)}
               />
            ))}

            {filteredPlugins.length === 0 && (
               <div className="col-span-full py-40 flex flex-col items-center justify-center text-slate-700">
                  <ActivityIcon size={80} className="opacity-10 mb-6" />
                  <p className="text-xl font-bold uppercase tracking-[0.3em]">Registry Empty</p>
                  <p className="text-sm mt-2">Try a different keyword or check the marketplace</p>
               </div>
            )}
         </div>
      </main>

      {/* 4. Configuration Drawer Overlay */}
      {configuringPluginId && (
         <PluginConfigDrawer 
            plugin={plugins.find(p => p.id === configuringPluginId)!} 
            onClose={() => setConfiguringPluginId(null)}
         />
      )}

      {/* 5. Global Footer */}
      <footer className="h-10 bg-slate-900 border-t border-slate-800 shrink-0 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-30">
         <div className="flex items-center space-x-12">
            <div className="flex items-center">
               <ActivityIcon size={12} className="mr-2 text-indigo-400" />
               PLUGIN_SANDBOX: <span className="ml-2 text-emerald-500">ISOLATED_SECURE</span>
            </div>
            <div className="flex items-center">
               <ShieldIcon size={12} className="mr-2 text-indigo-400" />
               ADAPTER_SYNC: <span className="ml-2 text-slate-300">v1.4.2-STABLE</span>
            </div>
         </div>
         <div className="flex items-center space-x-4">
            <span className="text-slate-600 font-mono">NODE_HASH: MCP_REG_01</span>
            <div className="h-3 w-px bg-slate-800" />
            <button className="text-indigo-400 hover:text-indigo-300">Clear Cache &rsaquo;</button>
         </div>
      </footer>

    </div>
  );
};

const PluginCard: React.FC<{ 
  plugin: Plugin; 
  onInstall: () => void; 
  onConfigure: () => void;
  onUpdate: () => void;
}> = ({ plugin, onInstall, onConfigure, onUpdate }) => {
   const isInstalled = plugin.status === 'installed';
   const isInstalling = plugin.status === 'installing';
   
   return (
      <article className={`group relative flex flex-col bg-slate-900 border rounded-3xl p-6 transition-all duration-500 hover:shadow-2xl overflow-hidden ${
         plugin.healthStatus === 'error' ? 'border-red-500/30' : 
         isInstalled ? 'border-slate-800 hover:border-indigo-500/50' : 
         'border-slate-800 hover:border-emerald-500/50'
      }`}>
         {/* Background Vendor Watermark */}
         <div className="absolute top-2 right-2 text-6xl opacity-5 grayscale pointer-events-none group-hover:scale-110 transition-transform duration-1000">
            {plugin.icon}
         </div>

         {/* Header */}
         <div className="flex items-start justify-between mb-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-500">
               {plugin.icon}
            </div>
            <div className="flex flex-col items-end space-y-1">
               <div className="flex items-center text-amber-400">
                  <StarIcon size={12} className="mr-1" />
                  <span className="text-[10px] font-bold font-mono">{plugin.rating}</span>
               </div>
               <span className="text-[9px] font-mono text-slate-600">{plugin.downloads} DEPLOYS</span>
            </div>
         </div>

         {/* Info */}
         <div className="space-y-1 mb-4 flex-1">
            <div className="flex items-center space-x-2">
               <h3 className="text-base font-bold text-white group-hover:text-indigo-200 transition-colors">{plugin.title}</h3>
               {plugin.verified && <CheckCircleIcon size={12} className="text-blue-500" title="Master Coda Verified" />}
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{plugin.author}</p>
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 pt-2">{plugin.description}</p>
         </div>

         {/* Meta Stats */}
         <div className="grid grid-cols-2 gap-2 mb-6">
            <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800">
               <div className="text-[8px] font-bold text-slate-600 uppercase mb-0.5">Category</div>
               <div className="text-[10px] font-bold text-slate-300 truncate">{plugin.category}</div>
            </div>
            <div className="bg-slate-950/50 p-2 rounded-xl border border-slate-800">
               <div className="text-[8px] font-bold text-slate-600 uppercase mb-0.5">Version</div>
               <div className="text-[10px] font-bold text-indigo-400 font-mono">{plugin.version}</div>
            </div>
         </div>

         {/* Footer Actions */}
         <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
            {isInstalled ? (
               <>
                  <div className="flex items-center">
                     {plugin.updateAvailable ? (
                        <button 
                          onClick={onUpdate}
                          className="flex items-center px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-amber-900/20"
                        >
                           <RotateCwIcon size={12} className="mr-2" />
                           Update
                        </button>
                     ) : (
                        <div className="flex items-center text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                           <CheckCircleIcon size={14} className="mr-1.5" />
                           Installed
                        </div>
                     )}
                  </div>
                  <div className="flex items-center space-x-2">
                     <button 
                        onClick={onConfigure}
                        className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        title="Configuration Settings"
                     >
                        <SettingsIcon size={18} />
                     </button>
                  </div>
               </>
            ) : (
               <button 
                  onClick={onInstall}
                  disabled={isInstalling}
                  className={`w-full py-2.5 rounded-xl flex items-center justify-center font-bold text-xs uppercase tracking-widest transition-all shadow-lg ${
                     isInstalling 
                     ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 animate-pulse' 
                     : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/40'
                  }`}
               >
                  {isInstalling ? (
                     <>
                        <div className="w-3 h-3 rounded-full border-2 border-emerald-400/20 border-t-emerald-400 animate-spin mr-2" />
                        Provisioning...
                     </>
                  ) : (
                     <>
                        <PlusIcon size={14} className="mr-2" />
                        Deploy Adapter
                     </>
                  )}
               </button>
            )}
         </div>

         {/* Warning Badge for stale health */}
         {plugin.healthStatus === 'stale' && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-amber-950/90 backdrop-blur border border-amber-500/30 px-3 py-1 rounded-full flex items-center space-x-2 animate-in slide-in-from-top-4">
               <AlertTriangleIcon size={12} className="text-amber-500" />
               <span className="text-[8px] font-bold text-amber-200 uppercase tracking-widest whitespace-nowrap">API Deprecation Imminent</span>
            </div>
         )}
      </article>
   );
};

export default PluginMarketplace;
