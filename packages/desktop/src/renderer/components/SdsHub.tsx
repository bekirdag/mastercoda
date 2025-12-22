import React, { useState } from 'react';
import {
  Edit2Icon,
  FileTextIcon,
  FolderIcon,
  ListTreeIcon,
  SparklesIcon,
  XIcon
} from './Icons';

const DEFAULT_SDS_PATH = '~/documents/untitled-sds.md';

const DEFAULT_SDS_CONTENT = `# Solution Design Specification (SDS)

## Architecture Overview
Describe system boundaries, data flow, and major components.

## Data Model
List core entities, schemas, and storage strategies.

## API Contracts
Define endpoints, payloads, and error handling standards.

## Security & Compliance
Capture authentication, authorization, and compliance requirements.

## Operational Considerations
Include monitoring, logging, scaling, and disaster recovery plans.`;

type SdsView = 'home' | 'browse' | 'create';

const SdsHub: React.FC = () => {
  const [view, setView] = useState<SdsView>('home');
  const [sdsPath, setSdsPath] = useState(DEFAULT_SDS_PATH);
  const [sdsContent, setSdsContent] = useState(DEFAULT_SDS_CONTENT);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleBrowse = () => {
    setView('browse');
    setIsEditorOpen(false);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setSdsContent(DEFAULT_SDS_CONTENT);
    setSdsPath(DEFAULT_SDS_PATH);
    setIsGenerating(false);
    setView('browse');
    setIsEditorOpen(false);
  };

  if (view === 'create') {
    return (
      <div className="flex flex-col h-full bg-[#0f172a] text-slate-200">
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
              <ListTreeIcon size={14} className="mr-2" />
              Auto-generate SDS
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-3xl mx-auto px-8 py-16">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">SDS Generation</div>
            <h1 className="mt-3 text-4xl font-bold text-white">Generate SDS file</h1>
            <p className="mt-4 text-slate-400">
              The SDS is generated automatically from your RFP and PDR files. Review the generated
              draft and adjust details as needed.
            </p>

            <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
              <div className="flex items-center justify-between gap-6 flex-wrap">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Inputs</div>
                  <div className="mt-2 text-sm text-slate-300">Uses the latest RFP and PDR markdown files.</div>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isGenerating
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-500 text-slate-900 hover:bg-emerald-400'
                  }`}
                >
                  {isGenerating ? 'Generating...' : 'Generate SDS file'}
                </button>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                The generated file will open in the editor with a preview pane.
              </p>
            </div>
          </div>
        </div>
      </div>
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
              SDS File
            </div>
          </div>
          <button
            onClick={() => setView('create')}
            className="text-xs font-semibold uppercase tracking-widest text-indigo-400 hover:text-white transition-colors"
          >
            Generate New
          </button>
        </header>

        <div className="border-b border-slate-800 bg-slate-900/60 px-6 py-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            SDS File Path
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              value={sdsPath}
              onChange={(e) => setSdsPath(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-md bg-slate-950 border border-slate-700 text-slate-200 font-mono text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="~/documents/project-sds.md"
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Update the path to point at a different SDS markdown file.
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
                value={sdsContent}
                onChange={(e) => setSdsContent(e.target.value)}
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
              {sdsContent.trim() ? (
                <MarkdownRenderer content={sdsContent} />
              ) : (
                <div className="text-sm text-slate-500 italic">No SDS content loaded.</div>
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
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500">SDS Workspace</div>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white tracking-tight">SDS</h1>
          <p className="mt-4 text-slate-400 max-w-2xl">
            Browse an existing SDS markdown file or generate a new one automatically from your RFP and PDR.
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
              <div className="mt-6 text-2xl font-semibold text-white">Browse SDS file</div>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Open a markdown file and review or edit the SDS content.
              </p>
            </button>

            <button
              onClick={() => setView('create')}
              className="group text-left p-8 rounded-3xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition-all shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                  <SparklesIcon size={22} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-300">Generate</span>
              </div>
              <div className="mt-6 text-2xl font-semibold text-white">Generate SDS file</div>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Automatically generate an SDS based on your RFP and PDR files.
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

export default SdsHub;
