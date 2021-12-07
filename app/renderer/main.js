'use strict';

document.querySelector('#new').addEventListener('click', () => {
  window._electron_bridge.send('new-window');
}, false);

document.querySelector('#new-online').addEventListener('click', () => {
  window._electron_bridge.send('new-online-window');
}, false);

document.querySelector('#play-game').addEventListener('click', () => {
  const className = 'custom-iframe';
  const elem = document.querySelector(`.${className}`);
  if (elem) return;
  const iframe = document.createElement('iframe');
  iframe.src = 'https://xudafeng.github.io';
  iframe.className = className;
  document.body.appendChild(iframe);
}, false);

document.querySelector('#debug').addEventListener('click', () => {
  window._electron_bridge.send('open-devtools');
}, false);
