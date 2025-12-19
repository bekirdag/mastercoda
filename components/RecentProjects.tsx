import React, { useState } from 'react';
import { 
  PlusIcon, 
  FolderIcon, 
  SettingsIcon, 
  HelpCircleIcon, 
  XIcon, 
  ClockIcon, 
  CheckCircleIcon,
  AlertCircleIcon
} from './Icons';
import Badge from './Badge';

interface RecentProjectsProps {
  onOpenProject: () => void;
  onCreateNew: () => void;
}

interface Project {
  id: string;
  name: string;
  path: string;
  lastOpened: string;
  color: string;
}

const RecentProjects: React.FC<RecentProjectsProps> = ({ onOpenProject, onCreateNew }) => {
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: 'master-coda-v1', path: '~/dev/master-coda-v1', lastOpened: '2 hours ago', color: 'indigo' },
    { id: '2', name: 'analytics-service', path: '~/work/analytics-service', lastOpened: '5 hours ago', color: 'emerald' },
    { id: '3', name: 'legacy-api', path: '~/work/legacy-api', lastOpened: '2 days ago', color: 'amber' }
  ]);
  
  const [cliVersionMatch, setCliVersionMatch] = useState(true);

  const removeProject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleOpenMock = () => {
    // Simulate slight delay for file picker
    setTimeout(onOpenProject, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-slate-200 font-sans overflow-auto custom-scrollbar flex flex-col">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 -z-10" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 -z-10 mix-blend-overlay" />

      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 h-[60px] border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 sticky top-0 z-20">
        <div className="flex items-center space-x-3">
           <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
              <span className="text-white font-bold font-mono">M</span>
           </div>
           <span className="font-semibold text-slate-100 tracking-tight">Master Coda</span>
        </div>
        <div className="flex items-center space-x-2">
           <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors" title="Settings">
              <SettingsIcon size={18} />
           </button>
           <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors" title="Help & Documentation">
              <HelpCircleIcon size={18} />
           </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[900px] mx-auto p-8 flex-1 flex flex-col animate-in fade-in duration-500">
        
        {/* CLI Mismatch Banner (Conditional Mock) */}
        {!cliVersionMatch && (
           <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-center justify-between animate-in slide-in-from-top-2">
             <div className="flex items-center text-amber-400 text-sm">
               <AlertCircleIcon size={16} className="mr-2" />
               <span className="font-medium">CLI Version Mismatch. Update recommended.</span>
             </div>
             <button className="text-xs font-bold text-amber-500 hover:text-amber-400 px-3 py-1 bg-amber-500/10 rounded border border-amber-500/20 transition-colors">
                Update Now
             </button>
           </div>
        )}

        {/* Hero Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-light text-white mb-1">Welcome back, <span className="font-medium">Alex</span></h1>
          <p className="text-slate-400 text-lg font-light">What would you like to orchestrate today?</p>
        </div>

        {/* Primary Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
           {/* New Project */}
           <button 
             onClick={onCreateNew}
             className="group relative flex items-center p-6 bg-slate-800/40 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500 rounded-xl transition-all duration-300 text-left hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] overflow-hidden"
           >
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center mr-6 transition-colors duration-300 shrink-0">
                 <PlusIcon size={32} />
              </div>
              <div className="relative z-10">
                 <h2 className="text-lg font-semibold text-slate-100 group-hover:text-white mb-1">New Project</h2>
                 <p className="text-sm text-slate-400 group-hover:text-slate-300">Initialize a new workspace in a folder.</p>
              </div>
           </button>

           {/* Open Existing */}
           <button 
             onClick={handleOpenMock}
             className="group relative flex items-center p-6 bg-slate-800/40 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 rounded-xl transition-all duration-300 text-left hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] overflow-hidden"
           >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center mr-6 transition-colors duration-300 shrink-0">
                 <FolderIcon size={32} />
              </div>
              <div className="relative z-10">
                 <h2 className="text-lg font-semibold text-slate-100 group-hover:text-white mb-1">Open Existing</h2>
                 <p className="text-sm text-slate-400 group-hover:text-slate-300">Select a folder containing .mcoda</p>
              </div>
           </button>
        </div>

        {/* Recent List */}
        <div className="flex-1 min-h-[200px]">
           <div className="flex items-center justify-between mb-4 px-1">
             <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Recent Workspaces</h3>
             <button onClick={() => setProjects([])} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Clear History</button>
           </div>
           
           {projects.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
                <FolderIcon size={32} className="mb-3 opacity-50" />
                <p>No recent projects found</p>
             </div>
           ) : (
             <div className="space-y-3">
               {projects.map((project) => (
                 <div 
                   key={project.id}
                   onClick={handleOpenMock}
                   className="group flex items-center justify-between p-4 bg-slate-800/30 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-lg cursor-pointer transition-all duration-200"
                 >
                    <div className="flex items-center min-w-0">
                       <div className={`w-10 h-10 rounded bg-${project.color}-500/20 text-${project.color}-400 flex items-center justify-center mr-4 border border-${project.color}-500/20 shrink-0`}>
                          <span className="font-bold text-sm">{project.name.substring(0, 2).toUpperCase()}</span>
                       </div>
                       <div className="min-w-0">
                          <h4 className="font-medium text-slate-200 truncate group-hover:text-white transition-colors">{project.name}</h4>
                          <p className="text-xs text-slate-500 truncate font-mono">{project.path}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 shrink-0 pl-4">
                       <div className="flex items-center text-xs text-slate-500">
                          <ClockIcon size={12} className="mr-1.5" />
                          {project.lastOpened}
                       </div>
                       
                       <button 
                         onClick={(e) => removeProject(e, project.id)}
                         className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                         title="Remove from list"
                       >
                          <XIcon size={14} />
                       </button>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>

      </div>

      {/* Footer */}
      <div className="py-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 text-center">
         <div className="flex items-center justify-center space-x-4 text-[10px] text-slate-500 font-mono">
            <span className="cursor-pointer hover:text-slate-300 transition-colors">Master Coda v0.3.5</span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center cursor-pointer hover:text-slate-300 transition-colors group">
               CLI: v0.3.5
               <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)] group-hover:animate-pulse"></span>
            </span>
         </div>
      </div>

    </div>
  );
};

export default RecentProjects;