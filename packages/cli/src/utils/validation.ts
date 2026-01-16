/**
 * CLI Validation Utilities
 * Security and input validation functions
 */

import path from 'path';
import { z, ZodError } from 'zod';

/**
 * Sanitize file path to prevent path traversal attacks
 * @param userPath - User-provided path
 * @param baseDir - Base directory that paths must stay within
 * @returns Resolved safe path
 * @throws Error if path traversal is detected
 */
export function sanitizeFilePath(userPath: string, baseDir: string): string {
    // Normalize paths to handle different separators
    const normalizedBase = path.resolve(baseDir);
    const resolved = path.resolve(baseDir, userPath);

    // Check if resolved path is within the base directory
    if (!resolved.startsWith(normalizedBase + path.sep) && resolved !== normalizedBase) {
        throw new Error('Invalid file path: path traversal detected');
    }

    return resolved;
}

/**
 * Sanitize user input string
 * Removes potentially dangerous characters and trims whitespace
 * @param input - Raw user input
 * @returns Sanitized input string
 */
export function sanitizeInput(input: string): string {
    // Remove null bytes and other control characters
    const cleaned = input.replace(/[\x00-\x1f\x7f]/g, '');
    // Trim whitespace
    return cleaned.trim();
}

/**
 * Validate that a string is a valid identifier (alphanumeric, hyphens, underscores)
 * @param identifier - String to validate
 * @returns True if valid identifier
 */
export function isValidIdentifier(identifier: string): boolean {
    return /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(identifier);
}

/**
 * Schema for validating CLI command arguments
 */
export const CliArgsSchema = z.object({
    styleId: z.string().regex(/^[a-z][a-z0-9-]*$/).optional(),
    stackId: z.string().regex(/^[a-z][a-z0-9-]*$/).optional(),
    toolId: z.string().regex(/^[a-z][a-z0-9-]*$/).optional(),
    outputPath: z.string().optional()
});

export type CliArgs = z.infer<typeof CliArgsSchema>;

/**
 * Validate CLI arguments
 * @param args - Raw arguments to validate
 * @returns Validated arguments
 * @throws ZodError if validation fails
 */
export function validateCliArgs(args: unknown): CliArgs {
    return CliArgsSchema.parse(args);
}

/**
 * Format validation errors for CLI display
 * @param error - Zod validation error
 * @returns User-friendly error message
 */
export function formatCliError(error: ZodError): string {
    const issues = error.issues.map(issue => {
        const path = issue.path.join('.');
        return `  • ${path}: ${issue.message}`;
    });
    return `Validation error:\n${issues.join('\n')}`;
}

/**
 * Validate that a directory exists and is writable
 * @param dirPath - Directory path to validate
 * @returns True if directory exists and is accessible
 */
export async function validateDirectory(dirPath: string): Promise<boolean> {
    try {
        const fs = await import('fs/promises');
        const stats = await fs.stat(dirPath);
        return stats.isDirectory();
    } catch {
        return false;
    }
}
