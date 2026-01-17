# CLI Reference

The `ironbackend` CLI is your primary tool for managing projects and enforcing architecture rules.

## Installation
```bash
npm install -g ironbackend
```

## Commands

### `init`
Initializes a new IronBackend project for a specific AI tool.

```bash
ironbackend init [tool]
# Options:
#   -s, --style <style>   Architecture style
#   -t, --stack <stack>   Tech stack
#   -y, --yes           Skip prompts
```

### `doctor`
Validates the project configuration and checks for issues (e.g., outdated prompts, missing rules).

```bash
ironbackend doctor
# Options:
#   -v, --verbose       Show detailed output
```

### `select`
Selects or updates the architecture style or tech stack.

```bash
ironbackend select style [name]
ironbackend select stack [name]
```

### `export`
Exports prompts or configuration files. Useful for regenerating rules or sharing config.

```bash
ironbackend export prompts
# Options:
#   -o, --output <dir>    Output directory (default: .ironbackend/prompts)
#   -f, --format <fmt>    Format: markdown, cursor, claude, all
```

### `list`
Lists available architecture styles and tech stacks.

```bash
ironbackend list
```

### `info`
Shows current configuration details.

```bash
ironbackend info
```
