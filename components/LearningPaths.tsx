import React, { useState, useMemo } from 'react';
import { LearningPath, PathModule, PathModuleType, PathModuleStatus } from '../types';
import { MOCK_LEARNING_PATHS } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  BookOpenIcon, 
  TerminalIcon, 
  HelpCircleIcon, 
  ActivityIcon, 
  CheckCircleIcon, 
  LockIcon, 
  ChevronRightIcon, 
  ChevronDownIcon, 
  PlusIcon, 
  SettingsIcon,
  SearchIcon,
  ActivityIcon as PulseIcon,
  ShieldIcon,
  ArrowRightIcon,
  SparklesIcon,
  UserIcon,
  ClockIcon,
  // Added AlertTriangleIcon to imports to resolve the missing name error in EnrollmentStat
  AlertTriangleIcon
} from './Icons';

const LearningPaths: React.FC = () => {
  const [paths, setPaths] = useState<LearningPath[]>(MOCK_LEARNING_PATHS);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(MOCK_LEARNING_PATHS[0].id);
  const [isCreatorMode, setIsCreatorMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activePath = useMemo(() => paths.find(p => p.id === selectedPathId), [paths, selectedPathId]);

  const handleModuleClick = (moduleId: string) => {
    if (!activePath) return;
    const module = activePath.modules.find(m => m.id === moduleId);
    if (!module || module.status === 'locked') return;

    // Simulation: Mark as completed
    if (module.status === 'active') {
       setPaths(prev => prev.map(p => {
          if (p.id !== activePath.id) return p;
          
          const newModules = p.modules.map(m => {
             if (m.id === moduleId) return { ...m, status: 'completed' as PathModuleStatus };
             // Unlock next if previous completed
             return m;
          });

          // Unlock logic: first non-completed module becomes active
          const firstIncompleteIdx = newModules.findIndex(m => m.status !== 'completed');
          if (firstIncompleteIdx !== -1) {
             newModules[firstIncompleteIdx].status = 'active';
          }

          // Recalculate progress
          const completedCount = newModules.filter(m => m.status === 'completed').length;
          const progress = Math.round((completedCount / newModules.length) * 100);

          return { ...p, modules: newModules, progress };
       }));
    }

    if (module.resourceId) {
       // Emit event to open document
       const evt = new CustomEvent('app-navigate', { detail: `/docs/view/${module.resourceId}` });
       window.dispatchEvent(evt);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Dashboard Header */}
      <header className="h-[64px] border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 flex items-center justify-between px-8 z-30 sticky top-0 shadow-lg">
         <div className="flex items-center space-x-6">
            <div className="flex items-center">
               <BookOpenIcon className="mr-3 text-indigo-400" size={24} />
               <h1 className="text-xl font-bold text-white tracking-tight uppercase">Team Learning Paths</h1>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            <div className="flex items-center bg-slate-800 rounded p-1 border border-slate-700">
               <button 
                  onClick={() => setIsCreatorMode(false)}
                  className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                     !isCreatorMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                  }`}
               >My Progress</button>
               <button 
                  onClick={() => setIsCreatorMode(true)}
                  className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                     isCreatorMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                  }`}
               >Creator Mode</button>
            </div>
         </div>

         <div className="flex items-center space-x-3">
            <div className="relative group">
               <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400" />
               <input 
                  type="text" 
                  placeholder="Find a path..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-md py-1.5 pl-9 pr-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 w-48 transition-all"
               />
            </div>
            {isCreatorMode && <Button variant="primary" size="sm" icon={<PlusIcon size={14} />}>Create Path</Button>}
         </div>
      </header>

      {/* 2. Layout Grid */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* Sidebar: Path Selection */}
         <aside className="w-[300px] border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
               <h3 className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Available Paths</h3>
               {paths.map(path => (
                  <button
                     key={path.id}
                     onClick={() => setSelectedPathId(path.id)}
                     className={`w-full flex flex-col p-4 rounded-xl border transition-all text-left group ${
                        selectedPathId === path.id 
                           ? 'bg-indigo-600/10 border-indigo-500/30' 
                           : 'bg-transparent border-transparent hover:bg-slate-800/50 text-slate-400'
                     }`}
                  >
                     <div className="flex items-center justify-between w-full mb-2">
                        <span className={`text-xs font-bold truncate ${selectedPathId === path.id ? 'text-white' : 'text-slate-300'}`}>
                           {path.title}
                        </span>
                        {path.progress === 100 && <CheckCircleIcon size={14} className="text-emerald-500" />}
                     </div>
                     <div className="flex items-center justify-between w-full">
                        <div className="flex-1 h-1 bg-slate-800 rounded-full mr-4 overflow-hidden">
                           <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${path.progress}%` }} />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{path.progress}%</span>
                     </div>
                  </button>
               ))}
            </div>
         </aside>

         {/* Main content Area: The Curriculum Tracker */}
         <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#0d1117]">
            {activePath ? (
               <div className="max-w-[800px] mx-auto p-12 space-y-12 animate-in fade-in duration-700">
                  
                  {/* Path Header: DO-08 Section */}
                  <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl relative">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-500" />
                     <div className="p-8 space-y-6">
                        <div className="flex items-start justify-between">
                           <div className="space-y-2">
                              <h2 className="text-4xl font-bold text-white tracking-tight leading-tight">{activePath.title}</h2>
                              <p className="text-lg text-slate-400 font-light leading-relaxed max-w-xl">{activePath.subtitle}</p>
                           </div>
                           <div className="shrink-0 pt-2">
                              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                 <BookOpenIcon size={32} />
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center space-x-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
                           <div className="flex items-center"><PulseIcon size={14} className="mr-2 text-indigo-400" /> {activePath.modules.length} Modules</div>
                           <div className="flex items-center"><ClockIcon size={14} className="mr-2 text-indigo-400" /> {activePath.estimatedTime}</div>
                           <div className="flex items-center"><UserIcon size={14} className="mr-2 text-indigo-400" /> Created by {activePath.author}</div>
                        </div>

                        <div className="space-y-3 pt-4">
                           <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                              <span>Learning Progress</span>
                              <span className="text-indigo-400 font-mono">{activePath.progress}% Complete</span>
                           </div>
                           <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden shadow-inner border border-slate-700">
                              <div className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-1000" style={{ width: `${activePath.progress}%` }} />
                           </div>
                        </div>
                        
                        <div className="pt-2 flex justify-end">
                           <Button variant="primary" className="px-10 h-12 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                              {activePath.progress === 0 ? 'Start Path' : activePath.progress === 100 ? 'Review Content' : 'Resume Journey'}
                           </Button>
                        </div>
                     </div>
                  </div>

                  {/* Module List: DO-08 Curriculum */}
                  <div className="relative pl-10 space-y-6">
                     {/* Timeline Line */}
                     <div className="absolute left-[20px] top-4 bottom-4 w-0.5 bg-slate-800" />

                     {activePath.modules.map((module, idx) => (
                        <div 
                           key={module.id} 
                           className={`relative group transition-all duration-500 ${module.status === 'locked' ? 'opacity-40' : 'opacity-100'}`}
                           style={{ animationDelay: `${idx * 100}ms` }}
                        >
                           {/* Step Indicator */}
                           <div className={`absolute left-[-30px] top-4 w-5 h-5 rounded-full border-4 border-[#0d1117] z-10 flex items-center justify-center transition-all ${
                              module.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                              module.status === 'active' ? 'bg-indigo-500 animate-pulse' :
                              'bg-slate-700'
                           }`}>
                              {module.status === 'completed' && <CheckCircleIcon size={12} className="text-white" />}
                              {module.status === 'locked' && <LockIcon size={10} className="text-slate-400" />}
                           </div>

                           <div 
                              onClick={() => handleModuleClick(module.id)}
                              className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-start gap-6 group/item ${
                                 module.status === 'active' 
                                    ? 'bg-indigo-500/5 border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.05)] scale-102 ring-1 ring-indigo-500/10' 
                                    : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80'
                              }`}
                           >
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                                 module.status === 'active' ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg' : 'bg-slate-900 text-slate-500 border-slate-800'
                              }`}>
                                 <ModuleIcon type={module.type} size={24} />
                              </div>

                              <div className="flex-1 min-w-0 space-y-1">
                                 <div className="flex items-center justify-between">
                                    <h4 className={`text-lg font-bold transition-colors ${module.status === 'active' ? 'text-indigo-300' : 'text-slate-200'}`}>
                                       {module.title}
                                    </h4>
                                    <div className="flex items-center space-x-3">
                                       {module.isStale && <Badge variant="warning">STALE CONTENT</Badge>}
                                       <span className="text-[10px] font-mono text-slate-600 uppercase font-bold tracking-widest">{module.duration}</span>
                                    </div>
                                 </div>
                                 <p className="text-sm text-slate-400 leading-relaxed">{module.description}</p>
                                 
                                 {module.status === 'active' && (
                                    <div className="pt-3 animate-in fade-in slide-in-from-top-1">
                                       <button className="flex items-center text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-all">
                                          {module.type === 'read' ? 'Open Documentation' : 
                                           module.type === 'quiz' ? 'Start Assessment' : 
                                           module.type === 'task' ? 'Open Terminal' : 'View Project'}
                                          <ArrowRightIcon size={12} className="ml-1.5" />
                                       </button>
                                    </div>
                                 )}
                              </div>

                              <div className="shrink-0 flex items-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                                 <ChevronRightIcon size={20} className="text-slate-600" />
                              </div>
                           </div>
                        </div>
                     ))}

                     {/* Completion Milestone */}
                     <div className={`relative pl-12 py-10 transition-all duration-1000 ${activePath.progress === 100 ? 'opacity-100 scale-100' : 'opacity-20 grayscale'}`}>
                        <div className="absolute left-[20px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl z-20">
                           <ShieldIcon size={18} className="text-white" />
                        </div>
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-3">
                           <h3 className="text-xl font-bold text-emerald-400 tracking-tight">Curriculum Mastered</h3>
                           <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Digital badge issued to profile enclave</p>
                        </div>
                     </div>
                  </div>

                  {isCreatorMode && (
                     <div className="pt-10 border-t border-slate-800 space-y-6">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Manager Insights</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-2xl space-y-4">
                              <h4 className="text-sm font-bold text-white">Enrollment Analytics</h4>
                              <div className="space-y-3">
                                 <EnrollmentStat user="Bob S." step="Step 2" time="3 days" stuck />
                                 <EnrollmentStat user="Jane D." step="Step 5" time="1 hour" />
                                 <EnrollmentStat user="Mike K." step="Step 1" time="15 mins" />
                              </div>
                           </div>
                           <div className="bg-indigo-900/5 border border-indigo-500/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                              <SparklesIcon size={32} className="text-indigo-400" />
                              <div>
                                 <h4 className="text-sm font-bold text-white">AI Path Auditor</h4>
                                 <p className="text-xs text-slate-500 mt-1">Found 2 outdated documentation references in Step 3.</p>
                              </div>
                              <Button variant="secondary" size="sm">Auto-update Content</Button>
                           </div>
                        </div>
                     </div>
                  )}

               </div>
            ) : (
               <div className="flex flex-col items-center justify-center h-full text-slate-600 opacity-20">
                  <PulseIcon size={64} className="mb-4" />
                  <p>Select a learning path to begin onboarding</p>
               </div>
            )}
         </main>
      </div>

      {/* 3. Global Status Bar */}
      <footer className="h-10 bg-slate-900 border-t border-slate-800 shrink-0 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-30">
         <div className="flex items-center space-x-8">
            <div className="flex items-center">
               <PulseIcon size={12} className="mr-2 text-indigo-400" />
               SERVER_STATUS: <span className="ml-2 text-emerald-500">SYNCED</span>
            </div>
            <div className="flex items-center">
               <ShieldIcon size={12} className="mr-2 text-indigo-400" />
               ENCRYPTED_LOGS: <span className="ml-2 text-slate-300">USER_LEVEL_KEY</span>
            </div>
         </div>
         <div className="flex items-center space-x-4">
            <span className="text-slate-600 font-mono">NODE_HASH: B52X_LERN</span>
         </div>
      </footer>
    </div>
  );
};

// Sub-components

const ModuleIcon: React.FC<{ type: PathModuleType; size?: number }> = ({ type, size = 16 }) => {
   switch (type) {
      case 'read': return <BookOpenIcon size={size} />;
      case 'task': return <TerminalIcon size={size} />;
      case 'quiz': return <HelpCircleIcon size={size} />;
      case 'project': return <ActivityIcon size={size} />;
   }
};

const EnrollmentStat: React.FC<{ user: string; step: string; time: string; stuck?: boolean }> = ({ user, step, time, stuck }) => (
   <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl group hover:border-indigo-500/30 transition-all">
      <div className="flex items-center space-x-3">
         <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500">{user[0]}</div>
         <span className="text-xs font-bold text-slate-300">{user}</span>
      </div>
      <div className="flex items-center space-x-4">
         <span className="text-[10px] font-mono text-slate-500">{step}</span>
         <span className={`text-[10px] font-mono font-bold ${stuck ? 'text-red-400' : 'text-slate-400'}`}>{time}</span>
         {stuck && <AlertTriangleIcon size={12} className="text-red-500 animate-pulse" />}
      </div>
   </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
   <button 
      onClick={onClick}
      className={`pb-4 pt-6 text-sm font-bold uppercase tracking-widest transition-all relative flex items-center ${
         active ? 'text-white' : 'text-slate-500 hover:text-slate-300'
      }`}
   >
      {label}
      {active && (
         <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-in fade-in slide-in-from-bottom-1" />
      )}
   </button>
);

export default LearningPaths;
