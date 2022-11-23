'use strict';

const { app: electronApp } = require('electron');
const initElectrom = require('./app/electrom');

const App = require('./app');

electronApp.on('ready', async () => {
  const app = new App();
  app.init();
  initElectrom();
});
