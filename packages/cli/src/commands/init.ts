/**
 * Init Command
 * Initialize IronBackend in a project for a specific AI tool
 */

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import {
    getStyleIds,
    getStackIds,
    getStyle,
    getStack,
    VERSION,
    safeValidateLocalConfig,
    formatValidationError
} from '@ironbackend/core';
import { buildPromptSections } from '@ironbackend/prompts';
import { AI_TOOLS, getAITool, getAIToolIds, formatForAITool, type AIToolConfig } from '../ai-tools.js';
import { log } from '../utils/logger.js';
// Note: sanitizeFilePath and sanitizeInput available in ../utils/validation.js for future use

const IRONBACKEND_DIR = '.ironbackend';
const CONFIG_FILE = 'config.json';

// Using ValidatedLocalConfig from @ironbackend/core instead of local interface

/**
 * Create the init command
 */
export function createInitCommand(): Command {
    const cmd = new Command('init');

    cmd
        .description('Initialize IronBackend for a specific AI tool')
        .argument('[tool]', `AI tool to initialize (${getAIToolIds().join(', ')})`)
        .option('-y, --yes', 'Skip prompts and use defaults')
        .option('-s, --style <style>', 'Architecture style to use')
        .option('-t, --stack <stack>', 'Tech stack to use')
        .action(async (tool, options) => {
            await runInit(tool, options);
        });

    return cmd;
}

async function runInit(toolArg: string | undefined, options: { yes?: boolean; style?: string; stack?: string }) {
    console.log(chalk.bold.blue('\n🔧 IronBackend Initialization\n'));

    // Resolve AI tool
    let selectedTool: AIToolConfig | undefined;

    if (toolArg) {
        selectedTool = getAITool(toolArg);
        if (!selectedTool) {
            console.log(chalk.red(`Unknown AI tool: ${toolArg}`));
            console.log(chalk.yellow(`Available tools: ${getAIToolIds().join(', ')}`));
            process.exit(1);
        }
    } else if (!options.yes) {
        // Interactive tool selection
        const toolChoices = AI_TOOLS.map(t => ({
            name: `${t.name} - ${t.description}`,
            value: t.id
        }));

        const { tool } = await inquirer.prompt([{
            type: 'list',
            name: 'tool',
            message: 'Select AI tool to initialize for:',
            choices: toolChoices
        }]);
        selectedTool = getAITool(tool);
    } else {
        console.log(chalk.red('Please specify an AI tool: ironbackend init <tool>'));
        console.log(chalk.yellow(`Available tools: ${getAIToolIds().join(', ')}`));
        process.exit(1);
    }

    if (!selectedTool) {
        console.log(chalk.red('No AI tool selected'));
        process.exit(1);
    }

    console.log(chalk.cyan(`Initializing for: ${selectedTool.name}\n`));

    const cwd = process.cwd();
    const ironbackendPath = path.join(cwd, IRONBACKEND_DIR);

    // Check if already initialized
    if (fs.existsSync(ironbackendPath)) {
        const { overwrite } = await inquirer.prompt([{
            type: 'confirm',
            name: 'overwrite',
            message: '.ironbackend directory already exists. Overwrite?',
            default: false
        }]);

        if (!overwrite) {
            console.log(chalk.yellow('Initialization cancelled.'));
            return;
        }
    }

    let selectedStyle: string | null = options.style || null;
    let selectedStack: string | null = options.stack || null;

    // Interactive prompts if not using --yes
    if (!options.yes) {
        // Style selection
        if (!selectedStyle) {
            const styleChoices = getStyleIds().map(id => {
                const style = getStyle(id)!;
                return { name: `${style.name} - ${style.description.slice(0, 50)}...`, value: id };
            });

            const { style } = await inquirer.prompt([{
                type: 'list',
                name: 'style',
                message: 'Select an architecture style:',
                choices: [{ name: 'Skip (select later)', value: null }, ...styleChoices]
            }]);
            selectedStyle = style;
        }

        // Stack selection
        if (!selectedStack) {
            const stackChoices = getStackIds().map(id => {
                const stack = getStack(id)!;
                return { name: `${stack.name}`, value: id };
            });

            const { stack } = await inquirer.prompt([{
                type: 'list',
                name: 'stack',
                message: 'Select a tech stack:',
                choices: [{ name: 'Skip (select later)', value: null }, ...stackChoices]
            }]);
            selectedStack = stack;
        }
    }

    // Create directory structure
    const spinner = ora('Creating IronBackend configuration...').start();

    try {
        // Create .ironbackend directory
        fs.mkdirSync(ironbackendPath, { recursive: true });
        fs.mkdirSync(path.join(ironbackendPath, 'prompts'), { recursive: true });

        // Create config file
        const config = {
            version: VERSION,
            tool: selectedTool.id,
            style: selectedStyle,
            stack: selectedStack,
            rules: {
                enabled: ['API', 'DOMAIN', 'ERROR_HANDLING', 'DATA_ACCESS', 'NAMING', 'VALIDATION', 'ASYNC'],
                overrides: {}
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Validate config before writing
        log.debug('Validating configuration', { config });
        const validationResult = safeValidateLocalConfig(config);

        if (!validationResult.success) {
            spinner.fail('Configuration validation failed');
            console.error(chalk.red('Invalid configuration:'));
            console.error(chalk.yellow(formatValidationError(validationResult.error)));
            process.exit(1);
        }

        log.info('Configuration validated successfully', { version: config.version });

        fs.writeFileSync(
            path.join(ironbackendPath, CONFIG_FILE),
            JSON.stringify(validationResult.data, null, 2)
        );

        // Generate prompts if style and stack are selected
        if (selectedStyle && selectedStack) {
            const prompts = buildPromptSections({
                styleId: selectedStyle,
                stackId: selectedStack
            });

            // Write prompt files to .ironbackend/prompts
            fs.writeFileSync(
                path.join(ironbackendPath, 'prompts', 'system-prompt.md'),
                prompts.combined
            );

            fs.writeFileSync(
                path.join(ironbackendPath, 'prompts', 'style.md'),
                prompts.style
            );

            fs.writeFileSync(
                path.join(ironbackendPath, 'prompts', 'stack.md'),
                prompts.stack
            );

            fs.writeFileSync(
                path.join(ironbackendPath, 'prompts', 'rules.md'),
                prompts.rules
            );

            // Generate AI tool-specific file
            const toolOutputPath = path.join(cwd, selectedTool.outputPath);
            const toolOutputDir = path.dirname(toolOutputPath);

            // Create directory if needed
            if (toolOutputDir !== cwd) {
                fs.mkdirSync(toolOutputDir, { recursive: true });
            }

            // Format content for the specific tool
            const formattedContent = formatForAITool(selectedTool, prompts.combined);
            fs.writeFileSync(toolOutputPath, formattedContent);
        }

        spinner.succeed('IronBackend initialized successfully!');

        // Print summary
        console.log(chalk.green('\n✓ Created .ironbackend/ directory'));
        console.log(chalk.green('✓ Created config.json'));
        if (selectedStyle && selectedStack) {
            console.log(chalk.green('✓ Generated AI prompts'));
            console.log(chalk.green(`✓ Created ${selectedTool.outputPath}`));
        }

        console.log(chalk.bold('\n📁 Files created:'));
        console.log(chalk.gray('  .ironbackend/'));
        console.log(chalk.gray('  ├── config.json'));
        console.log(chalk.gray('  └── prompts/'));
        if (selectedStyle && selectedStack) {
            console.log(chalk.gray('      ├── system-prompt.md'));
            console.log(chalk.gray('      ├── style.md'));
            console.log(chalk.gray('      ├── stack.md'));
            console.log(chalk.gray('      └── rules.md'));
            console.log(chalk.gray(`  ${selectedTool.outputPath}`));
        }

        console.log(chalk.bold('\n🚀 Next steps:'));
        if (!selectedStyle || !selectedStack) {
            console.log(chalk.cyan('  1. Select a style: ironbackend select style <name>'));
            console.log(chalk.cyan('  2. Select a stack: ironbackend select stack <name>'));
            console.log(chalk.cyan('  3. Export prompts: ironbackend export prompts'));
        } else {
            console.log(chalk.cyan(`  1. Review generated prompts in ${selectedTool.outputPath}`));
            console.log(chalk.cyan(`  2. Start coding with ${selectedTool.name}!`));
        }

    } catch (error) {
        spinner.fail('Initialization failed');
        console.error(chalk.red(`Error: ${(error as Error).message}`));
        process.exit(1);
    }
}
