import { describe, it, expect } from 'vitest';
import {
    buildPrompt,
    buildPromptSections,
    formatFolderStructure,
    estimateTokenCount,
    generateSystemPrompt,
    generateStylePrompt,
    generateStackPrompt
} from '../src/index.js';
import { getStyle, getStack } from '@ironbackend/core';

describe('@ironbackend/prompts', () => {
    describe('buildPrompt', () => {
        it('should build a complete prompt with valid style and stack', () => {
            const prompt = buildPrompt({
                styleId: 'clean-monolith',
                stackId: 'node-nestjs'
            });

            expect(prompt).toBeTruthy();
            expect(prompt.length).toBeGreaterThan(100);
            expect(prompt).toContain('Clean Monolith');
            expect(prompt).toContain('NestJS');
        });

        it('should throw error for invalid style', () => {
            expect(() => buildPrompt({
                styleId: 'invalid',
                stackId: 'node-nestjs'
            })).toThrow();
        });
    });

    describe('buildPromptSections', () => {
        it('should build separate prompt sections', () => {
            const sections = buildPromptSections({
                styleId: 'hexagonal',
                stackId: 'python-fastapi'
            });

            expect(sections.style).toBeTruthy();
            expect(sections.stack).toBeTruthy();
            expect(sections.rules).toBeTruthy();
            expect(sections.combined).toBeTruthy();
        });
    });

    describe('formatFolderStructure', () => {
        it('should format a folder node correctly', () => {
            const node = {
                name: 'src',
                type: 'folder' as const,
                children: [
                    { name: 'index.ts', type: 'file' as const }
                ]
            };

            const formatted = formatFolderStructure(node);
            expect(formatted).toContain('src');
            expect(formatted).toContain('index.ts');
        });
    });

    describe('estimateTokenCount', () => {
        it('should estimate token count', () => {
            const text = 'Hello world, this is a test.';
            const tokens = estimateTokenCount(text);
            expect(tokens).toBeGreaterThan(0);
            // Rough estimate is 1 token per 4 characters
            expect(tokens).toBe(Math.ceil(text.length / 4));
        });
    });

    describe('generateSystemPrompt', () => {
        it('should generate system prompt with style and stack', () => {
            const style = getStyle('clean-monolith')!;
            const stack = getStack('node-nestjs')!;

            const prompt = generateSystemPrompt({ style, stack });

            expect(prompt).toContain('IronBackend');
            expect(prompt).toContain(style.name);
            expect(prompt).toContain(stack.language);
        });
    });
});
