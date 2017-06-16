const {app, Menu, MenuItem, dialog, BrowserWindow} = require('electron');
const openAboutWindow = require('electron-about-window').default;
const path = require('path');

exports.menu = false;

exports.startMenus = function(win) {
    const menuItems = [
    {
        label: 'Edit',
        submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'pasteandmatchstyle'},
        {role: 'delete'},
        {role: 'selectall'}
        ]
    },
    {
        label: 'View',
        submenu: [
        {
            label: 'Market pairs',
            click () {
                win.webContents.send("message", ['panel','coins']);
            }
        },
        {
            label: 'Orders panel',
            click () {
                win.webContents.send("message", ['panel','orders']);
            }
        },
        {
            label: 'Wallpaper settings',
            click () {
                win.webContents.send("message", ['panel','wallpaper']);
            }
        },
        {type: 'separator'},
        {role: 'reload'},
        {role: 'togglefullscreen'}
        ]
    },
    {
        label: 'Tools',
        submenu: [
        {
            label: 'Markets',
            enabled: false,
            click () {
                win.webContents.send("message", ['menu','markets']);
            }
        },
        {
            label: 'Alerts',
            enabled: false,
            click () {
                win.webContents.send("message", ['menu','alerts']);
            }
        },
        {
            label: 'Accounts',
            enabled: false,
            click () {
                win.webContents.send("message", ['menu','accounts']);
            }
        },
        {
            label: 'Balances',
            enabled: false,
            click () {
                win.webContents.send("message", ['menu','balances']);
            }
        },
        {
            label: 'Orders',
            enabled: false,
            click () {
                win.webContents.send("message", ['menu','orders']);
            }
        }
        ]
    },
    {
        role: 'window',
        submenu: [
        {role: 'minimize'},
        {role: 'close'}
        ]
    },
    {
        role: 'help',
        submenu: [
        {
            label: 'Features',
            click () { require('electron').shell.openExternal('https://www.coinigy.com/features/') }
        },
        {
            label: 'Exchanges',
            click () { require('electron').shell.openExternal('https://www.coinigy.com/bitcoin-exchanges/') }
        },
        {
            label: 'Pricing',
            click () { require('electron').shell.openExternal('https://www.coinigy.com/pricing/') }
        },
        {
            label: 'Exchanges',
            click () { require('electron').shell.openExternal('https://www.coinigy.com/bitcoin-exchanges/') }
        },
        {
            label: 'API',
            click () { require('electron').shell.openExternal('https://www.coinigy.com/api-documentation/') }
        },
        {type: 'separator'},
        {
            label: 'Developer Tools',
            click () {
                win.webContents.openDevTools();
            }

        }
        ]
    }
    ];


    if (process.platform === 'darwin') {
        menuItems.unshift({
            label: app.getName(),
            submenu: [
            {
                label: 'About',
                click: () => openAboutWindow({
                    icon_path: path.join(__dirname, 'coinigy.png'),
                    bug_report_url: false,
                    license: false,
                    description: 'Your all-in-one platform for digital currency',
                    copyright: 'Non Official',
                    homepage: 'https://github.com/celso/coinigyapp'
                }),
            },
            {type: 'separator'},
            {role: 'services', submenu: []},
            {type: 'separator'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {type: 'separator'},
            {role: 'quit'}
            ]
        })

        // Edit menu
        menuItems[1].submenu.push(
                {type: 'separator'},
                {
                    label: 'Speech',
                    submenu: [
                    {role: 'startspeaking'},
                    {role: 'stopspeaking'}
                    ]
                }
                )

            // Window menu
            menuItems[4].submenu = [
            {role: 'close'},
            {role: 'minimize'},
            {role: 'zoom'},
            {type: 'separator'},
            {role: 'front'}
            ]
    }

    this.menu = Menu.buildFromTemplate(menuItems)
        Menu.setApplicationMenu(this.menu);
}

exports.itemEnable = function(a,b,v) {
    this.menu.items[a].submenu.items[b].enabled = v;
}

exports.itemEnableAll = function(a,v) {
    for(var i in this.menu.items[a].submenu.items) {
        this.menu.items[a].submenu.items[i].enabled = v;
    }
}
