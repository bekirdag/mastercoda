
import React, { useState, useMemo } from 'react';
import { Extension, ExtensionPermission } from '../types';
import { MOCK_EXTENSIONS } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  SearchIcon, 
  TrashIcon, 
  SettingsIcon, 
  ChevronDownIcon, 
  ChevronRightIcon, 
  ShieldIcon, 
  ActivityIcon, 
  RotateCwIcon,
  AlertTriangleIcon,
  XIcon,
  CheckCircleIcon,
  FilterIcon
} from './Icons';

const ExtensionManager: React.FC = () => {
  const [extensions, setExtensions] = useState<Extension[]>(MOCK_EXTENSIONS.filter(e => e.status === 'installed'));
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'enabled' | 'disabled' | 'updates'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'startup' | 'memory'>('name');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [auditPermission, setAuditPermission] = useState<{ extId: string, perm: ExtensionPermission } | null>(null);
  const [safeMode, setSafeMode] = useState(false);

  // Derived calculations
  const totalStartupTime = useMemo(() => extensions.reduce((acc, e) => acc + (e.startupTimeMs || 0), 0), [extensions]);
  const totalMemory = useMemo(() => extensions.reduce((acc, e) => acc + (e.memoryUsageMb || 0), 0), [extensions]);

  const filteredExtensions = useMemo(() => {
    return extensions
      .filter(ext => {
        const matchesSearch = ext.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             ext.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = filter === 'all' || 
                          (filter === 'enabled' && ext.isEnabled) || 
                          (filter === 'disabled' && !ext.isEnabled) ||
                          (filter === 'updates' && ext.status === 'updating');
        return matchesSearch && matchesTab;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.title.localeCompare(b.title);
        if (sortBy === 'startup') return (b.startupTimeMs || 0) - (a.startupTimeMs || 0);
        if (sortBy === 'memory') return (b.memoryUsageMb || 0) - (a.memoryUsageMb || 0);
        return 0;
      });
  }, [extensions, searchQuery, filter, sortBy]);

  const toggleExtension = (id: string) => {
    setExtensions(prev => prev.map(e => e.id === id ? { ...e, isEnabled: !e.isEnabled } : e));
    // Simulation: would normally show toast here
  };

  const uninstall = (id: string) => {
    if (confirm(`Uninstall ${id}? Associated configuration will be archived.`)) {
      setExtensions(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleAuditClick = (extId: string, perm: ExtensionPermission) => {
    setAuditPermission({ extId, perm });
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Toolbar */}
      <header className="h-[64px] border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 flex items-center justify-between px-8 z-20">
         <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
               <SettingsIcon className="mr-2 text-indigo-400" size={22} />
               Installed Extensions
            </h1>

            <div className="h-6 w-px bg-slate-800" />

            {/* Filter Group */}
            <div className="flex items-center bg-slate-800 rounded p-1 border border-slate-700">
               {(['all', 'enabled', 'disabled'] as const).map(f => (
                  <button
                     key={f}
                     onClick={() => setFilter(f)}
                     className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                        filter === f 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-300'
                     }`}
                  >
                     {f}
                  </button>
               ))}
            </div>

            {/* Search */}
            <div className="relative">
               <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
               <input 
                  type="text" 
                  placeholder="Filter local extensions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-800/80 border border-slate-700 rounded-md py-1.5 pl-9 pr-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 w-48 transition-all"
               />
            </div>
         </div>

         <div className="flex items-center space-x-3">
            <button 
              onClick={() => setSafeMode(!safeMode)}
              className={`flex items-center px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                safeMode 
                ? 'bg-red-500/10 border-red-500 text-red-400' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
               <ShieldIcon size={14} className="mr-2" />
               {safeMode ? 'SAFE MODE ACTIVE' : 'Safe Mode'}
            </button>
            <div className="h-6 w-px bg-slate-700 mx-2" />
            <Button variant="secondary" size="sm" icon={<RotateCwIcon size={14} />}>Update All (0)</Button>
         </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
         <div className="max-w-5xl mx-auto space-y-4">
            
            {/* Safe Mode Banner */}
            {safeMode && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start space-x-3 animate-in fade-in slide-in-from-top-2">
                 <AlertTriangleIcon className="text-red-500 shrink-0 mt-0.5" size={18} />
                 <div className="text-sm text-red-200/80">
                    <strong className="text-red-400 block mb-1">Diagnostic Mode</strong>
                    All extensions are currently suppressed to troubleshoot startup instability. Re-enable them individually to verify compatibility.
                 </div>
              </div>
            )}

            {/* Table-ish View */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden shadow-sm">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-900/50 border-b border-slate-700 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <th className="px-6 py-3 w-[300px]">Extension</th>
                        <th className="px-6 py-3 text-center">Status</th>
                        <th className="px-6 py-3">Permissions</th>
                        <th className="px-6 py-3 cursor-pointer group" onClick={() => setSortBy(sortBy === 'startup' ? 'name' : 'startup')}>
                           <div className="flex items-center">
                              Impact 
                              <ChevronDownIcon size={10} className={`ml-1 transition-opacity ${sortBy === 'startup' ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`} />
                           </div>
                        </th>
                        <th className="px-6 py-3 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {filteredExtensions.map(ext => (
                        <React.Fragment key={ext.id}>
                           <tr 
                              className={`group hover:bg-slate-800/60 transition-colors cursor-pointer border-b border-slate-800/50 last:border-0 ${!ext.isEnabled || safeMode ? 'opacity-60' : ''}`}
                              onClick={() => setExpandedId(expandedId === ext.id ? null : ext.id)}
                           >
                              <td className="px-6 py-4">
                                 <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xl shadow-inner">
                                       {typeof ext.icon === 'string' ? ext.icon : ext.icon}
                                    </div>
                                    <div className="min-w-0">
                                       <div className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors truncate">{ext.title}</div>
                                       <div className="text-[10px] font-mono text-slate-500">{ext.version} • {ext.author}</div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex justify-center">
                                    <button 
                                       onClick={(e) => { e.stopPropagation(); toggleExtension(ext.id); }}
                                       disabled={safeMode}
                                       className={`w-10 h-5 rounded-full p-1 transition-all duration-300 relative ${ext.isEnabled && !safeMode ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-slate-700'}`}
                                    >
                                       <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${ext.isEnabled && !safeMode ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </button>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex flex-wrap gap-1.5">
                                    {ext.permissions?.map(p => (
                                       <button 
                                          key={p.id}
                                          onClick={(e) => { e.stopPropagation(); handleAuditClick(ext.id, p); }}
                                          className="px-1.5 py-0.5 rounded bg-slate-700 border border-slate-600 text-[9px] font-bold text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 transition-all uppercase"
                                       >
                                          {p.label}
                                       </button>
                                    )) || <span className="text-[10px] text-slate-600 italic">None</span>}
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="space-y-1.5">
                                    <div className={`text-[10px] font-mono font-bold ${
                                       (ext.startupTimeMs || 0) > 300 ? 'text-red-400' : 
                                       (ext.startupTimeMs || 0) > 100 ? 'text-amber-400' : 
                                       'text-emerald-400'
                                    }`}>
                                       {ext.startupTimeMs}ms activation
                                    </div>
                                    <div className="w-16 h-1 bg-slate-900 rounded-full overflow-hidden">
                                       <div 
                                          className={`h-full transition-all duration-1000 ${
                                             (ext.startupTimeMs || 0) > 300 ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]' : 
                                             (ext.startupTimeMs || 0) > 100 ? 'bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]' : 
                                             'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]'
                                          }`}
                                          style={{ width: `${Math.min(100, (ext.startupTimeMs || 0) / 5)}%` }} 
                                       />
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center justify-end space-x-2">
                                    <button 
                                       onClick={(e) => { e.stopPropagation(); const evt = new CustomEvent('app-navigate', { detail: `/extensions/settings/${ext.id}` }); window.dispatchEvent(evt); }}
                                       className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded transition-colors"
                                       title="Settings"
                                    >
                                       <SettingsIcon size={16} />
                                    </button>
                                    <button 
                                       onClick={(e) => { e.stopPropagation(); uninstall(ext.id); }}
                                       className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded transition-colors"
                                       title="Uninstall"
                                    >
                                       <TrashIcon size={16} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                           {expandedId === ext.id && (
                              <tr className="bg-slate-900/40 border-b border-slate-800/50">
                                 <td colSpan={5} className="px-6 py-6 animate-in slide-in-from-top-1 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                       <div className="space-y-4">
                                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Extension Summary</h4>
                                          <p className="text-xs text-slate-400 leading-relaxed">{ext.description}</p>
                                          {ext.dependencies && (
                                             <div className="space-y-1">
                                                <span className="text-[9px] text-slate-600 font-bold">DEPENDS ON</span>
                                                <div className="flex flex-wrap gap-2">
                                                   {ext.dependencies.map(d => (
                                                      <span key={d} className="px-1.5 py-0.5 rounded bg-indigo-900/20 text-indigo-400 text-[10px] font-mono border border-indigo-500/20">{d}</span>
                                                   ))}
                                                </div>
                                             </div>
                                          )}
                                       </div>
                                       <div className="space-y-4">
                                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recent Activity Log</h4>
                                          <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                                             {ext.recentErrors && ext.recentErrors.length > 0 ? (
                                                ext.recentErrors.map((err, i) => (
                                                   <div key={i} className="flex items-start p-2 bg-red-950/10 border border-red-500/20 rounded text-[10px] font-mono text-red-400">
                                                      <AlertTriangleIcon size={10} className="mr-2 mt-0.5 shrink-0" />
                                                      {err}
                                                   </div>
                                                ))
                                             ) : (
                                                <div className="flex items-center text-[10px] text-emerald-500 font-mono">
                                                   <CheckCircleIcon size={12} className="mr-2" />
                                                   NO RUNTIME ERRORS DETECTED
                                                </div>
                                             )}
                                             <div className="text-[9px] text-slate-600 font-mono">
                                                [08:42:15] Extension Host: Activation successful in {ext.startupTimeMs}ms
                                             </div>
                                          </div>
                                       </div>
                                       <div className="space-y-4">
                                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resources</h4>
                                          <div className="grid grid-cols-2 gap-3">
                                             <button className="flex items-center p-2 bg-slate-800 hover:bg-slate-750 rounded-lg text-[10px] font-bold text-slate-400 transition-all border border-slate-700">
                                                <ActivityIcon size={12} className="mr-2" /> METRICS
                                             </button>
                                             <button className="flex items-center p-2 bg-slate-800 hover:bg-slate-750 rounded-lg text-[10px] font-bold text-slate-400 transition-all border border-slate-700">
                                                <RotateCwIcon size={12} className="mr-2" /> RE-INDEX
                                             </button>
                                          </div>
                                          <button 
                                             onClick={() => { const evt = new CustomEvent('app-navigate', { detail: `/extensions/settings/${ext.id}` }); window.dispatchEvent(evt); }}
                                             className="w-full py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                                          >
                                             Advanced Configuration
                                          </button>
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
         </div>
      </main>

      {/* 3. Performance Footer */}
      <footer className="h-14 shrink-0 bg-slate-900 border-t border-slate-800 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-30">
         <div className="flex items-center space-x-12">
            <div className="flex items-center">
               <ActivityIcon size={14} className="mr-2 text-indigo-400" />
               TOTAL STARTUP OVERHEAD: <span className={`ml-2 font-mono ${totalStartupTime > 1000 ? 'text-red-400' : 'text-emerald-400'}`}>{totalStartupTime}ms</span>
            </div>
            <div className="flex items-center">
               <RotateCwIcon size={14} className="mr-2 text-indigo-400" />
               MEMORY FOOTPRINT: <span className="ml-2 text-slate-300 font-mono">{totalMemory} MB</span>
            </div>
         </div>
         <div className="flex items-center text-emerald-500">
            <CheckCircleIcon size={14} className="mr-2" />
            ISOLATION ENGINE: V8_SANDBOX_ACTIVE
         </div>
      </footer>

      {/* 4. Audit Modal */}
      {auditPermission && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center">
                     <ShieldIcon size={20} className="text-indigo-400 mr-3" />
                     <h3 className="font-bold text-white">Permission Audit</h3>
                  </div>
                  <button onClick={() => setAuditPermission(null)} className="text-slate-500 hover:text-white transition-colors">
                     <XIcon size={20} />
                  </button>
               </div>
               <div className="p-6 space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Requested Access</label>
                     <div className="p-4 bg-slate-850 rounded-xl border border-slate-800 flex items-start">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 mr-4">
                           <ActivityIcon size={20} />
                        </div>
                        <div>
                           <div className="font-bold text-white mb-1">{auditPermission.perm.label}</div>
                           <div className="text-xs text-slate-400 leading-relaxed">{auditPermission.perm.description}</div>
                        </div>
                     </div>
                  </div>
                  
                  <div className="bg-red-950/10 border border-red-500/20 rounded-xl p-4 flex items-start space-x-3">
                     <AlertTriangleIcon className="text-red-500 shrink-0 mt-0.5" size={16} />
                     <p className="text-xs text-red-300/80 leading-relaxed">
                        Revoking this access may cause the extension to crash or behave unpredictably. Critical systems dependencies cannot be revoked.
                     </p>
                  </div>
               </div>
               <div className="p-6 bg-slate-850 border-t border-slate-800 flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setAuditPermission(null)}>Cancel</Button>
                  <Button 
                    variant="destructive" 
                    disabled={!auditPermission.perm.revocable}
                    onClick={() => { alert('Permission revoked (simulated)'); setAuditPermission(null); }}
                  >
                     {auditPermission.perm.revocable ? 'Revoke Access' : 'Immutable Permission'}
                  </Button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default ExtensionManager;
