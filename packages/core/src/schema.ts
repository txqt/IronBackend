/**
 * IronBackend Configuration Schema
 * Runtime validation using Zod
 */

import { z } from 'zod';

// ============================================================================
// Rule Categories and Severities
// ============================================================================

export const RuleSeveritySchema = z.enum(['ERROR', 'WARN']);

export const RuleCategorySchema = z.enum([
    'API',
    'DOMAIN',
    'ERROR_HANDLING',
    'TRANSACTIONS',
    'DATA_ACCESS',
    'NAMING',
    'VALIDATION',
    'ASYNC'
]);

// ============================================================================
// Configuration Schema
// ============================================================================

export const RulesConfigSchema = z.object({
    enabled: z.array(z.string()),
    overrides: z.record(z.string())
});

export const SecurityConfigSchema = z.object({
    authStrategy: z.enum(['JWT', 'SESSION', 'API_KEY', 'OAUTH2', 'MTLS']).optional(),
    authorizationModel: z.enum(['RBAC', 'ABAC']).optional()
});

/**
 * Schema for .ironbackend/config.json
 */
export const IronBackendLocalConfigSchema = z.object({
    version: z.string().regex(/^\d+\.\d+\.\d+$/, {
        message: 'Version must be in format x.y.z (e.g., 1.0.0)'
    }),
    tool: z.string().nullable(),
    style: z.string().nullable(),
    stack: z.string().nullable(),
    rules: RulesConfigSchema,
    createdAt: z.string().optional(),
    updatedAt: z.string().optional()
});

/**
 * Full IronBackend configuration schema
 */
export const IronBackendConfigSchema = z.object({
    version: z.string(),
    style: z.string().optional(),
    stack: z.string().optional(),
    rules: z.object({
        enabled: z.array(RuleCategorySchema),
        overrides: z.record(RuleSeveritySchema)
    }),
    security: SecurityConfigSchema.optional()
});

// ============================================================================
// Type Exports
// ============================================================================

export type ValidatedLocalConfig = z.infer<typeof IronBackendLocalConfigSchema>;
export type ValidatedConfig = z.infer<typeof IronBackendConfigSchema>;

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate and parse local config file
 * @param config - Raw config object to validate
 * @returns Validated config object
 * @throws ZodError if validation fails
 */
export function validateLocalConfig(config: unknown): ValidatedLocalConfig {
    return IronBackendLocalConfigSchema.parse(config);
}

/**
 * Safely validate local config without throwing
 * @param config - Raw config object to validate  
 * @returns Result object with success/error
 */
export function safeValidateLocalConfig(config: unknown): z.SafeParseReturnType<unknown, ValidatedLocalConfig> {
    return IronBackendLocalConfigSchema.safeParse(config);
}

/**
 * Validate full IronBackend config
 * @param config - Raw config object to validate
 * @returns Validated config object
 * @throws ZodError if validation fails
 */
export function validateConfig(config: unknown): ValidatedConfig {
    return IronBackendConfigSchema.parse(config);
}

/**
 * Format Zod validation errors for user display
 * @param error - Zod error object
 * @returns Formatted error message
 */
export function formatValidationError(error: z.ZodError): string {
    return error.issues
        .map(issue => `  - ${issue.path.join('.')}: ${issue.message}`)
        .join('\n');
}
