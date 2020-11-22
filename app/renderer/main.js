'use strict';

document.querySelector('#new').addEventListener('click', () => {
  window.ipcRenderer.send('new-window');
}, false);

document.querySelector('#new-online').addEventListener('click', () => {
  window.ipcRenderer.send('new-online-window');
}, false);
