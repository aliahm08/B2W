# Technical Requirements Document

## Product

Multi-role AI operations platform based on the architecture and interaction patterns in `aliahm08/n-ai`.

Repo reference:

- [aliahm08/n-ai](https://github.com/aliahm08/n-ai)

Key implementation references:

- [README.md](https://github.com/aliahm08/n-ai/blob/main/README.md)
- [package.json](https://github.com/aliahm08/n-ai/blob/main/package.json)
- [vite.config.ts](https://github.com/aliahm08/n-ai/blob/main/vite.config.ts)
- [App.tsx](https://github.com/aliahm08/n-ai/blob/main/App.tsx)
- [components/AnalysisView.tsx](https://github.com/aliahm08/n-ai/blob/main/components/AnalysisView.tsx)
- [components/SupervisorView.tsx](https://github.com/aliahm08/n-ai/blob/main/components/SupervisorView.tsx)
- [components/Sidebar.tsx](https://github.com/aliahm08/n-ai/blob/main/components/Sidebar.tsx)
- [components/VisualAnalyzer.tsx](https://github.com/aliahm08/n-ai/blob/main/components/VisualAnalyzer.tsx)
- [contexts/DataContext.tsx](https://github.com/aliahm08/n-ai/blob/main/contexts/DataContext.tsx)
- [services/geminiService.ts](https://github.com/aliahm08/n-ai/blob/main/services/geminiService.ts)
- [types.ts](https://github.com/aliahm08/n-ai/blob/main/types.ts)

## 1. Purpose

This document defines the technical requirements to evolve `n-ai` from a single-provider front-end prototype into a production-ready AI platform with:

- role-based workspaces
- conversational interaction
- analysis and modeling workflows
- grounded knowledge retrieval
- multimodal input handling
- deliverable generation
- secure, auditable multi-tenant operation

## 2. Current Baseline

The current repo already provides a useful foundation:

- React 19 + Vite + TypeScript SPA
- role-aware UI patterns for operator, supervisor, and specialist workflows
- browser speech recognition for voice log capture
- image upload and multimodal analysis flow
- SOP-grounded coaching flow
- in-memory state via React context
- Gemini-based structured generation functions
- PDF-style export through print rendering

The current repo is still a prototype and has major production gaps:

- AI calls are made from the client
- API keys are injected into the frontend bundle
- all state is in memory
- no authentication or authorization exists
- no database or object storage exists
- no audit trail exists
- only one AI provider is supported
- no server-side policy enforcement exists

## 3. Technical Objective

Build a production architecture that preserves the interaction strengths of `n-ai` while adding the infrastructure required for a secure multi-user AI platform.

## 4. Target System Scope

The production system must support:

- web application for desktop, tablet, and mobile
- role-based workspaces
- chat, analysis, document generation, and multimodal workflows
- server-side AI orchestration
- persistent operational data
- tenant configuration and policy controls
- auditability and review workflows

## 5. Functional Requirements

### 5.1 Workspace and Role Model

The system must support at least these user roles:

- operator
- supervisor
- specialist or analyst
- administrator

Each role must have:

- specific navigation
- scoped permissions
- tailored defaults
- relevant data visibility

### 5.2 Voice and Text Intake

The system must support:

- typed input
- browser microphone input
- transcript normalization
- structured incident or task extraction
- severity classification
- recommended action generation

### 5.3 Multimodal Analysis

The system must support:

- image upload
- image-based hazard or issue analysis
- structured multimodal output
- saved analysis history
- follow-on actions from visual findings

### 5.4 Chat and Grounded Guidance

The system must support:

- chat sessions tied to user and tenant context
- grounded responses based on approved knowledge sources
- configurable AI personality and tone
- citation or source-trace support for grounded guidance
- conversation persistence

### 5.5 Risk Synthesis and Forecasting

The system must support:

- aggregation of event or log records
- synthesis into grouped risks
- probability and severity scoring
- forecast generation
- mitigation planning

### 5.6 Deliverable Generation

The system must support:

- structured report generation
- task-list generation
- SOP drafting
- strategic plan generation
- exportable output formats

### 5.7 Supervisor and Admin Controls

The system must support:

- workspace configuration
- prompt and personality controls
- enforcement of knowledge-grounding rules
- protocol or SOP management
- operator and asset oversight

## 6. Architecture Requirements

### 6.1 Frontend

The frontend may continue to use React + TypeScript, but must be reorganized into:

- app shell and routing layer
- authenticated session layer
- role-aware workspace modules
- API client layer
- state management for server-backed data
- reusable design system components

The frontend must no longer call provider SDKs directly for protected workloads.

### 6.2 Backend

A backend service layer is required. It must provide:

- authenticated APIs
- AI orchestration endpoints
- data persistence
- file handling
- export generation
- audit logging
- tenant configuration enforcement

Recommended backend responsibilities:

- request validation
- provider selection
- prompt construction
- policy checks
- rate limiting
- job execution
- response normalization

### 6.3 AI Orchestration Layer

The current `geminiService.ts` pattern should be replaced or wrapped by a server-side orchestration layer.

The orchestration layer must support:

- multiple providers
- multiple models per provider
- structured output validation
- per-use-case routing policies
- tenant-level overrides
- safe retries and fallbacks
- model usage logging

### 6.4 Persistence Layer

A real data store is required for:

- users
- roles
- tenants
- sessions
- logs
- risks
- SOPs
- generated reports
- chat history
- uploaded media
- audit events

### 6.5 Storage Layer

Object storage is required for:

- uploaded images
- generated files
- report exports
- media derivatives

## 7. Data Model Requirements

The prototype type definitions in `types.ts` should evolve into persistent domain models.

Required entities:

- `Tenant`
- `User`
- `RoleAssignment`
- `Workspace`
- `FieldLog`
- `Incident`
- `RiskGroup`
- `Sop`
- `ChatSession`
- `ChatMessage`
- `AnalysisArtifact`
- `GeneratedDeliverable`
- `UploadedAsset`
- `AiPolicy`
- `AuditEvent`

Key data requirements:

- tenant isolation
- user attribution
- created/updated timestamps
- output provenance
- model provenance
- asset linkage across workflows

## 8. Security Requirements

### 8.1 Authentication

The system must support authenticated access for all non-public functionality.

### 8.2 Authorization

Role-based and tenant-based authorization must be enforced server-side.

### 8.3 Secret Handling

Provider API keys must not be exposed to the frontend bundle. The current `vite.config.ts` approach must be replaced with server-side secret management.

### 8.4 Auditability

The system must record:

- who initiated an AI action
- which model/provider was used
- what policy applied
- what output was produced
- whether human review occurred

### 8.5 Data Protection

The system must support:

- encryption in transit
- encryption at rest for stored data
- secure upload handling
- retention controls for sensitive records

## 9. AI Requirements

### 9.1 Provider Support

Production architecture must support at least:

- Gemini
- OpenAI
- Anthropic

### 9.2 Routing

Routing must be configurable by:

- tenant
- use case
- role
- latency target
- reasoning depth
- cost sensitivity
- output type

### 9.3 Structured Output

All structured AI responses must be validated before use.

Required patterns:

- schema validation
- parse failure handling
- fallback messaging
- partial-result handling

### 9.4 Grounding

Grounded knowledge workflows must support:

- scoped knowledge sources
- source versioning
- retrieval policies
- source attribution in outputs where appropriate

## 10. UX and Device Requirements

The current repo already demonstrates good role/device differentiation. Production requirements should formalize it.

### 10.1 Desktop

Must support:

- dense analytical layouts
- multi-panel workflows
- risk synthesis and planning views
- document review and export

### 10.2 Tablet

Must support:

- collapsible operational sidebar
- supervisor review workflows
- visual analysis and team oversight
- field-ready interaction density

### 10.3 Mobile

Must support:

- voice-first and quick-action flows
- compact briefing and logging workflows
- limited but high-value AI assistance
- resilient input experience on intermittent connectivity

## 11. Export and Reporting Requirements

The current `window.print()` export is not sufficient for production.

Production reporting must support:

- server-generated PDF or equivalent export
- versioned report output
- template consistency
- print-safe formatting
- tenant branding support

## 12. Integration Requirements

The production system should support integration with:

- identity provider
- database
- object storage
- AI provider APIs
- observability platform
- email or notification system
- optional workflow queue

## 13. Non-Functional Requirements

### 13.1 Performance

- flash-response AI tasks should feel near-real-time
- image analysis requests must provide progress feedback
- large dashboards must remain responsive

### 13.2 Reliability

- backend requests must degrade gracefully on provider failure
- upload and export jobs must not fail silently
- critical user workflows must be recoverable

### 13.3 Maintainability

- separate UI, orchestration, persistence, and integration layers
- avoid business logic in presentation components
- formalize shared schemas and service contracts

### 13.4 Observability

The system must support:

- request logs
- provider call logs
- latency tracking
- failure monitoring
- usage analytics

## 14. Recommended Technical Changes from Current Repo

### 14.1 Immediate

- move all AI calls to server-side endpoints
- remove client-side API key exposure
- add auth
- add persistent database
- add file storage
- add real routing and API boundaries

### 14.2 Near-Term

- split `AnalysisView.tsx` and `SupervisorView.tsx` into smaller feature modules
- replace in-memory context with server-backed query and mutation patterns
- create export service
- add schema validation for all AI outputs

### 14.3 Medium-Term

- introduce multi-provider orchestration
- add tenant policy engine
- add review workflows
- add async job processing for long-running AI tasks

## 15. Open Questions

- should the app remain a Vite SPA or move to a framework with stronger server integration
- what database and storage choices best fit the deployment target
- how much offline tolerance is required for mobile workflows
- what review gates are mandatory for AI-generated reports
- how much tenant customization is needed at launch

## 16. Acceptance Criteria

The platform will meet baseline production readiness when:

- no provider secret is exposed client-side
- authenticated users can access only their permitted workspaces
- logs, chats, SOPs, risks, and outputs persist across sessions
- AI outputs are schema-validated and auditable
- multimodal upload and analysis work through server-backed flows
- reports can be generated and exported reliably
- tenant and role policy is enforced server-side
