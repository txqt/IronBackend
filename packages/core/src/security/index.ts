/**
 * IronBackend Security & Reliability Playbooks
 */

import type { SecurityPlaybook, AuthConfig } from '../types.js';

// ============================================================================
// Authentication Strategies
// ============================================================================

export const authStrategies: AuthConfig[] = [
    {
        strategy: 'JWT',
        useWhen: [
            'Stateless APIs',
            'Microservices architecture',
            'Mobile/SPA clients',
            'Need to embed claims in token'
        ],
        implementation: [
            'Short-lived access tokens (15-30 minutes)',
            'Longer-lived refresh tokens (7-30 days)',
            'Store refresh tokens securely (httpOnly cookie or secure storage)',
            'Include essential claims only (user ID, roles)',
            'Use RS256 for production, HS256 for development',
            'Implement token revocation via blacklist or short expiry'
        ]
    },
    {
        strategy: 'SESSION',
        useWhen: [
            'Traditional web applications',
            'Server-side rendering',
            'Need immediate session invalidation',
            'Simpler security model preferred'
        ],
        implementation: [
            'Store sessions in Redis or similar (not in-memory)',
            'Use secure, httpOnly, sameSite cookies',
            'Regenerate session ID on login',
            'Set appropriate session timeout',
            'Implement CSRF protection'
        ]
    },
    {
        strategy: 'API_KEY',
        useWhen: [
            'Service-to-service communication',
            'Third-party integrations',
            'Public API access',
            'Simple authentication sufficient'
        ],
        implementation: [
            'Hash API keys before storage',
            'Implement key rotation mechanism',
            'Scope keys to specific permissions',
            'Rate limit per key',
            'Log all key usage for audit'
        ]
    },
    {
        strategy: 'OAUTH2',
        useWhen: [
            'Third-party login (Google, GitHub, etc.)',
            'Delegated access to resources',
            'Enterprise SSO integration',
            'Need to access third-party APIs on behalf of user'
        ],
        implementation: [
            'Use Authorization Code flow for web apps',
            'Use PKCE for mobile/SPA apps',
            'Validate tokens with provider',
            'Store provider tokens securely',
            'Handle token refresh automatically'
        ]
    },
    {
        strategy: 'MTLS',
        useWhen: [
            'Internal service mesh',
            'Zero-trust architecture',
            'High-security environments',
            'Need mutual authentication'
        ],
        implementation: [
            'Use organization PKI',
            'Automate certificate rotation',
            'Implement certificate revocation',
            'Monitor certificate expiry'
        ]
    }
];

// ============================================================================
// Security Playbook
// ============================================================================

export const securityPlaybook: SecurityPlaybook = {
    authentication: authStrategies,

    authorization: {
        rbac: {
            description: 'Role-Based Access Control. Assign roles to users, roles have permissions.',
            checkPattern: 'user.roles.some(role => requiredRoles.includes(role))',
            goodFor: [
                'Static, well-defined permission structures',
                'Simple user hierarchies (admin, user, guest)',
                'Quick to implement and audit'
            ]
        },
        abac: {
            description: 'Attribute-Based Access Control. Policies based on attributes of user, resource, action, and environment.',
            checkPattern: 'policy.evaluate({ user, resource, action, context })',
            goodFor: [
                'Dynamic, fine-grained access control',
                'Complex permission requirements',
                'Context-aware decisions (time, location, etc.)'
            ]
        },
        decisionMatrix: {
            'Simplicity': { rbac: '✅ Simple', abac: '❌ Complex' },
            'Flexibility': { rbac: '❌ Limited', abac: '✅ High' },
            'Performance': { rbac: '✅ Fast', abac: '⚠️ Depends on policy' },
            'Auditability': { rbac: '✅ Easy', abac: '⚠️ Policy-dependent' }
        }
    },

    rateLimiting: {
        windowType: 'Sliding window (more accurate than fixed window)',
        defaultLimit: '100 requests/minute per authenticated user',
        anonymousLimit: '20 requests/minute per IP',
        headers: [
            'X-RateLimit-Limit: Maximum requests allowed',
            'X-RateLimit-Remaining: Requests remaining in window',
            'X-RateLimit-Reset: Unix timestamp when limit resets'
        ],
        responseCode: 429
    },

    idempotency: {
        headerName: 'Idempotency-Key',
        keyFormat: 'UUID v4, client-generated',
        storageDuration: '24 hours',
        implementation: [
            '1. Check if Idempotency-Key exists in store',
            '2. If exists: return stored response',
            '3. If not: process request, store response with key',
            '4. Cleanup keys older than 24 hours (background job)',
            '5. Handle concurrent requests with same key (locking)'
        ]
    },

    retryStrategy: {
        baseDelay: '100ms',
        multiplier: 2,
        maxRetries: 3,
        maxDelay: '10s',
        jitter: '±10%',
        retryOn: [408, 429, 500, 502, 503, 504],
        doNotRetryOn: [400, 401, 403, 404, 409, 422]
    },

    circuitBreaker: {
        states: [
            'CLOSED: Normal operation, requests pass through',
            'OPEN: Failing, requests immediately rejected with fallback',
            'HALF_OPEN: Testing, limited requests allowed to probe'
        ],
        failureThreshold: 5,
        successThreshold: 3,
        timeout: '30s',
        monitoringWindow: '60s'
    },

    auditLogging: {
        requiredEvents: [
            'AUTH_LOGIN_SUCCESS',
            'AUTH_LOGIN_FAILURE',
            'AUTH_LOGOUT',
            'AUTH_TOKEN_REFRESH',
            'AUTHZ_ACCESS_GRANTED',
            'AUTHZ_ACCESS_DENIED',
            'DATA_CREATE',
            'DATA_UPDATE',
            'DATA_DELETE',
            'ADMIN_CONFIG_CHANGE',
            'ADMIN_USER_MANAGEMENT',
            'SECURITY_RATE_LIMIT_HIT',
            'SECURITY_BLOCKED_REQUEST'
        ],
        logFormat: {
            'timestamp': 'ISO8601 format',
            'eventType': 'Event type from requiredEvents',
            'actorId': 'User or service ID',
            'actorType': 'USER, SERVICE, SYSTEM',
            'resourceType': 'Type of resource affected',
            'resourceId': 'ID of resource affected',
            'action': 'CREATE, READ, UPDATE, DELETE',
            'outcome': 'SUCCESS, FAILURE',
            'metadata': 'Additional context',
            'ipAddress': 'Client IP',
            'userAgent': 'Client user agent',
            'correlationId': 'Request correlation ID'
        }
    },

    failurePhilosophy: [
        'FAIL FAST: Validate early, reject invalid requests immediately at boundaries',
        'FAIL GRACEFULLY: Always return meaningful errors, never crash or hang',
        'FAIL ISOLATED: One component failure should not cascade to others',
        'FAIL OBSERVABLE: Every failure must be logged with full context',
        'FAIL RECOVERABLE: Design for retry, implement compensation for failures'
    ]
};

/**
 * Get authentication strategy by type
 */
export function getAuthStrategy(strategy: string): AuthConfig | undefined {
    return authStrategies.find(auth => auth.strategy === strategy);
}

/**
 * Format security playbook section for prompt
 */
export function formatSecurityForPrompt(): string {
    return `
## Authentication
${authStrategies.map(auth => `
### ${auth.strategy}
Use when: ${auth.useWhen.join(', ')}
Implementation:
${auth.implementation.map(impl => `- ${impl}`).join('\n')}
`).join('\n')}

## Rate Limiting
- Window: ${securityPlaybook.rateLimiting.windowType}
- Default: ${securityPlaybook.rateLimiting.defaultLimit}
- Anonymous: ${securityPlaybook.rateLimiting.anonymousLimit}
- Response: HTTP ${securityPlaybook.rateLimiting.responseCode} with Retry-After header

## Retry Strategy
- Base delay: ${securityPlaybook.retryStrategy.baseDelay}
- Multiplier: ${securityPlaybook.retryStrategy.multiplier}x
- Max retries: ${securityPlaybook.retryStrategy.maxRetries}
- Retry on: ${securityPlaybook.retryStrategy.retryOn.join(', ')}
- Do NOT retry: ${securityPlaybook.retryStrategy.doNotRetryOn.join(', ')}

## Failure Philosophy
${securityPlaybook.failurePhilosophy.map(p => `- ${p}`).join('\n')}
`;
}
