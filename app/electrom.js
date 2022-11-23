'use strict';

const { BrowserWindow } = require('electron');
const Electrom = require('electrom');

module.exports = function() {
  const {
    BROWSER_WINDOW_ASSETS_PATH,
    BROWSER_WINDOW_PRELOAD_PATH,
    EVENT_DATA_CHANNEL_NAME,
  } = Electrom;
  // 1. initial monitor
  const monitor = new Electrom.Monitor({
    interval: 3E3,
  });
  // 2. initial window
  const win = new BrowserWindow({
    width: 1280,
    height: 600,
    webPreferences: {
      preload: BROWSER_WINDOW_PRELOAD_PATH,
    },
  });
  // 3. load electrom assets
  win.loadURL(BROWSER_WINDOW_ASSETS_PATH);
  win.webContents.on('dom-ready', () => {
    // 4. bind monitor event when dom ready
    monitor.removeAllListeners(EVENT_DATA_CHANNEL_NAME);
    monitor.on(EVENT_DATA_CHANNEL_NAME, (data) => {
      if (win && !win.isDestroyed() && win.webContents && !win.webContents.isDestroyed()) {
        win.webContents.send(EVENT_DATA_CHANNEL_NAME, data);
      }
    });
    monitor.bindEventToWindow(win);
    monitor.start();
  });
  win.once('ready-to-show', () => {
    win.show();
  });
};
