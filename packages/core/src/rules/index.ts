/**
 * IronBackend Design Rules
 * Enforceable rules for backend development
 */

import type { DesignRule, RuleCategory } from '../types.js';

// ============================================================================
// API Design Rules
// ============================================================================

export const apiRules: DesignRule[] = [
    {
        id: 'API-001',
        category: 'API',
        rule: 'All endpoints must have explicit request/response schemas',
        severity: 'ERROR',
        rationale: 'Without schemas, API contracts are implicit and prone to breaking changes'
    },
    {
        id: 'API-002',
        category: 'API',
        rule: 'Use plural nouns for resource collections (/users, not /user)',
        severity: 'ERROR',
        rationale: 'Consistent naming convention makes APIs predictable'
    },
    {
        id: 'API-003',
        category: 'API',
        rule: 'HTTP methods must match semantics (POST=create, PUT=replace, PATCH=partial, DELETE=remove)',
        severity: 'ERROR',
        rationale: 'Correct HTTP semantics enable proper caching, idempotency handling'
    },
    {
        id: 'API-004',
        category: 'API',
        rule: 'Return 201 for creation, 200 for success, 204 for no content',
        severity: 'WARN',
        rationale: 'Correct status codes help clients handle responses appropriately'
    },
    {
        id: 'API-005',
        category: 'API',
        rule: 'Pagination required for list endpoints returning > 20 items',
        severity: 'ERROR',
        rationale: 'Unbounded lists cause performance issues and memory problems'
    },
    {
        id: 'API-006',
        category: 'API',
        rule: 'Include X-Request-ID header in all responses',
        severity: 'WARN',
        rationale: 'Request tracing is essential for debugging distributed systems'
    },
    {
        id: 'API-007',
        category: 'API',
        rule: 'Version APIs in URL path (/v1/users) or header',
        severity: 'ERROR',
        rationale: 'Versioning prevents breaking changes from affecting existing clients'
    },
    {
        id: 'API-008',
        category: 'API',
        rule: 'Error responses must include error code, message, and timestamp',
        severity: 'ERROR',
        rationale: 'Structured errors enable programmatic error handling'
    },
    {
        id: 'API-009',
        category: 'API',
        rule: 'Rate limiting headers must be present (X-RateLimit-*)',
        severity: 'WARN',
        rationale: 'Clients need to know rate limits to implement backoff'
    },
    {
        id: 'API-010',
        category: 'API',
        rule: 'No verbs in URL paths (/users/create is wrong, use POST /users)',
        severity: 'ERROR',
        rationale: 'HTTP methods provide the verb, URLs should be nouns'
    }
];

// ============================================================================
// Domain Modeling Rules
// ============================================================================

export const domainRules: DesignRule[] = [
    {
        id: 'DOM-001',
        category: 'DOMAIN',
        rule: 'Entities must have immutable identifiers',
        severity: 'ERROR',
        rationale: 'Changing IDs breaks referential integrity'
    },
    {
        id: 'DOM-002',
        category: 'DOMAIN',
        rule: 'Value objects must be immutable and compared by value',
        severity: 'ERROR',
        rationale: 'Mutable value objects cause subtle bugs in collections and caching'
    },
    {
        id: 'DOM-003',
        category: 'DOMAIN',
        rule: 'Aggregates must have a single root entity',
        severity: 'ERROR',
        rationale: 'Multiple roots create ambiguous transaction boundaries'
    },
    {
        id: 'DOM-004',
        category: 'DOMAIN',
        rule: 'Domain events named in past tense (OrderCreated, not CreateOrder)',
        severity: 'ERROR',
        rationale: 'Events represent facts that happened, not intentions'
    },
    {
        id: 'DOM-005',
        category: 'DOMAIN',
        rule: 'Domain logic must not depend on framework code',
        severity: 'ERROR',
        rationale: 'Domain should be portable and testable without framework'
    },
    {
        id: 'DOM-006',
        category: 'DOMAIN',
        rule: 'Business rules encapsulated in domain layer, not services',
        severity: 'WARN',
        rationale: 'Anemic domain models lead to scattered business logic'
    },
    {
        id: 'DOM-007',
        category: 'DOMAIN',
        rule: 'No primitive obsession: use value objects for domain concepts',
        severity: 'WARN',
        rationale: 'Email, Money, UserId should be types, not strings/numbers'
    },
    {
        id: 'DOM-008',
        category: 'DOMAIN',
        rule: 'Aggregate references by ID only, not object reference',
        severity: 'ERROR',
        rationale: 'Object references create coupling and lazy loading issues'
    }
];

// ============================================================================
// Error Handling Rules
// ============================================================================

export const errorHandlingRules: DesignRule[] = [
    {
        id: 'ERR-001',
        category: 'ERROR_HANDLING',
        rule: 'Use typed exceptions/errors, not generic Error class',
        severity: 'ERROR',
        rationale: 'Typed exceptions enable proper error handling and recovery'
    },
    {
        id: 'ERR-002',
        category: 'ERROR_HANDLING',
        rule: 'Exceptions must include error code and message',
        severity: 'ERROR',
        rationale: 'Error codes enable programmatic handling, messages for humans'
    },
    {
        id: 'ERR-003',
        category: 'ERROR_HANDLING',
        rule: 'Never expose stack traces in production API responses',
        severity: 'ERROR',
        rationale: 'Stack traces leak implementation details and security info'
    },
    {
        id: 'ERR-004',
        category: 'ERROR_HANDLING',
        rule: 'Log all errors with correlation ID',
        severity: 'ERROR',
        rationale: 'Correlation IDs enable tracing errors across services'
    },
    {
        id: 'ERR-005',
        category: 'ERROR_HANDLING',
        rule: 'Distinguish between client errors (4xx) and server errors (5xx)',
        severity: 'ERROR',
        rationale: 'Clients need to know if error is their fault or server issue'
    },
    {
        id: 'ERR-006',
        category: 'ERROR_HANDLING',
        rule: 'Implement global exception handler',
        severity: 'ERROR',
        rationale: 'Unhandled exceptions should never leak to clients'
    },
    {
        id: 'ERR-007',
        category: 'ERROR_HANDLING',
        rule: 'Expected failures (validation) use Result type, not exceptions',
        severity: 'WARN',
        rationale: 'Exceptions for control flow are expensive and unclear'
    },
    {
        id: 'ERR-008',
        category: 'ERROR_HANDLING',
        rule: 'Unexpected failures throw exceptions',
        severity: 'WARN',
        rationale: 'Exceptions signal truly exceptional conditions'
    }
];

// ============================================================================
// Transaction Rules
// ============================================================================

export const transactionRules: DesignRule[] = [
    {
        id: 'TXN-001',
        category: 'TRANSACTIONS',
        rule: 'Transactions scoped to single aggregate modification',
        severity: 'ERROR',
        rationale: 'Cross-aggregate transactions create scaling bottlenecks'
    },
    {
        id: 'TXN-002',
        category: 'TRANSACTIONS',
        rule: 'No transactions spanning multiple aggregates',
        severity: 'ERROR',
        rationale: 'Use saga pattern for cross-aggregate consistency instead'
    },
    {
        id: 'TXN-003',
        category: 'TRANSACTIONS',
        rule: 'Use saga pattern for cross-aggregate consistency',
        severity: 'WARN',
        rationale: 'Sagas enable eventual consistency without distributed transactions'
    },
    {
        id: 'TXN-004',
        category: 'TRANSACTIONS',
        rule: 'Transaction timeout must be explicit (< 30 seconds)',
        severity: 'ERROR',
        rationale: 'Long transactions cause lock contention and resource exhaustion'
    },
    {
        id: 'TXN-005',
        category: 'TRANSACTIONS',
        rule: 'Read operations should not acquire write locks',
        severity: 'WARN',
        rationale: 'Unnecessary locking reduces concurrency'
    },
    {
        id: 'TXN-006',
        category: 'TRANSACTIONS',
        rule: 'Retry logic required for transient failures',
        severity: 'WARN',
        rationale: 'Transient failures (deadlocks, timeouts) are recoverable'
    }
];

// ============================================================================
// Data Access Rules
// ============================================================================

export const dataAccessRules: DesignRule[] = [
    {
        id: 'DAT-001',
        category: 'DATA_ACCESS',
        rule: 'Repositories return domain entities, not database records',
        severity: 'ERROR',
        rationale: 'Domain layer should not know about database structure'
    },
    {
        id: 'DAT-002',
        category: 'DATA_ACCESS',
        rule: 'Query logic in repository, not in service layer',
        severity: 'ERROR',
        rationale: 'Repositories encapsulate data access, services orchestrate'
    },
    {
        id: 'DAT-003',
        category: 'DATA_ACCESS',
        rule: 'No raw SQL in application code (except repository layer)',
        severity: 'ERROR',
        rationale: 'SQL scattered in app code is unmaintainable and insecure'
    },
    {
        id: 'DAT-004',
        category: 'DATA_ACCESS',
        rule: 'Database indexes for all frequently-queried columns',
        severity: 'WARN',
        rationale: 'Missing indexes cause slow queries at scale'
    },
    {
        id: 'DAT-005',
        category: 'DATA_ACCESS',
        rule: 'Connection pooling mandatory',
        severity: 'ERROR',
        rationale: 'Creating connections per request is expensive'
    },
    {
        id: 'DAT-006',
        category: 'DATA_ACCESS',
        rule: 'No N+1 queries (use eager loading or batching)',
        severity: 'ERROR',
        rationale: 'N+1 queries cause severe performance degradation'
    },
    {
        id: 'DAT-007',
        category: 'DATA_ACCESS',
        rule: 'Soft delete preferred over hard delete for audit trails',
        severity: 'WARN',
        rationale: 'Hard deletes lose historical data and break referential integrity'
    }
];

// ============================================================================
// Naming Rules
// ============================================================================

export const namingRules: DesignRule[] = [
    {
        id: 'NAM-001',
        category: 'NAMING',
        rule: 'Classes use PascalCase',
        severity: 'ERROR',
        rationale: 'Consistent naming convention across all code'
    },
    {
        id: 'NAM-002',
        category: 'NAMING',
        rule: 'Methods/functions use camelCase',
        severity: 'ERROR',
        rationale: 'Consistent naming convention across all code'
    },
    {
        id: 'NAM-003',
        category: 'NAMING',
        rule: 'Constants use SCREAMING_SNAKE_CASE',
        severity: 'ERROR',
        rationale: 'Constants should be visually distinct from variables'
    },
    {
        id: 'NAM-004',
        category: 'NAMING',
        rule: 'Interfaces prefixed with I or suffixed with role (Repository, Service)',
        severity: 'WARN',
        rationale: 'Interfaces should be distinguishable from implementations'
    },
    {
        id: 'NAM-005',
        category: 'NAMING',
        rule: 'Boolean variables prefixed with is, has, should, can',
        severity: 'WARN',
        rationale: 'Boolean intent should be clear from the name'
    },
    {
        id: 'NAM-006',
        category: 'NAMING',
        rule: 'Avoid abbreviations except widely-known ones (ID, HTTP, URL)',
        severity: 'ERROR',
        rationale: 'Abbreviations reduce readability and cause inconsistency'
    },
    {
        id: 'NAM-007',
        category: 'NAMING',
        rule: 'Collection variables use plural nouns',
        severity: 'ERROR',
        rationale: 'users is clearly a collection, user is ambiguous'
    }
];

// ============================================================================
// Validation Rules
// ============================================================================

export const validationRules: DesignRule[] = [
    {
        id: 'VAL-001',
        category: 'VALIDATION',
        rule: 'Validate at system boundaries (API input)',
        severity: 'ERROR',
        rationale: 'Never trust input from outside the system'
    },
    {
        id: 'VAL-002',
        category: 'VALIDATION',
        rule: 'Use schema validation libraries, not manual checks',
        severity: 'WARN',
        rationale: 'Schema validators are consistent, tested, and declarative'
    },
    {
        id: 'VAL-003',
        category: 'VALIDATION',
        rule: 'Return all validation errors at once, not one at a time',
        severity: 'ERROR',
        rationale: 'Users should fix all issues in one attempt'
    },
    {
        id: 'VAL-004',
        category: 'VALIDATION',
        rule: 'Domain entities validate invariants on construction',
        severity: 'ERROR',
        rationale: 'Invalid entities should never exist in memory'
    },
    {
        id: 'VAL-005',
        category: 'VALIDATION',
        rule: 'Sanitize all user input before storage',
        severity: 'ERROR',
        rationale: 'Unsanitized input enables injection attacks'
    }
];

// ============================================================================
// Async / Concurrency Rules
// ============================================================================

export const asyncRules: DesignRule[] = [
    {
        id: 'ASY-001',
        category: 'ASYNC',
        rule: 'Async handlers must be idempotent',
        severity: 'ERROR',
        rationale: 'Messages can be delivered multiple times'
    },
    {
        id: 'ASY-002',
        category: 'ASYNC',
        rule: 'Include message ID for deduplication',
        severity: 'ERROR',
        rationale: 'Deduplication requires a unique identifier'
    },
    {
        id: 'ASY-003',
        category: 'ASYNC',
        rule: 'Dead letter queue required for failed messages',
        severity: 'ERROR',
        rationale: 'Failed messages should not block the queue or be lost'
    },
    {
        id: 'ASY-004',
        category: 'ASYNC',
        rule: 'Set explicit timeout for async operations',
        severity: 'ERROR',
        rationale: 'Operations without timeout can hang forever'
    },
    {
        id: 'ASY-005',
        category: 'ASYNC',
        rule: 'Use optimistic locking for concurrent updates',
        severity: 'WARN',
        rationale: 'Optimistic locking is more scalable than pessimistic'
    },
    {
        id: 'ASY-006',
        category: 'ASYNC',
        rule: 'Document eventual consistency boundaries',
        severity: 'WARN',
        rationale: 'Developers need to know where data can be stale'
    }
];

// ============================================================================
// Aggregated Exports
// ============================================================================

export const allRules: DesignRule[] = [
    ...apiRules,
    ...domainRules,
    ...errorHandlingRules,
    ...transactionRules,
    ...dataAccessRules,
    ...namingRules,
    ...validationRules,
    ...asyncRules,
];

export const rulesByCategory: Record<RuleCategory, DesignRule[]> = {
    'API': apiRules,
    'DOMAIN': domainRules,
    'ERROR_HANDLING': errorHandlingRules,
    'TRANSACTIONS': transactionRules,
    'DATA_ACCESS': dataAccessRules,
    'NAMING': namingRules,
    'VALIDATION': validationRules,
    'ASYNC': asyncRules,
};

/**
 * Get rules by category
 */
export function getRulesByCategory(category: RuleCategory): DesignRule[] {
    return rulesByCategory[category] || [];
}

/**
 * Get rule by ID
 */
export function getRule(id: string): DesignRule | undefined {
    return allRules.find(rule => rule.id === id);
}

/**
 * Get all ERROR severity rules
 */
export function getErrorRules(): DesignRule[] {
    return allRules.filter(rule => rule.severity === 'ERROR');
}

/**
 * Get all WARN severity rules
 */
export function getWarnRules(): DesignRule[] {
    return allRules.filter(rule => rule.severity === 'WARN');
}

/**
 * Format rules for AI prompt
 */
export function formatRulesForPrompt(rules: DesignRule[]): string {
    return rules.map(rule =>
        `[${rule.severity}] ${rule.id}: ${rule.rule}`
    ).join('\n');
}
