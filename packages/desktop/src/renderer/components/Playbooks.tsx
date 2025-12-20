
import React, { useState } from 'react';
import { Playbook } from '../types';
import { MOCK_PLAYBOOKS } from '../constants';
import Button from './Button';
import PlaybookEditor from './PlaybookEditor';
import { 
  SearchIcon, 
  PlusIcon, 
  PlayIcon, 
  SettingsIcon, 
  ChevronRightIcon, 
  LockIcon, 
  SparklesIcon,
  TagIcon,
  ActivityIcon,
  BookOpenIcon,
  FilterIcon
} from './Icons';

// Proxy for Box icon
const BoxIconProxy: React.FC<any> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 20}
    height={props.size || 20}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const Playbooks: React.FC = () => {
  const [playbooks, setPlaybooks] = useState<Playbook[]>(MOCK_PLAYBOOKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [editingPlaybook, setEditingPlaybook] = useState<Playbook | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const categories = ['All', 'Testing', 'Refactoring', 'Documentation', 'Custom'];

  const filteredPlaybooks = playbooks.filter(pb => {
    const matchesSearch = pb.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         pb.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || 
                           pb.tags.some(t => t.toLowerCase() === activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (pb: Playbook) => {
    setEditingPlaybook(pb);
    setIsEditorOpen(true);
  };

  const handleCreateNew = () => {
    setEditingPlaybook(null);
    setIsEditorOpen(true);
  };

  const handleSavePlaybook = (pb: Playbook) => {
    setPlaybooks(prev => {
      const exists = prev.find(p => p.id === pb.id);
      if (exists) return prev.map(p => p.id === pb.id ? pb : p);
      return [...prev, pb];
    });
    setIsEditorOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Toolbar */}
      <header className="h-[64px] border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 flex items-center justify-between px-8 z-20">
         <div className="flex items-center space-x-6">
            <div>
               <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
                  <BookOpenIcon className="mr-2 text-indigo-500" size={22} />
                  Agent Playbooks
               </h1>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            {/* Search */}
            <div className="relative">
               <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
               <input 
                  type="text" 
                  placeholder="Find a playbook..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-800/80 border border-slate-700 rounded-md py-1.5 pl-9 pr-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 w-64 transition-all"
               />
            </div>

            {/* Tabs */}
            <div className="flex items-center bg-slate-800 rounded p-1 border border-slate-700">
               {categories.map(cat => (
                  <button
                     key={cat}
                     onClick={() => setActiveCategory(cat)}
                     className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                        activeCategory === cat 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-300'
                     }`}
                  >
                     {cat}
                  </button>
               ))}
            </div>
         </div>

         <Button 
            variant="primary" 
            size="sm" 
            icon={<PlusIcon size={14} />}
            onClick={handleCreateNew}
         >
            New Playbook
         </Button>
      </header>

      {/* 2. Grid View */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
         <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {filteredPlaybooks.map(pb => (
               <PlaybookCard key={pb.id} playbook={pb} onClick={() => handleEdit(pb)} />
            ))}

            {/* Empty State */}
            {filteredPlaybooks.length === 0 && (
               <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-600">
                  <BoxIconProxy size={64} className="mb-4 opacity-10" />
                  <p className="text-lg font-medium">No playbooks found matching your search</p>
                  <Button variant="ghost" className="mt-4" onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}>Clear Filters</Button>
               </div>
            )}
         </div>
      </div>

      {/* Slide-over Editor */}
      {isEditorOpen && (
         <PlaybookEditor 
            playbook={editingPlaybook} 
            onClose={() => setIsEditorOpen(false)} 
            onSave={handleSavePlaybook}
         />
      )}

    </div>
  );
};

const PlaybookCard: React.FC<{ playbook: Playbook; onClick: () => void }> = ({ playbook, onClick }) => {
   return (
      <div 
         onClick={onClick}
         className="group relative flex flex-col h-full bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800 hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
      >
         {/* Background Subtle Icon */}
         <div className="absolute top-2 right-2 text-slate-800 opacity-20 transition-opacity group-hover:opacity-40 select-none">
            {playbook.icon}
         </div>

         {/* Card Header */}
         <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
               <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-xl flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                  {playbook.icon}
               </div>
               <div>
                  <h3 className="font-bold text-white leading-tight group-hover:text-indigo-200 transition-colors">{playbook.title}</h3>
                  <code className="text-[9px] font-mono text-indigo-400/70">{playbook.trigger}</code>
               </div>
            </div>
            {playbook.isSystem && (
               <LockIcon size={12} className="text-slate-600" title="System Default" />
            )}
         </div>

         {/* Description */}
         <p className="text-xs text-slate-400 leading-relaxed mb-6 line-clamp-2">
            {playbook.description}
         </p>

         {/* Footer Meta */}
         <div className="mt-auto pt-4 border-t border-slate-700/50 flex items-center justify-between">
            <div className="flex -space-x-1">
               {playbook.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-slate-700 text-slate-400 mr-2 border border-slate-600">
                     #{tag}
                  </span>
               ))}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
               {playbook.updatedAt}
            </div>
         </div>

         {/* Hover Run Action Overlay */}
         <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="flex items-center bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg transform translate-x-2 group-hover:translate-x-0 transition-transform">
               <PlayIcon size={10} fill="currentColor" className="mr-1" /> RUN
            </button>
         </div>
      </div>
   );
};

export default Playbooks;
