
import React, { useState, useEffect } from 'react';
import Button from './Button';
import Badge from './Badge';
import { 
  SearchIcon, 
  BookOpenIcon, 
  MessageSquareIcon, 
  ShieldIcon, 
  ActivityIcon, 
  ChevronRightIcon, 
  PlusIcon, 
  XIcon, 
  GlobeIcon, 
  CheckCircleIcon, 
  AlertTriangleIcon,
  RotateCwIcon,
  ExternalLinkIcon,
  HelpCircleIcon,
  ZapIcon,
  TerminalIcon,
  SparklesIcon,
  LockIcon,
  CodeIcon,
  UserIcon
} from './Icons';

const KNOWLEDGE_CATEGORIES = [
  { id: 'start', title: 'Getting Started', desc: 'Installation, first project setup, and core concepts.', icon: '🚀', color: 'indigo' },
  { id: 'agents', title: 'Agent Config', desc: 'Prompt engineering, skill assignment, and guardrails.', icon: '🤖', color: 'emerald' },
  { id: 'work', title: 'Workspaces', desc: 'Layout customization, editor shortcuts, and CLI sync.', icon: '🛠️', color: 'blue' },
  { id: 'billing', title: 'Billing & Plans', desc: 'Managing subscriptions, invoices, and API credits.', icon: '💳', color: 'amber' },
  { id: 'security', title: 'Security', desc: 'Local encryption, PAT management, and privacy firewall.', icon: '🛡️', color: 'purple' },
  { id: 'api', title: 'Developer API', desc: 'Extend Master Coda with custom plugins and adapters.', icon: '🔌', color: 'rose' },
];

const HelpSupport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketStatus, setTicketStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);

  const handleSendTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setTicketStatus('sending');
    await new Promise(r => setTimeout(r, 1500));
    setTicketStatus('success');
    setTimeout(() => {
      setTicketStatus('idle');
      setIsTicketModalOpen(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-y-auto custom-scrollbar font-sans pb-20">
      
      {/* 1. Search Hero Section */}
      <section className="relative pt-24 pb-20 px-6 flex flex-col items-center overflow-hidden shrink-0">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-indigo-600/10 blur-[120px] -z-10 pointer-events-none" />
         
         <div className="w-full max-w-3xl space-y-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-3">
               <h1 className="text-5xl font-bold text-white tracking-tight">How can we help you?</h1>
               <p className="text-slate-400 text-lg font-light max-w-xl mx-auto">
                 Search our technical guides, troubleshooting docs, and community resources.
               </p>
            </div>

            <div className="relative group max-w-2xl mx-auto">
               <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-500"></div>
               <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                  <SearchIcon className="ml-5 text-slate-500" size={24} />
                  <input 
                     autoFocus
                     type="text" 
                     placeholder="Search guides, API docs, and troubleshooting..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="flex-1 bg-transparent border-none text-lg text-white placeholder-slate-600 focus:ring-0 px-4 py-5"
                  />
                  <div className="pr-6 hidden sm:block">
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900 px-2 py-1 rounded border border-slate-700">Press / to focus</span>
                  </div>
               </div>
            </div>

            <div className="flex items-center justify-center space-x-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
               <span>Popular:</span>
               <button className="text-indigo-400 hover:text-white transition-colors underline decoration-indigo-500/30 underline-offset-4">Agent Configuration</button>
               <button className="text-indigo-400 hover:text-white transition-colors underline decoration-indigo-500/30 underline-offset-4">Billing</button>
               <button className="text-indigo-400 hover:text-white transition-colors underline decoration-indigo-500/30 underline-offset-4">Git Sync</button>
            </div>
         </div>
      </section>

      {/* 2. Knowledge Base Grid */}
      <section className="max-w-6xl mx-auto px-6 mb-24 w-full">
         <div className="flex items-center justify-between mb-10">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] flex items-center">
               <BookOpenIcon size={18} className="mr-3 text-indigo-400" />
               Knowledge Base
            </h2>
            <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">Explore All Documentation &rsaquo;</button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {KNOWLEDGE_CATEGORIES.map(cat => (
               <div 
                  key={cat.id}
                  className="group p-8 bg-slate-800/40 border border-slate-700/50 rounded-3xl hover:bg-slate-800 hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-2xl relative overflow-hidden"
               >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-${cat.color}-500/5 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700`} />
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-500">{cat.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors">{cat.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light mb-6">{cat.desc}</p>
                  <button className="flex items-center text-[10px] font-bold text-indigo-400 uppercase tracking-widest group-hover:text-white transition-all">
                     View Articles <ChevronRightIcon size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            ))}
         </div>
      </section>

      {/* 3. Support Channels */}
      <section className="max-w-6xl mx-auto px-6 mb-24 w-full">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Direct Support */}
            <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-indigo-500/20 rounded-3xl p-10 space-y-8">
               <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white tracking-tight">Direct Support</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">Can't find what you need? Our engineering team is here to help during business hours (UTC-5).</p>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                     onClick={() => setIsTicketModalOpen(true)}
                     className="flex flex-col items-center justify-center p-6 bg-slate-800/50 border border-slate-700 rounded-2xl hover:bg-slate-800 hover:border-indigo-500 transition-all group"
                  >
                     <MessageSquareIcon size={24} className="text-indigo-400 mb-3 group-hover:scale-110 transition-transform" />
                     <span className="text-sm font-bold text-white">Contact Support</span>
                     <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">Open a Ticket</span>
                  </button>
                  <button 
                     onClick={() => setIsBugModalOpen(true)}
                     className="flex flex-col items-center justify-center p-6 bg-slate-800/50 border border-slate-700 rounded-2xl hover:bg-slate-800 hover:border-red-500 transition-all group"
                  >
                     <AlertTriangleIcon size={24} className="text-red-400 mb-3 group-hover:scale-110 transition-transform" />
                     <span className="text-sm font-bold text-white">Report a Bug</span>
                     <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">Submit Diagnostics</span>
                  </button>
               </div>
            </div>

            {/* Community */}
            <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-10 space-y-8">
               <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white tracking-tight">Community & Ecosystem</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">Join 5,000+ developers building the future of autonomous engineering.</p>
               </div>

               <div className="space-y-4">
                  <CommunityLink title="Join the Discord" desc="Chat with other Master Coda users and team members." icon="💬" color="bg-indigo-600" />
                  <CommunityLink title="Feature Requests" desc="Vote on the roadmap and suggest new agent tools." icon="💡" color="bg-amber-500" />
                  <CommunityLink title="System Status" desc="Check live status of cloud sync and API providers." icon="🟢" color="bg-emerald-600" />
               </div>
            </div>

         </div>
      </section>

      {/* 4. System Health Status Strip */}
      <footer className="shrink-0 max-w-6xl mx-auto px-6 w-full">
         <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="flex items-center space-x-12">
               <StatusIndicator label="API Gateway" status="operational" />
               <StatusIndicator label="Agent Runtime" status="operational" />
               <StatusIndicator label="Sync Service" status="degraded" />
            </div>
            <button className="flex items-center text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-all">
               View Full Status Page <ExternalLinkIcon size={12} className="ml-2" />
            </button>
         </div>
         <div className="mt-8 text-center">
            <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.2em]">Master Coda Assist • Engine v4.2.1 • Build 84A2</p>
         </div>
      </footer>

      {/* Ticket Modal Overlay */}
      {isTicketModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
               <header className="p-8 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center">
                     <MessageSquareIcon size={20} className="mr-3 text-indigo-400" />
                     Open Support Ticket
                  </h3>
                  <button onClick={() => setIsTicketModalOpen(false)} className="text-slate-500 hover:text-white"><XIcon size={24}/></button>
               </header>
               
               {ticketStatus === 'success' ? (
                  <div className="p-12 text-center flex flex-col items-center animate-in zoom-in">
                     <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                        <CheckCircleIcon size={40} />
                     </div>
                     <h4 className="text-xl font-bold text-white mb-2">Message Sent!</h4>
                     <p className="text-slate-500 text-sm">Our team will reach out to your registered email shortly.</p>
                  </div>
               ) : (
                  <form onSubmit={handleSendTicket} className="p-8 space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Subject</label>
                        <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none" placeholder="Brief summary of the issue" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                           <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none appearance-none">
                              <option>Technical Issue</option>
                              <option>Billing Question</option>
                              <option>Feature Request</option>
                              <option>Security Report</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-500 uppercase">Priority</label>
                           <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none appearance-none">
                              <option>P3 - Standard</option>
                              <option>P2 - Elevated</option>
                              <option>P1 - Critical</option>
                           </select>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
                        <textarea required className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none resize-none" placeholder="Provide as much detail as possible..." />
                     </div>
                     <footer className="pt-4 flex justify-end">
                        <Button variant="primary" disabled={ticketStatus === 'sending'} className="px-8 shadow-lg shadow-indigo-900/20">
                           {ticketStatus === 'sending' ? <RotateCwIcon className="animate-spin mr-2" size={16}/> : <SendIconProxy size={16} className="mr-2"/>}
                           {ticketStatus === 'sending' ? 'Transmitting...' : 'Submit Ticket'}
                        </Button>
                     </footer>
                  </form>
               )}
            </div>
         </div>
      )}

      {/* Bug Report Modal */}
      {isBugModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
               <header className="p-8 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center">
                     <AlertTriangleIcon size={20} className="mr-3 text-red-500" />
                     System Diagnostic Report
                  </h3>
                  <button onClick={() => setIsBugModalOpen(false)} className="text-slate-500 hover:text-white"><XIcon size={24}/></button>
               </header>
               <div className="p-8 space-y-8">
                  <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                     <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2 flex items-center justify-between">
                        <span>Automatic System Info</span>
                        <Badge variant="neutral">ATTACHED</Badge>
                     </div>
                     <div className="grid grid-cols-2 gap-4 font-mono text-[10px] text-slate-500">
                        <div>APP_VERSION: v0.3.5-stable</div>
                        <div>CLI_VERSION: v0.3.5</div>
                        <div>OS: macOS 14.5 (Darwin)</div>
                        <div>ARCH: arm64 (M3)</div>
                        <div>SESSION_ID: mc_74x_9921</div>
                        <div>VRAM_STAT: 1.2GB/16GB</div>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <h4 className="text-sm font-bold text-white">Issue Description</h4>
                     <textarea className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none resize-none" placeholder="What happened? What were you doing?" />
                  </div>
                  <div className="p-4 rounded-xl bg-red-900/5 border border-red-500/10 flex items-start gap-4">
                     <LockIcon size={18} className="text-red-400 mt-0.5" />
                     <p className="text-[10px] text-slate-400 leading-relaxed italic">Your report includes recent application logs. No source code or prompts are attached unless explicitly specified.</p>
                  </div>
                  <Button variant="primary" className="w-full bg-red-600 hover:bg-red-500 border-none shadow-lg shadow-red-900/20 uppercase font-bold tracking-widest h-12" onClick={() => setIsBugModalOpen(false)}>Submit Bug Report</Button>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};

// Sub-components

const CommunityLink: React.FC<{ title: string; desc: string; icon: string; color: string }> = ({ title, desc, icon, color }) => (
   <div className="flex items-start p-4 rounded-2xl border border-transparent hover:border-indigo-500/20 hover:bg-indigo-900/5 transition-all cursor-pointer group">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-lg shadow-lg shrink-0 group-hover:scale-110 transition-transform`}>{icon}</div>
      <div className="ml-4">
         <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{title}</h4>
         <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{desc}</p>
      </div>
      <ChevronRightIcon size={14} className="ml-auto mt-2 text-slate-700 opacity-0 group-hover:opacity-100 transition-all" />
   </div>
);

const StatusIndicator: React.FC<{ label: string; status: 'operational' | 'degraded' | 'outage' }> = ({ label, status }) => (
   <div className="flex items-center space-x-3">
      <div className={`w-2 h-2 rounded-full ${
         status === 'operational' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
         status === 'degraded' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
         'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
      } ${status !== 'operational' ? 'animate-pulse' : ''}`} />
      <div className="flex flex-col">
         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">{label}</span>
         <span className={`text-[10px] font-bold capitalize ${
            status === 'operational' ? 'text-emerald-500' :
            status === 'degraded' ? 'text-amber-500' :
            'text-red-500'
         }`}>{status}</span>
      </div>
   </div>
);

const SendIconProxy: React.FC<any> = (props) => (
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
     <line x1="22" y1="2" x2="11" y2="13" />
     <polygon points="22 2 15 22 11 13 2 9 22 2" />
   </svg>
 );

const StatItem: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
   <div className="flex flex-col">
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1 flex items-center">
         <span className="mr-1.5">{icon}</span>
         {label}
      </span>
      <span className="text-xs font-bold text-slate-200 font-mono">{value}</span>
   </div>
);

export default HelpSupport;
