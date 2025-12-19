
import React, { useState, useMemo } from 'react';
import { Task, TaskType } from '../types';
import Badge from './Badge';
import { 
  CrownIcon, 
  BookmarkIcon, 
  CheckCircleIcon, 
  AlertCircleIcon, 
  ChevronRightIcon, 
  ChevronDownIcon,
  CornerDownRightIcon,
  UserIcon,
  ArrowUpIcon,
  PlayIcon
} from './Icons';

interface BacklogListProps {
  tasks: Task[];
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  onExecuteTask?: (taskId: string) => void;
  onTaskClick?: (taskId: string) => void;
}

interface TreeNode {
  data: Task;
  children: TreeNode[];
  depth: number;
}

const BacklogList: React.FC<BacklogListProps> = ({ tasks, selectedIds, onSelectionChange, onExecuteTask, onTaskClick }) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['MC-1000', 'MC-1002'])); // Default expand top epics for demo

  // --- Hierarchy Builders ---
  const treeData = useMemo(() => {
    const nodeMap = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    // Initialize all nodes
    tasks.forEach(task => {
      nodeMap.set(task.id, { data: task, children: [], depth: 0 });
    });

    // Build relationships
    tasks.forEach(task => {
      const node = nodeMap.get(task.id)!;
      if (task.parentId && nodeMap.has(task.parentId)) {
        const parent = nodeMap.get(task.parentId)!;
        parent.children.push(node);
        // We defer depth calculation to traversal or adjust here if simple
      } else {
        roots.push(node);
      }
    });

    // Calculate depths recursively
    const setDepth = (nodes: TreeNode[], depth: number) => {
      nodes.forEach(node => {
        node.depth = depth;
        setDepth(node.children, depth + 1);
      });
    };
    setDepth(roots, 0);

    return roots;
  }, [tasks]);

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedIds(next);
  };

  const toggleSelection = (id: string, multi: boolean) => {
    const next = new Set(multi ? selectedIds : []);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  };

  // Flatten for rendering based on expansion state
  const flattenTree = (nodes: TreeNode[]): TreeNode[] => {
    let result: TreeNode[] = [];
    nodes.forEach(node => {
      result.push(node);
      if (expandedIds.has(node.data.id) && node.children.length > 0) {
        result = result.concat(flattenTree(node.children));
      }
    });
    return result;
  };

  const visibleNodes = flattenTree(treeData);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 font-sans">
      {/* Header Row */}
      <div className="flex items-center h-10 bg-slate-800 border-b border-slate-700 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider sticky top-0 z-20 font-mono">
        <div className="w-10 shrink-0 text-center">Type</div>
        <div className="w-24 shrink-0">ID</div>
        <div className="flex-1 min-w-[200px]">Title</div>
        <div className="w-28 shrink-0">Status</div>
        <div className="w-32 shrink-0">Assignee</div>
        <div className="w-24 shrink-0">Priority</div>
        <div className="w-16 shrink-0 text-right">Pts</div>
        <div className="w-10 shrink-0" />
      </div>

      {/* Grid Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
        {visibleNodes.map((node) => (
          <Row 
            key={node.data.id} 
            node={node} 
            isSelected={selectedIds.has(node.data.id)}
            isExpanded={expandedIds.has(node.data.id)}
            onExpand={() => toggleExpand(node.data.id)}
            onSelect={(multi) => toggleSelection(node.data.id, multi)}
            onClick={() => onTaskClick && onTaskClick(node.data.id)}
            onExecute={() => onExecuteTask && onExecuteTask(node.data.id)}
          />
        ))}

        {/* Inline Input Ghost Row */}
        <div className="flex items-center h-10 px-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group cursor-text">
            <div className="w-10 shrink-0 flex justify-center text-slate-600">
               <span className="text-xl leading-none font-light">+</span>
            </div>
            <div className="w-24 shrink-0" />
            <div className="flex-1 text-sm text-slate-500 italic group-hover:text-slate-400">
               Add new item...
            </div>
        </div>
      </div>

      {/* Footer Summary */}
      <div className="h-8 bg-slate-900 border-t border-slate-800 flex items-center px-4 text-xs text-slate-500 font-mono">
         <span>{tasks.length} items loaded</span>
         <span className="mx-2">|</span>
         <span>{selectedIds.size} selected</span>
      </div>
    </div>
  );
};

const Row: React.FC<{ 
  node: TreeNode; 
  isSelected: boolean; 
  isExpanded: boolean; 
  onExpand: () => void;
  onSelect: (multi: boolean) => void;
  onClick: () => void;
  onExecute: () => void;
}> = ({ node, isSelected, isExpanded, onExpand, onSelect, onClick, onExecute }) => {
  const { data, children, depth } = node;
  const hasChildren = children.length > 0;

  const getTypeIcon = (type: TaskType) => {
    switch (type) {
      case 'epic': return <CrownIcon size={14} className="text-purple-400" />;
      case 'story': return <BookmarkIcon size={14} className="text-emerald-400" />;
      case 'bug': return <AlertCircleIcon size={14} className="text-red-400" />;
      default: return <CheckCircleIcon size={14} className="text-blue-400" />;
    }
  };

  const handleRowClick = (e: React.MouseEvent) => {
    // If clicking on selection area or expander, handle differently
    onSelect(e.metaKey || e.ctrlKey);
    // Open detail
    if (!e.metaKey && !e.ctrlKey) {
      onClick();
    }
  };

  return (
    <div 
      onClick={handleRowClick}
      className={`flex items-center h-10 px-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors group cursor-pointer ${
        isSelected ? 'bg-indigo-900/30 hover:bg-indigo-900/40' : depth % 2 !== 0 ? 'bg-slate-800/20' : ''
      }`}
    >
      {/* Type Icon */}
      <div className="w-10 shrink-0 flex items-center justify-center">
        {getTypeIcon(data.type)}
      </div>

      {/* ID */}
      <div className={`w-24 shrink-0 font-mono text-xs ${isSelected ? 'text-indigo-300' : 'text-slate-500 group-hover:text-indigo-400 transition-colors'}`}>
        {data.id}
      </div>

      {/* Title + Indentation */}
      <div className="flex-1 flex items-center min-w-[200px] overflow-hidden">
        <div style={{ width: depth * 24 }} className="shrink-0 flex justify-end pr-2">
            {depth > 0 && <CornerDownRightIcon size={10} className="text-slate-700 mb-1" />}
        </div>
        
        {/* Expand Toggle */}
        <div className="w-6 shrink-0 flex items-center justify-center">
           {hasChildren ? (
             <button 
               onClick={(e) => { e.stopPropagation(); onExpand(); }}
               className="p-0.5 hover:bg-slate-700 rounded text-slate-500 hover:text-white transition-colors"
             >
                {isExpanded ? <ChevronDownIcon size={12} /> : <ChevronRightIcon size={12} />}
             </button>
           ) : (
             <span className="w-3" />
           )}
        </div>

        <span className={`text-sm truncate pr-4 ${
          data.type === 'epic' ? 'font-semibold text-white' : 
          data.type === 'story' ? 'text-slate-200' : 'text-slate-300'
        }`}>
          {data.title}
        </span>
      </div>

      {/* Status */}
      <div className="w-28 shrink-0">
         <StatusBadge status={data.status} />
      </div>

      {/* Assignee */}
      <div className="w-32 shrink-0 flex items-center">
        {data.assignee ? (
           <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-[9px] font-bold">
                 {data.assignee.charAt(0)}
              </div>
              <span className="text-xs text-slate-400 truncate">{data.assignee}</span>
           </div>
        ) : (
           <span className="text-slate-600 text-xs">-</span>
        )}
      </div>

      {/* Priority */}
      <div className="w-24 shrink-0 flex items-center space-x-1.5">
         <ArrowUpIcon size={12} className={
             data.priority === 'high' ? 'text-red-400' : 
             data.priority === 'medium' ? 'text-amber-400' : 'text-slate-600 rotate-180'
         } />
         <span className="text-xs text-slate-400 capitalize">{data.priority}</span>
      </div>

      {/* Points */}
      <div className="w-16 shrink-0 text-right font-mono text-xs text-slate-500">
         {data.points || '-'}
      </div>

      {/* Actions */}
      <div className="w-10 shrink-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
         <button 
           onClick={(e) => { e.stopPropagation(); onExecute(); }}
           className="p-1 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded"
           title="Start Execution"
         >
           <PlayIcon size={12} fill="currentColor" />
         </button>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: Task['status'] }> = ({ status }) => {
    let colorClass = '';
    let label = status.replace('-', ' ');

    switch (status) {
        case 'pending': colorClass = 'text-slate-400 bg-slate-500/10 border-slate-500/20'; break;
        case 'in-progress': colorClass = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'; break;
        case 'review': colorClass = 'text-amber-400 bg-amber-500/10 border-amber-500/20'; break;
        case 'qa': colorClass = 'text-purple-400 bg-purple-500/10 border-purple-500/20'; break;
        case 'completed': colorClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'; break;
        case 'failed': colorClass = 'text-red-400 bg-red-500/10 border-red-500/20'; break;
    }

    return (
        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide border ${colorClass}`}>
            {label}
        </span>
    );
};

export default BacklogList;
