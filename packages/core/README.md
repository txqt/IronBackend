# @ironbackend/core

Backend architecture knowledge base for AI coding assistants.

[![npm version](https://img.shields.io/npm/v/@ironbackend/core)](https://www.npmjs.com/package/@ironbackend/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

## What's Inside

- **10 Architecture Styles** - Clean Monolith, Hexagonal, CQRS, Microservices, and more
- **4 Tech Stacks** - Node/NestJS, Java/Spring, .NET/ASP.NET Core, Python/FastAPI
- **50+ Design Rules** - API, domain, error handling, transactions, naming conventions
- **Security Playbooks** - Authentication strategies and security guidelines

## Installation

```bash
npm install @ironbackend/core
```

## Usage

```typescript
import { 
    getStyle, 
    getStack, 
    allRules,
    securityPlaybook 
} from '@ironbackend/core';

// Get an architecture style
const hexagonal = getStyle('hexagonal');
console.log(hexagonal.name);        // 'Hexagonal Architecture'
console.log(hexagonal.principles);  // ['Domain and application core...', ...]

// Get a tech stack
const nestjs = getStack('node-nestjs');
console.log(nestjs.framework);      // 'NestJS'
console.log(nestjs.conventions);    // Stack-specific conventions

// Access design rules
console.log(allRules.length);       // 50+ rules
const apiRules = allRules.filter(r => r.category === 'api');

// Security playbook
console.log(securityPlaybook.authStrategies);
```

## Architecture Styles

| ID | Name | Best For |
|----|------|----------|
| `clean-monolith` | Clean Monolith | Small teams, startups |
| `modular-monolith` | Modular Monolith | Growing teams, bounded contexts |
| `hexagonal` | Hexagonal | Test-driven development |
| `event-driven` | Event-Driven | High throughput |
| `cqrs` | CQRS | Read-heavy workloads |
| `microservices-sync` | Microservices (Sync) | Multiple teams |
| `microservices-async` | Microservices (Async) | Decoupled services |
| `serverless` | Serverless | Variable traffic |
| `read-heavy` | Read-Heavy API | Aggressive caching |
| `automation` | Automation/Bot | Scheduled jobs |

## Tech Stacks

| ID | Stack |
|----|-------|
| `node-nestjs` | Node.js + NestJS + PostgreSQL |
| `java-spring` | Java + Spring Boot + PostgreSQL |
| `dotnet-aspnetcore` | .NET + ASP.NET Core + SQL Server |
| `python-fastapi` | Python + FastAPI + PostgreSQL |

## API Reference

### Styles

```typescript
getStyle(id: string): ArchitectureStyle | undefined
getStyleIds(): string[]
findStyles(filter: Partial<ArchitectureStyle>): ArchitectureStyle[]
```

### Stacks

```typescript
getStack(id: string): TechStack | undefined
getStackIds(): string[]
findStacksByLanguage(language: string): TechStack[]
```

### Rules

```typescript
allRules: DesignRule[]
getRulesByCategory(category: string): DesignRule[]
getRule(id: string): DesignRule | undefined
getErrorRules(): DesignRule[]
getWarnRules(): DesignRule[]
```

## Related Packages

- [`ironbackend`](https://www.npmjs.com/package/ironbackend) - CLI tool
- [`@ironbackend/prompts`](https://www.npmjs.com/package/@ironbackend/prompts) - Prompt builders

## License

MIT
