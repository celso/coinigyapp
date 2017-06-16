const {app, dialog, BrowserWindow, ipcMain} = require('electron')
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const url = require('url');
const fs = require('fs');

let mainWindow;

app.on('ready', function() {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1260,
        defaultHeight: 840
    });

    mainWindow = new BrowserWindow({
        frame: true,
        minWidth: 1260,
        minHeight: 840,
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        autoHideMenuBar: true,
        title: 'Coinigy',
        webPreferences: {
            javascript: true,
            preload: path.join(__dirname, 'preload.js'),
            plugins: false,
            nodeIntegration: false, // if set to true, then problems with coinify rendering
            webSecurity: true,
            zoomFactor: 1
        },
        fullscreen: false
    })

    mainWindowState.manage(mainWindow);

    mainWindow.loadURL('https://www.coinigy.com/auth/login');

    // mainWindow.webContents.openDevTools()

    var menu = require('./menu');
    menu.startMenus(mainWindow);

    mainWindow.on('closed', function () {
        mainWindow = null
    })

    mainWindow.webContents.on('did-finish-load', function() {
        ipcMain.on('message', (event, arg) => {
            switch(arg[0]) {
                case "notification":
                    // electron has no mature notification apis for the main process yet
                    // done via the renderer process
                    break;
                case "system":
                    switch(arg[1]) {
                        case "pageloaded":
                            break;
                    }
                    break;
                case "path":
                    if(arg[1].startsWith('/main/')) {
                        menu.itemEnableAll(3,true);
                    }
                    else
                    {
                        menu.itemEnableAll(3,false);
                    }
                    console.log(arg[1]);
                    break;
            }
            console.log(arg);  // prints "ping"
        });
    });


});


// Quit when all windows are closed.
app.on('window-all-closed', function () {
    app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})

