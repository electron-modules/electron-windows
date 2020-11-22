# electron-windows

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/electron-windows.svg?style=flat-square
[npm-url]: https://npmjs.org/package/electron-windows
[travis-image]: https://api.travis-ci.com/xudafeng/electron-windows.svg?branch=master
[travis-url]: https://travis-ci.com/github/xudafeng/electron-windows
[coveralls-image]: https://img.shields.io/coveralls/xudafeng/electron-windows.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/xudafeng/electron-windows?branch=master
[node-image]: https://img.shields.io/badge/node.js-%3E=_8-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/electron-windows.svg?style=flat-square
[download-url]: https://npmjs.org/package/electron-windows

> Manage multiple windows of Electron gracefully and provides powerful features.

## Installment

```bash
$ npm i electron-windows --save
```

## APIs

### init

```javascript
const WindowManager = require('electron-windows');
const windowManager = new WindowManager();
```

### create

```javascript
const winRef = windowManager.create({
  name: 'window1',
  loadingView: {
    url: '',
  },
  browserWindow: {
    width: 800,
    height: 600,
    titleBarStyle: 'hidden',
    title: 'demo',
    show: false,
    webPreferences: {
      nodeIntegration: app.isDev,
      webSecurity: true,
      webviewTag: true,
    },
  },
  openDevTools: true,
});
```

## TODO

- [ ] support storage of window's size and other configuration

## License

The MIT License (MIT)
