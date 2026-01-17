import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'json-summary', 'html'],
            reportsDirectory: './coverage',
            exclude: [
                'node_modules',
                'dist',
                'tests'
            ],
            thresholds: {
                lines: 50,
                functions: 20,
                branches: 10,
                statements: 50
            }
        }
    },
});
