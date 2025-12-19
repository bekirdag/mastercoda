
import React from 'react';
import { LayoutGridIcon, TerminalIcon, FileTextIcon, SparklesIcon, SettingsIcon, GitBranchIcon, ChevronRightIcon, ActivityIcon, EyeIcon, InboxIcon, BookOpenIcon, ShieldIcon, RocketIcon, GridIcon, CodeIcon, PackageIcon, ScissorsIcon, CpuIcon, UserIcon, GlobeIcon, ZapIcon } from './Icons';
import { MOCK_NOTIFICATIONS } from '../constants';

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
  activePath: string;
  setActivePath: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, setIsExpanded, activePath, setActivePath }) => {
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => n.status === 'unread').length;

  const navItems = [
    { id: 'workspace', label: 'Workspace', icon: <ActivityIcon size={20} />, path: '/' },
    { id: 'inbox', label: 'Inbox', icon: <InboxIcon size={20} />, path: '/inbox', badge: unreadCount },
    { id: 'insights', label: 'Insights', icon: <ActivityIcon size={20} />, path: '/analytics' },
    { id: 'orchestrator', label: 'Orchestrator', icon: <div className="relative"><ActivityIcon size={20} className="text-indigo-400" /><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" /></div>, path: '/extensions/orchestrator' }, // EX-15
    { id: 'quality', label: 'Quality', icon: <ShieldIcon size={20} />, path: '/quality' },
    { id: 'firewall', label: 'Privacy Firewall', icon: <GlobeIcon size={20} />, path: '/extensions/firewall' }, // EX-14
    { id: 'releases', label: 'Releases', icon: <RocketIcon size={20} />, path: '/releases' },
    { id: 'apiexplorer', label: 'API Explorer', icon: <ZapIcon size={20} className="text-amber-400" />, path: '/docs/api-explorer' }, // DO-05
    { id: 'references', label: 'References', icon: <BookOpenIcon size={20} />, path: '/extensions/references' }, // EX-12
    { id: 'extensions', label: 'Marketplace', icon: <GridIcon size={20} />, path: '/extensions' }, 
    { id: 'models', label: 'Brain Center', icon: <CpuIcon size={20} />, path: '/extensions/models' }, // EX-10
    { id: 'accounts', label: 'Service Accounts', icon: <UserIcon size={20} />, path: '/extensions/accounts' }, // EX-11
    { id: 'snippets', label: 'Snippets', icon: <ScissorsIcon size={20} />, path: '/extensions/snippets' }, // EX-08
    { id: 'keymaps', label: 'Keymaps', icon: <div className="flex space-x-0.5"><div className="w-1.5 h-3 bg-slate-500 rounded-sm"/><div className="w-1.5 h-3 bg-slate-500 rounded-sm"/><div className="w-1.5 h-3 bg-indigo-500 rounded-sm"/></div>, path: '/extensions/keymaps' }, // EX-09
    { id: 'stacks', label: 'Stacks', icon: <PackageIcon size={20} />, path: '/extensions/stacks' }, // EX-06
    { id: 'themes', label: 'Theme Studio', icon: <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />, path: '/extensions/themes' }, // EX-07
    { id: 'manager', label: 'Ext Manager', icon: <SettingsIcon size={20} />, path: '/extensions/installed' }, // EX-05
    { id: 'builder', label: 'Ext Builder', icon: <CodeIcon size={20} />, path: '/extensions/builder' }, // EX-04 Entry
    { id: 'playbooks', label: 'Playbooks', icon: <BookOpenIcon size={20} />, path: '/playbooks' },
    { id: 'plan', label: 'Plan', icon: <LayoutGridIcon size={20} />, path: '/plan' },
    { id: 'execution', label: 'Execution', icon: <TerminalIcon size={20} />, path: '/exec' },
    { id: 'review', label: 'Review', icon: <EyeIcon size={20} />, path: '/review' },
    { id: 'agents', label: 'Agents', icon: <SparklesIcon size={20} />, path: '/agents' },
    { id: 'source', label: 'Source Control', icon: <GitBranchIcon size={20} />, path: '/source' },
    { id: 'docs', label: 'Documentation', icon: <FileTextIcon size={20} />, path: '/docs' },
  ];

  return (
    <aside 
      className={`relative flex flex-col h-screen bg-slate-800 border-r border-slate-700 transition-all duration-300 ease-in-out z-20 ${
        isExpanded ? 'w-60' : 'w-16'
      }`}
    >
      {/* Logo Area */}
      <div className="flex items-center h-14 px-4 border-b border-slate-700">
        <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
          <span className="text-white font-bold font-mono">M</span>
        </div>
        <div className={`ml-3 overflow-hidden transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
          <span className="font-semibold text-slate-100 whitespace-nowrap">Master Coda</span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePath(item.path)}
            className={`group flex items-center w-full px-2 py-2 rounded-md transition-all ${
              activePath === item.path 
                ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500' 
                : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-100 border-l-2 border-transparent'
            }`}
            title={!isExpanded ? item.label : undefined}
          >
            <span className="shrink-0 relative">
              {item.icon}
              {item.badge !== undefined && item.badge > 0 && !isExpanded && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full border border-slate-800" />
              )}
            </span>
            <span 
              className={`ml-3 text-sm font-medium transition-all duration-300 whitespace-nowrap overflow-hidden flex-1 flex justify-between items-center ${
                isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
              }`}
            >
              {item.label}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-2">
                  {item.badge}
                </span>
              )}
            </span>
          </button>
        ))}
      </nav>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-20 bg-slate-700 border border-slate-600 rounded-full p-1 text-slate-400 hover:text-white hover:bg-indigo-600 transition-colors"
      >
        <ChevronRightIcon size={12} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Bottom Actions */}
      <div className="p-2 border-t border-slate-700">
        <button 
          onClick={() => setActivePath('/settings')}
          className={`flex items-center w-full px-2 py-2 rounded-md transition-colors ${
            activePath === '/settings' 
              ? 'text-indigo-400 bg-indigo-600/10' 
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50'
          }`}
        >
          <SettingsIcon size={20} />
          <span className={`ml-3 text-sm font-medium transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
            Settings
          </span>
        </button>
        <div className="mt-2 flex items-center px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shrink-0 border border-slate-500" />
          <div className={`ml-3 overflow-hidden transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
            <p className="text-xs font-medium text-slate-200">Alex Dev</p>
            <p className="text-[10px] text-slate-500">Senior Architect</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
