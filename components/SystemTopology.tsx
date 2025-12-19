
import React, { useState, useMemo, useRef } from 'react';
import { TopologyNode, TopologyEdge, TopologyNodeType } from '../types';
import { MOCK_TOPOLOGY_NODES, MOCK_TOPOLOGY_EDGES } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  PlusIcon, 
  SearchIcon, 
  ActivityIcon, 
  DatabaseIcon, 
  ServerIcon, 
  CloudIcon, 
  GlobeIcon, 
  ShieldIcon, 
  XIcon, 
  ChevronRightIcon, 
  RefreshCwIcon, 
  ArrowRightIcon,
  FilterIcon,
  CodeIcon,
  SaveIcon,
  MaximizeIcon,
  MinimizeIcon,
  RotateCwIcon
} from './Icons';

const SystemTopology: React.FC = () => {
  const [nodes, setNodes] = useState<TopologyNode[]>(MOCK_TOPOLOGY_NODES);
  const [edges, setEdges] = useState<TopologyEdge[]>(MOCK_TOPOLOGY_EDGES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [scope, setScope] = useState<'module' | 'service' | 'infra'>('service');
  const [filters, setFilters] = useState({ databases: true, external: true, utils: false });
  const [isDraggingNode, setIsDraggingNode] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const selectedNode = useMemo(() => nodes.find(n => n.id === selectedId), [nodes, selectedId]);

  // Handle Pan/Zoom
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const startTx = transform.x;
    const startTy = transform.y;

    const onMove = (mv: MouseEvent) => {
      setTransform(prev => ({
        ...prev,
        x: startTx + (mv.clientX - startX),
        y: startTy + (mv.clientY - startY)
      }));
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
       e.preventDefault();
       const delta = -e.deltaY * 0.001;
       const newScale = Math.min(Math.max(0.2, transform.scale + delta), 2);
       setTransform(prev => ({ ...prev, scale: newScale }));
    } else {
       setTransform(prev => ({ ...prev, x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
    }
  };

  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedId(id);
    setIsDraggingNode(id);
    const startX = e.clientX;
    const startY = e.clientY;
    const node = nodes.find(n => n.id === id)!;
    const initialX = node.x;
    const initialY = node.y;

    const onMove = (mv: MouseEvent) => {
      const dx = (mv.clientX - startX) / transform.scale;
      const dy = (mv.clientY - startY) / transform.scale;
      setNodes(prev => prev.map(n => n.id === id ? { ...n, x: initialX + dx, y: initialY + dy } : n));
    };

    const onUp = () => {
      setIsDraggingNode(null);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans relative">
      
      {/* 1. Control Bar (Floating Glass Strip) */}
      <header className="h-[64px] border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 flex items-center justify-between px-8 z-30 sticky top-0 shadow-lg">
         <div className="flex items-center space-x-8">
            <div className="flex items-center">
               <ActivityIcon className="mr-3 text-emerald-400" size={24} />
               <div>
                  <h1 className="text-sm font-bold text-white uppercase tracking-widest leading-none">System Topology</h1>
                  <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">ARCH_MAP_STABLE_v4.2</p>
               </div>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            {/* Scope Toggle */}
            <div className="flex flex-col">
               <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Visualization Scope</span>
               <select 
                  className="bg-transparent border-none text-xs font-bold text-indigo-400 outline-none p-0 cursor-pointer hover:text-indigo-300"
                  value={scope}
                  onChange={(e) => setScope(e.target.value as any)}
               >
                  <option value="module">Module Level</option>
                  <option value="service">Service Level</option>
                  <option value="infra">Infrastructure</option>
               </select>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center space-x-3 bg-slate-800/50 border border-slate-700 rounded-lg p-1">
               <FilterItem active={filters.databases} onClick={() => setFilters({...filters, databases: !filters.databases})} label="DBs" />
               <FilterItem active={filters.external} onClick={() => setFilters({...filters, external: !filters.external})} label="External" />
               <FilterItem active={filters.utils} onClick={() => setFilters({...filters, utils: !filters.utils})} label="Utils" />
            </div>
         </div>

         <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm" icon={<RotateCwIcon size={14} />}>Recalculate</Button>
            <Button variant="primary" size="sm" icon={<SaveIcon size={14} />}>Export Mermaid</Button>
         </div>
      </header>

      {/* 2. Main Content Split */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* LEFT: Canvas */}
         <main 
            ref={containerRef}
            onMouseDown={handleCanvasMouseDown}
            onWheel={handleWheel}
            className="flex-1 bg-[#0d1117] relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
         >
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{
               backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)',
               backgroundSize: '40px 40px',
               transform: `translate(${transform.x % 40}px, ${transform.y % 40}px)`
            }} />

            <div 
               className="absolute inset-0 transition-transform duration-75 ease-out"
               style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transformOrigin: '0 0' }}
            >
               {/* Edge Layer */}
               <svg className="absolute inset-0 w-[5000px] h-[5000px] pointer-events-none overflow-visible">
                  <defs>
                    <marker id="topology-arrow" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                      <path d="M0,0 L8,4 L0,8 Z" fill="#475569" />
                    </marker>
                    <marker id="topology-arrow-active" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                      <path d="M0,0 L8,4 L0,8 Z" fill="#6366f1" />
                    </marker>
                  </defs>
                  {edges.map(edge => {
                     const source = nodes.find(n => n.id === edge.source);
                     const target = nodes.find(n => n.id === edge.target);
                     if (!source || !target) return null;

                     const isRelevant = selectedId === edge.source || selectedId === edge.target;

                     const x1 = source.x + 200;
                     const y1 = source.y + 40;
                     const x2 = target.x;
                     const y2 = target.y + 40;
                     const dx = Math.abs(x2 - x1) * 0.5;

                     return (
                        <g key={edge.id} className="transition-opacity duration-300" style={{ opacity: selectedId && !isRelevant ? 0.2 : 1 }}>
                           <path 
                              d={`M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`}
                              fill="none"
                              stroke={isRelevant ? '#6366f1' : '#334155'}
                              strokeWidth={isRelevant ? 3 : 2}
                              strokeDasharray={edge.type === 'async' ? '5,5' : '0'}
                              markerEnd={isRelevant ? "url(#topology-arrow-active)" : "url(#topology-arrow)"}
                              className={edge.type === 'async' ? 'animate-pulse' : ''}
                           />
                           {edge.label && (
                              <foreignObject x={(x1 + x2) / 2 - 30} y={(y1 + y2) / 2 - 10} width="60" height="20">
                                 <div className={`text-[9px] font-mono font-bold text-center py-0.5 rounded border ${isRelevant ? 'bg-indigo-900 border-indigo-500 text-indigo-200' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                                    {edge.label}
                                 </div>
                              </foreignObject>
                           )}
                        </g>
                     );
                  })}
               </svg>

               {/* Node Layer */}
               {nodes.map(node => (
                  <div 
                     key={node.id}
                     onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                     className={`absolute w-[200px] bg-slate-900/90 border-2 rounded-xl transition-all duration-300 shadow-xl overflow-hidden group cursor-pointer ${
                        selectedId === node.id 
                           ? 'border-indigo-500 ring-4 ring-indigo-500/20 scale-105 z-40' 
                           : 'border-slate-800 hover:border-slate-600 z-10'
                     } ${
                        selectedId && selectedId !== node.id ? 'opacity-30 blur-[0.5px]' : ''
                     }`}
                     style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
                  >
                     <div className={`h-1.5 w-full ${
                        node.metadata.health === 'healthy' ? 'bg-emerald-500' : 
                        node.metadata.health === 'warning' ? 'bg-amber-500' : 
                        'bg-red-500'
                     }`} />
                     <div className="p-4 flex items-center space-x-3">
                        <NodeTypeIcon type={node.type} />
                        <div className="min-w-0">
                           <div className="text-xs font-bold text-white truncate uppercase tracking-wider">{node.label}</div>
                           <div className="text-[9px] font-mono text-slate-500 uppercase">{node.metadata.language || 'SYS'}</div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {/* Context Tooltip (Floating) */}
            <div className="absolute bottom-6 right-6 bg-slate-900/80 backdrop-blur border border-slate-800 p-4 rounded-2xl shadow-2xl space-y-4 text-xs font-mono text-slate-500 pointer-events-none">
               <div className="flex flex-col space-y-2">
                  <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" /> OPERATIONAL</div>
                  <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-amber-500 mr-2" /> DRIFT_DETECTED</div>
               </div>
               <div className="pt-2 border-t border-slate-800 opacity-50 uppercase tracking-widest text-[9px]">
                  STATIC_ANALYSIS: ACTIVE (v1.2)
               </div>
            </div>
         </main>

         {/* RIGHT: Inspector Pane */}
         <aside className="w-[380px] border-l border-slate-800 bg-slate-900 flex flex-col shrink-0 z-20 animate-in slide-in-from-right-full duration-300">
            {selectedNode ? (
               <>
                  <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 bg-slate-900/50 backdrop-blur">
                     <div className="flex items-center space-x-3">
                        <NodeTypeIcon type={selectedNode.type} size={20} />
                        <div>
                           <h3 className="font-bold text-white text-sm uppercase tracking-wider">{selectedNode.label}</h3>
                           <span className="text-[10px] text-slate-500 font-mono">NODE_{selectedNode.id}</span>
                        </div>
                     </div>
                     <button onClick={() => setSelectedId(null)} className="p-2 text-slate-500 hover:text-white transition-colors">
                        <XIcon size={20} />
                     </button>
                  </header>

                  <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                     {/* Metadata Block */}
                     <section className="grid grid-cols-2 gap-4">
                        <MetaBox label="Language" value={selectedNode.metadata.language || 'N/A'} />
                        <MetaBox label="Framework" value={selectedNode.metadata.framework || 'N/A'} />
                        <MetaBox label="Maintainer" value={selectedNode.metadata.maintainer || 'Core Team'} />
                        <MetaBox label="Uptime" value={selectedNode.metadata.uptime || '99.9%'} color="text-emerald-500" />
                     </section>

                     <div className="h-px bg-slate-800" />

                     {/* Dependencies */}
                     <section className="space-y-4">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dependencies</h4>
                        <div className="space-y-2">
                           <div className="text-[10px] text-indigo-400 font-bold mb-1">UPSTREAM (DEPENDENT ON THIS)</div>
                           {edges.filter(e => e.target === selectedId).map(e => (
                              <div key={e.id} className="flex items-center justify-between p-2 bg-slate-850 rounded border border-slate-700">
                                 <span className="text-xs text-slate-300">{nodes.find(n => n.id === e.source)?.label}</span>
                                 <Badge variant="neutral">{e.label}</Badge>
                              </div>
                           ))}
                           
                           <div className="text-[10px] text-indigo-400 font-bold mb-1 mt-4">DOWNSTREAM (THIS USES)</div>
                           {edges.filter(e => e.source === selectedId).map(e => (
                              <div key={e.id} className="flex items-center justify-between p-2 bg-slate-850 rounded border border-slate-700">
                                 <span className="text-xs text-slate-300">{nodes.find(n => n.id === e.target)?.label}</span>
                                 <Badge variant="neutral">{e.label}</Badge>
                              </div>
                           ))}
                        </div>
                     </section>

                     {/* Internal Modules */}
                     {selectedNode.metadata.internalModules && (
                        <section className="space-y-3">
                           <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Internal Components</h4>
                           <div className="flex flex-wrap gap-2">
                              {selectedNode.metadata.internalModules.map(m => (
                                 <span key={m} className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-400 font-mono">
                                    {m}
                                 </span>
                              ))}
                           </div>
                        </section>
                     )}

                     <div className="h-px bg-slate-800" />

                     {/* Actions */}
                     <section className="space-y-3">
                        <Button variant="primary" className="w-full justify-start" icon={<CodeIcon size={16}/>}>Focus Entry in Editor</Button>
                        <Button variant="secondary" className="w-full justify-start" icon={<ShieldIcon size={16}/>}>Security Audit Logs</Button>
                        <Button variant="ghost" className="w-full justify-start" icon={<ArrowRightIcon size={16}/>}>View Component Docs</Button>
                     </section>
                  </div>

                  <footer className="p-6 bg-slate-950/50 border-t border-slate-800 shrink-0">
                     <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase">
                        <span>DRIFT_STATUS: CLEAN</span>
                        <div className="flex items-center">
                           <RotateCwIcon size={10} className="mr-1.5" /> SYNCED
                        </div>
                     </div>
                  </footer>
               </>
            ) : (
               <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-800 flex items-center justify-center">
                     <ActivityIcon size={40} className="text-slate-800" />
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-slate-300 uppercase tracking-wider">No Node Selected</h3>
                     <p className="text-sm text-slate-500 mt-2">Select a system entity on the map to audit its relationships and health.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 w-full">
                     <QuickAction label="Generate Graph" icon={<RefreshCwIcon size={14}/>} />
                     <QuickAction label="Snap Layout" icon={<LayoutGridIconProxy size={14}/>} />
                  </div>
               </div>
            )}
         </aside>

      </div>
    </div>
  );
};

// Sub-components

const NodeTypeIcon: React.FC<{ type: TopologyNodeType; size?: number }> = ({ type, size = 16 }) => {
   switch (type) {
      case 'database': return <DatabaseIcon size={size} className="text-amber-400" />;
      case 'external': return <CloudIcon size={size} className="text-blue-400" />;
      case 'frontend': return <GlobeIcon size={size} className="text-emerald-400" />;
      case 'gateway': return <ShieldIcon size={size} className="text-red-400" />;
      case 'worker': return <ActivityIcon size={size} className="text-purple-400" />;
      default: return <ServerIcon size={size} className="text-indigo-400" />;
   }
};

const FilterItem: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
   <button 
      onClick={onClick}
      className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${
         active ? 'bg-slate-700 text-white shadow-inner' : 'text-slate-500 hover:text-slate-300'
      }`}
   >
      {label}
   </button>
);

const MetaBox: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color = 'text-slate-300' }) => (
   <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
      <div className="text-[9px] font-bold text-slate-600 uppercase mb-1 tracking-tighter">{label}</div>
      <div className={`text-xs font-bold truncate ${color}`}>{value}</div>
   </div>
);

const QuickAction: React.FC<{ label: string; icon: React.ReactNode }> = ({ label, icon }) => (
   <button className="flex items-center justify-center p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-slate-500 transition-all text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white group">
      <span className="mr-2 group-hover:scale-110 transition-transform">{icon}</span>
      {label}
   </button>
);

const LayoutGridIconProxy: React.FC<any> = (props) => (
   <svg
     xmlns="http://www.w3.org/2000/svg"
     width={props.size || 20}
     height={props.size || 20}
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     strokeWidth="2"
     strokeLinecap="round"
     strokeLinejoin="round"
     {...props}
   >
     <rect x="3" y="3" width="7" height="7" />
     <rect x="14" y="3" width="7" height="7" />
     <rect x="14" y="14" width="7" height="7" />
     <rect x="3" y="14" width="7" height="7" />
   </svg>
 );

export default SystemTopology;
