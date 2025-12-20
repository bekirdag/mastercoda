
import React, { useState, useMemo } from 'react';
import Button from './Button';
import Badge from './Badge';
import { 
  ShieldIcon, 
  LockIcon, 
  GlobeIcon, 
  ActivityIcon, 
  RotateCwIcon, 
  ChevronRightIcon, 
  XCircleIcon, 
  CheckCircleIcon, 
  AlertTriangleIcon,
  SearchIcon,
  CodeIcon,
  TerminalIcon,
  HardDriveIcon,
  PlusIcon,
  TrashIcon,
  HistoryIcon
} from './Icons';

interface PrivacyCenterProps {
  isZeroRetention: boolean;
  setIsZeroRetention: (v: boolean) => void;
}

const PrivacyCenter: React.FC<PrivacyCenterProps> = ({ isZeroRetention, setIsZeroRetention }) => {
  const [localProcessing, setLocalProcessing] = useState(false);
  const [telemetryAnon, setTelemetryAnon] = useState(true);
  const [exclusionText, setExclusionText] = useState("# Patterns to hide from AI Agents and RAG\n/secrets/*\n*.pem\n/dist/\n**/private_config.json");
  const [redactorTest, setRedactorTest] = useState('');
  
  const scanners = [
    { id: 'email', label: 'Email Addresses', status: 'active' },
    { id: 'ip', label: 'IP Addresses', status: 'active' },
    { id: 'secrets', label: 'API Keys / Secrets', status: 'critical' },
    { id: 'cc', label: 'Credit Card Patterns', status: 'active' },
  ];

  const recentAudits = [
    { id: 'a1', time: '2m ago', provider: 'Anthropic API', tokens: 500, status: 'Zero-retention active', check: 'No PII detected' },
    { id: 'a2', time: '15m ago', provider: 'OpenAI GPT-4o', tokens: 1200, status: 'Encrypted tunnel', check: 'No PII detected' },
    { id: 'a3', time: '1h ago', provider: 'Google Gemini', tokens: 840, status: 'Local Redaction applied', check: '3 matches found' },
  ];

  const redactedResult = useMemo(() => {
    if (!redactorTest) return '';
    // Naive redaction simulation for UI test
    return redactorTest
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
      .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[REDACTED_IP]')
      .replace(/(sk-proj-[a-zA-Z0-9]{32,})/g, '[REDACTED_KEY]');
  }, [redactorTest]);

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-y-auto custom-scrollbar font-sans p-8">
      <div className="max-w-[1000px] mx-auto w-full space-y-12 animate-in fade-in duration-500 pb-32">
        
        {/* 1. Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-8">
           <div className="space-y-1">
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
                 <ShieldIcon className="mr-3 text-emerald-500" size={32} />
                 Privacy & AI Governance
              </h1>
              <p className="text-slate-400">Manage data-sharing thresholds and audit outgoing LLM signals.</p>
           </div>
           <div className="flex items-center space-x-3">
              <Badge variant="success">COMPLIANCE: SOC2/GDPR</Badge>
              <div className="h-6 w-px bg-slate-800 mx-2" />
              <button className="p-2 text-slate-500 hover:text-white transition-colors" title="Privacy Documentation">
                 <HelpCircleIconProxy size={20} />
              </button>
           </div>
        </div>

        {/* 2. Privacy Shields (Global Toggles) */}
        <section className="space-y-6">
           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] px-1">Active Privacy Shields</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ShieldToggle 
                label="Zero-Retention Mode" 
                desc="Forces providers to purge prompts after processing." 
                active={isZeroRetention} 
                onChange={setIsZeroRetention} 
                icon={<LockIcon size={20} />}
                highlight="indigo"
              />
              <ShieldToggle 
                label="Local Processing" 
                desc="Prioritize local models for sensitive file analysis." 
                active={localProcessing} 
                onChange={setLocalProcessing} 
                icon={<HardDriveIcon size={20} />}
              />
              <ShieldToggle 
                label="Anonymized Telemetry" 
                desc="Strips user IDs and metadata from outgoing pings." 
                active={telemetryAnon} 
                onChange={setTelemetryAnon} 
                icon={<GlobeIcon size={20} />}
              />
           </div>
        </section>

        {/* 3. Exclusion Zones (.mcodaignore) */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Exclusion Zones</h3>
              <span className="text-[10px] font-mono text-emerald-500">342 FILES SHIELDED</span>
           </div>
           <div className="bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl group focus-within:border-indigo-500/50 transition-colors">
              <div className="h-10 bg-slate-800 border-b border-slate-700 flex items-center px-4 justify-between">
                 <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500">
                    <CodeIcon size={12} />
                    <span>.mcodaignore</span>
                 </div>
                 <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors">HELP WITH PATTERNS &rsaquo;</button>
              </div>
              <textarea 
                value={exclusionText}
                onChange={(e) => setExclusionText(e.target.value)}
                className="w-full h-48 bg-transparent p-6 font-mono text-sm text-indigo-300/80 leading-relaxed outline-none resize-none focus:ring-0"
                spellCheck={false}
              />
           </div>
        </section>

        {/* 4. Redaction Engine (PII Filter) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           {/* Redaction Scanners */}
           <section className="space-y-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Redaction Engine</h3>
              <div className="bg-slate-800/40 border border-slate-700 rounded-3xl overflow-hidden divide-y divide-slate-800/50">
                 {scanners.map(s => (
                    <div key={s.id} className="p-4 flex items-center justify-between group hover:bg-slate-800 transition-all">
                       <div className="flex items-center space-x-4">
                          <div className={`w-2 h-2 rounded-full ${s.status === 'critical' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`} />
                          <span className="text-sm font-bold text-slate-200">{s.label}</span>
                       </div>
                       {s.status === 'critical' ? (
                          <Badge variant="error">ENFORCED</Badge>
                       ) : (
                          <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase">Config</button>
                       )}
                    </div>
                 ))}
              </div>
           </section>

           {/* Live Test Redactor */}
           <section className="space-y-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Test Redactor</h3>
              <div className="space-y-4">
                 <div className="relative group">
                    <div className="absolute top-3 left-3 text-slate-600">
                       <ActivityIcon size={14} />
                    </div>
                    <input 
                       type="text" 
                       value={redactorTest}
                       onChange={(e) => setRedactorTest(e.target.value)}
                       placeholder="Paste sensitive string to test (e.g. email)..."
                       className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-sm text-white focus:border-indigo-500 outline-none transition-all"
                    />
                 </div>
                 <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl min-h-[60px] flex items-center">
                    {redactorTest ? (
                       <span className="text-sm font-mono text-emerald-400 break-all">{redactedResult}</span>
                    ) : (
                       <span className="text-xs text-slate-600 italic">Result will appear here...</span>
                    )}
                 </div>
              </div>
           </section>
        </div>

        {/* 5. AI Data Audit Timeline */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Outgoing Data Audit</h3>
              <Button variant="secondary" size="sm" icon={<RotateCwIcon size={14}/>}>Refresh History</Button>
           </div>
           
           <div className="bg-slate-800/40 border border-slate-700 rounded-3xl overflow-hidden">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-950/50 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       <th className="px-6 py-4">Timestamp</th>
                       <th className="px-6 py-4">Destination</th>
                       <th className="px-6 py-4">Volume</th>
                       <th className="px-6 py-4">Privacy Logic</th>
                       <th className="px-6 py-4 text-right">Payload</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800/50">
                    {recentAudits.map(audit => (
                       <tr key={audit.id} className="hover:bg-slate-800 transition-colors group">
                          <td className="px-6 py-4 text-[10px] font-mono text-slate-500">{audit.time}</td>
                          <td className="px-6 py-4">
                             <div className="text-xs font-bold text-slate-200">{audit.provider}</div>
                          </td>
                          <td className="px-6 py-4 text-[10px] font-mono text-slate-500">{audit.tokens} TOKENS</td>
                          <td className="px-6 py-4">
                             <div className="flex items-center space-x-2">
                                <CheckCircleIcon size={12} className="text-emerald-500" />
                                <span className="text-[10px] font-bold uppercase text-slate-400">{audit.status}</span>
                             </div>
                             <div className="text-[9px] text-slate-600 mt-0.5">{audit.check}</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <button className="p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                <TerminalIcon size={14} />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           <div className="flex justify-center">
              <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest flex items-center">
                 <HistoryIcon size={14} className="mr-2" /> Download 30-Day Privacy Log &rsaquo;
              </button>
           </div>
        </section>

        {/* 6. Data Requests (GDPR Tools) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
           <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 space-y-6 hover:border-indigo-500/30 transition-all group shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner group-hover:scale-110 transition-transform">
                 <PlusIcon size={24} />
              </div>
              <div className="space-y-2">
                 <h4 className="text-xl font-bold text-white">Subject Access Request</h4>
                 <p className="text-xs text-slate-500 leading-relaxed font-light">
                    Generate a full report of all data stored by Master Coda, including project associations, agent preferences, and usage metadata. 
                 </p>
                 <div className="pt-2 text-[10px] text-slate-600 italic">"I want to see what information the system has linked to my profile."</div>
              </div>
              <Button variant="secondary" className="w-full">Initiate Data Export</Button>
           </div>

           <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 space-y-6 hover:border-red-500/30 transition-all group shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-inner group-hover:scale-110 transition-transform">
                 <TrashIcon size={24} />
              </div>
              <div className="space-y-2">
                 <h4 className="text-xl font-bold text-white">Right to be Forgotten</h4>
                 <p className="text-xs text-slate-500 leading-relaxed font-light">
                    Purge all identifiable metadata and AI-generated context links. This will permanently reset your agent's historical memory.
                 </p>
                 <div className="pt-2 text-[10px] text-slate-600 italic">"I want to delete all my personal data from the platform services."</div>
              </div>
              <Button variant="secondary" className="w-full text-red-400 hover:bg-red-500/5 border-red-500/20">Purge Personal Enclave</Button>
           </div>
        </section>

      </div>

      {/* Global Status Bar Overlay */}
      <footer className="h-10 shrink-0 bg-slate-900 border-t border-slate-800 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-30 fixed bottom-0 left-0 right-0">
         <div className="flex items-center space-x-12">
            <div className="flex items-center">
               <ShieldIcon size={14} className="mr-2 text-indigo-400" />
               ENFORCEMENT_LAYER: <span className="ml-2 text-emerald-500">ACTIVE (PRE-EGRESS)</span>
            </div>
            <div className="flex items-center">
               <LockIcon size={14} className="mr-2 text-indigo-400" />
               RETENTION_HEADER: <span className="ml-2 text-slate-300 font-mono">X-ZERO-RETENTION: ON</span>
            </div>
         </div>
         <div className="flex items-center space-x-4">
            <span className="text-slate-700 font-mono italic">SY-11_v4.2.1-SEC</span>
         </div>
      </footer>
    </div>
  );
};

// Sub-components

const ShieldToggle: React.FC<{ 
  label: string; 
  desc: string; 
  active: boolean; 
  onChange: (v: boolean) => void; 
  icon: React.ReactNode;
  highlight?: string;
}> = ({ label, desc, active, onChange, icon, highlight }) => (
   <div 
      onClick={() => onChange(!active)}
      className={`p-6 rounded-3xl border-2 transition-all group cursor-pointer ${
         active 
            ? `${highlight === 'indigo' ? 'border-indigo-500/50 bg-indigo-500/5 shadow-lg shadow-indigo-900/10' : 'border-emerald-500/50 bg-emerald-500/5'}` 
            : 'border-slate-800 bg-slate-900 hover:border-slate-700'
      }`}
   >
      <div className="flex items-start justify-between mb-6">
         <div className={`p-2.5 rounded-xl border transition-colors ${
            active ? 'bg-slate-900 border-white/10 text-white' : 'bg-slate-950 border-slate-800 text-slate-600'
         }`}>
            {icon}
         </div>
         <div className={`w-10 h-5 rounded-full p-1 transition-all duration-300 relative ${active ? 'bg-indigo-600' : 'bg-slate-700'}`}>
            <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${active ? 'translate-x-5' : 'translate-x-0'}`} />
         </div>
      </div>
      <div className="space-y-1">
         <h4 className={`text-sm font-bold transition-colors ${active ? 'text-white' : 'text-slate-400'}`}>{label}</h4>
         <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-tighter">{desc}</p>
      </div>
   </div>
);

const HelpCircleIconProxy: React.FC<any> = (props) => (
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
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export default PrivacyCenter;
