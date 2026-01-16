/**
 * IronBackend Core Types
 * Shared type definitions for architecture styles, stacks, rules, and security
 */

// ============================================================================
// Architecture Styles
// ============================================================================

export interface ArchitectureStyle {
    id: string;
    name: string;
    description: string;
    whenToUse: string[];
    whenNotToUse: string[];
    corePrinciples: string[];
    folderStructure: FolderNode;
    commonPitfalls: string[];
    aiInstructions: string;
}

export interface FolderNode {
    name: string;
    type: 'folder' | 'file';
    description?: string;
    children?: FolderNode[];
}

// ============================================================================
// Tech Stacks
// ============================================================================

export interface TechStack {
    id: string;
    name: string;
    language: string;
    languageVersion: string;
    framework: string;
    frameworkVersion: string;
    database: DatabaseConfig;
    messaging: MessagingConfig;
    authentication: string;
    logging: string;
    testing: TestingConfig;
    deployment: string[];
    conventions: string[];
}

export interface DatabaseConfig {
    type: string;
    orm: string;
    driver?: string;
}

export interface MessagingConfig {
    type: string;
    provider: string;
}

export interface TestingConfig {
    unit: string;
    integration: string;
    e2e?: string;
    coverageTarget: number;
}

// ============================================================================
// Design Rules
// ============================================================================

export type RuleSeverity = 'ERROR' | 'WARN';

export type RuleCategory =
    | 'API'
    | 'DOMAIN'
    | 'ERROR_HANDLING'
    | 'TRANSACTIONS'
    | 'DATA_ACCESS'
    | 'NAMING'
    | 'VALIDATION'
    | 'ASYNC';

export interface DesignRule {
    id: string;
    category: RuleCategory;
    rule: string;
    severity: RuleSeverity;
    rationale?: string;
    examples?: RuleExample[];
}

export interface RuleExample {
    type: 'good' | 'bad';
    code: string;
    explanation?: string;
}

// ============================================================================
// Security
// ============================================================================

export type AuthStrategy = 'JWT' | 'SESSION' | 'API_KEY' | 'OAUTH2' | 'MTLS';
export type AuthorizationModel = 'RBAC' | 'ABAC';

export interface AuthConfig {
    strategy: AuthStrategy;
    useWhen: string[];
    implementation: string[];
}

export interface SecurityPlaybook {
    authentication: AuthConfig[];
    authorization: AuthorizationDescription;
    rateLimiting: RateLimitConfig;
    idempotency: IdempotencyConfig;
    retryStrategy: RetryConfig;
    circuitBreaker: CircuitBreakerConfig;
    auditLogging: AuditConfig;
    failurePhilosophy: string[];
}

export interface AuthorizationDescription {
    rbac: AuthModelDescription;
    abac: AuthModelDescription;
    decisionMatrix: Record<string, { rbac: string; abac: string }>;
}

export interface AuthModelDescription {
    description: string;
    checkPattern: string;
    goodFor: string[];
}

export interface RateLimitConfig {
    windowType: string;
    defaultLimit: string;
    anonymousLimit: string;
    headers: string[];
    responseCode: number;
}

export interface IdempotencyConfig {
    headerName: string;
    keyFormat: string;
    storageDuration: string;
    implementation: string[];
}

export interface RetryConfig {
    baseDelay: string;
    multiplier: number;
    maxRetries: number;
    maxDelay: string;
    jitter: string;
    retryOn: number[];
    doNotRetryOn: number[];
}

export interface CircuitBreakerConfig {
    states: string[];
    failureThreshold: number;
    successThreshold: number;
    timeout: string;
    monitoringWindow: string;
}

export interface AuditConfig {
    requiredEvents: string[];
    logFormat: Record<string, string>;
}

// ============================================================================
// Configuration
// ============================================================================

export interface IronBackendConfig {
    version: string;
    style?: string;
    stack?: string;
    rules: {
        enabled: RuleCategory[];
        overrides: Record<string, RuleSeverity>;
    };
    security: {
        authStrategy?: AuthStrategy;
        authorizationModel?: AuthorizationModel;
    };
    plugins?: string[];
}

// ============================================================================
// Plugin System
// ============================================================================

/**
 * Plugin interface for extending IronBackend
 * Allows adding custom styles, stacks, and rules
 */
export interface IronBackendPlugin {
    /** Unique plugin identifier */
    name: string;
    /** Plugin version (semver) */
    version: string;
    /** Human-readable description */
    description?: string;
    /** Custom architecture styles */
    styles?: ArchitectureStyle[];
    /** Custom tech stacks */
    stacks?: TechStack[];
    /** Custom design rules */
    rules?: DesignRule[];
    /** Lifecycle hook: called when plugin is loaded */
    onLoad?: () => void | Promise<void>;
    /** Lifecycle hook: called when plugin is unloaded */
    onUnload?: () => void | Promise<void>;
}

/**
 * Plugin metadata for the registry
 */
export interface PluginMetadata {
    name: string;
    version: string;
    description?: string;
    path: string;
    enabled: boolean;
    loadedAt?: Date;
}

/**
 * Plugin registry for managing loaded plugins
 */
export interface PluginRegistry {
    /** All registered plugins */
    plugins: Map<string, IronBackendPlugin>;
    /** Plugin metadata */
    metadata: Map<string, PluginMetadata>;
    /** Register a new plugin */
    register: (plugin: IronBackendPlugin, path: string) => void;
    /** Unregister a plugin by name */
    unregister: (name: string) => boolean;
    /** Get a plugin by name */
    get: (name: string) => IronBackendPlugin | undefined;
    /** Get all styles from plugins */
    getAllStyles: () => ArchitectureStyle[];
    /** Get all stacks from plugins */
    getAllStacks: () => TechStack[];
    /** Get all rules from plugins */
    getAllRules: () => DesignRule[];
}

