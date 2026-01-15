import type { ArchitectureStyle } from '../types.js';

/**
 * Hexagonal Architecture (Ports & Adapters)
 * Application core surrounded by ports and adapters
 */
export const hexagonal: ArchitectureStyle = {
    id: 'hexagonal',
    name: 'Hexagonal Architecture',
    description: 'Application core surrounded by ports (interfaces) and adapters (implementations). Core has zero dependencies on external world. Also known as Ports & Adapters.',

    whenToUse: [
        'Long-lived systems requiring technology swaps',
        'Heavy external integrations (multiple DBs, APIs, queues)',
        'Test-driven development priority',
        'Complex business logic requiring isolation',
        'Need to support multiple input channels (HTTP, CLI, events)',
        'Expect infrastructure changes over system lifetime'
    ],

    whenNotToUse: [
        'Rapid prototyping needed - too much ceremony',
        'Simple CRUD with minimal business logic',
        'Team unfamiliar with DDD concepts',
        'Small, short-lived projects',
        'Single integration point unlikely to change'
    ],

    corePrinciples: [
        'Domain and application core have no external dependencies',
        'Ports define what the application needs (driven) or provides (driving)',
        'Adapters implement ports for specific technologies',
        'Dependency inversion: adapters depend on ports, not vice versa',
        'Core is testable without any infrastructure',
        'Technology decisions deferred to adapters'
    ],

    folderStructure: {
        name: 'src',
        type: 'folder',
        children: [
            {
                name: 'core',
                type: 'folder',
                description: 'Framework-free application core',
                children: [
                    {
                        name: 'domain',
                        type: 'folder',
                        children: [
                            { name: 'entities', type: 'folder', description: 'Domain entities' },
                            { name: 'value-objects', type: 'folder', description: 'Value objects' },
                            { name: 'events', type: 'folder', description: 'Domain events' },
                            { name: 'services', type: 'folder', description: 'Domain services' }
                        ]
                    },
                    {
                        name: 'application',
                        type: 'folder',
                        children: [
                            {
                                name: 'ports',
                                type: 'folder',
                                children: [
                                    { name: 'inbound', type: 'folder', description: 'Driving ports (use cases)' },
                                    { name: 'outbound', type: 'folder', description: 'Driven ports (repositories, gateways)' }
                                ]
                            },
                            { name: 'services', type: 'folder', description: 'Application services' },
                            { name: 'use-cases', type: 'folder', description: 'Use case implementations' }
                        ]
                    }
                ]
            },
            {
                name: 'adapters',
                type: 'folder',
                description: 'Technology-specific implementations',
                children: [
                    {
                        name: 'inbound',
                        type: 'folder',
                        description: 'Driving adapters (entry points)',
                        children: [
                            { name: 'http', type: 'folder', description: 'REST/GraphQL controllers' },
                            { name: 'grpc', type: 'folder', description: 'gRPC handlers' },
                            { name: 'cli', type: 'folder', description: 'CLI commands' },
                            { name: 'events', type: 'folder', description: 'Event consumers' }
                        ]
                    },
                    {
                        name: 'outbound',
                        type: 'folder',
                        description: 'Driven adapters (external resources)',
                        children: [
                            { name: 'persistence', type: 'folder', description: 'Database repositories' },
                            { name: 'messaging', type: 'folder', description: 'Message queue clients' },
                            { name: 'external-apis', type: 'folder', description: 'Third-party API clients' }
                        ]
                    }
                ]
            },
            {
                name: 'config',
                type: 'folder',
                description: 'Application configuration',
                children: [
                    { name: 'dependency-injection', type: 'folder', description: 'DI container setup' }
                ]
            }
        ]
    },

    commonPitfalls: [
        'Leaking adapter types into core - core must not import from adapters',
        'Over-engineering simple operations - not every operation needs full port/adapter',
        'Ports that mirror database schemas - ports defined by application needs',
        'Missing adapter for testing - always create in-memory adapters',
        'Putting business logic in adapters - all logic belongs in core',
        'Confusing driving and driven ports'
    ],

    aiInstructions: `When generating code for Hexagonal Architecture:

CORE ISOLATION:
- Core (domain + application) imports NOTHING from adapters
- Use cases implement inbound ports, call outbound ports
- All framework/library code lives in adapters
- Core is pure TypeScript/Java/Python with no frameworks

PORTS:
- Inbound ports: interfaces that USE CASES implement
- Outbound ports: interfaces that ADAPTERS implement
- Port interfaces defined by application needs, not technology
- Example outbound: UserRepository, EmailGateway, PaymentGateway

ADAPTERS:
- Inbound adapters call use cases (HTTP controller → use case)
- Outbound adapters implement ports (PostgresUserRepository implements UserRepository)
- Create in-memory adapters for testing

DEPENDENCY INJECTION:
- Wire adapters to ports in composition root
- Core knows interfaces, not implementations
- Swap adapters without changing core

TESTING:
- Test core with in-memory adapters only
- Integration tests use real adapters`
};
