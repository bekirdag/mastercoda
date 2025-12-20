
import React, { useState, useEffect, useRef, useMemo } from 'react';
// Fix: Added missing Badge import
import Badge from './Badge';
import { TraceNode, TraceEdge, TraceNodeType } from '../types';

interface LineageGraphProps {
  nodes: TraceNode[];
  edges: TraceEdge[];
  selectedId: string | null;
  onNodeSelect: (id: string) => void;
  searchQuery: string;
}

const LineageGraph: React.FC<LineageGraphProps> = ({ nodes, edges, selectedId, onNodeSelect, searchQuery }) => {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.9 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Group nodes by column (RFP, PDR, SDS)
  const columns = {
    rfp: nodes.filter(n => n.type === 'rfp'),
    pdr: nodes.filter(n => n.type === 'pdr'),
    sds: nodes.filter(n => n.type === 'sds')
  };

  const getPathToRoot = (id: string, visited = new Set<string>()): Set<string> => {
     if (visited.has(id)) return visited;
     visited.add(id);
     const parentEdges = edges.filter(e => e.target === id);
     parentEdges.forEach(e => getPathToRoot(e.source, visited));
     return visited;
  };

  const getPathToLeaves = (id: string, visited = new Set<string>()): Set<string> => {
     if (visited.has(id)) return visited;
     visited.add(id);
     const childEdges = edges.filter(e => e.source === id);
     childEdges.forEach(e => getPathToLeaves(e.target, visited));
     return visited;
  };

  const highlightedNodes = useMemo(() => {
    const active = hoveredId || selectedId;
    if (!active) return null;
    const result = new Set<string>();
    getPathToRoot(active, result);
    getPathToLeaves(active, result);
    return result;
  }, [hoveredId, selectedId, edges]);

  // Layout Constants
  const COL_WIDTH = 350;
  const ROW_HEIGHT = 150;
  const X_OFFSET = 100;
  const Y_OFFSET = 100;

  const nodePositions = useMemo(() => {
    const pos: Record<string, { x: number, y: number }> = {};
    
    Object.entries(columns).forEach(([type, colNodes], colIdx) => {
        colNodes.forEach((node, rowIdx) => {
            pos[node.id] = {
                x: X_OFFSET + colIdx * COL_WIDTH,
                y: Y_OFFSET + rowIdx * ROW_HEIGHT
            };
        });
    });
    
    return pos;
  }, [nodes]);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        const delta = -e.deltaY * 0.001;
        setTransform(prev => ({ ...prev, scale: Math.min(Math.max(0.2, prev.scale + delta), 2) }));
    } else {
        setTransform(prev => ({ ...prev, x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
    }
  };

  return (
    <div 
      className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      onWheel={handleWheel}
      onMouseDown={(e) => {
          if (e.button !== 0) return;
          const startX = e.clientX;
          const startY = e.clientY;
          const startTx = transform.x;
          const startTy = transform.y;
          const onMove = (mv: MouseEvent) => {
              setTransform(prev => ({ ...prev, x: startTx + (mv.clientX - startX), y: startTy + (mv.clientY - startY) }));
          };
          const onUp = () => {
              window.removeEventListener('mousemove', onMove);
              window.removeEventListener('mouseup', onUp);
          };
          window.addEventListener('mousemove', onMove);
          window.addEventListener('mouseup', onUp);
      }}
    >
       <div 
          className="absolute inset-0 transition-transform duration-75"
          style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transformOrigin: '0 0' }}
       >
          {/* SVG Connector Layer */}
          <svg className="absolute inset-0 w-[5000px] h-[5000px] pointer-events-none overflow-visible">
             <defs>
                <marker id="arrow-trace" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                   <path d="M0,0 L8,4 L0,8 Z" fill="#475569" />
                </marker>
                <marker id="arrow-trace-active" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                   <path d="M0,0 L8,4 L0,8 Z" fill="#6366f1" />
                </marker>
             </defs>
             {edges.map(edge => {
                const start = nodePositions[edge.source];
                const end = nodePositions[edge.target];
                if (!start || !end) return null;

                const isActive = highlightedNodes?.has(edge.source) && highlightedNodes?.has(edge.target);
                const x1 = start.x + 220;
                const y1 = start.y + 40;
                const x2 = end.x;
                const y2 = end.y + 40;
                const dx = Math.abs(x2 - x1) * 0.5;

                return (
                   <path 
                      key={edge.id}
                      d={`M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`}
                      fill="none"
                      stroke={isActive ? '#6366f1' : '#334155'}
                      strokeWidth={isActive ? 3 : 1.5}
                      strokeDasharray={edge.status === 'broken' ? '5,5' : '0'}
                      markerEnd={isActive ? "url(#arrow-trace-active)" : "url(#arrow-trace)"}
                      className={`transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-40'}`}
                   />
                );
             })}
          </svg>

          {/* Node Layer */}
          {nodes.map(node => {
             const pos = nodePositions[node.id];
             const isActive = !highlightedNodes || highlightedNodes.has(node.id);
             const isSearchMatch = searchQuery && (node.title.toLowerCase().includes(searchQuery.toLowerCase()) || node.id.toLowerCase().includes(searchQuery.toLowerCase()));

             return (
                <div 
                   key={node.id}
                   onMouseEnter={() => setHoveredId(node.id)}
                   onMouseLeave={() => setHoveredId(null)}
                   onClick={() => onNodeSelect(node.id)}
                   className={`absolute w-[220px] p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 group shadow-lg ${
                      selectedId === node.id ? 'ring-4 ring-indigo-500/20 scale-105 z-30 border-indigo-500' : 'border-slate-800 bg-[#0f172a]/90 backdrop-blur'
                   } ${!isActive ? 'opacity-20 blur-[1px]' : 'opacity-100'} ${isSearchMatch ? 'ring-2 ring-amber-400 animate-pulse' : ''}`}
                   style={{ 
                      transform: `translate(${pos.x}px, ${pos.y}px)`,
                      clipPath: node.type === 'pdr' ? 'polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)' : 'none',
                      borderRadius: node.type === 'rfp' ? '12px' : node.type === 'sds' ? '999px' : '0px'
                   }}
                >
                   <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">{node.id}</span>
                         <Badge variant={node.status === 'synced' ? 'success' : node.status === 'orphaned' ? 'error' : 'warning'}>
                            {node.status.toUpperCase()}
                         </Badge>
                      </div>
                      <h3 className="text-xs font-bold text-white leading-snug group-hover:text-indigo-400 transition-colors">{node.title}</h3>
                      <div className="flex items-center justify-between pt-1">
                         <span className="text-[9px] font-mono text-slate-600">VER: {node.version}</span>
                         <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'synced' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                      </div>
                   </div>
                </div>
             );
          })}
       </div>
    </div>
  );
};

export default LineageGraph;
