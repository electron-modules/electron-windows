'use strict';

const { app: electronApp } = require('electron');

const App = require('./app');

electronApp.on('ready', () => {
  const app = new App();
  app.init();
});
