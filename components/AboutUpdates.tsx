
import React, { useState, useEffect } from 'react';
import Button from './Button';
import Badge from './Badge';
import { 
  CheckCircleIcon, 
  RotateCwIcon, 
  ChevronRightIcon, 
  ActivityIcon, 
  ShieldIcon, 
  ZapIcon, 
  ClockIcon, 
  ExternalLinkIcon,
  SparklesIcon,
  AlertTriangleIcon,
  XIcon,
  CodeIcon,
  RefreshCwIcon,
  RocketIcon,
  SettingsIcon,
  MessageSquareIcon,
  HelpCircleIcon
} from './Icons';

type UpdateStatus = 'up-to-date' | 'checking' | 'downloading' | 'ready-to-restart' | 'error';
type ReleaseChannel = 'stable' | 'insiders' | 'nightly';

const CHANGELOG = [
  {
    version: 'v2.4.1 (Build 8902)',
    date: 'Oct 14, 2025',
    title: 'The Stability Patch',
    isCurrent: true,
    items: [
      { type: 'fix', label: 'Resolved memory leak in DO-02 Dependency Graph.', link: '/plan' },
      { type: 'improvement', label: 'Increased SQLite query throughput by 15%.' },
      { type: 'security', label: 'Updated internal TLS certificate rotation logic.' }
    ]
  },
  {
    version: 'v2.4.0',
    date: 'Sept 28, 2025',
    title: 'Agent Squads Update',
    items: [
      { type: 'feature', label: 'Added AG-05 Squad Composer for multi-agent workflows.', link: '/agents/squads' },
      { type: 'feature', label: 'Implemented SY-04 Global Notification Center.', link: '/notifications' },
      { type: 'improvement', label: 'React Implementation Agent is 20% faster on heavy refactors.' },
      { type: 'fix', label: 'Fixed billing display glitch in SY-03.' }
    ]
  },
  {
    version: 'v2.3.5',
    date: 'Sept 05, 2025',
    title: 'Maintenance Release',
    items: [
      { type: 'fix', label: 'Fixed crash when importing empty .mcoda configurations.' },
      { type: 'improvement', label: 'Reduced idle CPU usage of Extension Host.' }
    ]
  }
];

const AboutUpdates: React.FC = () => {
  const [status, setStatus] = useState<UpdateStatus>('up-to-date');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [channel, setChannel] = useState<ReleaseChannel>('stable');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckUpdates = async () => {
    setIsChecking(true);
    setStatus('checking');
    await new Promise(r => setTimeout(r, 2000));
    
    // Simulate finding an update
    setStatus('downloading');
    setIsChecking(false);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15);
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setStatus('ready-to-restart');
      }
      setDownloadProgress(progress);
    }, 400);
  };

  const handleRestart = () => {
    alert("Restarting application to apply updates...");
    window.location.reload();
  };

  const copySystemInfo = () => {
    const info = `
Master Coda v2.4.1 (Build 8902)
Channel: ${channel.toUpperCase()}
OS: ${navigator.platform}
User Agent: ${navigator.userAgent}
Memory: ${((performance as any).memory?.jsHeapSizeLimit / (1024 * 1024)).toFixed(0)}MB
    `.trim();
    navigator.clipboard.writeText(info);
    alert("System info copied to clipboard.");
  };

  const handleDeepLink = (path: string) => {
    const evt = new CustomEvent('app-navigate', { detail: path });
    window.dispatchEvent(evt);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-y-auto custom-scrollbar font-sans">
      <div className="max-w-[800px] mx-auto w-full px-8 py-16 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* 1. Branding Header */}
        <section className="flex flex-col items-center text-center space-y-8">
           <div className="relative group">
              <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition duration-1000" />
              <div className="relative w-24 h-24 rounded-3xl bg-indigo-600 flex items-center justify-center text-5xl font-bold text-white shadow-[0_0_50px_rgba(79,70,229,0.4)] transform hover:scale-105 transition-transform duration-500">
                 M
              </div>
           </div>
           
           <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white tracking-tighter">Master Coda</h1>
              <div className="flex items-center justify-center space-x-3">
                 <span className="text-lg font-mono text-indigo-400">v2.4.1</span>
                 <span className="text-slate-600 text-sm font-mono">Build 8902</span>
              </div>
              <p className="text-slate-500 text-sm">Released: October 14, 2025</p>
           </div>

           <div className="flex flex-col items-center space-y-4">
              <UpdateStatusIndicator status={status} progress={downloadProgress} onRestart={handleRestart} />
              
              {status === 'up-to-date' && (
                 <Button 
                    variant="secondary" 
                    size="sm" 
                    icon={<RefreshCwIcon size={14} className={isChecking ? 'animate-spin' : ''} />}
                    onClick={handleCheckUpdates}
                    disabled={isChecking}
                 >
                    {isChecking ? 'Checking...' : 'Check for Updates'}
                 </Button>
              )}
           </div>
        </section>

        {/* 2. Release Channel Selector */}
        <section className="bg-slate-800/40 border border-slate-800 rounded-3xl p-8 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                 <ShieldIcon size={14} className="mr-2 text-indigo-400" />
                 Release Channel
              </h3>
              <Badge variant={channel === 'stable' ? 'success' : 'warning'}>
                 {channel.toUpperCase()}
              </Badge>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ChannelCard 
                 active={channel === 'stable'} 
                 onClick={() => setChannel('stable')} 
                 label="Stable" 
                 desc="Recommended. Monthly updates for maximum reliability." 
                 icon={<CheckCircleIcon size={16}/>}
              />
              <ChannelCard 
                 active={channel === 'insiders'} 
                 onClick={() => setChannel('insiders')} 
                 label="Insiders" 
                 desc="Weekly builds. Get the latest AI features early." 
                 icon={<SparklesIcon size={16}/>}
              />
              <ChannelCard 
                 active={channel === 'nightly'} 
                 onClick={() => {
                    if(confirm("Nightly builds are unstable and can contain data-corrupting bugs. Proceed?")) {
                       setChannel('nightly');
                    }
                 }} 
                 label="Nightly" 
                 desc="Bleeding edge. Fresh code from every successful CI run." 
                 icon={<ActivityIcon size={16}/>}
              />
           </div>
        </section>

        {/* 3. Changelog Feed */}
        <section className="space-y-10">
           <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                 <HistoryIconProxy size={20} className="mr-3 text-indigo-400" />
                 What's New
              </h2>
              <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">Full Release Notes &rsaquo;</button>
           </div>

           <div className="relative pl-8 space-y-12">
              <div className="absolute left-[15px] top-4 bottom-4 w-px bg-slate-800" />
              
              {CHANGELOG.map((release, ridx) => (
                 <div key={release.version} className="relative group animate-in slide-in-from-left-2 duration-500" style={{ animationDelay: `${ridx * 150}ms` }}>
                    <div className={`absolute left-[-23px] top-1.5 w-3 h-3 rounded-full border-2 border-[#0f172a] transition-all group-hover:scale-125 ${release.isCurrent ? 'bg-indigo-500 shadow-[0_0_10px_#6366f1]' : 'bg-slate-700'}`} />
                    
                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                             <h3 className="text-lg font-bold text-white tracking-tight">{release.version}</h3>
                             <span className="text-[10px] text-slate-500 font-mono">{release.date}</span>
                             {release.isCurrent && <Badge variant="info">CURRENT</Badge>}
                          </div>
                       </div>
                       
                       <div className="bg-slate-800/20 border border-slate-800 rounded-2xl p-6 group-hover:border-indigo-500/20 transition-all">
                          <h4 className="text-sm font-bold text-slate-300 mb-4">{release.title}</h4>
                          <ul className="space-y-3">
                             {release.items.map((item, i) => (
                                <li key={i} className="flex items-start group/item">
                                   <div className="mt-1 mr-3 shrink-0">
                                      {item.type === 'feature' ? <SparklesIcon size={12} className="text-indigo-400" /> :
                                       item.type === 'fix' ? <AlertTriangleIcon size={12} className="text-red-400" /> :
                                       item.type === 'improvement' ? <RocketIcon size={12} className="text-emerald-400" /> :
                                       <ShieldIcon size={12} className="text-blue-400" />}
                                   </div>
                                   <p className="text-sm text-slate-400 leading-relaxed group-hover/item:text-slate-200 transition-colors flex-1">
                                      {item.label}
                                      {item.link && (
                                         <button 
                                            onClick={() => handleDeepLink(item.link!)}
                                            className="ml-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest opacity-0 group-hover/item:opacity-100 transition-all hover:text-indigo-300"
                                         >
                                            Try it now
                                         </button>
                                      )}
                                   </p>
                                </li>
                             ))}
                          </ul>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </section>

        {/* 4. Footer Legal & Info */}
        <footer className="pt-10 border-t border-slate-800 flex flex-col items-center space-y-8 pb-20">
           <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <FooterLink label="License Agreement" />
              <FooterLink label="Privacy Policy" />
              <FooterLink label="Third-Party Notices" />
              <FooterLink label="GitHub Repository" />
           </div>

           <div className="flex flex-col items-center space-y-4">
              <button 
                 onClick={copySystemInfo}
                 className="flex items-center text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-all bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-800"
              >
                 <CodeIcon size={12} className="mr-2" />
                 Copy System Information
              </button>
              <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.2em]">
                 &copy; 2025 Master Coda Technologies Inc. All rights reserved.
              </p>
           </div>
        </footer>
      </div>
    </div>
  );
};

// Sub-components

const UpdateStatusIndicator: React.FC<{ status: UpdateStatus; progress: number; onRestart: () => void }> = ({ status, progress, onRestart }) => {
   if (status === 'up-to-date') {
      return (
         <div className="flex items-center text-emerald-400 font-bold text-sm uppercase tracking-[0.1em] animate-in zoom-in duration-500">
            <CheckCircleIcon size={18} className="mr-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
            Application is up to date
         </div>
      );
   }

   if (status === 'checking') {
      return (
         <div className="flex items-center text-slate-400 font-mono text-sm animate-pulse uppercase tracking-widest">
            <RotateCwIcon size={18} className="mr-2 animate-spin" />
            Scanning Registry...
         </div>
      );
   }

   if (status === 'downloading') {
      return (
         <div className="flex flex-col items-center space-y-3 w-64 animate-in fade-in">
            <div className="flex justify-between w-full text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
               <span>Downloading v2.4.2...</span>
               <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
               <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
         </div>
      );
   }

   if (status === 'ready-to-restart') {
      return (
         <button 
            onClick={onRestart}
            className="flex items-center px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm uppercase tracking-widest animate-pulse shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all active:scale-95"
         >
            <RotateCwIcon size={18} className="mr-3" />
            Restart to Apply Update
         </button>
      );
   }

   return (
      <div className="text-red-400 font-bold flex items-center text-sm uppercase tracking-widest">
         <AlertTriangleIcon size={18} className="mr-2" />
         Update Engine Error
      </div>
   );
};

const ChannelCard: React.FC<{ active: boolean; onClick: () => void; label: string; desc: string; icon: React.ReactNode }> = ({ active, onClick, label, desc, icon }) => (
   <button 
      onClick={onClick}
      className={`p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${
         active ? 'bg-indigo-600/10 border-indigo-500 shadow-xl' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
      }`}
   >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all ${
         active ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500 group-hover:text-slate-300'
      }`}>
         {icon}
      </div>
      <h4 className={`text-sm font-bold mb-1 transition-colors ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
         {label}
      </h4>
      <p className="text-[10px] text-slate-500 leading-relaxed">{desc}</p>
   </button>
);

const FooterLink: React.FC<{ label: string }> = ({ label }) => (
   <button className="text-[11px] font-bold text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-widest">
      {label}
   </button>
);

const HistoryIconProxy: React.FC<any> = (props) => (
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
     <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
     <path d="M3 3v5h5" />
     <path d="M12 7v5l4 2" />
   </svg>
);

export default AboutUpdates;
