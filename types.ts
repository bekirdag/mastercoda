
import React from 'react';

export type OmniDrawerState = 'hidden' | 'collapsed' | 'open' | 'maximized';

export type OmniTab = 'terminal' | 'agent' | 'server';

export type PlanViewType = 'board' | 'list' | 'graph' | 'roadmap';

export type TaskType = 'epic' | 'story' | 'task' | 'bug';

export type TaskStatus = 'pending' | 'in-progress' | 'review' | 'qa' | 'completed' | 'failed';

export type FileChangeStatus = 'modified' | 'added' | 'deleted';

export type MissionStatus = 'queued' | 'in-progress' | 'blocked' | 'completed' | 'failed';
export type MissionPriority = 'low' | 'medium' | 'high' | 'urgent';

// AG-19 Milestone & Sprint Types
export type MilestoneStatusType = 'draft' | 'active' | 'completed';
export type SprintStatusType = 'planning' | 'active' | 'completed' | 'archived';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: MilestoneStatusType;
  sprintIds: string[];
}

export interface Sprint {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: SprintStatusType;
  capacity: number; // In points
  taskIds: string[];
}

// AG-18 Task Decomposition Types
export type DraftCategory = 'Frontend' | 'Backend' | 'DevOps' | 'Test';

export interface SdsSectionRef {
  id: string;
  title: string;
  isDecomposed: boolean;
  content: string;
}

export interface TaskDraft {
  id: string;
  title: string;
  category: DraftCategory;
  parentId: string; // Links to SdsSectionRef.id
  confidence: number;
  status: 'draft' | 'approved' | 'stale';
  points: number;
  technicalInstructions: string;
  acceptanceCriteria: { id: string; label: string; checked: boolean }[];
  dependencies: string[];
}

// AG-17 Conflict Detector Types
export type IssueSeverity = 'critical' | 'warning' | 'optimization';
export type IssueCategory = 'gap' | 'conflict' | 'ambiguity';

export interface ArchitectureIssue {
  id: string;
  title: string;
  category: IssueCategory;
  severity: IssueSeverity;
  description: string;
  problemStatement: string;
  affectedPath: string;
  aiSuggestions: {
    id: string;
    label: string;
    description: string;
    impact: string;
  }[];
  status: 'unresolved' | 'resolved';
}

// AG-16 Document Template Types
export type DocTemplateType = 'rfp' | 'pdr' | 'sds' | 'custom';
export type DocOutputFormat = 'markdown' | 'latex' | 'json';

export interface TemplateSection {
  id: string;
  label: string;
  isRequired: boolean;
  isConditional: boolean;
  condition?: string;
  aiInstruction?: string;
  children?: TemplateSection[];
}

export interface DocTemplate {
  id: string;
  title: string;
  type: DocTemplateType;
  category: string;
  description: string;
  outputFormat: DocOutputFormat;
  isDefault: boolean;
  sections: TemplateSection[];
  inheritance?: string; // ID of parent template
  lastUpdated: string;
}

// AG-15 Milestone Types
export type MilestoneStage = 'rfp_pdr' | 'pdr_sds' | 'sds_exec';
export type MilestoneStatus = 'pending' | 'approved' | 'rejected';

export interface MilestoneAssumption {
  id: string;
  text: string;
  isVerified: boolean;
}

export interface MilestoneOutlineItem {
  id: string;
  label: string;
  children?: MilestoneOutlineItem[];
}

export interface MilestoneData {
  id: string;
  stage: MilestoneStage;
  title: string;
  status: MilestoneStatus;
  assumptions: MilestoneAssumption[];
  proposedOutline: MilestoneOutlineItem[];
  agentPersona: string;
  lastUpdated: string;
}

// AG-14 Traceability Types
export type TraceNodeType = 'rfp' | 'pdr' | 'sds';
export type TraceNodeStatus = 'synced' | 'stale' | 'orphaned' | 'mismatch';

export interface TraceNode {
  id: string;
  type: TraceNodeType;
  title: string;
  status: TraceNodeStatus;
  version: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface TraceEdge {
  id: string;
  source: string;
  target: string;
  status: 'verified' | 'broken';
}

// AG-13 Discovery Types
export type DiscoveryStep = 'context' | 'scope' | 'technical' | 'finalization';

export interface RfpSection {
  id: string;
  title: string;
  content: string;
  status: 'empty' | 'drafting' | 'locked';
}

export interface RfpDraft {
  overview: RfpSection;
  functional: RfpSection;
  technical: RfpSection;
  budget: RfpSection;
}

// SY-03 Billing Types
export type InvoiceStatus = 'paid' | 'pending' | 'failed';

export interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: InvoiceStatus;
}

export interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiry: string;
  isPrimary: boolean;
}

// SY-08 Organization Admin Types
export type OrgRole = 'Owner' | 'Admin' | 'Member' | 'Guest';
export type OrgMemberStatus = 'Active' | 'Invited' | 'Suspended';

export interface OrgMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: OrgRole;
  status: OrgMemberStatus;
  twoFactorEnabled: boolean;
  lastLogin: string;
}

export interface OrgSsoConfig {
  provider: 'Okta' | 'Azure AD' | 'Google Workspace' | 'None';
  clientId: string;
  clientSecret: string;
  metadataUrl: string;
  isEnabled: boolean;
}

// SY-07 Security Types
export type AuditCategory = 'login' | 'billing' | 'deletion' | 'api' | 'system' | 'org_change';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  event: string;
  ip: string;
  location: string;
  category: AuditCategory;
  details?: Record<string, string>;
  isSuspicious?: boolean;
}

export interface UserSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  type: 'desktop' | 'mobile';
}

// SY-09 System Health Types
export type ProcessStatus = 'running' | 'idle' | 'stopped' | 'error' | 'restarting';

export interface SystemProcess {
  id: string;
  name: string;
  status: ProcessStatus;
  latency?: string;
  uptime?: string;
  vram?: string;
  cpu: number;
  memory: string;
}

export interface TelemetryPoint {
  time: string;
  cpu: number;
  memory: number;
  disk: number;
}

// RAG Manager Types (AG-08)
export type RagSourceType = 'git' | 'pdf' | 'wiki' | 'web' | 'api';
export type RagSyncStatus = 'synced' | 'indexing' | 'stale' | 'error';

// Skill Studio Types (AG-09)
export type SkillCategory = 'system' | 'integration' | 'custom';
export type SkillLanguage = 'python' | 'typescript' | 'http';

// Plugin Marketplace Types (AG-12)
export type PluginStatus = 'idle' | 'installing' | 'installed' | 'error';
export type PluginCategory = 'Productivity' | 'Database' | 'Dev Tools' | 'Communication';
export type PluginAuthMethod = 'OAuth2' | 'API Key' | 'PAT';

export interface PluginTool {
  name: string;
  description: string;
}

export interface Plugin {
  id: string;
  title: string;
  author: string;
  verified: boolean;
  downloads: string;
  rating: number;
  description: string;
  category: PluginCategory;
  icon: string | React.ReactNode;
  status: PluginStatus;
  version: string;
  updateAvailable?: string;
  authMethod: PluginAuthMethod;
  tools: PluginTool[];
  healthStatus?: 'healthy' | 'stale' | 'error';
  recentChanges?: string;
}

// Fine-Tuning / RLHF Types (AG-11)
export type TrainingStatus = 'idle' | 'running' | 'completed' | 'failed';
export type FeedbackType = 'rejected' | 'edited' | 'starred';

export interface TrainingExample {
  id: string;
  timestamp: string;
  prompt: string;
  rejectedOutput: string;
  acceptedOutput: string;
  status: 'pending' | 'curated' | 'discarded';
  reason?: string;
}

export interface ModelVersion {
  id: string;
  tag: string;
  baseModel: string;
  datasetSize: number;
  accuracy: number;
  status: 'active' | 'archived';
  createdAt: string;
  cost: number;
}

export interface FineTuningJob {
  id: string;
  status: TrainingStatus;
  progress: number;
  currentLoss: number;
  epochs: number;
  eta: string;
  logs: string[];
}

export interface SkillArgument {
  name: string;
  type: string;
  description: string;
  required: boolean;
  example?: any;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  language: SkillLanguage;
  description: string;
  code: string;
  schema: any;
  parameters: SkillArgument[];
  source: string;
  usedBy: string[]; // Agent IDs
  isLocked?: boolean;
  updatedAt: string;
}

export interface RagCollection {
  id: string;
  name: string;
  type: RagSourceType;
  status: RagSyncStatus;
  vectorCount: number;
  lastIndexed: string;
  description: string;
}

export interface RagChunk {
  id: string;
  source: string;
  text: string;
  score: number;
  index: number;
}

export interface ClusterPoint {
  x: number;
  y: number;
  id: string;
  group: string;
  label: string;
}

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
  
  // Sprint Management (AG-19)
  sprintId?: string | null;
  milestoneId?: string | null;
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

export interface Mission {
  id: string;
  title: string;
  agentId: string;
  agentName: string;
  status: MissionStatus;
  priority: MissionPriority;
  progress: number;
  trigger: string;
  timestamp: string;
  duration?: string;
  cost?: number;
  blockerReason?: string;
  prompt?: string;
  artifacts?: { name: string; path: string }[];
}

// Analytics ROI Types (AG-10)
export interface AgentUsageData {
  id: string;
  agentName: string;
  model: string;
  calls: number;
  tokensIn: number;
  tokensOut: number;
  cost: number;
  avgLatency: string;
}

export interface DailyUsageStat {
  date: string;
  tokens: number;
  requests: number;
  cost: number;
  provider: string;
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
  id: string; label: string; type: 'file' | 'folder'; children?: DocSiteNavItem[];
}

// DO-10 Health & Insights
export interface DriftRecord {
  id: string;
  title: string;
  docPath: string;
  codePath: string;
  lastDocEdit: string;
  lastCodeEdit: string;
  score: 'high' | 'medium' | 'low';
}

export interface SearchGap {
  id: string;
  term: string;
  count: number;
}

export interface DocFeedbackItem {
  id: string;
  user: string;
  context: string;
  comment: string;
  helpful: boolean;
  status: 'open' | 'resolved';
  timestamp: string;
}

// DO-08 Learning Path Types
export type PathModuleType = 'read' | 'task' | 'quiz' | 'project';
export type PathModuleStatus = 'locked' | 'active' | 'completed';

export interface PathModule {
  id: string;
  type: PathModuleType;
  title: string;
  description: string;
  status: PathModuleStatus;
  duration?: string;
  resourceId?: string; // Links to docId or taskId
  isStale?: boolean;
}

export interface LearningPath {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  modules: PathModule[];
  progress: number; // 0-100
  estimatedTime: string;
}

// DO-09 Domain Dictionary Types
export type DictionaryCategory = 'business' | 'technical' | 'acronym';

export interface DictionaryTerm {
  id: string;
  term: string;
  definition: string;
  category: DictionaryCategory;
  acronym?: string;
  synonyms: string[];
  owner?: string;
  usageExamples: string[];
  includeInAiContext: boolean;
  codeMappings: {
    type: 'file' | 'class' | 'table' | 'function';
    label: string;
    path: string;
  }[];
  references?: { id: string; title: string }[];
  conflicts?: { context: string; definition: string }[];
}

// API Explorer Types (DO-05)
export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiParameter {
  name: string;
  in: 'path' | 'query' | 'header';
  required: boolean;
  type: string;
  description: string;
  example?: any;
}

export interface ApiEndpoint {
  id: string;
  method: ApiMethod;
  path: string;
  tag: string;
  summary: string;
  description: string;
  parameters: ApiParameter[];
  requestBody?: {
    contentType: string;
    schema: string;
  };
}

// DO-06 Topology Types
export type TopologyNodeType = 'service' | 'database' | 'external' | 'frontend' | 'gateway' | 'worker';

export interface TopologyNode {
  id: string;
  type: TopologyNodeType;
  label: string;
  description?: string;
  x: number;
  y: number;
  metadata: {
    language?: string;
    framework?: string;
    maintainer?: string;
    health?: 'healthy' | 'warning' | 'error';
    uptime?: string;
    internalModules?: string[];
  };
}

export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  label?: string; // Protocol/Port
  type: 'sync' | 'async';
}

// ADR Types (DO-07)
export type AdrStatus = 'draft' | 'proposed' | 'accepted' | 'rejected' | 'deprecated';

export interface AdrReviewer {
  id: string;
  name: string;
  avatar?: string;
  vote?: 'yes' | 'no' | 'none';
}

export interface AdrRecord {
  id: string; // ADR-042
  title: string;
  status: AdrStatus;
  date: string;
  author: string;
  category: string;
  context: string;
  decision: string;
  consequences: {
    positive: string[];
    negative: string[];
  };
  supersedes?: string; // ID of another ADR
  supersededBy?: string; // ID of another ADR
  implementationUrl?: string;
  reviewers: AdrReviewer[];
}

// Agent Management Types
export type AgentStatus = 'online' | 'idle' | 'offline' | 'error' | 'rate-limited';

export interface AgentCapability {
  id: string; label: string; enabled: boolean; level: 'read' | 'write' | 'exec';
}

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
  currentActivity?: string;
  progress?: number;
  memoryUsage?: number; // 0-100
  lastAction?: string;
  capabilities: AgentCapability[];
  metrics: {
    tokensUsed: number;
    tasksCompleted: number;
    avgLatency: string;
  };
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  systemPrompt: string;
  defaultModel: string;
  recommendedSkills: string[];
}

export interface FleetActivity {
  id: string;
  timestamp: string;
  agentName: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

// AG-02 Detailed Types
export interface MemoryItem {
  id: string;
  fact: string;
  source: string;
  timestamp: string;
  relevanceScore: number;
  needsReview?: boolean;
}

export interface ToolUsageRecord {
  id: string;
  tool: string;
  call: string;
  status: 'success' | 'failed' | 'running';
  timestamp: string;
  latency?: string;
}

export interface ThoughtStep {
  id: string;
  thought: string;
  action?: string;
  observation?: string;
  timestamp: string;
}

// AG-04 Evaluation Types
export type EvalStatus = 'pass' | 'fail' | 'marginal' | 'unstable' | 'timeout' | 'pending';

export interface EvalCase {
  id: string;
  name: string;
  prompt: string;
  expectedBehavior: string;
  targetResult?: {
    score: number;
    status: EvalStatus;
    output: string;
    reasoning: string;
  };
  baselineResult?: {
    score: number;
    status: EvalStatus;
    output: string;
  };
}

export interface EvalSuite {
  id: string;
  name: string;
  description: string;
  cases: EvalCase[];
  isLocked?: boolean;
}

// AG-05 Squad Types
export type CollaborationProtocol = 'sequential' | 'hierarchical' | 'consensus';

export interface SquadNode {
  id: string;
  agentId: string;
  role: 'manager' | 'worker';
  x: number;
  y: number;
}

export interface SquadEdge {
  id: string;
  source: string;
  target: string;
  type: 'delegates' | 'peers';
}

export interface Squad {
  id: string;
  name: string;
  description: string;
  nodes: SquadNode[];
  edges: SquadEdge[];
  protocol: CollaborationProtocol;
  managerSettings: {
    delegationLogic: 'round-robin' | 'load-balanced';
    approvalMode: 'auto' | 'human';
  };
}

// AG-06 Guardrail Types
export interface InterventionLogEntry {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  action: string;
  policyId: string;
  policyName: string;
  outcome: 'blocked' | 'redacted' | 'pending_approval';
  context?: string; // The prompt/thought that triggered it
}

export interface GuardrailRule {
  id: string;
  category: 'dlp' | 'safety' | 'cost' | 'ethics';
  label: string;
  description: string;
  enabled: boolean;
  severity: 'low' | 'medium' | 'high';
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
