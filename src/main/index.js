const { app, BrowserWindow } = require('electron');
var minimist = require('minimist');
const recognition = require('./modules/recognition');

const isDev = process.env.NODE_ENV == 'development';
const argv = minimist(process.argv.slice(isDev ? 2 : 0));
process.env.APP_LANG = !!argv.lang ? argv.lang : 'en';

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 320 + (isDev ? 25 : 0),
    webPreferences: {
      nodeIntegration: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    },
    frame: isDev
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  if (isDev) mainWindow.webContents.openDevTools();

  recognition.init(mainWindow, argv);

  mainWindow.on('closed', () => mainWindow = null);
};

app.on('ready', createWindow);
