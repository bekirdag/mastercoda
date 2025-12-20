import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  SparklesIcon, 
  RotateCwIcon, 
  ArrowRightIcon,
  ChevronDownIcon
} from './Icons';

interface MergeEditorProps {
  content: string;
  onResolve: (newContent: string) => void;
  fileName: string;
}

type ChunkType = 'text' | 'conflict';

interface Chunk {
  id: string;
  type: ChunkType;
  text?: string; // For normal text
  current?: string; // For conflict: HEAD
  incoming?: string; // For conflict: Incoming
  resolved?: string; // If resolved, this content
  status?: 'unresolved' | 'resolved';
}

const MergeEditor: React.FC<MergeEditorProps> = ({ content, onResolve, fileName }) => {
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [activeChunkId, setActiveChunkId] = useState<string | null>(null);
  const [resolvingId, setResolvingId] = useState<string | null>(null); // For AI loading state

  // Parse Raw Content into Chunks on Mount
  useEffect(() => {
    const lines = content.split('\n');
    const parsedChunks: Chunk[] = [];
    
    let currentBlock: string[] = [];
    let conflictStart = false;
    let conflictSeparator = false;
    let currentContent: string[] = [];
    let incomingContent: string[] = [];
    
    lines.forEach((line, index) => {
      if (line.startsWith('<<<<<<<')) {
        // End previous text block if exists
        if (currentBlock.length > 0) {
          parsedChunks.push({
            id: `text-${index}`,
            type: 'text',
            text: currentBlock.join('\n')
          });
          currentBlock = [];
        }
        conflictStart = true;
      } else if (line.startsWith('=======')) {
        conflictSeparator = true;
      } else if (line.startsWith('>>>>>>>')) {
        // End conflict block
        parsedChunks.push({
          id: `conflict-${index}`,
          type: 'conflict',
          current: currentContent.join('\n'),
          incoming: incomingContent.join('\n'),
          status: 'unresolved'
        });
        
        // Reset state
        conflictStart = false;
        conflictSeparator = false;
        currentContent = [];
        incomingContent = [];
      } else {
        // Content lines
        if (conflictStart) {
          if (!conflictSeparator) {
            currentContent.push(line);
          } else {
            incomingContent.push(line);
          }
        } else {
          currentBlock.push(line);
        }
      }
    });

    // Flush remaining
    if (currentBlock.length > 0) {
        parsedChunks.push({
          id: `text-end`,
          type: 'text',
          text: currentBlock.join('\n')
        });
    }

    setChunks(parsedChunks);
  }, [content]);

  // Actions
  const handleAction = (id: string, action: 'current' | 'incoming' | 'both' | 'ai') => {
    if (action === 'ai') {
        setResolvingId(id);
        // Simulate AI delay
        setTimeout(() => {
            setChunks(prev => prev.map(c => {
                if (c.id === id) {
                    // Smart merge simulation: concatenate nicely
                    return { ...c, status: 'resolved', resolved: `${c.current}\n// AI Merged\n${c.incoming}` };
                }
                return c;
            }));
            setResolvingId(null);
        }, 1500);
        return;
    }

    setChunks(prev => prev.map(c => {
        if (c.id === id) {
            let resolvedText = '';
            if (action === 'current') resolvedText = c.current || '';
            if (action === 'incoming') resolvedText = c.incoming || '';
            if (action === 'both') resolvedText = `${c.current}\n${c.incoming}`;
            
            return { ...c, status: 'resolved', resolved: resolvedText };
        }
        return c;
    }));
  };

  const handleUndo = (id: string) => {
    setChunks(prev => prev.map(c => {
        if (c.id === id) return { ...c, status: 'unresolved', resolved: undefined };
        return c;
    }));
  };

  // Reconstruct full file
  useEffect(() => {
    const fullContent = chunks.map(c => {
        if (c.type === 'text') return c.text;
        if (c.type === 'conflict' && c.status === 'resolved') return c.resolved;
        // If unresolved, we technically shouldn't save, but for live preview logic:
        return `<<<<<<< HEAD\n${c.current}\n=======\n${c.incoming}\n>>>>>>> INCOMING`;
    }).join('\n');
    
    // In a real app, we'd debounce this or only trigger on "Save"
    // onResolve(fullContent); 
  }, [chunks, onResolve]);

  return (
    <div className="flex flex-col h-full bg-[#0f172a] overflow-hidden">
        {/* Editor Toolbar */}
        <div className="h-10 bg-slate-800 border-b border-slate-700 flex items-center px-4 justify-between shrink-0">
            <div className="text-xs font-mono text-slate-400">{fileName}</div>
            <div className="text-xs text-slate-500">
                {chunks.filter(c => c.type === 'conflict' && c.status === 'unresolved').length} conflicts remaining
            </div>
        </div>

        {/* Scrolling Canvas */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
            {chunks.map((chunk) => {
                if (chunk.type === 'text') {
                    return (
                        <div key={chunk.id} className="font-mono text-xs text-slate-400 whitespace-pre px-4 py-1 opacity-70 hover:opacity-100 transition-opacity">
                            {chunk.text}
                        </div>
                    );
                }

                if (chunk.status === 'resolved') {
                    return (
                        <div key={chunk.id} className="group relative font-mono text-xs text-slate-200 whitespace-pre bg-slate-800/30 border-l-4 border-slate-600 pl-4 pr-2 py-2 my-2 rounded-r animate-in fade-in duration-300">
                            {chunk.resolved}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                                <span className="text-[10px] text-slate-500 uppercase font-bold">Resolved</span>
                                <button 
                                    onClick={() => handleUndo(chunk.id)} 
                                    className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                                    title="Undo Resolution"
                                >
                                    <RotateCwIcon size={12} />
                                </button>
                            </div>
                        </div>
                    );
                }

                // Unresolved Conflict Block
                return (
                    <div key={chunk.id} className="my-6 border-2 border-amber-500/30 rounded-lg overflow-hidden shadow-lg animate-in zoom-in-95 duration-200">
                        
                        {/* Conflict Toolbar */}
                        <div className="bg-slate-800 border-b border-slate-700 p-2 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center px-2">
                                Conflict Block
                            </span>
                            <div className="flex items-center space-x-2">
                                <button 
                                    onClick={() => handleAction(chunk.id, 'both')}
                                    className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-[10px] text-slate-300 transition-colors"
                                >
                                    Accept Both
                                </button>
                                <button 
                                    onClick={() => handleAction(chunk.id, 'ai')}
                                    disabled={resolvingId === chunk.id}
                                    className="px-2 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 text-[10px] flex items-center transition-colors"
                                >
                                    {resolvingId === chunk.id ? (
                                        <RotateCwIcon size={10} className="animate-spin mr-1" />
                                    ) : (
                                        <SparklesIcon size={10} className="mr-1" />
                                    )}
                                    AI Resolve
                                </button>
                            </div>
                        </div>

                        {/* Split View */}
                        <div className="flex divide-x divide-slate-700">
                            
                            {/* Left Pane: Current */}
                            <div className="flex-1 flex flex-col min-w-0">
                                <div className="bg-emerald-900/20 border-b border-emerald-900/30 px-3 py-1.5 flex justify-between items-center">
                                    <span className="text-[10px] text-emerald-400 font-bold">Current Change (HEAD)</span>
                                    <button 
                                        onClick={() => handleAction(chunk.id, 'current')}
                                        className="opacity-60 hover:opacity-100 hover:bg-emerald-900/40 p-1 rounded transition-all"
                                    >
                                        <CheckCircleIcon size={14} className="text-emerald-500" />
                                    </button>
                                </div>
                                <div className="p-3 font-mono text-xs text-emerald-100/80 whitespace-pre overflow-x-auto bg-emerald-900/5 h-full">
                                    {chunk.current}
                                </div>
                            </div>

                            {/* Right Pane: Incoming */}
                            <div className="flex-1 flex flex-col min-w-0">
                                <div className="bg-blue-900/20 border-b border-blue-900/30 px-3 py-1.5 flex justify-between items-center">
                                    <span className="text-[10px] text-blue-400 font-bold">Incoming Change</span>
                                    <button 
                                        onClick={() => handleAction(chunk.id, 'incoming')}
                                        className="opacity-60 hover:opacity-100 hover:bg-blue-900/40 p-1 rounded transition-all"
                                    >
                                        <CheckCircleIcon size={14} className="text-blue-500" />
                                    </button>
                                </div>
                                <div className="p-3 font-mono text-xs text-blue-100/80 whitespace-pre overflow-x-auto bg-blue-900/5 h-full">
                                    {chunk.incoming}
                                </div>
                            </div>

                        </div>
                    </div>
                );
            })}
            
            <div className="h-20" /> {/* Bottom spacer */}
        </div>
    </div>
  );
};

export default MergeEditor;
