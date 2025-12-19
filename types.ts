
import React from 'react';

export type OmniDrawerState = 'hidden' | 'collapsed' | 'open' | 'maximized';

export type OmniTab = 'terminal' | 'agent' | 'server';

export type PlanViewType = 'board' | 'list' | 'graph' | 'roadmap';

export type TaskType = 'epic' | 'story' | 'task' | 'bug';

export type TaskStatus = 'pending' | 'in-progress' | 'review' | 'qa' | 'completed' | 'failed';

export type FileChangeStatus = 'modified' | 'added' | 'deleted';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  type: TaskType;
  points?: number;
  assignee?: string;
  updatedAt: string;
  parentId?: string;
  dependencies?: string[]; // IDs of tasks that block this task
  
  // Roadmap specific fields
  startDate?: string; // ISO Date YYYY-MM-DD
  dueDate?: string;   // ISO Date YYYY-MM-DD
  projectedEnd?: string; // ISO Date YYYY-MM-DD (AI prediction)
  progress?: number; // 0-100 percentage

  // Execution Context
  description?: string;
  acceptanceCriteria?: { id: string; label: string; checked: boolean }[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  source: string;
}

export interface Metric {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

export interface AgentLogEntry {
  id: string;
  type: 'thought' | 'command' | 'error' | 'info' | 'success';
  message: string;
  timestamp: string;
  details?: string; // For collapsible content like thoughts or diffs
  collapsed?: boolean;
}

export interface FileChange {
  id: string;
  path: string;
  status: FileChangeStatus;
  additions: number;
  deletions: number;
  contentOriginal: string;
  contentModified: string;
  selected: boolean;
  viewed: boolean;
}

// Version Control Types
export interface GitCommit {
  id: string; // short hash
  message: string;
  author: string;
  date: string; // relative string
  branch: string; // main, feature/x
  parents: string[];
  isHead?: boolean;
  status?: 'pushed' | 'unpushed';
  column?: number; // Visual column index for graph
  color?: string; // Visual color for graph line
}

export interface GitRef {
  id: string;
  name: string;
  type: 'local' | 'remote' | 'tag';
  active?: boolean;
  commitId?: string;
}

// Conflict Resolution Types
export interface ConflictedFile {
  id: string;
  path: string;
  status: 'unresolved' | 'resolved';
  content: string; // The raw content with conflict markers
}

// Documentation Types
export interface DocPage {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  tags: string[];
  linkedTasks: string[];
  syncStatus: 'synced' | 'pending' | 'error';
  lastIndexed: string;
  folderId?: string;
  isPinned?: boolean;
  isDraft?: boolean;
  lastViewedAt?: string;
  author?: string;
  sourceType?: 'github' | 'notion' | 'local' | 'web';
  aiSummary?: string[];
  relatedDocs?: { id: string, title: string }[];
}

export interface DocFolder {
  id: string;
  name: string;
  parentId?: string;
}

export interface DocSource {
  id: string;
  name: string;
  description: string;
  type: 'project' | 'team' | 'external';
  icon: string | React.ReactNode;
  pageCount: number;
  lastUpdated: string;
}

export interface DocComment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  timestamp: string;
  replies?: DocComment[];
}

export interface DocSiteConfig {
  siteName: string;
  description: string;
  access: 'public' | 'password' | 'sso';
  primaryColor: string;
  customCss: string;
  navigation: DocSiteNavItem[];
  versions: { tag: string; status: 'active' | 'legacy' }[];
}

export interface DocSiteNavItem {
  id: string;
  label: string;
  type: 'file' | 'folder';
  children?: DocSiteNavItem[];
}

// Agent Management Types
export type AgentStatus = 'online' | 'idle' | 'offline' | 'error';

export interface AgentPersona {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  model: string;
  provider: 'openai' | 'anthropic' | 'ollama' | 'google';
  systemPrompt: string;
  avatarColor: string;
  isPrimary: boolean;
  capabilities: {
    id: string;
    label: string;
    enabled: boolean;
    level: 'read' | 'write' | 'exec';
  }[];
  metrics: {
    tokensUsed: number;
    tasksCompleted: number;
    avgLatency: string;
  };
}

// Orchestrator Types (EX-15)
export type OrchNodeType = 'trigger' | 'router' | 'agent' | 'fallback';

export interface OrchestratorNode {
  id: string;
  type: OrchNodeType;
  label: string;
  description?: string;
  x: number;
  y: number;
  data: Record<string, any>;
  status?: 'active' | 'warning' | 'ghost';
}

export interface OrchestratorEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  isHighlighted?: boolean;
}

// Model Registry Types (EX-10)
export type AIProviderStatus = 'connected' | 'disconnected' | 'error' | 'loading';

export interface AIModel {
  id: string;
  name: string;
  contextWindow: number;
  type: 'chat' | 'reasoning' | 'embedding';
}

export interface AIProvider {
  id: string;
  name: string;
  status: AIProviderStatus;
  apiKey?: string;
  orgId?: string;
  baseUrl?: string;
  models: AIModel[];
  icon: string | React.ReactNode;
}

// EX-11 Service Account Types
export interface AuthorizedExtension {
  id: string;
  name: string;
  accessLevel: string;
  lastUsed: string;
  icon?: string;
}

export interface ServiceAccount {
  id: string;
  providerName: string;
  providerId: 'github' | 'aws' | 'vercel' | 'jira' | 'google-cloud';
  username: string;
  email?: string;
  status: 'connected' | 'expired' | 'error' | 'connecting';
  scopes: string[];
  authorizedExtensions: AuthorizedExtension[];
  isManual?: boolean;
  lastVerified: string;
}

// EX-14 Firewall Types
export interface NetworkRequest {
  id: string;
  timestamp: string;
  extensionId: string;
  extensionName: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'WS';
  domain: string;
  url: string;
  status: number | 'BLOCKED';
  size: string;
  headers?: Record<string, string>;
  body?: string;
  initiator?: string;
}

export interface FirewallRule {
  id: string;
  domain: string;
  type: 'allow' | 'block';
  isSystem?: boolean;
}

// WS-14 Notification Types
export type NotificationCategory = 'agent' | 'system' | 'mention';
export type NotificationStatus = 'unread' | 'read' | 'archived';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  status: NotificationStatus;
  title: string;
  body: string;
  timestamp: string;
  taskId?: string;
  tokens?: number;
  error?: boolean;
}

// WS-16 Playbook Types
export type PlaybookOutputMode = 'chat' | 'edit' | 'new_file';

export interface PlaybookVariable {
  id: string;
  name: string; // the string to replace, e.g. "componentName"
  description: string;
  defaultValue?: string;
  required: boolean;
}

export interface Playbook {
  id: string;
  title: string;
  description: string;
  icon: string; // e.g. "⚛️", "🧪"
  trigger: string; // e.g. "/scaffold"
  promptTemplate: string;
  variables: PlaybookVariable[];
  outputMode: PlaybookOutputMode;
  model: string;
  tags: string[];
  author: string;
  updatedAt: string;
  isSystem?: boolean;
}

// WS-17 Quality Hub Types
export type TestStatus = 'pass' | 'fail' | 'running' | 'pending' | 'skipped';

export interface TestResult {
  id: string;
  name: string;
  suite: string;
  file: string;
  status: TestStatus;
  duration?: string;
  error?: string;
  aiInsight?: string;
}

export interface CoverageMetric {
  id: string;
  path: string;
  percentage: number;
  lines: number;
  uncoveredRegions?: string[];
}

export interface FlakyTest {
  id: string;
  name: string;
  failRate: number;
  lastRunStatus: TestStatus;
}

// WS-18 Release Manager Types
export type VersionType = 'patch' | 'minor' | 'major';

export interface Release {
  id: string;
  tag: string;
  date: string;
  author: string;
  changelog: string;
  commitHash: string;
  status: 'published' | 'draft';
}

export interface EnvironmentStatus {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'deploying';
  version: string;
  lastDeploy: string;
  author: string;
  uptime?: string;
}

// EX-01 Extension Types
export type ExtensionCategory = 'Agents' | 'Languages' | 'Themes' | 'Snippets' | 'Keymaps';
export type ExtensionInstallStatus = 'idle' | 'installing' | 'installed' | 'updating';

export interface ExtensionPermission {
  id: string; label: string; description: string; revocable: boolean;
}

export interface Extension {
  id: string;
  title: string;
  author: string;
  verified: boolean;
  downloads: string;
  rating: number;
  description: string;
  category: ExtensionCategory;
  icon: string | React.ReactNode;
  status: ExtensionInstallStatus;
  version: string;
  minCodaVersion?: string;
  // EX-02 additions
  readme?: string;
  changelog?: { version: string; date: string; changes: string[] }[];
  license?: string;
  repository?: string;
  tags: string[];
  configSchema?: { key: string; description: string; type: string; default: any }[];
  
  // EX-05 additions
  isEnabled?: boolean;
  startupTimeMs?: number;
  memoryUsageMb?: number;
  permissions?: ExtensionPermission[];
  recentErrors?: string[];
  dependencies?: string[];
}

// EX-09 Keymap Types
export interface Keybinding {
  id: string;
  commandId: string;
  commandLabel: string;
  key: string; // e.g. "ctrl+shift+p"
  source: string; // "System", "Prettier", "Vim"
  when: string; // Context condition
  isDefault?: boolean;
  hasConflict?: boolean;
}

export interface KeymapProfile {
  id: string;
  name: string;
  description: string;
}

// EX-04 Extension Builder Types
export interface DevExtensionProject {
  id: string;
  name: string;
  path: string;
  version: string;
  status: 'linked' | 'missing' | 'error';
  manifest: {
    publisher: string;
    activationEvents: string[];
    contributions: {
      commands?: { command: string; title: string }[];
      views?: { id: string; name: string }[];
      configuration?: Record<string, any>;
    };
  };
}

// EX-06 Extension Stack Types
export interface ExtensionStack {
  id: string;
  name: string;
  description: string;
  extensions: string[]; // Array of extension IDs
  isActive: boolean;
  syncedWith?: string; // e.g. "master-coda.json"
  author: string;
  updatedAt: string;
  includeConfig: boolean;
}

// EX-07 Theme Studio Types
export interface ThemeDefinition {
  id: string;
  name: string;
  colors: {
    background: string;
    foreground: string;
    accent: string;
    border: string;
    sidebar: string;
    terminal: string;
  };
  syntax: {
    keyword: string;
    string: string;
    function: string;
    comment: string;
  };
  typography: {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    ligatures: boolean;
  };
}

export interface IconPack {
  id: string;
  name: string;
  author: string;
  iconMap: Record<string, string>; // ext -> emoji/path
}

// EX-08 Snippet Types
export type SnippetSource = 'local' | 'team' | 'extension';

export interface Snippet {
  id: string;
  name: string;
  prefix: string;
  body: string;
  description: string;
  scope: string; // Comma separated languages
  source: SnippetSource;
  isLocked?: boolean;
  updatedAt: string;
}

// EX-12 Reference Library Types
export interface DocChapter {
  id: string;
  title: string;
  content?: string; // Only if it's a leaf node
  children?: DocChapter[];
  headers?: { id: string; text: string; level: number }[];
}

export interface DocSet {
  id: string;
  name: string;
  version: string;
  icon: string | React.ReactNode;
  category: 'Active Project' | 'Installed Extension';
  status: 'downloaded' | 'update_available' | 'not_downloaded';
  versions: string[];
  chapters: DocChapter[];
}
