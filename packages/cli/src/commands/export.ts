/**
 * Export Command
 * Export prompts to various formats
 */

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { getStyle, getStack } from '@ironbackend/core';
import { buildPromptSections } from '@ironbackend/prompts';

const IRONBACKEND_DIR = '.ironbackend';
const CONFIG_FILE = 'config.json';

/**
 * Create the export command
 */
export function createExportCommand(): Command {
    const cmd = new Command('export');

    cmd.description('Export prompts and configurations');

    // Export prompts
    cmd
        .command('prompts')
        .description('Export AI prompt files')
        .option('-o, --output <dir>', 'Output directory', '.ironbackend/prompts')
        .option('-f, --format <format>', 'Output format (markdown, cursor, claude)', 'all')
        .action(async (options) => {
            await exportPrompts(options);
        });

    // Export config
    cmd
        .command('config')
        .description('Export current configuration')
        .option('-o, --output <file>', 'Output file', 'ironbackend.config.json')
        .action(async (options) => {
            await exportConfig(options);
        });

    return cmd;
}

async function exportPrompts(options: { output: string; format: string }) {
    console.log(chalk.bold.blue('\n📤 Exporting Prompts\n'));

    const config = loadConfig();
    if (!config.style || !config.stack) {
        console.log(chalk.red('Style and stack must be selected before exporting.'));
        console.log(chalk.yellow('Run: ironbackend select style <name>'));
        console.log(chalk.yellow('Run: ironbackend select stack <name>'));
        process.exit(1);
    }

    const spinner = ora('Generating prompts...').start();

    try {
        const prompts = buildPromptSections({
            styleId: config.style,
            stackId: config.stack,
            ruleCategories: config.rules?.enabled || undefined
        });

        const cwd = process.cwd();
        const outputPath = path.resolve(cwd, options.output);
        fs.mkdirSync(outputPath, { recursive: true });

        // Export based on format
        if (options.format === 'all' || options.format === 'markdown') {
            fs.writeFileSync(path.join(outputPath, 'system-prompt.md'), prompts.combined);
            fs.writeFileSync(path.join(outputPath, 'style.md'), prompts.style);
            fs.writeFileSync(path.join(outputPath, 'stack.md'), prompts.stack);
            fs.writeFileSync(path.join(outputPath, 'rules.md'), prompts.rules);
        }

        if (options.format === 'all' || options.format === 'cursor') {
            const cursorPath = path.join(cwd, '.cursor', 'rules');
            fs.mkdirSync(cursorPath, { recursive: true });

            const cursorPrompt = `---
description: IronBackend - Backend Architecture Intelligence
globs: ["**/*.ts", "**/*.js", "**/*.py", "**/*.java", "**/*.cs", "**/*.go"]
---

${prompts.combined}`;

            fs.writeFileSync(path.join(cursorPath, 'ironbackend.mdc'), cursorPrompt);
            fs.writeFileSync(path.join(outputPath, 'cursor-rules.mdc'), cursorPrompt);
        }

        if (options.format === 'all' || options.format === 'claude') {
            const claudePrompt = `# Claude Project Prompt - IronBackend

${prompts.combined}

---

## How to Use

Copy this entire prompt to your Claude project's custom instructions or include it at the start of your conversation.`;

            fs.writeFileSync(path.join(outputPath, 'claude-project.md'), claudePrompt);
        }

        // Generate Copilot instructions
        if (options.format === 'all') {
            const copilotPrompt = `# GitHub Copilot Custom Instructions

## Architecture: ${getStyle(config.style)!.name}
## Stack: ${getStack(config.stack)!.name}

${prompts.style}

---

${prompts.rules}`;

            fs.writeFileSync(path.join(outputPath, 'copilot-instructions.md'), copilotPrompt);
        }

        spinner.succeed('Prompts exported successfully!');

        console.log(chalk.bold('\n📁 Exported files:'));
        const files = fs.readdirSync(outputPath);
        files.forEach(file => {
            const stats = fs.statSync(path.join(outputPath, file));
            const size = (stats.size / 1024).toFixed(1);
            console.log(chalk.gray(`  ${file} (${size} KB)`));
        });

        if (options.format === 'all' || options.format === 'cursor') {
            console.log(chalk.gray(`  .cursor/rules/ironbackend.mdc`));
        }

        console.log(chalk.bold('\n🚀 Usage:'));
        console.log(chalk.cyan('  Cursor: Rules automatically applied from .cursor/rules/'));
        console.log(chalk.cyan('  Claude: Copy claude-project.md to project instructions'));
        console.log(chalk.cyan('  Copilot: Copy copilot-instructions.md to .github/copilot-instructions.md'));

    } catch (error) {
        spinner.fail('Export failed');
        console.error(chalk.red(`Error: ${(error as Error).message}`));
        process.exit(1);
    }
}

async function exportConfig(options: { output: string }) {
    console.log(chalk.bold.blue('\n📤 Exporting Configuration\n'));

    const config = loadConfig();
    const cwd = process.cwd();
    const outputPath = path.resolve(cwd, options.output);

    const exportedConfig = {
        $schema: 'https://ironbackend.dev/schema/config.json',
        version: config.version,
        style: config.style,
        stack: config.stack,
        rules: config.rules,
        exportedAt: new Date().toISOString()
    };

    fs.writeFileSync(outputPath, JSON.stringify(exportedConfig, null, 2));

    console.log(chalk.green(`✓ Configuration exported to: ${outputPath}`));
}

function loadConfig(): any {
    const cwd = process.cwd();
    const configPath = path.join(cwd, IRONBACKEND_DIR, CONFIG_FILE);

    if (!fs.existsSync(configPath)) {
        console.log(chalk.red('IronBackend not initialized. Run: ironbackend init'));
        process.exit(1);
    }

    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}
