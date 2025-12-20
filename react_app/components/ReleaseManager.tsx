
import React, { useState, useEffect } from 'react';
import { MOCK_RELEASES, MOCK_ENVIRONMENTS, MOCK_FILE_CHANGES } from '../constants';
import { Release, VersionType, EnvironmentStatus } from '../types';
import Button from './Button';
import Badge from './Badge';
import { 
  RocketIcon, 
  SparklesIcon, 
  HistoryIcon, 
  TagIcon, 
  CheckCircleIcon, 
  AlertCircleIcon, 
  ClockIcon, 
  UserIcon, 
  GitCommitIcon,
  ChevronRightIcon,
  RotateCwIcon,
  RefreshCwIcon,
  SaveIcon,
  ArrowRightIcon,
  AlertTriangleIcon
} from './Icons';

const ReleaseManager: React.FC = () => {
  const [environments, setEnvironments] = useState<EnvironmentStatus[]>(MOCK_ENVIRONMENTS);
  const [releases, setReleases] = useState<Release[]>(MOCK_RELEASES);
  const [versionType, setVersionType] = useState<VersionType>('patch');
  const [changelog, setChangelog] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStep, setPublishStep] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Semver helper
  const calculateNextVersion = (current: string, type: VersionType) => {
    const parts = current.replace('v', '').split('.').map(Number);
    if (type === 'major') { parts[0]++; parts[1] = 0; parts[2] = 0; }
    else if (type === 'minor') { parts[1]++; parts[2] = 0; }
    else { parts[2]++; }
    return `v${parts.join('.')}`;
  };

  const currentProdVersion = environments.find(e => e.name === 'Production')?.version || 'v1.1.5';
  const nextVersion = calculateNextVersion(currentProdVersion, versionType);

  const handleGenerateChangelog = async () => {
    setIsGenerating(true);
    setChangelog('');
    
    // Simulate AI scanning commits
    await new Promise(r => setTimeout(r, 1500));
    
    const lines = [
      "### Features",
      "- Added Agent Playbook system for reusable reasoning patterns",
      "- Implemented Quality Hub for centralized test orchestration",
      "",
      "### Fixes",
      "- Resolved memory leak in Dependency Graph WebGL context",
      "- Fixed CSS overflow in Task Detail slide-over",
      "",
      "### Performance",
      "- Optimized SQLite query indexing for faster workspace cold-starts"
    ];

    // Simulate typing paragraph by paragraph
    for (const line of lines) {
      setChangelog(prev => prev + line + '\n');
      await new Promise(r => setTimeout(r, 100));
    }
    
    setIsGenerating(false);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishStep('Tagging release...');
    await new Promise(r => setTimeout(r, 1200));
    
    setPublishStep('Pushing to origin...');
    await new Promise(r => setTimeout(r, 1000));
    
    setPublishStep('Triggering Deployment Pipeline...');
    await new Promise(r => setTimeout(r, 1500));

    // Success
    const newRelease: Release = {
      id: `rel-${Date.now()}`,
      tag: nextVersion,
      date: 'Just now',
      author: 'Alex Dev',
      changelog,
      commitHash: 'b5e4a3f',
      status: 'published'
    };

    setReleases([newRelease, ...releases]);
    setEnvironments(prev => prev.map(e => e.name === 'Staging' ? { ...e, version: nextVersion, lastDeploy: 'Just now' } : e));
    
    setIsPublishing(false);
    setPublishStep('');
    setChangelog('');
  };

  const isDirty = MOCK_FILE_CHANGES.length > 0;

  return (
    <div className="p-8 max-w-[1000px] mx-auto space-y-10 animate-in fade-in duration-500 pb-24">
      
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight">Release Manager</h1>
            <p className="text-slate-400 mt-1">Semantic versioning and deployment command center</p>
         </div>
         <div className="flex items-center space-x-3">
            <button className="p-2 text-slate-500 hover:text-white rounded-md hover:bg-slate-800 transition-colors">
               <HistoryIcon size={20} />
            </button>
            <button className="p-2 text-slate-500 hover:text-white rounded-md hover:bg-slate-800 transition-colors">
               <RotateCwIcon size={20} />
            </button>
         </div>
      </div>

      {/* 2. Environment Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {environments.map(env => (
            <article 
              key={env.id} 
              aria-label={`${env.name} Environment status`}
              className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm hover:border-slate-600 transition-all group"
            >
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                     <div className={`w-2.5 h-2.5 rounded-full ${env.status === 'healthy' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 animate-pulse'}`} />
                     <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">{env.name}</h3>
                  </div>
                  {env.uptime && <span className="text-[10px] font-mono text-slate-500">UPTIME: {env.uptime}</span>}
               </div>

               <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                     <div className="text-2xl font-bold text-white tracking-tight">{env.version}</div>
                     <div className="text-[10px] text-slate-500 font-mono flex items-center">
                        <ClockIcon size={10} className="mr-1" />
                        DEPLOYED {env.lastDeploy.toUpperCase()} BY {env.author.toUpperCase()}
                     </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-700 group-hover:border-indigo-500/50 transition-colors">
                     <RocketIcon size={24} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  </div>
               </div>

               <div className="flex items-center space-x-2">
                  {env.name === 'Staging' ? (
                     <Button 
                        variant="primary" 
                        size="sm" 
                        className="w-full bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold"
                     >
                        Promote to Production
                     </Button>
                  ) : (
                     <Button 
                        variant="destructive" 
                        size="sm" 
                        className="w-full bg-red-900/10 hover:bg-red-900/20 text-red-400 border border-red-500/20 font-bold"
                     >
                        Rollback Release
                     </Button>
                  )}
               </div>
            </article>
         ))}
      </div>

      {/* 3. Draft Release Panel */}
      <section className="bg-slate-800 border-2 border-indigo-500/20 rounded-2xl shadow-xl overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-indigo-500/50" />
         
         <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                     <TagIcon className="text-indigo-400" size={20} />
                  </div>
                  <div>
                     <h2 className="text-xl font-bold text-white">Draft Release</h2>
                     <p className="text-xs text-slate-500">Prepare the next version bump</p>
                  </div>
               </div>

               {/* Version Selector */}
               <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
                  {(['patch', 'minor', 'major'] as VersionType[]).map(type => (
                     <button
                        key={type}
                        onClick={() => setVersionType(type)}
                        className={`px-4 py-2 text-[10px] font-bold uppercase rounded-md transition-all ${
                           versionType === type 
                           ? 'bg-indigo-600 text-white shadow-lg' 
                           : 'text-slate-500 hover:text-slate-300'
                        }`}
                     >
                        {type} ({calculateNextVersion(currentProdVersion, type)})
                     </button>
                  ))}
               </div>
            </div>

            {/* Version Display */}
            <div className="flex items-center space-x-4">
               <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Next Tag</label>
                  <input 
                     type="text" 
                     value={nextVersion}
                     readOnly
                     className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-2xl font-bold text-indigo-400 outline-none focus:border-indigo-500 font-mono shadow-inner"
                  />
               </div>
               <div className="shrink-0 pt-6">
                  <ArrowRightIcon className="text-slate-700" size={32} />
               </div>
               <div className="flex-1 space-y-2 opacity-50">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current (Prod)</label>
                  <div className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-2xl font-bold text-slate-500 font-mono">
                     {currentProdVersion}
                  </div>
               </div>
            </div>

            {/* Changelog Editor */}
            <div className="space-y-3">
               <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center">
                     What's New
                  </h3>
                  <button 
                     onClick={handleGenerateChangelog}
                     disabled={isGenerating}
                     className="px-3 py-1.5 rounded-full bg-indigo-500/10 hover:bg-indigo-600 text-indigo-400 hover:text-white text-[10px] font-bold border border-indigo-500/30 transition-all flex items-center group"
                  >
                     {isGenerating ? <RotateCwIcon size={12} className="animate-spin mr-2" /> : <SparklesIcon size={12} className="mr-2 group-hover:animate-pulse" />}
                     GENERATE CHANGELOG
                  </button>
               </div>
               <div className="relative group">
                  <textarea 
                     value={changelog}
                     onChange={e => setChangelog(e.target.value)}
                     className="w-full h-48 bg-slate-950 border border-slate-700 rounded-xl p-6 text-sm font-mono leading-relaxed text-slate-300 focus:outline-none focus:border-indigo-500 transition-all custom-scrollbar placeholder-slate-800"
                     placeholder="Click generate to summarize recent commits..."
                  />
                  {isGenerating && (
                     <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
                        <div className="flex flex-col items-center space-y-4">
                           <SparklesIcon size={32} className="text-indigo-500 animate-pulse" />
                           <span className="text-xs font-mono text-indigo-400">Agent reading 12 commits...</span>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Publishing Controls */}
         <div className="p-8 bg-slate-900/50 border-t border-slate-700 flex items-center justify-between">
            <div className="flex items-center space-x-6">
               {isDirty ? (
                  <div className="flex items-center text-amber-500 space-x-2 bg-amber-500/5 px-3 py-1.5 rounded border border-amber-500/20">
                     <AlertTriangleIcon size={14} />
                     <span className="text-[10px] font-bold uppercase tracking-tight">Working directory is dirty</span>
                  </div>
               ) : (
                  <div className="flex items-center text-emerald-500 space-x-2">
                     <CheckCircleIcon size={14} />
                     <span className="text-[10px] font-bold uppercase tracking-tight">Repo Clean & Verified</span>
                  </div>
               )}
            </div>

            <div className="flex items-center space-x-4">
               <Button variant="ghost">Save Draft</Button>
               <Button 
                  variant="primary" 
                  disabled={isDirty || isPublishing || !changelog}
                  onClick={handlePublish}
                  className="px-8 shadow-[0_0_30px_rgba(79,70,229,0.3)] min-w-[200px]"
               >
                  {isPublishing ? (
                     <div className="flex items-center">
                        <RotateCwIcon size={16} className="animate-spin mr-3" />
                        {publishStep}
                     </div>
                  ) : (
                     <div className="flex items-center">
                        <RocketIcon size={16} className="mr-3" />
                        Publish Release
                     </div>
                  )}
               </Button>
            </div>
         </div>
      </section>

      {/* 4. Release History */}
      <section className="space-y-6">
         <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
               <HistoryIcon size={14} className="mr-2" />
               Release History
            </h2>
            <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300">VIEW ALL</button>
         </div>

         <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-[20px] top-4 bottom-4 w-px bg-slate-800" />

            <div className="space-y-4">
               {releases.map((rel, idx) => (
                  <div key={rel.id} className="relative pl-12 group animate-in slide-in-from-left-2" style={{ animationDelay: `${idx * 100}ms` }}>
                     {/* Timeline Dot */}
                     <div className="absolute left-4 top-3 w-2 h-2 rounded-full bg-slate-700 group-hover:bg-indigo-500 transition-colors border-4 border-slate-900 z-10 box-content" />
                     
                     <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-start justify-between hover:bg-slate-800 transition-all cursor-default">
                        <div className="flex-1 min-w-0 pr-6">
                           <div className="flex items-center space-x-3 mb-2">
                              <span className="text-sm font-bold text-white">{rel.tag}</span>
                              <span className="text-[10px] text-slate-600 font-mono">{rel.date}</span>
                              <Badge variant="neutral">{rel.author}</Badge>
                           </div>
                           <p className="text-xs text-slate-400 line-clamp-1 group-hover:line-clamp-none transition-all leading-relaxed">
                              {rel.changelog.replace(/#+ /g, '').split('\n').join(' • ')}
                           </p>
                        </div>
                        <div className="flex items-center space-x-4 shrink-0">
                           <div className="flex flex-col items-end">
                              <div className="flex items-center text-[10px] font-mono text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/20">
                                 <GitCommitIcon size={10} className="mr-1" />
                                 {rel.commitHash}
                              </div>
                           </div>
                           <ChevronRightIcon size={16} className="text-slate-700 group-hover:text-slate-400" />
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

    </div>
  );
};

export default ReleaseManager;
