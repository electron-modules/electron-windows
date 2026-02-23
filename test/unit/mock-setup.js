'use strict';

const Module = require('module');

/**
 * Stores all created mock BrowserWindow instances for tracking
 * @type {Map<number, Object>}
 */
let mockBrowserWindowInstances = new Map();

/**
 * Counter for generating unique window IDs
 * @type {number}
 */
let mockWindowIdCounter = 1;

/**
 * Creates a mock BrowserWindow instance with event emitter functionality
 * @param {Object} options - Options passed to BrowserWindow constructor
 * @returns {Object} Mock window object
 */
function createMockBrowserWindow(options) {
  const id = mockWindowIdCounter++;
  const listeners = {};
  const webContentsListeners = {};
  const mockWindow = {
    id,
    _name: undefined,
    isDestroyed: () => false,
    /**
     * Register event listener on the window
     * @param {string} event - Event name
     * @param {Function} callback - Event handler
     */
    on: (event, callback) => {
      listeners[event] = listeners[event] || [];
      listeners[event].push(callback);
    },
    /**
     * Emit an event on the window
     * @param {string} event - Event name
     * @param {...any} args - Arguments to pass to handlers
     */
    emit: (event, ...args) => {
      if (listeners[event]) {
        listeners[event].forEach(cb => cb(...args));
      }
    },
    webContents: {
      /**
       * Register event listener on webContents
       * @param {string} event - Event name
       * @param {Function} callback - Event handler
       */
      on: (event, callback) => {
        webContentsListeners[event] = webContentsListeners[event] || [];
        webContentsListeners[event].push(callback);
      },
      /**
       * Emit an event on webContents
       * @param {string} event - Event name
       * @param {...any} args - Arguments to pass to handlers
       */
      emit: (event, ...args) => {
        if (webContentsListeners[event]) {
          webContentsListeners[event].forEach(cb => cb(...args));
        }
      },
      loadURL: () => { },
      isDestroyed: () => false,
      destroy: () => { },
    },
    loadURL(url, opts) {
      if (this.webContents.loadURL) {
        this.webContents && this.webContents.loadURL(url, opts);
      }
    },
    openDevTools: () => { },
    getSize: () => [800, 600],
    setBrowserView: () => { },
    removeBrowserView: () => { },
  };
  mockBrowserWindowInstances.set(id, mockWindow);
  return mockWindow;
}

/**
 * Mock BrowserWindow constructor
 * @param {Object} options - Options passed to BrowserWindow
 * @returns {Object} Mock window instance
 */
function MockBrowserWindow(options) {
  return createMockBrowserWindow(options);
}

/**
 * Mock BrowserView constructor
 * Provides event emitter functionality for webContents
 */
function MockBrowserView() {
  const listeners = {};
  this.webContents = {
    loadURL: () => { },
    isDestroyed: () => false,
    destroy: () => { },
    on: (event, callback) => {
      listeners[event] = listeners[event] || [];
      listeners[event].push(callback);
    },
    emit: (event, ...args) => {
      if (listeners[event]) {
        listeners[event].forEach(cb => cb(...args));
      }
    },
  };
}

/**
 * Mock electron-window-state module
 * Returns saved window state including position and size
 * @param {Object} options - Configuration options
 * @returns {Object} Window state object
 */
function mockWindowStateKeeper(options) {
  return {
    x: 100,
    y: 100,
    width: options.defaultWidth || 800,
    height: options.defaultHeight || 600,
    manage: () => { },
  };
}

/**
 * Save original require function to allow non-mocked modules to load normally
 */
const originalRequire = Module.prototype.require;

/**
 * Intercept require() to provide mock Electron modules
 * @param {string} id - Module ID being required
 * @returns {Object} Mock or real module
 */
Module.prototype.require = function (id) {
  if (id === 'electron') {
    return {
      BrowserWindow: MockBrowserWindow,
      BrowserView: MockBrowserView,
    };
  }
  if (id === 'electron-window-state') {
    return mockWindowStateKeeper;
  }
  return originalRequire.apply(this, arguments);
};

/**
 * Reset mock state between tests
 * Clears all tracked windows and resets ID counter
 */
module.exports = {
  reset() {
    mockBrowserWindowInstances = new Map();
    mockWindowIdCounter = 1;
  },
};
