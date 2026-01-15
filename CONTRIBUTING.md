# Contributing to IronBackend

Thank you for your interest in contributing to IronBackend! 🎉

## Ways to Contribute

### 🏗️ Architecture Styles
Add new backend architecture patterns:
- Create file in `packages/core/src/styles/`
- Include: name, description, principles, folder structure, anti-patterns
- Register in `packages/core/src/styles/index.ts`

### 🛠️ Tech Stacks
Add support for new technology stacks:
- Create file in `packages/core/src/stacks/`
- Include: language, framework, ORM, testing, messaging conventions
- Register in `packages/core/src/stacks/index.ts`

### 📏 Design Rules
Add enforceable design rules:
- Add to appropriate category in `packages/core/src/rules/`
- Include: code, severity (ERROR/WARN), description, examples

### 🤖 AI Tool Support
Add support for new AI coding assistants:
- Add tool config to `packages/cli/src/ai-tools.ts`
- Include: id, name, output path, format

## Development Setup

```bash
# Clone repository
git clone https://github.com/ironbackend/ironbackend.git
cd ironbackend

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Link CLI for local testing
cd packages/cli && npm link
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`pnpm test`)
5. Commit with clear message (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Code Style

- TypeScript for all packages
- Use Prettier for formatting
- Keep prompt content concise (LLM context limits)
- Follow existing patterns in codebase

## Questions?

Open an issue or start a discussion on GitHub.

---

**Thank you for helping make AI backend development better!** 🚀
