
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { OrchestratorNode, OrchestratorEdge, OrchNodeType } from '../types';
import { MOCK_ORCH_NODES, MOCK_ORCH_EDGES, MOCK_AGENTS } from '../constants';
import Button from './Button';
import { 
  PlusIcon, 
  SearchIcon, 
  SparklesIcon, 
  ActivityIcon, 
  SettingsIcon, 
  FilterIcon, 
  ChevronRightIcon, 
  RefreshCwIcon, 
  XIcon, 
  TerminalIcon, 
  CheckCircleIcon, 
  AlertTriangleIcon,
  TrashIcon,
  ZapIcon,
  LockIcon,
  CrownIcon,
  RotateCwIcon,
  // Fix: Added missing CodeIcon and ShieldIcon imports
  CodeIcon,
  ShieldIcon
} from './Icons';

const AgentOrchestrator: React.FC = () => {
  const [nodes, setNodes] = useState<OrchestratorNode[]>(MOCK_ORCH_NODES);
  const [edges, setEdges] = useState<OrchestratorEdge[]>(MOCK_ORCH_EDGES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [testInput, setTestInput] = useState('');
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDraggingNode, setIsDraggingNode] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedNode = nodes.find(n => n.id === selectedId);

  // Path Tracing Logic
  const activePathNodes = useMemo(() => {
    if (!testInput.trim()) return new Set<string>();
    
    const active = new Set<string>(['n1']); // Start always active
    const input = testInput.toLowerCase();

    // Naive rule evaluation
    // Router Node logic
    const evaluate = (nodeId: string) => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;

      if (node.type === 'router') {
        const keywords = node.data.keywords || [];
        const match = keywords.some((k: string) => input.includes(k.toLowerCase()));
        
        const outgoing = edges.filter(e => e.source === nodeId);
        outgoing.forEach(edge => {
          if ((edge.label === 'Yes' && match) || (edge.label === 'No' && !match) || (!edge.label)) {
            active.add(edge.target);
            evaluate(edge.target);
          }
        });
      } else {
         const outgoing = edges.filter(e => e.source === nodeId);
         outgoing.forEach(edge => {
            active.add(edge.target);
            evaluate(edge.target);
         });
      }
    };

    evaluate('n1');
    return active;
  }, [testInput, nodes, edges]);

  // Interactions
  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedId(id);
    setIsDraggingNode(id);
    const startX = e.clientX;
    const startY = e.clientY;
    const initialNode = nodes.find(n => n.id === id)!;
    const initialX = initialNode.x;
    const initialY = initialNode.y;

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

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans relative">
      
      {/* 1. Floating Glass Toolbar */}
      <header className="h-[64px] border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 flex items-center justify-between px-8 z-30 sticky top-0 shadow-lg">
         <div className="flex items-center space-x-6">
            <div className="flex items-center">
               <ActivityIcon className="mr-3 text-indigo-400" size={24} />
               <h1 className="text-xl font-bold text-white tracking-tight uppercase">Agent Orchestrator</h1>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            {/* Live Testing Input */}
            <div className="flex-1 max-w-xl relative group">
               <div className="absolute -inset-0.5 bg-indigo-500/20 rounded-lg blur opacity-50 group-focus-within:opacity-100 transition duration-500"></div>
               <div className="relative flex items-center bg-slate-950 border border-slate-700 rounded-lg overflow-hidden">
                  <SearchIcon className="ml-3 text-slate-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Type a prompt to test routing paths..."
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    className="flex-1 bg-transparent border-none text-sm text-white placeholder-slate-600 focus:ring-0 px-3 py-2.5 font-mono"
                  />
                  {testInput && (
                     <div className="flex items-center pr-3 space-x-2 animate-in fade-in">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Tracing Active</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                     </div>
                  )}
               </div>
            </div>
         </div>

         <div className="flex items-center space-x-3 ml-6">
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded p-1 mr-4">
               <button className="p-1.5 rounded bg-slate-700 text-white"><ActivityIcon size={14}/></button>
               <button className="p-1.5 rounded text-slate-500 hover:text-slate-300"><FilterIcon size={14}/></button>
            </div>
            <Button variant="primary" size="sm" icon={<PlusIcon size={14} />}>Add Node</Button>
         </div>
      </header>

      {/* 2. Main content Split Area */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* LEFT: Canvas Area */}
         <main 
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            onWheel={handleWheel}
            className="flex-1 bg-[#0d1117] relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
         >
            {/* Background Grid Pattern */}
            <div 
               className="absolute inset-0 pointer-events-none opacity-10"
               style={{
                  backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)',
                  backgroundSize: '30px 30px',
                  transform: `translate(${transform.x % 30}px, ${transform.y % 30}px)`
               }} 
            />

            <div 
               className="absolute inset-0 transition-transform duration-75 ease-out"
               style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transformOrigin: '0 0' }}
            >
               {/* SVG Edge Layer */}
               <svg className="absolute inset-0 w-[5000px] h-[5000px] pointer-events-none overflow-visible">
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                      <path d="M0,0 L10,5 L0,10 Z" fill="#475569" />
                    </marker>
                    <marker id="arrowhead-active" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                      <path d="M0,0 L10,5 L0,10 Z" fill="#6366f1" />
                    </marker>
                  </defs>
                  {edges.map(edge => {
                    const source = nodes.find(n => n.id === edge.source);
                    const target = nodes.find(n => n.id === edge.target);
                    if (!source || !target) return null;
                    
                    const isActive = activePathNodes.has(edge.source) && activePathNodes.has(edge.target);
                    
                    // Simple logic for node sockets: Output (Right), Input (Left)
                    const x1 = source.x + 220;
                    const y1 = source.y + 40;
                    const x2 = target.x;
                    const y2 = target.y + 40;
                    const dx = Math.abs(x2 - x1) * 0.5;

                    return (
                      <g key={edge.id}>
                         <path 
                           d={`M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`}
                           fill="none"
                           stroke={isActive ? '#6366f1' : '#334155'}
                           strokeWidth={isActive ? 3 : 2}
                           markerEnd={isActive ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                           className={`transition-all duration-500 ${isActive ? 'animate-pulse' : ''}`}
                         />
                         {edge.label && (
                           <foreignObject x={(x1 + x2) / 2 - 30} y={(y1 + y2) / 2 - 10} width="60" height="20">
                              <div className={`text-[9px] font-bold uppercase tracking-tighter text-center py-0.5 rounded border ${isActive ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                                 {edge.label}
                              </div>
                           </foreignObject>
                         )}
                      </g>
                    );
                  })}
               </svg>

               {/* HTML Node Layer */}
               {nodes.map(node => (
                  <div 
                     key={node.id}
                     onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                     className={`absolute w-[220px] rounded-xl border-2 transition-all duration-300 shadow-lg cursor-pointer hover:shadow-2xl overflow-hidden group ${
                        selectedId === node.id ? 'ring-4 ring-indigo-500/20' : ''
                     } ${
                        activePathNodes.has(node.id) 
                        ? 'border-indigo-500 shadow-indigo-500/10' 
                        : 'border-slate-800 bg-slate-900/80 backdrop-blur'
                     }`}
                     style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
                  >
                     {/* Header */}
                     <div className={`px-4 py-2 border-b border-slate-800 flex items-center justify-between ${
                        node.type === 'trigger' ? 'bg-blue-500/10' :
                        node.type === 'router' ? 'bg-amber-500/10' :
                        node.type === 'agent' ? 'bg-emerald-500/10' :
                        'bg-red-500/10'
                     }`}>
                        <div className="flex items-center space-x-2">
                           <NodeIcon type={node.type} />
                           <span className="text-[10px] font-bold text-white uppercase tracking-widest">{node.label}</span>
                        </div>
                        <div className="flex space-x-1">
                           <div className={`w-1.5 h-1.5 rounded-full ${activePathNodes.has(node.id) ? 'bg-indigo-400 animate-pulse' : 'bg-slate-700'}`} />
                        </div>
                     </div>

                     {/* Body */}
                     <div className="p-4 space-y-3">
                        <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                           {node.description || 'Executing orchestration unit...'}
                        </p>
                        {node.type === 'agent' && (
                           <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                              <div className="w-5 h-5 rounded-md bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-[10px]">
                                 <SparklesIcon size={10} />
                              </div>
                              <span className="text-[9px] font-mono text-slate-500 uppercase truncate">ID: {node.data.agentId}</span>
                           </div>
                        )}
                        {node.type === 'router' && (
                           <div className="flex flex-wrap gap-1">
                              {node.data.keywords?.slice(0, 3).map((k: string) => (
                                 <span key={k} className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-mono">/{k}</span>
                              ))}
                           </div>
                        )}
                     </div>

                     {/* Selection Glow Overlay */}
                     {selectedId === node.id && (
                        <div className="absolute inset-0 border-2 border-indigo-500 rounded-xl pointer-events-none animate-pulse" />
                     )}
                  </div>
               ))}
            </div>

            {/* Mini-map / Context Hint Overlay */}
            <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur border border-slate-800 p-3 rounded-xl shadow-2xl space-y-2 text-[10px] font-mono text-slate-500 pointer-events-none">
               <div className="flex items-center space-x-4">
                  <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-blue-500 mr-2" /> TRIGGER</div>
                  <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-amber-500 mr-2" /> ROUTER</div>
                  <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" /> AGENT</div>
               </div>
               <div className="opacity-50">SCROLL TO ZOOM • SPACE + DRAG TO PAN</div>
            </div>
         </main>

         {/* RIGHT: Properties Panel (350px) */}
         <aside className="w-[350px] border-l border-slate-800 bg-slate-900 flex flex-col shrink-0 z-20">
            {selectedNode ? (
               <>
                  <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 bg-slate-900/50 backdrop-blur">
                     <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                           <NodeIcon type={selectedNode.type} size={20} />
                        </div>
                        <div>
                           <h3 className="font-bold text-white text-sm uppercase tracking-wider">{selectedNode.type} Details</h3>
                           <span className="text-[10px] text-slate-500 font-mono uppercase">NODE_{selectedNode.id}</span>
                        </div>
                     </div>
                     <button onClick={() => setSelectedId(null)} className="p-2 text-slate-500 hover:text-white transition-colors">
                        <XIcon size={20} />
                     </button>
                  </header>

                  <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                     {/* Basic Info */}
                     <section className="space-y-4">
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Display Name</label>
                           <input 
                              type="text" 
                              value={selectedNode.label}
                              onChange={(e) => setNodes(nodes.map(n => n.id === selectedId ? { ...n, label: e.target.value } : n))}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-bold"
                           />
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description</label>
                           <textarea 
                              value={selectedNode.description || ''}
                              onChange={(e) => setNodes(nodes.map(n => n.id === selectedId ? { ...n, description: e.target.value } : n))}
                              className="w-full h-20 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-slate-300 resize-none focus:outline-none focus:border-indigo-500"
                           />
                        </div>
                     </section>

                     <div className="h-px bg-slate-800" />

                     {/* Specialized Configuration */}
                     <section className="space-y-6">
                        {selectedNode.type === 'router' && (
                           <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                 <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Keyword Filters</h4>
                                 <button className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold">+ ADD</button>
                              </div>
                              <div className="space-y-2">
                                 {selectedNode.data.keywords?.map((k: string, i: number) => (
                                    <div key={i} className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-2 group">
                                       <code className="flex-1 text-xs text-emerald-400">{k}</code>
                                       <button className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"><TrashIcon size={12}/></button>
                                    </div>
                                 ))}
                              </div>
                              <div className="p-3 bg-indigo-900/10 border border-indigo-500/20 rounded-lg text-[10px] text-indigo-200/60 leading-relaxed">
                                 If the user prompt contains any of these keywords, the router will prioritize the **'Yes'** path.
                              </div>
                           </div>
                        )}

                        {selectedNode.type === 'agent' && (
                           <div className="space-y-4">
                              <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Target Intelligence</h4>
                              <div className="space-y-3">
                                 <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-600 uppercase">Specialized Agent</label>
                                    <select 
                                       className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500 appearance-none"
                                       value={selectedNode.data.agentId}
                                    >
                                       {MOCK_AGENTS.map(a => <option key={a.id} value={a.id}>{a.name} ({a.role})</option>)}
                                    </select>
                                 </div>
                                 <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-600 uppercase">Timeout Threshold</label>
                                    <div className="flex items-center space-x-3">
                                       <input type="range" className="flex-1 accent-indigo-500" min="5" max="60" defaultValue="30" />
                                       <span className="text-[10px] font-mono text-white">30s</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        )}
                     </section>

                     {/* Actions */}
                     <section className="pt-6 space-y-3">
                        <Button variant="secondary" className="w-full justify-center" icon={<CodeIcon size={14}/>}>View Pipeline JSON</Button>
                        <Button variant="destructive" className="w-full justify-center" icon={<TrashIcon size={14}/>}>Remove Node</Button>
                     </section>
                  </div>

                  <footer className="p-6 border-t border-slate-800 bg-slate-950/50 space-y-4 shrink-0">
                     <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-600">
                        <ShieldIcon size={12} className="text-emerald-500" />
                        <span>VALIDATION: SUCCESSFUL</span>
                     </div>
                     <Button variant="primary" className="w-full shadow-lg shadow-indigo-500/20" icon={<CheckCircleIcon size={16}/>}>Save Rules</Button>
                  </footer>
               </>
            ) : (
               <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-800 flex items-center justify-center">
                     <SettingsIcon size={40} className="text-slate-800" />
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-slate-300">No Selection</h3>
                     <p className="text-sm text-slate-500 mt-2">Select a routing node on the canvas to configure its logic and triggers.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 w-full">
                     <QuickAction label="New Router" icon={<FilterIcon size={14}/>} />
                     <QuickAction label="Add Agent" icon={<SparklesIcon size={14}/>} />
                  </div>
               </div>
            )}
         </aside>

      </div>

      {/* 3. Global Status Bar (EX-15 Footer) */}
      <footer className="h-10 bg-slate-900 border-t border-slate-800 shrink-0 px-8 flex items-center justify-between z-30">
         <div className="flex items-center space-x-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <div className="flex items-center">
               <RotateCwIcon size={12} className="mr-2 text-indigo-400" />
               ORCH_VERSION: <span className="ml-2 text-slate-300">1.4.2-STABLE</span>
            </div>
            <div className="flex items-center">
               <ActivityIcon size={12} className="mr-2 text-indigo-400" />
               LOAD_BALANCER: <span className="ml-2 text-emerald-500 uppercase">Ready</span>
            </div>
         </div>
         <div className="flex items-center space-x-4">
            <span className="text-[10px] font-mono text-slate-600">CLUSTER: mcoda-local-01</span>
            <div className="h-3 w-px bg-slate-800" />
            <div className="flex items-center text-indigo-400">
               <LockIcon size={12} className="mr-2" />
               ENCRYPTED_FLOW
            </div>
         </div>
      </footer>

    </div>
  );
};

// Sub-components

const NodeIcon: React.FC<{ type: OrchNodeType; size?: number }> = ({ type, size = 14 }) => {
   switch (type) {
      case 'trigger': return <MessageSquareIconProxy size={size} className="text-blue-400" />;
      case 'router': return <FilterIcon size={size} className="text-amber-400" />;
      case 'agent': return <SparklesIcon size={size} className="text-emerald-400" />;
      case 'fallback': return <AlertTriangleIcon size={size} className="text-red-400" />;
   }
};

const QuickAction: React.FC<{ label: string; icon: React.ReactNode }> = ({ label, icon }) => (
   <button className="flex items-center justify-center p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-slate-500 transition-all text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white group">
      <span className="mr-2 group-hover:scale-110 transition-transform">{icon}</span>
      {label}
   </button>
);

const MessageSquareIconProxy: React.FC<any> = (props) => (
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
     <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
   </svg>
 );

export default AgentOrchestrator;
