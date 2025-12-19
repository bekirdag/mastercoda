import React, { useState, useEffect } from 'react';
import Button from './Button';
import { 
  CpuIcon, 
  LoaderIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  RefreshCwIcon,
  ShieldIcon,
  HardDriveIcon,
  ZapIcon,
  GitBranchIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from './Icons';

interface SystemCheckProps {
  onBack: () => void;
  onNext: () => void;
}

interface CheckItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  status: 'pending' | 'running' | 'success' | 'failed';
  message?: string;
  command?: string;
  duration?: number;
}

const SystemCheck: React.FC<SystemCheckProps> = ({ onBack, onNext }) => {
  const [checks, setChecks] = useState<CheckItem[]>([
    { 
      id: 'node', 
      label: 'Node.js Runtime (>= v20)', 
      icon: <HardDriveIcon size={18} />, 
      status: 'pending', 
      command: 'node --version',
      duration: 1200 
    },
    { 
      id: 'git', 
      label: 'Git Installation', 
      icon: <GitBranchIcon size={18} />, 
      status: 'pending',
      command: 'git --version',
      duration: 1500 
    },
    { 
      id: 'permissions', 
      label: 'Write Access (~/.mcoda)', 
      icon: <ShieldIcon size={18} />, 
      status: 'pending',
      command: 'fs.access(HOME_DIR)',
      duration: 800 
    },
    { 
      id: 'binary', 
      label: 'Bundled Binary Health', 
      icon: <ZapIcon size={18} />, 
      status: 'pending',
      command: './mcoda --version',
      duration: 1000 
    },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const allPassed = checks.every(c => c.status === 'success');
  const hasFailure = checks.some(c => c.status === 'failed');

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const runChecks = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);
    addLog('Starting system diagnostics...');

    const newChecks = checks.map(c => ({ ...c, status: 'pending' as const }));
    setChecks(newChecks);

    for (let i = 0; i < newChecks.length; i++) {
      const check = newChecks[i];
      
      // Update status to running
      setChecks(prev => prev.map((c, idx) => idx === i ? { ...c, status: 'running' } : c));
      addLog(`Executing: ${check.command}`);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, check.duration));

      // Simulate logic (force success for demo unless we want to simulate random failure)
      const passed = true; 
      
      setChecks(prev => prev.map((c, idx) => idx === i ? { 
        ...c, 
        status: passed ? 'success' : 'failed',
        message: passed ? 'Verified' : 'Check failed'
      } : c));

      addLog(`${check.label}: ${passed ? 'OK' : 'FAILED'}`);
      
      if (!passed) {
        setIsRunning(false);
        return; // Stop on first failure if we wanted strictly sequential
      }
    }

    addLog('Diagnostics complete. All systems nominal.');
    setIsRunning(false);
  };

  useEffect(() => {
    runChecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-slate-200 flex flex-col items-center justify-center font-sans p-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 -z-10" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 -z-10 mix-blend-overlay" />

      {/* Main Container */}
      <div className="w-full max-w-xl bg-slate-800/50 border border-slate-700 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 text-center border-b border-slate-700/50 bg-slate-800/30">
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
              isRunning ? 'bg-indigo-500/10 text-indigo-400' :
              allPassed ? 'bg-emerald-500/10 text-emerald-400' :
              hasFailure ? 'bg-red-500/10 text-red-400' : 'bg-slate-700/30 text-slate-400'
            }`}>
              {isRunning ? <LoaderIcon size={32} className="animate-spin" /> :
               allPassed ? <CheckCircleIcon size={32} className="animate-in zoom-in duration-300" /> :
               hasFailure ? <XCircleIcon size={32} className="animate-in zoom-in duration-300" /> :
               <CpuIcon size={32} />}
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Checking System Compatibility</h1>
          <p className="text-slate-400 mt-2 text-sm">Verifying Node.js, Git, and filesystem permissions...</p>
        </div>

        {/* Checklist */}
        <div className="p-6 space-y-3">
          {checks.map((check, idx) => (
            <div 
              key={check.id} 
              className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
                check.status === 'running' ? 'bg-slate-700/30 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]' :
                check.status === 'failed' ? 'bg-red-500/5 border-red-500/30 shake' :
                'bg-slate-800/40 border-slate-700'
              }`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-md ${
                  check.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                  check.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  {check.icon}
                </div>
                <div>
                  <h3 className={`text-sm font-medium ${check.status === 'success' ? 'text-slate-200' : 'text-slate-300'}`}>
                    {check.label}
                  </h3>
                  {check.status === 'failed' && (
                    <p className="text-xs text-red-400 mt-0.5">Required for operation. <span className="underline cursor-pointer">Fix this</span></p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                {check.status === 'running' && <LoaderIcon size={18} className="animate-spin text-indigo-400" />}
                {check.status === 'success' && <CheckCircleIcon size={18} className="text-emerald-500 animate-in zoom-in" />}
                {check.status === 'failed' && <XCircleIcon size={18} className="text-red-500 animate-in zoom-in" />}
                {check.status === 'pending' && <div className="w-2 h-2 rounded-full bg-slate-600" />}
              </div>
            </div>
          ))}
        </div>

        {/* Terminal / Logs (Collapsible) */}
        <div className="border-t border-slate-700/50 bg-slate-900/50">
          <button 
            onClick={() => setIsLogOpen(!isLogOpen)}
            className="w-full flex items-center justify-between px-6 py-2 text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-colors"
          >
            <span className="font-mono">Output Log</span>
            {isLogOpen ? <ChevronDownIcon size={14} /> : <ChevronRightIcon size={14} />}
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ${isLogOpen ? 'h-32' : 'h-0'}`}>
            <div className="p-4 font-mono text-[10px] text-slate-400 space-y-1 h-full overflow-auto custom-scrollbar">
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
              {isRunning && <div className="animate-pulse">_</div>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} disabled={isRunning}>
            Back
          </Button>
          
          <div className="flex space-x-3">
             {hasFailure && (
               <Button variant="secondary" onClick={runChecks} icon={<RefreshCwIcon size={16} />}>
                 Retry
               </Button>
             )}
             <Button 
               variant="primary" 
               onClick={onNext} 
               disabled={!allPassed}
               className={allPassed ? "animate-pulse-subtle" : ""}
             >
               Continue
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemCheck;