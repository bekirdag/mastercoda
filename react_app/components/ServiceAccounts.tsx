import React, { useState } from 'react';
import { ServiceAccount, AuthorizedExtension } from '../types';
import { MOCK_SERVICE_ACCOUNTS } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  UserIcon, 
  RotateCwIcon, 
  SettingsIcon, 
  ShieldIcon, 
  LockIcon, 
  ExternalLinkIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  XCircleIcon,
  ChevronRightIcon,
  XIcon,
  PlusIcon,
  RefreshCwIcon,
  ActivityIcon,
  CloudIcon,
  ServerIcon,
  DatabaseIcon,
  MoreVerticalIcon,
  TrashIcon
} from './Icons';

const ServiceAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<ServiceAccount[]>(MOCK_SERVICE_ACCOUNTS);
  const [managingId, setManagingId] = useState<string | null>(null);
  const [isSyncOn, setIsSyncOn] = useState(true);

  const managingAccount = accounts.find(a => a.id === managingId);

  const handleSignOut = (id: string) => {
    if (confirm('Are you sure you want to revoke this session?')) {
      setAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleReauth = async (id: string) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, status: 'connecting' } : a));
    // Simulate OAuth flow
    await new Promise(r => setTimeout(r, 2000));
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, status: 'connected', lastVerified: 'Just now' } : a));
  };

  const handleRevokeExtension = (accId: string, extId: string) => {
     // The AccessManagerModal handles the visual "shake" before closing or updating
     setAccounts(prev => prev.map(a => {
        if (a.id === accId) {
            return {
                ...a,
                authorizedExtensions: a.authorizedExtensions.filter(e => e.id !== extId)
            };
        }
        return a;
     }));
  };

  return (
    <div className="p-8 max-w-[900px] mx-auto space-y-10 animate-in fade-in duration-500 pb-32 font-sans">
      
      {/* 1. Identity Header Hero (EX-11 Section) */}
      <section className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl relative group">
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-800 to-slate-900 -z-10" />
         <div className="p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center p-1 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                   <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-4xl">
                      👩‍💻
                   </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 border-4 border-slate-800 flex items-center justify-center text-white">
                   <CheckCircleIcon size={14} />
                </div>
            </div>

            <div className="flex-1 text-center md:text-left">
               <h1 className="text-3xl font-bold text-white tracking-tight">Alice Dev</h1>
               <p className="text-slate-400 font-mono text-sm mt-1">alice@example.com</p>
               <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <div className="flex items-center px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
                     <RotateCwIcon size={12} className={`mr-2 ${isSyncOn ? 'animate-pulse' : ''}`} />
                     SETTINGS SYNC: {isSyncOn ? 'ACTIVE' : 'DISABLED'}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">Last synced: 2m ago</span>
               </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
               <Button variant="primary" size="sm" onClick={() => setIsSyncOn(!isSyncOn)}>
                  {isSyncOn ? 'Manage Sync Settings' : 'Enable Sync'}
               </Button>
               <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">Sign Out</Button>
            </div>
         </div>
      </section>

      {/* 2. Connected Services List (EX-11 Section) */}
      <section className="space-y-6">
         <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center">
               <ShieldIcon size={16} className="mr-2 text-indigo-400" />
               Connected Service Sessions
            </h2>
            <div className="flex items-center space-x-2">
               <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-tighter">Audit Logs</button>
            </div>
         </div>

         <div className="space-y-4">
            {accounts.map(acc => (
               <AccountCard 
                  key={acc.id} 
                  acc={acc} 
                  onManage={() => setManagingId(acc.id)} 
                  onSignOut={() => handleSignOut(acc.id)}
                  onReauth={() => handleReauth(acc.id)}
               />
            ))}
            
            <button className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 transition-all group">
               <PlusIcon size={20} className="mr-3 group-hover:scale-110 transition-transform" />
               <span className="font-bold text-sm uppercase tracking-widest">Connect New Service</span>
            </button>
         </div>
      </section>

      {/* 3. Manual Tokens Section (PATs) (EX-11 Section) */}
      <section className="space-y-4">
         <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Personal Access Tokens</h2>
            <span className="text-[10px] text-slate-600 font-mono">SECURED BY OS KEYCHAIN</span>
         </div>
         
         <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 space-y-6">
               <div className="flex items-center justify-between text-xs text-slate-400">
                  <p>Manually generated tokens for legacy integrations or custom scripts.</p>
                  <Button variant="secondary" size="sm" icon={<PlusIcon size={14} />}>Add PAT</Button>
               </div>
               
               <div className="space-y-3">
                  <PatItem label="GitHub Personal (Expiring)" value="ghp_********************" status="warning" />
                  <PatItem label="OpenAI Production" value="sk-************************" status="success" />
               </div>
            </div>
         </div>
      </section>

      {/* 4. Security Footnote (EX-11 Footer) */}
      <footer className="pt-10 flex items-start gap-4 p-8 bg-indigo-900/5 border border-indigo-500/10 rounded-2xl">
         <LockIcon size={20} className="text-indigo-400 shrink-0 mt-1" />
         <div className="text-xs text-slate-500 leading-relaxed">
            <strong className="text-indigo-300 block mb-1">Local Identity Enclave</strong>
            Master Coda uses 256-bit AES encryption to store your tokens in the user-level OS Keychain. 
            Credentials are **never** synced to our servers. Extensions are granted narrow, revocable 
            proxy access to these sessions via our internal auth bridge.
         </div>
      </footer>

      {/* Access Manager Modal (EX-11 Manage Access) */}
      {managingAccount && (
         <AccessManagerModal 
            acc={managingAccount} 
            onClose={() => setManagingId(null)} 
            onRevoke={(extId) => handleRevokeExtension(managingAccount.id, extId)}
         />
      )}

    </div>
  );
};

// Sub-components

const AccountCard: React.FC<{ 
  acc: ServiceAccount, 
  onManage: () => void, 
  onSignOut: () => void,
  onReauth: () => void 
}> = ({ acc, onManage, onSignOut, onReauth }) => {
   const isError = acc.status === 'expired' || acc.status === 'error';
   
   return (
      <div className={`bg-slate-800/40 border rounded-2xl p-6 transition-all duration-300 flex items-center justify-between group ${
         isError ? 'border-red-500/20 bg-red-950/5' : 'border-slate-700/50 hover:border-indigo-500/30'
      }`}>
         <div className="flex items-center space-x-6">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-lg border ${
               acc.status === 'connected' ? 'bg-slate-900 border-slate-700' : 'bg-red-500/10 border-red-500/20'
            }`}>
               {getProviderIcon(acc.providerId)}
            </div>
            
            <div className="space-y-1">
               <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-white">{acc.providerName}</h3>
                  {acc.status === 'connected' ? (
                     <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10">Active</span>
                  ) : (
                     <span className="text-[10px] font-bold text-red-400 uppercase tracking-tighter bg-red-500/5 px-1.5 py-0.5 rounded border border-red-500/10">{acc.status}</span>
                  )}
               </div>
               <p className="text-xs text-slate-400">
                  Logged in as <span className="text-indigo-300 font-medium">@{acc.username}</span>
               </p>
               <div className="flex items-center gap-2 pt-1">
                  <span className="text-[9px] font-mono text-slate-600">SCOPES: {acc.scopes.join(', ')}</span>
               </div>
            </div>
         </div>

         <div className="flex items-center space-x-3">
            <div className="mr-6 hidden md:block">
               <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 text-right">Authorized Apps</div>
               <div className="flex -space-x-2 justify-end">
                  {acc.authorizedExtensions.map(ext => (
                     <div key={ext.id} className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px]" title={ext.name}>
                        {ext.icon || '🔧'}
                     </div>
                  ))}
                  {acc.authorizedExtensions.length === 0 && <span className="text-[10px] text-slate-600 italic">None</span>}
               </div>
            </div>

            {isError ? (
               <Button variant="primary" size="sm" onClick={onReauth} icon={<RotateCwIcon size={14} className={acc.status === 'connecting' ? 'animate-spin' : ''} />}>
                  {acc.status === 'connecting' ? 'Connecting...' : 'Reconnect'}
               </Button>
            ) : (
               <div className="flex items-center space-x-2">
                  <Button variant="secondary" size="sm" onClick={onManage}>Manage Access</Button>
                  <button onClick={onSignOut} className="p-2 text-slate-500 hover:text-red-400 transition-colors" title="Revoke Session">
                     <XCircleIcon size={18} />
                  </button>
               </div>
            )}
         </div>
      </div>
   );
};

const AccessManagerModal: React.FC<{ acc: ServiceAccount, onClose: () => void, onRevoke: (id: string) => void }> = ({ acc, onClose, onRevoke }) => {
   const [revokingId, setRevokingId] = useState<string | null>(null);

   const handleRevokeClick = (id: string) => {
      setRevokingId(id);
      // Wait for shake animation specified in EX-11
      setTimeout(() => {
         onRevoke(id);
         setRevokingId(null);
      }, 500);
   };

   return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
         <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
               <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mr-4 text-xl">
                     {getProviderIcon(acc.providerId)}
                  </div>
                  <div>
                     <h3 className="font-bold text-white text-lg">Manage {acc.providerName} Access</h3>
                     <p className="text-xs text-slate-500">Connected to <span className="text-indigo-400">@{acc.username}</span></p>
                  </div>
               </div>
               <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <XIcon size={24} />
               </button>
            </div>
            
            <div className="p-8 space-y-6">
               <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Authorized Extensions</h4>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                     {acc.authorizedExtensions.map(ext => (
                        <div 
                           key={ext.id} 
                           className={`bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between group hover:border-indigo-500/30 transition-all ${revokingId === ext.id ? 'shake' : ''}`}
                        >
                           <div className="flex items-center space-x-4">
                              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-sm">
                                 {ext.icon || '🔧'}
                              </div>
                              <div className="min-w-0">
                                 <div className="text-xs font-bold text-white truncate">{ext.name}</div>
                                 <div className="text-[10px] text-slate-500 font-mono">{ext.accessLevel} • {ext.lastUsed}</div>
                              </div>
                           </div>
                           <button 
                             onClick={() => handleRevokeClick(ext.id)}
                             className="text-[10px] font-bold text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all uppercase tracking-tighter"
                           >
                              Revoke
                           </button>
                        </div>
                     ))}
                     {acc.authorizedExtensions.length === 0 && (
                        <div className="py-12 text-center text-slate-600 italic text-sm">
                           No extensions have requested access to this account.
                        </div>
                     )}
                  </div>
               </div>

               <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center"><ShieldIcon size={12} className="mr-2 text-indigo-400" /> Session expires in 12 days</span>
                  <button className="text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-tighter">Refresh Now</button>
               </div>
            </div>

            <div className="p-8 bg-slate-850 border-t border-slate-800 flex items-center justify-between">
               <div className="text-[10px] text-slate-600 font-mono">TOKEN_HASH: {acc.id}</div>
               <Button variant="ghost" onClick={onClose}>Close Manager</Button>
            </div>
         </div>
      </div>
   );
};

const PatItem: React.FC<{ label: string, value: string, status: 'success' | 'warning' }> = ({ label, value, status }) => (
   <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl flex items-center justify-between group hover:border-indigo-500/20 transition-all">
      <div className="flex items-center space-x-4">
         <div className={`p-2 rounded-lg ${status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
            <DatabaseIcon size={16} />
         </div>
         <div>
            <div className="text-xs font-bold text-slate-200">{label}</div>
            <div className="text-[10px] font-mono text-slate-600 mt-0.5">{value}</div>
         </div>
      </div>
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
         <button className="p-1.5 text-slate-500 hover:text-white transition-colors"><SettingsIcon size={14} /></button>
         <button className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"><TrashIcon size={14} /></button>
      </div>
   </div>
);

const getProviderIcon = (id: string) => {
   switch (id) {
      case 'github': return '🐙';
      case 'aws': return '☁️';
      case 'vercel': return '▲';
      case 'jira': return '🟦';
      case 'google-cloud': return '🌈';
      default: return '🔑';
   }
};

export default ServiceAccounts;