import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import { 
  LoaderIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  TerminalIcon,
  ClipboardIcon
} from './Icons';

interface InitializingWorkspaceProps {
  onNext: () => void;
  onCancel: () => void;
  config: {
    path?: string;
    name?: string;
    key?: string;
    agentId?: string;
    qaProfile?: string;
    gitignore?: boolean;
  };
}

type LogType = 'info' | 'success' | 'warn' | 'error';
interface LogLine {
  id: number;
  time: string;
  msg: string;
  type: LogType;
}

const InitializingWorkspace: React.FC<InitializingWorkspaceProps> = ({ onNext, onCancel, config }) => {
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [status, setStatus] = useState<'running' | 'success' | 'error'>('running');
  const [progress, setProgress] = useState(0);
  const [currentStepLabel, setCurrentStepLabel] = useState('Initializing environment...');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll logic
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const addLog = (msg: string, type: LogType = 'info') => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev, { id: Date.now(), time, msg, type }]);
  };

  useEffect(() => {
    let mounted = true;

    const runInit = async () => {
      // Step 1: Start
      setCurrentStepLabel(`Target: ${config.path}`);
      addLog(`Spawn: mcoda init --workspace-root "${config.path}" --json`);
      setProgress(5);
      await new Promise(r => setTimeout(r, 800));

      // Step 2: Path Validation
      if (!mounted) return;
      setCurrentStepLabel('Validating filesystem permissions...');
      addLog(`Validating write access...`);
      await new Promise(r => setTimeout(r, 600));
      setProgress(15);
      
      // Step 3: Directory Creation
      if (!mounted) return;
      setCurrentStepLabel('Scaffolding directory structure...');
      addLog(`Created .mcoda directory`, 'success');
      addLog(`Created .mcoda/logs directory`, 'success');
      setProgress(30);
      await new Promise(r => setTimeout(r, 700));

      // Step 4: DB Init
      if (!mounted) return;
      setCurrentStepLabel('Initializing SQLite database...');
      addLog(`Initializing SQLite database at .mcoda/mcoda.db...`);
      await new Promise(r => setTimeout(r, 1000));
      addLog(`Applied 14 migrations`, 'success');
      setProgress(50);

      // Step 5: Config Write
      if (!mounted) return;
      setCurrentStepLabel('Writing workspace configuration...');
      addLog(`Writing config.json: Agent=${config.agentId}, QA=${config.qaProfile}`);
      setProgress(70);
      await new Promise(r => setTimeout(r, 600));

      // Step 6: Gitignore
      if (config.gitignore) {
        if (!mounted) return;
        setCurrentStepLabel('Updating .gitignore...');
        addLog(`Git repository detected. Added .mcoda to .gitignore.`);
        await new Promise(r => setTimeout(r, 400));
      }

      // Step 7: Cryptography
      if (!mounted) return;
      setCurrentStepLabel('Generating encryption keys...');
      addLog(`Generating 256-bit workspace encryption keys...`);
      setProgress(90);
      await new Promise(r => setTimeout(r, 800));
      addLog(`Keys stored in secure storage.`);

      // Step 8: Finalize
      if (!mounted) return;
      setCurrentStepLabel('Finalizing setup...');
      addLog(`Workspace initialized successfully.`, 'success');
      setProgress(100);
      setStatus('success');
      
      // Auto-navigate after success
      setTimeout(() => {
        if (mounted) onNext();
      }, 1200);
    };

    runInit();

    return () => { mounted = false; };
  }, [config, onNext]);

  const copyLogs = () => {
    const text = logs.map(l => `[${l.time}] ${l.type.toUpperCase()}: ${l.msg}`).join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-slate-200 flex flex-col items-center justify-center font-sans p-4" aria-live="polite">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 -z-10" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 -z-10 mix-blend-overlay" />

      {/* Main Container */}
      <div className="w-full max-w-[700px] bg-slate-800/50 border border-slate-700 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 text-center border-b border-slate-700/50 bg-slate-800/30">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-500 ${
                status === 'running' ? 'bg-indigo-500/10 text-indigo-400' :
                status === 'success' ? 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' :
                'bg-red-500/10 text-red-400'
            }`}>
                {status === 'running' && <LoaderIcon size={32} className="animate-spin" />}
                {status === 'success' && <CheckCircleIcon size={32} className="animate-in zoom-in" />}
                {status === 'error' && <XCircleIcon size={32} className="animate-in zoom-in" />}
            </div>
            
            <h1 className="text-2xl font-semibold text-white tracking-tight">
                {status === 'running' ? 'Setting up workspace...' :
                 status === 'success' ? 'Initialization Complete' : 
                 'Initialization Failed'}
            </h1>
            <p className="text-slate-400 mt-2 text-sm font-mono h-5">
                {status === 'running' ? currentStepLabel : 
                 status === 'success' ? 'Redirecting to dashboard...' : 
                 'Check logs for details'}
            </p>
        </div>

        {/* Terminal Container */}
        <div className="relative bg-[#0f1117] border-y border-slate-800 h-[400px] flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#15171e] border-b border-slate-800 text-xs">
                 <div className="flex items-center text-slate-500 truncate max-w-[400px]">
                    <TerminalIcon size={12} className="mr-2 shrink-0" />
                    <span className="font-mono truncate" title={`mcoda init --workspace-root "${config.path}" --json`}>
                        mcoda init --workspace-root "{config.path}" --json
                    </span>
                 </div>
                 <div className="flex items-center space-x-3 shrink-0">
                    <label className="flex items-center text-slate-500 hover:text-slate-300 cursor-pointer select-none">
                        <input type="checkbox" checked={autoScroll} onChange={(e) => setAutoScroll(e.target.checked)} className="mr-1.5 accent-indigo-500 rounded-sm w-3 h-3" />
                        Auto-scroll
                    </label>
                    <button onClick={copyLogs} className="text-slate-500 hover:text-white transition-colors" title="Copy Logs">
                        <ClipboardIcon size={14} />
                    </button>
                 </div>
            </div>

            {/* Log Output */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5 custom-scrollbar" 
                role="log"
            >
                {logs.map((log) => (
                    <div key={log.id} className="flex items-start animate-in fade-in slide-in-from-left-2 duration-300">
                        <span className="text-slate-600 mr-3 shrink-0 select-none">[{log.time}]</span>
                        <span className={`break-all ${
                            log.type === 'error' ? 'text-red-400' : 
                            log.type === 'success' ? 'text-emerald-400' : 
                            log.type === 'warn' ? 'text-amber-400' : 
                            'text-slate-300'
                        }`}>
                            {log.type === 'info' && <span className="text-blue-500 font-bold mr-2">INFO:</span>}
                            {log.type === 'success' && <span className="text-emerald-500 font-bold mr-2">OK:</span>}
                            {log.type === 'error' && <span className="text-red-500 font-bold mr-2">ERR:</span>}
                            {log.msg}
                        </span>
                    </div>
                ))}
                {status === 'running' && (
                     <div className="w-2 h-4 bg-indigo-500 animate-pulse mt-2" />
                )}
            </div>
            
            {/* Progress Bar */}
            <div className="h-1 bg-slate-800 w-full relative">
                <div 
                    className={`h-full transition-all duration-500 ease-out ${
                        status === 'error' ? 'bg-red-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between">
            {status === 'success' ? (
                <div className="w-full flex justify-end">
                     <Button variant="primary" onClick={onNext} icon={<CheckCircleIcon size={16}/>}>
                        Enter Workspace
                     </Button>
                </div>
            ) : (
                <>
                    <Button 
                        variant="secondary" 
                        onClick={onCancel}
                        disabled={status !== 'running' && status !== 'error'}
                    >
                        {status === 'error' ? 'Back to Settings' : 'Cancel'}
                    </Button>
                    {status === 'error' && (
                         <Button variant="primary" onClick={() => window.location.reload()}>
                             Retry
                         </Button>
                    )}
                </>
            )}
        </div>

      </div>
    </div>
  );
};

export default InitializingWorkspace;