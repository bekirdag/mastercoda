import React, { useState } from 'react';
import Button from './Button';
import { 
  AlertTriangleIcon, 
  RefreshCwIcon, 
  PackageIcon, 
  CheckCircleIcon,
  XCircleIcon,
  LoaderIcon
} from './Icons';

interface UpdateRequiredProps {
  onFixed: () => void;
  detectedVersion?: string;
  requiredVersion?: string;
  cliPath?: string;
}

const UpdateRequired: React.FC<UpdateRequiredProps> = ({ 
  onFixed, 
  detectedVersion = "v0.2.1", 
  requiredVersion = "^0.3.0",
  cliPath = "/usr/local/bin/mcoda"
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const handleUpdate = async () => {
    setIsUpdating(true);
    setUpdateStatus('idle');
    // Simulate update latency
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Success flow
    setIsUpdating(false);
    setUpdateStatus('success');
    
    // Auto-proceed after brief delay
    setTimeout(() => {
        onFixed();
    }, 1200);
  };

  const handleSwitch = async () => {
      // Simulate switching settings latency
      await new Promise(resolve => setTimeout(resolve, 800));
      onFixed();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center font-sans p-4" role="alertdialog" aria-modal="true">
       {/* Blocking Modal */}
       <div className="w-full max-w-[550px] bg-slate-800 border border-red-500/30 rounded-xl shadow-[0_0_50px_rgba(239,68,68,0.15)] overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-8 pb-0 text-center flex flex-col items-center">
             <div className="w-20 h-20 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse-subtle">
                <AlertTriangleIcon size={40} />
             </div>
             <h1 className="text-2xl font-bold text-white tracking-tight">Incompatible Engine Version</h1>
             <p className="text-slate-400 mt-3 text-sm leading-relaxed max-w-sm">
                The <code className="font-mono text-indigo-300 bg-indigo-500/10 px-1 py-0.5 rounded text-xs">mcoda</code> command-line tool configured for this app is too old to support the current features.
             </p>
          </div>

          {/* Version Comparison Table */}
          <div className="px-8 py-8">
             <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between">
                <div className="flex flex-col">
                   <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Detected</span>
                   <span className="font-mono text-lg text-red-400 font-semibold">{detectedVersion}</span>
                </div>
                
                <div className="h-8 w-px bg-slate-700" />
                
                <div className="flex flex-col items-end">
                   <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Required</span>
                   <span className="font-mono text-lg text-emerald-400 font-semibold">{requiredVersion}</span>
                </div>
             </div>
             <div className="mt-2 text-center">
                <p className="text-[10px] font-mono text-slate-600 truncate max-w-full overflow-hidden text-ellipsis px-4" title={cliPath}>{cliPath}</p>
             </div>
          </div>

          {/* Action Buttons */}
          <div className="p-8 pt-0 space-y-3">
             {updateStatus === 'error' && (
                 <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs flex items-center mb-4 animate-in fade-in">
                    <XCircleIcon size={16} className="mr-2" />
                    Update failed. Please run `sudo npm install -g mcoda`
                 </div>
             )}

             <Button 
                variant="primary" 
                className="w-full h-14 text-base justify-between group"
                onClick={handleUpdate}
                disabled={isUpdating || updateStatus === 'success'}
             >
                <div className="flex items-center">
                    {isUpdating ? <LoaderIcon className="animate-spin mr-3" /> : <RefreshCwIcon className="mr-3" />}
                    <div className="flex flex-col items-start text-left">
                        <span className="leading-none font-semibold">{isUpdating ? 'Updating CLI...' : updateStatus === 'success' ? 'Update Complete' : 'Update Global Version'}</span>
                        {!isUpdating && updateStatus !== 'success' && <span className="text-[10px] opacity-70 font-normal mt-1 text-indigo-200">Runs npm install -g mcoda@latest</span>}
                    </div>
                </div>
                {updateStatus === 'success' && <CheckCircleIcon className="animate-in zoom-in" />}
             </Button>

             <Button 
                variant="secondary" 
                className="w-full h-14 text-base justify-start"
                onClick={handleSwitch}
                disabled={isUpdating}
             >
                <PackageIcon className="mr-3 text-slate-400" />
                <div className="flex flex-col items-start text-left">
                    <span className="leading-none text-slate-200 font-medium">Switch to Bundled Binary</span>
                    <span className="text-[10px] text-slate-500 font-normal mt-1">Use internal version (v0.3.5)</span>
                </div>
             </Button>
          </div>

       </div>
    </div>
  );
};

export default UpdateRequired;