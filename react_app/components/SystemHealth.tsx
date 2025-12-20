
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { SystemProcess, TelemetryPoint } from '../types';
import { MOCK_SYSTEM_PROCESSES, INITIAL_TELEMETRY } from '../constants';
import Button from './Button';
import Badge from './Badge';
/* Fix: Added missing DatabaseIcon and SparklesIcon imports to resolve errors on lines 182 and 183. */
import { 
  ActivityIcon, 
  RotateCwIcon, 
  ShieldIcon, 
  CpuIcon, 
  HardDriveIcon, 
  TerminalIcon, 
  SearchIcon, 
  PlusIcon, 
  SettingsIcon, 
  ChevronRightIcon, 
  CheckCircleIcon, 
  AlertTriangleIcon, 
  XCircleIcon, 
  RotateCwIcon as RefreshIcon,
  TrashIcon,
  HelpCircleIcon,
  DatabaseIcon,
  SparklesIcon
} from './Icons';

const SystemHealth: React.FC = () => {
  const [processes, setProcesses] = useState<SystemProcess[]>(MOCK_SYSTEM_PROCESSES);
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>(INITIAL_TELEMETRY);
  const [logs, setLogs] = useState<string[]>([
    "[13:22:01] INFO: Agent 'Architect Prime' initialized Tool 'fs_read'.",
    "[13:22:05] WARN: High memory usage detected in TypeScript LSP.",
    "[13:22:10] INFO: Git Sync Worker scanned 1,402 files in 45ms.",
    "[13:23:01] INFO: Heartbeat check: Cloud Gateway is responding (RTT: 42ms)."
  ]);
  const [logFilter, setLogFilter] = useState('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const logEndRef = useRef<HTMLDivElement>(null);

  // Simulation: Telemetry updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => {
        const nextTime = new Date().toLocaleTimeString([], { hour12: false });
        const newPoint = {
          time: nextTime,
          cpu: 20 + Math.random() * 40,
          memory: 40 + Math.random() * 5,
          disk: Math.random() * 10
        };
        return [...prev.slice(1), newPoint];
      });

      // Also update some process metrics randomly
      setProcesses(prev => prev.map(p => {
        if (p.status === 'running') {
            return { ...p, cpu: Math.max(1, p.cpu + (Math.random() * 10 - 5)) };
        }
        return p;
      }));

      // Add random logs
      if (Math.random() > 0.8) {
        const levels = ['INFO', 'WARN', 'DEBUG'];
        const msgs = [
          'Background indexing complete.',
          'Vector database compaction triggered.',
          'Language server cache cleaned.',
          'Heartbeat successful.'
        ];
        const newLog = `[${new Date().toLocaleTimeString([], { hour12: false })}] ${levels[Math.floor(Math.random()*3)]}: ${msgs[Math.floor(Math.random()*msgs.length)]}`;
        setLogs(prev => [...prev, newLog].slice(-100));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (autoScroll && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const handleAction = async (id: string, action: 'restart' | 'stop') => {
     setProcesses(prev => prev.map(p => p.id === id ? { ...p, status: action === 'restart' ? 'restarting' : 'stopped' } : p));
     
     if (action === 'restart') {
         await new Promise(r => setTimeout(r, 2000));
         setProcesses(prev => prev.map(p => p.id === id ? { ...p, status: 'running' } : p));
     }
  };

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsExporting(false);
    alert('Diagnostic Bundle (mcoda-diag-8902.zip) exported successfully.');
  };

  const currentUsage = telemetry[telemetry.length - 1];
  const isMemoryCritical = currentUsage.memory > 90;

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-500 pb-32">
      
      {/* 1. Header & Global Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center">
            <ActivityIcon className="mr-3 text-indigo-400" size={32} />
            System Health & Diagnostics
          </h1>
          <p className="text-slate-400 mt-1">Real-time infrastructure telemetry and backend monitoring</p>
        </div>
        <div className="flex items-center space-x-3">
           <Button variant="secondary" size="sm" icon={<PlusIcon size={14}/>}>Add Endpoint</Button>
           <Button 
             variant="primary" 
             size="sm" 
             icon={isExporting ? <RotateCwIcon size={14} className="animate-spin" /> : <HardDriveIcon size={14}/>}
             onClick={handleExport}
             disabled={isExporting}
           >
             {isExporting ? 'Generating Bundle...' : 'Export Diagnostics'}
           </Button>
        </div>
      </div>

      {/* 2. Resource HUD (Telemetery Charts) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <ResourceChart label="CPU Load" value={`${Math.round(currentUsage.cpu)}%`} data={telemetry} dataKey="cpu" color="#6366f1" icon={<CpuIcon size={16}/>} />
         <ResourceChart label="System RAM" value="4.2GB / 16GB" data={telemetry} dataKey="memory" color="#10b981" icon={<ActivityIcon size={16}/>} isCritical={isMemoryCritical} />
         <ResourceChart label="Disk I/O" value={`${currentUsage.disk.toFixed(1)} MB/s`} data={telemetry} dataKey="disk" color="#f59e0b" icon={<HardDriveIcon size={16}/>} />
      </section>

      {/* Memory Critical Warning Banner */}
      {isMemoryCritical && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center justify-between animate-pulse">
           <div className="flex items-center text-red-400 text-sm font-bold uppercase tracking-widest">
              <AlertTriangleIcon size={18} className="mr-3" />
              System memory low. Performance may be impacted.
           </div>
           <Button variant="primary" size="sm" className="bg-red-600 hover:bg-red-500 border-none">Clean Cache</Button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         
         {/* 3. Service Status Grid (The Engine) */}
         <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-1">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                  <ShieldIcon size={16} className="mr-2 text-indigo-400" />
                  Background Services (Runtime)
               </h3>
               <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-all flex items-center">
                  <RefreshIcon size={12} className="mr-1.5" /> RESTART ALL
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {processes.map(proc => (
                  <div key={proc.id} className={`p-5 rounded-3xl border transition-all duration-300 group ${
                     proc.status === 'error' ? 'bg-red-950/5 border-red-500/20' : 
                     proc.status === 'stopped' ? 'bg-slate-900 border-slate-800 opacity-60' :
                     'bg-slate-800/40 border-slate-700 hover:border-slate-500'
                  }`}>
                     <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                           <div className={`p-2 rounded-xl transition-colors ${
                              proc.status === 'running' ? 'bg-emerald-500/10 text-emerald-400' :
                              proc.status === 'error' ? 'bg-red-500/10 text-red-400' :
                              proc.status === 'restarting' ? 'bg-indigo-500/10 text-indigo-400' :
                              'bg-slate-700 text-slate-500'
                           }`}>
                              {proc.id === 'p1' ? <DatabaseIcon size={20}/> : 
                               proc.id === 'p2' ? <SparklesIcon size={20}/> : 
                               <TerminalIcon size={20}/>}
                           </div>
                           <div>
                              <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{proc.name}</h4>
                              <div className="flex items-center space-x-2">
                                 <div className={`w-1.5 h-1.5 rounded-full ${
                                    proc.status === 'running' ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 
                                    proc.status === 'restarting' ? 'bg-indigo-500 animate-pulse' :
                                    proc.status === 'error' ? 'bg-red-500 animate-pulse' :
                                    'bg-slate-600'
                                 }`} />
                                 <span className={`text-[9px] font-bold uppercase tracking-widest ${
                                    proc.status === 'running' ? 'text-emerald-500' : 
                                    proc.status === 'error' ? 'text-red-400' : 
                                    'text-slate-500'
                                 }`}>{proc.status}</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => handleAction(proc.id, 'restart')} className="p-1.5 text-slate-500 hover:text-white transition-colors" title="Restart Service"><RefreshIcon size={14}/></button>
                           <button onClick={() => handleAction(proc.id, 'stop')} className="p-1.5 text-slate-500 hover:text-red-400 transition-colors" title="Stop Service"><XCircleIcon size={14}/></button>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-3 mb-2">
                        <div className="bg-slate-900 border border-slate-700 rounded-xl p-2 px-3">
                           <div className="text-[8px] font-bold text-slate-500 uppercase">CPU Usage</div>
                           <div className="text-xs font-bold text-white font-mono">{Math.round(proc.cpu)}%</div>
                        </div>
                        <div className="bg-slate-900 border border-slate-700 rounded-xl p-2 px-3">
                           <div className="text-[8px] font-bold text-slate-500 uppercase">Memory</div>
                           <div className="text-xs font-bold text-white font-mono">{proc.memory}</div>
                        </div>
                     </div>

                     <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pt-2 border-t border-slate-700/30">
                        <span>LATENCY: {proc.latency || '--'}</span>
                        <span>UPTIME: {proc.uptime || '--'}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* 4. System Logs & Traces (The Trace) */}
         <aside className="space-y-6">
            <div className="flex items-center justify-between px-1">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                  <TerminalIcon size={16} className="mr-2 text-indigo-400" />
                  System Trace Log
               </h3>
               <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setAutoScroll(!autoScroll)}
                    className={`text-[9px] font-bold uppercase px-2 py-1 rounded border transition-all ${autoScroll ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-600'}`}
                  >Tail</button>
                  <button onClick={() => setLogs([])} className="p-1 text-slate-600 hover:text-red-400 transition-colors"><TrashIcon size={14}/></button>
               </div>
            </div>

            <div className="bg-[#0a0f1e] border border-slate-800 rounded-3xl overflow-hidden h-[540px] flex flex-col shadow-2xl">
               <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between shrink-0">
                  <div className="flex items-center space-x-2">
                     <div className="w-2 h-2 rounded-full bg-red-500/20" />
                     <div className="w-2 h-2 rounded-full bg-amber-500/20" />
                     <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
                  </div>
                  <div className="flex space-x-4 text-[9px] font-bold text-slate-600 uppercase">
                     <button className="hover:text-white transition-colors">Errors</button>
                     <button className="hover:text-white transition-colors">Warnings</button>
                     <button className="text-indigo-400">All</button>
                  </div>
               </div>
               <div className="flex-1 overflow-y-auto custom-scrollbar p-6 font-mono text-[10px] text-slate-500 space-y-1.5 leading-relaxed selection:bg-indigo-500/30">
                  {logs.map((log, i) => (
                     <div key={i} className={`animate-in fade-in slide-in-from-left-2 duration-300 ${
                        log.includes('WARN') ? 'text-amber-400/80 bg-amber-500/5' : 
                        log.includes('ERROR') ? 'text-red-400 bg-red-500/5' : 
                        'text-slate-400'
                     }`}>
                        {log}
                     </div>
                  ))}
                  <div ref={logEndRef} className="h-1 animate-pulse text-indigo-500">_</div>
               </div>
            </div>
         </aside>
      </div>

      {/* Global Status Footer */}
      <footer className="h-12 bg-slate-900 border-t border-slate-800 shrink-0 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] fixed bottom-0 left-0 right-0">
         <div className="flex items-center space-x-12">
            <div className="flex items-center">
               <ActivityIcon size={14} className="mr-2 text-indigo-400" />
               NODE_CLUSTER: <span className="ml-2 text-indigo-300">mcoda-local-8902</span>
            </div>
            <div className="flex items-center">
               <ShieldIcon size={14} className="mr-2 text-indigo-400" />
               ISOLATION: <span className="ml-2 text-emerald-500">KVM_SECURE</span>
            </div>
         </div>
         <div className="flex items-center space-x-6">
            <span className="text-slate-700 font-mono">STAMP: {new Date().toISOString().split('T')[0]}</span>
         </div>
      </footer>
    </div>
  );
};

const ResourceChart: React.FC<{ 
  label: string; 
  value: string; 
  data: TelemetryPoint[]; 
  dataKey: string; 
  color: string; 
  icon: React.ReactNode;
  isCritical?: boolean;
}> = ({ label, value, data, dataKey, color, icon, isCritical }) => (
   <div className={`bg-slate-800 border rounded-3xl p-6 shadow-sm group hover:border-slate-500 transition-all ${isCritical ? 'border-red-500/50' : 'border-slate-700'}`}>
      <div className="flex items-center justify-between mb-4">
         <div className="flex items-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            <span className="mr-2 opacity-70 group-hover:scale-110 transition-transform">{icon}</span>
            {label}
         </div>
         <div className={`text-xl font-bold font-mono tracking-tight transition-colors ${isCritical ? 'text-red-400 animate-pulse' : 'text-white'}`}>{value}</div>
      </div>
      <div className="h-24 w-full">
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
               <defs>
                  <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
                     <stop offset="95%" stopColor={color} stopOpacity={0}/>
                  </linearGradient>
               </defs>
               <Area 
                 type="monotone" 
                 dataKey={dataKey} 
                 stroke={color} 
                 fillOpacity={1} 
                 fill={`url(#color-${dataKey})`} 
                 strokeWidth={2}
                 isAnimationActive={false}
               />
            </AreaChart>
         </ResponsiveContainer>
      </div>
   </div>
);

export default SystemHealth;
