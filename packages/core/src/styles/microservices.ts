import type { ArchitectureStyle } from '../types.js';

/**
 * Microservices (Synchronous) Architecture
 * Distributed services communicating via HTTP/gRPC
 */
export const microservicesSync: ArchitectureStyle = {
    id: 'microservices-sync',
    name: 'Microservices (Synchronous)',
    description: 'Distributed system of independently deployable services communicating via synchronous protocols (HTTP/gRPC). Each service owns its data exclusively.',

    whenToUse: [
        'Multiple teams need independent deployment cycles',
        'Services have different scaling requirements',
        'Technology heterogeneity required',
        'Clear domain boundaries established',
        'Organization structure supports service ownership',
        'Strong DevOps/platform capabilities'
    ],

    whenNotToUse: [
        'Small team (< 20 developers)',
        'Unclear domain boundaries',
        'Low latency critical (network overhead)',
        'Operational maturity lacking',
        'Simple, unified domain',
        'Startup phase with rapid pivots'
    ],

    corePrinciples: [
        'Each service owns its data exclusively',
        'Services communicate via well-defined APIs',
        'Backward compatibility required for API changes',
        'Failure of one service must not cascade',
        'Services are independently deployable',
        'Decentralized data management'
    ],

    folderStructure: {
        name: 'service-name',
        type: 'folder',
        description: 'Per-service structure',
        children: [
            {
                name: 'src',
                type: 'folder',
                children: [
                    {
                        name: 'api',
                        type: 'folder',
                        children: [
                            { name: 'controllers', type: 'folder', description: 'HTTP handlers' },
                            { name: 'dto', type: 'folder', description: 'Request/response types' },
                            { name: 'clients', type: 'folder', description: 'Clients for other services' }
                        ]
                    },
                    { name: 'domain', type: 'folder', description: 'Service domain logic' },
                    { name: 'application', type: 'folder', description: 'Use cases' },
                    { name: 'infrastructure', type: 'folder', description: 'Database, external calls' }
                ]
            },
            {
                name: 'contracts',
                type: 'folder',
                description: 'API schemas (OpenAPI/Protobuf)'
            },
            {
                name: 'tests',
                type: 'folder',
                children: [
                    { name: 'unit', type: 'folder' },
                    { name: 'integration', type: 'folder' },
                    { name: 'contract', type: 'folder', description: 'Consumer-driven contracts' }
                ]
            },
            {
                name: 'deploy',
                type: 'folder',
                children: [
                    { name: 'Dockerfile', type: 'file' },
                    { name: 'k8s', type: 'folder', description: 'Kubernetes manifests' }
                ]
            }
        ]
    },

    commonPitfalls: [
        'Distributed monolith - tight coupling defeats the purpose',
        'Missing circuit breakers - failures cascade',
        'Synchronous chains too deep - latency compounds',
        'Shared database between services - kills independence',
        'No API versioning strategy - breaking changes break consumers',
        'Missing observability - debugging is impossible',
        'Ignoring network failures - networks are unreliable'
    ],

    aiInstructions: `When generating code for Sync Microservices:

RESILIENCE:
- Implement circuit breaker for ALL external service calls
- API clients have explicit timeout (e.g., 5s) and retry policies
- Use bulkhead pattern to isolate failures
- Implement fallback strategies

OBSERVABILITY:
- Include correlation ID in all requests and logs
- Add distributed tracing (OpenTelemetry)
- Health endpoints mandatory: /health, /ready

API DESIGN:
- Version APIs from day one: /v1/resource
- Use OpenAPI/Protobuf for contracts
- Implement consumer-driven contract tests
- Never break backward compatibility

DATA:
- Each service has its own database/schema
- No cross-service database queries
- Use API calls to get data from other services

DEPLOYMENT:
- Each service independently deployable
- Container-ready with health checks
- Graceful shutdown handling`
};

/**
 * Microservices (Asynchronous) Architecture
 * Services communicating via message queues and events
 */
export const microservicesAsync: ArchitectureStyle = {
    id: 'microservices-async',
    name: 'Microservices (Asynchronous)',
    description: 'Distributed services communicating primarily through message queues and events. Decoupled in time and space for high availability and throughput.',

    whenToUse: [
        'High throughput required',
        'Eventual consistency acceptable',
        'Long-running operations common',
        'Spiky workloads with buffering needs',
        'Need to decouple producer/consumer lifecycles',
        'Fire-and-forget patterns common'
    ],

    whenNotToUse: [
        'Immediate consistency required',
        'Simple request-response patterns',
        'Message infrastructure unavailable or too complex',
        'Debugging async flows unacceptable for team',
        'Low-latency synchronous responses needed'
    ],

    corePrinciples: [
        'Messages are the contract between services',
        'Publishers and consumers independently deployable',
        'Messages must have schemas and versioning',
        'Dead letter handling mandatory',
        'Exactly-once semantics via idempotency',
        'Message ordering guaranteed within partition'
    ],

    folderStructure: {
        name: 'service-name',
        type: 'folder',
        children: [
            {
                name: 'src',
                type: 'folder',
                children: [
                    { name: 'consumers', type: 'folder', description: 'Message handlers' },
                    { name: 'producers', type: 'folder', description: 'Message publishers' },
                    { name: 'domain', type: 'folder' },
                    { name: 'application', type: 'folder' },
                    {
                        name: 'infrastructure',
                        type: 'folder',
                        children: [
                            { name: 'messaging', type: 'folder', description: 'Queue configuration' }
                        ]
                    }
                ]
            },
            {
                name: 'contracts',
                type: 'folder',
                children: [
                    { name: 'events', type: 'folder', description: 'Published event schemas' },
                    { name: 'commands', type: 'folder', description: 'Accepted command schemas' }
                ]
            },
            { name: 'tests', type: 'folder' },
            { name: 'deploy', type: 'folder' }
        ]
    },

    commonPitfalls: [
        'Non-idempotent consumers - duplicate messages will cause issues',
        'Missing dead letter queues - failed messages disappear',
        'Message ordering assumptions across partitions',
        'No schema registry - message evolution breaks consumers',
        'Unbounded queue growth - no backpressure',
        'Synchronous calls hidden in async flows',
        'Missing message metadata (correlation, timestamp)'
    ],

    aiInstructions: `When generating code for Async Microservices:

MESSAGES:
- Every message has: id, type, timestamp, version, correlationId, payload
- Message ID used for idempotency
- Schema registry for message contracts (Avro, Protobuf, JSON Schema)

CONSUMERS:
- MUST be idempotent - handle duplicate messages
- Acknowledge after successful processing
- Implement dead letter queue handling
- Log: message received, processing start, processing complete

PRODUCERS:
- Use transactional outbox pattern for reliability
- Include all required metadata
- Validate message schema before publishing

RELIABILITY:
- Configure appropriate retry policies with backoff
- Set up dead letter queues for each consumer
- Monitor queue depths and processing latency
- Implement circuit breaker for downstream calls`
};
