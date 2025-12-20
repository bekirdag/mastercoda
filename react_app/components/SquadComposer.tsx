
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Squad, SquadNode, SquadEdge, CollaborationProtocol, AgentPersona } from '../types';
import { MOCK_SQUADS, MOCK_AGENTS } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  SparklesIcon, 
  ActivityIcon, 
  ChevronDownIcon, 
  PlusIcon, 
  SettingsIcon, 
  ShieldIcon, 
  ZapIcon, 
  TerminalIcon, 
  HardDriveIcon, 
  CrownIcon,
  XIcon,
  CheckCircleIcon,
  SearchIcon,
  TrashIcon,
  RotateCwIcon,
  PlayIcon,
  ChevronRightIcon,
  MoreVerticalIcon,
  LockIcon,
  RefreshCwIcon,
  ArrowRightIcon,
  CodeIcon
} from './Icons';

const SquadComposer: React.FC = () => {
  const [squads, setSquads] = useState<Squad[]>(MOCK_SQUADS);
  const [activeSquadId, setActiveSquadId] = useState<string>(MOCK_SQUADS[0].id);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationPath, setSimulationPath] = useState<string[]>([]);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const activeSquad = useMemo(() => squads.find(s => s.id === activeSquadId)!, [squads, activeSquadId]);
  const selectedNode = activeSquad.nodes.find(n => n.id === selectedNodeId);

  const handleSimulate = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationPath([]);
    
    // Naive path simulation based on protocol
    const manager = activeSquad.nodes.find(n => n.role === 'manager');
    const workers = activeSquad.nodes.filter(n => n.role === 'worker');

    if (manager) {
        setSimulationPath([manager.id]);
        await new Promise(r => setTimeout(r, 1000));
        
        if (activeSquad.protocol === 'sequential') {
            for (const worker of workers) {
                setSimulationPath(prev => [...prev, worker.id]);
                await new Promise(r => setTimeout(r, 1000));
            }
        } else if (activeSquad.protocol === 'hierarchical') {
            for (const worker of workers) {
                setSimulationPath(prev => [...prev, worker.id]);
                await new Promise(r => setTimeout(r, 600));
                setSimulationPath(prev => [...prev, manager.id]); // Reporting back
                await new Promise(r => setTimeout(r, 600));
            }
        } else {
            // Consensus
            setSimulationPath(activeSquad.nodes.map(n => n.id));
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    setIsSimulating(false);
    setTimeout(() => setSimulationPath([]), 2000);
  };

  const handleNodeClick = (id: string) => {
    setSelectedNodeId(id);
  };

  const updateSquad = (updated: Squad) => {
    setSquads(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const handleProtocolChange = (p: CollaborationProtocol) => {
    updateSquad({ ...activeSquad, protocol: p });
  };

  return (
    <div className="flex h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Squad Registry Sidebar */}
      <aside className="w-[300px] border-r border-slate-800 bg-slate-900/50 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Team Registry</h2>
          <button className="p-1.5 hover:bg-slate-800 rounded text-indigo-400 transition-colors">
            <PlusIcon size={16} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
           {squads.map(s => (
             <button
               key={s.id}
               onClick={() => setActiveSquadId(s.id)}
               className={`w-full flex flex-col p-4 rounded-xl border transition-all text-left group ${
                 activeSquadId === s.id 
                   ? 'bg-indigo-600/10 border-indigo-500/30' 
                   : 'bg-transparent border-transparent hover:bg-slate-800/50'
               }`}
             >
                <div className="flex items-center justify-between w-full mb-1">
                   <span className={`text-sm font-bold ${activeSquadId === s.id ? 'text-white' : 'text-slate-300'}`}>
                      {s.name}
                   </span>
                   <Badge variant="neutral">{s.nodes.length} Agents</Badge>
                </div>
                <p className="text-[10px] text-slate-500 uppercase tracking-tighter font-mono">{s.protocol}</p>
             </button>
           ))}
           
           <div className="pt-6 px-2 space-y-3">
              <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Templates</h3>
              <TemplateItem label="LangGraph Cycle" />
              <TemplateItem label="CrewAI Hierarchical" />
              <TemplateItem label="AutoGen Conversation" />
           </div>
        </div>
      </aside>

      {/* 2. Composer Canvas */}
      <main className="flex-1 flex flex-col bg-[#0d1117] relative overflow-hidden select-none">
         {/* Canvas Grid Background */}
         <div className="absolute inset-0 pointer-events-none opacity-20" style={{
            backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            transform: `translate(${transform.x % 40}px, ${transform.y % 40}px)`
         }} />

         {/* Canvas Toolbar */}
         <div className="absolute top-6 left-6 z-20 flex items-center space-x-3">
            <div className="flex bg-slate-800 border border-slate-700 rounded-xl p-1 shadow-2xl backdrop-blur">
               <button className="p-2 text-slate-400 hover:text-white transition-colors" title="Zoom In">+</button>
               <button className="p-2 text-slate-400 hover:text-white transition-colors" title="Zoom Out">-</button>
            </div>
            <button 
               onClick={handleSimulate}
               disabled={isSimulating}
               className={`flex items-center px-4 py-2 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all ${
                  isSimulating 
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 animate-pulse' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white shadow-xl'
               }`}
            >
               {isSimulating ? <RotateCwIcon size={14} className="animate-spin mr-2" /> : <PlayIcon size={14} fill="currentColor" className="mr-2" />}
               {isSimulating ? 'Simulating Message Flow...' : 'Simulate Task'}
            </button>
         </div>

         {/* Node Graph Layer */}
         <div 
            ref={canvasRef}
            className="absolute inset-0 transition-transform duration-75 ease-out"
            style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transformOrigin: '0 0' }}
         >
            <svg className="absolute inset-0 w-[5000px] h-[5000px] pointer-events-none overflow-visible">
               <defs>
                 <marker id="delegation-arrow" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                   <path d="M0,0 L8,4 L0,8 Z" fill="#6366f1" />
                 </marker>
                 <marker id="delegation-arrow-active" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                   <path d="M0,0 L8,4 L0,8 Z" fill="#10b981" />
                 </marker>
               </defs>
               {activeSquad.edges.map(edge => {
                  const source = activeSquad.nodes.find(n => n.id === edge.source)!;
                  const target = activeSquad.nodes.find(n => n.id === edge.target)!;
                  const isActive = simulationPath.includes(edge.source) && simulationPath.includes(edge.target);

                  const x1 = source.x + 100;
                  const y1 = source.y + 40;
                  const x2 = target.x + 100;
                  const y2 = target.y + 40;
                  const dx = Math.abs(x2 - x1) * 0.5;

                  return (
                     <g key={edge.id}>
                        <path 
                           d={`M ${x1} ${y1} C ${x1} ${y1 + 50}, ${x2} ${y2 - 50}, ${x2} ${y2}`}
                           fill="none"
                           stroke={isActive ? '#10b981' : edge.type === 'delegates' ? '#6366f1' : '#334155'}
                           strokeWidth={isActive ? 4 : 2}
                           strokeDasharray={edge.type === 'peers' ? '5,5' : '0'}
                           markerEnd={isActive ? "url(#delegation-arrow-active)" : "url(#delegation-arrow)"}
                           className={isActive ? 'animate-pulse' : ''}
                        />
                     </g>
                  );
               })}
            </svg>

            {activeSquad.nodes.map(node => {
               const agent = MOCK_AGENTS.find(a => a.id === node.agentId)!;
               const isActive = simulationPath.includes(node.id);
               return (
                  <div 
                     key={node.id}
                     onClick={() => handleNodeClick(node.id)}
                     className={`absolute w-[200px] bg-slate-900 border-2 rounded-2xl transition-all duration-300 shadow-2xl cursor-pointer overflow-hidden ${
                        selectedNodeId === node.id 
                           ? 'border-indigo-500 ring-4 ring-indigo-500/20 scale-105 z-40' 
                           : 'border-slate-800 hover:border-slate-700 z-10'
                     } ${isActive ? 'shadow-[0_0_30px_rgba(16,185,129,0.3)] border-emerald-500' : ''}`}
                     style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
                  >
                     <div className="p-4 flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                            isActive ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}>
                            {node.role === 'manager' ? <CrownIcon size={20} /> : <ZapIcon size={20} />}
                        </div>
                        <div className="min-w-0">
                           <div className="text-xs font-bold text-white truncate uppercase tracking-widest">{agent.name}</div>
                           <div className="text-[9px] font-mono text-slate-500 uppercase">{node.role}</div>
                        </div>
                     </div>
                     <div className="px-4 pb-4">
                        <div className="flex items-center space-x-1">
                           {agent.capabilities.slice(0, 3).map(c => (
                              <div key={c.id} className="w-1.5 h-1.5 rounded-full bg-slate-700" title={c.label} />
                           ))}
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>
      </main>

      {/* 3. Protocol Config Sidebar */}
      <aside className="w-[350px] border-l border-slate-800 bg-slate-900 flex flex-col shrink-0 z-20">
         <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 bg-slate-900/50 backdrop-blur">
            <h3 className="font-bold text-white text-sm uppercase tracking-widest">Protocol Config</h3>
            <button className="p-2 text-slate-500 hover:text-white transition-colors">
               <SettingsIcon size={20} />
            </button>
         </header>

         <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">
            {/* Squad Global Config */}
            <section className="space-y-6">
               <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Collaboration Strategy</label>
                  <div className="grid grid-cols-1 gap-2">
                     <ProtocolButton 
                        active={activeSquad.protocol === 'hierarchical'} 
                        onClick={() => handleProtocolChange('hierarchical')}
                        label="Hierarchical" 
                        desc="Manager delegates tasks & reviews workers." 
                        icon={<CrownIcon size={14}/>}
                     />
                     <ProtocolButton 
                        active={activeSquad.protocol === 'sequential'} 
                        onClick={() => handleProtocolChange('sequential')}
                        label="Sequential" 
                        desc="Step-by-step pipeline (A -> B -> C)." 
                        icon={<ArrowRightIcon size={14}/>}
                     />
                     <ProtocolButton 
                        active={activeSquad.protocol === 'consensus'} 
                        onClick={() => handleProtocolChange('consensus')}
                        label="Debate / Consensus" 
                        desc="Agents discuss until they reach agreement." 
                        icon={<ActivityIcon size={14}/>}
                     />
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Manager Settings</h4>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Delegation Logic</span>
                        <select 
                           value={activeSquad.managerSettings.delegationLogic}
                           className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[10px] text-indigo-400 outline-none"
                        >
                           <option value="round-robin">Round Robin</option>
                           <option value="load-balanced">Load Balanced</option>
                        </select>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Approval Flow</span>
                        <select 
                           value={activeSquad.managerSettings.approvalMode}
                           className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[10px] text-indigo-400 outline-none"
                        >
                           <option value="auto">Auto-Approve</option>
                           <option value="human">Manual Intervention</option>
                        </select>
                     </div>
                  </div>
               </div>
            </section>

            {/* Selected Node Details */}
            {selectedNode && (
               <section className="animate-in slide-in-from-bottom-2 duration-300 space-y-6 pt-10 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                     <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Node Inspector</h4>
                     <button onClick={() => setSelectedNodeId(null)}><XIcon size={14} className="text-slate-600"/></button>
                  </div>
                  
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                     <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-lg">
                           {selectedNode.role === 'manager' ? '⭐' : '🛠️'}
                        </div>
                        <div>
                           <div className="text-xs font-bold text-white uppercase">{MOCK_AGENTS.find(a => a.id === selectedNode.agentId)?.name}</div>
                           <div className="text-[9px] text-slate-600 font-mono">NODE_ID: {selectedNode.id}</div>
                        </div>
                     </div>
                     
                     <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-500 uppercase">Mission Persona</label>
                        <div className="text-[10px] text-slate-400 leading-relaxed italic p-2 bg-slate-900 rounded-lg border border-slate-800">
                           "Perform as the primary technical decision maker for the refactor..."
                        </div>
                     </div>

                     <Button variant="secondary" size="sm" className="w-full text-[10px]" icon={<RotateCwIcon size={12}/>}>Replace Agent</Button>
                  </div>
               </section>
            )}

            {!selectedNode && (
               <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                  <ShieldIcon size={48} className="text-slate-800" />
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-600">Select a node to configure</p>
               </div>
            )}
         </div>

         <footer className="p-6 border-t border-slate-800 bg-slate-950/50 space-y-4 shrink-0">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase">
               <span>Memory State: SHARED</span>
               <div className="flex items-center">
                  <RotateCwIcon size={10} className="mr-1.5" /> 100% SYNCED
               </div>
            </div>
            <Button variant="primary" className="w-full shadow-lg shadow-indigo-500/20" icon={<CheckCircleIcon size={16}/>}>Save Squad</Button>
         </footer>
      </aside>

      {/* Simulation Result Overlay */}
      {isSimulating && (
         <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10">
            <div className="bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-4 border border-indigo-400/30">
                <SparklesIcon className="animate-spin" size={18} />
                <span className="text-sm font-bold uppercase tracking-widest">Autonomous Communication in Progress</span>
            </div>
         </div>
      )}

    </div>
  );
};

const ProtocolButton: React.FC<{ active: boolean; onClick: () => void; label: string; desc: string; icon: React.ReactNode }> = ({ active, onClick, label, desc, icon }) => (
   <button 
      onClick={onClick}
      className={`p-4 rounded-2xl border text-left transition-all ${
         active ? 'bg-indigo-600/20 border-indigo-500 shadow-lg' : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'
      }`}
   >
      <div className="flex items-center space-x-2 mb-1">
         <span className={active ? 'text-indigo-400' : 'text-slate-500'}>{icon}</span>
         <h4 className="text-xs font-bold text-white uppercase">{label}</h4>
      </div>
      <p className="text-[10px] text-slate-500 leading-tight">{desc}</p>
   </button>
);

const TemplateItem: React.FC<{ label: string }> = ({ label }) => (
   <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-800 hover:border-indigo-500/30 text-left transition-all group">
      <span className="text-xs text-slate-400 group-hover:text-slate-200">{label}</span>
      <ChevronRightIcon size={14} className="text-slate-600" />
   </button>
);

export default SquadComposer;
