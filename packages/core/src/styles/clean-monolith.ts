import type { ArchitectureStyle } from '../types.js';

/**
 * Clean Monolith Architecture Style
 * Single deployable unit with clean internal boundaries
 */
export const cleanMonolith: ArchitectureStyle = {
    id: 'clean-monolith',
    name: 'Clean Monolith',
    description: 'Single deployable unit with clean internal boundaries. Domain logic isolated from infrastructure. Well-suited for small to medium teams that value deployment simplicity.',

    whenToUse: [
        'Team size < 15 developers',
        'Single database is sufficient',
        'Deployment simplicity is priority',
        'Startup or early-stage product',
        'Unclear domain boundaries initially',
        'Rapid iteration required'
    ],

    whenNotToUse: [
        'Multiple teams need independent deployments',
        'Different scaling requirements per component',
        'Regulatory isolation required',
        'Polyglot persistence needed',
        'Team exceeds 15-20 developers'
    ],

    corePrinciples: [
        'Layered architecture: Controller → Service → Repository → Domain',
        'Domain logic must not depend on frameworks',
        'Dependency injection for all external resources',
        'Single source of truth for business rules',
        'Clear separation between I/O and pure logic',
        'Infrastructure concerns at the edges only'
    ],

    folderStructure: {
        name: 'src',
        type: 'folder',
        children: [
            {
                name: 'api',
                type: 'folder',
                description: 'HTTP controllers, middleware, routes',
                children: [
                    { name: 'controllers', type: 'folder', description: 'HTTP request handlers' },
                    { name: 'middleware', type: 'folder', description: 'Request/response interceptors' },
                    { name: 'routes', type: 'folder', description: 'Route definitions' }
                ]
            },
            {
                name: 'application',
                type: 'folder',
                description: 'Use cases, DTOs, application services',
                children: [
                    { name: 'services', type: 'folder', description: 'Application services orchestrating domain' },
                    { name: 'dto', type: 'folder', description: 'Data transfer objects' },
                    { name: 'mappers', type: 'folder', description: 'Entity ↔ DTO mappers' }
                ]
            },
            {
                name: 'domain',
                type: 'folder',
                description: 'Entities, value objects, domain services',
                children: [
                    { name: 'entities', type: 'folder', description: 'Domain entities with identity' },
                    { name: 'value-objects', type: 'folder', description: 'Immutable domain concepts' },
                    { name: 'services', type: 'folder', description: 'Domain services for cross-entity logic' },
                    { name: 'interfaces', type: 'folder', description: 'Repository and gateway interfaces' }
                ]
            },
            {
                name: 'infrastructure',
                type: 'folder',
                description: 'Database, external APIs, messaging',
                children: [
                    { name: 'database', type: 'folder', description: 'Repository implementations, migrations' },
                    { name: 'external', type: 'folder', description: 'External API clients' },
                    { name: 'config', type: 'folder', description: 'Configuration loading' }
                ]
            },
            {
                name: 'shared',
                type: 'folder',
                description: 'Cross-cutting concerns',
                children: [
                    { name: 'errors', type: 'folder', description: 'Custom error types' },
                    { name: 'utils', type: 'folder', description: 'Utility functions' },
                    { name: 'types', type: 'folder', description: 'Shared type definitions' }
                ]
            }
        ]
    },

    commonPitfalls: [
        'Mixing domain logic in controllers - controllers should only handle HTTP concerns',
        'Direct database access from application layer - always go through repositories',
        'Circular dependencies between layers - dependencies flow inward only',
        'Framework-specific code in domain layer - domain must be framework-agnostic',
        'Anemic domain model - entities should have behavior, not just data',
        'Fat services that do everything - keep services focused on orchestration'
    ],

    aiInstructions: `When generating code for Clean Monolith architecture:

STRUCTURE:
- Controllers handle HTTP only, delegate to application services
- Application services orchestrate domain logic, never access DB directly
- Repositories implement domain interfaces defined in domain layer
- Domain entities have no framework annotations or decorators

DEPENDENCIES:
- api → application → domain ← infrastructure
- Never import from infrastructure in domain
- All external dependencies injected via interfaces

PATTERNS:
- Use constructor injection for all dependencies
- Return domain entities from repositories, not database records
- Map to DTOs only at API boundaries
- Validate input at controller level, invariants in domain

TESTING:
- Unit test domain logic in isolation
- Mock repositories for application service tests
- Integration test API endpoints with real database`
};
