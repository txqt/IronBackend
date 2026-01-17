# IronBackend Stability & Development Workflow

This document outlines the mandatory process for making changes to the IronBackend system to ensure stability and prevent build/test failures.

## 1. Version Management
**Rule:** When you update the `version` in any `package.json`, you **must** update the corresponding tests.

- **Check Location:** `packages/core/tests/index.test.ts` (and other test files).
- **Action:**
  1. Update `package.json` version.
  2. Search the codebase for the old version string (e.g., "1.0.1").
  3. Update expectation in tests to match the new version.

## 2. Pre-Commit Checklist (The "Golden Rule")
Before committing and pushing ANY code, you must run the following commands from the root directory. If any command fails, **DO NOT PUSH**.

### Step 1: Quality Check
```bash
pnpm -r lint
```
*Ensures code style and potential errors are caught (e.g., `no-explicit-any`).*

### Step 2: Build Verification
```bash
pnpm -r build
```
*Crucial: This checks TypeScript types across ALL workspace projects (`apps/web`, `packages/core`, etc.). A passing test suite does NOT guarantee a passing build.*

### Step 3: Test Suite
```bash
pnpm -r test
```
*Runs all unit and integration tests. Ensure coverage meets requirements.*

## 3. Handling Dependencies
- **Adding a package:** Use `pnpm add <package> --filter <project-name>`.
- **Sync:** After pulling changes, always run `pnpm install` to ensure lockfile consistency.

## 4. CI/CD Simulation
The CI pipeline runs the following. If it passes locally, it should pass in CI:
```bash
pnpm install
pnpm build
pnpm test
```

## 5. Troubleshooting Common Issues
- **Version Mismatch:** See Section 1.
- **Type Errors:** Run `pnpm -r build` to find the exact file failing TS compilation.
- **Lint Errors:** Use `eslint --fix` inside the specific package if possible, or fix manually.
