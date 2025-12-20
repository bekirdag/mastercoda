
import React from 'react';
import Button from './Button';
import { 
  AlertTriangleIcon, 
  FolderIcon, 
  XCircleIcon, 
  FileTextIcon, 
  RefreshCwIcon,
  SearchIcon,
  PlusIcon,
  ArrowRightIcon
} from './Icons';

export type WorkspaceErrorType = 'missing_dir' | 'not_workspace' | 'corrupt_config' | 'permission';

interface InvalidWorkspaceProps {
  errorType: WorkspaceErrorType;
  path: string;
  onBack: () => void;
  onRemoveFromRecent: () => void;
  onInitialize: () => void;
  onRetry: () => void;
  onBrowse: () => void;
  onOpenConfig: () => void;
}

const InvalidWorkspace: React.FC<InvalidWorkspaceProps> = ({ 
  errorType, 
  path, 
  onBack, 
  onRemoveFromRecent, 
  onInitialize,
  onRetry,
  onBrowse,
  onOpenConfig
}) => {
  
  const renderContent = () => {
    switch (errorType) {
      case 'missing_dir':
        return {
          title: 'Directory Not Found',
          subtitle: 'The folder linked to this workspace no longer exists at this path.',
          primaryAction: { label: 'Remove from Recent', onClick: onRemoveFromRecent, icon: <XCircleIcon size={16} /> },
          secondaryAction: { label: 'Select Different Folder', onClick: onBrowse, icon: <SearchIcon size={16} /> }
        };
      case 'not_workspace':
        return {
          title: 'Not a Master Coda Project',
          subtitle: 'We couldn\'t find a .mcoda directory in this folder.',
          primaryAction: { label: 'Initialize Project Here', onClick: onInitialize, icon: <PlusIcon size={16} /> },
          secondaryAction: { label: 'Select Different Folder', onClick: onBrowse, icon: <SearchIcon size={16} /> }
        };
      case 'corrupt_config':
        return {
          title: 'Configuration Corrupt',
          subtitle: 'The config.json file is malformed and cannot be read.',
          primaryAction: { label: 'Open Config File', onClick: onOpenConfig, icon: <FileTextIcon size={16} /> },
          secondaryAction: { label: 'Go Back', onClick: onBack, icon: <ArrowRightIcon size={16} className="rotate-180" /> }
        };
      case 'permission':
        return {
          title: 'Permission Denied',
          subtitle: 'Master Coda does not have read/write access to this directory.',
          primaryAction: { label: 'Retry', onClick: onRetry, icon: <RefreshCwIcon size={16} /> },
          secondaryAction: { label: 'Go Back', onClick: onBack, icon: <ArrowRightIcon size={16} className="rotate-180" /> }
        };
      default:
        return {
          title: 'Unknown Error',
          subtitle: 'An unexpected error occurred while validating the workspace.',
          primaryAction: { label: 'Go Back', onClick: onBack, icon: <ArrowRightIcon size={16} className="rotate-180" /> },
          secondaryAction: null
        };
    }
  };

  const content = renderContent();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center font-sans p-4" role="alertdialog">
      <div className="w-full max-w-[500px] bg-slate-800 border border-slate-700 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header */}
        <div className="p-8 pb-6 text-center flex flex-col items-center relative overflow-hidden">
             {/* Background Glow */}
             <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none ${
                errorType === 'permission' ? 'bg-red-500' : 'bg-amber-500'
             }`} />

            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 border relative z-10 transition-all duration-500 ${
                errorType === 'permission' || errorType === 'missing_dir'
                    ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
            }`}>
               {errorType === 'missing_dir' ? <XCircleIcon size={40} className="animate-[shake_0.5s_ease-in-out]" /> :
                errorType === 'not_workspace' ? <FolderIcon size={40} /> :
                <AlertTriangleIcon size={40} />
               }
               {/* Badge overlay for "Not Workspace" */}
               {errorType === 'not_workspace' && (
                 <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-1 border border-amber-500/30">
                    <XCircleIcon size={16} className="text-amber-500" />
                 </div>
               )}
            </div>
            
            <h1 className="text-2xl font-bold text-white tracking-tight relative z-10">
                {content.title}
            </h1>
            
            <p className="text-slate-400 mt-3 text-sm leading-relaxed max-w-sm relative z-10">
               {content.subtitle}
            </p>
        </div>

        {/* Error Details Box */}
        <div className="px-8 pb-6">
           <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-3 flex flex-col space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Path</span>
              <div className="font-mono text-xs text-slate-300 break-all bg-slate-900/50 p-2 rounded border border-slate-800/50">
                {path}
              </div>
              {errorType === 'missing_dir' && (
                  <div className="pt-2 flex items-center text-red-400 text-xs font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                      ENOENT: no such file or directory
                  </div>
              )}
           </div>
        </div>

        {/* Action Buttons */}
        <div className="p-8 pt-0 pb-6 space-y-3">
             <Button 
                variant="primary" 
                className={`w-full h-12 text-base justify-between group ${
                    errorType === 'permission' || errorType === 'missing_dir' ? 'bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 hover:border-red-500/50' : ''
                }`}
                onClick={content.primaryAction.onClick}
             >
                <div className="flex items-center">
                    <span className="mr-3 opacity-80">{content.primaryAction.icon}</span>
                    <span>{content.primaryAction.label}</span>
                </div>
             </Button>

             {content.secondaryAction && (
                <Button 
                    variant="secondary" 
                    className="w-full h-12 text-base justify-start text-slate-400 hover:text-white"
                    onClick={content.secondaryAction.onClick}
                >
                    <span className="mr-3 opacity-80">{content.secondaryAction.icon}</span>
                    <span>{content.secondaryAction.label}</span>
                </Button>
             )}
        </div>

      </div>
    </div>
  );
};

export default InvalidWorkspace;
