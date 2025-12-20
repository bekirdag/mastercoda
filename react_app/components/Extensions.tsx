import React, { useState, useEffect } from 'react';
import { Extension, ExtensionCategory } from '../types';
import { MOCK_EXTENSIONS } from '../constants';
import Button from './Button';
import ExtensionDetail from './ExtensionDetail';
import { 
  SearchIcon, 
  GridIcon, 
  CheckCircleIcon, 
  PlusIcon, 
  ChevronRightIcon, 
  SettingsIcon, 
  RefreshCwIcon, 
  RotateCwIcon,
  ArrowUpIcon, 
  ActivityIcon,
  ShieldIcon,
  ZapIcon,
  FilterIcon
} from './Icons';

// Proxy for Box icon
const BoxIconProxy: React.FC<any> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 20}
    height={props.size || 20}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const StarIcon: React.FC<any> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 12}
    height={props.size || 12}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const Extensions: React.FC = () => {
  const [extensions, setExtensions] = useState<Extension[]>(MOCK_EXTENSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ExtensionCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<'Popular' | 'Trending' | 'Newest'>('Popular');
  const [selectedExtId, setSelectedExtId] = useState<string | null>(null);

  const categories: (ExtensionCategory | 'All')[] = ['All', 'Agents', 'Languages', 'Themes', 'Snippets'];

  const filteredExtensions = extensions.filter(ext => {
    const matchesSearch = ext.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         ext.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ext.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || ext.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedExtension = extensions.find(e => e.id === selectedExtId);

  const handleInstall = async (id: string) => {
    setExtensions(prev => prev.map(ext => 
      ext.id === id ? { ...ext, status: 'installing' } : ext
    ));

    // Simulate network latency
    await new Promise(r => setTimeout(r, 2000));

    setExtensions(prev => prev.map(ext => 
      ext.id === id ? { ...ext, status: 'installed' } : ext
    ));
  };

  const handleUninstall = (id: string) => {
    setExtensions(prev => prev.map(ext => 
      ext.id === id ? { ...ext, status: 'idle' } : ext
    ));
  };

  if (selectedExtension) {
     return (
        <ExtensionDetail 
           extension={selectedExtension} 
           onClose={() => setSelectedExtId(null)}
           onInstall={handleInstall}
           onUninstall={handleUninstall}
        />
     );
  }

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Search Hero Header */}
      <div className="shrink-0 bg-slate-900/50 border-b border-slate-800 p-8 pt-12 flex flex-col items-center justify-center text-center">
         <h1 className="text-4xl font-bold text-white tracking-tight mb-4 animate-in slide-in-from-top-2 duration-500">
            Extend your Intelligence.
         </h1>
         <p className="text-slate-400 max-w-lg mb-8 text-lg font-light leading-relaxed">
            Discover thousands of agents, themes, and toolsets crafted by the Master Coda community.
         </p>
         
         <div className="w-full max-w-2xl relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-25 group-focus-within:opacity-100 transition duration-500"></div>
            <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-xl shadow-2xl">
               <SearchIcon className="ml-4 text-slate-500" size={20} />
               <input 
                  type="text" 
                  placeholder="Search 2,000+ extensions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none text-lg text-white placeholder-slate-600 focus:ring-0 px-4 py-4"
               />
               <div className="h-6 w-px bg-slate-700 mx-2" />
               <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent border-none text-xs font-bold text-slate-400 uppercase tracking-widest focus:ring-0 mr-4 cursor-pointer hover:text-white transition-colors"
               >
                  <option value="Popular">Most Popular</option>
                  <option value="Trending">Trending</option>
                  <option value="Newest">Newest</option>
               </select>
            </div>
         </div>
      </div>

      {/* 2. Main Content Split */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* Sidebar: Categories & Management */}
         <aside className="w-[220px] border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
            <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar">
               
               {/* Group: Manage */}
               <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Manage</h3>
                  <button className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-slate-800 text-sm text-slate-400 hover:text-slate-200 transition-colors">
                     <div className="flex items-center">
                        <GridIcon size={16} className="mr-3" />
                        Installed
                     </div>
                     <span className="bg-slate-800 text-slate-500 text-[10px] px-1.5 py-0.5 rounded font-mono">
                        {extensions.filter(e => e.status === 'installed').length}
                     </span>
                  </button>
                  <button className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-slate-800 text-sm text-slate-400 hover:text-slate-200 transition-colors">
                     <div className="flex items-center">
                        <RefreshCwIcon size={16} className="mr-3" />
                        Updates
                     </div>
                     <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  </button>
               </div>

               {/* Group: Categories */}
               <div className="space-y-1">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Categories</h3>
                  {categories.map(cat => (
                     <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`w-full flex items-center px-2 py-2 rounded text-sm transition-all ${
                           activeCategory === cat 
                           ? 'bg-indigo-600/10 text-indigo-400 font-bold border-l-2 border-indigo-500' 
                           : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300 border-l-2 border-transparent'
                        }`}
                     >
                        {cat}
                     </button>
                  ))}
               </div>

               {/* Group: Recommended */}
               <div className="pt-4 border-t border-slate-800 space-y-4">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Recommended</h3>
                  <div className="px-2 space-y-4">
                     <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => setSelectedExtId('ext-rust-lsp')}>
                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-xs border border-slate-700 group-hover:border-indigo-500/50 transition-colors">
                           🦀
                        </div>
                        <div className="min-w-0">
                           <p className="text-xs font-bold text-slate-300 truncate">Rust Core</p>
                           <p className="text-[10px] text-slate-600">Based on your stack</p>
                        </div>
                     </div>
                  </div>
               </div>

            </div>
         </aside>

         {/* Grid Area */}
         <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
            <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
               
               {/* Featured Banner */}
               {activeCategory === 'All' && !searchQuery && (
                  <div className="relative h-[250px] w-full rounded-2xl overflow-hidden border border-indigo-500/30 shadow-2xl group cursor-pointer" onClick={() => setSelectedExtId('ext-vercel')}>
                     <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-950" />
                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                     
                     <div className="relative h-full flex flex-col justify-center px-12 space-y-4">
                        <Badge variant="info">PARTNER EXTENSION</Badge>
                        <h2 className="text-3xl font-bold text-white">Deploy to Vercel</h2>
                        <p className="text-slate-400 max-w-md text-sm leading-relaxed">
                           Streamline your frontend workflow. Push to staging, manage env vars, and view deployment logs without leaving Master Coda.
                        </p>
                        <div className="flex space-x-4 pt-2">
                           <Button variant="primary">Install Official Plugin</Button>
                           <Button variant="ghost">Learn More</Button>
                        </div>
                     </div>

                     {/* Visual Flourish */}
                     <div className="absolute right-12 top-1/2 -translate-y-1/2 w-48 h-48 bg-white/5 rounded-full border border-white/10 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-1000">
                        <span className="text-6xl text-white">▲</span>
                     </div>
                  </div>
               )}

               {/* Result Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                  {filteredExtensions.map(ext => (
                     <ExtensionCard 
                        key={ext.id} 
                        ext={ext} 
                        onInstall={() => handleInstall(ext.id)}
                        onClick={() => setSelectedExtId(ext.id)}
                        onSettings={() => window.location.hash = `/extensions/settings/${ext.id}`} // Using hash hack or standard prop navigation
                     />
                  ))}

                  {filteredExtensions.length === 0 && (
                     <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                        <BoxIconProxy size={64} className="text-slate-800 mb-6" />
                        <h3 className="text-xl font-bold text-slate-300">No results found</h3>
                        <p className="text-slate-500 max-w-xs mt-2">Try searching for a different keyword or checking another category.</p>
                        <Button 
                           variant="secondary" 
                           className="mt-6"
                           onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                        >
                           Clear All Filters
                        </Button>
                     </div>
                  )}
               </div>
            </div>
         </main>

      </div>
    </div>
  );
};

const ExtensionCard: React.FC<{ ext: Extension; onInstall: () => void; onClick: () => void; onSettings: () => void }> = ({ ext, onInstall, onClick, onSettings }) => {
   return (
      <article 
         onClick={onClick}
         className="group relative flex flex-col h-full bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800 hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] cursor-pointer"
      >
         {/* Card Header: Icon & Stats */}
         <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform duration-500">
               {typeof ext.icon === 'string' ? ext.icon : ext.icon}
            </div>
            <div className="flex flex-col items-end space-y-1">
               <div className="flex items-center text-amber-400">
                  <StarIcon className="mr-1" />
                  <span className="text-[10px] font-bold font-mono">{ext.rating}</span>
               </div>
               <div className="flex items-center text-slate-600">
                  <svg className="mr-1" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <span className="text-[9px] font-mono">{ext.downloads}</span>
               </div>
            </div>
         </div>

         {/* Title & Author */}
         <div className="mb-2">
            <h3 className="font-bold text-white text-sm group-hover:text-indigo-200 transition-colors truncate">
               {ext.title}
            </h3>
            <div className="flex items-center mt-0.5">
               <span className="text-[10px] text-slate-500 font-medium hover:text-slate-300 cursor-pointer">{ext.author}</span>
               {ext.verified && (
                  <CheckCircleIcon size={10} className="text-blue-500 ml-1.5" />
               )}
            </div>
         </div>

         {/* Description */}
         <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 mb-6 h-8">
            {ext.description}
         </p>

         {/* Footer Action */}
         <div className="mt-auto pt-4 border-t border-slate-700/50 flex items-center justify-between">
            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter">{ext.version}</span>
            
            <div className="flex items-center">
               <ExtensionButton status={ext.status} onClick={(e) => { e.stopPropagation(); onInstall(); }} />
               {ext.status === 'installed' && (
                  <button 
                     onClick={(e) => { 
                        e.stopPropagation(); 
                        // Simulate manual activePath update if parent doesn't provide it
                        const evt = new CustomEvent('app-navigate', { detail: `/extensions/settings/${ext.id}` });
                        window.dispatchEvent(evt);
                     }}
                     className="ml-2 p-1.5 text-slate-600 hover:text-white hover:bg-slate-700 rounded transition-colors opacity-0 group-hover:opacity-100"
                  >
                     <SettingsIcon size={14} />
                  </button>
               )}
            </div>
         </div>

         {/* Details Overlay on Hover */}
         <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="flex items-center text-[9px] font-bold text-slate-500 hover:text-white uppercase tracking-widest px-2 py-1 bg-slate-900/80 rounded backdrop-blur-sm">
               Details <ChevronRightIcon size={10} className="ml-1" />
            </button>
         </div>
      </article>
   );
};

const ExtensionButton: React.FC<{ status: Extension['status']; onClick: (e: React.MouseEvent) => void }> = ({ status, onClick }) => {
   if (status === 'installed') {
      return (
         <button className="px-3 py-1 rounded bg-slate-700/50 text-slate-400 text-[10px] font-bold uppercase cursor-default border border-slate-700">
            Installed
         </button>
      );
   }

   if (status === 'installing') {
      return (
         <button className="px-3 py-1 rounded bg-indigo-600/20 text-indigo-400 text-[10px] font-bold uppercase flex items-center border border-indigo-500/30">
            <RotateCwIcon size={10} className="animate-spin mr-2" />
            Installing
         </button>
      );
   }

   if (status === 'updating') {
      return (
         <button className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase shadow-lg shadow-emerald-900/20 animate-pulse transition-all">
            Update
         </button>
      );
   }

   return (
      <button 
         onClick={onClick}
         className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase shadow-lg shadow-indigo-900/20 transition-all active:scale-95"
      >
         Install
      </button>
   );
};

const Badge: React.FC<{ variant: 'success' | 'warning' | 'error' | 'info' | 'neutral'; children: React.ReactNode }> = ({ variant, children }) => {
  const styles = {
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    neutral: "bg-slate-700 text-slate-300 border-slate-600",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border self-start ${styles[variant]}`}>
      {children}
    </span>
  );
};

export default Extensions;