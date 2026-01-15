import type { ArchitectureStyle } from '../types.js';

/**
 * Serverless Backend Architecture
 * Stateless functions triggered by events, managed infrastructure
 */
export const serverless: ArchitectureStyle = {
    id: 'serverless',
    name: 'Serverless Backend',
    description: 'Backend composed of stateless functions triggered by events. Infrastructure managed by cloud provider. Pay-per-use with automatic scaling.',

    whenToUse: [
        'Variable/unpredictable traffic patterns',
        'Event-driven workloads (webhooks, file processing)',
        'Minimal operational overhead desired',
        'Pay-per-use cost model preferred',
        'Rapid development with managed infrastructure',
        'Prototype or MVP development'
    ],

    whenNotToUse: [
        'Long-running processes (> 15 min)',
        'Low latency critical (cold start issues)',
        'High-frequency invocations (cost prohibitive)',
        'Complex stateful workflows',
        'Need full control over infrastructure',
        'Vendor lock-in unacceptable'
    ],

    corePrinciples: [
        'Functions are stateless',
        'State stored in external managed services',
        'Each function does one thing well',
        'Cold start mitigation strategies required',
        'Design for idempotency',
        'Optimize for invocation cost and duration'
    ],

    folderStructure: {
        name: 'src',
        type: 'folder',
        children: [
            {
                name: 'functions',
                type: 'folder',
                children: [
                    {
                        name: 'http',
                        type: 'folder',
                        description: 'API Gateway triggers',
                        children: [
                            {
                                name: 'create-order',
                                type: 'folder',
                                children: [
                                    { name: 'handler.ts', type: 'file', description: 'Function entry point' },
                                    { name: 'schema.ts', type: 'file', description: 'Input validation' },
                                    { name: 'index.ts', type: 'file', description: 'Export' }
                                ]
                            },
                            { name: 'get-orders', type: 'folder' }
                        ]
                    },
                    {
                        name: 'events',
                        type: 'folder',
                        description: 'Event triggers (S3, SQS, SNS)',
                        children: [
                            { name: 'process-upload', type: 'folder' },
                            { name: 'handle-payment', type: 'folder' }
                        ]
                    },
                    {
                        name: 'scheduled',
                        type: 'folder',
                        description: 'Cron triggers',
                        children: [
                            { name: 'daily-report', type: 'folder' },
                            { name: 'cleanup-job', type: 'folder' }
                        ]
                    }
                ]
            },
            {
                name: 'shared',
                type: 'folder',
                description: 'Shared code across functions',
                children: [
                    { name: 'domain', type: 'folder', description: 'Business logic' },
                    { name: 'utils', type: 'folder', description: 'Utilities' },
                    { name: 'clients', type: 'folder', description: 'External service clients' }
                ]
            },
            {
                name: 'infrastructure',
                type: 'folder',
                description: 'IaC definitions',
                children: [
                    { name: 'cdk', type: 'folder', description: 'AWS CDK or' },
                    { name: 'terraform', type: 'folder', description: 'Terraform configs' }
                ]
            }
        ]
    },

    commonPitfalls: [
        'Functions too large (should be < 500 lines)',
        'Ignoring cold start latency',
        'No local development/testing setup',
        'Synchronous chains of functions',
        'Over-reliance on managed services',
        'Missing structured logging',
        'Not monitoring costs per function'
    ],

    aiInstructions: `When generating code for Serverless Backend:

FUNCTION DESIGN:
- Functions must be stateless and idempotent
- Keep function code under 500 lines
- Separate business logic from handler boilerplate
- One function = one responsibility

CONFIGURATION:
- Use environment variables for configuration
- Secrets in secrets manager, not env vars
- Configure appropriate memory/timeout

COLD START:
- Keep dependencies minimal
- Use lazy initialization for heavy resources
- Consider provisioned concurrency for latency-sensitive functions

OBSERVABILITY:
- Implement structured logging from start
- Include request ID in all logs
- Use distributed tracing (X-Ray, etc.)

TESTING:
- Unit test business logic independently
- Integration test with local emulators (LocalStack, etc.)
- Test handler wrapper separately`
};

/**
 * Read-Heavy API Architecture
 * Optimized for high read-to-write ratio
 */
export const readHeavy: ArchitectureStyle = {
    id: 'read-heavy',
    name: 'Read-Heavy API',
    description: 'Backend optimized for high read-to-write ratio. Aggressive caching, denormalized storage, eventual consistency for reads.',

    whenToUse: [
        'Read:Write ratio > 10:1',
        'Data changes infrequently',
        'Latency for reads critical',
        'Can tolerate stale reads',
        'Content delivery / catalog systems',
        'Public-facing high-traffic APIs'
    ],

    whenNotToUse: [
        'Data changes frequently',
        'Strong consistency required for reads',
        'Write-heavy workload',
        'Cache invalidation complexity unacceptable',
        'Data freshness critical (financial, real-time)'
    ],

    corePrinciples: [
        'Cache everything cacheable',
        'Denormalize data for read performance',
        'Accept eventual consistency',
        'Invalidate caches explicitly on writes',
        'Multiple cache layers (CDN, app, DB)',
        'Optimize for cache hits'
    ],

    folderStructure: {
        name: 'src',
        type: 'folder',
        children: [
            {
                name: 'api',
                type: 'folder',
                children: [
                    { name: 'queries', type: 'folder', description: 'Read endpoints' },
                    { name: 'commands', type: 'folder', description: 'Write endpoints' }
                ]
            },
            {
                name: 'cache',
                type: 'folder',
                children: [
                    { name: 'strategies', type: 'folder', description: 'Cache patterns' },
                    { name: 'invalidation', type: 'folder', description: 'Cache invalidation logic' },
                    { name: 'warming', type: 'folder', description: 'Pre-populate caches' }
                ]
            },
            {
                name: 'read-models',
                type: 'folder',
                description: 'Denormalized views optimized for queries'
            },
            {
                name: 'projectors',
                type: 'folder',
                description: 'Update read models on writes'
            },
            { name: 'domain', type: 'folder' },
            {
                name: 'infrastructure',
                type: 'folder',
                children: [
                    { name: 'cache', type: 'folder', description: 'Redis, Memcached' },
                    { name: 'database', type: 'folder' }
                ]
            }
        ]
    },

    commonPitfalls: [
        'Cache stampede on invalidation - use locking or probabilistic expiry',
        'Stale cache with no TTL - always set TTL',
        'Missing cache warming strategy - cold cache = slow startup',
        'Over-caching (wasted memory) - cache what matters',
        'No cache hit rate monitoring - flying blind',
        'Complex invalidation logic - simpler is better'
    ],

    aiInstructions: `When generating code for Read-Heavy API:

CACHING:
- Every query endpoint checks cache first
- Cache TTL required for all cached data
- Use cache-aside pattern as default
- Implement multi-layer caching where appropriate

INVALIDATION:
- Write operations invalidate affected caches
- Use cache tags for grouped invalidation
- Consider event-driven invalidation
- Handle cache stampede protection

READ MODELS:
- Denormalize for query patterns
- Accept data duplication for performance
- Update read models on writes (sync or async)

MONITORING:
- Log cache hit/miss rates
- Alert on low hit rates
- Monitor cache memory usage

PATTERNS:
- Cache-aside: app manages cache
- Read-through: cache fetches on miss
- Write-through: writes go to cache first`
};

/**
 * Automation / Bot Backend Architecture
 * Scheduled jobs, workflows, integrations
 */
export const automation: ArchitectureStyle = {
    id: 'automation',
    name: 'Automation / Bot Backend',
    description: 'Backend for scheduled jobs, workflows, integrations, and automated processes. Emphasizes reliability, retries, and observability.',

    whenToUse: [
        'Scheduled batch processing',
        'Third-party integrations',
        'Workflow orchestration',
        'Background job processing',
        'Data pipelines',
        'Automated notifications / alerts'
    ],

    whenNotToUse: [
        'Real-time user interactions',
        'Low latency requirements',
        'Simple CRUD operations',
        'User-facing API as primary purpose'
    ],

    corePrinciples: [
        'All jobs must be idempotent',
        'Explicit retry policies with backoff',
        'Comprehensive logging and tracing',
        'Failure isolation between jobs',
        'Clear timeout for every operation',
        'Compensating transactions for failures'
    ],

    folderStructure: {
        name: 'src',
        type: 'folder',
        children: [
            {
                name: 'jobs',
                type: 'folder',
                children: [
                    {
                        name: 'scheduled',
                        type: 'folder',
                        description: 'Cron jobs',
                        children: [
                            { name: 'daily-report', type: 'folder' },
                            { name: 'cleanup', type: 'folder' },
                            { name: 'sync-external', type: 'folder' }
                        ]
                    },
                    {
                        name: 'triggered',
                        type: 'folder',
                        description: 'Event-triggered jobs'
                    },
                    {
                        name: 'workflows',
                        type: 'folder',
                        description: 'Multi-step processes'
                    }
                ]
            },
            {
                name: 'integrations',
                type: 'folder',
                description: 'External API clients',
                children: [
                    { name: 'slack', type: 'folder' },
                    { name: 'stripe', type: 'folder' },
                    { name: 'sendgrid', type: 'folder' },
                    { name: 'salesforce', type: 'folder' }
                ]
            },
            {
                name: 'shared',
                type: 'folder',
                children: [
                    { name: 'retry', type: 'folder', description: 'Retry utilities' },
                    { name: 'logging', type: 'folder', description: 'Structured logging' },
                    { name: 'monitoring', type: 'folder', description: 'Metrics, alerts' }
                ]
            },
            {
                name: 'infrastructure',
                type: 'folder',
                children: [
                    { name: 'scheduler', type: 'folder', description: 'Job scheduling' },
                    { name: 'queue', type: 'folder', description: 'Job queues' }
                ]
            }
        ]
    },

    commonPitfalls: [
        'Non-idempotent jobs - re-runs cause duplicates',
        'Missing retry logic - transient failures break everything',
        'No dead letter handling - failed jobs disappear',
        'Insufficient logging - debugging is impossible',
        'Jobs without timeout - stuck jobs consume resources',
        'No job state tracking - cannot resume or debug',
        'Missing alerting on failures'
    ],

    aiInstructions: `When generating code for Automation Backend:

JOBS:
- Every job operation MUST be idempotent
- Set explicit timeout for every job
- Include job ID in all log entries
- Log: job start, progress checkpoints, completion, failure

RETRY:
- Implement exponential backoff for retries
- Configure max retry attempts
- Use jitter to prevent thundering herd
- Different retry strategies for different failure types

INTEGRATIONS:
- Wrap all external API calls with retry logic
- Implement circuit breaker for unreliable APIs
- Cache authentication tokens appropriately
- Handle rate limiting gracefully

MONITORING:
- Track job execution duration
- Alert on job failures
- Monitor success/failure rates
- Dashboard for job status overview

WORKFLOWS:
- Break into checkpointed steps
- Each step independently resumable
- Handle partial failures with compensation`
};
