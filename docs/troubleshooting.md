# Troubleshooting Guide

Common issues and their solutions when using IronBackend.

## CLI Issues

### "Style not found" error
**Cause:** The style ID doesn't match any available architecture styles.

**Fix:**
```bash
# List all available styles
ironbackend list --styles

# Use exact ID from the list
ironbackend select style hexagonal
```

### "Stack not found" error
**Cause:** Invalid stack ID provided.

**Fix:**
```bash
# List all available stacks
ironbackend list --stacks

# Use exact ID: node-nestjs, java-spring, dotnet-aspnetcore, python-fastapi
ironbackend select stack node-nestjs
```

### "Config validation failed" error
**Cause:** The `.ironbackend/config.json` file has invalid data.

**Fix:**
1. Check the version format (must be `x.y.z`)
2. Ensure all required fields are present
3. Re-run `ironbackend init` to regenerate

```bash
# Remove old config and reinitialize
rm -rf .ironbackend
ironbackend init cursor -y
```

### Prompts not generating
**Cause:** Both style AND stack must be selected before prompts can be generated.

**Fix:**
```bash
ironbackend select style hexagonal
ironbackend select stack node-nestjs
ironbackend export prompts
```

## Path Errors

### "Path traversal detected" error
**Cause:** Attempted to write outside the project directory (security protection).

**Fix:** Ensure output paths stay within your project directory. Use relative paths like `./output` instead of absolute paths or `../`.

## Logging

### Enable debug logging
Set the `LOG_LEVEL` environment variable:

```bash
# Windows PowerShell
$env:LOG_LEVEL="debug"
ironbackend init cursor

# Unix/macOS
LOG_LEVEL=debug ironbackend init cursor
```

Available levels: `trace`, `debug`, `info`, `warn`, `error`, `fatal`

## Getting Help

If you encounter an issue not listed here:

1. Check the [GitHub Issues](https://github.com/ironbackend/ironbackend/issues)
2. Search existing issues for your error message
3. Open a new issue with:
   - IronBackend version (`ironbackend --version`)
   - Node.js version (`node --version`)
   - Full error message and stack trace
   - Steps to reproduce
