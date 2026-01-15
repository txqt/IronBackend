import type { ArchitectureStyle } from '../types.js';

/**
 * Event-Driven Backend Architecture
 * Components communicate through events, asynchronously
 */
export const eventDriven: ArchitectureStyle = {
    id: 'event-driven',
    name: 'Event-Driven Backend',
    description: 'System components communicate through events. Actions trigger events; handlers react to events asynchronously. Enables loose coupling and high scalability.',

    whenToUse: [
        'High throughput with eventual consistency acceptable',
        'Multiple services reacting to same business events',
        'Audit trail required for all state changes',
        'Decoupling producers from consumers',
        'Need to replay events for debugging or recovery',
        'Complex workflows with multiple steps'
    ],

    whenNotToUse: [
        'Strong consistency required everywhere',
        'Simple request-response patterns sufficient',
        'Team lacks event sourcing experience',
        'Debugging complexity unacceptable',
        'Real-time synchronous responses needed',
        'Small, simple domains'
    ],

    corePrinciples: [
        'Events are immutable facts about what happened',
        'Publishers do not know their subscribers',
        'Handlers must be idempotent',
        'Event ordering matters within aggregate boundaries',
        'Events carry enough data for handlers to act',
        'Eventual consistency is the norm'
    ],

    folderStructure: {
        name: 'src',
        type: 'folder',
        children: [
            {
                name: 'events',
                type: 'folder',
                description: 'Event infrastructure',
                children: [
                    { name: 'definitions', type: 'folder', description: 'Event schemas/types' },
                    { name: 'publishers', type: 'folder', description: 'Event publishing logic' },
                    { name: 'handlers', type: 'folder', description: 'Event handlers' },
                    { name: 'store', type: 'folder', description: 'Event persistence' }
                ]
            },
            {
                name: 'aggregates',
                type: 'folder',
                description: 'Event-sourced domain aggregates'
            },
            {
                name: 'projections',
                type: 'folder',
                description: 'Read models built from events'
            },
            {
                name: 'sagas',
                type: 'folder',
                description: 'Long-running processes / process managers'
            },
            {
                name: 'api',
                type: 'folder',
                description: 'External interfaces',
                children: [
                    { name: 'commands', type: 'folder', description: 'Write operations' },
                    { name: 'queries', type: 'folder', description: 'Read operations' }
                ]
            },
            {
                name: 'infrastructure',
                type: 'folder',
                children: [
                    { name: 'messaging', type: 'folder', description: 'Message broker integration' },
                    { name: 'event-store', type: 'folder', description: 'Event storage implementation' }
                ]
            }
        ]
    },

    commonPitfalls: [
        'Non-idempotent handlers - same event processed twice should have same result',
        'Missing event versioning strategy - events schema will evolve',
        'Tight coupling through event payload - events should be self-contained',
        'Ignoring event ordering requirements - order matters within aggregate',
        'No dead letter handling - failed events need a home',
        'Synchronous event handling - defeats the purpose',
        'Events without correlation IDs - hard to trace'
    ],

    aiInstructions: `When generating code for Event-Driven Backend:

EVENT STRUCTURE:
- Every event has: id, type, timestamp, version, correlationId, payload
- Event names in past tense: OrderCreated, PaymentProcessed
- Events are immutable once published
- Include event version for schema evolution

HANDLERS:
- All handlers MUST be idempotent
- Store processed event IDs to detect duplicates
- Handle events asynchronously
- Log event processing start/end

PUBLISHING:
- Commands return immediately after emitting events
- Publisher does not wait for handlers
- Use transactional outbox for reliability

PROJECTIONS:
- Read models built by projecting events
- Queries read from projections, never event store
- Projections can be rebuilt from events

SAGAS:
- Coordinate multi-step processes
- Listen for events, issue commands
- Handle compensation for failures`
};

/**
 * CQRS Architecture Style
 * Separate models for reading and writing data
 */
export const cqrs: ArchitectureStyle = {
    id: 'cqrs',
    name: 'CQRS',
    description: 'Command Query Responsibility Segregation. Separate models for reading and writing data. Commands mutate state; queries return state without modification.',

    whenToUse: [
        'Read and write patterns differ significantly',
        'Read-heavy workloads with complex queries',
        'Different scaling needs for reads vs writes',
        'Eventual consistency acceptable for reads',
        'Need to optimize read and write models independently',
        'Complex reporting requirements'
    ],

    whenNotToUse: [
        'Simple CRUD with 1:1 read/write ratio',
        'Strong consistency required for reads',
        'Small data volumes with simple queries',
        'Team unfamiliar with eventual consistency',
        'Added complexity not justified'
    ],

    corePrinciples: [
        'Commands never return data (void or acknowledgment only)',
        'Queries never modify state',
        'Write model optimized for consistency, read model for queries',
        'Keep write model normalized, denormalize read models',
        'Read and write models can use different databases',
        'Synchronization between models is explicit'
    ],

    folderStructure: {
        name: 'src',
        type: 'folder',
        children: [
            {
                name: 'write',
                type: 'folder',
                description: 'Command/write side',
                children: [
                    {
                        name: 'commands',
                        type: 'folder',
                        children: [
                            { name: 'handlers', type: 'folder', description: 'Command handlers' },
                            { name: 'validators', type: 'folder', description: 'Command validation' }
                        ]
                    },
                    {
                        name: 'domain',
                        type: 'folder',
                        children: [
                            { name: 'aggregates', type: 'folder', description: 'Write model aggregates' },
                            { name: 'events', type: 'folder', description: 'Domain events' }
                        ]
                    },
                    { name: 'repositories', type: 'folder', description: 'Write repositories' }
                ]
            },
            {
                name: 'read',
                type: 'folder',
                description: 'Query/read side',
                children: [
                    {
                        name: 'queries',
                        type: 'folder',
                        children: [
                            { name: 'handlers', type: 'folder', description: 'Query handlers' },
                            { name: 'dto', type: 'folder', description: 'Query response DTOs' }
                        ]
                    },
                    { name: 'models', type: 'folder', description: 'Denormalized read models' },
                    { name: 'projectors', type: 'folder', description: 'Build read models from events' }
                ]
            },
            {
                name: 'sync',
                type: 'folder',
                description: 'Write → Read synchronization'
            },
            {
                name: 'api',
                type: 'folder',
                children: [
                    { name: 'command-endpoints', type: 'folder', description: 'POST/PUT/DELETE' },
                    { name: 'query-endpoints', type: 'folder', description: 'GET' }
                ]
            }
        ]
    },

    commonPitfalls: [
        'Returning data from command handlers - commands return void or ID only',
        'Querying write model for reads - always use read models',
        'Missing synchronization between models - define explicit sync',
        'Over-complicating simple domains - CQRS adds complexity',
        'Expecting immediate consistency - reads can be stale',
        'Tight coupling between write and read models'
    ],

    aiInstructions: `When generating code for CQRS:

COMMANDS:
- Command handlers return void or command ID only
- Validate command before processing
- Emit events after successful command processing
- Commands are imperative: CreateOrder, UpdateUser

QUERIES:
- Query handlers are pure functions, no side effects
- Queries return rich, denormalized DTOs
- Optimize read models for specific query patterns
- Queries are questions: GetOrderById, ListUserOrders

SEPARATION:
- Write model: normalized, consistent, optimized for writes
- Read model: denormalized, eventually consistent, optimized for reads
- Can use different databases for each

SYNCHRONIZATION:
- Projectors listen to events from write side
- Update read models when events occur
- Handle out-of-order events gracefully
- Design for rebuild capability`
};
