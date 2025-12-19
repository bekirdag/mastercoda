import { Task, LogEntry, Metric } from './types';

export const MOCK_TASKS: Task[] = [
  { id: 'MC-1024', title: 'Refactor authentication middleware', status: 'in-progress', priority: 'high', updatedAt: '10:42 AM', assignee: 'Alex' },
  { id: 'MC-1023', title: 'Update dependencies for security patch', status: 'completed', priority: 'medium', updatedAt: '09:15 AM', assignee: 'Sarah' },
  { id: 'MC-1022', title: 'Implement Gemini API stream handler', status: 'failed', priority: 'high', updatedAt: 'Yesterday', assignee: 'Alex' },
  { id: 'MC-1021', title: 'Design system typography audit', status: 'pending', priority: 'low', updatedAt: 'Yesterday' },
  { id: 'MC-1020', title: 'Optimize docker build cache', status: 'completed', priority: 'medium', updatedAt: '2 days ago' },
  // Extended tasks for board
  { id: 'MC-1025', title: 'Setup GitHub Actions CI pipeline', status: 'pending', priority: 'high', updatedAt: '1 hour ago' },
  { id: 'MC-1026', title: 'Write unit tests for Utils module', status: 'in-progress', priority: 'medium', updatedAt: '30 mins ago', assignee: 'John' },
  { id: 'MC-1027', title: 'Fix CSS overflow in sidebar', status: 'pending', priority: 'low', updatedAt: '2 hours ago' },
  { id: 'MC-1028', title: 'Code review for PR #42', status: 'in-progress', priority: 'high', updatedAt: 'Just now', assignee: 'Sarah' },
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