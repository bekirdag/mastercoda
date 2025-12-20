Here is the consolidated **Master Coda Desktop App System Design Specification (SDS)**.

---

# **Master Coda Desktop App — Software Design Specification (SDS)**

## **Table of Contents**

**1\. Introduction**

* 1.1 Purpose & Scope  
* 1.2 Architectural Strategy (Electron \+ CLI Wrapper)  
* 1.3 Design Principles (Visual, Reactive, Terminal-Aware)  
* 1.4 Relationship to mcoda CLI

**2\. System Architecture**

* 2.1 High-Level Architecture Diagram  
* 2.2 The Electron Shell (Main Process vs. Renderer)  
* 2.3 The mcoda Bridge (Node.js Child Processes)  
* 2.4 State Management (Frontend Stores & Local Persistence)  
* 2.5 File System & Workspace Access

**3\. Data Model & IPC Contract**

* 3.1 IPC Channels & Message Schemas  
* 3.2 Mapping mcoda JSON to UI State  
* 3.3 Real-time Updates (Streaming Stdout/Stderr to UI)  
* 3.4 Persistent UI State (Settings, Recent Projects, Window Bounds)

**4\. User Interface Design & UX Flows**

* 4.1 Workspace Selection & Onboarding  
* 4.2 The "Plan" View (Epics, Stories, Backlog)  
* 4.3 The "Work" View (Task Execution, Terminal Output, Diffs)  
* 4.4 The "Docs" View (SDS/PDR Preview & Generation)  
* 4.5 Agent & Telemetry Dashboards

**5\. Integration with mcoda CLI**

* 5.1 CLI Binary Resolution & Version Management  
* 5.2 Command Execution Strategy (Spawn, Stream, Parse)  
* 5.3 Handling Interactive Prompts & Confirmation  
* 5.4 Error Handling & Fallbacks (Missing CLI, Network Issues)

**6\. Implementation Plan**

* 6.1 Phase 1: Shell & Read-Only Dashboard  
* 6.2 Phase 2: Interactive Planning & Task Execution  
* 6.3 Phase 3: Advanced Visuals (Graphs, Diffs, Telemetry)

**7\. Security & Distribution**

* 7.1 Local Security Model (Subprocess Constraints)  
* 7.2 Auto-Updating (Electron Builder vs. mcoda update)  
* 7.3 Packaging & Signing

---

# **1\. Introduction**

## **1.1 Purpose & Scope**

**Master Coda** is a cross-platform desktop application built with Electron that serves as the primary visual interface for the mcoda development automation tool. Its purpose is to democratize the power of the mcoda CLI—lowering the barrier to entry for complex multi-agent workflows (planning, coding, reviewing, QA)—while providing visualization capabilities (graphs, diffs, logs) that are impossible in a terminal environment.

The application scope is strictly defined as a **GUI Control Plane**. It does not reimplement the core logic of mcoda; instead, it wraps, orchestrates, and visualizes the operations of the mcoda CLI binary.

**In Scope:**

* **Workspace Management:** Visual selection, initialization, and configuration of local project workspaces (handling .mcoda/config.json and .gitignore).  
* **Workflow Orchestration:** Interactive UI for running create-tasks, refine-tasks, work-on-tasks, code-review, and qa-tasks without memorizing flags.  
* **Visual Editors:** Specialized views for editing the backlog (drag-and-drop ordering), reviewing implementation plans (diff views), and inspecting job logs.  
* **Real-time Feedback:** Streaming stdout/stderr from the CLI into structured UI components (progress bars, step indicators, terminal panels).  
* **Agent & Telemetry Dashboards:** Visualizing token usage, costs, and agent health configurations.

**Out of Scope:**

* **Core Logic Reimplementation:** The desktop app will *never* contain business logic for parsing RFPs, generating code, or managing the SQLite database directly. It must invoke the CLI for these actions.  
* **Remote SaaS Features:** This is a local-first desktop tool. Any cloud interactions (e.g., Docdex, LLM providers) happen strictly through the CLI's existing adapters.

## **1.2 Architectural Strategy (Electron \+ CLI Wrapper)**

The application adopts a **Thick Client / Thin Logic** architecture.

* **Runtime:** Electron (latest stable) using the **Context Isolation** and **Preload Script** security model.  
* **Frontend:** React (SPA) with a robust state management library (Zustand or Redux Toolkit) to mirror the CLI's transient state.  
* **Backend (Main Process):** Acts as a bridge between the Renderer process and the OS. Its primary responsibility is spawning mcoda child processes, managing their lifecycle (signals, IO streams), and proxying file system access where the CLI falls short (e.g., native file dialogs).

**Key Strategic Decisions:**

1. **The "Sidecar" Pattern:** The mcoda binary is treated as a sidecar executable. In production builds, a specific version of mcoda (pinned via package.json) will be bundled inside the Electron app (or downloaded on first run), ensuring the UI always runs against a compatible CLI version.  
2. **JSON-First Communication:** The app relies heavily on the CLI's \--json flag. The Main process executes commands like mcoda backlog \--json, buffers the output, parses it, and sends typed objects to the Renderer via IPC.  
3. **Database Agnosticism:** The desktop app generally *does not* connect to mcoda.db directly using a SQLite driver. It reads data by invoking CLI "getter" commands (mcoda task show, mcoda backlog). This decouples the UI schema from the DB schema, allowing the CLI to migrate its internal storage without breaking the UI. *Exception: Direct DB read-only access may be permitted for high-performance telemetry visualization if CLI latency proves prohibitive.*

## **1.3 Design Principles**

Development must adhere to these three core principles to ensure the app feels like a developer tool, not a "wizard."

**1\. Visual & Dense (Information Rich)**

* Developers need context. Avoid ample whitespace. Use dense data grids for backlogs, split panes for diffs, and collapsable sidebars for navigation.  
* Use visual metaphors where text fails: Dependency graphs should be rendered as DAGs (Directed Acyclic Graphs), not lists. Statuses should be color-coded badges.

**2\. Reactive & Optimistic**

* The UI must feel faster than the CLI. When a user updates a task status, the UI should optimistically update the state immediately while the CLI command runs in the background.  
* Long-running jobs (like create-tasks) must stream progress. The UI cannot "freeze" while waiting for a 30-second LLM response. We will parse the CLI's stdout stream for progress markers (e.g., \[progress\] 20%) to update UI bars in real-time.

**3\. Terminal-Aware (Transparency)**

* We do not hide the magic. Every action the UI takes (e.g., clicking "Start Work") must be inspectable.  
* The UI should expose a "Command Log" or "Terminal Drawer" that shows exactly which shell command was executed (mcoda work-on-tasks \--project X ...) and its raw output. This builds trust and teaches the user the CLI syntax.

## **1.4 Relationship to mcoda CLI**

Master Coda acts as a **stateful consumer** of the mcoda CLI.

| Feature | mcoda CLI (The Engine) | Master Coda App (The Dashboard) |
| :---- | :---- | :---- |
| **State** | Stateless (process dies after run) | Stateful (persists UI view, filters, active job monitoring) |
| **Persistence** | SQLite (.mcoda/mcoda.db) | LocalStorage / IndexedDB (for UI preferences only) |
| **Logic** | Heavy (Agents, Git, Docdex) | Light (Command dispatch, JSON parsing) |
| **Inputs** | Flags (\--json, \--agent) | Forms, Drag-and-Drop, Toggles |
| **Feedback** | Text / Spinners | Toasts, Notifications, Charts |

Versioning Contract:

The Desktop App will declare a peerDependency or internal requirement on a semantic version range of the CLI (e.g., mcoda@^0.3.0). On startup, the app runs mcoda \--version. If the installed CLI is outside the supported range, the app must prompt the user to auto-update the internal binary or point to a valid external binary. This strict version pairing prevents UI/CLI schema mismatches.

---

# **2\. System Architecture**

## **2.1 High-Level Architecture Diagram**

The system follows a classic Electron multi-process architecture, augmented with a specific "Sidecar CLI" pattern where the application wraps an external binary (mcoda).

Code snippet

```

graph TD
    subgraph "Electron App (Master Coda)"
        subgraph "Renderer Process (UI)"
            ReactApp[React SPA]
            Store[Zustand/Redux Store]
            IPC_Client[IPC Client API]
        end
        
        subgraph "Main Process (Node.js)"
            IPC_Handler[IPC Request Handler]
            CLI_Bridge[CLI Bridge / Spawner]
            FS_Proxy[File System Proxy]
            App_Lifecycle[App Lifecycle & Update]
        end
    end

    subgraph "External System"
        Mcoda_Bin[mcoda CLI Binary]
        Mcoda_DB[(.mcoda/mcoda.db)]
        Workspace_Files[Project Source Code]
        Docdex[Docdex Service]
        LLM_API[LLM Provider API]
    end

    %% Data Flow
    ReactApp -->|User Action| IPC_Client
    IPC_Client <-->|IPC Messages (JSON)| IPC_Handler
    IPC_Handler -->|Spawn/Exec| CLI_Bridge
    CLI_Bridge <-->|Stdio / JSON| Mcoda_Bin
    
    %% CLI Interactions
    Mcoda_Bin -->|Read/Write| Mcoda_DB
    Mcoda_Bin -->|Edit| Workspace_Files
    Mcoda_Bin -->|Query| Docdex
    Mcoda_Bin -->|Prompt| LLM_API

    %% Direct FS Access (Limited)
    FS_Proxy -->|Read Config/Logs| Mcoda_DB
    FS_Proxy -->|Open File Dialog| Workspace_Files

```

## **2.2 The Electron Shell (Main Process vs. Renderer)**

The application adheres to modern Electron security best practices, strictly separating the UI from Node.js APIs.

### **2.2.1 Renderer Process (The Frontend)**

* **Role:** Responsible purely for presentation and user interaction. It is a standard web application running in a Chromium environment.  
* **Tech Stack:** React, TypeScript, Tailwind CSS (or similar UI kit), and a state management library.  
* **Constraints:**  
  * **Context Isolation:** Enabled (contextIsolation: true). The Renderer has *no direct access* to Node.js modules (require, process, fs).  
  * **Sandboxing:** Enabled where possible.  
  * **IPC Bridge:** All communication with the Main process occurs via a strictly typed window.electron API exposed through a preload.js script. This API acts as the only gateway to system resources.

### **2.2.2 Main Process (The Backend)**

* **Role:** The entry point of the application (main.ts). It manages the lifecycle of the application window, native menus, auto-updates, and—crucially—all interactions with the mcoda CLI and the OS file system.  
* **Responsibilities:**  
  * **Window Management:** Creating and managing BrowserWindow instances.  
  * **IPC Routing:** Listening on ipcMain channels and dispatching requests to the appropriate internal controllers (e.g., TasksController, AgentsController).  
  * **Binary Management:** Locating the bundled or system mcoda binary and verifying its version on startup.

## **2.3 The mcoda Bridge (Node.js Child Processes)**

The **CLI Bridge** is a dedicated module within the Main Process designed to abstract away the complexity of spawning shell commands. It turns CLI execution into a Promise-based or Event-based API.

### **2.3.1 Execution Modes**

The Bridge supports two distinct modes of execution, matching the CLI's capabilities:

1. **Request/Response Mode (Short-lived):**  
   * *Usage:* Commands like mcoda backlog \--json, mcoda task show \<ID\> \--json, mcoda agent list \--json.  
   * *Mechanism:* Uses child\_process.execFile or exec.  
   * *Behavior:* Spawns the process, buffers stdout, waits for exit code 0.  
   * *Output:* Parses the buffered JSON output and resolves a Promise with the typed result object. If the CLI returns a non-zero exit code, the Promise rejects with the content of stderr.  
2. **Streaming Mode (Long-running Jobs):**  
   * *Usage:* Commands like mcoda create-tasks, mcoda work-on-tasks.  
   * *Mechanism:* Uses child\_process.spawn.  
   * *Behavior:* Maintains an open reference to the child process.  
   * *Events:*  
     * Listens to stdout data events. It attempts to parse chunks as line-delimited JSON (LDJSON) log entries or progress updates. These are emitted to the Renderer via IPC events (e.g., job:progress, job:log).  
     * Listens to stderr for real-time error reporting.  
   * *Control:* Exposes methods to send signals (e.g., SIGINT) to cancel the running job if the user clicks "Stop" in the UI.

### **2.3.2 Environment & Context Injection**

The Bridge ensures every command is executed with the correct context:

* **CWD (Current Working Directory):** Always set to the user's selected active workspace root.  
* **Environment Variables:** Injects necessary env vars (e.g., MCODA\_NO\_COLOR=true, MCODA\_LOG\_FORMAT=json) to ensure the CLI output is machine-parseable.  
* **Path Resolution:** Ensures the PATH environment variable correctly includes the location of the bundled mcoda binary, especially in packaged builds (macOS .app or Windows .exe).

## **2.4 State Management (Frontend Stores & Local Persistence)**

State is managed primarily in the Renderer process (React) to ensure a responsive UI, with persistence handled via Electron's storage capabilities.

### **2.4.1 Transient State (The Store)**

A global store (using Zustand or Redux Toolkit) holds the runtime state of the application. This state is *not* persistent across restarts, except where noted.

* **Workspace:** Current active workspace path, project configuration (loaded from config.json).  
* **Planning Data:** Cached lists of Epics, Stories, and Tasks (fetched via mcoda backlog).  
* **Active Job:** Status of any currently running CLI command (PID, progress percentage, log buffer).  
* **UI State:** Active tab, filter settings, sidebar visibility.

### **2.4.2 Local Persistence (Electron Store)**

To preserve user preferences across sessions, the Main process uses a library like electron-store (writing to a JSON file in the user's AppData or Application Support directory).

* **Recent Workspaces:** A list of recently opened project paths (MRU list).  
* **App Settings:** Theme (Light/Dark), default terminal shell path, auto-update preferences.  
* **Window State:** Last known window dimensions and position.

*Note: The application does **not** persist domain data (Tasks, Agents) in its own storage. That data lives strictly in the project's .mcoda/mcoda.db, managed by the CLI.*

## **2.5 File System & Workspace Access**

Direct file system access is minimized to maintain a clean architecture.

* **Reading Configs:** The Main process reads .mcoda/config.json and .mcoda/workspace.json directly using Node's fs module to bootstrap the application state before the CLI is ready.  
* **Reading Logs:** For performance, the app may directly tail log files in .mcoda/logs/ if the CLI's streaming output is insufficient for historical log viewing.  
* **Write Operations:** The application *never* writes directly to the .mcoda/ directory or modifies source files. All write operations (creating tasks, changing config, editing code) are performed by invoking the corresponding mcoda CLI command. This ensures data integrity and ensures all side effects (like git commits) are handled correctly by the core logic.

---

# **3\. Data Model & IPC Contract**

## **3.1 IPC Channels & Message Schemas**

To ensure type safety and maintainability, all Inter-Process Communication (IPC) is governed by a strict schema defined in shared TypeScript interfaces. The application uses a request/response pattern for short-lived actions and an event-subscription pattern for long-running jobs.

### **3.1.1 Request/Response Channels (Invoke/Handle)**

These channels are used for atomic operations where the UI sends a request and awaits a single result (or error).

| Channel Name | Direction | Payload (Request) | Response (Promise) | Description |
| :---- | :---- | :---- | :---- | :---- |
| workspace:select | UI → Main | { path?: string } | WorkspaceConfig | Opens native file dialog or loads a specific path. |
| cli:exec | UI → Main | { command: string, args: string\[\], cwd: string } | CliResult\<T\> | Generic wrapper to run a CLI command and get parsed JSON. |
| agent:list | UI → Main | void | Agent\[\] | Fetches configured agents via mcoda agent list \--json. |
| task:list | UI → Main | { filter?: TaskFilter } | BacklogSummary | Fetches tasks via mcoda backlog \--json. |
| job:start | UI → Main | { type: JobType, params: any } | { jobId: string } | Spawns a long-running CLI process (e.g., create-tasks). |
| job:stop | UI → Main | { jobId: string } | void | Sends SIGINT/SIGTERM to the running job process. |

### **3.1.2 Event Channels (Send/On)**

These channels stream real-time data from the Main process to the Renderer, primarily for active job feedback.

| Channel Name | Payload (Event Data) | Description |
| :---- | :---- | :---- |
| job:progress | { jobId: string, percent: number, stage: string } | Updates progress bars (parsed from CLI stdout). |
| job:log | { jobId: string, text: string, stream: 'stdout'|'stderr' } | Appends raw text to the terminal/log view. |
| job:status | { jobId: string, status: 'running'|'completed'|'failed' } | Notifies when a job process exits. |
| app:update | { available: boolean, version: string } | Signals that a new app or CLI version is available. |

## **3.2 Mapping mcoda JSON to UI State**

The desktop app serves as a visualizer for the CLI's JSON output. We define TypeScript interfaces that strictly mirror the CLI's OpenAPI specifications to ensure synchronization.

### **3.2.1 Core Entities**

The UI state is built around these core types, which are hydrated directly from CLI output:

TypeScript

```

// Matches output of `mcoda backlog --json`
interface Task {
  id: string;
  key: string;
  title: string;
  status: 'not_started' | 'in_progress' | 'ready_to_review' | 'ready_to_qa' | 'completed' | 'blocked';
  story_points: number;
  assignee?: string;
  parent_id?: string; // Links to Story/Epic
}

// Matches output of `mcoda agent list --json`
interface Agent {
  name: string;
  model: string;
  status: 'active' | 'configured' | 'missing_auth';
  capabilities: string[]; // e.g., ['code_write', 'doc_read']
}

// Matches output of `mcoda job list --json`
interface ActiveJob {
  id: string;
  type: 'create-tasks' | 'work-on-tasks' | 'qa-tasks';
  status: 'running' | 'paused';
  progress: number;
  currentStep: string; // e.g., "Generating user stories..."
}

```

### **3.2.2 State Hydration Strategy**

To keep the UI responsive without constant polling, we use an **Optimistic UI with Event-Driven Revalidation** strategy:

1. **Initial Load:** On workspace open, the app runs mcoda backlog \--json and mcoda agent list \--json to populate the initial stores.  
2. **Optimistic Updates:** When a user drags a task to "Done," the UI immediately updates the local state.  
3. **Command Execution:** The app spawns mcoda work-on-tasks ....  
4. **Revalidation:** Upon the job:status event (job completion), the app silently re-runs mcoda backlog \--json to fetch the authoritative state from the database, correcting any drift.

## **3.3 Real-time Updates (Streaming Stdout/Stderr to UI)**

Long-running commands like create-tasks or work-on-tasks can take minutes. The user must see activity.

### **3.3.1 Log Parsing Pipeline**

The Main process acts as a parser for the CLI's raw output streams.

* **Raw Output:** The CLI emits line-delimited JSON logs or human-readable text.  
* **Parser:** A StreamParser class in the Main process reads stdout.  
  * If a line matches a structured log format (e.g., {"level": "info", "progress": 45}), it emits a job:progress IPC event.  
  * If a line is plain text, it emits a job:log IPC event for the terminal view.  
* **Throttling:** To prevent IPC flooding during verbose operations, log events are buffered and flushed to the Renderer at a maximum frequency (e.g., 60fps or every 50ms).

## **3.4 Persistent UI State (Settings, Recent Projects, Window Bounds)**

While domain data lives in mcoda.db, the application itself needs to remember user preferences. This data is stored in a settings.json file in the user's application data directory.

**Schema:**

JSON

```

{
  "theme": "system",
  "window": {
    "width": 1280,
    "height": 800,
    "x": 100,
    "y": 100
  },
  "recentWorkspaces": [
    "/Users/dev/projects/my-app",
    "/Users/dev/projects/client-portal"
  ],
  "preferences": {
    "autoScrollTerminal": true,
    "defaultAgent": "gpt-4-turbo",
    "showCompletedTasks": false
  },
  "cli": {
    "customPath": "/usr/local/bin/mcoda" // Optional override
  }
}

```

---

# **4\. User Interface Design & UX Flows**

## **4.1 Workspace Selection & Onboarding**

The first interaction a user has with Master Coda is workspace selection. This flow ensures the user is working in a valid project context before any other UI elements are revealed.

### **4.1.1 The "Welcome" Screen**

**Visual Layout:**

* A clean, centered modal window.  
* **"Recent Projects" List:** A scrollable list of the last 5 opened paths, with timestamps. Clicking one immediately loads that workspace.  
* **"Open Existing Project" Button:** Triggers the native OS file picker to select a directory.  
* **"Create New Project" Button:** Opens a "New Project Wizard" overlay.

Logic & Validation:

When a directory is selected:

1. **Check for .mcoda:** The app checks for the existence of the .mcoda directory.  
2. **Initialize if Missing:** If .mcoda is missing, a prompt appears: *"This folder is not yet a Master Coda workspace. Initialize it?"*  
3. **Run mcoda init:** Confirming this action runs mcoda init in the background.  
4. **Validate Config:** The app reads .mcoda/config.json to ensure valid JSON structure. If invalid, an error toast is displayed.

### **4.1.2 Global Navigation (Sidebar)**

Once a workspace is loaded, a persistent vertical sidebar appears on the left edge.

* **Top Section (Context):** Shows the current Project Name (e.g., "TEST1").  
* **Middle Section (Views):** Icons \+ Labels for primary views:  
  * **Plan** (Epics/Stories/Backlog)  
  * **Work** (Active Task Execution)  
  * **Docs** (SDS/PDR/RFP)  
  * **Agents** (Configuration & Health)  
* **Bottom Section (System):**  
  * **Telemetry:** Token usage summary (e.g., "$1.20 this week").  
  * **Settings:** App preferences.  
  * **User/Agent Status:** Indicator showing the active default agent (e.g., "Claude-3.5").

## **4.2 The "Plan" View (Epics, Stories, Backlog)**

This view corresponds to the mcoda backlog command and provides a hierarchical Kanban-like interface for project management.

### **4.2.1 Layout Structure**

* **Hierarchy Pane (Left):** A collapsible tree view showing **Epics → User Stories**. Selecting a node filters the main board.  
  * *Action:* Context menu on nodes to "Refine Task" or "Edit Details".  
* **Task Board (Center):** Columns representing task statuses (not\_started, in\_progress, ready\_to\_review, ready\_to\_qa, completed).  
  * *Interaction:* Drag-and-drop cards between columns triggers state transitions (which invoke mcoda tasks transition... in the background).  
  * *Card Content:* Task ID (WEB-101), Title, SP badge, Assignee avatar.  
* **Filters Bar (Top):** Dropdowns for "Assignee", "Status", and a search bar.

### **4.2.2 Creating Tasks Flow**

1. **Trigger:** Click prominent "+ Create Tasks" button.  
2. **Input Modal:** A form accepting "RFP Text" or file uploads.  
3. **Execution:** Clicking "Generate" spawns mcoda create-tasks.  
4. **Feedback:** The modal transforms into a progress view, streaming the CLI output (e.g., *"Generating user stories... 3/10"*).  
5. **Result:** The board automatically refreshes with new cards once the job completes.

## **4.3 The "Work" View (Task Execution, Terminal Output, Diffs)**

This is the "IDE-lite" view where the developer spends most of their time while mcoda work-on-tasks or mcoda code-review is running.

### **4.3.1 Active Task Context**

* **Header:** Displays the currently selected task ID and Title (e.g., *"WEB-101: Implement Login API"*).  
* **Metadata Bar:** Branch name (mcoda/task/web-101), current status badge, and linked PR/Issue.

### **4.3.2 The "Terminal Drawer" (Bottom)**

A collapsible panel that is **always available** but critical in this view.

* **Raw Output:** Displays the raw stdout/stderr from the currently running CLI command.  
* **Structured Logs:** A toggle to switch between "Raw Text" and "Step View" (which parses log lines into a checklist: *Checked out branch*, *Agent thinking*, *Patch applied*).  
* **Input:** Allows user input if the CLI prompts for confirmation (e.g., *"Apply patch? \[Y/n\]"*).

### **4.3.3 The "Diff" & "Review" Pane (Center)**

When work-on-tasks completes or pauses for review:

* **File Tree:** List of files modified by the agent.  
* **Diff Viewer:** A split-view (side-by-side) editor showing the proposed changes.  
* **Actions:**  
  * **"Accept & Commit":** Triggers the final commit and push steps of the CLI command.  
  * **"Reject / Retry":** Opens a prompt box to give feedback to the agent (e.g., *"Fix the typo in line 40"*) and re-runs the generation step.

## **4.4 The "Docs" View (SDS/PDR Preview & Generation)**

This view visualizes the documentation pipeline, corresponding to mcoda docs ... commands.

### **4.4.1 Document Explorer**

* **Tabs:** "RFP", "PDR", "SDS", "Architecture".  
* **Content Area:** A Markdown viewer rendering the current state of the document from .mcoda/docs/.  
* **Source Link:** "Open in Editor" button to launch the file in VS Code or external editor.

### **4.4.2 Generation Workflow**

1. **Action:** "Regenerate SDS" button.  
2. **Configuration:** Sidebar allows selecting input docs (e.g., *"Use RFP-v2.md as source"*).  
3. **Process:** Starts mcoda docs sds generate as a background job.  
4. **Visualization:** As the CLI streams progress (e.g., *"Writing section: Database Schema"*), the UI updates a table of contents, marking sections as "Done" or "Pending".

## **4.5 Agent & Telemetry Dashboards**

Provides visibility into the "brain" and "cost" of the system.

### **4.5.1 Agent Registry**

* **List View:** Cards for each configured agent (OpenAI, Ollama, etc.) showing status (Healthy/Error) and latency.  
* **Test Console:** A "Test Agent" button next to each entry runs mcoda test-agent and displays the ping result/latency in a popover.  
* **Configuration:** Forms to edit agent base URLs or API keys (invoking mcoda agent edit).

### **4.5.2 Telemetry & Costs**

* **Charts:**  
  * **"Cost per Command":** Bar chart showing token spend for create-tasks vs work-on-tasks.  
  * **"Velocity Trend":** Line chart tracking Story Points completed per day/week.  
* **Data Source:** Hydrated via mcoda tokens \--json and mcoda estimate \--json.  
* **Budget Alerts:** Visual warning banners if the project has exceeded its configured token budget.

---

# **5\. Integration with mcoda CLI**

## **5.1 CLI Binary Resolution & Version Management**

The application does not assume a globally available mcoda command. To ensure stability and compatibility, it employs a strict resolution strategy to locate and verify the executable.

### **5.1.1 Resolution Strategy**

The Main process resolves the mcoda binary path in the following order of precedence:

1. **Bundled Binary (Production):** The application ships with a pinned version of the mcoda binary inside resources/bin/ (e.g., within the .asar archive or adjacent resources folder). This is the default for end-users.  
2. **Configuration Override:** Users can specify a custom path in settings.json under cli.customPath. This supports developers testing local builds or specific versions.  
3. **Local Workspace:** The app checks node\_modules/.bin/mcoda within the currently open project root, prioritizing project-specific versions over global ones.  
4. **Global System Path:** Finally, the app scans the system $PATH for mcoda.

### **5.1.2 Version Handshake**

On startup and whenever the binary path changes, the app performs a compatibility check:

1. **Execution:** Runs \<resolved\_path\> \--version \--json.  
2. **Parsing:** Expects a JSON response: {"name": "mcoda", "version": "0.3.5", ...}.  
3. **Verification:** Compares the returned version against the requiredMcodaVersion range defined in the desktop app's package.json (e.g., ^0.3.0).  
4. **Enforcement:**  
   * **Compatible:** The app initializes normally.  
   * **Incompatible:** A blocking modal is displayed: *"The detected mcoda version (0.2.1) is incompatible. Required: ^0.3.0."* The user is offered options to "Use Internal Binary" or "Update Global Version" (invoking npm install \-g mcoda).

## **5.2 Command Execution Strategy (Spawn, Stream, Parse)**

All CLI interactions are managed by a dedicated CliService in the Main process, which abstracts Node.js child processes into a structured API.

### **5.2.1 The Execution Pipeline**

Every command invocation follows a standardized lifecycle:

1. **Context Preparation:**  
   * **CWD:** Set to the root of the currently active workspace.  
   * **Environment:** Inherits process.env but injects overrides:  
     * MCODA\_UI\_MODE=true: Signals the CLI to favor machine-readable behaviors.  
     * MCODA\_NO\_COLOR=true: Suppresses ANSI color codes to simplify parsing (unless requesting raw output for a terminal view).  
     * MCODA\_LOG\_FORMAT=json: Forces structured logging where supported.  
2. **Process Spawning:**  
   * **Long-Running Jobs:** Uses child\_process.spawn() for commands like work-on-tasks or create-tasks. This keeps a persistent channel open for streaming updates.  
   * **Atomic Queries:** Uses child\_process.execFile() for instant data fetches like backlog \--json or agent list.  
3. **Dual-Stream Parsing:**  
   * **Stdout (Data Channel):** The parser reads line-by-line.  
     * *Structured Data:* Lines matching JSON format ({...}) are parsed and emitted as typed events (job:progress, data:result).  
     * *Unstructured Text:* Plain text lines are emitted as job:log events for display in the UI's terminal drawer.  
   * **Stderr (Error/Status Channel):** Captured separately. High-priority errors or warnings are parsed and bubbled up as notifications (toasts).

### **5.2.2 Job ID Correlation**

The Electron app generates a unique internal jobId (UUID) for every spawned process. This ID is passed back to the Renderer immediately. All subsequent IPC events (job:log, job:progress, job:status) carry this jobId, allowing the UI to route updates to the correct component (e.g., updating the progress bar for a specific task card).

## **5.3 Handling Interactive Prompts & Confirmation**

Although mcoda is designed for automation, certain flows (e.g., authentication, destructive confirmations) may require user input. The app handles this via a "Prompt-and-Pipe" bridge.

### **5.3.1 Detection**

The StreamParser scans stdout and stderr for known prompt signatures defined in a registry (e.g., regex patterns like /Are you sure\\? \\\[y\\/N\\\]/i or /Enter API Key:/i).

### **5.3.2 UI Interruption Flow**

1. **Pause & Notify:** When a prompt pattern matches, the Main process halts the parser and sends a job:prompt event to the Renderer with metadata (type: confirm or text, message: "Delete 5 tasks?").  
2. **User Input:** The UI displays a modal or highlights the terminal input field.  
3. **Resume:** Upon user submission, the Renderer sends a cli:input IPC message.  
4. **Pipe:** The Main process writes the user's input string directly to the child process's stdin stream, allowing execution to resume.

*Note: For standard non-destructive commands, the app defaults to passing flags like \--yes or \--force to bypass prompts entirely.*

## **5.4 Error Handling & Fallbacks**

The integration layer provides resilience against common environment issues.

### **5.4.1 Failure Scenarios**

* **Missing Binary:** If no valid mcoda binary is found, the app enters "Setup Mode," guiding the user to install the CLI or repair the bundled version.  
* **Process Crash:** If a child process exits with a non-zero code, the CliService captures the full stderr buffer. It attempts to parse a structured McodaError JSON object. If parsing fails, it wraps the raw error text in a generic error object and returns it to the UI for display.  
* **Orphaned Processes:** On application exit or window reload, the Main process scans its registry of active child PIDs and sends SIGKILL to ensure no headless mcoda processes are left running (zombies).

### **5.4.2 Connectivity Issues**

Since the CLI handles network interactions (Docdex, LLMs), network errors appear as process failures. The app parses specific error codes (e.g., DOCDEX\_UNREACHABLE, AUTH\_FAILED) and maps them to user-friendly UI states (e.g., a "Retry Connection" button or an "Update API Key" form) rather than showing raw stack traces.

---

# **6\. Implementation Plan**

## **6.1 Phase 1: Shell & Read-Only Dashboard**

**Goal:** establish the Electron runtime environment, validate the mcoda binary resolution strategy, and provide a read-only view of project state. At the end of this phase, the app acts as a high-fidelity viewer for mcoda data.

### **6.1.1 Core Deliverables**

1. **Electron Scaffold:**  
   * Initialize monorepo structure (if distinct from main repo) or packages/desktop within the existing mcoda monorepo.  
   * Configure Webpack/Vite for Main and Renderer processes with TypeScript support.  
   * Implement secure preload.js context isolation bridge.  
2. **Binary Resolution Engine:**  
   * Implement the logic to detect mcoda in $PATH vs. bundled resources.  
   * Implement the startup version check (mcoda \--version \--json) and the blocking "Incompatible Version" modal.  
3. **Workspace Selector:**  
   * Build the "Welcome" screen with native directory picker.  
   * Implement validation logic to check for .mcoda/config.json.  
4. **The "Plan" View (Read-Only):**  
   * Implement the task:list IPC handler calling mcoda backlog \--json.  
   * Build the Kanban board UI to render Epics, Stories, and Tasks.  
   * *Constraint:* No drag-and-drop or editing in this phase.

**Exit Criteria:**

* User can open the app on macOS/Windows/Linux.  
* User can select a local folder containing an initialized mcoda project.  
* The Task Board populates with real data from the CLI.

## **6.2 Phase 2: Interactive Planning & Task Execution**

**Goal:** Enable the "Write" path. The user must be able to drive the core development loop (Plan → Work → Review) entirely from the GUI without opening a separate terminal.

### **6.2.1 Core Deliverables**

1. **Job Execution Engine:**  
   * Implement CliService streaming mode (child\_process.spawn).  
   * Wire up the job:log and job:progress IPC channels to stream stdout to the frontend.  
2. **Task Creation Wizard:**  
   * Build the UI form for create-tasks (Project selection, RFP text input).  
   * Connect the form submission to mcoda create-tasks execution.  
   * Implement the "Active Job" overlay to show generation progress.  
3. **The "Work" View (Execution):**  
   * Implement the task detail pane.  
   * Add the "Start Work" button triggering mcoda work-on-tasks \--task \<ID\>.  
   * Build the collapsible Terminal Drawer to visualize the underlying agent activity.  
4. **Interactivity Bridge:**  
   * Implement the regex parsers to detect CLI confirmation prompts (e.g., Apply patch? \[Y/n\]).  
   * Build the UI modal for user input and the IPC channel to write back to stdin.

**Exit Criteria:**

* User can generate a new backlog from a text description via the UI.  
* User can select a task and run the implementation agent, seeing real-time logs.  
* The application handles basic CLI prompts (confirmations) gracefully.

## **6.3 Phase 3: Advanced Visuals (Graphs, Diffs, Telemetry)**

**Goal:** Provide value *beyond* what the terminal offers. This phase focuses on high-density information visualization and "Power User" features.

### **6.3.1 Core Deliverables**

1. **Visual Diff Editor:**  
   * Integrate a Monaco Editor (VS Code) instance or similar diff component into the "Review" pane.  
   * Parse the mcoda code-review output (file paths and hunks) to populate the diff view.  
   * Implement "Accept" actions that trigger the final commit steps in the CLI.  
2. **Telemetry Dashboard:**  
   * Implement the mcoda tokens \--json data fetcher.  
   * Render charts (e.g., Recharts or Chart.js) showing token spend per agent and velocity (SP/hour) trends.  
3. **Agent Management UI:**  
   * Build forms for mcoda agent add and mcoda agent edit to manage configuration without editing JSON files manually.  
   * Add the "Test Agent" connectivity check UI.  
4. **Dependency Visualization:**  
   * Use a library like React Flow or Cytoscape.js to render the task dependency graph (task\_dependencies table data) visually.

**Exit Criteria:**

* Users can review code changes with syntax highlighting and side-by-side diffs.  
* Project costs and velocity are visible at a glance.  
* Complex task dependencies can be navigated visually.

---

# **7\. Security & Distribution**

## **7.1 Local Security Model (Subprocess Constraints)**

As a desktop application that executes arbitrary code (agents) and manages sensitive credentials, Master Coda enforces a strict local security model.

### **7.1.1 Process Isolation**

* **Renderer Sandbox:** The UI runs with sandbox: true and contextIsolation: true. It cannot access Node.js primitives directly.  
* **IPC Validation:** All IPC messages from the Renderer are validated against a schema (Zod or similar) in the Main process before execution. Malformed requests (e.g., job:start with an invalid path traversal payload) are rejected.  
* **Child Process Constraints:**  
  * Spawned mcoda processes inherit **only** the necessary environment variables. The Main process sanitizes process.env to remove sensitive host environment variables (like global AWS credentials) unless explicitly allowlisted in settings.json.  
  * The cwd for child processes is strictly validated to be within the user-selected workspace root. The app prevents execution against system directories (e.g., /, C:\\Windows).

### **7.1.2 Credential Handling**

* **No Persistence in UI:** API keys (OpenAI, Anthropic) are never stored in the browser's localStorage. They are sent once to the Main process, which invokes mcoda agent add.  
* **Delegation:** The Desktop App delegates all credential storage to the mcoda CLI's encrypted SQLite database (\~/.mcoda/mcoda.db). The app does not maintain its own keychain or secrets file.

## **7.2 Auto-Updating (Electron Builder vs. mcoda update)**

The application has two distinct update channels that must be synchronized.

### **7.2.1 The Application Wrapper (Electron)**

* **Mechanism:** Uses electron-updater (backed by electron-builder).  
* **Trigger:** Checks for updates on startup and every 24 hours.  
* **Behavior:**  
  * Downloads the new .dmg / .exe / .AppImage in the background.  
  * Prompts the user: *"Master Coda v1.2 is ready. Restart to update?"*  
* **Content:** Updates the UI code, Main process logic, and the **bundled** mcoda binary.

### **7.2.2 The Internal CLI Binary**

* **Problem:** A user might have a newer mcoda CLI installed globally than the one bundled in the Desktop App.  
* **Strategy:**  
  1. **Prefer Bundled:** By default, the app uses its internal binary to guarantee stability.  
  2. **Opt-in External:** If the user configures cli.customPath, the app respects it but warns if the version is outside the supported range.  
  3. **Synchronization:** When the Desktop App updates, it brings a new bundled CLI version. This implicitly updates the CLI for users using the default configuration.

## **7.3 Packaging & Signing**

Distribution artifacts are generated via electron-builder.

### **7.3.1 Build Targets**

* **macOS:** .dmg and .zip (Universal binary: x64 \+ arm64).  
* **Windows:** .nsis installer (x64).  
* **Linux:** .AppImage and .deb (x64).

### **7.3.2 Code Signing & Notarization**

* **macOS:**  
  * Signed with a generic **Developer ID Application** certificate (e.g., via Apple Developer Program).  
  * Notarized via Apple's notary service to prevent Gatekeeper warnings.  
  * *Entitlements:* com.apple.security.cs.allow-jit, com.apple.security.network.client. (No file system restrictions are applied to mcoda child processes, as they need broad access to the workspace).  
* **Windows:**  
  * Signed with a standard **EV Code Signing Certificate** (or OV if EV is unavailable) to establish SmartScreen reputation.

### **7.3.3 Artifact Hosting**

* Release artifacts are hosted on **GitHub Releases** in the master-coda repository.  
* The update feed (latest.yml, latest-mac.yml) is fetched directly from GitHub, ensuring a zero-infrastructure update pipeline.

Here is **Appendix A: Technical Specifications & Constants**. This appendix resolves specific implementation choices and data structures referenced in the main SDS.

---

# **Appendix A: Technical Specifications & Constants**

## **A.1 State Management Specification**

**Decision:** The application SHALL use **Zustand** for global state management due to its minimal boilerplate and ability to handle transient state (logs, progress) without unnecessary re-renders.

### **A.1.1 Store Architecture**

The store is divided into four distinct slices to separate concerns.

**1\. Workspace Slice (useWorkspaceStore)**

* *Persistence:* Partially persisted (path, lastOpened).  
* *Responsibility:* Tracks the active project context.

TypeScript

```

interface WorkspaceState {
  currentPath: string | null;
  config: McodaConfig | null; // Loaded from .mcoda/config.json
  isValid: boolean;
  actions: {
    loadWorkspace: (path: string) => Promise<void>;
    refreshConfig: () => Promise<void>;
  };
}

```

**2\. Task Slice (useTaskStore)**

* *Persistence:* None (Transient, hydrated from CLI).  
* *Responsibility:* Holds the planning entities.

TypeScript

```

interface TaskState {
  epics: Record<string, Epic>;
  stories: Record<string, Story>;
  tasks: Record<string, Task>;
  filters: {
    assignee: string | null;
    status: TaskStatus[];
    search: string;
  };
  actions: {
    hydrate: (backlog: BacklogSummary) => void;
    updateTaskStatus: (taskId: string, status: TaskStatus) => void; // Optimistic
  };
}

```

**3\. Job Slice (useJobStore)**

* *Persistence:* None.  
* *Responsibility:* Tracks active CLI processes and their output.

TypeScript

```

interface JobState {
  activeJobs: Record<string, ActiveJob>; // Keyed by internal Electron Job UUID
  logs: Record<string, string[]>; // Keyed by Job UUID, ring-buffer (max 1000 lines)
  actions: {
    registerJob: (id: string, type: JobType, pid: number) => void;
    updateProgress: (id: string, percent: number) => void;
    appendLog: (id: string, line: string) => void;
    linkDbId: (internalId: string, dbId: string) => void; // See A.3
  };
}

```

## **A.2 Standard Error Interface (IpcError)**

All IPC handlers in the Main process MUST reject promises with a standardized error object to allow the UI to render consistent error states (Toasts, Modals, or Inline Alerts).

TypeScript

```

export interface IpcError {
  /**
   * High-level error category for UI routing.
   * - 'config': Show settings modal.
   * - 'missing_binary': Show setup wizard.
   * - 'execution': Show output log drawer.
   */
  kind: 'config' | 'missing_binary' | 'execution' | 'validation' | 'unknown';

  /**
   * Stable error code for programmatic handling (e.g., auto-retry).
   */
  code: string; // e.g., 'MCODA_ERR_NO_WORKSPACE'

  /**
   * Human-readable message for display.
   */
  message: string;

  /**
   * The specific CLI command that failed (if applicable).
   */
  command?: string;

  /**
   * Raw stderr output or stack trace for debugging.
   */
  technicalDetails?: string;
}

```

**Standard Error Codes:**

* CLI\_NOT\_FOUND: Binary resolution failed.  
* CLI\_VERSION\_MISMATCH: mcoda \--version returned unsupported version.  
* WORKSPACE\_INVALID: Selected folder is missing .mcoda or config.json is malformed.  
* JOB\_NON\_ZERO\_EXIT: Process exited with code \> 0\.  
* JOB\_TIMEOUT: Process exceeded execution time limit.

## **A.3 Job ID Reconciliation Strategy**

A critical synchronization gap exists between the **Electron Process ID** (assigned immediately upon spawn) and the **Mcoda Database Job ID** (generated by the CLI after DB connection).

**The Handover Protocol:**

1. **Spawn:** Main process spawns mcoda.  
   * Generates internalJobId (UUID v4).  
   * UI displays loading state using internalJobId.  
2. **Scanning:** The StreamParser scans the CLI's stdout for a specific reserved log line.  
3. **Detection:** The mcoda CLI (v0.3+) emits a JSON handshake line on startup:  
4. JSON

```

{"__meta__": "job_start", "job_id": "db-uuid-1234", "command": "create-tasks"}

```

7.   
8. **Reconciliation:**  
   * Main process catches this line.  
   * Emits IPC event: job:linked { internalId: "...", dbId: "..." }.  
   * UI updates the Job Store map to associate the two IDs.  
9. **Telemetry:** All subsequent UI telemetry lookups use the dbId.

## **A.4 Interactive Prompt Registry**

The application must detect and render interactive prompts from the CLI. The following Regex Registry defines the initial set of supported interactions.

| Prompt Type | Regex Pattern (Case Insensitive) | UI Component | Example CLI Output |
| :---- | :---- | :---- | :---- |
| **Confirmation** | /^.\*\\? \\\[y\\/N\\\]/i | Boolean Modal (Yes/No) | Apply changes to 5 files? \[y/N\] |
| **Selection** | /^.\*select.\*option:/i | Dropdown / Radio List | Select QA Profile: \[1\] Unit, \[2\] E2E |
| **Text Input** | /^.\*enter.\*:/i | Text Input Modal | Enter OpenAI API Key: |
| **Password** | /^.\*password.\*:/i | Password Input (Masked) | Enter Key Encryption Password: |
| **Press Key** | /^.\*press any key.\*/i | Button ("Continue") | Press any key to close... |

**Implementation Note:** The CLI MUST flush stdout immediately after printing these prompts. If the CLI buffers output, the regex won't match until the buffer fills, causing a hang. The Desktop App executes mcoda with MCODA\_UNBUFFERED\_IO=true to enforce this.

