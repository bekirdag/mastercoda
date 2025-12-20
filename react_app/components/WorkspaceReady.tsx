import React from 'react';
import Button from './Button';
import { 
  CheckCircleIcon, 
  FolderIcon, 
  ChevronRightIcon, 
  HardDriveIcon, 
  SettingsIcon, 
  GitBranchIcon 
} from './Icons';

interface WorkspaceReadyProps {
  onNext: () => void;
  workspacePath?: string;
}

const WorkspaceReady: React.FC<WorkspaceReadyProps> = ({ onNext, workspacePath }) => {
  const handleOpenFolder = () => {
    // Mock electron shell open
    console.log(`Opening folder: ${workspacePath}`);
    // In a real app: window.electron.shell.openPath(workspacePath);
    alert(`Simulated: Opening ${workspacePath} in file explorer`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-slate-200 flex flex-col items-center justify-center font-sans p-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-900 to-slate-950 -z-10" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 -z-10 mix-blend-overlay" />

      {/* Main Container */}
      <div className="w-full max-w-[600px] bg-slate-800/50 border border-slate-700 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md animate-in slide-in-from-bottom-4 duration-700 flex flex-col">
        
        {/* Header Section */}
        <div className="pt-12 pb-8 px-8 text-center flex flex-col items-center">
            {/* Success Hero Icon */}
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-in zoom-in duration-500 delay-100 relative">
               <div className="absolute inset-0 rounded-full border border-emerald-400/30 animate-ping opacity-20" />
               <CheckCircleIcon size={48} className="drop-shadow-lg" />
            </div>
            
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2 animate-in slide-in-from-bottom-2 fade-in duration-500 delay-200">
                Workspace Ready
            </h1>
            <p className="text-slate-400 text-base animate-in slide-in-from-bottom-2 fade-in duration-500 delay-300">
                Your Master Coda environment is configured and ready for action.
            </p>
        </div>

        {/* Environment Summary Card */}
        <div className="px-8 pb-8 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-500">
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-6 space-y-4">
                <SummaryItem 
                    icon={<HardDriveIcon size={16} />}
                    text={<span>Local Database initialized (<code className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-1 py-0.5 rounded">.mcoda/mcoda.db</code>)</span>}
                    delay="600ms"
                />
                <SummaryItem 
                    icon={<SettingsIcon size={16} />}
                    text={<span>Configuration saved (<code className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-1 py-0.5 rounded">config.json</code>)</span>}
                    delay="700ms"
                />
                <SummaryItem 
                    icon={<GitBranchIcon size={16} />}
                    text="Gitignore updated to exclude local secrets"
                    delay="800ms"
                />
            </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between mt-auto animate-in fade-in duration-1000 delay-700">
          <Button variant="ghost" onClick={handleOpenFolder} icon={<FolderIcon size={18} />}>
            Open Folder
          </Button>
          <Button 
            variant="primary" 
            onClick={onNext}
            className="pl-6 pr-4 shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:shadow-[0_0_25px_rgba(79,70,229,0.4)] transition-shadow"
          >
            <span className="mr-2">Let's Go</span>
            <ChevronRightIcon size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

const SummaryItem: React.FC<{ icon: React.ReactNode; text: React.ReactNode; delay: string }> = ({ icon, text, delay }) => (
    <div className="flex items-start text-slate-300 text-sm animate-in fade-in slide-in-from-left-2 duration-500" style={{ animationDelay: delay }}>
        <div className="mt-0.5 mr-3 text-emerald-500 shrink-0">
            {icon}
        </div>
        <div>{text}</div>
    </div>
);

export default WorkspaceReady;