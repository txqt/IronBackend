/**
 * @ironbackend/prompts
 * AI Prompt Templates for IronBackend
 */

// Templates
export {
    generateSystemPrompt,
    generateMinimalSystemPrompt,
    generateStylePrompt,
    generateStyleComparisonPrompt,
    generateStackPrompt,
    generateStackCodeStyle,
    generateStackComparisonPrompt,
    generateRuleEnforcementPrompt,
    generateCategoryEnforcementPrompt,
    generateCompactRulesPrompt,
    generateRuleExamplesPrompt
} from './templates/index.js';
export type { SystemPromptContext } from './templates/index.js';

// Builders
export {
    formatFolderStructure,
    formatFolderTree,
    buildPrompt,
    buildPromptSections,
    estimateTokenCount,
    truncatePrompt,
    buildContextFromConfig,
    buildContext,
    validateContext,
    getContextSummary,
    serializeContext,
    deserializeContext
} from './builders/index.js';
export type { PromptBuilderConfig, PromptContext } from './builders/index.js';

import { buildPrompt as _buildPrompt } from './builders/index.js';

/**
 * Quick prompt generation
 */
export function quickPrompt(styleId: string, stackId: string): string {
    return _buildPrompt({ styleId, stackId });
}

