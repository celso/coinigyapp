const {app, dialog, BrowserWindow, ipcMain, session, Tray} = require('electron')
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const url = require('url');
const fs = require('fs');

let mainWindow;

let debug = process.argv[2] && process.argv[2]=='dev' ? true : false;

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

    var menu = require('./menu');
    menu.startMenus(app, mainWindow, debug);

    mainWindow.on('close', function (e) {
        // doesn't quit, just hides windows - osx specific
        e.preventDefault();
        mainWindow.hide();
    })

    mainWindow.webContents.on('did-finish-load', function() {
        ipcMain.on('message', (event, arg) => {
            switch(arg[0]) {
                case "favorites":
                    menu.addFavorites(arg[1], arg[2], arg[3]);
                    break;
                case "mdata":
                    menu.rebuildTrayItems(arg[1]);
                    break;
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
                    menu.itemEnableAll(menu.MENU_NAVIGATION, arg[1].startsWith('/main/') ? true : false);
                    break;
            }
        });
    });


});

app.on('will-quit', function () {
    // This is a good place to add tests insuring the app is still
    // responsive and all windows are closed.
    console.log("will-quit");
    mainWindow = null;
});


// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
    else
    {
        mainWindow.show();
    }
})

app.on("browser-window-focus", () => {
    mainWindow.show();
});
