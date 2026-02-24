# AGENTS.md - Development Guide

This document provides guidelines for agents working on the electron-windows codebase.

## Project Overview

electron-windows is an Electron module for managing multiple windows gracefully. It provides window creation, retrieval by name/ID, state persistence, and loading views.

## Commands

### Development
```bash
pnpm run dev          # Launch Electron demo app
```

### Testing
```bash
pnpm test             # Run unit tests with nyc coverage
pnpm run test:e2e     # Run end-to-end tests with Playwright
```

To run a **single test file**:
```bash
npx mocha test/unit/electron-windows.test.js
```

To run a **single test**:
```bash
npx mocha test/unit/electron-windows.test.js --grep "should create window with default options"
```

### Linting
```bash
pnpm run lint         # Run ESLint (no auto-fix)
pnpm run lint:fix     # Run ESLint with auto-fix
```

## Code Style Guidelines

### General
- Language: JavaScript (ES2018), CommonJS modules
- Always use `'use strict';` at the top of every file
- Use 2-space indentation

### Imports/Exports
- Use CommonJS: `const X = require('path')` and `module.exports = X`
- Order: built-in modules first, then external packages, then local files
- Empty line between groups

```javascript
'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const { BrowserWindow } = require('electron');
const windowStateKeeper = require('electron-window-state');

const MyClass = require('./my-class');
```

### Naming Conventions
- **Classes**: PascalCase (e.g., `WindowsManager`)
- **Methods/variables**: camelCase (e.g., `createWindow`, `windowOptions`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `DEFAULT_WIDTH`)
- **Private methods**: prefix with underscore (e.g., `_setGlobalUserAgent`)
- **Files**: kebab-case (e.g., `electron-windows.js`)

### Types and JSDoc
- This project does not use TypeScript
- Use JSDoc comments for public APIs (though `valid-jsdoc` is disabled)
- Document params and return values

```javascript
/**
 * Creates a new window.
 * @param {Object} options - Window configuration
 * @param {string} [options.name='anonymous'] - Window identifier
 * @returns {BrowserWindow} The created window
 */
```

### Error Handling
- Use `assert` for tests
- Return early on error conditions
- Check for destroyed windows before operations

```javascript
if (window.isDestroyed()) {
  return;
}
```

### Best Practices
- Always check if Electron objects are destroyed before using them:
  ```javascript
  if (window && !window.isDestroyed()) { ... }
  if (webContents && !webContents.isDestroyed()) { ... }
  ```
- Use lodash utilities (already a dependency): `_.pick`, `_.debounce`, etc.
- Avoid arrow functions for methods that need `this` binding

## Architecture

- **Main entry**: `index.js` exports from `lib/electron-windows.js`
- **Core class**: `WindowsManager` in `lib/electron-windows.js`
- **Tests**: `test/unit/` for unit tests, `test/e2e/` for E2E tests
- **Mock setup**: `test/unit/mock-setup.js` provides Electron mocks

## Testing Patterns

- Use Mocha's `describe`/`it` structure
- Use `beforeEach` to reset mocks
- Use Node's `assert` module for assertions

```javascript
const assert = require('assert');
const WindowsManager = require('../../lib/electron-windows');

describe('WindowsManager', () => {
  beforeEach(() => {
    require('./mock-setup').reset();
  });

  describe('create()', () => {
    it('should create window with default options', () => {
      const manager = new WindowsManager();
      const window = manager.create({});
      assert.strictEqual(window._name, 'anonymous');
    });
  });
});
```
