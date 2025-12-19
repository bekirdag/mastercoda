import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import OmniDrawer from './components/OmniDrawer';
import CommandPalette from './components/CommandPalette';
import Dashboard from './components/Dashboard';
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
import { OmniDrawerState } from './types';
import { CommandIcon } from './components/Icons';

type AppStep = 'intro' | 'system-check' | 'cli-config' | 'secure-storage' | 'connect-agent' | 'privacy-settings' | 'recent-projects' | 'update-required' | 'create-project-location' | 'create-project-details' | 'create-project-defaults' | 'initializing-workspace' | 'workspace-ready' | 'validating-workspace' | 'database-migration' | 'dashboard';

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('intro');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [drawerState, setDrawerState] = useState<OmniDrawerState>('peek');
  const [activePath, setActivePath] = useState('/');
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  
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
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdKOpen(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        setDrawerState(prev => prev === 'hidden' ? 'peek' : 'hidden');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (currentStep === 'intro') {
    return <IntroCarousel onFinish={() => setCurrentStep('system-check')} />;
  }

  if (currentStep === 'system-check') {
    return (
      <SystemCheck 
        onBack={() => setCurrentStep('intro')} 
        onNext={() => setCurrentStep('cli-config')} 
      />
    );
  }

  if (currentStep === 'cli-config') {
    return (
      <CliConfig
        onBack={() => setCurrentStep('system-check')}
        onNext={() => setCurrentStep('secure-storage')}
      />
    );
  }

  if (currentStep === 'secure-storage') {
    return (
      <SecureStorage
        onBack={() => setCurrentStep('cli-config')}
        onNext={() => setCurrentStep('connect-agent')}
      />
    );
  }

  if (currentStep === 'connect-agent') {
    return (
      <ConnectAgent
        onBack={() => setCurrentStep('secure-storage')}
        onNext={() => setCurrentStep('privacy-settings')}
      />
    );
  }

  if (currentStep === 'privacy-settings') {
    return (
      <PrivacySettings
        onBack={() => setCurrentStep('connect-agent')}
        onNext={() => setCurrentStep('recent-projects')}
      />
    );
  }

  if (currentStep === 'recent-projects') {
    return (
      <RecentProjects 
        onOpenProject={(path) => {
          setNewProjectData({ path }); // Store path for validation context
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
      />
    );
  }

  if (currentStep === 'database-migration') {
    return (
      <DatabaseMigration 
        onComplete={() => setCurrentStep('dashboard')}
        onCancel={() => setCurrentStep('recent-projects')}
      />
    );
  }

  if (currentStep === 'update-required') {
    return (
      <UpdateRequired 
        onFixed={() => setCurrentStep('recent-projects')} 
      />
    );
  }

  if (currentStep === 'create-project-location') {
    return (
      <CreateWorkspaceLocation
        onBack={() => setCurrentStep('recent-projects')}
        onNext={(path) => {
          setNewProjectData(prev => ({ ...prev, path }));
          setCurrentStep('create-project-details');
        }}
      />
    );
  }

  if (currentStep === 'create-project-details') {
    return (
      <CreateWorkspaceDetails
        onBack={() => setCurrentStep('create-project-location')}
        onNext={(details) => {
          setNewProjectData(prev => ({ ...prev, ...details }));
          setCurrentStep('create-project-defaults');
        }}
      />
    );
  }

  if (currentStep === 'create-project-defaults') {
    return (
      <CreateWorkspaceDefaults
        onBack={() => setCurrentStep('create-project-details')}
        onNext={(defaults) => {
          setNewProjectData(prev => ({ ...prev, ...defaults }));
          setCurrentStep('initializing-workspace');
        }}
        projectSummary={newProjectData}
      />
    );
  }

  if (currentStep === 'initializing-workspace') {
    return (
      <InitializingWorkspace
        config={newProjectData}
        onNext={() => setCurrentStep('workspace-ready')}
        onCancel={() => setCurrentStep('create-project-defaults')}
      />
    );
  }

  if (currentStep === 'workspace-ready') {
    return (
      <WorkspaceReady
        workspacePath={newProjectData.path}
        onNext={() => setCurrentStep('dashboard')}
      />
    );
  }

  // Calculate padding based on drawer state
  const contentPaddingClass = drawerState === 'peek' 
    ? 'pb-[340px]' 
    : drawerState === 'maximized' 
      ? 'pb-0' 
      : 'pb-8';

  return (
    <div className="flex h-screen w-screen bg-slate-900 text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Sidebar */}
      <Sidebar 
        isExpanded={isSidebarExpanded} 
        setIsExpanded={setIsSidebarExpanded}
        activePath={activePath}
        setActivePath={setActivePath}
      />

      {/* Main Content Stage */}
      <main className="flex-1 flex flex-col relative overflow-hidden transition-all duration-300">
        
        {/* Top Breadcrumbs / App Header */}
        <header className="h-10 flex items-center px-6 border-b border-slate-800 bg-slate-900/90 backdrop-blur z-10 shrink-0">
          <div className="flex items-center text-xs text-slate-500 font-medium space-x-2">
             <span className="hover:text-slate-300 cursor-pointer transition-colors">Master Coda</span>
             <span>/</span>
             <span className="hover:text-slate-300 cursor-pointer transition-colors">Workspace</span>
             <span>/</span>
             <span className="text-slate-200">Dashboard</span>
          </div>
          <div className="ml-auto">
             {/* Hint for keyboard shortcuts */}
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

        {/* Scrollable Content */}
        <div className={`flex-1 overflow-auto custom-scrollbar ${contentPaddingClass} ${drawerState === 'maximized' ? 'overflow-hidden' : ''} transition-all duration-300`}>
           <Dashboard />
        </div>

        {/* Omni Drawer - Bottom Layer */}
        <OmniDrawer state={drawerState} onStateChange={setDrawerState} />

      </main>

      {/* Command Palette Modal */}
      <CommandPalette isOpen={isCmdKOpen} onClose={() => setIsCmdKOpen(false)} />
      
    </div>
  );
}

export default App;