
import React, { useState, useMemo } from 'react';
import { AppNotification, NotificationCategory } from '../types';
import { MOCK_NOTIFICATIONS } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  BellIcon, 
  CheckCheckIcon, 
  XIcon, 
  SearchIcon, 
  MessageCircleIcon, 
  SparklesIcon, 
  RocketIcon, 
  ClockIcon, 
  ChevronRightIcon, 
  SettingsIcon,
  RotateCwIcon,
  AlertTriangleIcon,
  /* Fix: Added CheckCircleIcon to resolve "Cannot find name 'CheckCircleIcon'" errors on lines 108 and 176 */
  CheckCircleIcon
} from './Icons';

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<NotificationCategory | 'all' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dndMode, setDndMode] = useState(false);

  const filtered = useMemo(() => {
    return notifications.filter(n => {
      const matchesTab = 
        activeTab === 'all' || 
        (activeTab === 'unread' && n.status === 'unread') ||
        n.category === activeTab;
      
      const matchesSearch = 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        n.body.toLowerCase().includes(searchQuery.toLowerCase());
        
      return matchesTab && matchesSearch && n.status !== 'archived';
    });
  }, [notifications, activeTab, searchQuery]);

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, status: 'read' as const })));
  };

  const handleAction = (id: string, action: 'read' | 'archive' | 'retry') => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id) {
        if (action === 'read') return { ...n, status: 'read' as const };
        if (action === 'archive') return { ...n, status: 'archived' as const };
      }
      return n;
    }));
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans border-l border-slate-800 shadow-2xl">
      
      {/* 1. Header Toolbar */}
      <header className="shrink-0 p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur z-20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
             <BellIcon className="text-indigo-400" size={20} />
             <h1 className="text-xl font-bold text-white tracking-tight">
               Notifications 
               <span className="ml-2 text-slate-500 font-mono text-sm">({unreadCount})</span>
             </h1>
          </div>
          <button 
            onClick={markAllRead}
            className="p-2 text-slate-500 hover:text-emerald-400 transition-colors rounded-lg hover:bg-slate-800" 
            title="Mark all as read"
          >
            <CheckCheckIcon size={20} />
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="space-y-4">
           <div className="relative group">
              <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-all" />
              <input 
                type="text" 
                placeholder="Filter alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-300 focus:border-indigo-500 outline-none transition-all shadow-inner"
              />
           </div>

           <div className="flex items-center space-x-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700">
              <TabBtn active={activeTab === 'all'} onClick={() => setActiveTab('all')} label="All" />
              <TabBtn active={activeTab === 'unread'} onClick={() => setActiveTab('unread')} label="Unread" />
              <TabBtn active={activeTab === 'mention'} onClick={() => setActiveTab('mention')} label="Mentions" />
              <TabBtn active={activeTab === 'system'} onClick={() => setActiveTab('system')} label="System" />
           </div>
        </div>
      </header>

      {/* 2. Notification Stream */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-[#0d1117]">
         {filtered.length === 0 ? (
           <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in-95 duration-700">
              <div className="w-20 h-20 rounded-full bg-emerald-500/5 border-2 border-dashed border-emerald-500/20 flex items-center justify-center mb-6">
                 <CheckCircleIcon size={40} className="text-emerald-500/30" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">All caught up! 🎉</h3>
              <p className="text-sm text-slate-500 max-w-[240px]">You have no pending notifications in this category.</p>
           </div>
         ) : (
           filtered.map((item, idx) => (
             <NotificationCard 
                key={item.id} 
                item={item} 
                index={idx}
                onRead={() => handleAction(item.id, 'read')}
                onArchive={() => handleAction(item.id, 'archive')}
             />
           ))
         )}
      </main>

      {/* 3. Footer Settings */}
      <footer className="shrink-0 p-6 border-t border-slate-800 bg-slate-900/50">
         <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
               <div className="flex flex-col">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Do Not Disturb</span>
                  <span className="text-[10px] text-slate-500">Snooze alerts for all channels</span>
               </div>
               <button 
                  onClick={() => setDndMode(!dndMode)}
                  className={`w-12 h-6 rounded-full p-1 transition-all duration-300 relative ${dndMode ? 'bg-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-slate-700'}`}
               >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${dndMode ? 'translate-x-6' : 'translate-x-0'}`} />
               </button>
            </div>
            
            <button 
               onClick={() => { const evt = new CustomEvent('app-navigate', { detail: '/settings' }); window.dispatchEvent(evt); }}
               className="flex items-center justify-center space-x-2 py-2 w-full rounded-xl border border-slate-700 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all group"
            >
               <SettingsIcon size={14} className="group-hover:rotate-90 transition-transform duration-500" />
               <span>Manage delivery preferences</span>
            </button>
         </div>
      </footer>
    </div>
  );
};

// Internal Sub-components

const TabBtn: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
   <button 
      onClick={onClick}
      className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all ${
         active ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
      }`}
   >
      {label}
   </button>
);

const NotificationCard: React.FC<{ 
  item: AppNotification; 
  index: number;
  onRead: () => void;
  onArchive: () => void;
}> = ({ item, index, onRead, onArchive }) => {
   const isUnread = item.status === 'unread';
   
   let icon = <CheckCircleIcon size={18} className="text-emerald-500" />;
   let borderClass = 'border-slate-800 hover:border-slate-700';
   let bgClass = 'bg-slate-900/50';

   if (item.category === 'mention') {
      icon = <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white border border-indigo-400 shadow-lg">A</div>;
      borderClass = 'border-indigo-500/20 hover:border-indigo-500/40';
   } else if (item.error) {
      icon = <AlertTriangleIcon size={18} className="text-red-500 animate-pulse" />;
      borderClass = 'border-red-500/20 hover:border-red-500/40';
      bgClass = 'bg-red-950/5';
   } else if (item.category === 'agent') {
      icon = <SparklesIcon size={18} className="text-indigo-400" />;
   } else if (item.title.toLowerCase().includes('deploy')) {
      icon = <RocketIcon size={18} className="text-emerald-500" />;
   }

   return (
      <div 
         onClick={onRead}
         className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer animate-in slide-in-from-top-2 overflow-hidden ${borderClass} ${bgClass} ${isUnread ? 'shadow-lg shadow-indigo-500/5' : 'opacity-60'}`}
         style={{ animationDelay: `${index * 50}ms` }}
      >
         {/* Live Glow Strip */}
         {isUnread && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
         )}

         <div className="flex items-start space-x-4">
            <div className="shrink-0 pt-1">
               {icon}
            </div>
            
            <div className="flex-1 min-w-0 space-y-1">
               <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-bold truncate ${isUnread ? 'text-white' : 'text-slate-300'}`}>{item.title}</h4>
                  <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0 ml-4">{item.timestamp}</span>
               </div>
               <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {item.body}
               </p>

               <div className="flex items-center justify-between pt-3">
                  <div className="flex items-center space-x-3">
                     {item.taskId && <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">{item.taskId}</span>}
                     {item.category === 'mention' && <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase underline tracking-tighter">View Thread</button>}
                  </div>
                  
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button 
                        onClick={(e) => { e.stopPropagation(); onArchive(); }}
                        className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Archive"
                     >
                        <XIcon size={14} />
                     </button>
                     <button className="p-1.5 text-slate-600 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all">
                        <ChevronRightIcon size={14} />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default NotificationCenter;
