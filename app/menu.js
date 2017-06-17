const {app, Menu, MenuItem, dialog, BrowserWindow} = require('electron');
const openAboutWindow = require('electron-about-window').default;
const path = require('path');

exports.menu = false;
exports.win = false;
exports.menuItems = false;
exports.debug = false;

exports.MENU_ABOUT = 0;
exports.MENU_EDIT = 1;
exports.MENU_VIEW = 2;
exports.MENU_NAVIGATION = 3;
exports.MENU_FAVORITES = 4;
exports.MENU_WINDOW = 5;
exports.MENU_HELP = 6;

exports.startMenus = function(win, debug) {

    this.win = win;
    this.debug = debug;
    this.menuItems = []

    this.menuItems[this.MENU_EDIT]={
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
    };

    this.menuItems[this.MENU_VIEW]={
        label: 'View',
        submenu: [
            {
                label: 'Show/Hide Markets',
                accelerator: 'CommandOrControl+1',
                click () {
                    win.webContents.send("message", ['panel','coins']);
                }
            },
            {
                label: 'Show/Hide Orders',
                accelerator: 'CommandOrControl+2',
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
    };

    this.menuItems[this.MENU_NAVIGATION]={
        label: 'Navigation',
        submenu: [
            {
                label: 'Markets',
                click () {
                    win.webContents.send("message", ['menu','markets']);
                }
            },
            {
                label: 'Alerts',
                click () {
                    win.webContents.send("message", ['menu','alerts']);
                }
            },
            {
                label: 'Accounts',
                click () {
                    win.webContents.send("message", ['menu','accounts']);
                }
            },
            {
                label: 'Balances',
                click () {
                    win.webContents.send("message", ['menu','balances']);
                }
            },
            {
                label: 'Orders',
                click () {
                    win.webContents.send("message", ['menu','orders']);
                }
            }
        ]
    };

    this.menuItems[this.MENU_FAVORITES]={
        label: 'Favorites',
        submenu: [
            {
                label: 'None',
                enabled: false
            }
        ]
    };

    this.menuItems[this.MENU_WINDOW]={
        role: 'window',
        submenu: [
            {role: 'minimize'},
            {role: 'close'}
        ]
    };

    this.menuItems[this.MENU_HELP]={
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
                label: 'Knowledge Base',
                click () { require('electron').shell.openExternal('https://www.coinigy.com/site/support') }
            },
            {
                label: 'Submit Ticket',
                click () { require('electron').shell.openExternal('https://www.coinigy.com/site/support_ticket') }
            },
            {
                label: 'Bug Report',
                click () { require('electron').shell.openExternal('https://www.coinigy.com/site/support_ticket') }
            },
        ]
    };

    if(debug) {
        this.menuItems[this.MENU_HELP].submenu.push({type: 'separator'});
        this.menuItems[this.MENU_HELP].submenu.push({
            label: 'Developer Tools',
            click () {
                win.webContents.openDevTools();
            }

        });
    }

    if (process.platform === 'darwin') {
        this.menuItems[this.MENU_ABOUT]={
            label: app.getName(),
            submenu: [
                {
                    label: 'About',
                    click: () => openAboutWindow({
                        icon_path: path.join(__dirname, '../assets/coinigy.png'),
                        bug_report_url: false,
                        license: false,
                        description: 'Your all-in-one platform for digital currency',
                        copyright: 'Non Official',
                        homepage: 'https://github.com/celso/coinigyapp'
                    }),
                },
                {type: 'separator'},
                {
                    label: 'Settings',
                    submenu: [
                        {
                            label: 'My Account',
                            click () {
                                win.webContents.send("message", ['settings','myaccount']);
                            }
                        }
                    ]
                },
                {type: 'separator'},
                {role: 'services', submenu: []},
                {type: 'separator'},
                {role: 'hide'},
                {role: 'hideothers'},
                {role: 'unhide'},
                {type: 'separator'},
                {role: 'quit'},
                {
                    label: 'Logout',
                    click () { win.webContents.send("message", ['menu','logout']); }
                },
            ]
        };

        // Edit menu
        this.menuItems[this.MENU_EDIT].submenu.push(
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
        this.menuItems[this.MENU_WINDOW].submenu = [
            {role: 'close'},
            {role: 'minimize'},
            {role: 'zoom'},
            {type: 'separator'},
            {role: 'front'}
        ]
    }

    this.menu = Menu.buildFromTemplate(this.menuItems)
    Menu.setApplicationMenu(this.menu);
}

exports.addFavorites = function(f) {
    this.menuItems[4].submenu = [];
    var xc=[];
    var win = this.win;
    var clickHandler = function(c,m) {
        return(function() { win.webContents.send("message", ['market', c, m]) });
    }
    for(var i in f) {
        if(!xc[f[i].exch_name]) {
            xc[f[i].exch_name]=true;
            var sub=[];
            for(var n in f) {
                if(f[n].exch_name==f[i].exch_name) {
                    var code = f[n].exch_code;
                    var market = f[n].mkt_name;
                    var click = clickHandler(code, market);
                    sub.push({
                        label: f[n].mkt_name,
                        celso: 'celso',
                        click: click
                    });
                }
            }
            this.menuItems[this.MENU_FAVORITES].submenu.push({
                label: f[i].exch_name,
                submenu: sub
            });
        }
    }
    this.menu = Menu.buildFromTemplate(this.menuItems)
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
