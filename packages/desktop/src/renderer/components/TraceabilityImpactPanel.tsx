
import React from 'react';
import { TraceNode, TraceEdge } from '../types';
import Button from './Button';
import Badge from './Badge';
import { 
  XIcon, 
  ArrowRightIcon, 
  RotateCwIcon, 
  ShieldIcon, 
  CheckCircleIcon, 
  AlertTriangleIcon, 
  SparklesIcon, 
  FileTextIcon, 
  ActivityIcon,
  HardDriveIcon,
  LockIcon
} from './Icons';

interface TraceabilityImpactPanelProps {
  node: TraceNode | undefined;
  nodes: TraceNode[];
  edges: TraceEdge[];
  auditResult: string | null;
  onClose: () => void;
}

const TraceabilityImpactPanel: React.FC<TraceabilityImpactPanelProps> = ({ node, nodes, edges, auditResult, onClose }) => {
  const isPanelOpen = !!node || !!auditResult;

  const lineage = React.useMemo(() => {
    if (!node) return null;
    const parents = edges.filter(e => e.target === node.id).map(e => nodes.find(n => n.id === e.source));
    const children = edges.filter(e => e.source === node.id).map(e => nodes.find(n => n.id === e.target));
    return { parents, children };
  }, [node, edges, nodes]);

  if (!isPanelOpen) return null;

  return (
    <aside className="w-[400px] border-l border-slate-800 bg-slate-900 flex flex-col shrink-0 z-40 animate-in slide-in-from-right-full duration-300">
       <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 bg-slate-950/50 backdrop-blur">
          <div className="flex items-center space-x-3">
             <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-indigo-400">
                {auditResult && !node ? <ShieldIcon size={20} /> : <ActivityIcon size={20} />}
             </div>
             <div>
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                    {auditResult && !node ? 'Traceability Audit' : 'Node Inspector'}
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">
                    {node ? `ID: ${node.id}` : 'Global Diagnostics'}
                </span>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
             <XIcon size={20} />
          </button>
       </header>

       <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">
          
          {auditResult && !node && (
             <section className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center text-indigo-400 text-xs font-bold uppercase tracking-widest">
                   <SparklesIcon size={14} className="mr-2 animate-pulse" />
                   AI Audit Analysis
                </div>
                <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-2xl p-6 shadow-inner">
                   <p className="text-sm text-indigo-100/90 leading-relaxed whitespace-pre-wrap italic">
                      "{auditResult}"
                   </p>
                </div>
                <div className="space-y-3">
                   <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Action Required</h4>
                   <Button variant="primary" className="w-full" icon={<RotateCwIcon size={16}/>}>Auto-link Orphans</Button>
                   <Button variant="secondary" className="w-full">Regenerate Gap Reports</Button>
                </div>
             </section>
          )}

          {node && (
             <section className="space-y-8 animate-in fade-in duration-300">
                {/* Status Alert */}
                {node.status !== 'synced' && (
                   <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 flex items-start space-x-3">
                      <AlertTriangleIcon size={18} className="text-amber-500 mt-0.5 shrink-0 animate-pulse" />
                      <div className="text-xs text-amber-200/80 leading-relaxed">
                         <strong>{node.status.toUpperCase()} Detected:</strong> This item is out of sync with its parent requirements. Upstream changes in RFP v2.0 are not reflected here.
                      </div>
                   </div>
                )}

                {/* Info Block */}
                <div className="space-y-2">
                   <h2 className="text-xl font-bold text-white">{node.title}</h2>
                   <p className="text-xs text-slate-400 leading-relaxed">{node.description}</p>
                   <div className="pt-2 flex items-center space-x-4">
                      <Badge variant="neutral">TYPE: {node.type.toUpperCase()}</Badge>
                      <Badge variant="info">VER: {node.version}</Badge>
                   </div>
                </div>

                {/* Lineage Analysis */}
                <div className="space-y-6 pt-4 border-t border-slate-800">
                   {/* Parents */}
                   <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                         <ArrowRightIcon size={12} className="mr-2 rotate-180 text-indigo-400" />
                         Ancestry (Parent Requirements)
                      </h4>
                      {lineage?.parents.length ? lineage.parents.map(p => (
                         <div key={p?.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                            <span className="text-xs font-bold text-slate-300 truncate">{p?.title}</span>
                            <span className="text-[10px] font-mono text-slate-600 uppercase">{p?.id}</span>
                         </div>
                      )) : (
                         <div className="text-xs text-red-400 italic bg-red-950/10 p-3 rounded-xl border border-red-900/20">
                            No parent found. This is an orphan requirement.
                         </div>
                      )}
                   </div>

                   {/* Children */}
                   <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                         <ArrowRightIcon size={12} className="mr-2 text-indigo-400" />
                         Downstream Impact
                      </h4>
                      {lineage?.children.length ? lineage.children.map(c => (
                         <div key={c?.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                            <span className="text-xs font-bold text-slate-300 truncate">{c?.title}</span>
                            <span className="text-[10px] font-mono text-slate-600 uppercase">{c?.id}</span>
                         </div>
                      )) : (
                         <div className="text-xs text-slate-600 italic border border-dashed border-slate-800 p-3 rounded-xl">
                            No child implementation plan detected yet.
                         </div>
                      )}
                   </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-6 border-t border-slate-800">
                   <Button variant="primary" className="w-full justify-center shadow-lg shadow-indigo-900/30" icon={<SparklesIcon size={16}/>}>Regenerate Child Specs</Button>
                   <Button variant="secondary" className="w-full justify-center" icon={<FileTextIcon size={16}/>}>Open Source Markdown</Button>
                </div>
             </section>
          )}

       </div>

       <footer className="p-6 border-t border-slate-800 bg-slate-950/50 space-y-4 shrink-0">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase">
             <span>Registry Sync: OK</span>
             <div className="flex items-center">
                <RotateCwIcon size={10} className="mr-1.5" /> REFRESH
             </div>
          </div>
       </footer>
    </aside>
  );
};

export default TraceabilityImpactPanel;
