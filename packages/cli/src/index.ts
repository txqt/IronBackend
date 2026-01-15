/**
 * IronBackend CLI
 * Backend Architecture Intelligence for AI Coding Assistants
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { VERSION } from '@ironbackend/core';
import {
    createInitCommand,
    createSelectCommand,
    createExportCommand,
    createDoctorCommand
} from './commands/index.js';

const program = new Command();

// ASCII Art Banner
const banner = `
${chalk.bold.blue('╔═══════════════════════════════════════════════════════════╗')}
${chalk.bold.blue('║')}  ${chalk.bold.white('🔧 IronBackend')} ${chalk.gray('- Backend Architecture Intelligence')}     ${chalk.bold.blue('║')}
${chalk.bold.blue('║')}  ${chalk.gray('   Embedded Senior Architect for AI Assistants')}           ${chalk.bold.blue('║')}
${chalk.bold.blue('╚═══════════════════════════════════════════════════════════╝')}
`;

program
    .name('ironbackend')
    .description('Backend Architecture Intelligence for AI Coding Assistants')
    .version(VERSION, '-v, --version', 'Output the current version')
    .addHelpText('before', banner);

// Add commands
program.addCommand(createInitCommand());
program.addCommand(createSelectCommand());
program.addCommand(createExportCommand());
program.addCommand(createDoctorCommand());

// List command - show available styles and stacks
program
    .command('list')
    .description('List available styles and stacks')
    .option('-s, --styles', 'List architecture styles only')
    .option('-t, --stacks', 'List tech stacks only')
    .action(async (options) => {
        const { getStyleIds, getStackIds, getStyle, getStack } = await import('@ironbackend/core');

        if (!options.stacks) {
            console.log(chalk.bold.blue('\n📐 Architecture Styles:\n'));
            getStyleIds().forEach(id => {
                const style = getStyle(id)!;
                console.log(chalk.bold(`  ${id}`));
                console.log(chalk.gray(`    ${style.name} - ${style.description.slice(0, 60)}...`));
            });
        }

        if (!options.styles) {
            console.log(chalk.bold.blue('\n🛠️  Tech Stacks:\n'));
            getStackIds().forEach(id => {
                const stack = getStack(id)!;
                console.log(chalk.bold(`  ${id}`));
                console.log(chalk.gray(`    ${stack.name}`));
            });
        }

        console.log('');
    });

// Info command - show current configuration
program
    .command('info')
    .description('Show current IronBackend configuration')
    .action(async () => {
        const fs = await import('fs');
        const path = await import('path');
        const { getStyle, getStack } = await import('@ironbackend/core');

        const configPath = path.join(process.cwd(), '.ironbackend', 'config.json');

        if (!fs.existsSync(configPath)) {
            console.log(chalk.red('\nIronBackend not initialized. Run: ironbackend init\n'));
            return;
        }

        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

        console.log(chalk.bold.blue('\n📋 Current Configuration\n'));

        console.log(chalk.bold('  Version:'), config.version);

        if (config.style) {
            const style = getStyle(config.style);
            console.log(chalk.bold('  Style:'), style ? style.name : chalk.red(config.style));
        } else {
            console.log(chalk.bold('  Style:'), chalk.yellow('Not selected'));
        }

        if (config.stack) {
            const stack = getStack(config.stack);
            console.log(chalk.bold('  Stack:'), stack ? stack.name : chalk.red(config.stack));
        } else {
            console.log(chalk.bold('  Stack:'), chalk.yellow('Not selected'));
        }

        console.log(chalk.bold('  Rules:'), config.rules?.enabled?.length || 0, 'categories enabled');
        console.log(chalk.bold('  Updated:'), config.updatedAt || 'Unknown');
        console.log('');
    });

// Parse arguments
program.parse();
