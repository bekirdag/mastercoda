import React, { useState, useEffect } from 'react';
import Button from './Button';
import { 
  LoaderIcon, 
  CheckCircleIcon, 
  AlertCircleIcon, 
  XCircleIcon,
  DatabaseIcon,
  FileTextIcon,
  FolderIcon,
  RefreshCwIcon
} from './Icons';

interface ValidatingWorkspaceProps {
  path: string;
  onComplete: () => void;
  onCancel: () => void;
  onMigrationNeeded: () => void;
}

type CheckStatus = 'pending' | 'active' | 'success' | 'error';
type Step = 'fs' | 'config' | 'db';

const ValidatingWorkspace: React.FC<ValidatingWorkspaceProps> = ({ path, onComplete, onCancel, onMigrationNeeded }) => {
  const [currentStep, setCurrentStep] = useState<Step>('fs');
  const [fsStatus, setFsStatus] = useState<CheckStatus>('active');
  const [configStatus, setConfigStatus] = useState<CheckStatus>('pending');
  const [dbStatus, setDbStatus] = useState<CheckStatus>('pending');
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLongRunning, setIsLongRunning] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const runValidation = async () => {
      // Safety timeout to show cancel button if things get stuck
      timeoutId = setTimeout(() => {
        if (mounted) setIsLongRunning(true);
      }, 5000);

      // --- Step 1: File System ---
      await new Promise(r => setTimeout(r, 1000));
      if (!mounted) return;
      
      // Simulate FS check failure if path contains 'error'
      if (path.includes('error')) {
        setFsStatus('error');
        setErrorMsg('Directory not found or not accessible.');
        clearTimeout(timeoutId);
        return;
      }
      setFsStatus('success');
      setCurrentStep('config');
      setConfigStatus('active');

      // --- Step 2: Config Read ---
      await new Promise(r => setTimeout(r, 1200));
      if (!mounted) return;
      
      setConfigStatus('success');
      setCurrentStep('db');
      setDbStatus('active');

      // --- Step 3: Database Check ---
      await new Promise(r => setTimeout(r, 1500));
      if (!mounted) return;

      // Simulate Locked Database
      if (path.includes('locked')) {
        setDbStatus('error');
        setIsLocked(true);
        setErrorMsg('Database is locked by another process (SQLITE_BUSY).');
        clearTimeout(timeoutId);
        return;
      }

      // Simulate Migration Needed
      if (path.includes('migration')) {
        // Redirect to ON-15 flow
        if (mounted) onMigrationNeeded();
        clearTimeout(timeoutId);
        return;
      }

      setDbStatus('success');

      // Final success delay
      await new Promise(r => setTimeout(r, 500));
      if (mounted) onComplete();
    };

    runValidation();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [path, onComplete, onMigrationNeeded]);

  // Helper to render check items
  const renderCheckItem = (label: string, status: CheckStatus, icon: React.ReactNode) => (
    <div className={`flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0 ${
      status === 'pending' ? 'opacity-50' : 'opacity-100'
    }`}>
      <div className="flex items-center">
         <div className={`p-2 rounded mr-3 transition-colors duration-300 ${
            status === 'active' ? 'bg-indigo-500/10 text-indigo-400' :
            status === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
            status === 'error' ? 'bg-red-500/10 text-red-400' :
            'bg-slate-800 text-slate-500'
         }`}>
            {icon}
         </div>
         <span className={`text-sm font-medium ${
            status === 'active' ? 'text-indigo-200' :
            status === 'success' ? 'text-slate-200' :
            status === 'error' ? 'text-red-300' :
            'text-slate-500'
         }`}>
           {label}
         </span>
      </div>
      <div className="flex items-center">
         {status === 'active' && <LoaderIcon size={16} className="animate-spin text-indigo-400" />}
         {status === 'success' && <CheckCircleIcon size={16} className="text-emerald-500 animate-in zoom-in" />}
         {status === 'error' && <XCircleIcon size={16} className="text-red-500 animate-in zoom-in" />}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center font-sans p-4" role="alert" aria-busy={!errorMsg}>
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 -z-10" />
      
      <div className="w-full max-w-[500px] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Main Content */}
        <div className="p-8 text-center flex flex-col items-center">
           
           {/* Animated Main Icon */}
           <div className="relative mb-6">
              {!errorMsg ? (
                <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                   <div className="absolute inset-0 rounded-full border border-indigo-400/30 animate-[spin_3s_linear_infinite]" />
                   <LoaderIcon size={40} className="text-indigo-400 animate-[spin_10s_linear_infinite]" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                   <AlertCircleIcon size={40} className="text-red-500" />
                </div>
              )}
           </div>

           <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
             {errorMsg ? 'Validation Failed' : 'Opening Workspace...'}
           </h1>
           
           <p className={`text-sm font-medium h-5 transition-all duration-300 ${errorMsg ? 'text-red-400' : 'text-slate-400'}`}>
             {errorMsg || (
                currentStep === 'fs' ? 'Verifying file system access...' :
                currentStep === 'config' ? 'Reading configuration...' :
                'Validating database schema...'
             )}
           </p>

           <div className="mt-4 px-4 py-1.5 bg-slate-950 rounded border border-slate-800 font-mono text-xs text-slate-500 truncate max-w-full">
             {path}
           </div>

        </div>

        {/* Status List */}
        <div className="px-8 pb-6 bg-slate-800/50">
           <div className="bg-slate-900/50 rounded-lg border border-slate-700/50 px-4">
              {renderCheckItem('Project Directory', fsStatus, <FolderIcon size={14} />)}
              {renderCheckItem('Configuration (config.json)', configStatus, <FileTextIcon size={14} />)}
              {renderCheckItem('Database Integrity (mcoda.db)', dbStatus, <DatabaseIcon size={14} />)}
           </div>
        </div>

        {/* Footer Actions */}
        {(errorMsg || isLongRunning) && (
            <div className="p-6 bg-slate-800/80 border-t border-slate-700 flex items-center justify-center space-x-4 animate-in fade-in slide-in-from-bottom-2">
                <Button variant="secondary" onClick={onCancel}>
                   Cancel
                </Button>
                {isLocked && (
                    <Button variant="primary" onClick={() => window.location.reload()} icon={<RefreshCwIcon size={16} />}>
                       Retry
                    </Button>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default ValidatingWorkspace;