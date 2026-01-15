# Getting Started with IronBackend

This guide walks you through setting up IronBackend in your project and integrating it with your AI coding assistant.

## Prerequisites

- Node.js 18 or later
- npm, pnpm, or yarn
- An AI coding assistant (Cursor, Claude, Copilot, etc.)

## Installation

### Global Installation (Recommended)

```bash
npm install -g ironbackend
```

### Per-Project Installation

```bash
npm install -D ironbackend
```

### Using npx (No Installation)

```bash
npx ironbackend init
```

## Step 1: Initialize

Navigate to your project directory and run:

```bash
ironbackend init
```

This creates:
- `.ironbackend/` directory with configuration
- `.ironbackend/config.json` with your settings
- `.ironbackend/prompts/` with generated AI prompts
- `.cursor/rules/ironbackend.mdc` for Cursor integration

### Interactive Mode

The init command will ask you to:
1. **Select an architecture style** - Choose based on your project needs
2. **Select a tech stack** - Match your language and framework

### Non-Interactive Mode

```bash
ironbackend init --yes --style clean-monolith --stack node-nestjs
```

## Step 2: Choose Your Style

If you skipped style selection during init:

```bash
# List all available styles
ironbackend list --styles

# Select a style
ironbackend select style hexagonal
```

### Style Quick Reference

| Style | Team Size | Complexity | Best For |
|-------|-----------|------------|----------|
| clean-monolith | Small | Low | Startups, MVPs |
| modular-monolith | Medium | Medium | Growing teams |
| hexagonal | Medium+ | High | Long-term projects |
| microservices-sync | Large | High | Multiple teams |

## Step 3: Choose Your Stack

```bash
# List all available stacks
ironbackend list --stacks

# Select a stack
ironbackend select stack python-fastapi
```

## Step 4: Export Prompts

```bash
# Generate all prompt formats
ironbackend export prompts
```

This creates:
- `system-prompt.md` - Complete system prompt
- `cursor-rules.mdc` - Cursor-formatted rules
- `claude-project.md` - Claude project format
- `copilot-instructions.md` - GitHub Copilot format

## Step 5: Configure Your AI Assistant

### Cursor

**Automatic!** IronBackend creates `.cursor/rules/ironbackend.mdc` which Cursor loads automatically.

### Claude (Web/Desktop)

1. Open Claude
2. Create a new Project
3. Go to Project Settings → Custom Instructions
4. Paste contents of `.ironbackend/prompts/claude-project.md`

### GitHub Copilot

1. Create `.github/copilot-instructions.md` in your repo
2. Copy contents from `.ironbackend/prompts/copilot-instructions.md`

### ChatGPT / Other

Start your conversation with the contents of `system-prompt.md`.

## Step 6: Validate

Check that everything is set up correctly:

```bash
ironbackend doctor
```

This verifies:
- Configuration exists and is valid
- Style and stack are properly selected
- Prompts are generated and up to date
- Cursor integration is configured

## Using with Your AI

Once configured, your AI assistant understands:

1. **Your architecture style** - It knows the folder structure and principles
2. **Your tech stack** - It uses the right patterns and conventions
3. **Design rules** - It enforces rules like "no business logic in controllers"
4. **Security practices** - It applies proper auth, validation, error handling

### Example Prompts

```
# Good prompts that work with IronBackend context

"Create a new user service with CRUD operations"
→ AI creates files in the correct folders, uses proper patterns

"Add an endpoint for listing orders with pagination"
→ AI uses your stack's conventions, follows API rules

"Implement retry logic for the payment gateway"
→ AI applies your security playbook's retry strategy
```

## Updating

When you change your style or stack:

```bash
ironbackend select style event-driven
ironbackend export prompts
```

Your AI prompts are automatically regenerated!

## Next Steps

- Read about [Architecture Styles](./styles/README.md)
- Explore [Tech Stack Details](./stacks/README.md)
- Review [Design Rules](./rules/README.md)
- Learn about [Customization](./customization.md)
