
import { Task, LogEntry, Metric, AgentLogEntry, FileChange, GitCommit, GitRef, ConflictedFile, DocPage, DocFolder, AgentPersona, AppNotification, Playbook, TestResult, CoverageMetric, FlakyTest, Release, EnvironmentStatus, Extension, ExtensionStack, ThemeDefinition, IconPack, Snippet, Keybinding, KeymapProfile, AIProvider, ServiceAccount, DocSet, NetworkRequest, FirewallRule, OrchestratorNode, OrchestratorEdge, DocSource, DocComment, ApiEndpoint, TopologyNode, TopologyEdge, AdrRecord, LearningPath, DictionaryTerm, DriftRecord, SearchGap, DocFeedbackItem, FleetActivity } from './types';

// Helper to get dates relative to now for dynamic mock data
const today = new Date();
const formatDate = (daysOffset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

export const MOCK_DRIFT_RECORDS: DriftRecord[] = [
  {
    id: 'dr-1',
    title: 'Authentication Flow',
    docPath: 'docs/auth.md',
    codePath: 'src/auth/*',
    lastDocEdit: formatDate(-180), // 6 months
    lastCodeEdit: formatDate(-1), // Yesterday
    score: 'high'
  },
  {
    id: 'dr-2',
    title: 'Billing Engine',
    docPath: 'docs/billing.md',
    codePath: 'src/services/billing/*',
    lastDocEdit: formatDate(-7),
    lastCodeEdit: formatDate(-45),
    score: 'low'
  },
  {
    id: 'dr-3',
    title: 'Deployment Strategy',
    docPath: 'docs/deployment.md',
    codePath: '.github/workflows/*',
    lastDocEdit: formatDate(-60),
    lastCodeEdit: formatDate(-10),
    score: 'medium'
  }
];

export const MOCK_SEARCH_GAPS: SearchGap[] = [
  { id: 'sg-1', term: 'Websocket', count: 45 },
  { id: 'sg-2', term: 'Dark Mode', count: 12 },
  { id: 'sg-3', term: 'Zustand Store', count: 8 },
  { id: 'sg-4', term: 'VPC Peering', count: 6 }
];

export const MOCK_DOC_FEEDBACK: DocFeedbackItem[] = [
  {
    id: 'df-1',
    user: 'Bob (New Hire)',
    context: 'Setup Guide',
    comment: 'The command `npm run start` fails on Windows. Needs updating.',
    helpful: false,
    status: 'open',
    timestamp: '2h ago'
  },
  {
    id: 'df-2',
    user: 'Sarah',
    context: 'API Reference',
    comment: 'Missing query parameters documentation for /v2/search.',
    helpful: false,
    status: 'open',
    timestamp: '5h ago'
  },
  {
    id: 'df-3',
    user: 'Alex',
    context: 'Design Tokens',
    comment: 'The hex codes are very helpful, thanks!',
    helpful: true,
    status: 'resolved',
    timestamp: '1d ago'
  }
];

export const MOCK_DICTIONARY: DictionaryTerm[] = [
  {
    id: 'dt-1',
    term: 'Customer',
    definition: 'An entity that purchases a subscription. Distinct from a "User" who logs in.',
    category: 'business',
    synonyms: ['Client', 'Tenant'],
    owner: 'Sales Team',
    usageExamples: ['A Customer can have many Users.', 'Customers are billed monthly.'],
    includeInAiContext: true,
    codeMappings: [
      { type: 'class', label: 'Organization', path: 'src/models/Organization.ts' },
      { type: 'table', label: 'subscriptions', path: 'db/schema.sql' }
    ],
    references: [{ id: 'p-auth-flow', title: 'Authentication Flow' }]
  },
  {
    id: 'dt-2',
    term: 'Session',
    definition: 'A temporal technical interaction window. In business terms, this represents a single user visit.',
    category: 'technical',
    acronym: 'SES',
    synonyms: ['Visit', 'Connection'],
    owner: 'Engineering Team',
    usageExamples: ['Sessions expire after 1 hour of inactivity.'],
    includeInAiContext: true,
    codeMappings: [
      { type: 'class', label: 'SessionManager', path: 'src/auth/SessionManager.ts' },
      { type: 'table', label: 'active_sessions', path: 'redis/store' }
    ],
    conflicts: [
      { context: 'Sales', definition: 'A sales meeting or call with a lead.' },
      { context: 'Engineering', definition: 'A stateful connection between client and server.' }
    ]
  },
  {
    id: 'dt-3',
    term: 'ARR',
    definition: 'Annual Recurring Revenue. The value of the recurring revenue components of a term subscriptions normalized to a single year.',
    category: 'acronym',
    acronym: 'ARR',
    synonyms: ['Yearly Revenue'],
    owner: 'Finance',
    usageExamples: ['Our ARR goal for Q4 is $12M.'],
    includeInAiContext: false,
    codeMappings: [],
    references: []
  },
  {
    id: 'dt-4',
    term: 'Backlog',
    definition: 'A prioritized list of work for the development team that is derived from the roadmap and its requirements.',
    category: 'business',
    synonyms: ['Work Queue', 'Task List'],
    owner: 'Product Team',
    usageExamples: ['Refine the backlog before the sprint planning.'],
    includeInAiContext: true,
    codeMappings: [
      { type: 'table', label: 'tasks', path: 'db/migrations/001_tasks.sql' }
    ]
  },
  {
    id: 'dt-5',
    term: 'Churn',
    definition: 'The rate at which customers stop doing business with an entity.',
    category: 'business',
    synonyms: ['Attrition', 'Turnover'],
    owner: 'Product Team',
    usageExamples: ['Reducing churn is our top priority this quarter.'],
    includeInAiContext: false,
    codeMappings: []
  },
  {
    id: 'dt-6',
    term: 'API',
    definition: 'Application Programming Interface. A set of defined rules that enable different applications to communicate with each other.',
    category: 'technical',
    acronym: 'API',
    synonyms: ['Endpoint', 'Interface'],
    owner: 'Platform Team',
    usageExamples: ['Document all public API endpoints.'],
    includeInAiContext: true,
    codeMappings: [
      { type: 'file', label: 'OpenAPI Spec', path: 'docs/openapi.yaml' }
    ]
  }
];

export const MOCK_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-frontend-101',
    title: 'Frontend Onboarding: Day 1 to Deploy',
    subtitle: 'Master the component library, CI/CD flow, and styling guidelines used in Master Coda.',
    author: 'Sarah Chen',
    progress: 45,
    estimatedTime: '3 Hours',
    modules: [
      {
        id: 'm1',
        type: 'read',
        title: 'Design System Philosophy',
        description: 'Understand why we chose Tailwind and our cyberpunk design tokens.',
        status: 'completed',
        duration: '15m',
        resourceId: 'p-design-system'
      },
      {
        id: 'm2',
        type: 'task',
        title: 'Local Environment Setup',
        description: 'Clone the repository, run npm install, and verify your local build with mcoda status.',
        status: 'completed',
        duration: '30m'
      },
      {
        id: 'm3',
        type: 'read',
        title: 'Authentication Middleware Architecture',
        description: 'Deep dive into our JWT implementation and RS256 rotation logic.',
        status: 'active',
        duration: '20m',
        resourceId: 'p-auth-flow'
      },
      {
        id: 'm4',
        type: 'quiz',
        title: 'Security Standards Check',
        description: 'A quick 5-question check on handling sensitive API keys.',
        status: 'locked',
        duration: '10m'
      },
      {
        id: 'm5',
        type: 'project',
        title: 'First Component Pull Request',
        description: 'Scaffold a new UI component using the /scaffold playbook and submit for review.',
        status: 'locked',
        duration: '1h'
      }
    ]
  },
  {
    id: 'path-backend-adv',
    title: 'Advanced Backend: High-Density Pipelines',
    subtitle: 'Learn to build resilient gRPC microservices and optimize SQL workloads.',
    author: 'Alex Dev',
    progress: 0,
    estimatedTime: '8 Hours',
    modules: [
      {
        id: 'b1',
        type: 'read',
        title: 'gRPC Communication Patterns',
        description: 'Learn our standard for bi-directional streaming between services.',
        status: 'active',
        duration: '45m'
      },
      {
        id: 'b2',
        type: 'read',
        title: 'SQL Performance Tuning',
        description: 'Common pitfalls when using our shared Postgres cluster.',
        status: 'locked',
        duration: '1h',
        isStale: true
      }
    ]
  }
];

export const MOCK_ADRS: AdrRecord[] = [
  {
    id: 'ADR-045',
    title: 'Adopt Rust for Image Service',
    status: 'accepted',
    date: formatDate(-2),
    author: 'Alex Dev',
    category: 'Backend',
    context: 'The current Node.js image processing service is hitting CPU limits during peak resizing tasks, causing latency spikes in the UI. We need a more performant runtime for compute-intensive tasks.',
    decision: 'We will rewrite the core image processing logic in Rust using the `image` crate and expose it via a gRPC interface. This will leverage Rusts zero-cost abstractions and safe concurrency.',
    consequences: {
      positive: [
        'Significant reduction in processing latency (estimated 4x speedup).',
        'Lower memory footprint per request.',
        'Better utilization of multi-core CPU architectures.'
      ],
      negative: [
        'Steeper learning curve for the team.',
        'Initial overhead in setting up the gRPC bridge.',
        'Build times will increase slightly due to LLVM compilation.'
      ]
    },
    implementationUrl: 'https://github.com/master-coda/image-service',
    reviewers: [
      { id: '1', name: 'Sarah Chen', vote: 'yes' },
      { id: '2', name: 'John Smith', vote: 'yes' },
      { id: '3', name: 'Audit Zero', vote: 'yes' }
    ]
  },
  {
    id: 'ADR-044',
    title: 'Standardize on gRPC for Internal Services',
    status: 'accepted',
    date: formatDate(-15),
    author: 'Sarah Chen',
    category: 'Architecture',
    context: 'Our microservices are currently communicating via a mix of REST and raw TCP sockets. This makes it difficult to maintain type safety across language boundaries (Go, Node, Python).',
    decision: 'All new internal service communication will use gRPC with Protocol Buffers (proto3). This ensures strict typing and contract-first development.',
    consequences: {
      positive: ['Strict contract enforcement.', 'Built-in support for streaming.', 'Smaller payload sizes.'],
      negative: ['More complex debugging (binary protocol).', 'Browser clients require grpc-web bridge.']
    },
    reviewers: [
      { id: '1', name: 'Alex Dev', vote: 'yes' },
      { id: '2', name: 'Audit Zero', vote: 'none' }
    ]
  },
  {
    id: 'ADR-046',
    title: 'Migrate Session Storage to Redis',
    status: 'proposed',
    date: formatDate(0),
    author: 'Alex Dev',
    category: 'Infrastructure',
    context: 'Current sessions are stored in Postgres, leading to high DB load for simple auth checks.',
    decision: 'Move session management to an elastic Redis cluster.',
    consequences: {
      positive: ['Sub-millisecond session lookups.', 'Decoupled auth from main DB.'],
      negative: ['Introduces another point of failure.', 'Requires Redis cluster management.']
    },
    reviewers: [
      { id: '1', name: 'Sarah Chen', vote: 'none' },
      { id: '2', name: 'Architect Prime', vote: 'none' }
    ]
  },
  {
    id: 'ADR-012',
    title: 'Use XML for Configuration',
    status: 'deprecated',
    date: formatDate(-365),
    author: 'Legacy Dev',
    category: 'Core',
    context: 'Need a structured format for app config.',
    decision: 'Standardize on XML for all configuration files.',
    consequences: {
      positive: ['Widely supported.'],
      negative: ['Verbose.', 'Hard to read for humans.']
    },
    supersededBy: 'ADR-015',
    reviewers: []
  }
];

export const MOCK_TOPOLOGY_NODES: TopologyNode[] = [
  { 
    id: 't-web', type: 'frontend', label: 'Web App', x: 50, y: 200, 
    metadata: { language: 'TypeScript', framework: 'React', health: 'healthy', uptime: '99.9%' } 
  },
  { 
    id: 't-gw', type: 'gateway', label: 'API Gateway', x: 250, y: 200, 
    metadata: { framework: 'Nginx', health: 'healthy' } 
  },
  { 
    id: 't-auth', type: 'service', label: 'Auth Service', x: 450, y: 100, 
    metadata: { language: 'Go', framework: 'Gin', maintainer: 'Identity Team', health: 'healthy', internalModules: ['JWT', 'OAuth2', 'RBAC'] } 
  },
  { 
    id: 't-user', type: 'service', label: 'User Service', x: 450, y: 300, 
    metadata: { language: 'Node.js', framework: 'Express', maintainer: 'Core Team', health: 'warning' } 
  },
  { 
    id: 't-db', type: 'database', label: 'Postgres DB', x: 650, y: 200, 
    metadata: { language: 'SQL', health: 'healthy', uptime: '100%' } 
  },
  { 
    id: 't-stripe', type: 'external', label: 'Stripe API', x: 650, y: 50, 
    metadata: { health: 'healthy' } 
  },
  { 
    id: 't-worker', type: 'worker', label: 'Email Worker', x: 650, y: 350, 
    metadata: { language: 'Python', health: 'healthy' } 
  }
];

export const MOCK_TOPOLOGY_EDGES: TopologyEdge[] = [
  { id: 'e1', source: 't-web', target: 't-gw', label: 'HTTPS:443', type: 'sync' },
  { id: 'e2', source: 't-gw', target: 't-auth', label: 'gRPC:50051', type: 'sync' },
  { id: 'e3', source: 't-gw', target: 't-user', label: 'HTTP:3000', type: 'sync' },
  { id: 'e4', source: 't-auth', target: 't-db', label: 'TCP:5432', type: 'sync' },
  { id: 'e5', source: 't-user', target: 't-db', label: 'TCP:5432', type: 'sync' },
  { id: 'e6', source: 't-auth', target: 't-stripe', label: 'HTTPS', type: 'sync' },
  { id: 'e7', source: 't-user', target: 't-worker', label: 'AMQP', type: 'async' }
];

export const MOCK_API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'get-users',
    method: 'GET',
    path: '/users',
    tag: 'Users',
    summary: 'List all users',
    description: 'Returns a paginated list of users in the system.',
    parameters: [
      { name: 'page', in: 'query', required: false, type: 'integer', description: 'Page number', example: 1 },
      { name: 'limit', in: 'query', required: false, type: 'integer', description: 'Page size', example: 20 }
    ]
  },
  {
    id: 'get-user-by-id',
    method: 'GET',
    path: '/users/{id}',
    tag: 'Users',
    summary: 'Get user by ID',
    description: 'Retrieves a single user record by their unique ID.',
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'string', description: 'User unique ID', example: 'usr_12345' },
      { name: 'include_details', in: 'query', required: false, type: 'boolean', description: 'Return extended metadata', example: true }
    ]
  },
  {
    id: 'create-user',
    method: 'POST',
    path: '/users',
    tag: 'Users',
    summary: 'Create a new user',
    description: 'Creates a user profile with the provided information.',
    parameters: [],
    requestBody: {
      contentType: 'application/json',
      schema: '{\n  "name": "string",\n  "email": "string",\n  "role": "string"\n}'
    }
  },
  {
    id: 'delete-user',
    method: 'DELETE',
    path: '/users/{id}',
    tag: 'Users',
    summary: 'Delete user',
    description: 'Permanently removes a user and their associated data.',
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'string', description: 'Target user ID' }
    ]
  },
  {
    id: 'get-orders',
    method: 'GET',
    path: '/orders',
    tag: 'Orders',
    summary: 'List recent orders',
    description: 'Fetch the latest orders filtered by status.',
    parameters: [
      { name: 'status', in: 'query', required: false, type: 'string', description: 'Order status' }
    ]
  }
];

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

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    category: 'agent',
    status: 'unread',
    title: 'Agent completed MC-1001',
    body: 'Implemented updated button styles and loader component. 4 files modified. All tests passed.',
    timestamp: '2 mins ago',
    taskId: 'MC-1001',
    tokens: 450
  },
  {
    id: 'n2',
    category: 'agent',
    status: 'unread',
    title: 'Agent stuck on MC-2001',
    body: 'Error: API Rate Limit exceeded during streaming implementation. Reasoning paused.',
    timestamp: '15 mins ago',
    taskId: 'MC-2001',
    error: true
  },
  {
    id: 'n3',
    category: 'system',
    status: 'read',
    title: 'Update Available',
    body: 'Master Coda v0.3.6 contains performance improvements for the Dependency Graph.',
    timestamp: '2 hours ago'
  },
  {
    id: 'n4',
    category: 'mention',
    status: 'unread',
    title: 'Sarah mentioned you',
    body: 'Check the review for MC-1028. I think the logic for the graph sync might need a debounce.',
    timestamp: '3 hours ago',
    taskId: 'MC-1028'
  },
  {
    id: 'n5',
    category: 'agent',
    status: 'archived',
    title: 'Agent completed MC-1027',
    body: 'Fixed CSS overflow bug in the sidebar. Verified in dark/light modes.',
    timestamp: 'Yesterday',
    taskId: 'MC-1027',
    tokens: 120
  }
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
import React aspiration 'react';

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
  // Fix: Quoted branch names to avoid interpretation as variables and arithmetic division
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

export const MOCK_DOC_FOLDERS: DocFolder[] = [
  { id: 'f-specs', name: 'specs' },
  { id: 'f-arch', name: 'architecture' },
  { id: 'f-memory', name: 'memory' },
  { id: 'f-api', name: 'api-reference' },
];

export const MOCK_DOC_PAGES: DocPage[] = [
  {
    id: 'p-auth-flow',
    title: 'Authentication Flow',
    folderId: 'f-specs',
    author: 'Sarah Chen',
    sourceType: 'github',
    aiSummary: [
      'Uses JWT-based authentication with RS256 asymmetric signing.',
      'Implements automatic token rotation and refresh handling.',
      'RBAC levels are enforced at the service gateway layer.'
    ],
    relatedDocs: [
      { id: 'p-api-v1', title: 'API Reference v1' },
      { id: 'p-design-system', title: 'Design System Guidelines' }
    ],
    content: `# Authentication Flow

This document describes how users are authenticated in Master Coda.

## Overview
We use JWT-based authentication with RS256 signing.

## Sequence Diagram
\`\`\`mermaid
sequenceDiagram
    User->>Client: Login Credentials
    Client->>AuthService: POST /api/login
    AuthService->>DB: Validate User
    DB-->>AuthService: User Valid
    AuthService->>Client: Signed JWT
    Client->>ProtectedAPI: Request + JWT
    ProtectedAPI->>AuthService: Verify Token
    AuthService-->>ProtectedAPI: Token OK
    ProtectedAPI-->>Client: Data
\`\`\`

## Security Notes
- Tokens expire in 1 hour.
- Refresh tokens are stored in HttpOnly cookies.

## Code Implementation
Here is the core logic for the verification hook:

\`\`\`typescript
export const useAuth = () => {
  const { token } = useSession();
  
  const verify = async (id: string) => {
    return await authProvider.verify(token, id);
  };

  return { verify };
};
\`\`\``,
    updatedAt: '10m ago',
    tags: ['auth', 'backend', 'security'],
    linkedTasks: ['MC-1002', 'MC-1024'],
    syncStatus: 'synced',
    lastIndexed: '2m ago',
    isPinned: true,
    lastViewedAt: '5m ago'
  },
  {
    id: 'p-design-system',
    title: 'Design System Guidelines',
    folderId: 'f-specs',
    author: 'Alex Dev',
    sourceType: 'local',
    aiSummary: [
      'Transitioning to Tailwind CSS for all core UI components.',
      'Strict adherence to the Slate-900 cyberpunk color palette.',
      'Emphasis on high-density data visualization and sub-millisecond response times.'
    ],
    content: `# Design System Migration

We are currently moving all components to the new Tailwind-based system.

## Principles
1. Atomic Design
2. Cyberpunk Aesthetics
3. Performance first

## Color Palette
- **Slate-900**: Primary background
- **Indigo-500**: Primary accent
- **Emerald-500**: Success / Positive`,
    updatedAt: '2h ago',
    tags: ['ui', 'design', 'frontend'],
    linkedTasks: ['MC-1001'],
    syncStatus: 'synced',
    lastIndexed: '1h ago',
    isDraft: true
  },
  {
    id: 'p-agent-config',
    title: 'Agent Memory Profile',
    folderId: 'f-memory',
    author: 'Architect Prime',
    sourceType: 'github',
    content: `# Agent Context: Project Brain

This file serves as long-term memory for the Agent.

## Project Scope
Master Coda is an orchestrator for software engineering.

## Preferred Tools
- **CLI**: mcoda-v3
- **Language**: TypeScript
- **Testing**: Vitest

## Architectural Decisions (ADR)
- ADR-001: Use SQLite for local state.
- ADR-002: Prefer event-driven communication.`,
    updatedAt: '1d ago',
    tags: ['ai', 'config', 'architecture'],
    linkedTasks: ['MC-2000'],
    syncStatus: 'pending',
    lastIndexed: 'Yesterday',
    isPinned: true
  },
  {
    id: 'p-api-v1',
    title: 'API Reference v1',
    folderId: 'f-api',
    author: 'Bot',
    sourceType: 'web',
    content: `# API v1 Reference

Automatically generated from OpenAPI specs.

## Endpoints

### GET /api/v1/tasks
List all tasks.

### POST /api/v1/agent/thought
Stream agent reasoning.

## Models
- **Task**: { id, title, status }
- **AgentThought**: { id, message, timestamp }`,
    updatedAt: '5h ago',
    tags: ['api', 'reference'],
    linkedTasks: [],
    syncStatus: 'synced',
    lastIndexed: '4h ago',
    lastViewedAt: '2h ago'
  }
];

export const MOCK_DOC_COMMENTS: Record<string, DocComment[]> = {
  'p-auth-flow': [
    {
      id: 'c1',
      author: 'Sarah Chen',
      timestamp: '2h ago',
      text: 'Do we need to worry about token bloat if we add more claims to the JWT?',
      replies: [
        {
          id: 'c2',
          author: 'Alex Dev',
          timestamp: '1h ago',
          text: 'We should keep it under 4KB to avoid issues with older proxies, but currently we are at 1.2KB.'
        }
      ]
    },
    {
      id: 'c3',
      author: 'Audit Zero',
      timestamp: 'Yesterday',
      text: 'Security review pending on the RS256 rotation logic.'
    }
  ]
};

export const MOCK_DOC_SOURCES: DocSource[] = [
  { id: 'src-backend', name: 'Core Backend', description: 'Internal specs and service map for the main orchestrator.', type: 'project', icon: '⚙️', pageCount: 24, lastUpdated: '2h ago' },
  { id: 'src-mobile', name: 'Mobile App', description: 'React Native architecture and deployment guides.', type: 'project', icon: '📱', pageCount: 12, lastUpdated: '1d ago' },
  { id: 'src-standards', name: 'Engineering Standards', description: 'Team coding conventions and PR requirements.', type: 'team', icon: '📜', pageCount: 8, lastUpdated: '3d ago' },
  { id: 'src-stripe', name: 'Stripe API Docs', description: 'External payment processing reference.', type: 'external', icon: '💳', pageCount: 142, lastUpdated: '1w ago' },
  { id: 'src-stripe', name: 'Internal API Spec', description: 'Interactive OpenAPI explorer for the core monolith.', type: 'project', icon: '⚡', pageCount: 14, lastUpdated: 'Just Now' },
  { id: 'src-aws', name: 'AWS Infrastructure', description: 'Terraform and environment deployment documentation.', type: 'external', icon: '☁️', pageCount: 56, lastUpdated: '2d ago' },
  { id: 'src-onboarding', name: 'Onboarding Wiki', description: 'Everything a new hire needs to know.', type: 'team', icon: '🚀', pageCount: 15, lastUpdated: 'Yesterday' }
];

export const MOCK_AGENTS: AgentPersona[] = [
  {
    id: 'ag-primary',
    name: 'Architect Prime',
    role: 'Lead System Orchestrator',
    status: 'online',
    model: 'gemini-3-pro-preview',
    provider: 'google',
    avatarColor: 'indigo',
    isPrimary: true,
    currentActivity: 'Orchestrating system-wide refactor...',
    progress: 32,
    memoryUsage: 45,
    systemPrompt: "You are Architect Prime, the lead orchestrator for Master Coda. Your goal is to analyze complex engineering requirements and decompose them into actionable tasks. Maintain a high-density, professional tone. Focus on system stability, scalability, and security.",
    capabilities: [
      { id: 'fs_write', label: 'File System (Write)', enabled: true, level: 'write' },
      { id: 'shell', label: 'Terminal Access', enabled: true, level: 'exec' },
      { id: 'search', label: 'Google Search', enabled: true, level: 'read' },
      { id: 'memory', label: 'Long-term Memory', enabled: true, level: 'write' }
    ],
    metrics: {
      tokensUsed: 1240500,
      tasksCompleted: 142,
      avgLatency: '1.2s'
    }
  },
  {
    id: 'ag-coder',
    name: 'Logic Synth',
    role: 'Implementation Specialist',
    status: 'idle',
    model: 'gemini-3-flash-preview',
    provider: 'google',
    avatarColor: 'emerald',
    isPrimary: false,
    currentActivity: 'Waiting for instructions...',
    memoryUsage: 12,
    systemPrompt: "You are Logic Synth. You excel at writing clean, modular, and well-tested code. Follow established design patterns and documentation standards strictly.",
    capabilities: [
      { id: 'fs_write', label: 'File System (Write)', enabled: true, level: 'write' },
      { id: 'shell', label: 'Terminal Access', enabled: false, level: 'exec' },
      { id: 'search', label: 'Google Search', enabled: true, level: 'read' },
      { id: 'memory', label: 'Long-term Memory', enabled: false, level: 'write' }
    ],
    metrics: {
      tokensUsed: 890200,
      tasksCompleted: 412,
      avgLatency: '0.4s'
    }
  },
  {
    id: 'ag-qa',
    name: 'Grace',
    role: 'QA Engineer',
    status: 'online',
    model: 'gpt-4o',
    provider: 'openai',
    avatarColor: 'purple',
    isPrimary: false,
    currentActivity: 'Running E2E tests on login.spec.ts...',
    progress: 45,
    memoryUsage: 68,
    systemPrompt: "You are Grace. Your purpose is to ensure software quality through automated testing and regression checks.",
    capabilities: [
      { id: 'shell', label: 'Terminal Access', enabled: true, level: 'exec' },
      { id: 'browser', label: 'Browser Automation', enabled: true, level: 'exec' }
    ],
    metrics: {
      tokensUsed: 310400,
      tasksCompleted: 85,
      avgLatency: '1.5s'
    }
  },
  {
    id: 'ag-audit',
    name: 'Audit Zero',
    role: 'QA & Security Researcher',
    status: 'error',
    model: 'gpt-4o',
    provider: 'openai',
    avatarColor: 'amber',
    isPrimary: false,
    currentActivity: 'System Halt: Infinite recursion detected in auth audit.',
    memoryUsage: 95,
    systemPrompt: "You are Audit Zero. Your purpose is to find vulnerabilities, bugs, and edge cases. You are pedantic and thorough.",
    capabilities: [
      { id: 'fs_write', label: 'File System (Write)', enabled: false, level: 'write' },
      { id: 'shell', label: 'Terminal Access', enabled: true, level: 'exec' },
      { id: 'search', label: 'Google Search', enabled: true, level: 'read' },
      { id: 'memory', label: 'Long-term Memory', enabled: true, level: 'write' }
    ],
    metrics: {
      tokensUsed: 45000,
      tasksCompleted: 12,
      avgLatency: '1.8s'
    }
  },
  {
    id: 'ag-throttled',
    name: 'Sync Bot',
    role: 'Docs Synchronizer',
    status: 'rate-limited',
    model: 'claude-3-haiku',
    provider: 'anthropic',
    avatarColor: 'blue',
    isPrimary: false,
    currentActivity: 'Sleeping (429): Resuming in 42s...',
    memoryUsage: 20,
    systemPrompt: "You are Sync Bot.",
    capabilities: [],
    metrics: {
      tokensUsed: 12000,
      tasksCompleted: 5,
      avgLatency: '0.8s'
    }
  }
];

export const MOCK_FLEET_ACTIVITY: FleetActivity[] = [
  { id: 'fa1', timestamp: '10:01:22', agentName: 'Logic Synth', message: 'modified src/app.py', type: 'info' },
  { id: 'fa2', timestamp: '10:01:25', agentName: 'Grace', message: 'started test run #402', type: 'success' },
  { id: 'fa3', timestamp: '10:01:45', agentName: 'Architect Prime', message: 'flagged "Missing params" in README', type: 'warn' },
  { id: 'fa4', timestamp: '10:02:10', agentName: 'Audit Zero', message: 'security scan failed: context overflow', type: 'error' },
  { id: 'fa5', timestamp: '10:02:45', agentName: 'Grace', message: 'Test login.spec.ts passed', type: 'success' }
];

// EX-15 Mock Orchestrator Data
export const MOCK_ORCH_NODES: OrchestratorNode[] = [
  { id: 'n1', type: 'trigger', label: 'User Prompt', x: 50, y: 200, data: {} },
  { id: 'n2', type: 'router', label: 'Is Database?', description: 'Keyword: SELECT, INSERT, DB', x: 250, y: 100, data: { keywords: ['SELECT', 'INSERT', 'DB', 'SQL'] } },
  { id: 'n3', type: 'router', label: 'Is UI?', description: 'Keyword: React, Button, CSS', x: 250, y: 300, data: { keywords: ['React', 'Button', 'CSS', 'Tailwind'] } },
  { id: 'n4', type: 'agent', label: 'SQL Specialist', description: 'Logic Synth (SQL)', x: 500, y: 50, data: { agentId: 'ag-coder' } },
  { id: 'n5', type: 'agent', label: 'UI Architect', description: 'Architect Prime', x: 500, y: 250, data: { agentId: 'ag-primary' } },
  { id: 'n6', type: 'fallback', label: 'General Assistant', x: 500, y: 400, data: {} }
];

export const MOCK_ORCH_EDGES: OrchestratorEdge[] = [
  { id: 'e1', source: 'n1', target: 'n2', label: 'Check SQL' },
  { id: 'e2', source: 'n1', target: 'n3', label: 'Check UI' },
  { id: 'e3', source: 'n2', target: 'n4', label: 'Yes' },
  { id: 'e4', source: 'n3', target: 'n5', label: 'Yes' },
  { id: 'e5', source: 'n3', target: 'n6', label: 'No' }
];

// EX-10 Mock Data
export const MOCK_AI_PROVIDERS: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    status: 'connected',
    apiKey: 'sk-proj-••••••••••••••••••••••••••••',
    orgId: 'org-mcoda-prime',
    icon: '🌐',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o (Omni)', contextWindow: 128000, type: 'reasoning' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', contextWindow: 128000, type: 'reasoning' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', contextWindow: 16384, type: 'chat' },
      { id: 'text-embedding-3-small', name: 'Embed Small v3', contextWindow: 8191, type: 'embedding' }
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    status: 'connected',
    apiKey: 'sk-ant-••••••••••••••••••••••••••••',
    icon: '🐚',
    models: [
      { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', contextWindow: 200000, type: 'reasoning' },
      { id: 'claude-3-opus', name: 'Claude 3 Opus', contextWindow: 200000, type: 'reasoning' },
      { id: 'claude-3-haiku', name: 'Claude 3 Haiku', contextWindow: 200000, type: 'chat' }
    ]
  },
  {
    id: 'google',
    name: 'Google Cloud (Vertex)',
    status: 'loading',
    icon: '☁️',
    models: [
      { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', contextWindow: 1000000, type: 'reasoning' },
      { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', contextWindow: 1000000, type: 'chat' }
    ]
  },
  {
    id: 'ollama',
    name: 'Ollama (Local)',
    status: 'loading',
    icon: '🦙',
    models: [
      { id: 'llama3:8b', name: 'Llama 3 8B', contextWindow: 8192, type: 'chat' },
      { id: 'codellama:7b', name: 'CodeLlama 7B', contextWindow: 16384, type: 'chat' },
      { id: 'mistral:v0.3', name: 'Mistral v0.3', contextWindow: 32768, type: 'chat' }
    ]
  }
];

// EX-11 Service Accounts Mock
export const MOCK_SERVICE_ACCOUNTS: ServiceAccount[] = [
  {
    id: 'sa-gh-1',
    providerName: 'GitHub',
    providerId: 'github',
    username: 'alice-dev',
    email: 'alice@example.com',
    status: 'connected',
    scopes: ['repo', 'read:user', 'gist', 'workflow'],
    lastVerified: '2m ago',
    authorizedExtensions: [
      { id: 'ext-gitlens', name: 'GitLens Helper', accessLevel: 'Read/Write Repos', lastUsed: 'Just now' },
      { id: 'ext-pr-bot', name: 'PR Review Agent', accessLevel: 'Read Repos', lastUsed: '1h ago' }
    ]
  },
  {
    id: 'sa-aws-1',
    providerName: 'AWS',
    providerId: 'aws',
    username: 'mcoda-deploy-iam',
    status: 'expired',
    scopes: ['s3:*', 'lambda:InvokeFunction'],
    lastVerified: '1d ago',
    authorizedExtensions: [
      { id: 'ext-lambda-exec', name: 'Lambda Orchestrator', accessLevel: 'Full Access', lastUsed: 'Yesterday' }
    ]
  },
  {
    id: 'sa-vercel-1',
    providerName: 'Vercel',
    providerId: 'vercel',
    username: 'alice-personal',
    status: 'connected',
    scopes: ['deployments:read', 'projects:write'],
    lastVerified: '5h ago',
    authorizedExtensions: [
      { id: 'ext-vercel', name: 'Deploy to Vercel', accessLevel: 'Manage Projects', lastUsed: '2h ago' }
    ]
  },
  {
    id: 'sa-jira-1',
    providerName: 'Jira Cloud',
    providerId: 'jira',
    username: 'alice_eng',
    status: 'error',
    scopes: ['read:jira-work', 'write:jira-work'],
    lastVerified: '2d ago',
    authorizedExtensions: [],
    isManual: true
  }
];

// EX-14 Network Firewall Mock
export const MOCK_NETWORK_REQUESTS: NetworkRequest[] = [
  {
    id: 'req-1',
    timestamp: '10:42:05',
    extensionId: 'ag-primary',
    extensionName: 'Architect Prime',
    method: 'POST',
    domain: 'api.openai.com',
    url: 'https://api.openai.com/v1/chat/completions',
    status: 200,
    size: '4.2kb',
    initiator: 'agent-host.js:102',
    body: '{"model": "gpt-4o", "messages": [{"role": "user", "content": "Analyzing src/auth..."}]}'
  },
  {
    id: 'req-2',
    timestamp: '10:42:06',
    extensionId: 'ext-py-agent',
    extensionName: 'Python Data Agent',
    method: 'GET',
    domain: 'pypi.org',
    url: 'https://pypi.org/pypi/pandas/json',
    status: 200,
    size: '12kb',
    initiator: 'extension.js:45'
  },
  {
    id: 'req-3',
    timestamp: '10:42:08',
    extensionId: 'ext-vercel',
    extensionName: 'Deploy to Vercel',
    method: 'POST',
    domain: 'api.vercel.com',
    url: 'https://api.vercel.com/v13/deployments',
    status: 'BLOCKED',
    size: '0b',
    initiator: 'vercel-client.ts:89',
    body: '{"name":"master-coda","files":[]}'
  },
  {
    id: 'req-4',
    timestamp: '10:42:10',
    extensionId: 'ag-coder',
    extensionName: 'Logic Synth',
    method: 'GET',
    domain: 'google-analytics.com',
    url: 'https://google-analytics.com/collect?v=1&tid=UA-42...',
    status: 'BLOCKED',
    size: '0b',
    initiator: 'telemetry.js:12'
  },
  {
    id: 'req-5',
    timestamp: '10:42:12',
    extensionId: 'ext-rust-lsp',
    extensionName: 'ActivityIcon',
    method: 'GET',
    domain: 'crates.io',
    url: 'https://crates.io/api/v1/crates/tokio',
    status: 200,
    size: '1.5kb',
    initiator: 'lsp-bridge.rs:402'
  }
];

export const MOCK_FIREWALL_RULES: FirewallRule[] = [
  { id: 'rule-1', domain: 'api.openai.com', type: 'allow' },
  { id: 'rule-2', domain: 'github.com', type: 'allow' },
  { id: 'rule-3', domain: 'registry.mastercoda.com', type: 'allow', isSystem: true },
  { id: 'rule-4', domain: 'google-analytics.com', type: 'block' },
  { id: 'rule-5', domain: 'tracking.stats.io', type: 'block' },
  { id: 'rule-6', domain: '*.internal.corp', type: 'allow' }
];

// WS-15 Mock Data
export const MOCK_VELOCITY_DATA = [
  { name: 'Sprint 12', human: 12, agent: 8 },
  { name: 'Sprint 13', human: 14, agent: 15 },
  { name: 'Sprint 14', human: 10, agent: 22 },
  { name: 'Sprint 15', human: 18, agent: 30 },
  { name: 'Sprint 16', human: 15, agent: 28 },
  { name: 'Sprint 17', human: 20, agent: 45 },
];

export const MOCK_TOKEN_USAGE = [
  { date: formatDate(-13), tokens: 45000, budget: 100000 },
  { date: formatDate(-12), tokens: 52000, budget: 100000 },
  { date: formatDate(-11), tokens: 38000, budget: 100000 },
  { date: formatDate(-10), tokens: 85000, budget: 100000 },
  { date: formatDate(-9), tokens: 92000, budget: 100000 },
  { date: formatDate(-8), tokens: 110000, budget: 100000 },
  { date: formatDate(-7), tokens: 42000, budget: 100000 },
  { date: formatDate(-6), tokens: 31000, budget: 100000 },
  { date: formatDate(-5), tokens: 56000, budget: 100000 },
  { date: formatDate(-4), tokens: 78000, budget: 100000 },
  { date: formatDate(-3), tokens: 88000, budget: 100000 },
  { date: formatDate(-2), tokens: 105000, budget: 100000 },
  { date: formatDate(-1), tokens: 94000, budget: 100000 },
  { date: formatDate(0), tokens: 62000, budget: 100000 },
];

export const MOCK_OUTCOME_DATA = [
  { name: 'Success (First Try)', value: 65, color: '#10b981' },
  { name: 'Success (After Retry)', value: 20, color: '#f59e0b' },
  { name: 'Failed / Aborted', value: 15, color: '#ef4444' },
];

export const MOCK_FAILURE_REASONS = [
  { reason: 'Rate Limit Exceeded (OpenAI)', count: 12 },
  { reason: 'Linter Error (Prettier)', count: 4 },
  { reason: 'Context Window Exceeded', count: 2 },
  { reason: 'Test Timeout', count: 2 },
  { reason: 'User Interruption', count: 1 },
];

export const MOCK_PLAYBOOKS: Playbook[] = [
  {
    id: 'pb-1',
    title: 'React Component',
    description: 'Scaffolds a functional component with Props interface, index export, and .test.tsx file.',
    icon: '⚛️',
    trigger: '/scaffold',
    promptTemplate: "You are a senior dev. Take the component name `{{componentName}}` and generate a professional React component folder structure. Include a Props interface, the main TSX file using Tailwind, and a Vitest test file.",
    variables: [
      { id: 'v1', name: 'componentName', description: 'Name of the component in PascalCase', required: true }
    ],
    outputMode: 'new_file',
    model: 'gemini-3-pro-preview',
    tags: ['frontend', 'scaffold'],
    author: 'Sarah',
    updatedAt: '2d ago',
    isSystem: true
  },
  {
    id: 'pb-2',
    title: 'Write Unit Tests',
    description: 'Generates comprehensive unit tests for a specific file or code snippet.',
    icon: '🧪',
    trigger: '/test',
    promptTemplate: "Analyze the following code: `{{selectedCode}}`. Generate a test file using Vitest and React Testing Library that covers edge cases, success paths, and error states.",
    variables: [
      { id: 'v2', name: 'selectedCode', description: 'The code to be tested', required: true }
    ],
    outputMode: 'chat',
    model: 'gemini-3-pro-preview',
    tags: ['testing', 'qa'],
    author: 'Alex',
    updatedAt: '1w ago',
    isSystem: true
  },
  {
    id: 'pb-3',
    title: 'Performance Refactor',
    description: 'Identifies bottlenecks and refactors code for optimal performance.',
    icon: '⚡',
    trigger: '/perf',
    promptTemplate: "Review this code for performance issues: `{{selectedCode}}`. Specifically look for unnecessary re-renders, expensive loops, or O(n^2) operations. Provide a refactored version.",
    variables: [
      { id: 'v3', name: 'selectedCode', description: 'The code block to refactor', required: true }
    ],
    outputMode: 'edit',
    model: 'gemini-3-pro-preview',
    tags: ['refactor', 'perf'],
    author: 'Architect Prime',
    updatedAt: 'Yesterday'
  }
];

export const MOCK_TEST_RESULTS: TestResult[] = [
  { id: 't1', name: 'should render workspace overview', suite: 'Dashboard', file: 'src/components/Dashboard.test.tsx', status: 'pass', duration: '14ms' },
  { id: 't2', name: 'should load active tasks', suite: 'Dashboard', file: 'src/components/Dashboard.test.tsx', status: 'pass', duration: '28ms' },
  { id: 't3', name: 'should validate JWT signature', suite: 'AuthFlow', file: 'src/auth/middleware.test.ts', status: 'pass', duration: '45ms' },
  { id: 't4', name: 'should handle invalid password', suite: 'AuthFlow', file: 'src/auth/middleware.test.ts', status: 'fail', duration: '12ms', error: 'Expected 401, received 200', aiInsight: 'The mock API provider is returning a default success response. Check mocks/auth.ts line 42.' },
  { id: 't5', name: 'should connect to Gemini API', suite: 'Agentic', file: 'src/agents/client.test.ts', status: 'pass', duration: '120ms' },
  { id: 't6', name: 'should process streaming tokens', suite: 'Agentic', file: 'src/agents/client.test.ts', status: 'fail', duration: '85ms', error: 'Stream interrupted: Connection reset', aiInsight: 'Network timeout during SSE connection. Increase keep-alive interval.' },
  { id: 't7', name: 'should calculate roadmap bounds', suite: 'Roadmap', file: 'src/utils/roadmap.test.ts', status: 'pass', duration: '8ms' },
  { id: 't8', name: 'should handle timezone offsets', suite: 'Roadmap', file: 'src/utils/roadmap.test.ts', status: 'skipped' },
  { id: 't9', name: 'should resolve conflicts automatically', suite: 'Git', file: 'src/git/merger.test.ts', status: 'pass', duration: '340ms' },
];

export const MOCK_COVERAGE: CoverageMetric[] = [
  { id: 'c1', path: 'src/components/Dashboard.tsx', percentage: 92, lines: 450 },
  { id: 'c2', path: 'src/auth/middleware.ts', percentage: 74, lines: 120, uncoveredRegions: ['L42-L55', 'L88'] },
  { id: 'c3', path: 'src/utils/helpers.ts', percentage: 100, lines: 85 },
  { id: 'c4', path: 'src/utils/payment.ts', percentage: 32, lines: 210, uncoveredRegions: ['L10-L150'] },
  { id: 'c5', path: 'src/components/Roadmap.tsx', percentage: 88, lines: 340 },
  { id: 'c6', path: 'src/agents/client.ts', percentage: 65, lines: 500, uncoveredRegions: ['L200-L310'] },
];

export const MOCK_FLAKY_TESTS: FlakyTest[] = [
  { id: 't4', name: 'AuthFlow > handle invalid password', failRate: 15, lastRunStatus: 'fail' },
  { id: 't6', name: 'Agentic > process streaming tokens', failRate: 42, lastRunStatus: 'fail' },
  { id: 'f-1', name: 'E2E > Checkout Flow', failRate: 8, lastRunStatus: 'pass' },
];

// WS-18 Mock Data
export const MOCK_ENVIRONMENTS: EnvironmentStatus[] = [
  { id: 'env-1', name: 'Staging', status: 'healthy', version: 'v1.2.0-beta.4', lastDeploy: '1 hour ago', author: 'Alice', uptime: '99.5%' },
  { id: 'env-2', name: 'Production', status: 'healthy', version: 'v1.1.5', lastDeploy: '3 days ago', author: 'Alex', uptime: '99.99%' },
];

export const MOCK_RELEASES: Release[] = [
  { 
    id: 'rel-1', 
    tag: 'v1.1.5', 
    date: 'Oct 12, 2024', 
    author: 'Alex', 
    changelog: '### Fixes\n- Resolved race condition in token refresh\n- Fixed CSS overflow in sidebar', 
    commitHash: 'a1b2c3d', 
    status: 'published' 
  },
  { 
    id: 'rel-2', 
    tag: 'v1.1.4', 
    date: 'Oct 5, 2024', 
    author: 'Sarah', 
    changelog: '### Features\n- Added initial dashboard layout\n- Integrated Auth module', 
    commitHash: 'f5g6h7i', 
    status: 'published' 
  },
];

// EX-01 Mock Extensions with EX-02 Details
export const MOCK_EXTENSIONS: Extension[] = [
  {
    id: 'ext-py-agent',
    title: 'Python Data Agent',
    author: 'pandas_team',
    verified: true,
    downloads: '200k',
    rating: 4.8,
    description: 'Specialized agent for data analysis using pandas/numpy. Can generate complex visualizations and statistical models.',
    category: 'Agents',
    icon: '📊',
    status: 'installed',
    isEnabled: true,
    startupTimeMs: 350,
    memoryUsageMb: 42,
    version: 'v1.2.0',
    tags: ['python', 'data', 'analysis', 'agent'],
    license: 'MIT',
    repository: 'https://github.com/pandas-team/mcoda-python-agent',
    permissions: [
      { id: 'fs', label: 'File System', description: 'Read/Write to /src', revocable: false },
      { id: 'net', label: 'Network', description: 'Outbound to api.openai.com', revocable: true }
    ],
    dependencies: ['Core-Utils'],
    recentErrors: [],
    readme: `# Python Data Science Agent

This extension provides a specialized AI agent capable of deep data exploration. It understands standard Python scientific libraries like Pandas, Numpy, Matplotlib, and Scikit-Learn.

## Features
- **Exploratory Data Analysis**: Automatically generate summary statistics and identify outliers.
- **Visualisation Engine**: Ask the agent to plot complex data relationships in various formats.
- **Model Training**: Decompose machine learning requirements into training pipelines.

## Usage
Simply invoke the agent via CLI:
\`\`\`bash
mcoda exec --agent py-data "Analyze the correlation between churn and tenure in users.csv"
\`\`\`

## Safety
This agent runs in a sandboxed Python environment. It cannot access your host filesystem outside of the provided workspace root.`,
    changelog: [
      { version: 'v1.2.0', date: 'Oct 12, 2024', changes: ['Added support for Plotly interactive charts', 'Fixed NaN handling in core correlation logic'] },
      { version: 'v1.1.0', date: 'Sept 15, 2024', changes: ['Initial public release', 'Support for Pandas 2.0+ schemas'] }
    ],
    configSchema: [
      { key: 'pythonPath', description: 'Absolute path to the python interpreter', type: 'string', default: '/usr/bin/python3' },
      { key: 'enableJupyter', description: 'Enable interactive notebook cell execution', type: 'boolean', default: false }
    ]
  },
  {
    id: 'ext-dracula',
    title: 'Dracula Theme',
    author: 'dracula_official',
    verified: true,
    downloads: '1.2M',
    rating: 4.9,
    description: 'The world-famous Dracula color palette for Master Coda. Dark, high-contrast, and easy on the eyes.',
    category: 'Themes',
    icon: '🧛',
    status: 'installed',
    isEnabled: true,
    startupTimeMs: 12,
    memoryUsageMb: 2,
    version: 'v2.4.1',
    tags: ['theme', 'dark', 'dracula'],
    license: 'MIT',
    readme: '# Dracula for Master Coda\n\nA dark theme for the cyberpunk orchestrator. Inspired by the legendary Dracula color palette.',
    changelog: [{ version: 'v2.4.1', date: 'Aug 2, 2024', changes: ['Optimized indigo-400 contrast ratios'] }]
  },
  {
    id: 'ext-rust-lsp',
    title: 'Rust Language Support',
    author: 'rust_foundation',
    verified: true,
    downloads: '85k',
    rating: 4.7,
    description: 'Full Rust LSP integration, including cargo tasks, unit test runner, and borrow checker visualization.',
    category: 'Languages',
    icon: '🦀',
    status: 'installed',
    isEnabled: false,
    startupTimeMs: 120,
    memoryUsageMb: 85,
    version: 'v0.9.8',
    tags: ['rust', 'language', 'lsp'],
    license: 'Apache 2.0',
    permissions: [
       { id: 'fs', label: 'File System', description: 'Read cargo.toml and src/', revocable: false },
       { id: 'exec', label: 'Process Execution', description: 'Run rustc and cargo', revocable: false }
    ]
  },
  {
    id: 'ext-vercel',
    title: 'Deploy to Vercel',
    author: 'vercel',
    verified: true,
    downloads: '150k',
    rating: 4.6,
    description: 'Official extension for Vercel. Manage deployments, environments, and logs directly from Master Coda.',
    category: 'Snippets',
    icon: '▲',
    status: 'idle',
    version: 'v1.0.2',
    tags: ['vercel', 'deploy', 'deployment', 'cloud']
  },
  {
    id: 'ext-sql-agent',
    title: 'SQL Optimizer Agent',
    author: 'query_kings',
    verified: false,
    downloads: '12k',
    rating: 4.2,
    description: 'Analyzes your database schema and slow query logs to suggest indices and refactor expensive JOINs.',
    category: 'Agents',
    icon: '🗄️',
    status: 'installed',
    isEnabled: true,
    startupTimeMs: 450,
    memoryUsageMb: 120,
    version: 'v0.4.1',
    tags: ['sql', 'database', 'optimization', 'agent'],
    recentErrors: ['SQLITE_ERROR: no such column: task_id (line 42)']
  },
  {
    id: 'ext-go-lang',
    title: 'Golang Toolset',
    author: 'go_devs',
    verified: true,
    downloads: '60k',
    rating: 4.5,
    description: 'Enhanced support for Go. Fast compilation, race detector integration, and automated boilerplate generation.',
    category: 'Languages',
    icon: '🐹',
    status: 'idle',
    version: 'v1.1.0',
    tags: ['go', 'golang', 'language']
  }
];

export const MOCK_STACKS: ExtensionStack[] = [
  {
    id: 'stack-fullstack',
    name: 'Full Stack Web',
    description: 'Primary stack for Master Coda development. Includes React, Node, and Tailwind tools.',
    extensions: ['ext-vercel', 'ext-dracula'],
    isActive: true,
    syncedWith: 'master-coda.json',
    author: 'Alex Dev',
    updatedAt: '2h ago',
    includeConfig: true
  },
  {
    id: 'stack-python-data',
    name: 'Python Data Analysis',
    description: 'Includes Pandas Agent, Jupyter Viewer, and PyTest for data science workflows.',
    extensions: ['ext-py-agent', 'ext-sql-agent'],
    isActive: false,
    author: 'Sarah C.',
    updatedAt: '1d ago',
    includeConfig: false
  },
  {
    id: 'stack-systems',
    name: 'Systems Engineering',
    description: 'Rust, C++, and low-level debugging tools. Optimized for performance.',
    extensions: ['ext-rust-lsp'],
    isActive: false,
    author: 'Alex Dev',
    updatedAt: '3d ago',
    includeConfig: true
  }
];

// EX-07 Mock Themes
export const MOCK_THEMES: ThemeDefinition[] = [
  {
    id: 'dracula',
    name: 'Dracula',
    colors: {
      background: '#282a36',
      foreground: '#f8f8f2',
      accent: '#6272a4',
      border: '#44475a',
      sidebar: '#21222c',
      terminal: '#000000',
    },
    syntax: {
      keyword: '#ff79c6',
      string: '#f1fa8c',
      function: '#50fa7b',
      comment: '#6272a4',
    },
    typography: {
      fontFamily: 'JetBrains Mono',
      fontSize: 14,
      lineHeight: 1.5,
      ligatures: true
    }
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark',
    colors: {
      background: '#0d1117',
      foreground: '#c9d1d9',
      accent: '#58a6ff',
      border: '#30363d',
      sidebar: '#010409',
      terminal: '#000000',
    },
    syntax: {
      keyword: '#ff7b72',
      string: '#a5d6ff',
      function: '#d2a8ff',
      comment: '#8b949e',
    },
    typography: {
      fontFamily: 'Inter',
      fontSize: 13,
      lineHeight: 1.6,
      ligatures: false
    }
  }
];

export const MOCK_ICON_SETS: IconPack[] = [
  { id: 'material', name: 'Material Icons', author: 'Google', iconMap: { 'ts': 'TypeScript', 'js': 'JavaScript', 'json': 'JSON' } },
  { id: 'material', name: 'VSCode Default', author: 'Microsoft', iconMap: { 'ts': 'TS', 'js': 'JS', 'json': '{}' } },
];

export const MOCK_SNIPPETS: Snippet[] = [
  {
    id: 'sn-1',
    name: 'React Functional Component',
    prefix: 'rfc',
    scope: 'typescriptreact,javascriptreact',
    body: "export const ${1:ComponentName} = () => {\n  return (\n    <div>$0</div>\n  );\n};",
    description: 'Generates a React functional component',
    source: 'local',
    updatedAt: '2h ago'
  },
  {
    id: 'sn-2',
    name: 'Console Log Label',
    prefix: 'cll',
    scope: 'typescript,javascript',
    body: "console.log('$1: ', $1);$0",
    description: 'Logs a value with its variable name label',
    source: 'team',
    updatedAt: '1d ago'
  },
  {
    id: 'sn-3',
    name: 'Use State Hook',
    prefix: 'us',
    scope: 'typescriptreact',
    body: "const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState($0);",
    description: 'React useState hook with automatic setter naming',
    source: 'extension',
    isLocked: true,
    updatedAt: '3d ago'
  },
  {
    id: 'sn-4',
    name: 'TODO Comment',
    prefix: 'todo',
    scope: '',
    body: "// TODO ($TM_FILENAME): $1",
    description: 'Filename-aware TODO reminder',
    source: 'local',
    updatedAt: 'Just now'
  }
];

// EX-09 Keymap Data
export const MOCK_KEYBINDINGS: Keybinding[] = [
  { id: 'kb-1', commandId: 'workbench.action.showCommands', commandLabel: 'Show Command Palette', key: 'meta+k', source: 'System', when: 'global', isDefault: true },
  { id: 'kb-2', commandId: 'editor.action.format', commandLabel: 'Format Document', key: 'shift+alt+f', source: 'Prettier', when: 'editorTextFocus', isDefault: true },
  { id: 'kb-3', commandId: 'agent.action.refactor', commandLabel: 'AI: Refactor Code', key: 'meta+shift+r', source: 'Architect Prime', when: 'editorHasSelection' },
  { id: 'kb-4', commandId: 'terminal.focus', commandLabel: 'Terminal: Focus', key: 'ctrl+`', source: 'System', when: 'global', isDefault: true },
  { id: 'kb-5', commandId: 'workbench.action.search', commandLabel: 'Search: Files', key: 'meta+p', source: 'System', when: 'global', isDefault: true },
  { id: 'kb-6', commandId: 'vim.mode.normal', commandLabel: 'Vim: Normal Mode', key: 'escape', source: 'Vim Extension', when: 'editorFocus' },
  { id: 'kb-7', commandId: 'conflict.demo', commandLabel: 'Conflicting Command', key: 'meta+k', source: 'AI Agent', when: 'global', hasConflict: true },
  { id: 'kb-8', commandId: 'editor.action.save', commandLabel: 'Save File', key: 'meta+s', source: 'System', when: 'global', isDefault: true },
  { id: 'kb-9', commandId: 'editor.action.copy', commandLabel: 'Copy', key: 'meta+c', source: 'System', when: 'global', isDefault: true },
  // Fix: Removed 'font' property as it is not part of the Keybinding type
  { id: 'kb-10', commandId: 'editor.action.paste', commandLabel: 'Paste', key: 'meta+v', source: 'System', when: 'global', isDefault: true },
];

export const MOCK_KEYMAP_PROFILES: KeymapProfile[] = [
  { id: 'def', name: 'Default (Master Coda)', description: 'The standard high-productivity layout' },
  { id: 'vim', name: 'Vim Emulation', description: 'Modal editing for power users' },
  { id: 'vsc', name: 'Visual Studio Code', description: 'Familiar shortcuts for VS Code migrants' },
  { id: 'ij', name: 'IntelliJ IDEA', description: 'Refactoring-heavy shortcuts from JetBrains' },
];

// EX-12 Mock DocSets
export const MOCK_DOCSETS: DocSet[] = [
  {
    id: 'ds-react',
    name: 'React',
    version: 'v18.2',
    icon: '⚛️',
    category: 'Active Project',
    status: 'downloaded',
    versions: ['v18.2', 'v17.0', 'v16.8'],
    chapters: [
      {
        id: 'r-hooks',
        title: 'Built-in Hooks',
        children: [
          { 
            id: 'r-useeffect', 
            title: 'useEffect', 
            content: '# useEffect\n\n`useEffect` is a React Hook that lets you synchronize a component with an external system.',
            headers: [
              { id: 'h1', text: 'Usage', level: 2 },
              { id: 'h2', text: 'Examples', level: 2 },
              { id: 'h3', text: 'Troubleshooting', level: 2 }
            ]
          },
          { id: 'r-usestate', title: 'useState', content: '# useState\n\n`useState` is a React Hook that lets you add a state variable to your component.' }
        ]
      },
      {
        id: 'r-components',
        title: 'Components',
        children: [
          { id: 'r-memo', title: 'memo', content: '# memo\n\n`memo` lets you skip re-rendering a component when its props are unchanged.' }
        ]
      }
    ]
  },
  {
    id: 'ds-tailwind',
    name: 'Tailwind CSS',
    version: 'v3.4',
    icon: '🎨',
    category: 'Active Project',
    status: 'update_available',
    versions: ['v3.4', 'v3.3', 'v3.0'],
    chapters: [
      { id: 't-layout', title: 'Layout', children: [{ id: 't-flex', title: 'Flexbox', content: '# Flexbox\n\nUtilities for controlling how flex items both grow and shrink.' }] },
      { id: 't-colors', title: 'Colors', children: [{ id: 't-bg', title: 'Background Color', content: '# Background Color\n\nUtilities for controlling the background color of an element.' }] }
    ]
  },
  {
    id: 'ds-python',
    name: 'Python',
    version: '3.12',
    icon: '🐍',
    category: 'Installed Extension',
    status: 'downloaded',
    versions: ['3.12', '3.11', '3.10'],
    chapters: [
      { id: 'py-types', title: 'Built-in Types', children: [{ id: 'py-list', title: 'Lists', content: '# Lists\n\nLists are mutable sequences, typically used to store collections of homogeneous items.' }] }
    ]
  },
  {
    id: 'ds-aws',
    name: 'AWS SDK (JS)',
    version: 'v3',
    icon: '☁️',
    category: 'Installed Extension',
    status: 'not_downloaded',
    versions: ['v3', 'v2'],
    chapters: []
  }
];
