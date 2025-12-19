import React, { useState, useEffect } from 'react';
import { Extension } from '../types';
import Button from './Button';
import Badge from './Badge';
import { 
  CheckCircleIcon, 
  ChevronRightIcon, 
  ChevronDownIcon, 
  RotateCwIcon, 
  ExternalLinkIcon,
  ShieldIcon,
  ActivityIcon,
  ClockIcon,
  TagIcon,
  LockIcon,
  TrashIcon,
  CodeIcon,
  MessageSquareIcon,
  ArrowRightIcon,
  XCircleIcon,
  SettingsIcon
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

interface ExtensionDetailProps {
  extension: Extension;
  onClose: () => void;
  onInstall: (id: string) => void;
  onUninstall: (id: string) => void;
}

type Tab = 'overview' | 'changelog' | 'config' | 'reviews';

const ExtensionDetail: React.FC<ExtensionDetailProps> = ({ extension, onClose, onInstall, onUninstall }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isEnabled, setIsEnabled] = useState(extension.status === 'installed');

  const isInstalling = extension.status === 'installing';
  const isInstalled = extension.status === 'installed';

  const handleConfigure = () => {
     // Emit navigation event
     const evt = new CustomEvent('app-navigate', { detail: `/extensions/settings/${extension.id}` });
     window.dispatchEvent(evt);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden font-sans">
      
      {/* 1. Header Navigation */}
      <nav className="h-14 border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 flex items-center justify-between shrink-0 z-20">
         <button 
           onClick={onClose}
           className="flex items-center text-sm font-medium text-slate-500 hover:text-white transition-colors"
         >
            <ArrowRightIcon className="rotate-180 mr-2" size={16} />
            Back to Extensions
         </button>
         <div className="flex items-center space-x-3 text-xs font-mono text-slate-500">
            <span>MC_ID: {extension.id}</span>
            <span>|</span>
            <span className="text-emerald-500">MC-V2.0 COMPATIBLE</span>
         </div>
      </nav>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
         <div className="max-w-[1000px] mx-auto pb-20">
            
            {/* 2. Hero Header */}
            <header className="p-8 md:p-12 bg-slate-850/50 border-b border-slate-800 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 animate-in fade-in slide-in-from-top-4 duration-500">
               {/* Large Icon */}
               <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-slate-900 border border-slate-700 flex items-center justify-center text-5xl md:text-6xl shadow-2xl shrink-0 group hover:scale-105 transition-transform duration-500">
                  {typeof extension.icon === 'string' ? extension.icon : extension.icon}
               </div>

               {/* Info Stack */}
               <div className="flex-1 text-center md:text-left space-y-4">
                  <div className="space-y-1">
                     <div className="flex items-center justify-center md:justify-start space-x-3">
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{extension.title}</h1>
                        {extension.verified && (
                           <div className="bg-blue-500/10 text-blue-400 p-1 rounded-full border border-blue-500/20" title="Verified Publisher">
                              <CheckCircleIcon size={18} />
                           </div>
                        )}
                     </div>
                     <p className="text-lg text-slate-400 font-light">{extension.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                     <Badge variant="neutral">{extension.version}</Badge>
                     <Badge variant="info">{extension.category.toUpperCase()}</Badge>
                     {extension.verified && <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Verified Publisher</span>}
                  </div>
               </div>

               {/* Action Area */}
               <div className="shrink-0 flex flex-col items-center md:items-end space-y-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-inner">
                  <div className="space-y-3 w-full">
                     {isInstalled ? (
                        <div className="flex flex-col space-y-3">
                           <div className="flex items-center justify-between space-x-4 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enabled</span>
                              <button 
                                 onClick={() => setIsEnabled(!isEnabled)}
                                 className={`w-10 h-5 rounded-full p-1 transition-all duration-300 relative ${isEnabled ? 'bg-indigo-600' : 'bg-slate-700'}`}
                              >
                                 <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                              </button>
                           </div>
                           <Button 
                              variant="primary" 
                              className="w-full bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                              onClick={handleConfigure}
                              icon={<SettingsIcon size={16} />}
                           >
                              Configure
                           </Button>
                           <Button 
                              variant="secondary" 
                              className="w-full text-red-400 hover:text-red-300 hover:bg-red-900/10 border-red-500/20"
                              onClick={() => onUninstall(extension.id)}
                              icon={<TrashIcon size={16} />}
                           >
                              Uninstall
                           </Button>
                        </div>
                     ) : (
                        <Button 
                           variant="primary" 
                           className="w-full h-12 text-base shadow-[0_0_30px_rgba(79,70,229,0.3)] min-w-[160px]"
                           onClick={() => onInstall(extension.id)}
                           disabled={isInstalling}
                        >
                           {isInstalling ? (
                              <div className="flex items-center">
                                 <RotateCwIcon size={18} className="animate-spin mr-3" />
                                 Installing...
                              </div>
                           ) : (
                              'Install'
                           )}
                        </Button>
                     )}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono text-center md:text-right">
                     REQUIRES MCODA >= v0.3.0
                  </div>
               </div>
            </header>

            {/* 3. Navigation Tabs */}
            <div className="px-8 border-b border-slate-800 bg-slate-900/30 sticky top-0 z-10 backdrop-blur">
               <div className="flex space-x-8">
                  <DetailTab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview" />
                  <DetailTab active={activeTab === 'changelog'} onClick={() => setActiveTab('changelog')} label="Changelog" />
                  <DetailTab active={activeTab === 'config'} onClick={() => setActiveTab('config')} label="Configuration" />
                  <DetailTab active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} label="Reviews" badge={4} />
               </div>
            </div>

            {/* 4. Content Area: Two Columns */}
            <div className="p-8 flex flex-col md:flex-row gap-12">
               
               {/* Main (Left) */}
               <main className="flex-1 min-w-0 animate-in fade-in duration-700">
                  {activeTab === 'overview' && (
                     <div className="prose prose-invert prose-indigo max-w-none">
                        {extension.readme ? (
                           <MarkdownRenderer content={extension.readme} />
                        ) : (
                           <div className="py-20 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl">
                              <BoxIconProxy size={48} className="mb-4 opacity-20" />
                              <p>No README available for this extension.</p>
                           </div>
                        )}
                     </div>
                  )}

                  {activeTab === 'changelog' && (
                     <div className="space-y-8">
                        {extension.changelog?.map((release, i) => (
                           <div key={i} className="relative pl-8">
                              <div className="absolute left-0 top-1 bottom-0 w-px bg-slate-800" />
                              <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                              <div className="mb-2 flex items-center space-x-3">
                                 <span className="text-lg font-bold text-white">{release.version}</span>
                                 <span className="text-xs text-slate-500 font-mono">{release.date}</span>
                              </div>
                              <ul className="space-y-2">
                                 {release.changes.map((change, j) => (
                                    <li key={j} className="text-sm text-slate-400 flex items-start">
                                       <span className="text-indigo-500 mr-2 mt-1">•</span>
                                       {change}
                                    </li>
                                 ))}
                              </ul>
                           </div>
                        )) || (
                           <p className="text-slate-500">No changelog data found.</p>
                        )}
                     </div>
                  )}

                  {activeTab === 'config' && (
                     <div className="space-y-6">
                        <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-4 flex items-start space-x-3">
                           <ShieldIcon className="text-indigo-400 mt-0.5" size={18} />
                           <div className="text-sm text-indigo-200/80 leading-relaxed">
                              These configuration keys will be available in your <code className="bg-indigo-950 px-1 rounded text-indigo-300">config.json</code> after installation.
                           </div>
                        </div>

                        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden shadow-inner">
                           <table className="w-full text-left text-sm border-collapse">
                              <thead className="bg-slate-900/50 border-b border-slate-700 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                 <tr>
                                    <th className="px-6 py-3">Property</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Default</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-700/50">
                                 {extension.configSchema?.map((cfg, i) => (
                                    <tr key={i} className="hover:bg-slate-700/30 transition-colors group">
                                       <td className="px-6 py-4">
                                          <div className="font-mono text-indigo-300 font-bold mb-1">{cfg.key}</div>
                                          <div className="text-xs text-slate-500 leading-relaxed">{cfg.description}</div>
                                       </td>
                                       <td className="px-6 py-4">
                                          <span className="text-[10px] font-bold bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded border border-slate-600 uppercase">{cfg.type}</span>
                                       </td>
                                       <td className="px-6 py-4 font-mono text-xs text-slate-400">
                                          {JSON.stringify(cfg.default)}
                                       </td>
                                    </tr>
                                 )) || (
                                    <tr>
                                       <td colSpan={3} className="px-6 py-12 text-center text-slate-600 italic">This extension provides no custom settings.</td>
                                    </tr>
                                 )}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  )}

                  {activeTab === 'reviews' && (
                     <div className="space-y-8 py-4">
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center space-x-2">
                              <div className="flex text-amber-400">
                                 <StarIcon size={20} />
                                 <StarIcon size={20} />
                                 <StarIcon size={20} />
                                 <StarIcon size={20} />
                                 <StarIcon size={20} className="opacity-30" />
                              </div>
                              <span className="text-xl font-bold text-white">4.8</span>
                              <span className="text-slate-500 text-sm">(124 reviews)</span>
                           </div>
                           <Button variant="secondary" size="sm">Write a Review</Button>
                        </div>
                        
                        {/* Mock Reviews */}
                        <div className="space-y-6">
                           <ReviewItem user="Sarah J." rating={5} date="3 days ago" text="Absolutely essential for our data engineering team. The agent understands pandas schemas better than I do sometimes!" />
                           <ReviewItem user="Mike R." rating={4} date="1 week ago" text="Great integration with Matplotlib. Looking forward to more interactive features." />
                        </div>
                     </div>
                  )}
               </main>

               {/* Sidebar (Right) */}
               <aside className="w-full md:w-[300px] shrink-0 space-y-10">
                  
                  {/* Metadata Stats */}
                  <section className="space-y-4">
                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Extension Data</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <StatBox label="Downloads" value={extension.downloads} icon={<ActivityIcon size={14} />} />
                        <StatBox label="Rating" value={`${extension.rating} / 5`} icon={<StarIcon size={14} />} />
                        <StatBox label="License" value={extension.license || 'Proprietary'} icon={<ShieldIcon size={14} />} />
                        <StatBox label="Version" value={extension.version} icon={<TagIcon size={14} />} />
                     </div>
                  </section>

                  {/* Resources Links */}
                  <section className="space-y-4">
                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Resources</h3>
                     <div className="flex flex-col space-y-1">
                        <ResourceLink label="Project Repository" href={extension.repository} icon={<CodeIcon size={14} />} />
                        <ResourceLink label="Report an Issue" href="#" icon={<XCircleIcon size={14} />} />
                        <ResourceLink label="Publisher Profile" href="#" icon={<LockIcon size={14} />} />
                     </div>
                  </section>

                  {/* Tags */}
                  <section className="space-y-4">
                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tags</h3>
                     <div className="flex flex-wrap gap-2">
                        {extension.tags.map(tag => (
                           <span key={tag} className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 transition-all cursor-default">
                              #{tag.toUpperCase()}
                           </span>
                        ))}
                     </div>
                  </section>

                  {/* Contributors */}
                  <section className="space-y-4">
                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Contributors</h3>
                     <div className="flex -space-x-2 overflow-hidden">
                        {[1, 2, 3, 4].map(i => (
                           <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white shadow-lg`}>
                              {String.fromCharCode(64 + i)}
                           </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">+12</div>
                     </div>
                  </section>

               </aside>

            </div>
         </div>
      </div>

    </div>
  );
};

// Sub-components

const DetailTab: React.FC<{ active: boolean; onClick: () => void; label: string; badge?: number }> = ({ active, onClick, label, badge }) => (
   <button 
      onClick={onClick}
      className={`pb-4 pt-6 text-sm font-bold uppercase tracking-widest transition-all relative flex items-center ${
         active ? 'text-white' : 'text-slate-500 hover:text-slate-300'
      }`}
   >
      {label}
      {badge !== undefined && (
         <span className="ml-2 text-[10px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded-full font-mono">{badge}</span>
      )}
      {active && (
         <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-in fade-in slide-in-from-bottom-1" />
      )}
   </button>
);

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
   // Simple fake markdown renderer
   return (
      <div className="space-y-6 text-slate-300 leading-relaxed font-sans">
         {content.split('\n').map((line, i) => {
            if (line.startsWith('# ')) return <h1 key={i} className="text-4xl font-bold text-white mt-12 mb-6">{line.replace('# ', '')}</h1>;
            if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-slate-100 mt-10 mb-4 border-b border-slate-800 pb-2">{line.replace('## ', '')}</h2>;
            if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-slate-200 mt-8 mb-3">{line.replace('### ', '')}</h3>;
            if (line.startsWith('- ')) return <li key={i} className="ml-6 mb-2 list-disc">{line.replace('- ', '')}</li>;
            if (line.startsWith('```')) return null; // skip code blocks
            if (!line.trim()) return <br key={i} />;
            return <p key={i}>{line}</p>;
         })}
      </div>
   );
};

const StatBox: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
   <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 shadow-sm hover:border-slate-600 transition-colors">
      <div className="flex items-center text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">
         <span className="mr-2 text-indigo-400 opacity-70">{icon}</span>
         {label}
      </div>
      <div className="text-lg font-bold text-white tracking-tight">{value}</div>
   </div>
);

const ResourceLink: React.FC<{ label: string; href?: string; icon: React.ReactNode }> = ({ label, href, icon }) => (
   <a 
      href={href || '#'} 
      className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 text-sm text-slate-400 hover:text-indigo-300 transition-all group border border-transparent hover:border-indigo-500/20"
      target="_blank"
      rel="noopener noreferrer"
   >
      <div className="flex items-center">
         <span className="mr-3 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all">{icon}</span>
         {label}
      </div>
      <ExternalLinkIcon size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
   </a>
);

const ReviewItem: React.FC<{ user: string; rating: number; date: string; text: string }> = ({ user, rating, date, text }) => (
   <div className="space-y-3 p-6 bg-slate-900/30 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between">
         <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
               {user[0]}
            </div>
            <div>
               <div className="text-sm font-bold text-white">{user}</div>
               <div className="text-[10px] text-slate-500 font-mono">{date}</div>
            </div>
         </div>
         <div className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
               <StarIcon key={i} size={14} className={i < rating ? '' : 'opacity-10'} />
            ))}
         </div>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed italic">"{text}"</p>
   </div>
);

export default ExtensionDetail;