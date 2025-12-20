
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import OmniDrawer from './components/OmniDrawer';
import CommandPalette from './components/CommandPalette';
import Dashboard from './components/Dashboard';
import Plan from './components/Plan';
import Execution from './components/Execution';
import Review from './components/Review';
import SourceControl from './components/SourceControl';
import ConflictResolver from './components/ConflictResolver';
import IntroCarousel from './components/IntroCarousel';
import SystemCheck from './components/SystemCheck';
import CliConfig from './components/CliConfig';
import SecureStorage from './components/SecureStorage';
import ConnectAgent from './components/ConnectAgent';
import PrivacySettings from './components/PrivacySettings';
import RecentProjects from './components/RecentProjects';
import UpdateRequired from './components/UpdateRequired';
import CreateWorkspaceLocation from './components/CreateWorkspaceLocation';
import CreateWorkspaceDetails from './components/CreateWorkspaceDetails';
import CreateWorkspaceDefaults from './components/CreateWorkspaceDefaults';
import InitializingWorkspace from './components/InitializingWorkspace';
import WorkspaceReady from './components/WorkspaceReady';
import ValidatingWorkspace from './components/ValidatingWorkspace';
import DatabaseMigration from './components/DatabaseMigration';
import InvalidWorkspace, { WorkspaceErrorType } from './components/InvalidWorkspace';
import CreateTaskModal from './components/CreateTaskModal';
import TaskDetailView from './components/TaskDetailView';
import ProjectSettings from './components/ProjectSettings';
import GlobalPreferences from './components/GlobalPreferences'; 
import BillingSettings from './components/BillingSettings'; 
import AboutUpdates from './components/AboutUpdates'; // SY-06
import SecurityAudit from './components/SecurityAudit'; // SY-07
import OrgAdminConsole from './components/OrgAdminConsole'; // SY-08
import SystemHealth from './components/SystemHealth'; // SY-09
import StorageManager from './components/StorageManager'; // SY-10
import PrivacyCenter from './components/PrivacyCenter'; // SY-11
import Documentation from './components/Documentation';
import DocsHub from './components/DocsHub'; 
import DocEditor from './components/DocEditor'; 
import DocSiteManager from './components/DocSiteManager'; 
import ApiExplorer from './components/ApiExplorer'; 
import SystemTopology from './components/SystemTopology'; 
import DecisionLog from './components/DecisionLog'; 
import LearningPaths from './components/LearningPaths'; 
import DomainDictionary from './components/DomainDictionary'; 
import DocsAnalytics from './components/DocsAnalytics'; 
import Agents from './components/Agents';
import AgentFleet from './components/AgentFleet'; 
import AgentProfile from './components/AgentProfile'; 
import AgentStudio from './components/AgentStudio'; 
import AgentGym from './components/AgentGym'; 
import SquadComposer from './components/SquadComposer'; 
import AgentGuardrails from './components/AgentGuardrails'; 
import MissionControl from './components/MissionControl'; 
import AgentAnalytics from './components/AgentAnalytics'; 
import KnowledgeManager from './components/KnowledgeManager'; 
import SkillStudio from './components/SkillStudio'; 
import AgentTraining from './components/AgentTraining'; 
import PluginMarketplace from './components/PluginMarketplace'; 
import DiscoveryWizard from './components/DiscoveryWizard'; // AG-13
import TraceabilityMatrix from './components/TraceabilityMatrix'; // AG-14
import MilestoneApproval from './components/MilestoneApproval'; // AG-15
import NotificationCenter from './components/NotificationCenter'; // SY-04
import Analytics from './components/Analytics';
import Playbooks from './components/Playbooks';
import QualityHub from './components/QualityHub';
import ReleaseManager from './components/ReleaseManager';
import Extensions from './components/Extensions'; 
import ModelRegistry from './components/ModelRegistry'; 
import ServiceAccounts from './components/ServiceAccounts'; 
import ReferenceLibrary from './components/ReferenceLibrary'; 
import NetworkFirewall from './components/NetworkFirewall'; 
import AgentOrchestrator from './components/AgentOrchestrator'; 
import ExtensionManager from './components/ExtensionManager'; 
import ExtensionSettings from './components/ExtensionSettings';
import ExtensionBuilder from './components/ExtensionBuilder'; 
import ExtensionStacks from './components/ExtensionStacks'; 
import ThemeStudio from './components/ThemeStudio'; 
import SnippetStudio from './components/SnippetStudio'; 
import KeymapManager from './components/KeymapManager'; 
import PromptPlayground from './components/PromptPlayground'; 
import HelpSupport from './components/HelpSupport'; // SY-05
import { OmniDrawerState } from './types';
import { CommandIcon, BellIcon, ShieldIcon } from './components/Icons';
import { MOCK_NOTIFICATIONS } from './constants';

type AppStep = 'intro' | 'system-check' | 'cli-config' | 'secure-storage' | 'connect-agent' | 'privacy-settings' | 'recent-projects' | 'update-required' | 'create-project-location' | 'create-project-details' | 'create-project-defaults' | 'initializing-workspace' | 'workspace-ready' | 'validating-workspace' | 'database-migration' | 'invalid-workspace' | 'dashboard';

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('intro');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [drawerState, setDrawerState] = useState<OmniDrawerState>('open');
  const [activePath, setActivePath] = useState('/');
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [taskDetailId, setTaskDetailId] = useState<string | null>(null);
  const [isZeroRetentionActive, setIsZeroRetentionActive] = useState(false);
  
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => n.status === 'unread').length;

  // Execution Context
  const [executionTaskId, setExecutionTaskId] = useState<string | null>(null);

  // Validation Error State for ON-16
  const [validationError, setValidationError] = useState<{ type: WorkspaceErrorType; path: string } | null>(null);

  // Temporary state to hold wizard data
  const [newProjectData, setNewProjectData] = useState<{ 
      path?: string; 
      name?: string; 
      key?: string; 
      docdex?: string; 
      gitignore?: boolean;
      agentId?: string;
      qaProfile?: string;
  }>({});

  // Keyboard shortcut listener for Cmd+K and Drawer toggle (Cmd+J)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K: Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdKOpen(prev => !prev);
      }
      // Cmd+Shift+N: Notifications
      // Fix: Added missing 'e.' prefix to shiftKey
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'n') {
        e.preventDefault();
        setActivePath('/notifications');
      }
      // Cmd+J: Toggle Terminal (Standard -> Collapsed -> Standard)
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        setDrawerState(prev => prev === 'open' ? 'collapsed' : 'open');
      }
      // Cmd+N: New Task (Global)
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 'n') {
        e.preventDefault();
        setIsCreateTaskOpen(true);
      }
      // Cmd+, : Settings (Global)
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setActivePath('/settings');
      }
      // Esc: Close Detail
      if (e.key === 'Escape' && taskDetailId) {
        setTaskDetailId(null);
      }
      // G then T: Go Tests (Quality Hub)
      if (e.key === 't' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        setActivePath('/quality');
      }
      // Cmd+K Cmd+S: Keybindings
      if ((e.metaKey || e.ctrlKey) && e.key === 's' && isCmdKOpen) {
          e.preventDefault();
          setIsCmdKOpen(false);
          setActivePath('/settings/keybindings');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [taskDetailId, isCmdKOpen]);

  // Global navigation listener for extension shortcuts
  useEffect(() => {
    const handler = (e: any) => setActivePath(e.detail);
    window.addEventListener('app-navigate', handler);
    return () => window.removeEventListener('app-navigate', handler);
  }, []);

  const handleTaskCreate = (task: any) => {
    console.log('Task Created Globally:', task);
  };

  const handleExecuteTask = (taskId: string) => {
    setExecutionTaskId(taskId);
    setTaskDetailId(null); // Close detail when starting execution
    setActivePath('/exec');
  };

  if (currentStep === 'intro') {
    return (
      <IntroCarousel 
        onFinish={() => setCurrentStep('system-check')} 
        onSkip={() => setCurrentStep('dashboard')} 
      />
    );
  }

  if (currentStep === 'system-check') { return <SystemCheck onBack={() => setCurrentStep('intro')} onNext={() => setCurrentStep('cli-config')} />; }
  if (currentStep === 'cli-config') { return <CliConfig onBack={() => setCurrentStep('system-check')} onNext={() => setCurrentStep('secure-storage')} />; }
  if (currentStep === 'secure-storage') { return <SecureStorage onBack={() => setCurrentStep('cli-config')} onNext={() => setCurrentStep('connect-agent')} />; }
  if (currentStep === 'connect-agent') { return <ConnectAgent onBack={() => setCurrentStep('secure-storage')} onNext={() => setCurrentStep('privacy-settings')} />; }
  if (currentStep === 'privacy-settings') { return <PrivacySettings onBack={() => setCurrentStep('connect-agent')} onNext={() => setCurrentStep('recent-projects')} />; }
  
  if (currentStep === 'recent-projects') {
    return (
      <RecentProjects 
        onOpenProject={(path) => {
          setNewProjectData({ path }); 
          setCurrentStep('validating-workspace');
        }}
        onCreateNew={() => setCurrentStep('create-project-location')}
        onVersionMismatch={() => setCurrentStep('update-required')}
      />
    );
  }

  if (currentStep === 'validating-workspace') {
    return (
      <ValidatingWorkspace
        path={newProjectData.path || '~/unknown/project'}
        onComplete={() => setCurrentStep('dashboard')}
        onCancel={() => setCurrentStep('recent-projects')}
        onMigrationNeeded={() => setCurrentStep('database-migration')}
        onError={(type) => {
           setValidationError({ type, path: newProjectData.path || '' });
           setCurrentStep('invalid-workspace');
        }}
      />
    );
  }

  if (currentStep === 'invalid-workspace') {
    return (
      <InvalidWorkspace 
        errorType={validationError?.type || 'not_workspace'}
        path={validationError?.path || ''}
        onBack={() => setCurrentStep('recent-projects')}
        onRemoveFromRecent={() => { setCurrentStep('recent-projects'); }}
        onInitialize={() => { setCurrentStep('create-project-location'); }}
        onRetry={() => setCurrentStep('validating-workspace')}
        onBrowse={() => { setCurrentStep('recent-projects'); }}
        onOpenConfig={() => { alert('Simulated: Opening config.json in default editor'); }}
      />
    );
  }

  if (currentStep === 'database-migration') { return <DatabaseMigration onComplete={() => setCurrentStep('dashboard')} onCancel={() => setCurrentStep('recent-projects')} />; }
  if (currentStep === 'update-required') { return <UpdateRequired onFixed={() => setCurrentStep('recent-projects')} />; }
  if (currentStep === 'create-project-location') { return <CreateWorkspaceLocation onBack={() => setCurrentStep('recent-projects')} onNext={(path) => { setNewProjectData(prev => ({ ...prev, path })); setCurrentStep('create-project-details'); }} />; }
  if (currentStep === 'create-project-details') { return <CreateWorkspaceDetails onBack={() => setCurrentStep('create-project-location')} onNext={(details: any) => { setNewProjectData(prev => ({ ...prev, ...details })); setCurrentStep('create-project-defaults'); }} />; }
  /* Fix: Corrected typo where 'details' was used instead of 'defaults' in the onNext callback. */
  if (currentStep === 'create-project-defaults') { return <CreateWorkspaceDefaults onBack={() => setCurrentStep('create-project-details')} onNext={(defaults: any) => { setNewProjectData(prev => ({ ...prev, ...defaults })); setCurrentStep('initializing-workspace'); }} projectSummary={newProjectData} />; }
  if (currentStep === 'initializing-workspace') { return <InitializingWorkspace config={newProjectData} onNext={() => setCurrentStep('workspace-ready')} onCancel={() => setCurrentStep('create-project-defaults')} />; }
  if (currentStep === 'workspace-ready') { return <WorkspaceReady workspacePath={newProjectData.path} onNext={() => setCurrentStep('dashboard')} />; }

  if (activePath === '/conflict') {
    return <ConflictResolver onBack={() => setActivePath('/source')} />;
  }

  const contentPaddingClass = 
    drawerState === 'open' ? 'pb-[300px]' : 
    drawerState === 'collapsed' ? 'pb-[32px]' : 
    drawerState === 'maximized' ? 'pb-0' : 
    'pb-0'; 

  const renderContent = () => {
    if (activePath === '/') return <Dashboard onCreateTask={() => setIsCreateTaskOpen(true)} />;
    if (activePath === '/notifications') return <NotificationCenter />; 
    if (activePath === '/help') return <HelpSupport />; 
    if (activePath === '/system/about') return <AboutUpdates />; 
    if (activePath === '/system/security') return <SecurityAudit />; // SY-07
    if (activePath === '/organization/admin') return <OrgAdminConsole />; // SY-08
    if (activePath === '/system/health') return <SystemHealth />; // SY-09
    if (activePath === '/system/storage') return <StorageManager />; // SY-10
    if (activePath === '/system/privacy') return <PrivacyCenter isZeroRetention={isZeroRetentionActive} setIsZeroRetention={setIsZeroRetentionActive} />; // SY-11
    if (activePath === '/inbox') return <NotificationCenter />; 
    if (activePath === '/analytics') return <Analytics />;
    if (activePath === '/agents/analytics') return <AgentAnalytics />;
    if (activePath === '/agents/traceability') return <TraceabilityMatrix />;
    if (activePath === '/agents/signoff') return <MilestoneApproval />; // AG-15
    if (activePath === '/quality') return <QualityHub />;
    if (activePath === '/extensions/orchestrator') return <AgentOrchestrator />;
    if (activePath === '/agents/governance') return <AgentGuardrails />; 
    if (activePath === '/agents/missions') return <MissionControl />; 
    if (activePath === '/agents/training') return <AgentTraining />; 
    if (activePath === '/agents/plugins') return <PluginMarketplace />; 
    if (activePath === '/agents/discovery') return <DiscoveryWizard />; // AG-13
    if (activePath === '/agents/knowledge') return <KnowledgeManager />; 
    if (activePath === '/agents/skills') return <SkillStudio />; 
    if (activePath === '/agents/evals') return <AgentGym />; 
    if (activePath === '/agents/squads') return <SquadComposer />; 
    if (activePath === '/extensions/firewall') return <NetworkFirewall />;
    if (activePath === '/docs/topology') return <SystemTopology />; 
    if (activePath === '/docs/adrs') return <DecisionLog />; 
    if (activePath === '/docs/glossary') return <DomainDictionary />; 
    if (activePath === '/docs/learning') return <LearningPaths />; 
    if (activePath === '/docs/analytics') return <DocsAnalytics />; 
    if (activePath === '/releases') return <ReleaseManager />;
    if (activePath === '/extensions') return <Extensions />;
    if (activePath === '/playground') return <PromptPlayground />; 
    if (activePath === '/extensions/references') return <ReferenceLibrary />;
    if (activePath === '/extensions/models') return <ModelRegistry />;
    if (activePath === '/extensions/accounts') return <ServiceAccounts />;
    if (activePath === '/extensions/snippets') return <SnippetStudio />;
    if (activePath === '/extensions/keymaps' || activePath === '/settings/keybindings') return <KeymapManager />;
    if (activePath === '/extensions/stacks') return <ExtensionStacks />;
    if (activePath === '/extensions/themes') return <ThemeStudio />;
    if (activePath === '/extensions/installed') return <ExtensionManager />;
    if (activePath === '/extensions/builder') return <ExtensionBuilder />;
    if (activePath.startsWith('/extensions/settings/')) {
        const extId = activePath.split('/').pop();
        return <ExtensionSettings extensionId={extId || ''} onBack={() => setActivePath('/extensions/installed')} />;
    }
    if (activePath === '/playbooks') return <Playbooks />;
    if (activePath === '/plan') return <Plan onCreateTask={() => setIsCreateTaskOpen(true)} onExecuteTask={handleExecuteTask} onTaskClick={setTaskDetailId} />;
    if (activePath === '/exec') return <Execution taskId={executionTaskId} onBack={() => setActivePath('/plan')} />;
    if (activePath === '/review') return <Review />;
    if (activePath === '/agents/fleet') return <AgentFleet />; 
    if (activePath.startsWith('/agents/') && activePath.endsWith('/profile')) {
      const parts = activePath.split('/');
      const agentId = parts[2];
      return <AgentProfile agentId={agentId} onBack={() => setActivePath('/agents/fleet')} />;
    }
    if (activePath.startsWith('/agents/manage/')) {
        const parts = activePath.split('/');
        const agentId = parts[3];
        return <AgentStudio agentId={agentId} onBack={() => setActivePath('/agents/fleet')} />;
    }
    if (activePath === '/agents') return <Agents />;
    if (activePath === '/docs') return <DocsHub />; 
    if (activePath === '/docs/view') return <Documentation />; 
    if (activePath.startsWith('/docs/edit')) return <DocEditor onBack={() => setActivePath('/docs')} />;
    if (activePath === '/docs/manage/site-config') return <DocSiteManager />;
    if (activePath === '/docs/api-explorer') return <ApiExplorer />; 
    if (activePath === '/source') return <SourceControl onConflictSimulate={() => setActivePath('/conflict')} />;
    if (activePath === '/settings') return <GlobalPreferences />; 
    if (activePath === '/settings/billing') return <BillingSettings />; 
    if (activePath === '/settings/project') return <ProjectSettings />;
    
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        <p>Section under construction: {activePath}</p>
      </div>
    );
  };

  const getBreadcrumb = () => {
    if (activePath === '/') return 'Workspace / Dashboard';
    if (activePath === '/notifications' || activePath === '/inbox') return 'System / Notification Center';
    if (activePath === '/help') return 'System / Help & Support';
    if (activePath === '/system/about') return 'System / About Master Coda';
    if (activePath === '/system/security') return 'System / Security & Audit';
    if (activePath === '/system/health') return 'System / Health & Diagnostics';
    if (activePath === '/system/storage') return 'System / Storage Manager';
    if (activePath === '/system/privacy') return 'System / Privacy & AI Governance';
    if (activePath === '/organization/admin') return 'Organization / Administration';
    if (activePath === '/analytics') return 'Workspace / Insights';
    if (activePath === '/agents/analytics') return 'Agents / ROI Analytics';
    if (activePath === '/agents/traceability') return 'Agents / Traceability Matrix';
    if (activePath === '/agents/signoff') return 'Agents / Milestone Approval';
    if (activePath === '/orchestrator') return 'Workspace / Orchestrator';
    if (activePath === '/agents/governance') return 'Workspace / Safety Hub';
    if (activePath === '/agents/missions') return 'Workspace / Mission Control';
    if (activePath === '/agents/discovery') return 'Workspace / Discovery Wizard';
    if (activePath === '/agents/training') return 'Workspace / Fine-Tuning';
    if (activePath === '/agents/plugins') return 'Agents / Integrations';
    if (activePath === '/agents/knowledge') return 'Workspace / Knowledge Base';
    if (activePath === '/agents/skills') return 'Agents / Skill Studio';
    if (activePath === '/agents/evals') return 'Workspace / Gymnasium';
    if (activePath === '/agents/squads') return 'Workspace / Squad Composer';
    if (activePath === '/quality') return 'Workspace / Quality Hub';
    if (activePath === '/extensions/firewall') return 'Workspace / Privacy Firewall';
    if (activePath === '/docs/topology') return 'Documentation / System Topology';
    if (activePath === '/docs/adrs') return 'Governance / Decision Log';
    if (activePath === '/docs/glossary') return 'Documentation / Domain Dictionary';
    if (activePath === '/docs/learning') return 'Documentation / Learning Paths';
    if (activePath === '/docs/analytics') return 'Documentation / Health & Analytics';
    if (activePath === '/releases') return 'Workspace / Releases';
    if (activePath === '/extensions') return 'Ecosystem / Extensions';
    if (activePath === '/playground') return 'Ecosystem / Prompt Lab';
    if (activePath === '/extensions/references') return 'Ecosystem / References';
    if (activePath === '/extensions/models') return 'Ecosystem / Brain Center';
    if (activePath === '/extensions/accounts') return 'Ecosystem / Service Accounts';
    if (activePath === '/extensions/snippets') return 'Ecosystem / Extensions / Snippets';
    if (activePath === '/settings/keybindings') return 'System / Keyboard Shortcuts';
    if (activePath === '/extensions/keymaps') return 'Ecosystem / Extensions / Keymaps';
    if (activePath === '/extensions/stacks') return 'Ecosystem / Extensions / Stacks';
    if (activePath === '/extensions/themes') return 'Ecosystem / Personalization / Theme Studio';
    if (activePath === '/extensions/installed') return 'Ecosystem / Extensions / Manager';
    if (activePath === '/extensions/builder') return 'Ecosystem / Extensions / Builder';
    if (activePath.startsWith('/extensions/settings/')) return 'Ecosystem / Extensions / Settings';
    if (activePath === '/playbooks') return 'Workspace / Playbooks';
    if (activePath === '/plan') return 'Workspace / Plan';
    if (activePath === '/exec') return `Workspace / Execute / ${executionTaskId || 'Select Task'}`;
    if (activePath === '/review') return 'Workspace / Code Review';
    if (activePath === '/agents/fleet') return 'Workspace / Agent Fleet';
    if (activePath.includes('/profile')) return 'Workspace / Agent Profile';
    if (activePath.includes('/manage')) return 'Workspace / Agent Studio';
    if (activePath === '/agents') return 'Workspace / Agents';
    if (activePath === '/docs') return 'Workspace / Documentation Hub';
    if (activePath.startsWith('/docs/edit')) return 'Workspace / Document Editor';
    if (activePath === '/docs/manage/site-config') return 'Workspace / Documentation / Site Manager';
    if (activePath === '/docs/api-explorer') return 'Workspace / Documentation / API Explorer';
    if (activePath === '/source') return 'Workspace / Source Control';
    if (activePath === '/settings') return 'User / Global Preferences';
    if (activePath === '/settings/billing') return 'Account / Billing & Subscription';
    if (activePath === '/settings/project') return 'Workspace / Project Settings';
    return `Workspace ${activePath}`;
  };

  const skipDrawerPaths = ['/settings', '/docs', '/exec', '/docs/view', '/docs/edit', '/agents', '/playbooks', '/quality', '/releases', '/extensions', '/playground', '/extensions/references', '/extensions/models', '/extensions/installed', '/extensions/builder', '/extensions/stacks', '/extensions/themes', '/extensions/snippets', '/extensions/keymaps', '/extensions/accounts', '/extensions/firewall', '/extensions/orchestrator', '/docs/manage/site-config', '/docs/api-explorer', '/docs/topology', '/docs/adrs', '/docs/learning', '/docs/glossary', '/docs/analytics', '/agents/training', '/agents/plugins', '/agents/discovery', '/settings/keybindings', '/notifications', '/help', '/system/about', '/system/security', '/organization/admin', '/system/health', '/system/storage', '/system/privacy', '/agents/traceability', '/agents/signoff'];
  const showHeader = !skipDrawerPaths.some(p => activePath.startsWith(p)) || activePath.startsWith('/extensions/settings/');

  return (
    <div className="flex h-screen w-screen bg-slate-900 text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      <Sidebar 
        isExpanded={activePath !== '/exec' && !activePath.startsWith('/docs/edit') && isSidebarExpanded} 
        setIsExpanded={setIsSidebarExpanded}
        activePath={activePath}
        setActivePath={setActivePath}
      />

      <main className="flex-1 flex flex-col relative overflow-hidden transition-all duration-300">
        
        {showHeader && ( 
          <header className="h-10 flex items-center px-6 border-b border-slate-800 bg-slate-900/90 backdrop-blur z-10 shrink-0">
            <div className="flex items-center text-xs text-slate-500 font-medium space-x-2">
               <span className="hover:text-slate-300 cursor-pointer transition-colors" onClick={() => setActivePath('/')}>Master Coda</span>
               <span>/</span>
               <span className="text-slate-200">{getBreadcrumb()}</span>
            </div>
            <div className="ml-auto flex items-center space-x-3">
               {/* Quick Telemetry Summary */}
               <button 
                 onClick={() => setActivePath('/system/health')}
                 className="flex items-center space-x-4 px-3 py-1 rounded bg-slate-800/40 border border-slate-800 hover:border-indigo-500/30 transition-all text-[10px] font-mono"
               >
                  <div className="flex items-center">
                    <span className="text-slate-500 mr-1.5 uppercase font-bold">CPU</span>
                    <span className="text-indigo-400">24%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-500 mr-1.5 uppercase font-bold">RAM</span>
                    <span className="text-emerald-400">4.2GB</span>
                  </div>
               </button>

               <div className="h-4 w-px bg-slate-800 mx-1" />

               {/* SY-11 Shield Glow */}
               {isZeroRetentionActive && (
                  <button 
                    onClick={() => setActivePath('/system/privacy')}
                    className="p-1.5 rounded-full bg-emerald-500/10 text-emerald-500 animate-pulse border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                    title="Zero-Retention Privacy Mode Active"
                  >
                     <ShieldIcon size={14} />
                  </button>
               )}

               <button 
                 onClick={() => setIsCreateTaskOpen(true)}
                 className="flex items-center space-x-1.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-xs text-slate-400"
                 title="Create new task (Cmd+N)"
               >
                  <span className="font-bold">+</span>
                  <span className="ml-1 bg-slate-700 px-1 rounded text-[10px] font-mono border border-slate-600">⌘N</span>
               </button>

               <button 
                 onClick={() => setIsCmdKOpen(true)}
                 className="flex items-center space-x-1.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-xs text-slate-400"
               >
                  <CommandIcon size={10} />
                  <span>Search</span>
                  <span className="ml-2 bg-slate-700 px-1 rounded text-[10px] font-mono border border-slate-600">⌘K</span>
               </button>

               <div className="h-4 w-px bg-slate-800 mx-1" />

               <button 
                 onClick={() => setActivePath('/notifications')}
                 className={`relative p-1.5 rounded-lg transition-all ${activePath === '/notifications' ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
               >
                  <BellIcon size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full border border-slate-900 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                  )}
               </button>
            </div>
          </header>
        )}

        <div className={`flex-1 overflow-auto custom-scrollbar ${showHeader ? contentPaddingClass : ''} ${drawerState === 'maximized' ? 'overflow-hidden' : ''} transition-all duration-300`}>
           {renderContent()}
        </div>

        {showHeader && <OmniDrawer state={drawerState} onStateChange={setDrawerState} />}

      </main>

      <CommandPalette isOpen={isCmdKOpen} onClose={() => setIsCmdKOpen(false)} />
      <CreateTaskModal 
        isOpen={isCreateTaskOpen} 
        onClose={() => setIsCreateTaskOpen(false)} 
        onCreate={handleTaskCreate}
      />

      <TaskDetailView 
        taskId={taskDetailId} 
        onClose={() => setTaskDetailId(null)}
        onExecute={handleExecuteTask}
      />
      
    </div>
  );
}

export default App;
