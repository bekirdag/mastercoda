import React, { useState } from 'react';
import {
  Edit2Icon,
  FileTextIcon,
  FolderIcon,
  SparklesIcon,
  XIcon,
  ZapIcon
} from './Icons';

const DEFAULT_OPENYAML_PATH = '~/documents/openapi.yaml';

const DEFAULT_OPENYAML_CONTENT = `openapi: 3.0.3
info:
  title: Example API
  version: 0.1.0
paths:
  /health:
    get:
      summary: Health check
      responses:
        '200':
          description: OK
`;

type OpenyamlView = 'home' | 'browse' | 'create';

const OpenyamlHub: React.FC = () => {
  const [view, setView] = useState<OpenyamlView>('home');
  const [openyamlPath, setOpenyamlPath] = useState(DEFAULT_OPENYAML_PATH);
  const [openyamlContent, setOpenyamlContent] = useState(DEFAULT_OPENYAML_CONTENT);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleBrowse = () => {
    setView('browse');
    setIsEditorOpen(false);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setOpenyamlContent(DEFAULT_OPENYAML_CONTENT);
    setOpenyamlPath(DEFAULT_OPENYAML_PATH);
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
              <ZapIcon size={14} className="mr-2" />
              Auto-generate OpenAPI YAML
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-3xl mx-auto px-8 py-16">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">OpenAPI Generation</div>
            <h1 className="mt-3 text-4xl font-bold text-white">Generate OpenAPI YAML</h1>
            <p className="mt-4 text-slate-400">
              OpenAPI YAML is generated automatically from your SDS. Review the generated file and
              edit it as needed.
            </p>

            <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
              <div className="flex items-center justify-between gap-6 flex-wrap">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Input</div>
                  <div className="mt-2 text-sm text-slate-300">Uses the latest SDS markdown file.</div>
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
                  {isGenerating ? 'Generating...' : 'Generate OpenAPI YAML'}
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
              OpenAPI YAML
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
            OpenAPI YAML Path
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              value={openyamlPath}
              onChange={(e) => setOpenyamlPath(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-md bg-slate-950 border border-slate-700 text-slate-200 font-mono text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="~/documents/openapi.yaml"
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Update the path to point at a different OpenAPI YAML file.
          </p>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {isEditorOpen && (
            <section className="w-full md:w-1/2 border-r border-slate-800 bg-slate-950/40 flex flex-col">
              <header className="h-10 border-b border-slate-800 bg-slate-900/80 flex items-center px-4 justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">YAML Editor</span>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                >
                  Collapse
                </button>
              </header>
              <textarea
                value={openyamlContent}
                onChange={(e) => setOpenyamlContent(e.target.value)}
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
              {openyamlContent.trim() ? (
                <pre className="whitespace-pre-wrap text-sm text-slate-300 font-mono">{openyamlContent}</pre>
              ) : (
                <div className="text-sm text-slate-500 italic">No OpenAPI YAML loaded.</div>
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
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500">OpenAPI Workspace</div>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white tracking-tight">Openyaml</h1>
          <p className="mt-4 text-slate-400 max-w-2xl">
            Browse an existing OpenAPI YAML file or generate a new one automatically from your SDS.
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
              <div className="mt-6 text-2xl font-semibold text-white">Browse OpenAPI YAML</div>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Open a YAML file and review or edit the OpenAPI definition.
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
              <div className="mt-6 text-2xl font-semibold text-white">Generate OpenAPI YAML</div>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Automatically generate OpenAPI YAML based on your SDS file.
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenyamlHub;
