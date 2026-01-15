# Example GitHub Copilot Setup

This directory contains example configurations for using IronBackend with GitHub Copilot.

## Setup Steps

1. Run `ironbackend export prompts` to generate Copilot instructions
2. Copy `.ironbackend/prompts/copilot-instructions.md` to `.github/copilot-instructions.md`
3. Commit the file to your repository
4. Copilot will now use these instructions for suggestions

## Sample Copilot Instructions

```markdown
# GitHub Copilot Custom Instructions

## Architecture: Modular Monolith
## Stack: Node.js + NestJS + PostgreSQL

This project follows a Modular Monolith architecture with NestJS.

## Module Boundaries
- Never import from module internals, only from module/index.ts
- Each module has its own database schema/tables
- Use events for cross-module notifications

## Project Structure
```
src/
├── modules/
│   ├── users/
│   │   ├── api/
│   │   ├── application/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   └── index.ts        # Public API
│   └── orders/
│       └── ...
├── shared-kernel/
└── bootstrap/
```

## Coding Conventions
- Use NestJS modules for feature boundaries
- DTOs with class-validator decorators
- Repositories as providers
- Custom exceptions extending HttpException

## Design Rules to Follow

### API Design
- All endpoints must have explicit request/response schemas
- Use plural nouns for resource collections (/users, not /user)
- Version APIs in URL path (/v1/users)
- Pagination required for list endpoints

### Error Handling
- Use typed exceptions, not generic Error class
- Never expose stack traces in production
- Log all errors with correlation ID

### Data Access
- Repositories return domain entities, not database records
- No raw SQL outside repository layer
- No N+1 queries
```

## How Copilot Uses This

1. Copilot reads `.github/copilot-instructions.md` from your repo
2. These instructions influence code suggestions
3. Suggestions follow your architecture and conventions
4. Works in VS Code, JetBrains IDEs, and GitHub.com

## Tips

1. **Keep it concise** - Copilot has limited context
2. **Focus on patterns** - Show the structure, not tutorials
3. **Include examples** - Short code snippets help
4. **Update as needed** - Regenerate when architecture changes
