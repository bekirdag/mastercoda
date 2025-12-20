import { app, BrowserWindow, ipcMain } from 'electron';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { ipcChannels } from '../shared/ipc';

const __dirname = dirname(fileURLToPath(import.meta.url));

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: true
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  const rendererUrl = process.env.ELECTRON_RENDERER_URL;
  if (rendererUrl) {
    mainWindow.loadURL(rendererUrl);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
};

app.whenReady().then(() => {
  ipcMain.handle(ipcChannels.ping, () => ({
    ok: true,
    message: 'pong',
    appVersion: app.getVersion()
  }));

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
