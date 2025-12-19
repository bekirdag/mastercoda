import { Task, LogEntry, Metric } from './types';

export const MOCK_TASKS: Task[] = [
  // Epic 1
  { id: 'MC-1000', title: 'Core Architecture Overhaul', status: 'in-progress', priority: 'high', type: 'epic', updatedAt: '2 days ago', assignee: 'Alex' },
  { id: 'MC-1001', title: 'Design System Migration', status: 'completed', priority: 'medium', type: 'story', parentId: 'MC-1000', points: 5, assignee: 'Sarah', updatedAt: '1 day ago' },
  { id: 'MC-1021', title: 'Typography Audit', status: 'completed', priority: 'low', type: 'task', parentId: 'MC-1001', points: 2, updatedAt: '1 day ago' },
  { id: 'MC-1027', title: 'Fix CSS overflow in sidebar', status: 'completed', priority: 'low', type: 'bug', parentId: 'MC-1001', points: 1, updatedAt: '2 hours ago' },
  
  { id: 'MC-1002', title: 'Authentication Middleware', status: 'in-progress', priority: 'high', type: 'story', parentId: 'MC-1000', points: 8, assignee: 'Alex', updatedAt: '4 hours ago' },
  { id: 'MC-1024', title: 'Refactor JWT validation', status: 'in-progress', priority: 'high', type: 'task', parentId: 'MC-1002', points: 3, assignee: 'Alex', updatedAt: '10:42 AM' },
  { id: 'MC-1023', title: 'Security Patch Dependencies', status: 'review', priority: 'high', type: 'task', parentId: 'MC-1002', points: 2, assignee: 'Sarah', updatedAt: '09:15 AM' },
  
  // Epic 2
  { id: 'MC-2000', title: 'AI Agent Integration', status: 'pending', priority: 'high', type: 'epic', updatedAt: '1 week ago' },
  { id: 'MC-2001', title: 'Gemini API Streaming', status: 'failed', priority: 'high', type: 'story', parentId: 'MC-2000', points: 13, assignee: 'Alex', updatedAt: 'Yesterday' },
  { id: 'MC-1022', title: 'Implement stream handler', status: 'failed', priority: 'high', type: 'task', parentId: 'MC-2001', points: 5, assignee: 'Alex', updatedAt: 'Yesterday' },
  
  { id: 'MC-2002', title: 'Agent Context Window', status: 'pending', priority: 'medium', type: 'story', parentId: 'MC-2000', points: 8, updatedAt: '2 days ago' },
  { id: 'MC-1020', title: 'Optimize docker build cache', status: 'completed', priority: 'medium', type: 'task', parentId: 'MC-2002', points: 3, updatedAt: '2 days ago' },
  
  // Loose Tasks
  { id: 'MC-1025', title: 'Setup GitHub Actions CI pipeline', status: 'qa', priority: 'high', type: 'story', points: 5, updatedAt: '1 hour ago' },
  { id: 'MC-1026', title: 'Write unit tests for Utils module', status: 'in-progress', priority: 'medium', type: 'task', points: 3, assignee: 'John', updatedAt: '30 mins ago' },
  { id: 'MC-1028', title: 'Code review for PR #42', status: 'review', priority: 'high', type: 'task', points: 1, assignee: 'Sarah', updatedAt: 'Just now' },
];

export const MOCK_LOGS: LogEntry[] = [
  { id: '1', timestamp: '10:42:01', level: 'info', source: 'system', message: 'Starting development server on port 3000...' },
  { id: '2', timestamp: '10:42:05', level: 'success', source: 'build', message: 'Compiled successfully in 1240ms' },
  { id: '3', timestamp: '10:45:12', level: 'warn', source: 'lint', message: 'Warning: unused variable "response" in api/gemini.ts:45' },
  { id: '4', timestamp: '10:46:00', level: 'info', source: 'agent', message: 'Analyzing code changes for PR #124...' },
  { id: '5', timestamp: '10:46:05', level: 'info', source: 'agent', message: 'Generating summary...' },
];

export const MOCK_METRICS: Metric[] = [
  { label: 'Build Time', value: '1.2s', change: '-200ms', trend: 'up', color: 'emerald' },
  { label: 'Test Coverage', value: '84.3%', change: '+1.2%', trend: 'up', color: 'indigo' },
  { label: 'Open Issues', value: '12', change: '+2', trend: 'down', color: 'amber' },
  { label: 'API Latency', value: '45ms', change: 'stable', trend: 'neutral', color: 'blue' },
];

export const AGENT_THOUGHTS = `
> Analyzing project structure...
> Detected TypeScript/React environment.
> Reading 'App.tsx'...
> Identifying missing specialized components for 'OmniDrawer'.
> Suggesting implementation of resize handles for better UX.
> Checking tailwind config...
> Colors look correct: Slate-900 base, Indigo-500 primary.
> Ready for user input.
`.trim();