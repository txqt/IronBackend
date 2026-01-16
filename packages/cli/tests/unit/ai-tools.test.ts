/**
 * Unit Tests for AI Tools Registry
 */

import { describe, it, expect } from 'vitest';
import {
    AI_TOOLS,
    getAITool,
    getAIToolIds,
    formatForAITool,
    type AIToolConfig
} from '../../src/ai-tools.js';

describe('ai-tools', () => {
    describe('AI_TOOLS constant', () => {
        it('should have at least 5 AI tools defined', () => {
            expect(AI_TOOLS.length).toBeGreaterThanOrEqual(5);
        });

        it('each tool should have required properties', () => {
            for (const tool of AI_TOOLS) {
                expect(tool.id).toBeTruthy();
                expect(tool.name).toBeTruthy();
                expect(tool.description).toBeTruthy();
                expect(tool.outputPath).toBeTruthy();
                expect(['mdc', 'md']).toContain(tool.format);
            }
        });

        it('should have unique IDs', () => {
            const ids = AI_TOOLS.map(t => t.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(ids.length);
        });
    });

    describe('getAITool', () => {
        it('should return cursor tool by id', () => {
            const tool = getAITool('cursor');
            expect(tool).toBeDefined();
            expect(tool?.name).toBe('Cursor');
            expect(tool?.format).toBe('mdc');
        });

        it('should return claude tool by id', () => {
            const tool = getAITool('claude');
            expect(tool).toBeDefined();
            expect(tool?.name).toBe('Claude Code');
            expect(tool?.format).toBe('md');
        });

        it('should return undefined for unknown id', () => {
            const tool = getAITool('unknown-tool');
            expect(tool).toBeUndefined();
        });

        it('should return undefined for empty string', () => {
            const tool = getAITool('');
            expect(tool).toBeUndefined();
        });
    });

    describe('getAIToolIds', () => {
        it('should return all tool ids', () => {
            const ids = getAIToolIds();
            expect(ids).toContain('cursor');
            expect(ids).toContain('claude');
            expect(ids).toContain('copilot');
            expect(ids).toContain('windsurf');
        });

        it('should return same number of ids as tools', () => {
            const ids = getAIToolIds();
            expect(ids.length).toBe(AI_TOOLS.length);
        });
    });

    describe('formatForAITool', () => {
        const testContent = '# Test Content\nThis is a test.';

        it('should return content unchanged for md format', () => {
            const tool: AIToolConfig = {
                id: 'test',
                name: 'Test',
                description: 'Test tool',
                outputPath: 'test.md',
                format: 'md'
            };

            const result = formatForAITool(tool, testContent);
            expect(result).toBe(testContent);
        });

        it('should add MDC frontmatter for mdc format', () => {
            const tool: AIToolConfig = {
                id: 'cursor',
                name: 'Cursor',
                description: 'Cursor IDE',
                outputPath: '.cursor/rules/test.mdc',
                format: 'mdc',
                globs: ['**/*.ts']
            };

            const result = formatForAITool(tool, testContent);
            expect(result).toContain('---');
            expect(result).toContain('description: IronBackend');
            expect(result).toContain('globs:');
            expect(result).toContain(testContent);
        });

        it('should use default globs if not specified', () => {
            const tool: AIToolConfig = {
                id: 'test',
                name: 'Test',
                description: 'Test',
                outputPath: 'test.mdc',
                format: 'mdc'
                // no globs specified
            };

            const result = formatForAITool(tool, testContent);
            expect(result).toContain('["**/*"]');
        });
    });
});
