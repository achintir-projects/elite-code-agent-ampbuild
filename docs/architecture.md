# Architecture & Milestones

```mermaid
flowchart TD
  subgraph UI[Web IDE + VS Code Extension]
    IDE[Monaco Editor\nDiff Viewer\nLogs/Test Panel]
    EXT[VS Code Extension]
    PREVIEW[Live Preview (Web/Docs/Verilator VCD)]
  end

  subgraph API[Backend API + Worker]
    GW[REST/WebSocket Gateway]
    Q[Task Queue (in-memory/BullMQ abstraction)]
    WRK[Worker Runner]
  end

  subgraph CORE[Core Agent Engine]
    ORCH[Orchestrator]
    PLAN[Planner]
    RES[Researcher]
    CODE[Coder]
    TEST[Tester]
    PKG[Packager]
    SEC[Security Auditor]
    REV[Reviewer]
    DX[DX Writer]
    MEM[Hierarchical Memory\n(task/repo/tool/vector)]
    DET[Determinism Controls\n(temp, caps, checkpoints)]
  end

  subgraph TOOL[Tooling Layer]
    FS[FS Ops: read/write/diff/AST]
    SH[Shell/Task Runner]
    GIT[Git]
    BUILD[Build Systems]
    TESTS[Test Runners]
    LINT[Linters/Formatters]
    SECOPS[Security/Compliance]
    PACK[Packaging]
    DEPLOY[Deployment]
    RTL[RTL Adapters: Verilator/SBY/Yosys]
  end

  subgraph MODELS[Model Orchestration]
    ROUTER[Model Router]
    OSS[OSS Models\nDeepSeek/CodeLlama/Qwen]
    CLOSED[Pluggable Closed Models]
  end

  subgraph DATA[Artifacts & State]
    AR[Run Records (YAML/JSON)]
    SBOM[SBOM & Licenses]
    ART[Artifacts (bundles/installers/images)]
    CACHE[Local Cache]
  end

  IDE -->|Commands/Edits| GW
  EXT -->|Commands/Context| GW
  PREVIEW <--> GW

  GW --> Q --> WRK --> ORCH

  ORCH --> PLAN
  ORCH --> RES
  ORCH --> CODE
  ORCH --> TEST
  ORCH --> PKG
  ORCH --> SEC
  ORCH --> REV
  ORCH --> DX
  ORCH --> DET
  ORCH <--> MEM

  PLAN --> TOOL
  RES --> TOOL
  CODE --> TOOL
  TEST --> TOOL
  PKG --> TOOL
  SEC --> TOOL
  REV --> TOOL
  DX --> TOOL

  ORCH <--> ROUTER
  ROUTER --> OSS
  ROUTER --> CLOSED

  TOOL --> SH
  SH --> BUILD
  SH --> TESTS
  SH --> LINT
  SH --> SECOPS
  SH --> PACK
  SH --> DEPLOY
  SH --> RTL
  FS -.-> TOOL
  GIT -.-> TOOL

  ORCH --> AR
  SEC --> SBOM
  PKG --> ART
  TOOL --> CACHE
```

## Milestones
- M0 – Design (this doc)
- M1 – Core Engine: plan→code→test loop, patch apply, run-record
- M2 – Web IDE: editor, terminal/logs, run tasks; Netlify
- M3 – VS Code Extension: commands, patch UI
- M4 – Packaging: Docker/npm/pip, Electron/Tauri, MSI/MSIX
- M5 – RTL Track: Verilator/SBY flows + UART sample
- M6 – Security/Compliance: scans + SBOM + gates
- M7 – Rapid Prototyping: templates + live preview
- M8 – Polish & Docs: telemetry opt-in, tutorials, benchmarks
