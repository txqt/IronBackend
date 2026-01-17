# Getting Started

Welcome to **IronBackend**, the open-source backend architecture intelligence for AI coding assistants.

## What is IronBackend?

IronBackend helps you and your AI assistant (Cursor, GitHub Copilot, Claude) write **production-grade** backend code. It provides:

-   **Standardized Architectures**: Clean, Hexagonal, Modular Monolith.
-   **AI Context Rules**: `.cursor/rules` files that teach LLMs your project structure.
-   **Validation**: Built-in Zod schemas and security playbooks.

## Installation

You can use the CLI to scaffold a new project or add IronBackend to an existing code base.

```bash
# Install globally
npm install -g ironbackend

# Or use npx
npx ironbackend init
```

## Quick Start

1.  **Initialize a Project**
    Run the init command to start the interactive wizard:
    ```bash
    ironbackend init my-project
    ```
    You will be asked to choose:
    -   **Style**: Layered Monolith, Modular Monolith, or Microservices.
    -   **Stack**: Express, NestJS, or Fastify.
    -   **AI Assistant**: Cursor, VS Code (Copilot), or Windsurf.

2.  **Verify Configuration**
    Ensure your project is correctly set up and prompts are generated:
    ```bash
    ironbackend doctor
    ```

3.  **Start Coding with AI**
    Open the project in Cursor. The `.cursor/rules` folder contains specific instructions for the AI.
    -   Ask: *"Create a new user registration endpoint."*
    -   The AI will follow the Architecture Rules defined in `.cursor/rules/ironbackend.mdc`.
