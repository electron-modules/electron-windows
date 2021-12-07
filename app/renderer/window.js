'use strict';

document.querySelector('#close').addEventListener('click', () => {
  window._electron_bridge.send('close-window');
}, false);

document.querySelector('#write').addEventListener('click', () => {
  const data = 'write local file successfully';
  window._electron_bridge.writeFile('demo.txt', data, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(window._electron_bridge.readFileSync('demo.txt', 'utf8'));
    }
  });
}, false);

document.querySelector('#debug').addEventListener('click', () => {
  window._electron_bridge.send('open-devtools');
}, false);
