/**
 * AI Tools Registry
 * Defines supported AI coding assistants and their configuration output paths
 */

export interface AIToolConfig {
    id: string;
    name: string;
    description: string;
    outputPath: string;
    /** File format: 'mdc' for Cursor rules, 'md' for standard markdown */
    format: 'mdc' | 'md';
    /** Globs pattern for file matching (used in some formats) */
    globs?: string[];
}

/**
 * All supported AI coding tools
 */
export const AI_TOOLS: AIToolConfig[] = [
    {
        id: 'claude',
        name: 'Claude Code',
        description: 'Anthropic Claude Code (CLI & IDE)',
        outputPath: 'CLAUDE.md',
        format: 'md'
    },
    {
        id: 'cursor',
        name: 'Cursor',
        description: 'Cursor IDE with .mdc rules',
        outputPath: '.cursor/rules/ironbackend.mdc',
        format: 'mdc',
        globs: ['**/*.ts', '**/*.js', '**/*.py', '**/*.java', '**/*.cs', '**/*.go']
    },
    {
        id: 'windsurf',
        name: 'Windsurf',
        description: 'Codeium Windsurf IDE',
        outputPath: '.windsurfrules',
        format: 'md'
    },
    {
        id: 'antigravity',
        name: 'Antigravity',
        description: 'Google Antigravity coding assistant',
        outputPath: '.gemini/settings/prompts.md',
        format: 'md'
    },
    {
        id: 'copilot',
        name: 'GitHub Copilot',
        description: 'GitHub Copilot with custom instructions',
        outputPath: '.github/copilot-instructions.md',
        format: 'md'
    },
    {
        id: 'kiro',
        name: 'Kiro',
        description: 'AWS Kiro IDE',
        outputPath: '.kiro/rules.md',
        format: 'md'
    },
    {
        id: 'codex',
        name: 'Codex',
        description: 'OpenAI Codex CLI',
        outputPath: 'AGENTS.md',
        format: 'md'
    },
    {
        id: 'gemini',
        name: 'Gemini CLI',
        description: 'Google Gemini CLI',
        outputPath: 'GEMINI.md',
        format: 'md'
    },
    {
        id: 'trae',
        name: 'Trae',
        description: 'Trae AI IDE',
        outputPath: '.trae/rules.md',
        format: 'md'
    }
];

/**
 * Get AI tool by ID
 */
export function getAITool(id: string): AIToolConfig | undefined {
    return AI_TOOLS.find(tool => tool.id === id);
}

/**
 * Get all AI tool IDs
 */
export function getAIToolIds(): string[] {
    return AI_TOOLS.map(tool => tool.id);
}

/**
 * Generate content for specific AI tool format
 */
export function formatForAITool(tool: AIToolConfig, content: string): string {
    if (tool.format === 'mdc') {
        // Cursor MDC format with frontmatter
        const globs = tool.globs || ['**/*'];
        return `---
description: IronBackend - Backend Architecture Intelligence
globs: ${JSON.stringify(globs)}
---

${content}`;
    }

    // Standard markdown format
    return content;
}
