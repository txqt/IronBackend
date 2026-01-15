import type { ArchitectureStyle } from '../types.js';

/**
 * Modular Monolith Architecture Style
 * Monolith composed of self-contained modules with explicit boundaries
 */
export const modularMonolith: ArchitectureStyle = {
    id: 'modular-monolith',
    name: 'Modular Monolith',
    description: 'Monolith composed of self-contained modules with explicit boundaries. Modules communicate through defined interfaces. Prepares for potential microservices migration.',

    whenToUse: [
        'Preparing for potential microservices migration',
        'Multiple feature teams on one codebase',
        'Need module-level isolation without distributed complexity',
        'Complex domain with clear bounded contexts',
        'Want benefits of modularity with deployment simplicity',
        'Team growing beyond 15 developers'
    ],

    whenNotToUse: [
        'Simple CRUD applications - overhead not justified',
        'Single small team (< 5 developers)',
        'No clear domain boundaries exist',
        'Need independent scaling of components now',
        'Different technology stacks required per component'
    ],

    corePrinciples: [
        'Each module owns its data and schema exclusively',
        'Inter-module communication via public interfaces only',
        'No shared mutable state between modules',
        'Module dependencies must be acyclic',
        'Modules can be extracted to services without rewrites',
        'Shared kernel contains only immutable, stable types'
    ],

    folderStructure: {
        name: 'src',
        type: 'folder',
        children: [
            {
                name: 'modules',
                type: 'folder',
                description: 'Self-contained feature modules',
                children: [
                    {
                        name: 'users',
                        type: 'folder',
                        description: 'User management module',
                        children: [
                            { name: 'api', type: 'folder', description: 'Module HTTP endpoints' },
                            { name: 'application', type: 'folder', description: 'Module use cases' },
                            { name: 'domain', type: 'folder', description: 'Module domain logic' },
                            { name: 'infrastructure', type: 'folder', description: 'Module repositories' },
                            { name: 'index.ts', type: 'file', description: 'Public module API' }
                        ]
                    },
                    {
                        name: 'orders',
                        type: 'folder',
                        description: 'Order management module',
                        children: [
                            { name: 'api', type: 'folder' },
                            { name: 'application', type: 'folder' },
                            { name: 'domain', type: 'folder' },
                            { name: 'infrastructure', type: 'folder' },
                            { name: 'index.ts', type: 'file', description: 'Public module API' }
                        ]
                    },
                    {
                        name: 'payments',
                        type: 'folder',
                        description: 'Payment processing module'
                    }
                ]
            },
            {
                name: 'shared-kernel',
                type: 'folder',
                description: 'Shared domain concepts across modules',
                children: [
                    { name: 'types', type: 'folder', description: 'Shared immutable types' },
                    { name: 'events', type: 'folder', description: 'Cross-module event definitions' }
                ]
            },
            {
                name: 'bootstrap',
                type: 'folder',
                description: 'Application initialization',
                children: [
                    { name: 'modules.ts', type: 'file', description: 'Module registration' },
                    { name: 'server.ts', type: 'file', description: 'HTTP server setup' }
                ]
            }
        ]
    },

    commonPitfalls: [
        'Cross-module database joins - each module should query its own data',
        'Importing internal module files directly - only import from module/index',
        'Shared models that couple modules - duplicate if necessary',
        'Synchronous inter-module calls creating tight coupling - use events',
        'Module circular dependencies - refactor to shared kernel if needed',
        'Growing shared kernel with mutable types - keep it minimal and stable'
    ],

    aiInstructions: `When generating code for Modular Monolith architecture:

MODULE BOUNDARIES:
- Never import from module internals, only from module/index.ts
- Each module has its own database schema/tables
- Modules communicate via events or public interfaces
- No direct database queries across module boundaries

PUBLIC API:
- Module index.ts exports only public types and services
- Keep public API minimal and stable
- Version module interfaces if backward compatibility needed

DATA OWNERSHIP:
- Each module owns its entities completely
- If data is needed cross-module, define events or APIs
- Duplicate read models rather than share

EVENTS:
- Use domain events for cross-module notifications
- Events are fire-and-forget, async
- Event handlers in consuming module

SHARED KERNEL:
- Contains only truly shared, immutable concepts
- Types like Money, Email, UserId can live here
- Never put mutable entities in shared kernel`
};
