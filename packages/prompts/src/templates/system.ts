/**
 * System Prompt Template
 * Main prompt that establishes the AI's role and context
 */

import type { ArchitectureStyle, TechStack } from '@ironbackend/core';
import { formatRulesForPrompt, getErrorRules } from '@ironbackend/core';
import { formatSecurityForPrompt } from '@ironbackend/core';
import { formatFolderStructure } from '../builders/prompt-builder.js';

export interface SystemPromptContext {
    style: ArchitectureStyle;
    stack: TechStack;
    includeRules?: boolean;
    includeSecurity?: boolean;
}

/**
 * Generate the main system prompt
 */
export function generateSystemPrompt(context: SystemPromptContext): string {
    const { style, stack, includeRules = true, includeSecurity = true } = context;

    const sections: string[] = [];

    // Header
    sections.push(`# IronBackend System Prompt

You are a senior backend engineer with 10+ years of experience in ${style.name} architecture.
Your expertise includes ${stack.language} with ${stack.framework}, and you follow strict design principles.

---`);

    // Architecture Context
    sections.push(`## Architecture: ${style.name}

${style.description}

### Core Principles
${style.corePrinciples.map((p, i) => `${i + 1}. ${p}`).join('\n')}

### Project Structure
\`\`\`
${formatFolderStructure(style.folderStructure)}
\`\`\`

### Anti-Patterns to Avoid
${style.commonPitfalls.map(p => `- ❌ ${p}`).join('\n')}

---`);

    // Tech Stack
    sections.push(`## Technology Stack

| Component | Choice |
|-----------|--------|
| Language | ${stack.language} ${stack.languageVersion} |
| Framework | ${stack.framework} ${stack.frameworkVersion} |
| Database | ${stack.database.type} with ${stack.database.orm} |
| Messaging | ${stack.messaging.provider} |
| Auth | ${stack.authentication} |
| Logging | ${stack.logging} |
| Testing | ${stack.testing.unit} (unit), ${stack.testing.integration} (integration) |

### Conventions
${stack.conventions.map(c => `- ${c}`).join('\n')}

---`);

    // AI Instructions
    sections.push(`## AI Behavior Instructions

${style.aiInstructions}

---`);

    // Rules
    if (includeRules) {
        const errorRules = getErrorRules();
        sections.push(`## Enforced Design Rules (ERROR severity = must follow)

${formatRulesForPrompt(errorRules)}

---`);
    }

    // Security
    if (includeSecurity) {
        sections.push(`## Security Requirements

${formatSecurityForPrompt()}

---`);
    }

    // Code Generation Guidelines
    sections.push(`## Code Generation Guidelines

When generating code, you MUST:
1. Follow the folder structure exactly as defined above
2. Apply all ERROR-severity rules without exception
3. Include proper error handling as per ERR-* rules
4. Add structured logging appropriate for the stack
5. Never skip input validation at API boundaries
6. Use the specified ORM and patterns for data access
7. Write tests for all public interfaces

When asked to create a new feature:
1. First, identify which layer(s) it belongs to
2. Create files in the correct locations
3. Define interfaces before implementations
4. Write unit tests alongside code
5. Add integration points last`);

    return sections.join('\n\n');
}

/**
 * Generate a minimal system prompt (for limited context windows)
 */
export function generateMinimalSystemPrompt(context: SystemPromptContext): string {
    const { style, stack } = context;

    return `# IronBackend v1.0

You are a ${style.name} architecture expert using ${stack.language}/${stack.framework}.

## Key Rules
- ${style.corePrinciples.slice(0, 3).join('\n- ')}

## Anti-Patterns
- ${style.commonPitfalls.slice(0, 3).join('\n- ')}

## Stack: ${stack.database.type} + ${stack.database.orm}, ${stack.messaging.provider}

${style.aiInstructions.split('\n').slice(0, 10).join('\n')}`;
}
