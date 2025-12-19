
import React, { useState, useMemo } from 'react';
import { RagCollection, RagChunk, ClusterPoint } from '../types';
import { MOCK_RAG_COLLECTIONS, MOCK_RAG_CHUNKS, MOCK_CLUSTER_DATA } from '../constants';
import Button from './Button';
import Badge from './Badge';
// Added SettingsIcon to imports to fix the error on line 277.
import { 
  DatabaseIcon, 
  SearchIcon, 
  ActivityIcon, 
  ChevronRightIcon, 
  PlusIcon, 
  SparklesIcon, 
  RotateCwIcon, 
  ShieldIcon, 
  HardDriveIcon, 
  ZapIcon, 
  TerminalIcon, 
  CodeIcon, 
  ArrowRightIcon, 
  ClockIcon, 
  LockIcon, 
  GlobeIcon, 
  FileTextIcon,
  HelpCircleIcon,
  SettingsIcon
} from './Icons';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GoogleGenAI } from "@google/genai";

const KnowledgeManager: React.FC = () => {
  const [collections, setCollections] = useState<RagCollection[]>(MOCK_RAG_COLLECTIONS);
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_RAG_COLLECTIONS[0].id);
  const [retrievalQuery, setRetrievalQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<RagChunk[]>(MOCK_RAG_CHUNKS);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  // Config State
  const [chunkSize, setChunkSize] = useState(512);
  const [overlap, setOverlap] = useState(50);
  const [embeddingModel, setEmbeddingModel] = useState('text-embedding-3-small');

  const activeCollection = useMemo(() => collections.find(c => c.id === selectedId), [collections, selectedId]);

  const handleTestRetrieval = async () => {
    if (!retrievalQuery.trim()) return;
    setIsSearching(true);
    setResults([]);
    setAiInsight(null);

    // Simulate RAG Search Latency
    await new Promise(r => setTimeout(r, 1200));

    // Simulation of result shuffle
    const newResults = [...MOCK_RAG_CHUNKS].sort(() => Math.random() - 0.5);
    setResults(newResults);
    setIsSearching(false);

    // Use Gemini for diagnostics if result score is low
    if (newResults[0].score < 0.8) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const diag = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Query: "${retrievalQuery}". Top result score: ${newResults[0].score}. Why might retrieval be failing? Provide one high-density insight for an AI engineer.`
        });
        setAiInsight(diag.text || null);
      } catch (e) { console.error(e); }
    }
  };

  const stats = {
    totalVectors: "1.2 Million",
    storageUsed: "450 MB",
    syncStatus: "Nominal",
    lastSync: "2 mins ago"
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Ingestion Metrics HUD */}
      <header className="shrink-0 p-6 border-b border-slate-800 bg-slate-900/50">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-12">
               <div className="flex items-center">
                  <DatabaseIcon className="mr-3 text-indigo-400" size={24} />
                  <div>
                     <h1 className="text-sm font-bold text-white uppercase tracking-widest leading-none">RAG Control Plane</h1>
                     <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">DISTRIBUTED_VECTOR_V4.2</p>
                  </div>
               </div>
               <div className="flex items-center space-x-8">
                  <StatItem label="Total Vectors" value={stats.totalVectors} icon={<ActivityIcon size={14} className="text-blue-400" />} />
                  <StatItem label="Index Storage" value={stats.storageUsed} icon={<HardDriveIcon size={14} className="text-emerald-400" />} />
                  <StatItem label="Sync Engine" value={stats.syncStatus} icon={<RotateCwIcon size={14} className="text-amber-400" />} />
               </div>
            </div>
            <div className="flex items-center space-x-3">
               <Button variant="secondary" size="sm" icon={<PlusIcon size={14} />}>Add Source</Button>
               <Button variant="primary" size="sm" icon={<RotateCwIcon size={14} />}>Re-Index All</Button>
            </div>
         </div>
      </header>

      {/* 2. Main content Split Area */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* LEFT: Collections Library */}
         <aside className="w-[300px] border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Collections</span>
               <Badge variant="info">{collections.length}</Badge>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
               {collections.map(col => (
                  <button
                     key={col.id}
                     onClick={() => setSelectedId(col.id)}
                     className={`w-full flex items-center p-3 rounded-xl border transition-all text-left group ${
                        selectedId === col.id 
                           ? 'bg-indigo-600/10 border-indigo-500/30 shadow-lg' 
                           : 'bg-transparent border-transparent hover:bg-slate-800/50'
                     }`}
                  >
                     <div className={`p-2 rounded-lg mr-3 ${selectedId === col.id ? 'bg-indigo-600/10 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                        {col.type === 'git' ? <CodeIcon size={18}/> : col.type === 'pdf' ? <FileTextIcon size={18}/> : <GlobeIcon size={18}/>}
                     </div>
                     <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate uppercase">{col.name}</div>
                        <div className="flex items-center text-[9px] text-slate-500 font-mono mt-0.5 space-x-2">
                           <span className={col.status === 'indexing' ? 'text-indigo-400 animate-pulse' : ''}>{col.status.toUpperCase()}</span>
                           <span>•</span>
                           <span>{Math.round(col.vectorCount / 1000)}k VECS</span>
                        </div>
                     </div>
                     <ChevronRightIcon size={14} className={`text-slate-700 transition-opacity ${selectedId === col.id ? 'opacity-100' : 'opacity-0'}`} />
                  </button>
               ))}
            </div>
         </aside>

         {/* CENTER: Retrieval Playground & Cluster Viz */}
         <main className="flex-1 flex flex-col bg-[#0d1117] overflow-hidden">
            
            {/* Search Top Strip */}
            <div className="p-6 bg-slate-900/50 border-b border-slate-800">
               <div className="relative group max-w-2xl">
                  <div className="absolute -inset-0.5 bg-indigo-500/20 rounded-xl blur opacity-25 group-focus-within:opacity-100 transition duration-500" />
                  <div className="relative flex items-center bg-slate-950 border border-slate-700 rounded-xl overflow-hidden p-1">
                     <SearchIcon className="ml-3 text-slate-500" size={18} />
                     <input 
                        type="text" 
                        placeholder="Test retrieval accuracy (e.g. 'How is auth handled?')"
                        value={retrievalQuery}
                        onChange={(e) => setRetrievalQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleTestRetrieval()}
                        className="flex-1 bg-transparent border-none text-sm text-white placeholder-slate-600 focus:ring-0 px-3 py-2.5 font-mono"
                     />
                     <button 
                        onClick={handleTestRetrieval}
                        disabled={!retrievalQuery.trim() || isSearching}
                        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-lg"
                     >
                        {isSearching ? <RotateCwIcon size={14} className="animate-spin" /> : 'Retrieve'}
                     </button>
                  </div>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
               
               {/* 2D Cluster Visualizer Section */}
               <section className="h-[300px] border-b border-slate-800 bg-[#0a0f1e] relative p-6">
                  <div className="absolute top-4 left-6 z-10 flex items-center space-x-2">
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center">
                        <ActivityIcon size={12} className="mr-2 text-indigo-400" />
                        Semantic Space Topology (TSNE Projection)
                     </span>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                     <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <XAxis type="number" dataKey="x" hide />
                        <YAxis type="number" dataKey="y" hide />
                        <ZAxis type="number" range={[50, 100]} />
                        <Tooltip 
                           cursor={{ strokeDasharray: '3 3' }} 
                           contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                           content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                 const data = payload[0].payload;
                                 return (
                                    <div className="p-3 shadow-2xl">
                                       <div className="text-[9px] font-bold text-indigo-400 uppercase mb-1">{data.group} Cluster</div>
                                       <p className="text-xs text-white font-medium">{data.label}</p>
                                    </div>
                                 );
                              }
                              return null;
                           }}
                        />
                        <Scatter name="Chunks" data={MOCK_CLUSTER_DATA} fill="#6366f1">
                           {MOCK_CLUSTER_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.group === 'Auth' ? '#6366f1' : entry.group === 'UI' ? '#ec4899' : '#10b981'} opacity={0.6} />
                           ))}
                        </Scatter>
                     </ScatterChart>
                  </ResponsiveContainer>
               </section>

               {/* Result Chunks List */}
               <section className="flex-1 p-8 space-y-6">
                  <div className="flex items-center justify-between">
                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Candidate Chunks Found</h3>
                     <div className="flex items-center space-x-4 text-[10px] font-mono text-slate-600">
                        <span>SEARCH_K: 5</span>
                        <span>|</span>
                        <span>LATENCY: 142ms</span>
                     </div>
                  </div>

                  {results.length === 0 && !isSearching && (
                     <div className="py-20 flex flex-col items-center justify-center opacity-30 text-center">
                        <ZapIcon size={48} className="mb-4" />
                        <p className="text-sm font-medium">No retrieval tests performed yet.</p>
                     </div>
                  )}

                  <div className="space-y-4">
                     {results.map(chunk => (
                        <div key={chunk.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/40 transition-all group animate-in slide-in-from-bottom-2">
                           <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                 <div className="w-10 h-6 rounded bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                                    {(chunk.score * 100).toFixed(0)}%
                                 </div>
                                 <div className="min-w-0">
                                    <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{chunk.source}</span>
                                    <span className="text-[10px] text-slate-600 font-mono ml-2">INDEX: {chunk.index}</span>
                                 </div>
                              </div>
                              <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-800 rounded text-slate-500 transition-all">
                                 <ArrowRightIcon size={16} />
                              </button>
                           </div>
                           <p className="text-sm text-slate-400 leading-relaxed font-mono italic">
                              "{chunk.text}"
                           </p>
                        </div>
                     ))}
                  </div>

                  {/* AI Diagnostic Insight */}
                  {aiInsight && (
                     <div className="p-6 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl animate-in slide-in-from-bottom-4">
                        <div className="flex items-center text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                           <SparklesIcon size={14} className="mr-2 animate-pulse" />
                           Retrieval Diagnostic Audit
                        </div>
                        <p className="text-sm text-indigo-200/80 leading-relaxed">
                           {aiInsight}
                        </p>
                        <div className="mt-4 flex space-x-3">
                           <Button variant="primary" size="sm" className="bg-indigo-600 text-[10px]">Optimize Chunking</Button>
                           <Button variant="ghost" size="sm" className="text-[10px]">Re-Embed Segment</Button>
                        </div>
                     </div>
                  )}
               </section>
            </div>
         </main>

         {/* RIGHT: Configuration Panel */}
         <aside className="w-[320px] border-l border-slate-800 bg-slate-900 flex flex-col shrink-0 z-20">
            <header className="h-[60px] border-b border-slate-800 px-6 flex items-center justify-between shrink-0 bg-slate-950/50">
               <div className="flex items-center">
                  <SettingsIcon size={16} className="mr-2 text-slate-500" />
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global RAG DNA</h3>
               </div>
               <button className="text-slate-600 hover:text-white transition-colors"><HelpCircleIcon size={16}/></button>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">
               {/* Embedding Model Selection */}
               <section className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Embedding Architecture</label>
                  <select 
                     value={embeddingModel}
                     onChange={(e) => setEmbeddingModel(e.target.value)}
                     className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-indigo-300 font-bold outline-none focus:border-indigo-500"
                  >
                     <option value="text-embedding-3-small">OpenAI Embed Small (v3)</option>
                     <option value="gemini-embedding-004">Gemini Native (v4)</option>
                     <option value="local-bert">Local BERT-L (Quantized)</option>
                     <option value="cohere-english-v3">Cohere Multilingual</option>
                  </select>
               </section>

               <div className="h-px bg-slate-800" />

               {/* Chunking Logic */}
               <section className="space-y-8">
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                        <span className="text-slate-500">Chunk Size (Tokens)</span>
                        <span className="text-indigo-400 font-mono">{chunkSize}</span>
                     </div>
                     <input 
                        type="range" min="128" max="2048" step="128" 
                        value={chunkSize}
                        onChange={(e) => setChunkSize(parseInt(e.target.value))}
                        className="w-full accent-indigo-500" 
                     />
                     <p className="text-[9px] text-slate-600 leading-relaxed italic">Large chunks preserve more context but increase noise during top-k retrieval.</p>
                  </div>

                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                        <span className="text-slate-500">Context Overlap</span>
                        <span className="text-indigo-400 font-mono">{overlap}</span>
                     </div>
                     <input 
                        type="range" min="0" max="256" step="10" 
                        value={overlap}
                        onChange={(e) => setOverlap(parseInt(e.target.value))}
                        className="w-full accent-indigo-500" 
                     />
                  </div>
               </section>

               <div className="h-px bg-slate-800" />

               {/* Advanced Guardrails */}
               <section className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Privacy Controls</h4>
                  <div className="space-y-3">
                     <ToggleItem label="Redact PII before embedding" checked />
                     <ToggleItem label="Enforce local-only vectors" />
                     <ToggleItem label="Auto-purge stale chunks" checked />
                  </div>
               </section>

               {/* Database Health Card */}
               <section className="bg-indigo-900/5 border border-indigo-500/10 rounded-2xl p-5 mt-auto">
                  <div className="flex items-center text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                     <ShieldIcon size={12} className="mr-2" />
                     Local Vector DB Health
                  </div>
                  <div className="space-y-3 font-mono text-[10px]">
                     <div className="flex justify-between border-b border-slate-800/50 pb-1.5">
                        <span className="text-slate-600">Engine:</span>
                        <span className="text-slate-300 uppercase">LanceDB (Serverless)</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-800/50 pb-1.5">
                        <span className="text-slate-600">Indexing:</span>
                        <span className="text-emerald-500">OPTIMIZED</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-slate-600">Total Size:</span>
                        <span className="text-slate-300">1.4 GB on disk</span>
                     </div>
                  </div>
               </section>
            </div>

            <footer className="p-6 border-t border-slate-800 bg-slate-950/50 shrink-0">
               <Button variant="primary" className="w-full shadow-lg shadow-indigo-500/20" icon={<RotateCwIcon size={16}/>}>Rebuild Vector Store</Button>
            </footer>
         </aside>

      </div>

      {/* 3. Global Status Bar (Footer) */}
      <footer className="h-10 bg-slate-900 border-t border-slate-800 shrink-0 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
         <div className="flex items-center space-x-12">
            <div className="flex items-center">
               <TerminalIcon size={12} className="mr-2 text-indigo-400" />
               RAG_STATUS: <span className="ml-2 text-emerald-500 uppercase">Synced</span>
            </div>
            <div className="flex items-center">
               <HardDriveIcon size={12} className="mr-2 text-indigo-400" />
               INDEX_STAMP: <span className="ml-2 text-slate-300 font-mono">HASH_B52X_9921</span>
            </div>
         </div>
         <div className="flex items-center space-x-6">
            <div className="flex items-center text-indigo-400">
               <LockIcon size={12} className="mr-2" />
               LOCAL_ENCLAVE_ONLY
            </div>
            <div className="h-3 w-px bg-slate-800" />
            <span className="text-slate-600">v4.2.1-stable</span>
         </div>
      </footer>
    </div>
  );
};

// Internal Sub-components

const StatItem: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
   <div className="flex flex-col">
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1 flex items-center">
         <span className="mr-1.5">{icon}</span>
         {label}
      </span>
      <span className="text-xs font-bold text-slate-200 font-mono">{value}</span>
   </div>
);

const ToggleItem: React.FC<{ label: string; checked?: boolean }> = ({ label, checked = false }) => {
   const [val, setVal] = useState(checked);
   return (
      <div 
         onClick={() => setVal(!val)}
         className="flex items-center justify-between group cursor-pointer"
      >
         <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">{label}</span>
         <div className={`w-8 h-4 rounded-full p-0.5 transition-all relative ${val ? 'bg-indigo-600' : 'bg-slate-800'}`}>
            <div className={`w-3 h-3 bg-white rounded-full transition-all ${val ? 'translate-x-4' : 'translate-x-0'}`} />
         </div>
      </div>
   );
};

export default KnowledgeManager;
