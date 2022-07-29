'use strict';

const _ = require('lodash');
const { BrowserWindow, BrowserView } = require('electron');

class WindowsManager {
  windows = {};

  create(options) {
    this._createOptions = options;
    const {
      name = 'anonymous',
      loadingView = {},
      browserWindow: browserWindowOptions,
      openDevTools = false,
      preventOriginClose = false,
    } = options;
    const window = new BrowserWindow(Object.assign({
      acceptFirstMouse: true,
    }, browserWindowOptions));
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
    return window;
  }

  _setLoadingView(window) {
    const {
      loadingView: loadingViewOptions,
      preventOriginNavigate = false,
    } = this._createOptions;
    let _loadingView = new BrowserView();

    if(window.isDestroyed()){
      return;
    }

    const loadLoadingView = () => {
      const [ viewWidth, viewHeight ] = window.getSize();
      window.setBrowserView(_loadingView);
      _loadingView.setBounds({ x: 0, y: 0, width: viewWidth, height: viewHeight });
      _loadingView.webContents.loadURL(loadingViewOptions.url);
    };

    const onFailure = () => {
      if (_loadingView.webContents && !_loadingView.webContents.isDestroyed()) {
        _loadingView.webContents.destroy();
      }
      if (window) {
        window.removeBrowserView(_loadingView);
      }
    };

    loadLoadingView();

    window.on('resize', _.debounce(() => {
      if (_loadingView.webContents && !_loadingView.webContents.isDestroyed()) {
        const [ viewWidth, viewHeight ] = window.getSize();
        _loadingView.setBounds({ x: 0, y: 0, width: viewWidth, height: viewHeight });
      }
    }, 500));

    window.webContents.on('will-navigate', (e) => {
      if (preventOriginNavigate) {
        e.preventDefault();
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

  getAll() {
    return this.windows;
  }

  clone(window) {
    return window;
  }
}

module.exports = WindowsManager;
