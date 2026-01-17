# Prompts Guide

IronBackend provides a collection of optimized system prompts (sometimes called "Rules" or "Context") designed to make Large Language Models (LLMs) understand your specific architecture.

## How it works

When you use the CLI to initialize a project:
```bash
ironbackend init
```
It generates a `.cursor/rules` directory in your project root.

## Included Prompts

### 1. Architecture Rules (`architecture.md`)
Defines the layers and boundaries of your chosen style (e.g., Modular Monolith).
-   **Enforces**: "Controllers must not import Repositories".
-   **Enforces**: "Domain entities must be pure TypeScript classes".

### 2. Tech Stack Rules (`stack.md`)
Specific best practices for your chosen framework (NestJS, Fastify, etc.).
-   **Example**: "Use Zod for all request validation".
-   **Example**: "Use Fastify plugins for cross-cutting concerns".

### 3. Testing Rules (`testing.md`)
Instructions for writing unit and integration tests using Vitest.

## Customizing Prompts

You can generate custom prompts using our interactive tool:
[**Launch Prompt Generator**](/tools/prompt-generator)
