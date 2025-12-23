import React, { useState } from 'react';
import {
  ActivityIcon,
  BellIcon,
  BookOpenIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CodeIcon,
  CpuIcon,
  CreditCardIcon,
  EyeIcon,
  FileTextIcon,
  GitBranchIcon,
  GlobeIcon,
  HardDriveIcon,
  HelpCircleIcon,
  HistoryIcon,
  LayoutGridIcon,
  LinkIcon,
  ListTreeIcon,
  LockIcon,
  PackageIcon,
  RocketIcon,
  ScissorsIcon,
  SettingsIcon,
  ShieldIcon,
  SparklesIcon,
  TerminalIcon,
  UserIcon,
  ZapIcon
} from './Icons';
import { MOCK_NOTIFICATIONS } from '../constants';

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
  activePath: string;
  setActivePath: (path: string) => void;
}

type NavItem = {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
  paths?: string[];
  indent?: boolean;
  children?: NavItem[];
  defaultOpen?: boolean;
};

type NavSection = {
  id: string;
  label: string;
  items: NavItem[];
  defaultOpen?: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, setIsExpanded, activePath, setActivePath }) => {
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.status === 'unread').length;

  const sections: NavSection[] = [
    {
      id: 'primary-flow',
      label: 'Primary Flow',
      defaultOpen: true,
      items: [
        {
          id: 'workflow-workspace',
          label: 'Workspaces',
          path: '/workspace',
          icon: <HardDriveIcon size={18} className="text-indigo-300" />
        },
        {
          id: 'workflow-project-design',
          label: 'Project Design',
          path: '/workspace/design',
          icon: <FileTextIcon size={18} className="text-indigo-300" />,
          defaultOpen: true,
          children: [
            {
              id: 'workflow-rfp',
              label: 'RFP',
              path: '/agents/discovery',
              icon: <SparklesIcon size={18} className="text-indigo-300" />,
              indent: true
            },
            {
              id: 'workflow-pdr',
              label: 'PDR',
              path: '/agents/signoff',
              icon: <CheckCircleIcon size={18} className="text-emerald-400" />,
              indent: true
            },
            {
              id: 'workflow-sds',
              label: 'SDS',
              path: '/agents/structural-templates',
              icon: <ListTreeIcon size={18} className="text-indigo-300" />,
              indent: true
            },
            {
              id: 'workflow-openyaml',
              label: 'OpenAPI',
              path: '/agents/openyaml',
              icon: <FileTextIcon size={18} className="text-indigo-300" />,
              indent: true
            },
            {
              id: 'workflow-project-tasks',
              label: 'Tasks',
              path: '/workspace/design/tasks',
              icon: <ListTreeIcon size={18} className="text-emerald-400" />,
              indent: true
            },
            {
              id: 'workflow-order-tasks',
              label: 'Order tasks',
              path: '/project/tasks/order',
              icon: <LayoutGridIcon size={18} className="text-slate-300" />,
              indent: true
            },
            {
              id: 'workflow-list-tasks',
              label: 'List tasks',
              path: '/plan',
              icon: <ActivityIcon size={18} className="text-indigo-300" />,
              indent: true
            }
          ]
        },
        {
          id: 'workflow-work',
          label: 'Work on Tasks',
          path: '/exec',
          icon: <TerminalIcon size={18} className="text-emerald-400" />
        },
        {
          id: 'workflow-review',
          label: 'Code Review',
          path: '/review',
          icon: <EyeIcon size={18} className="text-amber-400" />
        },
        {
          id: 'workflow-qa',
          label: 'QA Tasks',
          path: '/quality',
          icon: <ShieldIcon size={18} className="text-red-400" />
        }
      ]
    },
    {
      id: 'workspace',
      label: 'Workspace',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          path: '/',
          icon: <ActivityIcon size={18} />
        },
        {
          id: 'notifications',
          label: 'Notifications',
          path: '/notifications',
          paths: ['/notifications', '/inbox'],
          icon: <BellIcon size={18} />,
          badge: unreadCount
        },
        {
          id: 'source',
          label: 'Source Control',
          path: '/source',
          icon: <GitBranchIcon size={18} className="text-indigo-300" />
        },
        {
          id: 'releases',
          label: 'Releases',
          path: '/releases',
          icon: <RocketIcon size={18} />
        },
        {
          id: 'playbooks',
          label: 'Playbooks',
          path: '/playbooks',
          icon: <BookOpenIcon size={18} />
        },
        {
          id: 'sprints',
          label: 'Sprint Planner',
          path: '/project/sprints',
          icon: <CalendarIcon size={18} className="text-amber-400" />
        },
        {
          id: 'insights',
          label: 'Insights',
          path: '/analytics',
          icon: <ActivityIcon size={18} className="text-emerald-400" />
        },
        {
          id: 'project-settings',
          label: 'Project Settings',
          path: '/settings/project',
          icon: <SettingsIcon size={18} />
        }
      ]
    },
    {
      id: 'documentation',
      label: 'Docs & Knowledge',
      items: [
        {
          id: 'docs-hub',
          label: 'Docs Hub',
          path: '/docs',
          icon: <BookOpenIcon size={18} />
        },
        {
          id: 'docs-view',
          label: 'Doc Viewer',
          path: '/docs/view',
          icon: <FileTextIcon size={18} />
        },
        {
          id: 'docs-site',
          label: 'Site Manager',
          path: '/docs/manage/site-config',
          icon: <SettingsIcon size={18} />
        },
        {
          id: 'docs-topology',
          label: 'System Topology',
          path: '/docs/topology',
          icon: <LayoutGridIcon size={18} className="text-emerald-400" />
        },
        {
          id: 'docs-adrs',
          label: 'Decision Log',
          path: '/docs/adrs',
          icon: <HistoryIcon size={18} className="text-indigo-300" />
        },
        {
          id: 'docs-glossary',
          label: 'Domain Dictionary',
          path: '/docs/glossary',
          icon: <BookOpenIcon size={18} className="text-indigo-300" />
        },
        {
          id: 'docs-learning',
          label: 'Learning Paths',
          path: '/docs/learning',
          icon: <BookOpenIcon size={18} />
        },
        {
          id: 'docs-health',
          label: 'Doc Health',
          path: '/docs/analytics',
          icon: <HistoryIcon size={18} className="text-red-400" />
        },
        {
          id: 'docs-api',
          label: 'API Explorer',
          path: '/docs/api-explorer',
          icon: <ZapIcon size={18} className="text-amber-400" />
        }
      ]
    },
    {
      id: 'agents',
      label: 'Agents & Automation',
      items: [
        {
          id: 'agents-overview',
          label: 'Agents Overview',
          path: '/agents',
          icon: <SparklesIcon size={18} />
        },
        {
          id: 'agents-fleet',
          label: 'Agent Fleet',
          path: '/agents/fleet',
          icon: <UserIcon size={18} className="text-indigo-300" />
        },
        {
          id: 'agents-missions',
          label: 'Mission Control',
          path: '/agents/missions',
          icon: <ActivityIcon size={18} className="text-amber-400" />
        },
        {
          id: 'agents-analytics',
          label: 'Agent Analytics',
          path: '/agents/analytics',
          icon: <ZapIcon size={18} className="text-amber-400" />
        },
        {
          id: 'agents-traceability',
          label: 'Traceability Matrix',
          path: '/agents/traceability',
          icon: <GitBranchIcon size={18} className="text-indigo-300" />
        },
        {
          id: 'agents-conflicts',
          label: 'Gap Radar',
          path: '/agents/conflicts',
          icon: <ActivityIcon size={18} className="text-red-400" />
        },
        {
          id: 'agents-debt',
          label: 'Debt Radar',
          path: '/agents/debt',
          icon: <HistoryIcon size={18} className="text-amber-400" />
        },
        {
          id: 'agents-guardrails',
          label: 'Safety Hub',
          path: '/agents/governance',
          icon: <ShieldIcon size={18} className="text-red-400" />
        },
        {
          id: 'agents-knowledge',
          label: 'Knowledge Base',
          path: '/agents/knowledge',
          icon: <HardDriveIcon size={18} className="text-indigo-300" />
        },
        {
          id: 'agents-skills',
          label: 'Skill Studio',
          path: '/agents/skills',
          icon: <CodeIcon size={18} className="text-indigo-300" />
        },
        {
          id: 'agents-training',
          label: 'Fine-Tuning',
          path: '/agents/training',
          icon: <SparklesIcon size={18} className="text-indigo-300" />
        },
        {
          id: 'agents-evals',
          label: 'Gymnasium',
          path: '/agents/evals',
          icon: <ActivityIcon size={18} className="text-amber-400" />
        },
        {
          id: 'agents-squads',
          label: 'Squads',
          path: '/agents/squads',
          icon: <UserIcon size={18} className="text-indigo-300" />
        },
        {
          id: 'agents-plugins',
          label: 'Plugin Marketplace',
          path: '/agents/plugins',
          icon: <LinkIcon size={18} className="text-indigo-300" />
        },
        {
          id: 'agents-orchestrator',
          label: 'Orchestrator',
          path: '/extensions/orchestrator',
          icon: <ActivityIcon size={18} className="text-indigo-300" />
        }
      ]
    },
    {
      id: 'ecosystem',
      label: 'Ecosystem',
      items: [
        {
          id: 'extensions',
          label: 'Extensions',
          path: '/extensions',
          icon: <LayoutGridIcon size={18} />
        },
        {
          id: 'extensions-manager',
          label: 'Extension Manager',
          path: '/extensions/installed',
          icon: <SettingsIcon size={18} />
        },
        {
          id: 'extensions-builder',
          label: 'Extension Builder',
          path: '/extensions/builder',
          icon: <CodeIcon size={18} />
        },
        {
          id: 'extensions-stacks',
          label: 'Extension Stacks',
          path: '/extensions/stacks',
          icon: <PackageIcon size={18} />
        },
        {
          id: 'extensions-themes',
          label: 'Theme Studio',
          path: '/extensions/themes',
          icon: <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
        },
        {
          id: 'extensions-models',
          label: 'Model Registry',
          path: '/extensions/models',
          icon: <CpuIcon size={18} />
        },
        {
          id: 'extensions-accounts',
          label: 'Service Accounts',
          path: '/extensions/accounts',
          icon: <UserIcon size={18} />
        },
        {
          id: 'extensions-snippets',
          label: 'Snippets',
          path: '/extensions/snippets',
          icon: <ScissorsIcon size={16} />
        },
        {
          id: 'extensions-references',
          label: 'References',
          path: '/extensions/references',
          icon: <BookOpenIcon size={18} />
        },
        {
          id: 'extensions-firewall',
          label: 'Privacy Firewall',
          path: '/extensions/firewall',
          icon: <GlobeIcon size={18} />
        },
        {
          id: 'prompt-lab',
          label: 'Prompt Lab',
          path: '/playground',
          icon: <ZapIcon size={18} className="text-amber-400" />
        }
      ]
    },
    {
      id: 'system',
      label: 'System & Account',
      items: [
        {
          id: 'global-preferences',
          label: 'Preferences',
          path: '/settings',
          icon: <SettingsIcon size={18} />
        },
        {
          id: 'billing',
          label: 'Billing',
          path: '/settings/billing',
          icon: <CreditCardIcon size={18} />
        },
        {
          id: 'org-admin',
          label: 'Org Admin',
          path: '/organization/admin',
          icon: <ShieldIcon size={18} className="text-purple-400" />
        },
        {
          id: 'security',
          label: 'Security Audit',
          path: '/system/security',
          icon: <ShieldIcon size={18} className="text-indigo-300" />
        },
        {
          id: 'updates',
          label: 'Updates',
          path: '/system/about',
          icon: <HistoryIcon size={18} className="text-slate-300" />
        },
        {
          id: 'health',
          label: 'System Health',
          path: '/system/health',
          icon: <ActivityIcon size={18} className="text-emerald-400" />
        },
        {
          id: 'storage',
          label: 'Storage Manager',
          path: '/system/storage',
          icon: <HardDriveIcon size={18} className="text-indigo-300" />
        },
        {
          id: 'privacy',
          label: 'Privacy Center',
          path: '/system/privacy',
          icon: <LockIcon size={18} className="text-emerald-400" />
        },
        {
          id: 'keymaps',
          label: 'Keymaps',
          path: '/settings/keybindings',
          paths: ['/settings/keybindings', '/extensions/keymaps'],
          icon: <CodeIcon size={18} className="text-slate-300" />
        },
        {
          id: 'help',
          label: 'Help & Support',
          path: '/help',
          icon: <HelpCircleIcon size={18} />
        }
      ]
    },
    {
      id: 'archive',
      label: 'ARCHIVE',
      defaultOpen: false,
      items: [
        {
          id: 'workflow-openapi',
          label: 'SDS -> OpenAPI',
          path: '/docs/api-explorer',
          icon: <ZapIcon size={18} className="text-amber-400" />
        },
        {
          id: 'workflow-create-tasks',
          label: 'Create Tasks',
          path: '/project/backlog/generator',
          icon: <ListTreeIcon size={18} className="text-emerald-400" />
        },
        {
          id: 'workflow-kanban',
          label: 'Kanban Board',
          path: '/tasks/board',
          icon: <LayoutGridIcon size={18} className="text-slate-300" />
        }
      ]
    }
  ];

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    sections.reduce<Record<string, boolean>>((acc, section) => {
      acc[section.id] = section.defaultOpen ?? false;
      return acc;
    }, {})
  );

  const [openItems, setOpenItems] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children?.length) {
          initial[item.id] = item.defaultOpen ?? false;
        }
      });
    });
    return initial;
  });

  const isItemActive = (item: NavItem) => {
    const paths = item.paths ?? [item.path];
    const isActive = paths.some((path) => path === activePath);
    const isChildActive = item.children?.some(isItemActive) ?? false;
    return isActive || isChildActive;
  };

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside
      className={`relative flex flex-col h-screen bg-slate-800 border-r border-slate-700 transition-all duration-300 ease-in-out z-20 ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
    >
      <div className="flex items-center h-14 px-4 border-b border-slate-700">
        <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
          <span className="text-white font-bold font-mono">M</span>
        </div>
        <div className={`ml-3 overflow-hidden transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
          <span className="font-semibold text-slate-100 whitespace-nowrap">Master Coda</span>
        </div>
      </div>

      <nav className="flex-1 py-4 space-y-4 px-2 overflow-y-auto custom-scrollbar">
        {sections.map((section, index) => {
          const isSectionActive = section.items.some(isItemActive);
          const isSectionOpen = !isExpanded ? true : openSections[section.id] || isSectionActive;

          return (
            <div key={section.id} className={index === 0 ? '' : 'pt-2 border-t border-slate-700/60'}>
              {isExpanded && (
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`w-full flex items-center justify-start text-left px-2 py-1 text-[10px] uppercase tracking-widest font-semibold transition-colors ${
                    isSectionActive ? 'text-indigo-300' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <span className="flex-1 text-left">{section.label}</span>
                  <ChevronDownIcon
                    size={12}
                    className={`transition-transform ${isSectionOpen ? 'rotate-0' : '-rotate-90'}`}
                  />
                </button>
              )}

              {isSectionOpen && (
                <div className={`${isExpanded ? 'mt-2 space-y-1' : 'space-y-2'}`}>
                  {section.items.map((item) => {
                    const isActive = isItemActive(item);
                    const hasChildren = Boolean(item.children?.length);
                    const isOpen = isActive ? true : (openItems[item.id] ?? false);
                    return (
                      <div key={item.id} className={hasChildren ? 'space-y-1' : ''}>
                        <button
                          onClick={() => setActivePath(item.path)}
                          className={`group flex items-center justify-start text-left w-full py-2 rounded-md transition-all ${item.indent ? 'pl-8 pr-2' : 'px-2'} ${
                            isActive
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
                            className={`ml-3 text-sm font-medium transition-all duration-300 whitespace-nowrap overflow-hidden flex-1 flex items-center ${
                              isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                            }`}
                          >
                            <span className="flex-1">{item.label}</span>
                            {item.badge !== undefined && item.badge > 0 && (
                              <span className="bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-2">
                                {item.badge}
                              </span>
                            )}
                            {hasChildren && isExpanded && (
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleItem(item.id);
                                }}
                                className="ml-2 text-slate-500 hover:text-slate-200 transition-colors"
                              >
                                <ChevronDownIcon
                                  size={12}
                                  className={`transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`}
                                />
                              </span>
                            )}
                          </span>
                        </button>
                        {hasChildren && isExpanded && isOpen && (
                          <div className="space-y-1">
                            {item.children?.map((child) => {
                              const isChildActive = isItemActive(child);
                              return (
                                <button
                                  key={child.id}
                                  onClick={() => setActivePath(child.path)}
                                  className={`group flex items-center justify-start text-left w-full py-2 rounded-md transition-all ${child.indent ? 'pl-8 pr-2' : 'px-2'} ${
                                    isChildActive
                                      ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500'
                                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-100 border-l-2 border-transparent'
                                  }`}
                                  title={!isExpanded ? child.label : undefined}
                                >
                                  <span className="shrink-0 relative">
                                    {child.icon}
                                    {child.badge !== undefined && child.badge > 0 && !isExpanded && (
                                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full border border-slate-800" />
                                    )}
                                  </span>
                                  <span
                                    className={`ml-3 text-sm font-medium transition-all duration-300 whitespace-nowrap overflow-hidden flex-1 flex items-center ${
                                      isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                                    }`}
                                  >
                                    <span className="flex-1">{child.label}</span>
                                    {child.badge !== undefined && child.badge > 0 && (
                                      <span className="bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-2">
                                        {child.badge}
                                      </span>
                                    )}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-20 bg-slate-700 border border-slate-600 rounded-full p-1 text-slate-400 hover:text-white hover:bg-indigo-600 transition-colors"
      >
        <ChevronRightIcon size={12} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      <div className="p-3 border-t border-slate-700">
        <div className="flex items-center px-2 py-2">
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
