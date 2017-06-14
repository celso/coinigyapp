const electron = require('electron');
// https://github.com/electron/electron/blob/master/docs/api/dialog.md
const {dialog} = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1200,
        minHeight: 800,
        resizable: true,
        title: 'Coinigy',
        webPreferences: {
            devTools: true,
            javascript: true,
            plugins: false
        }
    })

    // and load the index.html of the app.
    mainWindow.loadURL('https://www.coinigy.com/auth/login');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

    mainWindow.webContents.on('did-finish-load', function() {
        //mainWindow.show();
        //dialog.showErrorBox('A JavaScript error occured in the browser process', "woa");
        mainWindow.webContents.executeJavaScript(fs.readFileSync('inject.js', 'utf8'));
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

