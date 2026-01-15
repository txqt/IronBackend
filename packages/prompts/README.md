# @ironbackend/prompts

AI prompt builders for IronBackend architecture knowledge.

[![npm version](https://img.shields.io/npm/v/@ironbackend/prompts)](https://www.npmjs.com/package/@ironbackend/prompts)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

## What's Inside

Transform architecture knowledge from `@ironbackend/core` into AI-consumable prompts.

- **System Prompt Builder** - Generate complete system prompts for AI assistants
- **Context Builder** - Build context-aware prompts with style + stack + rules
- **Rule Formatter** - Format design rules for LLM consumption

## Installation

```bash
npm install @ironbackend/prompts @ironbackend/core
```

## Usage

```typescript
import { buildSystemPrompt } from '@ironbackend/prompts';
import { getStyle, getStack, allRules } from '@ironbackend/core';

// Build a complete system prompt
const prompt = buildSystemPrompt({
    style: getStyle('hexagonal'),
    stack: getStack('node-nestjs'),
    rules: allRules,
});

console.log(prompt);
// Output:
// # IronBackend System Prompt
//
// You are a senior backend engineer with 10+ years of experience
// in Hexagonal Architecture using Node.js/NestJS.
//
// ## Core Principles
// 1. Domain and application core have no external dependencies
// 2. Ports define what the application needs or provides
// ...
```

## API Reference

### buildSystemPrompt

```typescript
interface BuildSystemPromptOptions {
    style: ArchitectureStyle;
    stack: TechStack;
    rules: DesignRule[];
    includeSecurityPlaybook?: boolean;
}

function buildSystemPrompt(options: BuildSystemPromptOptions): string;
```

### buildContext

```typescript
interface BuildContextOptions {
    style?: ArchitectureStyle;
    stack?: TechStack;
    rules?: DesignRule[];
}

function buildContext(options: BuildContextOptions): string;
```

### formatRulesForPrompt

```typescript
function formatRulesForPrompt(rules: DesignRule[]): string;
```

## Example Output

The generated prompt includes:

1. **Role Definition** - Senior engineer persona with chosen style/stack
2. **Core Principles** - Architecture fundamentals
3. **Folder Structure** - Recommended project layout
4. **Enforced Rules** - Design rules with severity levels
5. **Code Generation Guidelines** - Best practices for the AI

```markdown
# IronBackend System Prompt

You are a senior backend engineer specializing in 
Hexagonal Architecture with Node.js/NestJS.

## Enforced Rules
[ERROR] API-001: All endpoints must have explicit request/response schemas
[ERROR] DOM-005: Domain logic must not depend on framework code
[WARN] ERR-003: Log errors with correlation IDs

## When Generating Code
- Controllers handle HTTP only, delegate to services
- All external dependencies injected via interfaces
- Include proper error handling per ERR-* rules
```

## Related Packages

- [`ironbackend`](https://www.npmjs.com/package/ironbackend) - CLI tool
- [`@ironbackend/core`](https://www.npmjs.com/package/@ironbackend/core) - Knowledge base

## License

MIT
