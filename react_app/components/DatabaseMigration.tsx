import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import { 
  DatabaseIcon, 
  RefreshCwIcon, 
  ArrowRightIcon, 
  LoaderIcon, 
  CheckCircleIcon,
  AlertCircleIcon,
  TerminalIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from './Icons';

interface DatabaseMigrationProps {
  onComplete: () => void;
  onCancel: () => void;
  currentVersion?: string;
  targetVersion?: string;
}

const DatabaseMigration: React.FC<DatabaseMigrationProps> = ({ 
  onComplete, 
  onCancel, 
  currentVersion = "v12", 
  targetVersion = "v14" 
}) => {
  const [status, setStatus] = useState<'idle' | 'migrating' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString('en-US', { hour12: false })}] ${msg}`]);
  };

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, isLogOpen]);

  const handleMigrate = async () => {
    setStatus('migrating');
    setIsLogOpen(true);
    setLogs([]);
    
    addLog('Starting migration process...');
    
    // Step 1: Backup
    await new Promise(r => setTimeout(r, 800));
    addLog('Creating database backup (mcoda.db.bak)...');
    
    // Step 2: Migrate
    await new Promise(r => setTimeout(r, 1200));
    addLog(`Applying migration 0013_add_agent_metadata (${currentVersion} -> v13)...`);
    
    await new Promise(r => setTimeout(r, 1000));
    addLog(`Applying migration 0014_idx_task_priority (v13 -> ${targetVersion})...`);
    
    // Step 3: Verify
    await new Promise(r => setTimeout(r, 800));
    addLog('Verifying schema integrity...');
    
    // Success
    await new Promise(r => setTimeout(r, 500));
    addLog('Migration completed successfully.');
    setStatus('success');
    
    // Auto-complete
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const handleRestore = () => {
      // Stub for restore logic if we implemented error handling scenario fully
      addLog('Restoring backup...');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center font-sans p-4" role="alertdialog">
      <div className="w-full max-w-[550px] bg-slate-800 border border-indigo-500/30 rounded-xl shadow-[0_0_50px_rgba(79,70,229,0.15)] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header */}
        <div className="p-8 pb-6 text-center flex flex-col items-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 border transition-all duration-500 ${
                status === 'migrating' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                'bg-amber-500/10 text-amber-500 border-amber-500/20'
            }`}>
               {status === 'migrating' ? (
                   <div className="relative">
                       <RefreshCwIcon size={40} className="animate-spin" />
                   </div>
               ) : status === 'success' ? (
                   <CheckCircleIcon size={40} className="animate-in zoom-in" />
               ) : (
                   <DatabaseIcon size={40} />
               )}
            </div>
            
            <h1 className="text-2xl font-bold text-white tracking-tight">
                {status === 'success' ? 'Migration Complete' : 'Project Update Required'}
            </h1>
            
            {status !== 'success' && (
                <p className="text-slate-400 mt-3 text-sm leading-relaxed max-w-sm">
                   This project was created with an older version of Master Coda. We need to update the local database structure.
                </p>
            )}
        </div>

        {/* Version Details */}
        <div className="px-8 pb-6">
           <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 flex items-center justify-center space-x-4">
              <div className="flex flex-col items-center">
                 <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">Current Schema</span>
                 <span className="px-3 py-1 bg-slate-800 rounded text-slate-400 font-mono text-sm border border-slate-700">{currentVersion}</span>
              </div>
              
              <div className="text-slate-600 pt-4">
                 <ArrowRightIcon size={20} />
              </div>

              <div className="flex flex-col items-center">
                 <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">Target Schema</span>
                 <span className="px-3 py-1 bg-indigo-500/10 rounded text-indigo-400 font-mono text-sm border border-indigo-500/20">{targetVersion}</span>
              </div>
           </div>
           
           {status === 'idle' && (
               <div className="mt-4 flex items-center justify-center text-xs text-slate-500">
                  <AlertCircleIcon size={12} className="mr-1.5" />
                  A backup (<code className="text-slate-400 mx-1">mcoda.db.bak</code>) will be created automatically.
               </div>
           )}
        </div>

        {/* Action Buttons */}
        <div className="p-8 pt-0 pb-6 space-y-3">
           {status === 'idle' && (
               <>
                 <Button 
                    variant="primary" 
                    className="w-full h-12 text-base shadow-[0_0_20px_rgba(79,70,229,0.15)]"
                    onClick={handleMigrate}
                 >
                    Migrate Database
                 </Button>
                 <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={onCancel}
                 >
                    Cancel
                 </Button>
               </>
           )}
        </div>

        {/* Collapsible Log Console */}
        {(status !== 'idle') && (
            <div className="border-t border-slate-800 bg-[#0f1117] flex flex-col transition-all duration-300">
                <div 
                    className="flex items-center justify-between px-4 py-2 bg-[#15171e] cursor-pointer hover:bg-slate-800/50 transition-colors"
                    onClick={() => setIsLogOpen(!isLogOpen)}
                >
                    <div className="flex items-center text-xs text-slate-400 font-mono">
                        <TerminalIcon size={12} className="mr-2" />
                        <span>Migration Log</span>
                    </div>
                    <div className="text-slate-500">
                        {isLogOpen ? <ChevronDownIcon size={14} /> : <ChevronRightIcon size={14} />}
                    </div>
                </div>
                
                <div 
                    ref={logContainerRef}
                    className={`overflow-y-auto font-mono text-xs p-4 space-y-1 transition-all duration-300 custom-scrollbar ${isLogOpen ? 'h-32' : 'h-0 py-0'}`}
                >
                    {logs.map((log, i) => (
                        <div key={i} className="text-slate-300 animate-in fade-in slide-in-from-left-2 duration-200">
                            {log}
                        </div>
                    ))}
                    {status === 'migrating' && (
                        <div className="w-2 h-4 bg-indigo-500 animate-pulse mt-1" />
                    )}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default DatabaseMigration;