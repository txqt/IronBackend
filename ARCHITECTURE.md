# IronBackend Architecture

## Overview

IronBackend is a **prompt injection knowledge base** distributed as npm packages. It transforms architectural knowledge into AI-consumable prompts.

```
┌─────────────────────────────────────────────────────────┐
│                    User's AI Tool                       │
│  (Cursor, Claude, Copilot, etc.)                        │
└───────────────────────┬─────────────────────────────────┘
                        │ reads
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Generated Prompt Files                      │
│  (.cursor/rules/*, CLAUDE.md, copilot-instructions.md)  │
└───────────────────────┬─────────────────────────────────┘
                        │ exports
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   ironbackend CLI                        │
│  (init, select, export, doctor, list)                   │
└───────────────────────┬─────────────────────────────────┘
                        │ uses
            ┌───────────┴───────────┐
            ▼                       ▼
┌───────────────────┐   ┌───────────────────────┐
│ @ironbackend/core │   │ @ironbackend/prompts  │
│ (Knowledge Base)  │   │ (Prompt Building)     │
└───────────────────┘   └───────────────────────┘
```

---

## Package Structure

### @ironbackend/core

The knowledge database. Contains no business logic, only structured data.

```
packages/core/
├── src/
│   ├── styles/          # 10 architecture styles
│   │   ├── clean-monolith.ts
│   │   ├── hexagonal.ts
│   │   └── ...
│   ├── stacks/          # 4 tech stack presets
│   │   ├── node-nestjs.ts
│   │   └── ...
│   ├── rules/           # 50+ design rules
│   │   ├── api.ts
│   │   ├── domain.ts
│   │   └── ...
│   ├── security/        # Security playbooks
│   └── types.ts         # TypeScript interfaces
└── package.json
```

**Key exports:**
- `getStyle(id)` / `getStyleIds()` - Architecture styles
- `getStack(id)` / `getStackIds()` - Tech stacks  
- `allRules` / `getRulesByCategory()` - Design rules
- `securityPlaybook` - Security guidelines

### @ironbackend/prompts

Transforms core data into AI-readable prompts.

```
packages/prompts/
├── src/
│   ├── builders/
│   │   ├── system-prompt.ts   # Main prompt builder
│   │   └── context-builder.ts
│   ├── templates/
│   │   └── style-selection.ts
│   └── formatters/
│       └── rule-formatter.ts
└── package.json
```

**Key function:**
```typescript
buildSystemPrompt({ style, stack, rules }) → string
```

### ironbackend (CLI)

User-facing entry point. Commands:

| Command | Action |
|---------|--------|
| `init <tool>` | Setup for AI tool (cursor, claude, etc.) |
| `select style <id>` | Choose architecture style |
| `select stack <id>` | Choose tech stack |
| `export prompts` | Generate prompt files |
| `doctor` | Validate configuration |
| `list` | Show available options |

---

## Data Flow

```
1. User runs: ironbackend init cursor --style hexagonal --stack node-nestjs

2. CLI reads:
   - style: core.getStyle('hexagonal')
   - stack: core.getStack('node-nestjs')
   - rules: core.allRules

3. CLI calls: prompts.buildSystemPrompt({ style, stack, rules })

4. CLI writes: .cursor/rules/ironbackend.mdc
```

---

## Design Decisions

### Why separate core and prompts?

- **core** = Pure data, no formatting logic
- **prompts** = AI-specific formatting, can evolve independently
- Users can consume `@ironbackend/core` directly for custom integrations

### Why static data, not API?

- Zero runtime dependencies
- Works offline
- No secrets or auth needed
- Version-locked with npm

### Why monorepo?

- Shared TypeScript config
- Atomic versioning
- Simplified local development
- Single CI/CD pipeline

---

## Extension Points

### Adding a new architecture style

1. Create `packages/core/src/styles/my-style.ts`
2. Export from `packages/core/src/styles/index.ts`
3. Add to `packages/prompts/src/templates/style-selection.ts`

### Adding a new AI tool integration

1. Add to `AI_TOOLS` map in `packages/cli/src/ai-tools.ts`
2. Define output path and format

### Adding new design rules

1. Create/update file in `packages/core/src/rules/`
2. Follow `DesignRule` interface from `types.ts`
