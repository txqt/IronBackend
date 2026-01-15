# @ironbackend/cli

Backend Architecture Intelligence CLI for AI Coding Assistants.

[![npm version](https://img.shields.io/npm/v/@ironbackend/cli)](https://www.npmjs.com/package/@ironbackend/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

## What is IronBackend?

A senior backend architect embedded inside your AI, installable via npm. IronBackend injects production-grade architectural knowledge into AI coding assistants like **Cursor**, **Claude**, **GitHub Copilot**, and more.

## Installation

```bash
# Install globally
npm install -g ironbackend

# Or use with npx
npx ironbackend init cursor
```

## Quick Start

```bash
# Initialize for your AI tool
ironbackend init cursor       # Cursor IDE
ironbackend init claude       # Claude Code
ironbackend init copilot      # GitHub Copilot
ironbackend init antigravity  # Antigravity

# Interactive mode
ironbackend init

# With pre-selected style and stack
ironbackend init cursor --style hexagonal --stack node-nestjs
```

## Commands

| Command | Description |
|---------|-------------|
| `init <tool>` | Initialize for AI tool (cursor, claude, copilot, etc.) |
| `init` | Interactive tool selection |
| `select style <id>` | Select architecture style |
| `select stack <id>` | Select tech stack |
| `export prompts` | Export AI prompts |
| `doctor` | Validate setup |
| `list` | List available styles & stacks |
| `info` | Show current configuration |

## Supported AI Tools

| Tool | Output Path |
|------|-------------|
| Claude Code | `CLAUDE.md` |
| Cursor IDE | `.cursor/rules/ironbackend.mdc` |
| Windsurf | `.windsurfrules` |
| Antigravity | `.gemini/settings/prompts.md` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Kiro | `.kiro/rules.md` |
| Codex | `AGENTS.md` |
| Gemini CLI | `GEMINI.md` |
| Trae | `.trae/rules.md` |

## Architecture Styles

- **Clean Monolith** - Small teams, startups
- **Modular Monolith** - Growing teams, bounded contexts
- **Hexagonal** - Test-driven development
- **Event-Driven** - High throughput
- **CQRS** - Read-heavy workloads
- **Microservices (Sync/Async)** - Multiple teams
- **Serverless** - Variable traffic
- **Read-Heavy API** - Aggressive caching
- **Automation/Bot** - Scheduled jobs

## Tech Stacks

- Node.js + NestJS + PostgreSQL
- Java + Spring Boot + PostgreSQL
- .NET + ASP.NET Core + SQL Server
- Python + FastAPI + PostgreSQL

## Example

After running `ironbackend init cursor --style hexagonal --stack node-nestjs`:

Your AI assistant receives context like:

```markdown
# IronBackend System Prompt

You are a senior backend engineer with 10+ years of experience 
in Hexagonal Architecture using Node.js/NestJS.

## Core Principles
1. Domain and application core have no external dependencies
2. Ports define what the application needs or provides
3. Adapters implement ports for specific technologies

## Enforced Rules
[ERROR] API-001: All endpoints must have explicit schemas
[ERROR] DOM-005: Domain logic must not depend on framework code
```

## Related Packages

- [`@ironbackend/core`](https://www.npmjs.com/package/@ironbackend/core) - Knowledge base
- [`@ironbackend/prompts`](https://www.npmjs.com/package/@ironbackend/prompts) - Prompt builders

## License

MIT
