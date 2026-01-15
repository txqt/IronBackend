/**
 * Rule Enforcement Prompt Template
 * Prompts for enforcing design rules
 */

import type { DesignRule, RuleCategory } from '@ironbackend/core';
import { rulesByCategory, formatRulesForPrompt, getErrorRules } from '@ironbackend/core';

/**
 * Generate rule enforcement prompt
 */
export function generateRuleEnforcementPrompt(
    categories: RuleCategory[] = ['API', 'DOMAIN', 'ERROR_HANDLING', 'DATA_ACCESS']
): string {
    const sections: string[] = [];

    sections.push(`# Design Rules Enforcement

## Severity Levels

- **ERROR**: MUST be followed. Reject code that violates these rules.
- **WARN**: SHOULD be followed. Recommend but allow exceptions with justification.

---`);

    // Add rules by category
    for (const category of categories) {
        const rules = rulesByCategory[category];
        if (rules && rules.length > 0) {
            sections.push(`## ${formatCategoryName(category)} Rules

${formatRulesForPrompt(rules)}
`);
        }
    }

    // Add validation checklist
    sections.push(`---

## Validation Checklist

Before completing any code generation, verify:

- [ ] All ERROR-severity rules are satisfied
- [ ] WARN-severity rules are considered (document exceptions)
- [ ] No anti-patterns present
- [ ] Proper error handling implemented
- [ ] Input validation at boundaries
- [ ] Logging included for observability
- [ ] Tests cover the new code`);

    return sections.join('\n\n');
}

/**
 * Generate a focused enforcement prompt for specific categories
 */
export function generateCategoryEnforcementPrompt(category: RuleCategory): string {
    const rules = rulesByCategory[category] || [];
    const errorRules = rules.filter(r => r.severity === 'ERROR');
    const warnRules = rules.filter(r => r.severity === 'WARN');

    return `# ${formatCategoryName(category)} Rules

## MUST Follow (ERROR severity)

${errorRules.map(r => `### ${r.id}: ${r.rule}
${r.rationale ? `*Rationale: ${r.rationale}*` : ''}`).join('\n\n')}

## SHOULD Follow (WARN severity)

${warnRules.map(r => `### ${r.id}: ${r.rule}
${r.rationale ? `*Rationale: ${r.rationale}*` : ''}`).join('\n\n')}`;
}

/**
 * Generate a compact rules summary for limited context
 */
export function generateCompactRulesPrompt(): string {
    const errorRules = getErrorRules();

    return `# Critical Design Rules (Must Follow)

${errorRules.map(r => `- ${r.id}: ${r.rule}`).join('\n')}`;
}

/**
 * Generate rule violation examples
 */
export function generateRuleExamplesPrompt(rules: DesignRule[]): string {
    const sections = rules.map(rule => {
        if (!rule.examples || rule.examples.length === 0) {
            return '';
        }

        const bad = rule.examples.filter(e => e.type === 'bad');
        const good = rule.examples.filter(e => e.type === 'good');

        return `## ${rule.id}: ${rule.rule}

${bad.length > 0 ? `### ❌ Bad
\`\`\`
${bad[0].code}
\`\`\`
${bad[0].explanation ? `*${bad[0].explanation}*` : ''}
` : ''}
${good.length > 0 ? `### ✅ Good
\`\`\`
${good[0].code}
\`\`\`
${good[0].explanation ? `*${good[0].explanation}*` : ''}` : ''}`;
    }).filter(s => s.length > 0);

    return `# Rule Examples

${sections.join('\n\n')}`;
}

function formatCategoryName(category: RuleCategory): string {
    const names: Record<RuleCategory, string> = {
        'API': 'API Design',
        'DOMAIN': 'Domain Modeling',
        'ERROR_HANDLING': 'Error Handling',
        'TRANSACTIONS': 'Transaction',
        'DATA_ACCESS': 'Data Access',
        'NAMING': 'Naming Convention',
        'VALIDATION': 'Validation',
        'ASYNC': 'Async/Concurrency'
    };
    return names[category] || category;
}
