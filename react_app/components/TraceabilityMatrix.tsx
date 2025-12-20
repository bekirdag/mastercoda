
import React, { useState, useMemo } from 'react';
import { TraceNode, TraceEdge, TraceNodeType } from '../types';
import { MOCK_TRACE_NODES, MOCK_TRACE_EDGES } from '../constants';
import Button from './Button';
import Badge from './Badge';
import LineageGraph from './LineageGraph';
import TraceabilityImpactPanel from './TraceabilityImpactPanel';
import { 
  GitBranchIcon, 
  SearchIcon, 
  ActivityIcon, 
  SettingsIcon, 
  ShieldIcon, 
  ChevronDownIcon, 
  RotateCwIcon, 
  CheckCircleIcon,
  AlertTriangleIcon,
  FilterIcon,
  CodeIcon,
  GridIcon,
  XIcon,
  SparklesIcon,
  LockIcon
} from './Icons';
import { GoogleGenAI } from "@google/genai";

const TraceabilityMatrix: React.FC = () => {
  const [nodes, setNodes] = useState<TraceNode[]>(MOCK_TRACE_NODES);
  const [edges, setEdges] = useState<TraceEdge[]>(MOCK_TRACE_EDGES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'graph' | 'matrix'>('graph');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);

  const selectedNode = useMemo(() => nodes.find(n => n.id === selectedId), [nodes, selectedId]);

  const handleAudit = async () => {
    setIsAuditing(true);
    setAuditResult(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Audit this traceability matrix for gaps or orphans: ${JSON.stringify({ nodes, edges })}. Highlight any RFP requirement without a direct path to an SDS implementation. Return 3 bullet points of high-density engineering audit notes.`
      });
      setAuditResult(response.text || "Audit complete. No high-priority gaps found.");
    } catch (e) {
      console.error(e);
      setAuditResult("Error connecting to Audit Engine.");
    }
    setIsAuditing(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#020617] text-slate-200 overflow-hidden font-sans relative">
      
      {/* 1. Matrix Control Toolbar */}
      <header className="h-[64px] border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 flex items-center justify-between px-8 z-30 sticky top-0 shadow-lg">
         <div className="flex items-center space-x-8">
            <div className="flex items-center">
               <GitBranchIcon className="mr-3 text-indigo-400 rotate-90" size={24} />
               <div>
                  <h1 className="text-sm font-bold text-white uppercase tracking-widest leading-none">Logic Lineage</h1>
                  <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">TRACEABILITY_MATRIX_v4.2</p>
               </div>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            {/* View Switcher */}
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
               <button 
                  onClick={() => setViewMode('graph')}
                  className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-all ${
                     viewMode === 'graph' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
               >Graph</button>
               <button 
                  onClick={() => setViewMode('matrix')}
                  className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-all ${
                     viewMode === 'matrix' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
               >Matrix</button>
            </div>

            <div className="relative group">
               <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-all" />
               <input 
                  type="text" 
                  placeholder="Filter nodes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:border-indigo-500 outline-none w-48 transition-all"
               />
            </div>
         </div>

         <div className="flex items-center space-x-3">
            <button 
               onClick={handleAudit}
               disabled={isAuditing}
               className={`flex items-center px-4 py-2 rounded-xl border font-bold text-[10px] uppercase tracking-widest transition-all ${
                  isAuditing 
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 animate-pulse' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white shadow-xl'
               }`}
            >
               {isAuditing ? <RotateCwIcon size={14} className="animate-spin mr-2" /> : <ShieldIcon size={14} className="mr-2" />}
               Analyze Gaps
            </button>
            <Button variant="primary" size="sm" icon={<ActivityIcon size={14} />}>Sync Registry</Button>
         </div>
      </header>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* LEFT/CENTER: The Visualization */}
         <main className="flex-1 relative overflow-hidden bg-[#020617]">
            {viewMode === 'graph' ? (
               <LineageGraph 
                  nodes={nodes} 
                  edges={edges} 
                  selectedId={selectedId} 
                  onNodeSelect={setSelectedId}
                  searchQuery={searchQuery}
               />
            ) : (
               <div className="flex-1 h-full overflow-auto p-8 animate-in fade-in duration-500">
                  <div className="max-w-6xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="bg-slate-950/80 border-b border-slate-700 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                              <th className="px-6 py-4">Fulfillment Level</th>
                              <th className="px-6 py-4">ID</th>
                              <th className="px-6 py-4">Title</th>
                              <th className="px-6 py-4">Source Ver.</th>
                              <th className="px-6 py-4 text-right">Coverage Status</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                           {nodes.filter(n => n.type === 'rfp').map(node => (
                              <tr key={node.id} className="group hover:bg-slate-800 transition-colors">
                                 <td className="px-6 py-4">
                                    <span className="bg-indigo-600/10 text-indigo-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">RFP (Source)</span>
                                 </td>
                                 <td className="px-6 py-4 font-mono text-xs text-slate-400">{node.id}</td>
                                 <td className="px-6 py-4 text-sm font-bold text-white">{node.title}</td>
                                 <td className="px-6 py-4 font-mono text-xs text-slate-600">{node.version}</td>
                                 <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                       {node.status === 'synced' ? (
                                          <div className="flex items-center text-emerald-500 text-[10px] font-bold uppercase tracking-tighter">
                                             <CheckCircleIcon size={12} className="mr-1.5" /> Covered
                                          </div>
                                       ) : (
                                          <div className="flex items-center text-amber-500 text-[10px] font-bold uppercase tracking-tighter">
                                             <AlertTriangleIcon size={12} className="mr-1.5" /> Partial
                                          </div>
                                       )}
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {/* Gap Detected Warning Banner */}
            {nodes.some(n => n.status === 'orphaned') && (
               <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 bg-red-600/90 backdrop-blur border border-red-400/50 text-white px-6 py-2.5 rounded-full shadow-2xl flex items-center space-x-4 animate-in slide-in-from-top-4">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest">Logic Gap Detected: Orphaned RFP Requirements</span>
                  <div className="h-4 w-px bg-red-400/50" />
                  <button className="text-[10px] font-bold underline hover:text-red-100 uppercase">View Report</button>
               </div>
            )}

            {/* Mini-map / Context Overlay */}
            <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur border border-slate-800 p-4 rounded-2xl shadow-2xl space-y-3 text-[10px] font-mono text-slate-500 pointer-events-none select-none z-20">
               <div className="flex flex-col space-y-2">
                  <div className="flex items-center"><div className="w-3 h-3 bg-indigo-500 mr-2 rounded-sm" /> BUSINESS GOAL (RFP)</div>
                  <div className="flex items-center"><div className="w-3 h-3 bg-emerald-500 mr-2" style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }} /> ARCHITECTURE (PDR)</div>
                  <div className="flex items-center"><div className="w-3 h-3 bg-amber-500 mr-2 rounded-full" /> IMPLEMENTATION (SDS)</div>
               </div>
               <div className="pt-2 border-t border-slate-800 opacity-50 uppercase tracking-widest text-[9px]">
                  Double click node to open document
               </div>
            </div>
         </main>

         {/* RIGHT: Impact Panel / Auditor */}
         <TraceabilityImpactPanel 
            node={selectedNode} 
            edges={edges}
            nodes={nodes}
            auditResult={auditResult}
            onClose={() => setSelectedId(null)}
         />

      </div>

      {/* 3. Global Status Bar Footer */}
      <footer className="h-10 bg-slate-900 border-t border-slate-800 shrink-0 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-40 relative">
         <div className="flex items-center space-x-12">
            <div className="flex items-center">
               <ActivityIcon size={12} className="mr-2 text-indigo-400" />
               TRACED_PATH: <span className="ml-2 text-indigo-300">100% VERIFIED</span>
            </div>
            <div className="flex items-center">
               <ShieldIcon size={12} className="mr-2 text-indigo-400" />
               ENFORCE_VALIDATION: <span className="ml-2 text-emerald-500">ACTIVE</span>
            </div>
         </div>
         <div className="flex items-center space-x-6">
            <span className="text-slate-700 font-mono">NODE_HASH: LIN_TRACE_84X</span>
            <div className="h-3 w-px bg-slate-800" />
            <div className="flex items-center text-indigo-400">
               <LockIcon size={12} className="mr-2" />
               SECURE_GRAPH
            </div>
         </div>
      </footer>

    </div>
  );
};

export default TraceabilityMatrix;
