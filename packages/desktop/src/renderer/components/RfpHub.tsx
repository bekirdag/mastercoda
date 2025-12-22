import React, { useState } from 'react';
import DiscoveryWizard from './DiscoveryWizard';
import {
  Edit2Icon,
  FileTextIcon,
  FolderIcon,
  SparklesIcon,
  XIcon
} from './Icons';

const DEFAULT_RFP_PATH = '~/documents/untitled-rfp.md';

const DEFAULT_RFP_CONTENT = `# Request for Proposal (RFP)

## Project Overview
Provide a short summary of the problem, target users, and desired outcomes.

## Functional Requirements
List the core workflows, integrations, and user-facing features.

## Technical Constraints
Capture architecture preferences, security requirements, and hosting constraints.

## Budget and Timeline
Outline budget range, desired milestones, and delivery expectations.`;

type RfpView = 'home' | 'browse' | 'create';

type RfpReadyPayload = {
  content: string;
  path?: string;
};

const RfpHub: React.FC = () => {
  const [view, setView] = useState<RfpView>('home');
  const [rfpPath, setRfpPath] = useState(DEFAULT_RFP_PATH);
  const [rfpContent, setRfpContent] = useState(DEFAULT_RFP_CONTENT);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleBrowse = () => {
    setView('browse');
    setIsEditorOpen(false);
  };

  const handleCreate = () => setView('create');

  const handleRfpReady = (payload: RfpReadyPayload) => {
    setRfpPath(payload.path || DEFAULT_RFP_PATH);
    setRfpContent(payload.content);
    setView('browse');
    setIsEditorOpen(false);
  };

  if (view === 'create') {
    return (
      <DiscoveryWizard
        onBack={() => setView('home')}
        onRfpReady={handleRfpReady}
      />
    );
  }

  if (view === 'browse') {
    return (
      <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden">
        <header className="h-14 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setView('home')}
              className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
            >
              <XIcon size={14} />
              <span>Back</span>
            </button>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center text-xs font-semibold uppercase tracking-widest text-slate-400">
              <FileTextIcon size={14} className="mr-2" />
              RFP File
            </div>
          </div>
          <button
            onClick={handleCreate}
            className="text-xs font-semibold uppercase tracking-widest text-indigo-400 hover:text-white transition-colors"
          >
            Create New
          </button>
        </header>

        <div className="border-b border-slate-800 bg-slate-900/60 px-6 py-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            RFP File Path
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              value={rfpPath}
              onChange={(e) => setRfpPath(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-md bg-slate-950 border border-slate-700 text-slate-200 font-mono text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="~/documents/project-rfp.md"
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Update the path to point at a different RFP markdown file.
          </p>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {isEditorOpen && (
            <section className="w-full md:w-1/2 border-r border-slate-800 bg-slate-950/40 flex flex-col">
              <header className="h-10 border-b border-slate-800 bg-slate-900/80 flex items-center px-4 justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Markdown Editor</span>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                >
                  Collapse
                </button>
              </header>
              <textarea
                value={rfpContent}
                onChange={(e) => setRfpContent(e.target.value)}
                className="flex-1 w-full resize-none bg-transparent p-6 text-sm text-slate-200 font-mono focus:outline-none"
              />
            </section>
          )}

          <section className="flex-1 flex flex-col bg-[#0f172a] overflow-hidden">
            <header className="h-10 border-b border-slate-800 bg-slate-900/80 flex items-center px-4 justify-between">
              <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <FileTextIcon size={12} className="text-slate-500" />
                <span>Preview</span>
              </div>
              <button
                onClick={() => setIsEditorOpen(true)}
                className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:text-white transition-colors"
              >
                <Edit2Icon size={12} />
                <span>Edit</span>
              </button>
            </header>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
              {rfpContent.trim() ? (
                <MarkdownRenderer content={rfpContent} />
              ) : (
                <div className="text-sm text-slate-500 italic">No RFP content loaded.</div>
              )}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-16">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500">RFP Workspace</div>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white tracking-tight">RFP</h1>
          <p className="mt-4 text-slate-400 max-w-2xl">
            Browse an existing RFP markdown file or create a new one with the AI agent. The creation
            flow will guide you through questions to build a complete RFP.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={handleBrowse}
              className="group text-left p-8 rounded-3xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition-all shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                  <FolderIcon size={22} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-300">Browse</span>
              </div>
              <div className="mt-6 text-2xl font-semibold text-white">Browse RFP file</div>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Open a markdown file and review or edit the requirements directly.
              </p>
            </button>

            <button
              onClick={handleCreate}
              className="group text-left p-8 rounded-3xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition-all shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                  <SparklesIcon size={22} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-300">Create</span>
              </div>
              <div className="mt-6 text-2xl font-semibold text-white">Create RFP file</div>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Chat with the AI agent to draft a complete RFP from scratch.
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => (
  <div className="space-y-5 text-slate-300 leading-relaxed font-sans">
    {content.split('\n').map((line, i) => {
      if (line.startsWith('# ')) {
        return (
          <h1 key={i} className="text-3xl font-bold text-white mt-6 mb-4">
            {line.replace('# ', '')}
          </h1>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={i} className="text-xl font-bold text-slate-100 mt-5 mb-3 border-b border-slate-800 pb-2">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={i} className="text-lg font-bold text-slate-200 mt-4 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={i} className="ml-6 list-disc">
            {line.replace('- ', '')}
          </li>
        );
      }
      if (line.startsWith('```')) return null;
      if (!line.trim()) return <br key={i} />;
      return <p key={i}>{line}</p>;
    })}
  </div>
);

export default RfpHub;
