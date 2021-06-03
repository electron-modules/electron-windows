'use strict';

const { writeFile } = require('fs');
const { ipcRenderer, desktopCapturer } = require('electron');

window._electron_bridge = {
  ipcRenderer,
  desktopCapturer,
  writeFile,
};
