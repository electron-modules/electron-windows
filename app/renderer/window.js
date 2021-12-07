'use strict';

document.querySelector('#close').addEventListener('click', () => {
  window._electron_bridge.send('close-window');
}, false);

document.querySelector('#write').addEventListener('click', () => {
  const data = 'write local file successfully';
  const fileName = 'file.txt';
  window._electron_bridge.writeFile(fileName, data, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(window._electron_bridge.readFileSync(fileName, 'utf8'));
    }
  });
}, false);

document.querySelector('#debug').addEventListener('click', () => {
  window._electron_bridge.send('open-devtools');
}, false);
