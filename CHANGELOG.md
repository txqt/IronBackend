# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Nothing yet

## [1.0.1] - 2026-01-16

### Added
- **Validation & Security**:
  - Runtime configuration schema validation using Zod
  - Security utilities for input sanitization and path traversal prevention
  - `init` command now validates config before writing
- **Observability**:
  - Structured JSON logging with Pino (pretty-printed in dev)
  - Detailed error reporting for validation failures
- **Testing**:
  - Comprehensive CLI integration test suite
  - Unit tests for internal utilities
- **Architecture**:
  - Configuration migration system implementation
  - Plugin system interfaces for future extensibility

## [1.0.0] - 2026-01-15

### Added

#### @ironbackend/core
- 10 production-grade architecture styles:
  - Clean Monolith
  - Modular Monolith
  - Hexagonal Architecture
  - Event-Driven Architecture
  - CQRS (Command Query Responsibility Segregation)
  - Microservices (Sync)
  - Microservices (Async)
  - Serverless
  - Read-Heavy Optimization
  - Automation/Workflow
- 4 pre-configured tech stacks:
  - Node.js + NestJS + PostgreSQL
  - Java + Spring Boot + PostgreSQL
  - .NET + ASP.NET Core + SQL Server
  - Python + FastAPI + PostgreSQL
- 50+ enforceable design rules across 8 categories
- Security & reliability playbooks with authentication strategies

#### @ironbackend/prompts
- System prompt builder for AI assistants
- Architecture-specific prompt templates
- Stack-aware prompt generation
- Rule formatting utilities

#### ironbackend (CLI)
- `init` command - Initialize IronBackend configuration
- `select` command - Interactive style and stack selection
- `export` command - Export prompts for various AI tools
- `doctor` command - Validate configuration

#### Documentation
- Comprehensive README with usage examples
- Getting started guide
- Contributing guidelines

[Unreleased]: https://github.com/txqt/IronBackend/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/ironbackend/ironbackend/releases/tag/v1.0.0
