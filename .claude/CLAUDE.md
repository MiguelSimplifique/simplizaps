# Synkra AIOS Development Rules for Claude Code

You are working with Synkra AIOS, an AI-Orchestrated System for Full Stack Development.

<!-- AIOS-MANAGED-START: core-framework -->
## Core Framework Understanding

Synkra AIOS is a meta-framework that orchestrates AI agents to handle complex development workflows. Always recognize and work within this architecture.
<!-- AIOS-MANAGED-END: core-framework -->

<!-- AIOS-MANAGED-START: constitution -->
## Constitution

O AIOS possui uma **Constitution formal** com princípios inegociáveis e gates automáticos.

**Documento completo:** `.aios-core/constitution.md`

**Princípios fundamentais:**

| Artigo | Princípio | Severidade |
|--------|-----------|------------|
| I | CLI First | NON-NEGOTIABLE |
| II | Agent Authority | NON-NEGOTIABLE |
| III | Story-Driven Development | MUST |
| IV | No Invention | MUST |
| V | Quality First | MUST |
| VI | Absolute Imports | SHOULD |

**Gates automáticos bloqueiam violações.** Consulte a Constitution para detalhes completos.
<!-- AIOS-MANAGED-END: constitution -->

<!-- AIOS-MANAGED-START: sistema-de-agentes -->
## Sistema de Agentes

### Ativação de Agentes
Use `@agent-name` ou `/AIOS:agents:agent-name`:

| Agente | Persona | Escopo Principal |
|--------|---------|------------------|
| `@dev` | Dex | Implementação de código |
| `@qa` | Quinn | Testes e qualidade |
| `@architect` | Aria | Arquitetura e design técnico |
| `@pm` | Morgan | Product Management |
| `@po` | Pax | Product Owner, stories/epics |
| `@sm` | River | Scrum Master |
| `@analyst` | Alex | Pesquisa e análise |
| `@data-engineer` | Dara | Database design |
| `@ux-design-expert` | Uma | UX/UI design |
| `@devops` | Gage | CI/CD, git push (EXCLUSIVO) |

### Comandos de Agentes
Use prefixo `*` para comandos:
- `*help` - Mostrar comandos disponíveis
- `*create-story` - Criar story de desenvolvimento
- `*task {name}` - Executar task específica
- `*exit` - Sair do modo agente
<!-- AIOS-MANAGED-END: sistema-de-agentes -->

<!-- AIOS-MANAGED-START: agent-system -->
## Agent System

### Agent Activation
- Agents are activated with @agent-name syntax: @dev, @qa, @architect, @pm, @po, @sm, @analyst
- The master agent is activated with @aios-master
- Agent commands use the * prefix: *help, *create-story, *task, *exit

### Agent Context
When an agent is active:
- Follow that agent's specific persona and expertise
- Use the agent's designated workflow patterns
- Maintain the agent's perspective throughout the interaction
<!-- AIOS-MANAGED-END: agent-system -->

## Development Methodology

### Story-Driven Development
1. **Work from stories** - All development starts with a story in `docs/stories/`
2. **Update progress** - Mark checkboxes as tasks complete: [ ] → [x]
3. **Track changes** - Maintain the File List section in the story
4. **Follow criteria** - Implement exactly what the acceptance criteria specify

### Code Standards
- Write clean, self-documenting code
- Follow existing patterns in the codebase
- Include comprehensive error handling
- Add unit tests for all new functionality
- Use TypeScript/JavaScript best practices

### Testing Requirements
- Run all tests before marking tasks complete
- Ensure linting passes: `npm run lint`
- Verify type checking: `npm run typecheck`
- Add tests for new features
- Test edge cases and error scenarios

<!-- AIOS-MANAGED-START: framework-structure -->
## AIOS Framework Structure

```
aios-core/
├── agents/         # Agent persona definitions (YAML/Markdown)
├── tasks/          # Executable task workflows
├── workflows/      # Multi-step workflow definitions
├── templates/      # Document and code templates
├── checklists/     # Validation and review checklists
└── rules/          # Framework rules and patterns

docs/
├── stories/        # Development stories (numbered)
├── prd/            # Product requirement documents
├── architecture/   # System architecture documentation
└── guides/         # User and developer guides
```
<!-- AIOS-MANAGED-END: framework-structure -->

<!-- AIOS-MANAGED-START: framework-boundary -->
## Framework vs Project Boundary

O AIOS usa um modelo de 4 camadas (L1-L4) para separar artefatos do framework e do projeto. Deny rules em `.claude/settings.json` reforçam isso deterministicamente.

| Camada | Mutabilidade | Paths | Notas |
|--------|-------------|-------|-------|
| **L1** Framework Core | NEVER modify | `.aios-core/core/`, `.aios-core/constitution.md`, `bin/aios.js`, `bin/aios-init.js` | Protegido por deny rules |
| **L2** Framework Templates | NEVER modify | `.aios-core/development/tasks/`, `.aios-core/development/templates/`, `.aios-core/development/checklists/`, `.aios-core/development/workflows/`, `.aios-core/infrastructure/` | Extend-only |
| **L3** Project Config | Mutable (exceptions) | `.aios-core/data/`, `agents/*/MEMORY.md`, `core-config.yaml` | Allow rules permitem |
| **L4** Project Runtime | ALWAYS modify | `docs/stories/`, `packages/`, `squads/`, `tests/` | Trabalho do projeto |

**Toggle:** `core-config.yaml` → `boundary.frameworkProtection: true/false` controla se deny rules são ativas (default: true para projetos, false para contribuidores do framework).

> **Referência formal:** `.claude/settings.json` (deny/allow rules), `.claude/rules/agent-authority.md`
<!-- AIOS-MANAGED-END: framework-boundary -->

<!-- AIOS-MANAGED-START: rules-system -->
## Rules System

O AIOS carrega regras contextuais de `.claude/rules/` automaticamente. Regras com frontmatter `paths:` só carregam quando arquivos correspondentes são editados.

| Rule File | Description |
|-----------|-------------|
| `agent-authority.md` | Agent delegation matrix and exclusive operations |
| `agent-handoff.md` | Agent switch compaction protocol for context optimization |
| `agent-memory-imports.md` | Agent memory lifecycle and CLAUDE.md ownership |
| `coderabbit-integration.md` | Automated code review integration rules |
| `ids-principles.md` | Incremental Development System principles |
| `mcp-usage.md` | MCP server usage rules and tool selection priority |
| `story-lifecycle.md` | Story status transitions and quality gates |
| `workflow-execution.md` | 4 primary workflows (SDC, QA Loop, Spec Pipeline, Brownfield) |

> **Diretório:** `.claude/rules/` — rules são carregadas automaticamente pelo Claude Code quando relevantes.
<!-- AIOS-MANAGED-END: rules-system -->

<!-- AIOS-MANAGED-START: code-intelligence -->
## Code Intelligence

O AIOS possui um sistema de code intelligence opcional que enriquece operações com dados de análise de código.

| Status | Descrição | Comportamento |
|--------|-----------|---------------|
| **Configured** | Provider ativo e funcional | Enrichment completo disponível |
| **Fallback** | Provider indisponível | Sistema opera normalmente sem enrichment — graceful degradation |
| **Disabled** | Nenhum provider configurado | Funcionalidade de code-intel ignorada silenciosamente |

**Graceful Fallback:** Code intelligence é sempre opcional. `isCodeIntelAvailable()` verifica disponibilidade antes de qualquer operação. Se indisponível, o sistema retorna o resultado base sem modificação — nunca falha.

**Diagnóstico:** `aios doctor` inclui check de code-intel provider status.

> **Referência:** `.aios-core/core/code-intel/` — provider interface, enricher, client
<!-- AIOS-MANAGED-END: code-intelligence -->

<!-- AIOS-MANAGED-START: graph-dashboard -->
## Graph Dashboard

O CLI `aios graph` visualiza dependências, estatísticas de entidades e status de providers.

### Comandos

```bash
aios graph --deps                        # Dependency tree (ASCII)
aios graph --deps --format=json          # Output como JSON
aios graph --deps --format=html          # Interactive HTML (abre browser)
aios graph --deps --format=mermaid       # Mermaid diagram
aios graph --deps --format=dot           # DOT format (Graphviz)
aios graph --deps --watch                # Live mode com auto-refresh
aios graph --deps --watch --interval=10  # Refresh a cada 10 segundos
aios graph --stats                       # Entity stats e cache metrics
```

**Formatos de saída:** ascii (default), json, dot, mermaid, html

> **Referência:** `.aios-core/core/graph-dashboard/` — CLI, renderers, data sources
<!-- AIOS-MANAGED-END: graph-dashboard -->

## Workflow Execution

### Task Execution Pattern
1. Read the complete task/workflow definition
2. Understand all elicitation points
3. Execute steps sequentially
4. Handle errors gracefully
5. Provide clear feedback

### Interactive Workflows
- Workflows with `elicit: true` require user input
- Present options clearly
- Validate user responses
- Provide helpful defaults

## Best Practices

### When implementing features:
- Check existing patterns first
- Reuse components and utilities
- Follow naming conventions
- Keep functions focused and testable
- Document complex logic

### When working with agents:
- Respect agent boundaries
- Use appropriate agent for each task
- Follow agent communication patterns
- Maintain agent context

### When handling errors:
```javascript
try {
  // Operation
} catch (error) {
  console.error(`Error in ${operation}:`, error);
  // Provide helpful error message
  throw new Error(`Failed to ${operation}: ${error.message}`);
}
```

## Git & GitHub Integration

### Commit Conventions
- Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, etc.
- Reference story ID: `feat: implement IDE detection [Story 2.1]`
- Keep commits atomic and focused

### GitHub CLI Usage
- Ensure authenticated: `gh auth status`
- Use for PR creation: `gh pr create`
- Check org access: `gh api user/memberships`

<!-- AIOS-MANAGED-START: aios-patterns -->
## AIOS-Specific Patterns

### Working with Templates
```javascript
const template = await loadTemplate('template-name');
const rendered = await renderTemplate(template, context);
```

### Agent Command Handling
```javascript
if (command.startsWith('*')) {
  const agentCommand = command.substring(1);
  await executeAgentCommand(agentCommand, args);
}
```

### Story Updates
```javascript
// Update story progress
const story = await loadStory(storyId);
story.updateTask(taskId, { status: 'completed' });
await story.save();
```
<!-- AIOS-MANAGED-END: aios-patterns -->

## Environment Setup

### Required Tools
- Node.js 18+
- GitHub CLI
- Git
- Your preferred package manager (npm/yarn/pnpm)

### Configuration Files
- `.aios/config.yaml` - Framework configuration
- `.env` - Environment variables
- `aios.config.js` - Project-specific settings

## SmartZap Project Context

This repository is **SmartZap** — an educational SaaS template for WhatsApp CRM automation built on Synkra AIOS.

### Project Overview
- **Type:** Full-stack SaaS application
- **Tech Stack:** Next.js 15, React 19, Tailwind CSS, Supabase, AI SDK
- **Purpose:** WhatsApp Business marketing and contact management with AI-powered template generation
- **Status:** Template for learning and customization

### Core Features
- **📱 Dashboard** - Metrics and overview
- **👥 Contacts** - CRUD, CSV import, tagging
- **📝 Templates** - Meta Cloud API integration, AI generation (Gemini)
- **📢 Campaigns** - Bulk message dispatch
- **⚙️ Settings** - API key management (Meta, Gemini, etc.)

### Technology Decisions

**Frontend Architecture:**
- Next.js 15 App Router (serverless routing)
- React 19 with React Compiler babel plugin
- Component library: Shadcn/ui (Radix UI + Tailwind)
- Rich text editor: TipTap (for template editing)
- State: Zustand + React Query for async state
- Form handling: React Hook Form + Zod validation
- UI visualization: XYFlow (workflows), Recharts (charts), Dagre (graphs)

**Backend Architecture:**
- Next.js API Routes (serverless functions)
- Authentication: Custom session-based (see `/app/api/auth/`)
- Database: Supabase (PostgreSQL) with migrations in `/supabase/`
- External APIs: Meta WhatsApp Cloud API, Google Gemini, Anthropic, OpenAI

**Data Layer:**
- Supabase PostgreSQL client via `@supabase/supabase-js`
- CSV parsing for contact imports via PapaParse
- Event queuing: Upstash QStash for async workflows
- Cache/sessions: Upstash Redis

**Key Patterns in `/lib/`:**
- Service layer: API clients, business logic in separate files
- Error handling: Custom error classes in `errors.ts`, logger in `logger.ts`
- Validation: API validation schema in `api-validation.ts`
- Health checks: System health monitoring in `health-check.ts`
- CSV parsing: Contact import logic in `csv-parser.ts`
- Webhooks: Batch webhook handling in `batch-webhooks.ts`

### Directory Structure
```
smartzapv2/
├── app/                    # Next.js App Router
│   ├── api/               # Backend API routes
│   ├── (auth)/            # Auth pages (dynamic route group)
│   ├── (dashboard)/       # Dashboard pages (dynamic route group)
│   └── debug-auth/        # Debug utilities
├── components/            # React components (UI + features)
├── hooks/                 # Custom React hooks
├── lib/                   # Business logic, services, utilities
│   ├── ai/               # AI integration (Gemini, etc.)
│   ├── data/             # Data constants and schemas
│   ├── migrations/       # Database migration utilities
│   └── [services].ts     # Individual service files
├── supabase/             # Database migrations
├── docs/                 # Configuration guides
├── .aios-core/           # Synkra AIOS framework (L1-L2, protected)
└── .claude/              # Claude Code configuration
```

### Project-Specific Development Commands

<!-- AIOS-MANAGED-START: common-commands -->
## Common Commands

### AIOS Master Commands
- `*help` - Show available commands
- `*create-story` - Create new story
- `*task {name}` - Execute specific task
- `*workflow {name}` - Run workflow

### Development Commands

**Local Development:**
- `npm run dev` - Start Next.js dev server with Turbopack (http://localhost:3000)
- `npm run build` - Build for production
- `npm start` - Run production server (requires `npm run build` first)

**Testing:**
- `npm test` - Run Vitest unit tests (watch mode by default)
- `npm run test:ui` - Run tests with Vitest UI dashboard
- `npm run test:coverage` - Generate coverage report
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:e2e:ui` - Run E2E tests with UI
- `npm run test:e2e:headed` - Run E2E tests with visible browser
- `npm run test:e2e:report` - Show last test report
- `npm run test:all` - Run all tests (unit + E2E)

**Code Quality:**
- `npm run lint` - Run ESLint on codebase

**Database:**
- `npm run db:migrate` - Run Supabase migrations (see `scripts/migrate.mjs`)

### AIOS Master Commands
- `*help` - Show available commands
- `*create-story` - Create new story
- `*task {name}` - Execute specific task
- `*workflow {name}` - Run workflow
<!-- AIOS-MANAGED-END: common-commands -->

### Code Standards for SmartZap

**TypeScript/JavaScript:**
- Use strict TypeScript with full type coverage
- Prefer interfaces over types for object contracts
- Use `const` by default, only `let` when needed
- Extract magic strings/numbers to named constants
- Keep functions < 30 lines when possible

**React Components:**
- Functional components only (use hooks)
- Extract complex logic to custom hooks in `/hooks/`
- Use Shadcn/ui components for consistent UI
- Prop destructuring in function signature
- Example: `components/dashboard/MetricsCard.tsx`

**API Routes:**
- HTTP method guards: `if (req.method !== 'GET') return res.status(405).end()`
- Request validation using `api-validation.ts` schemas
- Error handling: Use custom error classes from `errors.ts`
- Response consistency: Always return `{ success, data, error }`

**Database:**
- Use Supabase client from `lib/db.ts`
- Run migrations before committing schema changes
- Use Row Level Security (RLS) for data protection
- Document complex queries with comments

**Testing:**
- Unit tests for utils, services, business logic in component directories
- E2E tests for critical user flows in `/e2e/` or inline
- Mock external APIs (Meta, Gemini) in tests
- Test error scenarios and edge cases

### Version Control

**Branch naming:**
- Feature: `feat/description`
- Fix: `fix/description`
- Chore: `chore/description`

**Commit messages (conventional):**
- `feat: add contact import from CSV [Story 1.2]`
- `fix: handle Meta API timeout gracefully`
- `docs: update configuration guide`
- `chore: update dependencies`

## Debugging

### Enable Debug Mode
```bash
export AIOS_DEBUG=true
```

### View Agent Logs
```bash
tail -f .aios/logs/agent.log
```

### SmartZap-Specific Debugging

**Debug authentication:**
- Visit `/debug-auth` to check session status (development only)
- Check logs in `/app/api/auth/` for auth flow issues

**Test Supabase connection:**
```bash
# Add to .env.local for verbose logging
SUPABASE_DEBUG=true
```

**Test Meta API integration:**
- Check webhook logs for incoming Meta callbacks
- Use `/api/webhook/info` to verify webhook configuration
- Test message sending: `/api/settings/test-contact`

**Monitor Upstash:**
- Redis: Check cache/session issues via Upstash console
- QStash: Monitor async workflows via Upstash dashboard

## Claude Code Specific Configuration

### Performance Optimization
- Prefer batched tool calls when possible for better performance
- Use parallel execution for independent operations
- Cache frequently accessed data in memory during sessions

### Tool Usage Guidelines
- Always use the Grep tool for searching, never `grep` or `rg` in bash
- Use the Task tool for complex multi-step operations
- Batch file reads/writes when processing multiple files
- Prefer editing existing files over creating new ones

### Session Management
- Track story progress throughout the session
- Update checkboxes immediately after completing tasks
- Maintain context of the current story being worked on
- Save important state before long-running operations

### Error Recovery
- Always provide recovery suggestions for failures
- Include error context in messages to user
- Suggest rollback procedures when appropriate
- Document any manual fixes required

### Testing Strategy
- Run tests incrementally during development
- Always verify lint and typecheck before marking complete
- Test edge cases for each new feature
- Document test scenarios in story files

### Documentation
- Update relevant docs when changing functionality
- Include code examples in documentation
- Keep README synchronized with actual behavior
- Document breaking changes prominently

---
*Synkra AIOS Claude Code Configuration v2.0*
