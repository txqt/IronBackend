/**
 * Prompt Builder
 * Utilities for building and composing prompts
 */

import type { FolderNode, RuleCategory } from '@ironbackend/core';
import { getStyle, getStack } from '@ironbackend/core';
import { generateSystemPrompt, generateStylePrompt, generateStackPrompt, generateRuleEnforcementPrompt } from '../templates/index.js';

/**
 * Format folder structure for display in prompts
 */
export function formatFolderStructure(node: FolderNode, indent: number = 0): string {
    const prefix = '  '.repeat(indent);
    const icon = node.type === 'folder' ? '📁' : '📄';
    const desc = node.description ? ` # ${node.description}` : '';

    let result = `${prefix}${icon} ${node.name}${desc}`;

    if (node.children) {
        for (const child of node.children) {
            result += '\n' + formatFolderStructure(child, indent + 1);
        }
    }

    return result;
}

/**
 * Format folder structure as tree (without emojis)
 */
export function formatFolderTree(node: FolderNode, indent: number = 0, isLast: boolean = true): string {
    const prefix = indent === 0 ? '' : (isLast ? '└── ' : '├── ');
    const linePrefix = indent === 0 ? '' : '│   '.repeat(indent - 1) + prefix;

    let result = `${linePrefix}${node.name}/`;

    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            const childIsLast = i === node.children.length - 1;
            result += '\n' + formatFolderTree(child, indent + 1, childIsLast);
        }
    }

    return result;
}

export interface PromptBuilderConfig {
    styleId: string;
    stackId: string;
    ruleCategories?: RuleCategory[];
    includeRules?: boolean;
    includeSecurity?: boolean;
    compact?: boolean;
}

/**
 * Build a complete prompt from configuration
 */
export function buildPrompt(config: PromptBuilderConfig): string {
    const style = getStyle(config.styleId);
    const stack = getStack(config.stackId);

    if (!style || !stack) {
        throw new Error(`Invalid style (${config.styleId}) or stack (${config.stackId})`);
    }

    const sections: string[] = [];

    // System prompt
    sections.push(generateSystemPrompt({
        style,
        stack,
        includeRules: config.includeRules ?? true,
        includeSecurity: config.includeSecurity ?? true
    }));

    return sections.join('\n\n---\n\n');
}

/**
 * Build modular prompt sections (for composability)
 */
export function buildPromptSections(config: PromptBuilderConfig): Record<string, string> {
    const style = getStyle(config.styleId);
    const stack = getStack(config.stackId);

    if (!style || !stack) {
        throw new Error(`Invalid style (${config.styleId}) or stack (${config.stackId})`);
    }

    return {
        style: generateStylePrompt(style),
        stack: generateStackPrompt(stack),
        rules: generateRuleEnforcementPrompt(config.ruleCategories),
        combined: buildPrompt(config)
    };
}

/**
 * Count tokens (rough estimate)
 */
export function estimateTokenCount(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
}

/**
 * Truncate prompt to fit token limit
 */
export function truncatePrompt(prompt: string, maxTokens: number): string {
    const currentTokens = estimateTokenCount(prompt);

    if (currentTokens <= maxTokens) {
        return prompt;
    }

    // Calculate how many characters to keep
    const targetChars = maxTokens * 4;
    return prompt.slice(0, targetChars) + '\n\n[... truncated for token limit ...]';
}
