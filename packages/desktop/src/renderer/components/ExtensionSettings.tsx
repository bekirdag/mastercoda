import React, { useState, useEffect, useRef } from 'react';
import { Extension } from '../types';
import { MOCK_EXTENSIONS } from '../constants';
import Button from './Button';
import { 
  ArrowRightIcon, 
  SettingsIcon, 
  RotateCwIcon, 
  TrashIcon, 
  ExternalLinkIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  LoaderIcon,
  FileTextIcon,
  CodeIcon,
  ChevronDownIcon,
  HelpCircleIcon
} from './Icons';

interface ExtensionSettingsProps {
  extensionId: string;
  onBack: () => void;
}

const ExtensionSettings: React.FC<ExtensionSettingsProps> = ({ extensionId, onBack }) => {
  const [extension, setExtension] = useState<Extension | null>(null);
  const [config, setConfig] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [viewRaw, setViewRaw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const found = MOCK_EXTENSIONS.find(e => e.id === extensionId);
    if (found) {
      setExtension(found);
      // Initialize config with defaults from schema
      const initialConfig: Record<string, any> = {};
      found.configSchema?.forEach(cfg => {
        initialConfig[cfg.key] = cfg.default;
      });
      setConfig(initialConfig);
    }
  }, [extensionId]);

  const handleValueChange = (key: string, value: any) => {
    const nextConfig = { ...config, [key]: value };
    setConfig(nextConfig);
    
    // Auto-save logic
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setIsSaving(true);
    
    saveTimeoutRef.current = setTimeout(() => {
      // Simulate save to disk
      console.log(`Saving config for ${extensionId}:`, nextConfig);
      setIsSaving(false);
      setLastSaved(new Date());
    }, 800);
  };

  const handleReset = () => {
    if (!extension) return;
    const resetConfig: Record<string, any> = {};
    extension.configSchema?.forEach(cfg => {
      resetConfig[cfg.key] = cfg.default;
    });
    setConfig(resetConfig);
    setLastSaved(new Date());
  };

  if (!extension) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <p>Extension not found.</p>
        <Button variant="secondary" className="mt-4" onClick={onBack}>Back to Extensions</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Header (EX-03.4) */}
      <header className="h-[60px] border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0 z-20">
         <div className="flex items-center space-x-4">
            <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors p-1">
               <ArrowRightIcon className="rotate-180" size={18} />
            </button>
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-lg">
               {typeof extension.icon === 'string' ? extension.icon : extension.icon}
            </div>
            <div>
               <h1 className="text-sm font-bold text-white uppercase tracking-wider">{extension.title} Settings</h1>
               <div className="flex items-center text-[10px] text-slate-500 font-mono">
                  {isSaving ? (
                     <span className="text-indigo-400 flex items-center">
                        <LoaderIcon size={10} className="animate-spin mr-1" /> SAVING...
                     </span>
                  ) : lastSaved ? (
                     <span className="text-emerald-500 flex items-center">
                        <CheckCircleIcon size={10} className="mr-1" /> SAVED {lastSaved.toLocaleTimeString([], { hour12: false })}
                     </span>
                  ) : (
                     <span className="opacity-50">CONFIGURATION LOADED</span>
                  )}
               </div>
            </div>
         </div>

         <div className="flex items-center space-x-3">
            <button 
              onClick={() => setViewRaw(!viewRaw)}
              className={`p-1.5 rounded border transition-colors ${viewRaw ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
              title="Toggle Raw JSON View"
            >
               <CodeIcon size={16} />
            </button>
            <div className="h-4 w-px bg-slate-700 mx-2" />
            <Button variant="secondary" size="sm" onClick={handleReset} icon={<RotateCwIcon size={14} />}>
               Reset Defaults
            </Button>
            <button className="p-1.5 text-slate-500 hover:text-white rounded hover:bg-slate-800 transition-colors">
               <ExternalLinkIcon size={18} />
            </button>
         </div>
      </header>

      {/* 2. Scrollable Form Area (EX-03.4) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
         <div className="max-w-[800px] mx-auto animate-in fade-in duration-500 pb-20">
            
            {viewRaw ? (
               <div className="space-y-4">
                  <div className="flex items-start p-4 bg-amber-900/10 border border-amber-500/20 rounded-xl text-amber-200/80 text-xs mb-6">
                     <AlertTriangleIcon className="text-amber-500 shrink-0 mt-0.5 mr-3" size={16} />
                     <p>You are viewing the raw configuration object. Manual edits here bypass schema validation. Use with caution.</p>
                  </div>
                  <div className="relative group">
                     <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                     <textarea 
                        className="relative w-full h-[500px] bg-slate-950 border border-slate-700 rounded-xl p-6 font-mono text-sm leading-relaxed text-indigo-300 focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
                        value={JSON.stringify(config, null, 2)}
                        onChange={(e) => {
                           try {
                              const parsed = JSON.parse(e.target.value);
                              handleValueChange('', parsed); // Simplified for raw
                           } catch(err) {}
                        }}
                     />
                  </div>
               </div>
            ) : (
               <div className="space-y-10">
                  {/* Dynamic Rendering based on schema */}
                  <section className="space-y-8">
                     <div className="border-b border-slate-800 pb-4">
                        <h2 className="text-xl font-bold text-white">General Rules</h2>
                        <p className="text-sm text-slate-500 mt-1">Behavioral preferences and environment paths for {extension.title}.</p>
                     </div>

                     <div className="space-y-6">
                        {extension.configSchema?.map((field) => (
                           <div key={field.key} className="group grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                              <div className="md:col-span-1">
                                 <label className="text-sm font-bold text-slate-300 group-focus-within:text-indigo-400 transition-colors">
                                    {field.key}
                                 </label>
                                 <div className="mt-1 flex items-center text-[11px] text-slate-500 leading-relaxed">
                                    {field.description}
                                    <button className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-indigo-400">
                                       <HelpCircleIcon size={12} />
                                    </button>
                                 </div>
                              </div>

                              <div className="md:col-span-2">
                                 <ConfigInput 
                                    field={field} 
                                    value={config[field.key]} 
                                    onChange={(val) => handleValueChange(field.key, val)} 
                                 />
                                 {errors[field.key] && (
                                    <p className="mt-2 text-xs text-red-400 flex items-center animate-in slide-in-from-top-1">
                                       <AlertTriangleIcon size={12} className="mr-1.5" />
                                       {errors[field.key]}
                                    </p>
                                 )}
                              </div>
                           </div>
                        ))}
                        
                        {(!extension.configSchema || extension.configSchema.length === 0) && (
                           <div className="py-20 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl">
                              <SettingsIcon size={48} className="mb-4 opacity-10" />
                              <p>This extension has no configurable properties.</p>
                           </div>
                        )}
                     </div>
                  </section>

                  {/* Built-in Extra Settings Example */}
                  <section className="pt-6 border-t border-slate-800 space-y-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Advanced Features</h3>
                           <p className="text-xs text-slate-500 mt-0.5">Toggle beta capabilities and debug logging.</p>
                        </div>
                     </div>
                     
                     <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 space-y-6">
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-sm font-bold text-slate-200">Debug Logging</p>
                              <p className="text-xs text-slate-500">Output detailed execution logs to the mcoda terminal.</p>
                           </div>
                           <button className="w-10 h-5 rounded-full bg-slate-700 p-1 relative transition-colors duration-300">
                              <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                           </button>
                        </div>
                     </div>
                  </section>

                  {/* Danger Zone */}
                  <section className="pt-10 border-t border-slate-800 space-y-4">
                     <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest">Danger Zone</h3>
                     <div className="bg-red-950/5 border border-red-500/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                           <p className="text-sm font-bold text-slate-200">Remove Extension</p>
                           <p className="text-xs text-slate-500">Uninstall this tool and purge its local data cache.</p>
                        </div>
                        <Button variant="destructive" size="sm" icon={<TrashIcon size={14} />}>Uninstall Extension</Button>
                     </div>
                  </section>
               </div>
            )}
         </div>
      </div>

    </div>
  );
};

// Internal input renderer helper
const ConfigInput: React.FC<{ field: any; value: any; onChange: (val: any) => void }> = ({ field, value, onChange }) => {
   if (field.type === 'boolean') {
      return (
         <button 
            onClick={() => onChange(!value)}
            className={`w-12 h-6 rounded-full p-1 transition-all duration-300 relative ${value ? 'bg-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.4)]' : 'bg-slate-700'}`}
         >
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${value ? 'translate-x-6' : 'translate-x-0'}`} />
         </button>
      );
   }

   if (field.type === 'string') {
      const isPath = field.key.toLowerCase().includes('path');
      return (
         <div className="flex">
            <input 
               type="text" 
               value={value || ''}
               onChange={(e) => onChange(e.target.value)}
               className="block flex-1 px-4 py-2.5 rounded-md bg-slate-950 border border-slate-700 text-slate-200 text-sm font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-700"
               placeholder={`Enter ${field.key}...`}
            />
            {isPath && (
               <button className="ml-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-[10px] font-bold text-slate-400 hover:text-white hover:border-slate-500 transition-colors uppercase tracking-widest">
                  Browse
               </button>
            )}
         </div>
      );
   }

   if (field.type === 'enum' || (field.type === 'string' && field.enum)) {
      return (
         <div className="relative">
            <select 
               value={value}
               onChange={(e) => onChange(e.target.value)}
               className="block w-full px-4 py-2.5 rounded-md bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
            >
               {field.enum.map((opt: string) => (
                  <option key={opt} value={opt}>{opt}</option>
               ))}
            </select>
            <ChevronDownIcon size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
         </div>
      );
   }

   return (
      <input 
         type="text" 
         value={JSON.stringify(value)}
         onChange={(e) => {
            try { onChange(JSON.parse(e.target.value)); } catch(err) {}
         }}
         className="block w-full px-4 py-2.5 rounded-md bg-slate-950 border border-slate-700 text-slate-200 text-sm font-mono focus:outline-none focus:border-indigo-500"
      />
   );
};

export default ExtensionSettings;