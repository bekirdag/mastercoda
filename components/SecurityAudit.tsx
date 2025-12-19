
import React, { useState, useMemo } from 'react';
import { AuditLogEntry, UserSession, AuditCategory } from '../types';
import { MOCK_AUDIT_LOG, MOCK_SESSIONS } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  ShieldIcon, 
  LockIcon, 
  RotateCwIcon, 
  SearchIcon, 
  ActivityIcon, 
  TrashIcon, 
  ChevronRightIcon, 
  ChevronDownIcon, 
  XIcon, 
  ClockIcon, 
  SettingsIcon,
  GlobeIcon,
  HardDriveIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ArrowRightIcon
} from './Icons';

// Proxy icons
const SmartphoneIconProxy: React.FC<any> = (props) => (
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
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </svg>
);

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

const SecurityAudit: React.FC = () => {
  const [sessions, setSessions] = useState<UserSession[]>(MOCK_SESSIONS);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOG);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<AuditCategory | 'all'>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const filteredLogs = useMemo(() => {
    return auditLog.filter(log => {
      const matchSearch = log.event.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.actor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoryFilter === 'all' || log.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [auditLog, searchQuery, categoryFilter]);

  const handleRevoke = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const handleLogoutAll = () => {
    if (confirm('Are you sure you want to log out all other devices?')) {
       setSessions(prev => prev.filter(s => s.isCurrent));
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-y-auto custom-scrollbar font-sans p-8">
      <div className="max-w-[1000px] mx-auto w-full space-y-12 animate-in fade-in duration-500 pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-8">
           <div className="space-y-1">
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
                 <ShieldIcon className="mr-3 text-indigo-400" size={32} />
                 Security & Audit
              </h1>
              <p className="text-slate-400">Manage account access, sessions, and forensic activity logs.</p>
           </div>
           <Button variant="secondary" size="sm" icon={<RotateCwIcon size={14} />}>Re-Authenticate</Button>
        </div>

        {/* Section 1: Credentials & Auth */}
        <section className="space-y-6">
           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] px-1">Credentials & Authentication</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SecurityCard 
                 label="Password" 
                 status="Last changed 3 months ago" 
                 actionLabel="Change Password" 
                 icon={<LockIcon size={24} className="text-indigo-400" />}
              />
              <SecurityCard 
                 label="2-Factor Auth (2FA)" 
                 status="🟢 Enabled (Authenticator App)" 
                 actionLabel="View Backup Codes" 
                 icon={<ShieldIcon size={24} className="text-emerald-400" />}
              />
              <SecurityCard 
                 label="Single Sign-On (SSO)" 
                 status="Linked to Okta (Corporate)" 
                 actionLabel="View Policies" 
                 icon={<GlobeIcon size={24} className="text-blue-400" />}
              />
           </div>
        </section>

        {/* Section 2: Active Sessions */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Active Device Sessions</h3>
              <button 
                onClick={handleLogoutAll}
                className="text-[10px] font-bold text-red-400 hover:text-red-300 uppercase tracking-widest transition-all"
              >
                Log out all other devices
              </button>
           </div>
           
           <div className="bg-slate-800/40 border border-slate-700 rounded-3xl overflow-hidden divide-y divide-slate-800/50">
              {sessions.map(session => (
                 <div key={session.id} className="p-6 flex items-center justify-between group hover:bg-slate-800/60 transition-all">
                    <div className="flex items-center space-x-6">
                       <div className="p-3 rounded-2xl bg-slate-900 border border-slate-700 text-slate-400 group-hover:text-indigo-400 transition-colors">
                          {session.type === 'desktop' ? <MonitorIconProxy size={24} /> : <SmartphoneIconProxy size={24} />}
                       </div>
                       <div className="space-y-1">
                          <div className="flex items-center space-x-3">
                             <h4 className="text-sm font-bold text-white">{session.device} ({session.browser})</h4>
                             {session.isCurrent && <Badge variant="success">Current Session</Badge>}
                          </div>
                          <div className="flex items-center text-[10px] font-mono text-slate-500 uppercase">
                             <GlobeIcon size={10} className="mr-1.5" />
                             {session.location} • LAST ACTIVE {session.lastActive.toUpperCase()}
                          </div>
                       </div>
                    </div>
                    {!session.isCurrent && (
                       <button 
                          onClick={() => handleRevoke(session.id)}
                          className="px-4 py-1.5 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
                       >
                          Revoke
                       </button>
                    )}
                 </div>
              ))}
           </div>
        </section>

        {/* Section 3: Audit Log */}
        <section className="space-y-6">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Forensic Audit Log</h3>
              <div className="flex items-center space-x-4">
                 <div className="relative group">
                    <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-all" />
                    <input 
                       type="text" 
                       placeholder="Filter events..."
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1 text-[11px] text-white focus:border-indigo-500 outline-none w-48"
                    />
                 </div>
                 <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-400 outline-none focus:border-indigo-500 appearance-none uppercase"
                 >
                    <option value="all">All Categories</option>
                    <option value="login">Logins</option>
                    <option value="billing">Billing</option>
                    <option value="deletion">Deletions</option>
                    <option value="api">API / Bot</option>
                 </select>
              </div>
           </div>

           <div className="bg-slate-800/40 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-900/80 border-b border-slate-700 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       <th className="px-6 py-4">Time</th>
                       <th className="px-6 py-4">Actor</th>
                       <th className="px-6 py-4">Event Activity</th>
                       <th className="px-6 py-4">Origin (IP)</th>
                       <th className="px-6 py-4 text-right">Context</th>
                    </tr>
                 </thead>
                 <tbody>
                    {filteredLogs.map(log => (
                       <React.Fragment key={log.id}>
                          <tr 
                             onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                             className={`group border-b border-slate-800/40 hover:bg-slate-800/60 transition-all cursor-pointer ${log.isSuspicious ? 'bg-amber-950/10' : ''}`}
                          >
                             <td className="px-6 py-4 text-[10px] font-mono text-slate-500">{log.timestamp}</td>
                             <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                   {log.actor.startsWith('Agent') ? <SparklesIcon size={12} className="text-indigo-400"/> : <UserIcon size={12} className="text-slate-500"/>}
                                   <span className={`text-xs font-bold ${log.actor.startsWith('Agent') ? 'text-indigo-300' : 'text-slate-300'}`}>{log.actor}</span>
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <span className={`text-xs font-medium ${log.isSuspicious ? 'text-amber-400' : 'text-slate-200'}`}>{log.event}</span>
                                {log.isSuspicious && (
                                   <span className="ml-3 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[8px] font-bold uppercase">Manual Review</span>
                                )}
                             </td>
                             <td className="px-6 py-4 text-[10px] font-mono text-slate-600">
                                {log.ip} <span className="opacity-50">• {log.location}</span>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <ChevronDownIcon size={14} className={`text-slate-700 transition-transform ${expandedLogId === log.id ? 'rotate-180 text-indigo-400' : ''}`} />
                             </td>
                          </tr>
                          {expandedLogId === log.id && (
                             <tr className="bg-slate-900/50">
                                <td colSpan={5} className="px-10 py-6 animate-in slide-in-from-top-1 duration-200">
                                   <div className="flex gap-8">
                                      <div className="flex-1 space-y-4">
                                         <h4 className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Metadata Payload</h4>
                                         <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-[10px] text-indigo-300/80 leading-relaxed shadow-inner">
                                            {JSON.stringify({
                                               id: log.id,
                                               request_id: `req_${Math.random().toString(36).slice(2, 10)}`,
                                               user_agent: navigator.userAgent,
                                               geo_coords: "37.7749° N, 122.4194° W",
                                               auth_method: log.category === 'login' ? 'RSA-256' : 'JWT_BEARER',
                                               platform_version: "mc-v4.2.1-stable"
                                            }, null, 2)}
                                         </div>
                                      </div>
                                      <div className="w-[180px] space-y-4 shrink-0 border-l border-slate-800 pl-8">
                                         <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Forensic Actions</div>
                                         <div className="space-y-2">
                                            <Button variant="secondary" size="sm" className="w-full text-[9px] uppercase font-bold h-7">Audit Device</Button>
                                            <Button variant="secondary" size="sm" className="w-full text-[9px] uppercase font-bold h-7">Report Fraud</Button>
                                         </div>
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
        </section>

        {/* Section 4: Data Privacy */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight">Data Privacy & Portability</h3>
              <p className="text-sm text-slate-500 max-w-xl leading-relaxed">
                 Master Coda is GDPR/CCPA compliant by default. You can export all your project metadata, logs, and settings at any time or manage your data erasure preferences.
              </p>
           </div>
           <div className="flex flex-col gap-3 shrink-0">
              <Button variant="primary" icon={<PlusIcon size={14}/>}>Request Data Export</Button>
              <button className="text-[10px] font-bold text-slate-600 hover:text-white uppercase tracking-widest transition-all">Manage Privacy Consent &rsaquo;</button>
           </div>
        </section>

        {/* Warning Footnote */}
        <div className="p-6 bg-red-950/10 border border-red-900/20 rounded-2xl flex items-start gap-4">
           <AlertTriangleIcon size={20} className="text-red-500 mt-0.5 shrink-0" />
           <div className="text-xs text-red-300/80 leading-relaxed">
              <strong className="block mb-1 uppercase font-bold tracking-widest text-red-400">Security Notice</strong>
              Master Coda personnel will never ask for your password or backup codes. If you suspect your account has been accessed without authorization, revoke all sessions above and contact support immediately.
           </div>
        </div>

      </div>

      {/* Global Status Bar Overlay */}
      <footer className="h-10 shrink-0 bg-slate-900 border-t border-slate-800 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-30 fixed bottom-0 left-0 right-0">
         <div className="flex items-center space-x-12">
            <div className="flex items-center">
               <ActivityIcon size={12} className="mr-2 text-indigo-400" />
               ENCRYPTION: <span className="ml-2 text-emerald-500">AES-256-GCM</span>
            </div>
            <div className="flex items-center">
               <RotateCwIcon size={12} className="mr-2 text-indigo-400" />
               LOG_RETENTION: <span className="ml-2 text-slate-300 font-mono">90 DAYS (FREE)</span>
            </div>
         </div>
         <div className="flex items-center space-x-4">
            <span className="text-slate-700 font-mono italic">SY-07_v4.2.1</span>
         </div>
      </footer>
    </div>
  );
};

const SecurityCard: React.FC<{ label: string; status: string; actionLabel: string; icon: React.ReactNode }> = ({ label, status, actionLabel, icon }) => (
   <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-3xl space-y-6 hover:border-slate-500 transition-all group shadow-lg">
      <div className="flex items-center justify-between">
         <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 group-hover:scale-110 transition-transform">
            {icon}
         </div>
         <Badge variant="neutral">SECURE</Badge>
      </div>
      <div className="space-y-1">
         <h4 className="text-sm font-bold text-white">{label}</h4>
         <p className="text-[10px] text-slate-500 uppercase tracking-tight">{status}</p>
      </div>
      <button className="w-full py-2 bg-slate-900 border border-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:bg-slate-800 hover:text-white transition-all">
         {actionLabel}
      </button>
   </div>
);

export default SecurityAudit;
