/**
 * IronBackend Architecture Styles
 * Export all architecture style definitions
 */

import { cleanMonolith } from './clean-monolith.js';
import { modularMonolith } from './modular-monolith.js';
import { hexagonal } from './hexagonal.js';
import { eventDriven, cqrs } from './event-driven.js';
import { microservicesSync, microservicesAsync } from './microservices.js';
import { serverless, readHeavy, automation } from './specialized.js';
import type { ArchitectureStyle } from '../types.js';
import { memoize } from '../utils/performance.js';

/**
 * All available architecture styles
 */
export const styles: Record<string, ArchitectureStyle> = {
    'clean-monolith': cleanMonolith,
    'modular-monolith': modularMonolith,
    'hexagonal': hexagonal,
    'event-driven': eventDriven,
    'cqrs': cqrs,
    'microservices-sync': microservicesSync,
    'microservices-async': microservicesAsync,
    'serverless': serverless,
    'read-heavy': readHeavy,
    'automation': automation,
};

/**
 * Get a style by ID (memoized for performance)
 */
export const getStyle = memoize((id: string): ArchitectureStyle | undefined => {
    return styles[id];
});

/**
 * Get all style IDs
 */
export function getStyleIds(): string[] {
    return Object.keys(styles);
}

/**
 * Find styles matching criteria
 */
export function findStyles(criteria: {
    teamSize?: 'small' | 'medium' | 'large';
    complexity?: 'low' | 'medium' | 'high';
    scalability?: 'single' | 'horizontal';
}): ArchitectureStyle[] {
    // Simple heuristic-based filtering
    return Object.values(styles).filter(style => {
        if (criteria.teamSize === 'small') {
            return ['clean-monolith', 'serverless', 'automation'].includes(style.id);
        }
        if (criteria.teamSize === 'large') {
            return ['modular-monolith', 'microservices-sync', 'microservices-async'].includes(style.id);
        }
        if (criteria.complexity === 'low') {
            return ['clean-monolith', 'serverless'].includes(style.id);
        }
        if (criteria.complexity === 'high') {
            return ['hexagonal', 'event-driven', 'cqrs'].includes(style.id);
        }
        return true;
    });
}

// Re-export individual styles
export {
    cleanMonolith,
    modularMonolith,
    hexagonal,
    eventDriven,
    cqrs,
    microservicesSync,
    microservicesAsync,
    serverless,
    readHeavy,
    automation,
};
