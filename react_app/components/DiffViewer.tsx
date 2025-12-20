import React, { useMemo } from 'react';

interface DiffViewerProps {
  original: string;
  modified: string;
}

interface DiffLine {
  type: 'same' | 'added' | 'deleted' | 'padding';
  content: string;
  originalLineNumber?: number;
  modifiedLineNumber?: number;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ original, modified }) => {
  // Simple diff logic for demonstration purposes.
  // In a real app, use 'diff' library to generate structured hunks.
  // Here we do a naive line-by-line comparison or fallback to displaying side-by-side.
  
  const lines = useMemo(() => {
    const origLines = original.split('\n');
    const modLines = modified.split('\n');
    const maxLines = Math.max(origLines.length, modLines.length);
    
    const result: { left: DiffLine; right: DiffLine }[] = [];
    
    // Very naive diffing: just check equality index-wise.
    // If one side runs out, padding.
    // If different, mark as changed (red/green).
    // NOTE: This does not detect insertions/deletions accurately (shifting), 
    // but works for static mock data if aligned properly or for simple edits.
    
    for (let i = 0; i < maxLines; i++) {
      const leftContent = origLines[i];
      const rightContent = modLines[i];
      
      const left: DiffLine = { 
          type: 'same', 
          content: leftContent ?? '', 
          originalLineNumber: leftContent !== undefined ? i + 1 : undefined 
      };
      
      const right: DiffLine = { 
          type: 'same', 
          content: rightContent ?? '', 
          modifiedLineNumber: rightContent !== undefined ? i + 1 : undefined 
      };

      if (leftContent === undefined) {
         left.type = 'padding';
         right.type = 'added';
      } else if (rightContent === undefined) {
         right.type = 'padding';
         left.type = 'deleted';
      } else if (leftContent !== rightContent) {
         left.type = 'deleted';
         right.type = 'added';
      }

      result.push({ left, right });
    }
    
    return result;
  }, [original, modified]);

  return (
    <div className="flex-1 flex flex-col bg-[#0f1117] font-mono text-xs overflow-hidden">
      <div className="flex-1 flex overflow-auto custom-scrollbar">
         {/* Left Pane (Original) */}
         <div className="flex-1 border-r border-slate-800 bg-[#0d1117]">
             {lines.map((row, idx) => (
               <Line 
                 key={`l-${idx}`} 
                 line={row.left} 
                 side="left" 
               />
             ))}
         </div>

         {/* Right Pane (Modified) */}
         <div className="flex-1 bg-[#0d1117]">
             {lines.map((row, idx) => (
               <Line 
                 key={`r-${idx}`} 
                 line={row.right} 
                 side="right" 
               />
             ))}
         </div>
      </div>
    </div>
  );
};

const Line: React.FC<{ line: DiffLine; side: 'left' | 'right' }> = ({ line, side }) => {
  const isAdded = line.type === 'added';
  const isDeleted = line.type === 'deleted';
  const isPadding = line.type === 'padding';

  let bgClass = '';
  if (isAdded) bgClass = 'bg-emerald-900/20';
  if (isDeleted) bgClass = 'bg-red-900/20';
  if (isPadding) bgClass = 'bg-slate-900/50';

  const gutterNum = side === 'left' ? line.originalLineNumber : line.modifiedLineNumber;

  return (
    <div className={`flex items-stretch min-h-[1.5em] hover:bg-slate-800/30 group ${bgClass}`}>
      {/* Line Number */}
      <div className={`w-10 shrink-0 text-right pr-3 select-none text-slate-600 border-r border-slate-800/50 bg-[#0f1117] py-0.5 group-hover:text-slate-400 ${
         isAdded ? 'text-emerald-700' : isDeleted ? 'text-red-800' : ''
      }`}>
         {gutterNum}
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-0.5 whitespace-pre overflow-x-hidden relative">
         {isPadding ? (
            <div className="select-none bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] opacity-10 h-full w-full absolute inset-0" />
         ) : (
             <span className={`${
                 isAdded ? 'text-emerald-100' : 
                 isDeleted ? 'text-red-200 opacity-60' : 
                 'text-slate-300'
             }`}>
                {line.content || ' '}
             </span>
         )}
      </div>
    </div>
  );
};

export default DiffViewer;
