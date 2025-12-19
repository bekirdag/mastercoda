
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
import Documentation from './components/Documentation';
import DocsHub from './components/DocsHub'; // Added for DO-01
import DocEditor from './components/DocEditor'; // Added for DO-03
import DocSiteManager from './components/DocSiteManager'; // Added for DO-04
import Agents from './components/Agents';
import Inbox from './components/Inbox';
import Analytics from './components/Analytics';
import Playbooks from './components/Playbooks';
import QualityHub from './components/QualityHub';
import ReleaseManager from './components/ReleaseManager';
import Extensions from './components/Extensions'; 
import ModelRegistry from './components/ModelRegistry'; // EX-10
import ServiceAccounts from './components/ServiceAccounts'; // EX-11
import ReferenceLibrary from './components/ReferenceLibrary'; // EX-12
import NetworkFirewall from './components/NetworkFirewall'; // EX-14
import AgentOrchestrator from './components/AgentOrchestrator'; // EX-15
import ExtensionManager from './components/ExtensionManager'; // EX-05
import ExtensionSettings from './components/ExtensionSettings';
import ExtensionBuilder from './components/ExtensionBuilder'; // EX-04
import ExtensionStacks from './components/ExtensionStacks'; // EX-06
import ThemeStudio from './components/ThemeStudio'; // EX-07
import SnippetStudio from './components/SnippetStudio'; // EX-08
import KeymapManager from './components/KeymapManager'; // EX-09
import { OmniDrawerState } from './types';
import { CommandIcon } from './components/Icons';

type AppStep = 'intro' | 'system-check' | 'cli-config' | 'secure-storage' | 'connect-agent' | 'privacy-settings' | 'recent-projects' | 'update-required' | 'create-project-location' | 'create-project-details' | 'create-project-defaults' | 'initializing-workspace' | 'workspace-ready' | 'validating-workspace' | 'database-migration' | 'invalid-workspace' | 'dashboard';

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('intro');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [drawerState, setDrawerState] = useState<OmniDrawerState>('open');
  const [activePath, setActivePath] = useState('/');
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [taskDetailId, setTaskDetailId] = useState<string | null>(null);
  
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
      // Cmd+J: Toggle Terminal (Standard -> Collapsed -> Standard)
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        setDrawerState(prev => prev === 'open' ? 'collapsed' : 'open');
      }
      // Cmd+N: New Task (Global)
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setIsCreateTaskOpen(true);
      }
      // Esc: Close Detail
      if (e.key === 'Escape' && taskDetailId) {
        setTaskDetailId(null);
      }
      // G then T: Go Tests (Quality Hub)
      if (e.key === 't' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        setActivePath('/quality');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [taskDetailId]);

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
  if (currentStep === 'create-project-details') { return <CreateWorkspaceDetails onBack={() => setCurrentStep('create-project-location')} onNext={(details) => { setNewProjectData(prev => ({ ...prev, ...details })); setCurrentStep('create-project-defaults'); }} />; }
  if (currentStep === 'create-project-defaults') { return <CreateWorkspaceDefaults onBack={() => setCurrentStep('create-project-details')} onNext={(defaults) => { setNewProjectData(prev => ({ ...prev, ...defaults })); setCurrentStep('initializing-workspace'); }} projectSummary={newProjectData} />; }
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
    if (activePath === '/inbox') return <Inbox />;
    if (activePath === '/analytics') return <Analytics />;
    if (activePath === '/quality') return <QualityHub />;
    if (activePath === '/extensions/orchestrator') return <AgentOrchestrator />;
    if (activePath === '/extensions/firewall') return <NetworkFirewall />;
    if (activePath === '/releases') return <ReleaseManager />;
    if (activePath === '/extensions') return <Extensions />;
    if (activePath === '/extensions/references') return <ReferenceLibrary />;
    if (activePath === '/extensions/models') return <ModelRegistry />;
    if (activePath === '/extensions/accounts') return <ServiceAccounts />;
    if (activePath === '/extensions/snippets') return <SnippetStudio />;
    if (activePath === '/extensions/keymaps') return <KeymapManager />;
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
    if (activePath === '/agents') return <Agents />;
    if (activePath === '/docs') return <DocsHub />; 
    if (activePath === '/docs/view') return <Documentation />; 
    if (activePath.startsWith('/docs/edit')) return <DocEditor onBack={() => setActivePath('/docs')} />;
    if (activePath === '/docs/manage/site-config') return <DocSiteManager />;
    if (activePath === '/source') return <SourceControl onConflictSimulate={() => setActivePath('/conflict')} />;
    if (activePath === '/settings') return <ProjectSettings />;
    
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        <p>Section under construction: {activePath}</p>
      </div>
    );
  };

  const getBreadcrumb = () => {
    if (activePath === '/') return 'Workspace / Dashboard';
    if (activePath === '/inbox') return 'Workspace / Inbox';
    if (activePath === '/analytics') return 'Workspace / Insights';
    if (activePath === '/orchestrator') return 'Workspace / Orchestrator';
    if (activePath === '/quality') return 'Workspace / Quality Hub';
    if (activePath === '/extensions/firewall') return 'Workspace / Privacy Firewall';
    if (activePath === '/releases') return 'Workspace / Releases';
    if (activePath === '/extensions') return 'Ecosystem / Extensions';
    if (activePath === '/extensions/references') return 'Ecosystem / References';
    if (activePath === '/extensions/models') return 'Ecosystem / Brain Center';
    if (activePath === '/extensions/accounts') return 'Ecosystem / Service Accounts';
    if (activePath === '/extensions/snippets') return 'Ecosystem / Extensions / Snippets';
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
    if (activePath === '/agents') return 'Workspace / Agents';
    if (activePath === '/docs') return 'Workspace / Documentation Hub';
    if (activePath.startsWith('/docs/edit')) return 'Workspace / Document Editor';
    if (activePath === '/docs/manage/site-config') return 'Workspace / Documentation / Site Manager';
    if (activePath === '/source') return 'Workspace / Source Control';
    if (activePath === '/settings') return 'Workspace / Settings';
    return `Workspace ${activePath}`;
  };

  const skipDrawerPaths = ['/docs', '/exec', '/docs/view', '/docs/edit', '/agents', '/playbooks', '/quality', '/releases', '/extensions', '/extensions/references', '/extensions/models', '/extensions/installed', '/extensions/builder', '/extensions/stacks', '/extensions/themes', '/extensions/snippets', '/extensions/keymaps', '/extensions/accounts', '/extensions/firewall', '/extensions/orchestrator', '/docs/manage/site-config'];
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
            <div className="ml-auto flex items-center space-x-2">
               <button 
                 onClick={() => setIsCreateTaskOpen(true)}
                 className="flex items-center space-x-1.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-xs text-slate-400"
                 title="Create new task"
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
