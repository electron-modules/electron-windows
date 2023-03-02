'use strict';

const _ = require('lodash');
const { BrowserWindow, BrowserView, screen } = require('electron');

class WindowsManager {
  constructor(options = {}) {
    this.options = options;
    this.windows = {};
  }

  create(options) {
    this._createOptions = options;
    let stateFromStorage = {};
    const {
      name = 'anonymous',
      loadingView = {},
      browserWindow: browserWindowOptions,
      openDevTools = false,
      preventOriginClose = false,
      storageKey = undefined,
    } = options;
    if (storageKey && this.options.onStorageReadSync) {
      stateFromStorage = this.options.onStorageReadSync(storageKey);
    }
    const window = new BrowserWindow(Object.assign({
      acceptFirstMouse: true,
    }, browserWindowOptions, _.pick(stateFromStorage, [
      'x',
      'y',
      'width',
      'height',
    ])));
    this._setGlobalUserAgent(window, options);
    window._name = name;
    if (loadingView.url) {
      this._setLoadingView(window);
    }
    window.on('close', (event) => {
      if (preventOriginClose) {
        event.preventDefault();
        return;
      }
      delete this.windows[window.id];
    });
    window.webContents.on('dom-ready', () => {
      if (openDevTools) {
        window.openDevTools();
      }
    });
    this.windows[window.id] = window;
    if (storageKey) {
      window.stateFromStorage = stateFromStorage;
      window.storageKey = storageKey;
      window.on('resize', _.debounce(({ sender: win }) => this._onStateChange(win), 500));
      window.on('move', ({ sender: win }) => this._onStateChange(win));
    }
    return window;
  }

  _onStateChange = (win) => {
    const state = this.getState(win);
    if (this.options.onStorageSave) {
      this.options.onStorageSave(win.storageKey, state);
    }
  }

  getState(win) {
    const state = {};
    const winBounds = win.getBounds();
    if (this._isInNormalState(win)) {
      state.x = winBounds.x;
      state.y = winBounds.y;
      state.width = winBounds.width;
      state.height = winBounds.height;
    }
    state.isMaximized = win.isMaximized();
    state.isFullScreen = win.isFullScreen();
    state.displayBounds = screen.getDisplayMatching(winBounds).bounds;
    return state;
  }

  _setGlobalUserAgent(window, options) {
    const {
      globalUserAgent,
    } = options;
    const ua = globalUserAgent || WindowsManager.GLOBAL_USER_AGENT;
    if (!ua) return;
    window._loadURL = window.loadURL;
    window.loadURL = (url, options = {}) => {
      options.userAgent = ua;
      window._loadURL(url, options);
    };
  }

  _setLoadingView(window) {
    const {
      loadingView: loadingViewOptions,
      preventOriginNavigate = false,
    } = this._createOptions;
    let _loadingView = new BrowserView();

    if (window.isDestroyed()) {
      return;
    }

    const loadLoadingView = () => {
      const [ viewWidth, viewHeight ] = window.getSize();
      window.setBrowserView(_loadingView);
      _loadingView.setBounds({
        x: 0,
        y: 0,
        width: viewWidth,
        height: viewHeight,
      });
      _loadingView.webContents.loadURL(loadingViewOptions.url);
    };

    const onFailure = () => {
      if (_loadingView.webContents && !_loadingView.webContents.isDestroyed()) {
        _loadingView.webContents.destroy();
      }
      if (window.isDestroyed()) {
        return;
      }

      if (window) {
        window.removeBrowserView(_loadingView);
      }
    };

    loadLoadingView();

    window.on('resize', _.debounce(() => {
      if (_loadingView.webContents && !_loadingView.webContents.isDestroyed()) {
        if (window.isDestroyed()) {
          return;
        }
        const [ viewWidth, viewHeight ] = window.getSize();
        _loadingView.setBounds({ x: 0, y: 0, width: viewWidth, height: viewHeight });
      }
    }, 500));

    window.webContents.on('will-navigate', (e) => {
      if (preventOriginNavigate) {
        e.preventDefault();
        return;
      }
      if (window.isDestroyed()) {
        return;
      }
      if (_loadingView.webContents && !_loadingView.webContents.isDestroyed()) {
        window.setBrowserView(_loadingView);
      } else { // if loadingView has been destroyed
        _loadingView = new BrowserView();
        loadLoadingView();
      }
    });
    window.webContents.on('dom-ready', onFailure);
    window.webContents.on('crashed', onFailure);
    window.webContents.on('unresponsive', onFailure);
    window.webContents.on('did-fail-load', onFailure);
  }

  get(name) {
    return Object.values(this.windows)
      .find(item => item._name === name);
  }

  getById(id) {
    return Object.values(this.windows)
      .find(item => item.id === id);
  }

  getAll() {
    return this.windows;
  }

  clone(window) {
    return window;
  }

  _isInNormalState(win) {
    return !win.isMaximized() && !win.isMinimized() && !win.isFullScreen();
  }
}

WindowsManager.setGlobalUserAgent = (ua) => {
  WindowsManager.GLOBAL_USER_AGENT = ua;
};

module.exports = WindowsManager;
