/**
 * Config Migration System
 * Handles version upgrades for .ironbackend/config.json
 */

import { ValidatedLocalConfig, safeValidateLocalConfig } from '@ironbackend/core';

// ============================================================================
// Migration Types
// ============================================================================

export interface MigrationFn {
    (config: Record<string, unknown>): Record<string, unknown>;
}

export interface Migration {
    fromVersion: string;
    toVersion: string;
    migrate: MigrationFn;
    description: string;
}

// ============================================================================
// Migration Registry
// ============================================================================

/**
 * Registered migrations in version order
 */
export const migrations: Migration[] = [
    {
        fromVersion: '1.0.0',
        toVersion: '1.0.1',
        description: 'Add security section support',
        migrate: (config) => ({
            ...config,
            version: '1.0.1',
            updatedAt: new Date().toISOString()
        })
    },
    // Future migrations will be added here:
    // {
    //     fromVersion: '1.0.1',
    //     toVersion: '1.1.0',
    //     description: 'Add plugin support',
    //     migrate: (config) => ({
    //         ...config,
    //         version: '1.1.0',
    //         plugins: [],
    //         updatedAt: new Date().toISOString()
    //     })
    // }
];

// ============================================================================
// Migration Functions
// ============================================================================

/**
 * Compare semantic versions
 * @returns -1 if a < b, 0 if a === b, 1 if a > b
 */
export function compareVersions(a: string, b: string): number {
    const partsA = a.split('.').map(Number);
    const partsB = b.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
        const valA = partsA[i] || 0;
        const valB = partsB[i] || 0;
        if (valA < valB) return -1;
        if (valA > valB) return 1;
    }
    return 0;
}

/**
 * Get migrations needed to go from one version to another
 */
export function getMigrationPath(fromVersion: string, toVersion: string): Migration[] {
    const path: Migration[] = [];
    let currentVersion = fromVersion;

    // Sort migrations by fromVersion
    const sortedMigrations = [...migrations].sort((a, b) =>
        compareVersions(a.fromVersion, b.fromVersion)
    );

    while (compareVersions(currentVersion, toVersion) < 0) {
        const nextMigration = sortedMigrations.find(m => m.fromVersion === currentVersion);
        if (!nextMigration) break;

        path.push(nextMigration);
        currentVersion = nextMigration.toVersion;
    }

    return path;
}

/**
 * Migrate config from one version to the latest
 * @param config - Raw config object
 * @param targetVersion - Target version to migrate to
 * @returns Migrated and validated config
 */
export async function migrateConfig(
    config: Record<string, unknown>,
    targetVersion?: string
): Promise<{ config: ValidatedLocalConfig; migrated: boolean; appliedMigrations: string[] }> {
    const currentVersion = config.version as string;
    const target = targetVersion || getLatestVersion();

    // No migration needed
    if (compareVersions(currentVersion, target) >= 0) {
        const result = safeValidateLocalConfig(config);
        if (!result.success) {
            throw new Error(`Config validation failed: ${result.error.message}`);
        }
        return { config: result.data, migrated: false, appliedMigrations: [] };
    }

    // Get and apply migrations
    const migrationPath = getMigrationPath(currentVersion, target);
    let migratedConfig = { ...config };
    const appliedMigrations: string[] = [];

    for (const migration of migrationPath) {
        migratedConfig = migration.migrate(migratedConfig);
        appliedMigrations.push(`${migration.fromVersion} → ${migration.toVersion}: ${migration.description}`);
    }

    // Validate final config
    const result = safeValidateLocalConfig(migratedConfig);
    if (!result.success) {
        throw new Error(`Migrated config validation failed: ${result.error.message}`);
    }

    return {
        config: result.data,
        migrated: appliedMigrations.length > 0,
        appliedMigrations
    };
}

/**
 * Get the latest version from migrations
 */
export function getLatestVersion(): string {
    if (migrations.length === 0) {
        return '1.0.0';
    }

    // Get the highest toVersion
    const versions = migrations.map(m => m.toVersion);
    return versions.reduce((latest, v) =>
        compareVersions(v, latest) > 0 ? v : latest
    );
}

/**
 * Check if config needs migration
 */
export function needsMigration(config: Record<string, unknown>, targetVersion?: string): boolean {
    const currentVersion = config.version as string;
    const target = targetVersion || getLatestVersion();
    return compareVersions(currentVersion, target) < 0;
}
