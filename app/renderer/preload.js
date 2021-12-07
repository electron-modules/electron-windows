'use strict';

const { writeFile, readFileSync } = require('fs');
const { ipcRenderer, desktopCapturer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld(
  '_electron_bridge',
  {
    send: (channel, args) => {
      ipcRenderer.send(channel, args);
    },
    writeFile,
    readFileSync,
    desktopCapturer,
  }
);
