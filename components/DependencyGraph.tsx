
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Task } from '../types';
import { 
  PlusIcon, 
  SearchIcon, 
  ArrowRightIcon, 
  AlertCircleIcon,
  RefreshCwIcon,
  ZapIcon
} from './Icons';

interface DependencyGraphProps {
  tasks: Task[];
  onTaskClick?: (taskId: string) => void;
}

interface Node {
  id: string;
  x: number;
  y: number;
  data: Task;
  level: number;
}

interface Edge {
  id: string;
  from: string;
  to: string;
  isCritical?: boolean;
}

const DependencyGraph: React.FC<DependencyGraphProps> = ({ tasks, onTaskClick }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDraggingNode, setIsDraggingNode] = useState<string | null>(null);
  const [connectionDraft, setConnectionDraft] = useState<{ startId: string, x: number, y: number } | null>(null);
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Graph Layout Logic ---
  const { graphNodes, graphEdges } = useMemo(() => {
    // 1. Build Adjacency
    const adj: Record<string, string[]> = {}; // id -> dependencies
    const reverseAdj: Record<string, string[]> = {}; // id -> children (dependent on id)

    tasks.forEach(t => {
      adj[t.id] = t.dependencies || [];
      if (!reverseAdj[t.id]) reverseAdj[t.id] = [];
      (t.dependencies || []).forEach(depId => {
        if (!reverseAdj[depId]) reverseAdj[depId] = [];
        reverseAdj[depId].push(t.id);
      });
    });

    // 2. Calculate Levels (Simplified Topological Sort / Layering)
    const levels: Record<string, number> = {};
    const getLevel = (id: string, visited = new Set<string>()): number => {
      if (visited.has(id)) return 0; // Cycle detected fallback
      if (levels[id] !== undefined) return levels[id];
      
      visited.add(id);
      const deps = adj[id] || [];
      if (deps.length === 0) {
        levels[id] = 0;
        return 0;
      }
      
      const maxParentLevel = Math.max(...deps.map(d => getLevel(d, new Set(visited))));
      levels[id] = maxParentLevel + 1;
      return maxParentLevel + 1;
    };

    tasks.forEach(t => getLevel(t.id));

    // 3. Group by Level for positioning
    const nodesByLevel: Record<number, Node[]> = {};
    const computedNodes: Node[] = [];
    
    // Sort tasks by ID to keep deterministic order within levels
    const sortedTasks = [...tasks].sort((a, b) => a.id.localeCompare(b.id));

    sortedTasks.forEach(task => {
      const level = levels[task.id] || 0;
      if (!nodesByLevel[level]) nodesByLevel[level] = [];
      
      const indexInLevel = nodesByLevel[level].length;
      
      // Basic layout config
      const NODE_WIDTH = 200;
      const NODE_HEIGHT = 100;
      const GAP_X = 50;
      const GAP_Y = 150;

      // Position logic
      const x = indexInLevel * (NODE_WIDTH + GAP_X);
      const y = level * (NODE_HEIGHT + GAP_Y);

      const node: Node = {
        id: task.id,
        x: x + 100, // Offset initial padding
        y: y + 100,
        data: task,
        level
      };
      
      nodesByLevel[level].push(node);
      computedNodes.push(node);
    });

    // 4. Center Levels
    // Find max width
    const maxWidth = Math.max(...Object.values(nodesByLevel).map(arr => arr.length * 250));
    computedNodes.forEach(node => {
      const levelNodes = nodesByLevel[node.level];
      const levelWidth = levelNodes.length * 250 - 50;
      const offset = (maxWidth - levelWidth) / 2;
      node.x += offset;
    });

    // 5. Build Edges
    const computedEdges: Edge[] = [];
    tasks.forEach(task => {
      (task.dependencies || []).forEach(depId => {
        // Only if parent exists in our task list
        if (tasks.find(t => t.id === depId)) {
          computedEdges.push({
            id: `${depId}->${task.id}`,
            from: depId,
            to: task.id,
            isCritical: task.priority === 'high' // Naive critical path logic
          });
        }
      });
    });

    return { graphNodes: computedNodes, graphEdges: computedEdges };
  }, [tasks]);

  // Initial Sync
  useEffect(() => {
    setNodes(graphNodes);
    
    // Auto-center viewport
    if (containerRef.current && graphNodes.length > 0) {
      // Find bounds
      const minX = Math.min(...graphNodes.map(n => n.x));
      const maxX = Math.max(...graphNodes.map(n => n.x + 180));
      const minY = Math.min(...graphNodes.map(n => n.y));
      const maxY = Math.max(...graphNodes.map(n => n.y + 80));
      
      const graphW = maxX - minX + 200;
      const graphH = maxY - minY + 200;
      const containerW = containerRef.current.clientWidth;
      const containerH = containerRef.current.clientHeight;

      const scale = Math.min(1, Math.min(containerW / graphW, containerH / graphH));
      const x = (containerW - graphW * scale) / 2 - minX * scale + 100;
      const y = (containerH - graphH * scale) / 2 - minY * scale + 100;

      setTransform({ x, y, scale });
    }
  }, [graphNodes]);


  // --- Interactions ---

  const handleWheel = (e: React.WheelEvent) => {
    // Basic Zoom/Pan Logic
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault(); // Stop browser zoom
      const zoomSensitivity = 0.001;
      const delta = -e.deltaY * zoomSensitivity;
      const newScale = Math.min(Math.max(0.1, transform.scale + delta), 3);
      
      // Zoom towards mouse pointer logic omitted for brevity, scaling center for now
      setTransform(prev => ({ ...prev, scale: newScale }));
    } else {
       setTransform(prev => ({
         ...prev,
         x: prev.x - e.deltaX,
         y: prev.y - e.deltaY
       }));
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Middle mouse or Space+Click to pan could go here.
    // Implementing simple background drag to pan
    if (e.button === 0 && !isDraggingNode && !connectionDraft) {
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
    }
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setIsDraggingNode(nodeId);
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    // Find initial node pos
    const nodeIndex = nodes.findIndex(n => n.id === nodeId);
    if (nodeIndex === -1) return;
    const startNodeX = nodes[nodeIndex].x;
    const startNodeY = nodes[nodeIndex].y;

    const onMove = (mv: MouseEvent) => {
      const dx = (mv.clientX - startX) / transform.scale;
      const dy = (mv.clientY - startY) / transform.scale;
      
      setNodes(prev => {
        const next = [...prev];
        next[nodeIndex] = { ...next[nodeIndex], x: startNodeX + dx, y: startNodeY + dy };
        return next;
      });
    };

    const onUp = () => {
      setIsDraggingNode(null);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const handlePortMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    // Starting Coordinates relative to transformed space
    // Output port is at node.x + width (180), node.y + height/2 (40)
    const startX = node.x + 180;
    const startY = node.y + 40;

    setConnectionDraft({ startId: nodeId, x: startX, y: startY });

    const onMove = (mv: MouseEvent) => {
       // Need to convert screen mouse coords to graph space
       if (!containerRef.current) return;
       const rect = containerRef.current.getBoundingClientRect();
       const mouseGraphX = (mv.clientX - rect.left - transform.x) / transform.scale;
       const mouseGraphY = (mv.clientY - rect.top - transform.y) / transform.scale;

       setConnectionDraft({ startId: nodeId, x: mouseGraphX, y: mouseGraphY });
    };

    const onUp = (upEvt: MouseEvent) => {
      // Check if dropped on another node input
      // This is a simplified check. Real hit testing involves checking elements under cursor.
      // For this demo, we'll rely on a global listener or simple distance check if needed,
      // but strictly, we handle the drop in the `onMouseUp` of the target input port.
      // Since `onUp` here is on window, we clear draft.
      
      setConnectionDraft(null);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const handleInputPortMouseUp = (e: React.MouseEvent, targetNodeId: string) => {
    e.stopPropagation();
    if (connectionDraft && connectionDraft.startId !== targetNodeId) {
      // Create Connection!
      // In a real app, this dispatches an action to update the Task.
      // For now, we just simulate success with a console log or alert
      console.log(`Connecting ${connectionDraft.startId} to ${targetNodeId}`);
      // alert(`Created dependency: ${connectionDraft.startId} blocks ${targetNodeId}`);
    }
  };


  // --- Render Helpers ---

  const renderBezier = (x1: number, y1: number, x2: number, y2: number, critical: boolean) => {
    const dist = Math.abs(x2 - x1);
    const cp1x = x1 + dist * 0.5;
    const cp2x = x2 - dist * 0.5;
    
    return (
      <path 
        d={`M ${x1} ${y1} C ${cp1x} ${y1}, ${cp2x} ${y2}, ${x2} ${y2}`}
        fill="none"
        stroke={critical ? "#ef4444" : "#475569"}
        strokeWidth={critical ? 3 : 2}
        markerEnd="url(#arrow)"
        className="transition-colors duration-300"
      />
    );
  };

  // Helper to get edge color based on status of source node could be cool, 
  // but we stick to critical path highlight as requested.
  const displayedEdges = showCriticalOnly 
    ? graphEdges.filter(e => e.isCritical)
    : graphEdges;

  return (
    <div className="relative w-full h-full bg-[#0f172a] overflow-hidden select-none">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
           backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)',
           backgroundSize: '20px 20px',
           transform: `translate(${transform.x % 20}px, ${transform.y % 20}px) scale(${transform.scale})` // Parallax-ish grid scale effect is tricky with CSS pattern, keeping simple
        }} 
      />
      
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
         <div className="flex items-center bg-slate-800/80 backdrop-blur rounded-lg border border-slate-700 p-1 shadow-lg">
             <button 
                onClick={() => setTransform(t => ({...t, scale: t.scale * 1.2}))}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                title="Zoom In"
             >
                +
             </button>
             <span className="text-xs font-mono text-slate-500 w-12 text-center">{Math.round(transform.scale * 100)}%</span>
             <button 
                onClick={() => setTransform(t => ({...t, scale: t.scale * 0.8}))}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                title="Zoom Out"
             >
                -
             </button>
         </div>

         <div className="bg-slate-800/80 backdrop-blur rounded-lg border border-slate-700 p-2 shadow-lg space-y-2">
             <button 
               onClick={() => {
                 setNodes(graphNodes); // Reset positions
               }}
               className="w-full flex items-center px-2 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 rounded transition-colors"
             >
                <RefreshCwIcon size={12} className="mr-2" />
                Auto-Layout
             </button>
             <button 
               onClick={() => setShowCriticalOnly(!showCriticalOnly)}
               className={`w-full flex items-center px-2 py-1.5 text-xs font-medium rounded transition-colors ${
                 showCriticalOnly ? 'bg-red-500/20 text-red-400' : 'text-slate-300 hover:bg-slate-700'
               }`}
             >
                <ZapIcon size={12} className="mr-2" />
                Critical Path
             </button>
         </div>
      </div>
      
      {/* Main Canvas */}
      <div 
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleCanvasMouseDown}
      >
         <div 
           style={{
             transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
             transformOrigin: '0 0',
             transition: isDraggingNode ? 'none' : 'transform 0.1s ease-out'
           }}
           className="relative w-full h-full"
         >
            {/* SVG Layer for Edges */}
            <svg className="absolute top-0 left-0 w-[5000px] h-[5000px] pointer-events-none overflow-visible">
               <defs>
                 <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto" markerUnits="strokeWidth">
                   <path d="M0,0 L0,6 L9,3 z" fill="#475569" />
                 </marker>
               </defs>
               {displayedEdges.map(edge => {
                 const fromNode = nodes.find(n => n.id === edge.from);
                 const toNode = nodes.find(n => n.id === edge.to);
                 if (!fromNode || !toNode) return null;
                 return (
                   <React.Fragment key={edge.id}>
                     {renderBezier(
                        fromNode.x + 180, fromNode.y + 40,
                        toNode.x, toNode.y + 40,
                        !!edge.isCritical
                     )}
                   </React.Fragment>
                 );
               })}
               {/* Connection Draft Line */}
               {connectionDraft && (
                 <path 
                   d={`M ${nodes.find(n => n.id === connectionDraft.startId)!.x + 180} ${nodes.find(n => n.id === connectionDraft.startId)!.y + 40} L ${connectionDraft.x} ${connectionDraft.y}`}
                   stroke="#6366f1"
                   strokeWidth="2"
                   strokeDasharray="5,5"
                   fill="none"
                   className="animate-pulse"
                 />
               )}
            </svg>

            {/* HTML Layer for Nodes */}
            {nodes.map(node => (
              <div
                key={node.id}
                style={{
                  transform: `translate(${node.x}px, ${node.y}px)`,
                  width: '180px',
                  height: '80px'
                }}
                onDoubleClick={() => onTaskClick && onTaskClick(node.id)}
                className={`absolute bg-slate-800 rounded-lg shadow-lg flex flex-col transition-shadow hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] border-l-4 group ${
                   node.data.status === 'completed' ? 'border-emerald-500' :
                   node.data.status === 'in-progress' ? 'border-indigo-500' :
                   node.data.status === 'failed' ? 'border-red-500' : 'border-slate-500'
                } ${isDraggingNode === node.id ? 'z-50 cursor-grabbing' : 'z-10 cursor-grab'}`}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                tabIndex={0}
                role="button"
                aria-label={`Task ${node.id}: ${node.data.title}`}
              >
                 {/* Header */}
                 <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700 bg-slate-800/50 rounded-t-lg">
                    <span className="font-mono text-[10px] text-slate-400 font-bold">{node.id}</span>
                    {node.data.priority === 'high' && <div className="w-1.5 h-1.5 rounded-full bg-red-500" title="High Priority" />}
                 </div>
                 
                 {/* Body */}
                 <div className="p-3 text-xs font-medium text-slate-200 line-clamp-2 leading-snug">
                    {node.data.title}
                 </div>

                 {/* Blocked Indicator */}
                 {node.data.status === 'failed' && (
                   <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md">
                      <AlertCircleIcon size={12} />
                   </div>
                 )}

                 {/* Ports */}
                 {/* Input Port (Left) */}
                 <div 
                   className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-slate-600 rounded-full border border-slate-900 hover:bg-indigo-500 hover:scale-125 transition-all cursor-crosshair z-20"
                   onMouseUp={(e) => handleInputPortMouseUp(e, node.id)}
                   title="Input (Dependency)"
                 />
                 
                 {/* Output Port (Right) */}
                 <div 
                   className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-slate-600 rounded-full border border-slate-900 hover:bg-indigo-500 hover:scale-125 transition-all cursor-crosshair z-20"
                   onMouseDown={(e) => handlePortMouseDown(e, node.id)}
                   title="Output (Blocker)"
                 />
              </div>
            ))}
         </div>
      </div>
      
      {/* Mini-Map / Footer Hint */}
      <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur border border-slate-800 p-2 rounded text-[10px] text-slate-500 font-mono pointer-events-none select-none">
          <div className="flex items-center space-x-3">
             <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-indigo-500 mr-1.5"/> In Progress</span>
             <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"/> Done</span>
             <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-slate-500 mr-1.5"/> Pending</span>
          </div>
          <div className="mt-1 text-right opacity-60">Space+Drag to Pan</div>
      </div>
    </div>
  );
};

export default DependencyGraph;
