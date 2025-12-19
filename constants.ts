import { Task, LogEntry, Metric, AgentLogEntry, FileChange, GitCommit, GitRef, ConflictedFile } from './types';

// Helper to get dates relative to now for dynamic mock data
const today = new Date();
const formatDate = (daysOffset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

export const MOCK_TASKS: Task[] = [
  // Epic 1
  { 
    id: 'MC-1000', 
    title: 'Core Architecture Overhaul', 
    status: 'in-progress', 
    priority: 'high', 
    type: 'epic', 
    updatedAt: '2 days ago', 
    assignee: 'Alex',
    startDate: formatDate(-14),
    dueDate: formatDate(14),
    projectedEnd: formatDate(18), // Delayed by 4 days
    progress: 45,
    description: "Refactor the monolith into a modular, event-driven architecture to support the new agentic workflows."
  },
  { 
    id: 'MC-1001', 
    title: 'Design System Migration', 
    status: 'completed', 
    priority: 'medium', 
    type: 'story', 
    parentId: 'MC-1000', 
    points: 5, 
    assignee: 'Sarah', 
    updatedAt: '1 day ago',
    description: "Migrate all legacy CSS components to the new Tailwind-based design system."
  },
  { id: 'MC-1021', title: 'Typography Audit', status: 'completed', priority: 'low', type: 'task', parentId: 'MC-1001', points: 2, updatedAt: '1 day ago', dependencies: ['MC-1027'] },
  { id: 'MC-1027', title: 'Fix CSS overflow in sidebar', status: 'completed', priority: 'low', type: 'bug', parentId: 'MC-1001', points: 1, updatedAt: '2 hours ago' },
  
  { 
    id: 'MC-1002', 
    title: 'Authentication Middleware', 
    status: 'in-progress', 
    priority: 'high', 
    type: 'story', 
    parentId: 'MC-1000', 
    points: 8, 
    assignee: 'Alex', 
    updatedAt: '4 hours ago', 
    dependencies: ['MC-1001'],
    description: "Implement a robust JWT-based authentication middleware that supports role-based access control (RBAC) and integrates with the new User Service.",
    acceptanceCriteria: [
      { id: 'ac1', label: 'Validate JWT signature using RSA-256', checked: true },
      { id: 'ac2', label: 'Check token expiration and issuer', checked: true },
      { id: 'ac3', label: 'Inject user context into request object', checked: false },
      { id: 'ac4', label: 'Handle 401/403 errors with standard JSON response', checked: false },
      { id: 'ac5', label: 'Unit tests covering valid/invalid/expired tokens', checked: false }
    ]
  },
  { id: 'MC-1024', title: 'Refactor JWT validation', status: 'in-progress', priority: 'high', type: 'task', parentId: 'MC-1002', points: 3, assignee: 'Alex', updatedAt: '10:42 AM' },
  { id: 'MC-1023', title: 'Security Patch Dependencies', status: 'review', priority: 'high', type: 'task', parentId: 'MC-1002', points: 2, assignee: 'Sarah', updatedAt: '09:15 AM' },
  
  // Epic 2
  { 
    id: 'MC-2000', 
    title: 'AI Agent Integration', 
    status: 'pending', 
    priority: 'high', 
    type: 'epic', 
    updatedAt: '1 week ago', 
    dependencies: ['MC-1000'],
    startDate: formatDate(10), // Starts after MC-1000 roughly
    dueDate: formatDate(45),
    progress: 10
  },
  { 
    id: 'MC-2001', 
    title: 'Gemini API Streaming', 
    status: 'failed', 
    priority: 'high', 
    type: 'story', 
    parentId: 'MC-2000', 
    points: 13, 
    assignee: 'Alex', 
    updatedAt: 'Yesterday', 
    dependencies: ['MC-1002'],
    description: "Integrate the Google Gemini API with streaming support to allow real-time token generation in the UI.",
    acceptanceCriteria: [
      { id: 'ac1', label: 'Connect to Vertex AI / Gemini API', checked: true },
      { id: 'ac2', label: 'Implement Server-Sent Events (SSE) for stream', checked: false },
      { id: 'ac3', label: 'Handle rate limiting and backoff', checked: false }
    ]
  },
  { id: 'MC-1022', title: 'Implement stream handler', status: 'failed', priority: 'high', type: 'task', parentId: 'MC-2001', points: 5, assignee: 'Alex', updatedAt: 'Yesterday' },
  
  { id: 'MC-2002', title: 'Agent Context Window', status: 'pending', priority: 'medium', type: 'story', parentId: 'MC-2000', points: 8, updatedAt: '2 days ago', dependencies: ['MC-2001'] },
  { id: 'MC-1020', title: 'Optimize docker build cache', status: 'completed', priority: 'medium', type: 'task', parentId: 'MC-2002', points: 3, updatedAt: '2 days ago' },
  
  // Loose Tasks / Epics
  { 
    id: 'MC-3000', 
    title: 'Mobile App Alpha', 
    status: 'pending', 
    priority: 'medium', 
    type: 'epic', 
    updatedAt: '3 days ago',
    startDate: formatDate(30),
    dueDate: formatDate(60),
    progress: 0
  },
  { id: 'MC-1025', title: 'Setup GitHub Actions CI pipeline', status: 'qa', priority: 'high', type: 'story', points: 5, updatedAt: '1 hour ago', dependencies: ['MC-1023'] },
  { id: 'MC-1026', title: 'Write unit tests for Utils module', status: 'in-progress', priority: 'medium', type: 'task', points: 3, assignee: 'John', updatedAt: '30 mins ago' },
  { id: 'MC-1028', title: 'Code review for PR #42', status: 'review', priority: 'high', type: 'task', points: 1, assignee: 'Sarah', updatedAt: 'Just now', dependencies: ['MC-1026'] },
];

export const MOCK_METRICS: Metric[] = [
  { label: 'Build Time', value: '1.2s', change: '-200ms', trend: 'up', color: 'emerald' },
  { label: 'Test Coverage', value: '84.3%', change: '+1.2%', trend: 'up', color: 'indigo' },
  { label: 'Open Issues', value: '12', change: '+2', trend: 'down', color: 'amber' },
  { label: 'API Latency', value: '45ms', change: 'stable', trend: 'neutral', color: 'blue' },
];

export const MOCK_AGENT_LOGS: AgentLogEntry[] = [
  { 
    id: '1', 
    type: 'info', 
    message: 'Agent initialized with context: Master Coda v1', 
    timestamp: '10:42:01' 
  },
  { 
    id: '2', 
    type: 'thought', 
    message: 'Analyzing project structure...', 
    timestamp: '10:42:02', 
    details: 'Scanning src/components...\nIdentified 14 React components.\nChecking dependencies in package.json...',
    collapsed: false 
  },
  { 
    id: '3', 
    type: 'command', 
    message: 'Exec: npm run lint', 
    timestamp: '10:42:05' 
  },
  { 
    id: '4', 
    type: 'error', 
    message: 'Linting failed: src/App.tsx (2 errors)', 
    timestamp: '10:42:06',
    details: 'src/App.tsx:45:12 - Unused variable "x"\nsrc/App.tsx:50:5 - Missing semicolon'
  },
  {
    id: '5',
    type: 'thought',
    message: 'Attempting to fix lint errors automatically.',
    timestamp: '10:42:07',
    details: 'Strategy: Use eslint --fix',
    collapsed: true
  },
  {
    id: '6',
    type: 'command',
    message: 'Exec: npm run lint -- --fix',
    timestamp: '10:42:08'
  },
  {
    id: '7',
    type: 'success',
    message: 'Linting passed.',
    timestamp: '10:42:10'
  }
];

export const MOCK_SERVER_LOGS = [
  "[10:41:55] [webpack] Asset main.js 4.2MiB [emitted] (name: main)",
  "[10:41:55] [webpack] Asset index.html 1.4KiB [emitted]",
  "[10:41:55] [webpack] compiled successfully in 1240 ms",
  "[10:42:00] [API] GET /api/v1/user 200 45ms",
  "[10:42:01] [API] POST /api/v1/tasks 201 120ms",
  "[10:42:05] [Watcher] src/App.tsx changed. Rebuilding...",
  "[10:42:06] [webpack] Asset main.js 4.2MiB [emitted] (name: main)",
  "[10:42:06] [webpack] compiled with 1 warning",
];

export const MOCK_FILE_CHANGES: FileChange[] = [
  {
    id: 'f1',
    path: 'src/components/Button.tsx',
    status: 'modified',
    additions: 12,
    deletions: 4,
    selected: true,
    viewed: false,
    contentOriginal: `import React from 'react';

interface ButtonProps {
  variant: 'primary' | 'secondary';
  label: string;
}

export const Button = ({ variant, label }) => {
  return (
    <button className={variant}>
      {label}
    </button>
  );
};`,
    contentModified: `import React from 'react';
import { Loader } from './Loader';

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  label: string;
  loading?: boolean;
}

export const Button = ({ variant, label, loading }) => {
  return (
    <button className={\`btn \${variant}\`} disabled={loading}>
      {loading ? <Loader /> : label}
    </button>
  );
};`
  },
  {
    id: 'f2',
    path: 'src/components/Loader.tsx',
    status: 'added',
    additions: 15,
    deletions: 0,
    selected: true,
    viewed: false,
    contentOriginal: '',
    contentModified: `import React from 'react';

export const Loader = () => (
  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
  </svg>
);`
  },
  {
    id: 'f3',
    path: 'src/legacy/OldButton.js',
    status: 'deleted',
    additions: 0,
    deletions: 24,
    selected: true,
    viewed: true,
    contentOriginal: `// Deprecated: Use src/components/Button.tsx
import React from 'react';

const OldButton = () => {
   return <button>Click me</button>;
}

export default OldButton;`,
    contentModified: ''
  },
  {
    id: 'f4',
    path: 'src/utils/helpers.ts',
    status: 'modified',
    additions: 2,
    deletions: 1,
    selected: true,
    viewed: false,
    contentOriginal: `export const formatDate = (date: Date) => {
  return date.toISOString();
};`,
    contentModified: `export const formatDate = (date: Date) => {
  // Use locale string for UI
  return date.toLocaleDateString();
};`
  },
  {
    id: 'f5',
    path: 'package.json',
    status: 'modified',
    additions: 1,
    deletions: 0,
    selected: false,
    viewed: false,
    contentOriginal: `{
  "name": "master-coda",
  "version": "0.1.0",
  "dependencies": {
    "react": "^18.2.0"
  }
}`,
    contentModified: `{
  "name": "master-coda",
  "version": "0.1.0",
  "dependencies": {
    "react": "^18.2.0",
    "lucide-react": "^0.263.1"
  }
}`
  }
];

export const MOCK_COMMITS: GitCommit[] = [
  { id: 'c9f1a2', message: 'feat: add oauth provider for google login', author: 'Alex', date: '2h ago', branch: 'feature/login-auth', parents: ['b4d3e1'], isHead: true, status: 'unpushed', column: 1, color: '#10b981' },
  { id: 'b4d3e1', message: 'fix: resolve race condition in token refresh', author: 'Alex', date: '5h ago', branch: 'feature/login-auth', parents: ['a1b2c3'], column: 1, color: '#10b981' },
  { id: 'd8e7f6', message: 'style: update sidebar navigation colors', author: 'Sarah', date: '1d ago', branch: 'main', parents: ['a1b2c3'], column: 0, color: '#6366f1' },
  { id: 'a1b2c3', message: 'Merge pull request #42 from feature/dashboard', author: 'Alex', date: '2d ago', branch: 'main', parents: ['f5g6h7', 'i8j9k0'], column: 0, color: '#6366f1' },
  { id: 'f5g6h7', message: 'feat: initial dashboard layout', author: 'Alex', date: '3d ago', branch: 'main', parents: ['e1r2t3'], column: 0, color: '#6366f1' },
  { id: 'i8j9k0', message: 'chore: update dependencies', author: 'Bot', date: '3d ago', branch: 'feature/deps', parents: ['e1r2t3'], column: 2, color: '#f59e0b' },
  { id: 'e1r2t3', message: 'init: project scaffold', author: 'Alex', date: '1w ago', branch: 'main', parents: [], column: 0, color: '#6366f1' },
];

export const MOCK_BRANCHES: GitRef[] = [
  { id: 'b1', name: 'feature/login-auth', type: 'local', active: true, commitId: 'c9f1a2' },
  { id: 'b2', name: 'main', type: 'local', active: false, commitId: 'd8e7f6' },
  { id: 'b3', name: 'hotfix/ui-glitch', type: 'local', active: false, commitId: 'a1b2c3' },
  { id: 'r1', name: 'origin/main', type: 'remote', active: false, commitId: 'd8e7f6' },
  { id: 'r2', name: 'origin/feature/login-auth', type: 'remote', active: false, commitId: 'b4d3e1' },
  { id: 't1', name: 'v1.0.0', type: 'tag', active: false, commitId: 'a1b2c3' },
];

export const MOCK_CONFLICTS: ConflictedFile[] = [
  {
    id: 'cf1',
    path: 'src/utils/api.ts',
    status: 'unresolved',
    content: `import { getToken } from './auth';

export const API_BASE = 'https://api.mastercoda.io/v1';

<<<<<<< HEAD
export const fetchUser = async (id: string) => {
  const token = await getToken();
  return fetch(\`\${API_BASE}/users/\${id}\`, {
    headers: { Authorization: \`Bearer \${token}\` }
  });
};
=======
export const fetchUser = async (userId: string) => {
  // New retry logic
  return fetchWithRetry(\`\${API_BASE}/users/\${userId}\`);
};
>>>>>>> feature/retry-logic

export const updateUser = async (data: any) => {
  return fetch(\`\${API_BASE}/user\`, { method: 'POST', body: JSON.stringify(data) });
};
`
  },
  {
    id: 'cf2',
    path: 'package.json',
    status: 'unresolved',
    content: `{
  "name": "master-coda",
  "version": "0.1.0",
  "dependencies": {
    "react": "^18.2.0",
<<<<<<< HEAD
    "lucide-react": "^0.263.1",
    "date-fns": "^2.30.0"
=======
    "lucide-react": "^0.300.0",
    "lodash": "^4.17.21"
>>>>>>> feature/update-deps
  }
}`
  },
  {
    id: 'cf3',
    path: 'src/components/Button.tsx',
    status: 'resolved',
    content: `import React from 'react';
// Conflict resolved content placeholder
export const Button = () => <button>Click me</button>;`
  }
];
