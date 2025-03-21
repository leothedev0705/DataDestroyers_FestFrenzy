const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const Store = require('electron-store');
const DocumentHandler = require('./src/js/documentHandlers');
const { initialize, enable } = require('@electron/remote/main');
require('dotenv').config();

// Initialize remote module
initialize();

// Initialize the store for saving user preferences and statistics
const store = new Store();

let mainWindow;
let isInKioskMode = false;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: true
  });

  // Enable remote module for this window
  enable(mainWindow.webContents);

  // Load the index.html file
  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  // Open DevTools in development mode
  // mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window when the dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Handle IPC messages from renderer process
ipcMain.on('start-session', (event, sessionData) => {
  isInKioskMode = true;
  
  // Disable keyboard shortcuts that could exit kiosk mode
  globalShortcut.register('Alt+F4', () => {
    return false;
  });
  globalShortcut.register('CommandOrControl+W', () => {
    return false;
  });
  globalShortcut.register('CommandOrControl+Q', () => {
    return false;
  });
  
  // Set the window to kiosk mode
  mainWindow.setKiosk(true);
  mainWindow.setFullScreen(true);
  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  
  // Send confirmation back to renderer
  event.reply('session-started', true);
});

ipcMain.on('end-session', (event) => {
  isInKioskMode = false;
  
  // Unregister all shortcuts
  globalShortcut.unregisterAll();
  
  // Exit kiosk mode
  mainWindow.setKiosk(false);
  mainWindow.setFullScreen(false);
  mainWindow.setAlwaysOnTop(false);
  
  // Send confirmation back to renderer
  event.reply('session-ended', true);
});

// Save user preferences
ipcMain.on('save-preferences', (event, preferences) => {
  store.set('userPreferences', preferences);
  event.reply('preferences-saved', true);
});

// Get user preferences
ipcMain.handle('get-preferences', () => {
  return store.get('userPreferences', {});
});

// Save statistics
ipcMain.on('save-statistics', (event, statistics) => {
  store.set('statistics', statistics);
  event.reply('statistics-saved', true);
});

// Get statistics
ipcMain.handle('get-statistics', () => {
  return store.get('statistics', {
    totalStudyTime: 0,
    sessionsCompleted: 0,
    achievements: [],
    sessionHistory: []
  });
});

// Add these IPC handlers
ipcMain.handle('create-excel', async () => {
  return await DocumentHandler.createExcel();
});

ipcMain.handle('create-powerpoint', async () => {
  return await DocumentHandler.createPowerPoint();
});

ipcMain.handle('create-word', async () => {
  return await DocumentHandler.createWord();
});

// Add IPC handlers for document creation
ipcMain.handle('create-document', async (event, type) => {
  try {
    switch (type) {
      case 'excel':
        return await DocumentHandler.createExcel();
      case 'powerpoint':
        return await DocumentHandler.createPowerPoint();
      case 'word':
        return await DocumentHandler.createWord();
      default:
        return { success: false, error: 'Invalid document type' };
    }
  } catch (error) {
    console.error('Error creating document:', error);
    return { success: false, error: error.message || 'Failed to create document' };
  }
});

// Add YouTube API handlers
ipcMain.handle('search-youtube', async (event, query) => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      throw new Error('YouTube API key not configured');
    }

    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(query + ' educational')}&type=video&key=${apiKey}`);
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    return data;
  } catch (error) {
    console.error('YouTube API error:', error);
    throw error;
  }
});

ipcMain.handle('get-youtube-api-key', () => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YouTube API key not configured');
  }
  return apiKey;
}); 