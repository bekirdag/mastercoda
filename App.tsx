import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import OmniDrawer from './components/OmniDrawer';
import CommandPalette from './components/CommandPalette';
import Dashboard from './components/Dashboard';
import IntroCarousel from './components/IntroCarousel';
import { OmniDrawerState } from './types';
import { CommandIcon } from './components/Icons';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [drawerState, setDrawerState] = useState<OmniDrawerState>('peek');
  const [activePath, setActivePath] = useState('/');
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);

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

  if (showOnboarding) {
    return <IntroCarousel onFinish={() => setShowOnboarding(false)} />;
  }

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
        <div className={`flex-1 overflow-auto custom-scrollbar pb-[340px] ${drawerState === 'maximized' ? 'overflow-hidden' : ''}`}>
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