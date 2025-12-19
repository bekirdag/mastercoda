
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
}

export interface DocFolder {
  id: string;
  name: string;
  parentId?: string;
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
