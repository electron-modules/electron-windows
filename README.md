# electron-windows

[![NPM version][npm-image]][npm-url]
[![CI][CI-image]][CI-url]
[![Test coverage][codecov-image]][codecov-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/electron-windows.svg
[npm-url]: https://npmjs.org/package/electron-windows
[CI-image]: https://github.com/electron-modules/electron-windows/actions/workflows/ci.yml/badge.svg
[CI-url]: https://github.com/electron-modules/electron-windows/actions/workflows/ci.yml
[codecov-image]: https://img.shields.io/codecov/c/github/electron-modules/electron-windows.svg?logo=codecov
[codecov-url]: https://codecov.io/gh/electron-modules/electron-windows
[node-image]: https://img.shields.io/badge/node.js-%3E=_8-green.svg
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/electron-windows.svg
[download-url]: https://npmjs.org/package/electron-windows

> Manage multiple windows of Electron gracefully and provides powerful features.

<!-- GITCONTRIBUTOR_START -->

## Contributors

|[<img src="https://avatars.githubusercontent.com/u/1011681?v=4" width="100px;"/><br/><sub><b>xudafeng</b></sub>](https://github.com/xudafeng)<br/>|[<img src="https://avatars.githubusercontent.com/u/17586742?v=4" width="100px;"/><br/><sub><b>sriting</b></sub>](https://github.com/sriting)<br/>|[<img src="https://avatars.githubusercontent.com/u/12660278?v=4" width="100px;"/><br/><sub><b>ColaDaddyz</b></sub>](https://github.com/ColaDaddyz)<br/>|[<img src="https://avatars.githubusercontent.com/u/52845048?v=4" width="100px;"/><br/><sub><b>snapre</b></sub>](https://github.com/snapre)<br/>|[<img src="https://avatars.githubusercontent.com/u/4081746?v=4" width="100px;"/><br/><sub><b>zlyi</b></sub>](https://github.com/zlyi)<br/>|[<img src="https://avatars.githubusercontent.com/u/50158871?v=4" width="100px;"/><br/><sub><b>moshangqi</b></sub>](https://github.com/moshangqi)<br/>|
| :---: | :---: | :---: | :---: | :---: | :---: |


This project follows the git-contributor [spec](https://github.com/xudafeng/git-contributor), auto updated at `Tue Dec 27 2022 13:02:58 GMT+0800`.

<!-- GITCONTRIBUTOR_END -->

## Installment

```bash
$ npm i electron-windows --save
```

## Demo

![](./sceenshot.png)

## APIs

### init

```javascript
const WindowManager = require('electron-windows');
const windowManager = new WindowManager();
```

### create

```javascript
const { app } = require('electron');
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
  storageKey: 'storage-filename', // optional. The name of file. Support storage of window state
  storagePath: app.getPath('userData'), // optional. The path of file, only used when storageKey is not empty 
});
```

## TODO

- [ ] support storage of window configuration
- [ ] clone pointed window

## License

The MIT License (MIT)
