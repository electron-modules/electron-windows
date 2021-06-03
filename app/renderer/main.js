'use strict';

document.querySelector('#new').addEventListener('click', () => {
  window._electron_bridge.ipcRenderer.send('new-window');
}, false);

document.querySelector('#new-online').addEventListener('click', () => {
  window._electron_bridge.ipcRenderer.send('new-online-window');
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

document.querySelector('#start-record').addEventListener('click', () => {
  window._electron_bridge.desktopCapturer.getSources({
    types: ['screen', 'window']
  }).then(windows => {
    const source = windows[0];
    if (source) {
      const constraints = {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: source.id
          }
        }
      };
      const mimeType = 'video/webm; codecs=vp9';
      const recordedChunks = [];
      window.navigator
        .mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          window.mediaRecorder = new window.MediaRecorder(stream, {
            mimeType,
          });
          window.mediaRecorder.ondataavailable = ({ data }) => {
            recordedChunks.push(data);
          };
          window.mediaRecorder.onstop = () => {
            const blob = new window.Blob(recordedChunks, {
              type: mimeType,
            });
            blob.arrayBuffer().then(array => {
              const buffer = Buffer.from(array);
              window._electron_bridge.writeFile(`${Date.now()}.webm`, buffer, (res) => {
                console.log(res);
              });
            });
          };
          window.mediaRecorder.start();
        });
    }
  });
});

document.querySelector('#stop-record').addEventListener('click', () => {
  window.mediaRecorder.stop();
});
