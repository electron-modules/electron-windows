'use strict';

document.querySelector('#close').addEventListener('click', () => {
  window.ipcRenderer.send('close-window');
}, false);
