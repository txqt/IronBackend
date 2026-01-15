/**
 * IronBackend Tech Stack Presets
 * Pre-configured technology stack definitions
 */

import type { TechStack } from '../types.js';

/**
 * Node.js + NestJS + PostgreSQL Stack
 */
export const nodeNestjs: TechStack = {
    id: 'node-nestjs',
    name: 'Node.js + NestJS + PostgreSQL',
    language: 'TypeScript',
    languageVersion: '5.3+',
    framework: 'NestJS',
    frameworkVersion: '10.x',
    database: {
        type: 'PostgreSQL',
        orm: 'Prisma',
        driver: 'pg'
    },
    messaging: {
        type: 'Queue',
        provider: 'BullMQ (Redis-backed)'
    },
    authentication: 'Passport.js + JWT',
    logging: 'Pino (structured JSON)',
    testing: {
        unit: 'Jest',
        integration: 'Supertest',
        e2e: 'Jest + Supertest',
        coverageTarget: 80
    },
    deployment: ['Docker', 'Kubernetes'],
    conventions: [
        'Use NestJS modules for feature boundaries',
        'DTOs with class-validator decorators',
        'Repositories as providers, not raw Prisma in services',
        'Custom exceptions extending HttpException',
        'Guards for authentication, interceptors for logging',
        'ConfigService for environment variables'
    ]
};

/**
 * Java + Spring Boot Stack
 */
export const javaSpring: TechStack = {
    id: 'java-spring',
    name: 'Java + Spring Boot',
    language: 'Java',
    languageVersion: '21 (LTS)',
    framework: 'Spring Boot',
    frameworkVersion: '3.x',
    database: {
        type: 'PostgreSQL',
        orm: 'Spring Data JPA',
        driver: 'HikariCP'
    },
    messaging: {
        type: 'AMQP/Kafka',
        provider: 'Spring AMQP (RabbitMQ) or Spring Kafka'
    },
    authentication: 'Spring Security + OAuth2',
    logging: 'SLF4J + Logback',
    testing: {
        unit: 'JUnit 5',
        integration: 'Testcontainers',
        e2e: 'Spring MockMvc',
        coverageTarget: 80
    },
    deployment: ['Docker', 'Kubernetes'],
    conventions: [
        'Use records for DTOs (Java 16+)',
        'Repositories extend JpaRepository',
        'Services annotated with @Service',
        'Controllers use @RestController',
        'Validation via @Valid and jakarta.validation',
        'Configuration properties with @ConfigurationProperties',
        'Use Optional for nullable returns',
        'Prefer constructor injection over field injection'
    ]
};

/**
 * .NET + ASP.NET Core Stack
 */
export const dotnetAspnetcore: TechStack = {
    id: 'dotnet-aspnetcore',
    name: '.NET + ASP.NET Core',
    language: 'C#',
    languageVersion: '12 / .NET 8',
    framework: 'ASP.NET Core',
    frameworkVersion: '8.0',
    database: {
        type: 'PostgreSQL',
        orm: 'Entity Framework Core',
        driver: 'Npgsql'
    },
    messaging: {
        type: 'Queue',
        provider: 'MassTransit (RabbitMQ or Azure Service Bus)'
    },
    authentication: 'ASP.NET Identity + JWT Bearer',
    logging: 'Serilog',
    testing: {
        unit: 'xUnit',
        integration: 'WebApplicationFactory',
        e2e: 'xUnit + WireMock',
        coverageTarget: 80
    },
    deployment: ['Docker', 'Kubernetes', 'Azure App Service'],
    conventions: [
        'Use Minimal APIs or Controllers based on complexity',
        'Record types for DTOs',
        'Repository pattern with EF Core',
        'MediatR for CQRS when needed',
        'FluentValidation for input validation',
        'Options pattern for configuration',
        'Dependency injection via built-in container',
        'Use nullable reference types'
    ]
};

/**
 * Python + FastAPI Stack
 */
export const pythonFastapi: TechStack = {
    id: 'python-fastapi',
    name: 'Python + FastAPI',
    language: 'Python',
    languageVersion: '3.11+',
    framework: 'FastAPI',
    frameworkVersion: '0.100+',
    database: {
        type: 'PostgreSQL',
        orm: 'SQLAlchemy 2.0',
        driver: 'asyncpg'
    },
    messaging: {
        type: 'Queue',
        provider: 'Celery (Redis) or arq'
    },
    authentication: 'FastAPI Security + python-jose',
    logging: 'structlog',
    testing: {
        unit: 'pytest',
        integration: 'pytest + httpx',
        e2e: 'pytest-asyncio',
        coverageTarget: 80
    },
    deployment: ['Docker', 'Kubernetes'],
    conventions: [
        'Pydantic models for request/response schemas',
        'Async endpoints by default',
        'Dependency injection via FastAPI Depends',
        'SQLAlchemy models separate from Pydantic schemas',
        'Use dataclasses for domain entities',
        'Type hints everywhere',
        'Alembic for database migrations',
        'Virtual environments with poetry or uv'
    ]
};

/**
 * All available stacks
 */
export const stacks: Record<string, TechStack> = {
    'node-nestjs': nodeNestjs,
    'java-spring': javaSpring,
    'dotnet-aspnetcore': dotnetAspnetcore,
    'python-fastapi': pythonFastapi,
};

/**
 * Get a stack by ID
 */
export function getStack(id: string): TechStack | undefined {
    return stacks[id];
}

/**
 * Get all stack IDs
 */
export function getStackIds(): string[] {
    return Object.keys(stacks);
}

/**
 * Find stacks by language
 */
export function findStacksByLanguage(language: string): TechStack[] {
    const normalizedLang = language.toLowerCase();
    return Object.values(stacks).filter(stack =>
        stack.language.toLowerCase().includes(normalizedLang)
    );
}
