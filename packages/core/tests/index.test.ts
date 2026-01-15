import { describe, it, expect } from 'vitest';
import {
    getStyle,
    getStyleIds,
    getStack,
    getStackIds,
    allRules,
    getErrorRules,
    securityPlaybook,
    VERSION
} from '../src/index.js';

describe('@ironbackend/core', () => {
    describe('styles', () => {
        it('should have 10 architecture styles', () => {
            const styleIds = getStyleIds();
            expect(styleIds).toHaveLength(10);
        });

        it('should return a valid style by id', () => {
            const style = getStyle('clean-monolith');
            expect(style).toBeDefined();
            expect(style?.name).toBe('Clean Monolith');
            expect(style?.corePrinciples.length).toBeGreaterThan(0);
            expect(style?.folderStructure).toBeDefined();
        });

        it('should return undefined for invalid style id', () => {
            const style = getStyle('invalid-style');
            expect(style).toBeUndefined();
        });

        it('each style should have required properties', () => {
            const styleIds = getStyleIds();
            for (const id of styleIds) {
                const style = getStyle(id);
                expect(style).toBeDefined();
                expect(style?.id).toBe(id);
                expect(style?.name).toBeTruthy();
                expect(style?.description).toBeTruthy();
                expect(style?.whenToUse.length).toBeGreaterThan(0);
                expect(style?.whenNotToUse.length).toBeGreaterThan(0);
                expect(style?.corePrinciples.length).toBeGreaterThan(0);
                expect(style?.commonPitfalls.length).toBeGreaterThan(0);
                expect(style?.aiInstructions).toBeTruthy();
            }
        });
    });

    describe('stacks', () => {
        it('should have 4 tech stacks', () => {
            const stackIds = getStackIds();
            expect(stackIds).toHaveLength(4);
        });

        it('should return a valid stack by id', () => {
            const stack = getStack('node-nestjs');
            expect(stack).toBeDefined();
            expect(stack?.name).toBe('Node.js + NestJS + PostgreSQL');
            expect(stack?.language).toBe('TypeScript');
        });

        it('should return undefined for invalid stack id', () => {
            const stack = getStack('invalid-stack');
            expect(stack).toBeUndefined();
        });

        it('each stack should have required properties', () => {
            const stackIds = getStackIds();
            for (const id of stackIds) {
                const stack = getStack(id);
                expect(stack).toBeDefined();
                expect(stack?.id).toBe(id);
                expect(stack?.name).toBeTruthy();
                expect(stack?.language).toBeTruthy();
                expect(stack?.framework).toBeTruthy();
                expect(stack?.database).toBeDefined();
                expect(stack?.testing).toBeDefined();
            }
        });
    });

    describe('rules', () => {
        it('should have at least 50 design rules', () => {
            expect(allRules.length).toBeGreaterThanOrEqual(50);
        });

        it('should have error rules', () => {
            const errorRules = getErrorRules();
            expect(errorRules.length).toBeGreaterThan(0);
            errorRules.forEach(rule => {
                expect(rule.severity).toBe('ERROR');
            });
        });

        it('each rule should have required properties', () => {
            for (const rule of allRules) {
                expect(rule.id).toBeTruthy();
                expect(rule.category).toBeTruthy();
                expect(rule.rule).toBeTruthy();
                expect(['ERROR', 'WARN']).toContain(rule.severity);
            }
        });
    });

    describe('security', () => {
        it('should have security playbook', () => {
            expect(securityPlaybook).toBeDefined();
            expect(securityPlaybook.authentication.length).toBeGreaterThan(0);
            expect(securityPlaybook.authorization).toBeDefined();
            expect(securityPlaybook.rateLimiting).toBeDefined();
            expect(securityPlaybook.retryStrategy).toBeDefined();
        });
    });

    describe('version', () => {
        it('should export VERSION', () => {
            expect(VERSION).toBe('1.0.1');
        });
    });
});
