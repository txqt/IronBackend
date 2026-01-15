/**
 * Context Builder
 * Build context objects for prompt generation
 */

import type { ArchitectureStyle, TechStack, RuleCategory, IronBackendConfig } from '@ironbackend/core';
import { getStyle, getStack } from '@ironbackend/core';

export interface PromptContext {
    style: ArchitectureStyle | null;
    stack: TechStack | null;
    enabledRules: RuleCategory[];
    securityEnabled: boolean;
    metadata: Record<string, unknown>;
}

/**
 * Build context from IronBackend config file
 */
export function buildContextFromConfig(config: IronBackendConfig): PromptContext {
    return {
        style: config.style ? getStyle(config.style) ?? null : null,
        stack: config.stack ? getStack(config.stack) ?? null : null,
        enabledRules: config.rules.enabled,
        securityEnabled: true,
        metadata: {}
    };
}

/**
 * Build context interactively
 */
export function buildContext(options: {
    styleId?: string;
    stackId?: string;
    ruleCategories?: RuleCategory[];
}): PromptContext {
    const allCategories: RuleCategory[] = [
        'API', 'DOMAIN', 'ERROR_HANDLING', 'TRANSACTIONS',
        'DATA_ACCESS', 'NAMING', 'VALIDATION', 'ASYNC'
    ];

    return {
        style: options.styleId ? getStyle(options.styleId) ?? null : null,
        stack: options.stackId ? getStack(options.stackId) ?? null : null,
        enabledRules: options.ruleCategories ?? allCategories,
        securityEnabled: true,
        metadata: {}
    };
}

/**
 * Validate context completeness
 */
export function validateContext(context: PromptContext): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!context.style) {
        errors.push('No architecture style selected');
    }

    if (!context.stack) {
        errors.push('No tech stack selected');
    }

    if (context.enabledRules.length === 0) {
        errors.push('No rule categories enabled');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Get context summary for display
 */
export function getContextSummary(context: PromptContext): string {
    const lines: string[] = [];

    if (context.style) {
        lines.push(`Style: ${context.style.name}`);
    }

    if (context.stack) {
        lines.push(`Stack: ${context.stack.name}`);
    }

    lines.push(`Rules: ${context.enabledRules.length} categories enabled`);
    lines.push(`Security: ${context.securityEnabled ? 'enabled' : 'disabled'}`);

    return lines.join('\n');
}

/**
 * Serialize context for storage
 */
export function serializeContext(context: PromptContext): string {
    return JSON.stringify({
        styleId: context.style?.id,
        stackId: context.stack?.id,
        enabledRules: context.enabledRules,
        securityEnabled: context.securityEnabled,
        metadata: context.metadata
    }, null, 2);
}

/**
 * Deserialize context from storage
 */
export function deserializeContext(json: string): PromptContext {
    const data = JSON.parse(json);

    return {
        style: data.styleId ? getStyle(data.styleId) ?? null : null,
        stack: data.stackId ? getStack(data.stackId) ?? null : null,
        enabledRules: data.enabledRules ?? [],
        securityEnabled: data.securityEnabled ?? true,
        metadata: data.metadata ?? {}
    };
}
