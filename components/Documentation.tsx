
import React, { useState, useEffect } from 'react';
import { DocPage, DocFolder } from '../types';
import { MOCK_DOC_PAGES, MOCK_DOC_FOLDERS } from '../constants';
import Button from './Button';
import { 
  FolderIcon, 
  FileTextIcon, 
  ChevronRightIcon, 
  ChevronDownIcon, 
  SearchIcon, 
  PlusIcon, 
  SparklesIcon, 
  ActivityIcon,
  TagIcon,
  LinkIcon,
  ClockIcon,
  RotateCwIcon,
  Edit2Icon,
  SaveIcon,
  CodeIcon,
  MoreVerticalIcon
} from './Icons';

const Documentation: React.FC = () => {
  const [pages, setPages] = useState<DocPage[]>(MOCK_DOC_PAGES);
  const [folders] = useState<DocFolder[]>(MOCK_DOC_FOLDERS);
  const [activePageId, setActivePageId] = useState<string>(MOCK_DOC_PAGES[0].id);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['f-specs', 'f-memory']));

  const activePage = pages.find(p => p.id === activePageId);

  const toggleFolder = (id: string) => {
    const next = new Set(expandedFolders);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedFolders(next);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Simulate sync
    setPages(prev => prev.map(p => p.id === activePageId ? { ...p, syncStatus: 'pending' } : p));
    setTimeout(() => {
      setPages(prev => prev.map(p => p.id === activePageId ? { ...p, syncStatus: 'synced', lastIndexed: 'Just now' } : p));
    }, 2000);
  };

  const filteredFolders = folders.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pages.some(p => p.folderId === f.id && p.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-full bg-slate-900 text-slate-200 overflow-hidden">
      
      {/* 1. Left Sidebar: File Tree */}
      <aside className="w-[280px] border-r border-slate-800 bg-slate-900 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md py-1.5 pl-9 pr-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {filteredFolders.map(folder => (
            <div key={folder.id} className="mb-1">
              <button 
                onClick={() => toggleFolder(folder.id)}
                className="w-full flex items-center px-2 py-1.5 rounded hover:bg-slate-800 text-xs font-semibold text-slate-400 hover:text-slate-200 group transition-colors"
              >
                {expandedFolders.has(folder.id) ? <ChevronDownIcon size={14} className="mr-1" /> : <ChevronRightIcon size={14} className="mr-1" />}
                <FolderIcon size={14} className="mr-2 text-slate-500 group-hover:text-indigo-400" />
                <span className="uppercase tracking-wider">{folder.name}</span>
              </button>
              
              {expandedFolders.has(folder.id) && (
                <div className="ml-4 mt-1 space-y-0.5 border-l border-slate-800">
                  {pages.filter(p => p.folderId === folder.id).map(page => (
                    <button
                      key={page.id}
                      onClick={() => setActivePageId(page.id)}
                      className={`w-full flex items-center px-3 py-1.5 rounded-r text-xs transition-all ${
                        activePageId === page.id 
                          ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500' 
                          : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                      }`}
                    >
                      <FileTextIcon size={14} className="mr-2 opacity-70" />
                      <span className="truncate">{page.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <div className="mt-4 px-2">
            <button className="w-full flex items-center px-2 py-1.5 rounded border border-dashed border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-all text-xs">
              <PlusIcon size={14} className="mr-2" />
              New Memory File
            </button>
          </div>
        </nav>
      </aside>

      {/* 2. Center: Editor Area */}
      <main className="flex-1 flex flex-col bg-[#0f172a] relative overflow-hidden">
        {activePage ? (
          <>
            {/* Editor Toolbar */}
            <header className="h-12 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm flex items-center justify-between px-6 shrink-0 z-10">
              <div className="flex items-center text-xs text-slate-500 space-x-2">
                <FolderIcon size={12} />
                <span>{folders.find(f => f.id === activePage.folderId)?.name}</span>
                <span>/</span>
                <span className="text-slate-200 font-medium">{activePage.title}</span>
              </div>
              <div className="flex items-center space-x-3">
                {isEditing ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button variant="primary" size="sm" onClick={handleSave} icon={<SaveIcon size={14} />}>Save Changes</Button>
                  </>
                ) : (
                  <>
                    <Button variant="secondary" size="sm" icon={<Edit2Icon size={14} />} onClick={() => setIsEditing(true)}>Edit Page</Button>
                    <button className="p-1.5 text-slate-500 hover:text-white rounded hover:bg-slate-800">
                      <MoreVerticalIcon size={16} />
                    </button>
                  </>
                )}
              </div>
            </header>

            {/* Content Stage */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
              <div className="max-w-[900px] mx-auto animate-in fade-in duration-500">
                {isEditing ? (
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      defaultValue={activePage.title}
                      className="w-full bg-transparent text-4xl font-bold text-white border-none outline-none focus:ring-0 p-0 mb-4"
                    />
                    <textarea 
                      className="w-full min-h-[600px] bg-transparent text-slate-300 font-mono text-sm leading-relaxed border-none outline-none focus:ring-0 resize-none"
                      defaultValue={activePage.content}
                      placeholder="Start writing... Use / for commands"
                    />
                  </div>
                ) : (
                  <div className="prose prose-invert prose-indigo max-w-none">
                    <h1 className="text-4xl font-bold text-white mb-8 border-b border-slate-800 pb-4">{activePage.title}</h1>
                    <div className="markdown-content text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {/* Simple Markdown Simulation */}
                      {activePage.content.split('\n').map((line, idx) => {
                        if (line.startsWith('# ')) return <h1 key={idx} className="text-3xl font-bold text-white mt-8 mb-4">{line.replace('# ', '')}</h1>;
                        if (line.startsWith('## ')) return <h2 key={idx} className="text-2xl font-bold text-slate-100 mt-6 mb-3">{line.replace('## ', '')}</h2>;
                        if (line.startsWith('- ')) return <li key={idx} className="ml-4 mb-1 list-disc">{line.replace('- ', '')}</li>;
                        
                        // Mermaid Simulation
                        if (line.startsWith('```mermaid')) {
                          return (
                            <div key={idx} className="my-6 p-6 bg-slate-850 rounded-lg border border-indigo-500/20 shadow-inner flex flex-col items-center">
                               <div className="text-[10px] text-indigo-400 font-mono mb-4 flex items-center self-start">
                                  <SparklesIcon size={10} className="mr-2" /> MERMAID_RENDERED_VIEW
                               </div>
                               {/* Mock Diagram Visualization */}
                               <div className="flex flex-col items-center space-y-4 w-full max-w-sm">
                                  <div className="w-32 h-10 rounded border-2 border-indigo-500 flex items-center justify-center bg-indigo-500/10 text-xs font-bold">User</div>
                                  <div className="h-8 w-0.5 bg-indigo-500/30 relative">
                                     <ChevronDownIcon size={12} className="absolute -bottom-2 -left-[5px] text-indigo-500" />
                                  </div>
                                  <div className="w-32 h-10 rounded border-2 border-emerald-500 flex items-center justify-center bg-emerald-500/10 text-xs font-bold">AuthService</div>
                                  <div className="flex space-x-12 mt-2">
                                     <div className="h-10 w-0.5 bg-slate-700" />
                                     <div className="h-10 w-0.5 bg-slate-700" />
                                  </div>
                               </div>
                            </div>
                          );
                        }
                        if (line.startsWith('```') || line === '```') return null; // skip code block wrappers for text

                        return <p key={idx} className="mb-4">{line}</p>;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-600">
             <FileTextIcon size={48} className="mb-4 opacity-20" />
             <p>Select a page to view documentation</p>
          </div>
        )}
      </main>

      {/* 3. Right: AI Metadata Pane */}
      <aside className="w-[280px] border-l border-slate-800 bg-slate-900 flex flex-col shrink-0">
        {activePage && (
          <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            
            {/* Sync Section */}
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Agent Indexing</h3>
              <div className="flex items-center justify-between bg-slate-950 p-3 rounded border border-slate-800">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    activePage.syncStatus === 'synced' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 
                    activePage.syncStatus === 'pending' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
                  }`} />
                  <span className={`text-xs font-medium ${
                    activePage.syncStatus === 'synced' ? 'text-emerald-400' : 
                    activePage.syncStatus === 'pending' ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {activePage.syncStatus === 'synced' ? 'Indexed & Ready' : 
                     activePage.syncStatus === 'pending' ? 'Syncing...' : 'Error Indexing'}
                  </span>
                </div>
                <button className="text-slate-600 hover:text-indigo-400 transition-colors">
                  <RotateCwIcon size={12} />
                </button>
              </div>
              <div className="mt-3 flex items-center text-[10px] text-slate-500 font-mono">
                <ClockIcon size={10} className="mr-1.5" />
                Last Indexed: {activePage.lastIndexed}
              </div>
            </div>

            {/* Linked Tasks */}
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center">
                <LinkIcon size={10} className="mr-2" />
                Linked Tasks
              </h3>
              <div className="space-y-2">
                {activePage.linkedTasks.length > 0 ? activePage.linkedTasks.map(taskId => (
                  <div key={taskId} className="flex items-center justify-between p-2 bg-slate-800/50 rounded border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer group">
                    <span className="text-[10px] font-mono font-bold text-indigo-400">{taskId}</span>
                    <ChevronRightIcon size={12} className="text-slate-600 group-hover:text-slate-400" />
                  </div>
                )) : (
                  <div className="text-xs text-slate-600 italic">No linked tasks</div>
                )}
                <button className="w-full mt-2 py-1.5 border border-dashed border-slate-700 rounded text-[10px] text-slate-500 hover:text-slate-300 transition-colors">
                  + Link Task
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="p-6">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center">
                <TagIcon size={10} className="mr-2" />
                Context Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {activePage.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] border border-slate-700 hover:border-indigo-500/50 hover:text-indigo-300 transition-all cursor-default">
                    #{tag}
                  </span>
                ))}
                <button className="w-6 h-6 rounded bg-slate-800 border border-slate-700 text-slate-500 flex items-center justify-center hover:text-white transition-colors">
                  +
                </button>
              </div>
            </div>

            {/* Graph Context Preview Mock */}
            <div className="mt-auto p-6 bg-indigo-900/10 border-t border-indigo-500/20">
               <div className="flex items-center text-indigo-400 text-xs font-bold mb-3">
                  <ActivityIcon size={14} className="mr-2" />
                  Graph Relevance
               </div>
               <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-3/4 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
               </div>
               <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                  Highly relevant to **Auth Module** and **RAG Memory**.
               </p>
            </div>

          </div>
        )}
      </aside>

    </div>
  );
};

export default Documentation;
