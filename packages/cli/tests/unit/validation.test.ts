/**
 * Unit Tests for CLI Validation Utilities
 */

import { describe, it, expect } from 'vitest';
import path from 'path';
import {
    sanitizeFilePath,
    sanitizeInput,
    isValidIdentifier,
    validateCliArgs,
    formatCliError
} from '../../src/utils/validation.js';
import { ZodError } from 'zod';

describe('validation utilities', () => {
    describe('sanitizeFilePath', () => {
        // Use a platform-appropriate base directory
        const baseDir = path.resolve(process.cwd(), 'test_project');
        const isWindows = path.sep === '\\';

        it('should allow paths within base directory', () => {
            const result = sanitizeFilePath('src/index.ts', baseDir);
            expect(result).toContain('src');
            expect(result).toContain('index.ts');
            // Check that it's a subpath of baseDir
            expect(result.startsWith(baseDir)).toBe(true);
        });

        it('should reject path traversal attempts', () => {
            expect(() => sanitizeFilePath('../../../etc/passwd', baseDir))
                .toThrow('path traversal detected');
        });

        it('should reject absolute paths outside base', () => {
            // Use a definitely different root/drive
            const outsidePath = isWindows ? 'D:\\other\\path' : '/other/path';
            expect(() => sanitizeFilePath(outsidePath, baseDir))
                .toThrow('path traversal detected');
        });

        it('should allow base directory itself', () => {
            const result = sanitizeFilePath('.', baseDir);
            expect(result).toBe(baseDir);
        });
    });

    describe('sanitizeInput', () => {
        it('should trim whitespace', () => {
            expect(sanitizeInput('  test  ')).toBe('test');
        });

        it('should remove null bytes', () => {
            expect(sanitizeInput('test\x00malicious')).toBe('testmalicious');
        });

        it('should remove control characters', () => {
            expect(sanitizeInput('test\x1fchar')).toBe('testchar');
        });

        it('should preserve normal characters', () => {
            expect(sanitizeInput('hello-world_123')).toBe('hello-world_123');
        });
    });

    describe('isValidIdentifier', () => {
        it('should accept valid identifiers', () => {
            expect(isValidIdentifier('myStyle')).toBe(true);
            expect(isValidIdentifier('clean-monolith')).toBe(true);
            expect(isValidIdentifier('node_nestjs')).toBe(true);
            expect(isValidIdentifier('Style123')).toBe(true);
        });

        it('should reject identifiers starting with numbers', () => {
            expect(isValidIdentifier('123style')).toBe(false);
        });

        it('should reject identifiers starting with special chars', () => {
            expect(isValidIdentifier('-style')).toBe(false);
            expect(isValidIdentifier('_style')).toBe(false);
        });

        it('should reject identifiers with spaces', () => {
            expect(isValidIdentifier('my style')).toBe(false);
        });
    });

    describe('validateCliArgs', () => {
        it('should validate correct args', () => {
            const result = validateCliArgs({
                styleId: 'hexagonal',
                stackId: 'node-nestjs'
            });
            expect(result.styleId).toBe('hexagonal');
            expect(result.stackId).toBe('node-nestjs');
        });

        it('should throw for invalid styleId format', () => {
            expect(() => validateCliArgs({ styleId: 'Invalid Style' }))
                .toThrow(ZodError);
        });

        it('should allow optional fields', () => {
            const result = validateCliArgs({});
            expect(result.styleId).toBeUndefined();
            expect(result.stackId).toBeUndefined();
        });
    });

    describe('formatCliError', () => {
        it('should format Zod errors for display', () => {
            try {
                validateCliArgs({ styleId: 'INVALID STYLE' });
            } catch (error) {
                const formatted = formatCliError(error as ZodError);
                expect(formatted).toContain('Validation error');
                expect(formatted).toContain('styleId');
            }
        });
    });
});
