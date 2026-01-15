/**
 * @ironbackend/core
 * Backend Architecture Intelligence for AI Coding Assistants
 * 
 * This package provides:
 * - Architecture style definitions
 * - Tech stack presets
 * - Design rules database
 * - Security & reliability playbooks
 */

// Types
export * from './types.js';

// Architecture Styles
export * as styles from './styles/index.js';
export {
    getStyle,
    getStyleIds,
    findStyles,
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
} from './styles/index.js';

// Tech Stacks
export * as stacks from './stacks/index.js';
export {
    getStack,
    getStackIds,
    findStacksByLanguage,
    nodeNestjs,
    javaSpring,
    dotnetAspnetcore,
    pythonFastapi,
} from './stacks/index.js';

// Design Rules
export * as rules from './rules/index.js';
export {
    allRules,
    rulesByCategory,
    getRulesByCategory,
    getRule,
    getErrorRules,
    getWarnRules,
    formatRulesForPrompt,
    apiRules,
    domainRules,
    errorHandlingRules,
    transactionRules,
    dataAccessRules,
    namingRules,
    validationRules,
    asyncRules,
} from './rules/index.js';

// Security
export * as security from './security/index.js';
export {
    securityPlaybook,
    authStrategies,
    getAuthStrategy,
    formatSecurityForPrompt,
} from './security/index.js';

import { createRequire } from 'module';

/**
 * IronBackend version - dynamically read from package.json
 */
const getVersion = (): string => {
    try {
        const require = createRequire(import.meta.url);
        const pkg = require('../package.json');
        return pkg.version;
    } catch {
        // Fallback for edge cases
        return '1.0.0';
    }
};

export const VERSION = getVersion();

import * as _styles from './styles/index.js';
import * as _stacks from './stacks/index.js';
import * as _rules from './rules/index.js';
import * as _security from './security/index.js';

/**
 * Quick access to all data
 */
export function getAllData() {
    return {
        styles: _styles.styles,
        stacks: _stacks.stacks,
        rules: _rules.allRules,
        security: _security.securityPlaybook,
    };
}

