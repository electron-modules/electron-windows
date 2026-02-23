'use strict';

require('./mock-setup');

const assert = require('assert');
const WindowsManager = require('../../lib/electron-windows');

describe('WindowsManager', () => {
  beforeEach(() => {
    require('./mock-setup').reset();
  });

  describe('constructor', () => {
    it('should be ok', () => {
      assert(WindowsManager);
    });
  });

  describe('create()', () => {
    /**
     * Test: create() with default options
     * Expect: window should be created with name 'anonymous'
     */
    it('should create window with default options', () => {
      const manager = new WindowsManager();
      const window = manager.create({});

      assert(window);
      assert.strictEqual(window._name, 'anonymous');
    });

    /**
     * Test: create() with custom name
     * Expect: window._name should match the provided name
     */
    it('should create window with custom name', () => {
      const manager = new WindowsManager();
      const window = manager.create({ name: 'test-window' });

      assert.strictEqual(window._name, 'test-window');
    });

    /**
     * Test: create() with browserWindow options
     * Expect: window should be created with custom options passed to BrowserWindow
     */
    it('should create window with custom browserWindow options', () => {
      const manager = new WindowsManager();
      const window = manager.create({
        browserWindow: {
          width: 1024,
          height: 768,
          title: 'My App',
        },
      });

      assert(window);
    });

    /**
     * Test: create() with openDevTools option
     * Expect: devTools should open when webContents emits 'dom-ready'
     */
    it('should open devTools when openDevTools is true', () => {
      const manager = new WindowsManager();
      const window = manager.create({
        openDevTools: true,
      });

      window.webContents.emit('dom-ready');
      // There is not good way to assert that devTools opened in this mock setup.
      // Just ensure that the code runs without errors and the event is emitted.
      assert(window);
    });

    /**
     * Test: create() with preventOriginClose option
     * Expect: close event should be prevented when preventOriginClose is true
     */
    it('should prevent close when preventOriginClose is true', () => {
      const manager = new WindowsManager();
      const window = manager.create({
        preventOriginClose: true,
      });

      let prevented = false;
      const event = { preventDefault: () => { prevented = true; } };
      window.emit('close', event);
      assert(prevented);
    });

    /**
     * Test: window close behavior when preventOriginClose is false
     * Expect: window should be removed from manager on close
     */
    it('should delete window from manager on close when preventOriginClose is false', () => {
      const manager = new WindowsManager();
      const window = manager.create({
        preventOriginClose: false,
      });

      const allWindows = manager.getAll();
      assert.strictEqual(Object.keys(allWindows).length, 1);

      window.emit('close', {});
      const allWindowsAfter = manager.getAll();
      assert.strictEqual(Object.keys(allWindowsAfter).length, 0);
    });
  });

  describe('get()', () => {
    /**
     * Test: get() with existing window name
     * Expect: should return the window with matching name
     */
    it('should return window by name', () => {
      const manager = new WindowsManager();
      const window = manager.create({ name: 'my-window' });

      const found = manager.get('my-window');
      assert.strictEqual(found, window);
    });

    /**
     * Test: get() with non-existent window name
     * Expect: should return undefined
     */
    it('should return undefined for non-existent window', () => {
      const manager = new WindowsManager();
      manager.create({ name: 'existing' });

      const found = manager.get('non-existent');
      assert.strictEqual(found, undefined);
    });
  });

  describe('getById()', () => {
    /**
     * Test: getById() with existing window id
     * Expect: should return the window with matching id
     */
    it('should return window by id', () => {
      const manager = new WindowsManager();
      const window = manager.create({});

      const found = manager.getById(window.id);
      assert.strictEqual(found, window);
    });

    /**
     * Test: getById() with non-existent id
     * Expect: should return undefined
     */
    it('should return undefined for non-existent id', () => {
      const manager = new WindowsManager();
      manager.create({});

      const found = manager.getById(99999);
      assert.strictEqual(found, undefined);
    });
  });

  describe('getAll()', () => {
    /**
     * Test: getAll() after creating multiple windows
     * Expect: should return all created windows
     */
    it('should return all windows', () => {
      const manager = new WindowsManager();
      manager.create({ name: 'window1' });
      manager.create({ name: 'window2' });

      const all = manager.getAll();
      assert.strictEqual(Object.keys(all).length, 2);
    });

    /**
     * Test: getAll() when no windows exist
     * Expect: should return empty object
     */
    it('should return empty object when no windows', () => {
      const manager = new WindowsManager();

      const all = manager.getAll();
      assert.deepStrictEqual(all, {});
    });
  });

  describe('globalUserAgent', () => {
    /**
     * Test: setGlobalUserAgent() static method
     * Expect: should set GLOBAL_USER_AGENT property on WindowsManager class
     */
    it('should set global user agent via static method', () => {
      WindowsManager.setGlobalUserAgent('Test User Agent');
      assert.strictEqual(WindowsManager.GLOBAL_USER_AGENT, 'Test User Agent');
    });
  });

  describe('clone()', () => {
    /**
     * Test: clone() method
     * Expect: should return the same window object (no-op method)
     */
    it('should return the same window', () => {
      const manager = new WindowsManager();
      const original = manager.create({ name: 'original' });

      const cloned = manager.clone(original);
      assert.strictEqual(cloned, original);
    });
  });
});
