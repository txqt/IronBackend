/**
 * Style Selection Prompt Template
 * Prompt for when an architecture style is selected
 */

import type { ArchitectureStyle } from '@ironbackend/core';
import { formatFolderStructure } from '../builders/prompt-builder.js';

/**
 * Generate a style-specific prompt section
 */
export function generateStylePrompt(style: ArchitectureStyle): string {
    return `# Architecture Style: ${style.name}

## Description
${style.description}

## When to Use This Style
${style.whenToUse.map(w => `✅ ${w}`).join('\n')}

## When NOT to Use This Style
${style.whenNotToUse.map(w => `❌ ${w}`).join('\n')}

## Core Principles
${style.corePrinciples.map((p, i) => `${i + 1}. ${p}`).join('\n')}

## Project Structure
Every file you create MUST follow this structure:

\`\`\`
${formatFolderStructure(style.folderStructure)}
\`\`\`

## AI Behavior Instructions

${style.aiInstructions}

## Violations to Flag

If you generate or see code with these patterns, flag them as violations:
${style.commonPitfalls.map(p => `⚠️ ${p}`).join('\n')}

## Decision Making

When asked where to put new code:
1. Identify the layer based on responsibilities
2. Check the folder structure above
3. Place code in the appropriate directory
4. Create new folders only if they fit the pattern`;
}

/**
 * Generate a comparison prompt for style selection
 */
export function generateStyleComparisonPrompt(styles: ArchitectureStyle[]): string {
    const header = `# Architecture Style Selection Guide

Choose the right style based on your project needs:

`;

    const comparisons = styles.map(style => `
## ${style.name}
**Best for:** ${style.whenToUse.slice(0, 2).join(', ')}
**Avoid when:** ${style.whenNotToUse.slice(0, 2).join(', ')}
**Complexity:** ${getStyleComplexity(style)}
`).join('\n');

    return header + comparisons;
}

function getStyleComplexity(style: ArchitectureStyle): string {
    const simpleStyles = ['clean-monolith', 'serverless', 'automation'];
    const complexStyles = ['hexagonal', 'event-driven', 'cqrs', 'microservices-async'];

    if (simpleStyles.includes(style.id)) return '🟢 Low';
    if (complexStyles.includes(style.id)) return '🔴 High';
    return '🟡 Medium';
}
