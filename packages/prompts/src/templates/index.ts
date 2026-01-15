/**
 * Prompt Templates Export
 */

export { generateSystemPrompt, generateMinimalSystemPrompt } from './system.js';
export type { SystemPromptContext } from './system.js';

export { generateStylePrompt, generateStyleComparisonPrompt } from './style-selection.js';

export { generateStackPrompt, generateStackCodeStyle, generateStackComparisonPrompt } from './stack-selection.js';

export {
    generateRuleEnforcementPrompt,
    generateCategoryEnforcementPrompt,
    generateCompactRulesPrompt,
    generateRuleExamplesPrompt
} from './rule-enforcement.js';
