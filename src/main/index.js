const { app, BrowserWindow } = require('electron');
const isDev = process.env.NODE_ENV == 'development';

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

  mainWindow.on('closed', () => mainWindow = null);
};

app.on('ready', createWindow);
