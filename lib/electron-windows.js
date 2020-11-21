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
    } = options;
    const window = new BrowserWindow(Object.assign({
      acceptFirstMouse: true,
    }, browserWindowOptions));
    window._name = name;
    if (loadingView.url) {
      this._setLoadingView(window);
    }
    window.on('close', () => {
      delete _windows[window.id];
    });
    this.windows[window.id] = window;
    return window;
  }

  _setLoadingView(window) {
    const { loadingView: loadingViewOptions } = this._createOptions;
    const _loadingView = new BrowserView();
    const [ viewWidth, viewHeight ] = window.getSize();
    window.setBrowserView(_loadingView);
    window.webContents.on('will-navigate', () => {
      window.setBrowserView(_loadingView);
    });
    _loadingView.setBounds({ x: 0, y: 0, width: viewWidth, height: viewHeight });
    _loadingView.webContents.loadURL(loadingViewOptions.url);
    window.on('resize', _.debounce(() => {
      const [ viewWidth, viewHeight ] = window.getSize();
      _loadingView.setBounds({ x: 0, y: 0, width: viewWidth, height: viewHeight });
    }, 500));
    window.removeLoadingView = () => {
      window.removeBrowserView(_loadingView);
    };
  }

  get(name) {
    return Object.values(this.windows)
      .find(item => item._name === name);
  }

  getAll() {
    return this.windows;
  }
}

module.exports = WindowsManager;