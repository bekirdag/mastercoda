
import React, { useState, useMemo } from 'react';
import { OrgMember, OrgRole, OrgMemberStatus, OrgSsoConfig } from '../types';
import { MOCK_ORG_MEMBERS } from '../constants';
import Button from './Button';
import Badge from './Badge';
// Import missing ClockIcon
import { 
  ShieldIcon, 
  UserIcon, 
  LockIcon, 
  GlobeIcon, 
  SearchIcon, 
  ChevronDownIcon, 
  ChevronRightIcon, 
  RotateCwIcon, 
  PlusIcon, 
  XIcon, 
  ActivityIcon, 
  CheckCircleIcon, 
  AlertTriangleIcon,
  TrashIcon,
  SettingsIcon,
  ZapIcon,
  ClockIcon
} from './Icons';

type Tab = 'members' | 'teams' | 'policies' | 'sso' | 'audit';

const OrgAdminConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('members');
  const [members, setMembers] = useState<OrgMember[]>(MOCK_ORG_MEMBERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<OrgRole>('Member');
  const [isInviting, setIsInviting] = useState(false);

  // Policy States
  const [enforce2FA, setEnforce2FA] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('1 day');
  const [allowPublic, setAllowPublic] = useState(false);
  const [redactionActive, setRedactionActive] = useState(true);

  const filteredMembers = useMemo(() => {
    return members.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    await new Promise(r => setTimeout(r, 1200));
    
    const newMember: OrgMember = {
      id: `u${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'Invited',
      twoFactorEnabled: false,
      lastLogin: 'Never'
    };
    
    setMembers([...members, newMember]);
    setIsInviting(false);
    setIsInviteModalOpen(false);
    setInviteEmail('');
  };

  const handleRoleChange = (id: string, role: OrgRole) => {
    if (role === 'Admin') {
       if (!confirm("Are you sure? This grants full access to organizational billing and audit logs.")) return;
    }
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m));
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Admin Mode Header Strip */}
      <div className="h-1 bg-gradient-to-r from-purple-600 to-indigo-600 shrink-0 z-50 shadow-[0_0_15px_rgba(147,51,234,0.4)]" />
      
      <header className="h-[64px] border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 flex items-center justify-between px-8 z-30">
         <div className="flex items-center space-x-6">
            <div className="flex items-center">
               <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mr-4 text-purple-400 shadow-lg">
                  <ShieldIcon size={24} />
               </div>
               <div>
                  <h1 className="text-xl font-bold text-white tracking-tight uppercase">Organization Admin</h1>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Enterprise Console • TENANT_PRO_842</p>
               </div>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            <nav className="flex space-x-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700">
               <AdminTab active={activeTab === 'members'} onClick={() => setActiveTab('members')} label="Members" />
               <AdminTab active={activeTab === 'teams'} onClick={() => setActiveTab('teams')} label="Teams" />
               <AdminTab active={activeTab === 'policies'} onClick={() => setActiveTab('policies')} label="Policies" />
               <AdminTab active={activeTab === 'sso'} onClick={() => setActiveTab('sso')} label="SSO" />
               <AdminTab active={activeTab === 'audit'} onClick={() => setActiveTab('audit')} label="Audit" />
            </nav>
         </div>

         <div className="flex items-center space-x-3">
            <button 
               onClick={() => { const evt = new CustomEvent('app-navigate', { detail: '/' }); window.dispatchEvent(evt); }}
               className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-all mr-4"
            >
               Exit Admin Mode
            </button>
            <Button variant="primary" size="sm" icon={<PlusIcon size={14}/>} onClick={() => setIsInviteModalOpen(true)}>Invite Members</Button>
         </div>
      </header>

      {/* 2. Org Health Bar (HUD) */}
      <section className="shrink-0 p-6 bg-slate-900 border-b border-slate-800">
         <div className="max-w-7xl mx-auto grid grid-cols-4 gap-6">
            <HudStat label="Seats Utilized" value="45 / 50" sub="5 Available" progress={90} color="indigo" />
            <HudStat label="Workspaces" value="12" sub="Across 4 teams" icon={<GlobeIcon size={16}/>} color="emerald" />
            <HudStat label="Security Score" value="B+" sub="2 Admins no 2FA" icon={<ShieldIcon size={16}/>} color="amber" />
            <HudStat label="Pending Invites" value="3" sub="Expiring in 48h" icon={<ClockIcon size={16}/>} color="blue" />
         </div>
      </section>

      {/* 3. Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#0d1117]">
         <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            
            {activeTab === 'members' && (
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="relative group w-64">
                        <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                           type="text" 
                           placeholder="Filter roster..." 
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:border-purple-500 outline-none transition-all"
                        />
                     </div>
                     <div className="flex items-center space-x-2">
                        <Button variant="secondary" size="sm" icon={<RotateCwIcon size={14}/>}>Sync SCIM</Button>
                     </div>
                  </div>

                  <div className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="bg-slate-950/50 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800">
                              <th className="px-6 py-3">User</th>
                              <th className="px-6 py-3">Role</th>
                              <th className="px-6 py-3">Status</th>
                              <th className="px-6 py-3 text-center">2FA</th>
                              <th className="px-6 py-3">Last Active</th>
                              <th className="px-6 py-3 text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                           {filteredMembers.map(member => (
                              <tr key={member.id} className="group hover:bg-slate-800 transition-colors">
                                 <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                       <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-300">
                                          {member.avatar ? <img src={member.avatar} className="rounded-full" /> : member.name[0]}
                                       </div>
                                       <div>
                                          <div className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">{member.name}</div>
                                          <div className="text-[10px] text-slate-600 font-mono">{member.email}</div>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <select 
                                       value={member.role}
                                       onChange={(e) => handleRoleChange(member.id, e.target.value as OrgRole)}
                                       className="bg-transparent border-none text-[11px] font-bold text-slate-400 outline-none cursor-pointer focus:text-purple-400 uppercase"
                                    >
                                       <option>Owner</option>
                                       <option>Admin</option>
                                       <option>Member</option>
                                       <option>Guest</option>
                                    </select>
                                 </td>
                                 <td className="px-6 py-4">
                                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                                       member.status === 'Active' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' :
                                       member.status === 'Invited' ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' :
                                       'text-red-400 border-red-500/20 bg-red-500/5'
                                    }`}>
                                       {member.status}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex justify-center">
                                       {member.twoFactorEnabled ? (
                                          <CheckCircleIcon size={14} className="text-emerald-500" />
                                       ) : (
                                          <AlertTriangleIcon size={14} className="text-red-500 animate-pulse" />
                                       )}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 text-[10px] font-mono text-slate-500">
                                    {member.lastLogin.toUpperCase()}
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <button className="p-1.5 text-slate-600 hover:text-red-400 transition-colors">
                                       <TrashIcon size={16} />
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {activeTab === 'policies' && (
               <div className="max-w-3xl space-y-12">
                  <section className="space-y-6">
                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Authentication Enforcement</h3>
                     <PolicyToggle 
                        active={enforce2FA} 
                        onChange={setEnforce2FA} 
                        label="Enforce Multi-Factor Authentication (2FA)" 
                        desc="Requirement for all users to login using an authenticator app. Admins will be unable to access the console without 2FA."
                        icon={<ShieldIcon size={18}/>}
                     />
                     <div className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700 rounded-2xl group hover:border-purple-500/30 transition-all">
                        <div className="flex-1 pr-10">
                           <div className="text-sm font-bold text-white mb-1">Session Inactivity Timeout</div>
                           <p className="text-xs text-slate-500">Automatically logout users after a period of idleness.</p>
                        </div>
                        <select 
                           value={sessionTimeout}
                           onChange={(e) => setSessionTimeout(e.target.value)}
                           className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-purple-500 outline-none"
                        >
                           <option>1 hour</option>
                           <option>1 day</option>
                           <option>1 week</option>
                           <option>Never</option>
                        </select>
                     </div>
                  </section>

                  <section className="space-y-6">
                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Workspace Governance</h3>
                     <PolicyToggle 
                        active={allowPublic} 
                        onChange={setAllowPublic} 
                        label="Allow Public Workspaces" 
                        desc="If disabled, all projects created by organization members must be Private or restricted to the tenant."
                        icon={<GlobeIcon size={18}/>}
                     />
                     <PolicyToggle 
                        active={true} 
                        onChange={() => {}} 
                        label="Restrict Workspace Deletion" 
                        desc="Only users with the Owner or Admin role can permanently delete project directories."
                        icon={<TrashIcon size={18}/>}
                        locked
                     />
                  </section>

                  <section className="space-y-6">
                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Enterprise AI Guardrails</h3>
                     <PolicyToggle 
                        active={redactionActive} 
                        onChange={setRedactionActive} 
                        label="Global PII Redaction" 
                        desc="Enforce automatic PII and sensitive secret redaction across all agent reasoning logs for all users."
                        icon={<ZapIcon size={18}/>}
                     />
                  </section>
               </div>
            )}

            {activeTab === 'sso' && (
               <div className="max-w-3xl space-y-10">
                  <div className="bg-indigo-950/20 border border-indigo-500/20 p-6 rounded-3xl flex items-start gap-4">
                     <ShieldIcon size={24} className="text-indigo-400 mt-1 shrink-0" />
                     <div className="space-y-2">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest">Enterprise Identity Bridge</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                           Centralize your workforce management by connecting your corporate Identity Provider (IdP). 
                           Once configured, users can sign in using their standard company credentials.
                        </p>
                     </div>
                  </div>

                  <form className="space-y-6 p-8 bg-slate-800/40 border border-slate-700 rounded-3xl">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">OIDC Provider</label>
                        <select className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500 outline-none appearance-none">
                           <option>Okta</option>
                           <option>Azure AD (Entra)</option>
                           <option>Google Workspace</option>
                           <option>SAML 2.0 (Custom)</option>
                        </select>
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Client ID</label>
                           <input type="text" value="0oab2v3x4y5z..." className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-indigo-400 font-mono" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Client Secret</label>
                           <input type="password" value="****************" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-indigo-400 font-mono" />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Metadata / Discovery URL</label>
                        <input type="text" placeholder="https://domain.okta.com/.well-known/openid-configuration" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-400 font-mono" />
                     </div>

                     <div className="pt-6 flex justify-end space-x-3">
                        <Button variant="secondary" icon={<ActivityIcon size={14}/>}>Test Connection</Button>
                        <Button variant="primary">Activate SSO</Button>
                     </div>
                  </form>
               </div>
            )}

            {activeTab === 'audit' && (
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Governance Log</h3>
                     <Button variant="secondary" size="sm" icon={<DownloadIcon size={14}/>}>Export CSV</Button>
                  </div>
                  {/* Reuse Audit Table Styling from SY-07 but for Org Events */}
                  <div className="bg-slate-800/40 border border-slate-700 rounded-3xl overflow-hidden font-mono text-[11px]">
                     <table className="w-full text-left">
                        <thead className="bg-slate-950/50">
                           <tr className="text-slate-500 uppercase tracking-widest">
                              <th className="px-6 py-4">Timestamp</th>
                              <th className="px-6 py-4">Actor</th>
                              <th className="px-6 py-4">Activity</th>
                              <th className="px-6 py-4">Target</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                           <AuditRow time="10:45:02" actor="Alex Dev (Owner)" event="Role Updated: 'Sarah Chen' -> Admin" target="Sarah Chen" />
                           <AuditRow time="09:12:45" actor="System" event="SSO Policy Activated" target="Global" />
                           <AuditRow time="Yesterday" actor="John Smith" event="Workspace Provisioned: 'Alpha-01'" target="Workspace Registry" />
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

         </div>
      </main>

      {/* 4. Global Admin Footer */}
      <footer className="h-12 bg-slate-900 border-t border-slate-800 shrink-0 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
         <div className="flex items-center space-x-12">
            <div className="flex items-center">
               <ShieldIcon size={14} className="mr-2 text-purple-400" />
               ORG_MODE: <span className="ml-2 text-white">ENTERPRISE_ACTIVE</span>
            </div>
            <div className="flex items-center">
               <ActivityIcon size={14} className="mr-2 text-indigo-400" />
               HEALTH_CHECK: <span className="ml-2 text-emerald-500 uppercase tracking-tighter font-mono">NOMINAL_STATE</span>
            </div>
         </div>
         <div className="flex items-center space-x-6">
            <div className="flex items-center text-purple-400">
               <LockIcon size={12} className="mr-2" />
               ENCLAVE_CONTROL
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <span className="text-slate-700 font-mono tracking-tighter">BUILD: MC_ADMIN_842_A</span>
         </div>
      </footer>

      {/* 5. Invite Modal */}
      {isInviteModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-[0_0_100px_rgba(147,51,234,0.15)] overflow-hidden animate-in zoom-in-95 duration-200">
               <header className="p-8 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center tracking-tight">
                     <UserIcon size={24} className="mr-3 text-purple-400" />
                     Invite Members
                  </h3>
                  <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                     <XIcon size={24} />
                  </button>
               </header>
               <form onSubmit={handleInvite} className="p-8 space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Addresses</label>
                     <input 
                        required
                        type="email" 
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="engineer@company.com" 
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500 outline-none"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Access Role</label>
                     <div className="grid grid-cols-2 gap-2">
                        {(['Member', 'Admin', 'Guest', 'Owner'] as OrgRole[]).map(role => (
                           <button 
                              key={role}
                              type="button"
                              onClick={() => setInviteRole(role)}
                              className={`py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
                                 inviteRole === role ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
                              }`}
                           >
                              {role}
                           </button>
                        ))}
                     </div>
                  </div>
                  
                  <div className="p-4 bg-indigo-900/5 border border-indigo-500/10 rounded-2xl flex items-center justify-between">
                     <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Seats Remaining</div>
                     <div className="text-sm font-bold text-white font-mono">5 / 50</div>
                  </div>

                  <div className="pt-4 flex justify-end">
                     <Button 
                        variant="primary" 
                        className="w-full h-12 shadow-lg shadow-purple-900/30"
                        disabled={isInviting || !inviteEmail}
                     >
                        {isInviting ? <RotateCwIcon size={18} className="animate-spin mr-2" /> : <PlusIcon size={18} className="mr-2" />}
                        {isInviting ? 'Sending Invitations...' : 'Send Invites'}
                     </Button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

// Sub-components

const AdminTab: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
   <button 
      onClick={onClick}
      className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
         active ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-slate-500 hover:text-slate-300'
      }`}
   >
      {label}
   </button>
);

const HudStat: React.FC<{ label: string; value: string; sub: string; progress?: number; color: string; icon?: React.ReactNode }> = ({ label, value, sub, progress, color, icon }) => (
   <div className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl flex flex-col group hover:border-slate-600 transition-all shadow-sm">
      <div className="flex items-center text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-2 group-hover:text-slate-400">
         {icon ? <span className="mr-2 opacity-70">{icon}</span> : <div className={`w-2 h-2 rounded-full bg-${color}-500 mr-2 shadow-[0_0_8px] shadow-${color}-500/50`} />}
         {label}
      </div>
      <div className="text-2xl font-bold text-white tracking-tight mb-1">{value}</div>
      <div className="text-[10px] text-slate-600 uppercase font-mono font-bold">{sub}</div>
      {progress !== undefined && (
         <div className="mt-4 h-1 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className={`h-full bg-${color}-500 transition-all duration-1000 shadow-[0_0_8px] shadow-${color}-500/30`} style={{ width: `${progress}%` }} />
         </div>
      )}
   </div>
);

const PolicyToggle: React.FC<{ active: boolean; onChange: (v: boolean) => void; label: string; desc: string; icon: React.ReactNode; locked?: boolean }> = ({ active, onChange, label, desc, icon, locked }) => (
   <div 
      onClick={() => !locked && onChange(!active)}
      className={`flex items-start justify-between p-5 rounded-3xl border transition-all ${locked ? 'opacity-60 bg-slate-900 border-slate-800' : 'bg-slate-800/40 border-slate-700 hover:border-purple-500/30 cursor-pointer'} group`}
   >
      <div className="flex items-start space-x-5">
         <div className={`p-3 rounded-2xl border transition-colors ${active ? 'bg-purple-600/10 border-purple-500/30 text-purple-400' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
            {icon}
         </div>
         <div className="flex-1 pr-10">
            <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors mb-1">{label}</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-light">{desc}</p>
         </div>
      </div>
      <div className="shrink-0 pt-1">
         <button className={`w-12 h-6 rounded-full p-1 transition-all duration-300 relative ${active ? 'bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.4)]' : 'bg-slate-700'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow-lg transition-transform duration-500 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
         </button>
      </div>
   </div>
);

const AuditRow: React.FC<{ time: string, actor: string, event: string, target: string }> = ({ time, actor, event, target }) => (
   <tr className="hover:bg-slate-800/50 transition-colors border-b border-slate-800/50 last:border-0">
      <td className="px-6 py-4 text-slate-600">{time}</td>
      <td className="px-6 py-4 font-bold text-slate-300">{actor}</td>
      <td className="px-6 py-4 text-slate-400">{event}</td>
      <td className="px-6 py-4">
         <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-indigo-400">{target}</span>
      </td>
   </tr>
);

const DownloadIcon: React.FC<any> = (props) => (
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
     <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
     <polyline points="7 10 12 15 17 10" />
     <line x1="12" y1="15" x2="12" y2="3" />
   </svg>
 );

export default OrgAdminConsole;
