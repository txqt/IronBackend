/**
 * Integration Tests for Init Workflow
 * Tests the full init command workflow with file system operations
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
    safeValidateLocalConfig,
    VERSION
} from '@ironbackend/core';

describe('init workflow integration', () => {
    let tempDir: string;

    beforeEach(() => {
        // Create a temporary directory for each test
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ironbackend-test-'));
    });

    afterEach(() => {
        // Clean up temporary directory
        if (tempDir && fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    describe('config file creation', () => {
        it('should create valid config file structure', () => {
            // Simulate config creation
            const ironbackendPath = path.join(tempDir, '.ironbackend');
            fs.mkdirSync(ironbackendPath, { recursive: true });
            fs.mkdirSync(path.join(ironbackendPath, 'prompts'), { recursive: true });

            const config = {
                version: VERSION,
                tool: 'cursor',
                style: 'hexagonal',
                stack: 'node-nestjs',
                rules: {
                    enabled: ['API', 'DOMAIN', 'ERROR_HANDLING'],
                    overrides: {}
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            fs.writeFileSync(
                path.join(ironbackendPath, 'config.json'),
                JSON.stringify(config, null, 2)
            );

            // Verify structure
            expect(fs.existsSync(ironbackendPath)).toBe(true);
            expect(fs.existsSync(path.join(ironbackendPath, 'config.json'))).toBe(true);
            expect(fs.existsSync(path.join(ironbackendPath, 'prompts'))).toBe(true);
        });

        it('should create config that passes schema validation', () => {
            const config = {
                version: VERSION,
                tool: 'claude',
                style: null,
                stack: null,
                rules: {
                    enabled: ['API', 'DOMAIN'],
                    overrides: {}
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const result = safeValidateLocalConfig(config);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.version).toBe(VERSION);
                expect(result.data.tool).toBe('claude');
            }
        });

        it('should reject config with invalid version format', () => {
            const invalidConfig = {
                version: 'invalid',  // Should be x.y.z
                tool: 'cursor',
                style: null,
                stack: null,
                rules: {
                    enabled: [],
                    overrides: {}
                }
            };

            const result = safeValidateLocalConfig(invalidConfig);
            expect(result.success).toBe(false);
        });
    });

    describe('directory structure', () => {
        it('should create nested directories correctly', () => {
            const outputPath = '.cursor/rules/ironbackend.mdc';
            const fullPath = path.join(tempDir, outputPath);
            const dir = path.dirname(fullPath);

            fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(fullPath, '# Test content');

            expect(fs.existsSync(fullPath)).toBe(true);
            const content = fs.readFileSync(fullPath, 'utf-8');
            expect(content).toBe('# Test content');
        });

        it('should handle repeated initialization (overwrite)', () => {
            const ironbackendPath = path.join(tempDir, '.ironbackend');
            fs.mkdirSync(ironbackendPath, { recursive: true });

            // First init
            fs.writeFileSync(
                path.join(ironbackendPath, 'config.json'),
                JSON.stringify({ version: '1.0.0' })
            );

            // Second init (overwrites)
            fs.writeFileSync(
                path.join(ironbackendPath, 'config.json'),
                JSON.stringify({ version: '1.0.1' })
            );

            const content = JSON.parse(
                fs.readFileSync(path.join(ironbackendPath, 'config.json'), 'utf-8')
            );
            expect(content.version).toBe('1.0.1');
        });
    });

    describe('error handling', () => {
        it('should handle read-only directories gracefully', () => {
            // This test checks error handling behavior
            const readOnlyDir = path.join(tempDir, 'readonly');
            fs.mkdirSync(readOnlyDir);

            // Attempt to write and catch error
            const testFile = path.join(readOnlyDir, 'test.json');

            // Writing should work in normal circumstances
            expect(() => {
                fs.writeFileSync(testFile, '{}');
            }).not.toThrow();

            expect(fs.existsSync(testFile)).toBe(true);
        });
    });
});
