
import React, { useState } from 'react';
import { MOCK_NOTIFICATIONS } from '../constants';
import { AppNotification, NotificationCategory } from '../types';
import Button from './Button';
import { 
  CheckCircleIcon, 
  AlertTriangleIcon, 
  SparklesIcon, 
  SettingsIcon, 
  ArchiveIcon, 
  TrashIcon, 
  ChevronRightIcon, 
  RefreshCwIcon,
  SearchIcon,
  CodeIcon,
  TerminalIcon
} from './Icons';

// Re-using InfoIcon if not defined
const InfoIconProxy: React.FC<any> = (props) => (
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
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const Inbox: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<NotificationCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = notifications.filter(n => {
    const matchesTab = activeTab === 'all' || n.category === activeTab;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         n.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch && n.status !== 'archived';
  });

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
  };

  const archiveItem = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'archived' } : n));
  };

  return (
    <div className="p-8 max-w-[800px] mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* 1. Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
           <h1 className="text-3xl font-semibold text-white tracking-tight">Inbox</h1>
           <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={markAllRead}>Mark all read</Button>
              <button className="p-2 text-slate-500 hover:text-white rounded-md hover:bg-slate-800 transition-colors">
                <SettingsIcon size={20} />
              </button>
           </div>
        </div>

        {/* Tabs & Filters */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-px">
           <div className="flex space-x-6">
              <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')} label="All" />
              <TabButton active={activeTab === 'agent'} onClick={() => setActiveTab('agent')} label="Agent Results" />
              <TabButton active={activeTab === 'system'} onClick={() => setActiveTab('system')} label="System" />
              <TabButton active={activeTab === 'mention'} onClick={() => setActiveTab('mention')} label="Mentions" />
           </div>
           <div className="relative mb-2">
              <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Filter inbox..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800/50 border border-slate-700 rounded-md py-1 pl-9 pr-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 w-48 transition-all"
              />
           </div>
        </div>
      </div>

      {/* 2. Notification List */}
      <div className="space-y-3">
         {filtered.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
                 <SparklesIcon size={40} className="text-slate-600" />
              </div>
              <div className="space-y-1">
                 <h3 className="text-slate-300 font-medium text-lg">All caught up</h3>
                 <p className="text-slate-500 text-sm">The agents are resting. Your inbox is clear.</p>
              </div>
              <Button variant="secondary" size="sm" icon={<RefreshCwIcon size={14} />}>Check for Updates</Button>
           </div>
         ) : (
           filtered.map(item => (
             <NotificationCard 
                key={item.id} 
                item={item} 
                onArchive={() => archiveItem(item.id)} 
             />
           ))
         )}
      </div>

      {/* Load More Mock */}
      {filtered.length > 0 && (
         <div className="pt-4 flex justify-center">
            <button className="text-xs font-bold text-slate-600 uppercase tracking-widest hover:text-slate-400 transition-colors">
               Load Historical Activity
            </button>
         </div>
      )}
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
   <button 
      onClick={onClick}
      className={`pb-3 text-sm font-medium transition-all relative ${
         active ? 'text-white' : 'text-slate-500 hover:text-slate-300'
      }`}
   >
      {label}
      {active && (
         <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 animate-in fade-in slide-in-from-bottom-1" />
      )}
   </button>
);

const NotificationCard: React.FC<{ item: AppNotification; onArchive: () => void }> = ({ item, onArchive }) => {
   const isUnread = item.status === 'unread';
   
   // Styling based on category and error state
   let borderColor = 'border-slate-700';
   let icon = <InfoIconProxy size={18} className="text-blue-400" />;
   
   if (item.category === 'agent') {
      if (item.error) {
         borderColor = 'border-red-500/30';
         icon = <AlertTriangleIcon size={18} className="text-red-400" />;
      } else {
         borderColor = 'border-emerald-500/30';
         icon = <CheckCircleIcon size={18} className="text-emerald-400" />;
      }
   } else if (item.category === 'mention') {
      borderColor = 'border-indigo-500/30';
      icon = <div className="w-[18px] h-[18px] rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">@</div>;
   }

   return (
      <div className={`group relative bg-slate-800/40 rounded-lg border ${borderColor} p-4 transition-all hover:bg-slate-800 hover:shadow-lg ${isUnread ? 'ring-1 ring-indigo-500/10' : 'opacity-80 hover:opacity-100'}`}>
         
         <div className="flex items-start space-x-4">
            {/* Icon Column */}
            <div className="pt-1">
               {icon}
            </div>

            {/* Content Column */}
            <div className="flex-1 min-w-0">
               <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-sm font-bold truncate ${isUnread ? 'text-white' : 'text-slate-300'}`}>
                     {item.title}
                     {isUnread && <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 ml-2 mb-0.5" />}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{item.timestamp}</span>
               </div>
               <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
                  {item.body}
               </p>

               {/* Meta & Context Actions */}
               <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                     {item.taskId && (
                        <div className="flex items-center text-[10px] font-mono font-bold text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded">
                           {item.taskId}
                        </div>
                     )}
                     {item.tokens && (
                        <span className="text-[10px] text-slate-500 font-mono italic">
                           • {item.tokens} tokens
                        </span>
                     )}
                  </div>
                  
                  {/* Action Bar */}
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     {item.category === 'agent' && !item.error && (
                        <button className="flex items-center px-2 py-1 rounded bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 text-[10px] font-bold border border-indigo-500/20 transition-all">
                           <CodeIcon size={12} className="mr-1.5" /> VIEW DIFF
                        </button>
                     )}
                     {item.error && (
                        <button className="flex items-center px-2 py-1 rounded bg-red-600/10 hover:bg-red-600/20 text-red-400 text-[10px] font-bold border border-red-500/20 transition-all">
                           <TerminalIcon size={12} className="mr-1.5" /> VIEW LOGS
                        </button>
                     )}
                     <button 
                        onClick={onArchive}
                        className="p-1 text-slate-500 hover:text-slate-200 rounded hover:bg-slate-700 transition-colors" 
                        title="Archive"
                     >
                        <ArchiveIcon size={14} />
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Swipe-to-read highlight bar (Visual hint) */}
         {isUnread && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-indigo-500 rounded-r" />
         )}
      </div>
   );
};

export default Inbox;
