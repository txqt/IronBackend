/**
 * Doctor Command
 * Validate IronBackend configuration
 */

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { getStyle, getStack, getStyleIds, getStackIds, VERSION } from '@ironbackend/core';

const IRONBACKEND_DIR = '.ironbackend';
const CONFIG_FILE = 'config.json';

interface DoctorCheck {
    name: string;
    status: 'pass' | 'fail' | 'warn';
    message: string;
}

/**
 * Create the doctor command
 */
export function createDoctorCommand(): Command {
    const cmd = new Command('doctor');

    cmd
        .description('Validate IronBackend configuration and check for issues')
        .option('-v, --verbose', 'Show detailed output')
        .action(async (options) => {
            await runDoctor(options);
        });

    return cmd;
}

async function runDoctor(options: { verbose?: boolean }) {
    console.log(chalk.bold.blue('\n🩺 IronBackend Doctor\n'));

    const checks: DoctorCheck[] = [];
    const cwd = process.cwd();

    // Check 1: .ironbackend directory exists
    const ironbackendPath = path.join(cwd, IRONBACKEND_DIR);
    if (fs.existsSync(ironbackendPath)) {
        checks.push({
            name: 'Configuration directory',
            status: 'pass',
            message: '.ironbackend/ directory exists'
        });
    } else {
        checks.push({
            name: 'Configuration directory',
            status: 'fail',
            message: '.ironbackend/ directory not found. Run: ironbackend init'
        });
    }

    // Check 2: config.json exists and is valid
    const configPath = path.join(ironbackendPath, CONFIG_FILE);
    let config: any = null;

    if (fs.existsSync(configPath)) {
        try {
            config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            checks.push({
                name: 'Configuration file',
                status: 'pass',
                message: 'config.json is valid JSON'
            });
        } catch (e) {
            checks.push({
                name: 'Configuration file',
                status: 'fail',
                message: 'config.json is invalid JSON'
            });
        }
    } else {
        checks.push({
            name: 'Configuration file',
            status: 'fail',
            message: 'config.json not found'
        });
    }

    // Check 3: Version compatibility
    if (config) {
        if (config.version === VERSION) {
            checks.push({
                name: 'Version',
                status: 'pass',
                message: `Version ${config.version} is current`
            });
        } else {
            checks.push({
                name: 'Version',
                status: 'warn',
                message: `Config version ${config.version} differs from CLI version ${VERSION}`
            });
        }
    }

    // Check 4: Style is valid
    if (config && config.style) {
        const style = getStyle(config.style);
        if (style) {
            checks.push({
                name: 'Architecture style',
                status: 'pass',
                message: `Style "${style.name}" is valid`
            });
        } else {
            checks.push({
                name: 'Architecture style',
                status: 'fail',
                message: `Unknown style: ${config.style}. Available: ${getStyleIds().join(', ')}`
            });
        }
    } else if (config) {
        checks.push({
            name: 'Architecture style',
            status: 'warn',
            message: 'No style selected. Run: ironbackend select style <name>'
        });
    }

    // Check 5: Stack is valid
    if (config && config.stack) {
        const stack = getStack(config.stack);
        if (stack) {
            checks.push({
                name: 'Tech stack',
                status: 'pass',
                message: `Stack "${stack.name}" is valid`
            });
        } else {
            checks.push({
                name: 'Tech stack',
                status: 'fail',
                message: `Unknown stack: ${config.stack}. Available: ${getStackIds().join(', ')}`
            });
        }
    } else if (config) {
        checks.push({
            name: 'Tech stack',
            status: 'warn',
            message: 'No stack selected. Run: ironbackend select stack <name>'
        });
    }

    // Check 6: Prompts directory exists
    const promptsPath = path.join(ironbackendPath, 'prompts');
    if (fs.existsSync(promptsPath)) {
        const promptFiles = fs.readdirSync(promptsPath);
        if (promptFiles.length > 0) {
            checks.push({
                name: 'Prompt files',
                status: 'pass',
                message: `${promptFiles.length} prompt files generated`
            });
        } else {
            checks.push({
                name: 'Prompt files',
                status: 'warn',
                message: 'Prompts directory is empty. Run: ironbackend export prompts'
            });
        }
    } else {
        checks.push({
            name: 'Prompt files',
            status: 'warn',
            message: 'Prompts directory not found'
        });
    }

    // Check 7: Cursor integration
    const cursorRulesPath = path.join(cwd, '.cursor', 'rules', 'ironbackend.mdc');
    if (fs.existsSync(cursorRulesPath)) {
        checks.push({
            name: 'Cursor integration',
            status: 'pass',
            message: '.cursor/rules/ironbackend.mdc exists'
        });
    } else {
        checks.push({
            name: 'Cursor integration',
            status: 'warn',
            message: 'Cursor rules not found. Run: ironbackend export prompts'
        });
    }

    // Check 8: Prompts are up to date
    if (config && config.style && config.stack && config.updatedAt) {
        const systemPromptPath = path.join(promptsPath, 'system-prompt.md');
        if (fs.existsSync(systemPromptPath)) {
            const promptStat = fs.statSync(systemPromptPath);
            const configDate = new Date(config.updatedAt);

            if (promptStat.mtime >= configDate) {
                checks.push({
                    name: 'Prompt freshness',
                    status: 'pass',
                    message: 'Prompts are up to date'
                });
            } else {
                checks.push({
                    name: 'Prompt freshness',
                    status: 'warn',
                    message: 'Prompts may be outdated. Run: ironbackend export prompts'
                });
            }
        }
    }

    // Print results
    console.log(chalk.bold('Checks:\n'));

    let passCount = 0;
    let warnCount = 0;
    let failCount = 0;

    for (const check of checks) {
        let icon: string;
        let color: typeof chalk;

        switch (check.status) {
            case 'pass':
                icon = '✓';
                color = chalk.green;
                passCount++;
                break;
            case 'warn':
                icon = '⚠';
                color = chalk.yellow;
                warnCount++;
                break;
            case 'fail':
                icon = '✗';
                color = chalk.red;
                failCount++;
                break;
        }

        console.log(color(`  ${icon} ${check.name}`));
        if (options.verbose || check.status !== 'pass') {
            console.log(chalk.gray(`    ${check.message}`));
        }
    }

    // Summary
    console.log(chalk.bold('\nSummary:'));
    console.log(chalk.green(`  ✓ ${passCount} passed`));
    if (warnCount > 0) console.log(chalk.yellow(`  ⚠ ${warnCount} warnings`));
    if (failCount > 0) console.log(chalk.red(`  ✗ ${failCount} failed`));

    if (failCount > 0) {
        console.log(chalk.red('\n❌ Some checks failed. Fix the issues above.'));
        process.exit(1);
    } else if (warnCount > 0) {
        console.log(chalk.yellow('\n⚠️  Some warnings found. Consider addressing them.'));
    } else {
        console.log(chalk.green('\n✅ All checks passed!'));
    }
}
