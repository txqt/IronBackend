/**
 * Select Command
 * Select architecture style or tech stack
 */

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { getStyleIds, getStackIds, getStyle, getStack } from '@ironbackend/core';
import { buildPromptSections } from '@ironbackend/prompts';

const IRONBACKEND_DIR = '.ironbackend';
const CONFIG_FILE = 'config.json';

/**
 * Create the select command
 */
export function createSelectCommand(): Command {
    const cmd = new Command('select');

    cmd.description('Select architecture style or tech stack');

    // Style subcommand
    cmd
        .command('style [name]')
        .description('Select an architecture style')
        .action(async (name?: string) => {
            await selectStyle(name);
        });

    // Stack subcommand
    cmd
        .command('stack [name]')
        .description('Select a tech stack')
        .action(async (name?: string) => {
            await selectStack(name);
        });

    return cmd;
}

async function selectStyle(name?: string) {
    console.log(chalk.bold.blue('\n🏗️  Select Architecture Style\n'));

    const config = loadConfig();
    if (!config) return;

    let selectedStyle: string;

    if (name) {
        // Validate provided style
        const style = getStyle(name);
        if (!style) {
            console.log(chalk.red(`Unknown style: ${name}`));
            console.log(chalk.yellow('\nAvailable styles:'));
            getStyleIds().forEach(id => {
                const s = getStyle(id)!;
                console.log(chalk.gray(`  - ${id}: ${s.name}`));
            });
            process.exit(1);
        }
        selectedStyle = name;
    } else {
        // Interactive selection
        const styleChoices = getStyleIds().map(id => {
            const style = getStyle(id)!;
            return {
                name: `${chalk.bold(style.name)}\n    ${chalk.gray(style.description.slice(0, 70))}...`,
                value: id,
                short: style.name
            };
        });

        const { style } = await inquirer.prompt([{
            type: 'list',
            name: 'style',
            message: 'Select an architecture style:',
            choices: styleChoices,
            pageSize: 10
        }]);
        selectedStyle = style;
    }

    // Update config
    config.style = selectedStyle;
    config.updatedAt = new Date().toISOString();
    saveConfig(config);

    const style = getStyle(selectedStyle)!;
    console.log(chalk.green(`\n✓ Selected style: ${chalk.bold(style.name)}`));

    // Show style info
    console.log(chalk.bold('\nCore Principles:'));
    style.corePrinciples.slice(0, 3).forEach(p => {
        console.log(chalk.gray(`  • ${p}`));
    });

    // Regenerate prompts if stack is also set
    if (config.stack) {
        await regeneratePrompts(config);
    } else {
        console.log(chalk.yellow('\n⚠️  Select a stack to generate prompts: ironbackend select stack'));
    }
}

async function selectStack(name?: string) {
    console.log(chalk.bold.blue('\n🛠️  Select Tech Stack\n'));

    const config = loadConfig();
    if (!config) return;

    let selectedStack: string;

    if (name) {
        // Validate provided stack
        const stack = getStack(name);
        if (!stack) {
            console.log(chalk.red(`Unknown stack: ${name}`));
            console.log(chalk.yellow('\nAvailable stacks:'));
            getStackIds().forEach(id => {
                const s = getStack(id)!;
                console.log(chalk.gray(`  - ${id}: ${s.name}`));
            });
            process.exit(1);
        }
        selectedStack = name;
    } else {
        // Interactive selection
        const stackChoices = getStackIds().map(id => {
            const stack = getStack(id)!;
            return {
                name: `${chalk.bold(stack.name)}\n    ${chalk.gray(`${stack.language} ${stack.languageVersion} • ${stack.framework}`)}`,
                value: id,
                short: stack.name
            };
        });

        const { stack } = await inquirer.prompt([{
            type: 'list',
            name: 'stack',
            message: 'Select a tech stack:',
            choices: stackChoices
        }]);
        selectedStack = stack;
    }

    // Update config
    config.stack = selectedStack;
    config.updatedAt = new Date().toISOString();
    saveConfig(config);

    const stack = getStack(selectedStack)!;
    console.log(chalk.green(`\n✓ Selected stack: ${chalk.bold(stack.name)}`));

    // Show stack info
    console.log(chalk.bold('\nStack Details:'));
    console.log(chalk.gray(`  • Language: ${stack.language} ${stack.languageVersion}`));
    console.log(chalk.gray(`  • Framework: ${stack.framework} ${stack.frameworkVersion}`));
    console.log(chalk.gray(`  • Database: ${stack.database.type} + ${stack.database.orm}`));

    // Regenerate prompts if style is also set
    if (config.style) {
        await regeneratePrompts(config);
    } else {
        console.log(chalk.yellow('\n⚠️  Select a style to generate prompts: ironbackend select style'));
    }
}

async function regeneratePrompts(config: any) {
    const spinner = ora('Regenerating prompts...').start();

    try {
        const prompts = buildPromptSections({
            styleId: config.style,
            stackId: config.stack
        });

        const cwd = process.cwd();
        const promptsPath = path.join(cwd, IRONBACKEND_DIR, 'prompts');

        fs.mkdirSync(promptsPath, { recursive: true });

        fs.writeFileSync(path.join(promptsPath, 'system-prompt.md'), prompts.combined);
        fs.writeFileSync(path.join(promptsPath, 'style.md'), prompts.style);
        fs.writeFileSync(path.join(promptsPath, 'stack.md'), prompts.stack);
        fs.writeFileSync(path.join(promptsPath, 'rules.md'), prompts.rules);

        // Update Cursor rules
        const cursorPath = path.join(cwd, '.cursor', 'rules');
        fs.mkdirSync(cursorPath, { recursive: true });
        fs.writeFileSync(
            path.join(cursorPath, 'ironbackend.mdc'),
            `---
description: IronBackend - Backend Architecture Intelligence
globs: ["**/*.ts", "**/*.js", "**/*.py", "**/*.java", "**/*.cs"]
---

${prompts.combined}`
        );

        spinner.succeed('Prompts regenerated!');
        console.log(chalk.gray('  Updated: .ironbackend/prompts/system-prompt.md'));
        console.log(chalk.gray('  Updated: .cursor/rules/ironbackend.mdc'));

    } catch (error) {
        spinner.fail('Failed to regenerate prompts');
        console.error(chalk.red(`Error: ${(error as Error).message}`));
    }
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

function saveConfig(config: any) {
    const cwd = process.cwd();
    const configPath = path.join(cwd, IRONBACKEND_DIR, CONFIG_FILE);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}
