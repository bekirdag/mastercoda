import React, { useState, useEffect } from 'react';
import Button from './Button';
import Badge from './Badge';
import { 
  SettingsIcon, 
  SparklesIcon, 
  HardDriveIcon, 
  ShieldIcon, 
  AlertTriangleIcon, 
  CheckCircleIcon,
  LoaderIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  CloudIcon,
  SaveIcon
} from './Icons';

type SettingsTab = 'general' | 'brain' | 'filesystem' | 'secrets' | 'danger';

const ProjectSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Mock Data State
  const [general, setGeneral] = useState({
    name: 'Master Coda',
    key: 'MCODA',
    remote: 'git@github.com:master-coda/app.git'
  });

  const [brain, setBrain] = useState({
    techStack: ['React', 'TypeScript', 'Tailwind', 'Node.js'],
    guidelines: "Prefer functional components.\nUse 'const' over 'let'.\nAlways add JSDoc comments for public functions.",
    linter: true,
    docs: [
      { id: '1', url: 'https://ui.shadcn.com' },
      { id: '2', url: 'https://tailwindcss.com/docs' }
    ]
  });

  const [fsConfig, setFsConfig] = useState({
    root: '~/dev/master-coda',
    ignored: ['node_modules', 'dist', '.git', 'vendor']
  });

  const [secrets, setSecrets] = useState([
    { id: 's1', key: 'OPENAI_API_KEY', value: 'sk-proj-....................', visible: false },
    { id: 's2', key: 'DATABASE_URL', value: 'postgres://user:pass@localhost:5432/db', visible: false }
  ]);

  // Auto-Save Simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setLastSaved(new Date());
      }, 800);
    }, 2000);

    return () => clearTimeout(timer);
  }, [general, brain, fsConfig, secrets]);

  const tabs = [
    { id: 'general', label: 'General', icon: <SettingsIcon size={16} /> },
    { id: 'brain', label: 'Brain & Context', icon: <SparklesIcon size={16} /> },
    { id: 'filesystem', label: 'File System', icon: <HardDriveIcon size={16} /> },
    { id: 'secrets', label: 'Secrets', icon: <ShieldIcon size={16} /> },
    { id: 'danger', label: 'Danger Zone', icon: <AlertTriangleIcon size={16} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white border-b border-slate-700 pb-2">Project Identity</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Project Name</label>
                  <input 
                    type="text" 
                    value={general.name}
                    onChange={(e) => setGeneral({...general, name: e.target.value})}
                    className="block w-full px-4 py-2.5 rounded-md bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Project Key</label>
                  <input 
                    type="text" 
                    value={general.key}
                    onChange={(e) => setGeneral({...general, key: e.target.value})}
                    className="block w-full px-4 py-2.5 rounded-md bg-slate-950 border border-slate-700 text-slate-200 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                 <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Git Remote</label>
                 <div className="flex items-center px-4 py-2.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 font-mono text-sm cursor-not-allowed opacity-75">
                    <CloudIcon size={14} className="mr-2" />
                    {general.remote}
                    <span className="ml-auto text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-500">READ ONLY</span>
                 </div>
              </div>
            </div>
          </div>
        );

      case 'brain':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
             
             {/* Tech Stack */}
             <div className="space-y-3">
                <div className="flex justify-between items-end border-b border-slate-700 pb-2">
                   <h3 className="text-lg font-medium text-white">Tech Stack</h3>
                   <span className="text-xs text-slate-500">Helps agent infer boilerplate</span>
                </div>
                <div className="flex flex-wrap gap-2 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                   {brain.techStack.map(tech => (
                      <span key={tech} className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-sm">
                         {tech}
                         <button 
                           onClick={() => setBrain({...brain, techStack: brain.techStack.filter(t => t !== tech)})}
                           className="ml-2 hover:text-white"
                         >
                           <TrashIcon size={12} />
                         </button>
                      </span>
                   ))}
                   <button 
                      onClick={() => {
                        const newTech = prompt("Add tech:");
                        if (newTech) setBrain({...brain, techStack: [...brain.techStack, newTech]});
                      }}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-slate-700 text-slate-400 border border-slate-600 hover:text-white hover:border-slate-500 text-sm transition-colors"
                   >
                      <PlusIcon size={12} className="mr-1" /> Add
                   </button>
                </div>
             </div>

             {/* Guidelines */}
             <div className="space-y-3">
                <h3 className="text-lg font-medium text-white border-b border-slate-700 pb-2">Coding Guidelines</h3>
                <div className="space-y-1.5">
                   <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Custom Instructions</label>
                   <textarea 
                     value={brain.guidelines}
                     onChange={(e) => setBrain({...brain, guidelines: e.target.value})}
                     className="w-full h-32 bg-slate-950 border border-slate-700 rounded-md p-3 text-sm text-slate-300 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                     placeholder="e.g. Prefer functional components..."
                   />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700 mt-4">
                   <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-200">Linter Integration</span>
                      <span className="text-xs text-slate-500">Read .eslintrc for formatting rules automatically</span>
                   </div>
                   <button 
                     onClick={() => setBrain({...brain, linter: !brain.linter})}
                     className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 relative ${brain.linter ? 'bg-indigo-600' : 'bg-slate-700'}`}
                   >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${brain.linter ? 'translate-x-6' : 'translate-x-0'}`} />
                   </button>
                </div>
             </div>

             {/* Docs */}
             <div className="space-y-3">
                <h3 className="text-lg font-medium text-white border-b border-slate-700 pb-2">Documentation Index</h3>
                <div className="space-y-2">
                   {brain.docs.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded">
                         <div className="flex items-center text-sm text-indigo-400">
                            <CloudIcon size={14} className="mr-2" />
                            {doc.url}
                         </div>
                         <button 
                           onClick={() => setBrain({...brain, docs: brain.docs.filter(d => d.id !== doc.id)})}
                           className="text-slate-600 hover:text-red-400 transition-colors"
                         >
                            <TrashIcon size={14} />
                         </button>
                      </div>
                   ))}
                   <Button variant="secondary" size="sm" icon={<PlusIcon size={14} />} className="w-full justify-center border-dashed">
                      Add Documentation URL
                   </Button>
                </div>
             </div>
          </div>
        );

      case 'filesystem':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-slate-700 pb-2">Path Configuration</h3>
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Source Root</label>
                  <div className="flex">
                    <input 
                      type="text" 
                      value={fsConfig.root}
                      readOnly
                      className="block flex-1 px-4 py-2.5 rounded-l-md bg-slate-950 border border-slate-700 text-slate-400 font-mono text-sm cursor-not-allowed"
                    />
                    <button className="px-4 border border-l-0 border-slate-700 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 rounded-r-md text-sm font-medium transition-colors">
                       Move
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                   <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Ignored Paths</label>
                   <p className="text-xs text-slate-400 mb-2">These files are excluded from the agent's context window.</p>
                   <textarea 
                     value={fsConfig.ignored.join('\n')}
                     onChange={(e) => setFsConfig({...fsConfig, ignored: e.target.value.split('\n')})}
                     className="w-full h-40 bg-slate-950 border border-slate-700 rounded-md p-3 text-sm text-slate-300 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                   />
                </div>
             </div>
          </div>
        );

      case 'secrets':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-start space-x-3">
                <ShieldIcon className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <div className="text-sm text-amber-200/80">
                   <strong className="text-amber-400 block mb-1">Local Encryption Active</strong>
                   These values are stored in the local encrypted SQLite database. They are never synced to the cloud or shared with team members via Git.
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                   <h3 className="text-lg font-medium text-white">Environment Secrets</h3>
                   <Button variant="secondary" size="sm" icon={<PlusIcon size={14} />}>Add Secret</Button>
                </div>

                <div className="space-y-2">
                   {secrets.map(secret => (
                      <div key={secret.id} className="bg-slate-800 rounded-lg border border-slate-700 p-4 flex items-center justify-between group">
                         <div className="space-y-1">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{secret.key}</div>
                            <div className="font-mono text-sm text-slate-300 flex items-center">
                               {secret.visible ? secret.value : '•'.repeat(24)}
                               <button 
                                 onClick={() => setSecrets(secrets.map(s => s.id === secret.id ? {...s, visible: !s.visible} : s))}
                                 className="ml-3 text-slate-600 hover:text-indigo-400 transition-colors"
                               >
                                  <EyeIcon size={14} />
                               </button>
                            </div>
                         </div>
                         <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                            <Button variant="secondary" size="sm">Edit</Button>
                            <button className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                               <TrashIcon size={16} />
                            </button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        );

      case 'danger':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="border border-red-500/30 rounded-lg overflow-hidden">
                <div className="bg-red-500/10 p-4 border-b border-red-500/30 flex items-center">
                   <AlertTriangleIcon className="text-red-500 mr-3" size={20} />
                   <h3 className="text-lg font-medium text-red-500">Danger Zone</h3>
                </div>
                <div className="p-6 bg-slate-900/50 space-y-6">
                   
                   <div className="flex items-center justify-between">
                      <div className="pr-8">
                         <h4 className="text-slate-200 font-medium mb-1">Unlink Workspace</h4>
                         <p className="text-sm text-slate-500">Removes this project from your Master Coda dashboard. No files will be deleted.</p>
                      </div>
                      <Button variant="secondary" className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 shrink-0">
                         Unlink Workspace
                      </Button>
                   </div>

                   <div className="h-px bg-slate-800" />

                   <div className="flex items-center justify-between">
                      <div className="pr-8">
                         <h4 className="text-slate-200 font-medium mb-1">Delete Configuration</h4>
                         <p className="text-sm text-slate-500">Permanently deletes the <code className="bg-slate-800 px-1 py-0.5 rounded text-xs">.mcoda</code> directory and all local history/secrets. This action cannot be undone.</p>
                      </div>
                      <Button variant="destructive" className="shrink-0">
                         Delete .mcoda
                      </Button>
                   </div>

                </div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden">
      
      {/* Header */}
      <div className="h-16 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-8 shrink-0 backdrop-blur z-20">
         <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-white tracking-tight">Project Settings</h1>
            <p className="text-xs text-slate-500">Manage configuration for <span className="text-indigo-400 font-mono">{general.key}</span></p>
         </div>
         
         <div className="flex items-center space-x-4">
             {isSaving ? (
                <div className="flex items-center text-xs text-indigo-400 font-medium">
                   <LoaderIcon size={14} className="animate-spin mr-2" />
                   Saving changes...
                </div>
             ) : lastSaved ? (
                <div className="flex items-center text-xs text-emerald-500 font-medium animate-in fade-in">
                   <CheckCircleIcon size={14} className="mr-2" />
                   Saved
                </div>
             ) : null}
         </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 overflow-hidden flex justify-center">
         <div className="w-full max-w-5xl flex h-full">
            
            {/* Sidebar Tabs */}
            <div className="w-64 py-8 px-6 border-r border-slate-800/50 overflow-y-auto custom-scrollbar shrink-0">
               <nav className="space-y-1">
                  {tabs.map(tab => (
                     <button
                       key={tab.id}
                       onClick={() => setActiveTab(tab.id as SettingsTab)}
                       className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                          activeTab === tab.id 
                          ? 'bg-indigo-600/10 text-indigo-300 shadow-[inset_3px_0_0_0_#6366f1]' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                       }`}
                     >
                        <span className={`mr-3 ${activeTab === tab.id ? 'text-indigo-400' : 'text-slate-500'}`}>
                           {tab.icon}
                        </span>
                        {tab.label}
                     </button>
                  ))}
               </nav>
            </div>

            {/* Content Panel */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pb-20">
               <div className="max-w-2xl mx-auto">
                  {renderContent()}
               </div>
            </div>

         </div>
      </div>

    </div>
  );
};

export default ProjectSettings;
