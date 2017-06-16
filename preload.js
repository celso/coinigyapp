const {ipcRenderer} = require('electron')

ipcRenderer.on('message', (event, arg) => {
    switch(arg[0]) {
        case "menu":
            switch(arg[1]) {
                case "markets":
                    window.location.href='https://www.coinigy.com/main/markets';
                    break;
                case "alerts":
                    window.location.href='https://www.coinigy.com/main/alerts';
                    break;
                case "accounts":
                    window.location.href='https://www.coinigy.com/user/api';
                    break;
                case "balances":
                    window.location.href='https://www.coinigy.com/main/balances';
                    break;
                case "orders":
                    window.location.href='https://www.coinigy.com/main/orders';
                    break;
            }
            break;
    }
});

document.addEventListener('DOMContentLoaded', function() {

    ipcRenderer.send('message', ['system','pageloaded']);
    ipcRenderer.send('message', ['path',window.location.pathname]);

    setInterval(function(){
        // $('.site-settings').hide();
        $('#chatbox').hide();
    }, 1000);

    if (Notification.permission !== "granted"){
        Notification.requestPermission();
    }

    // override notifications
    var inform_legacy = inform;
    inform = function(title, body, type) {
        if (Notification.permission === "granted"){
            var notification = new Notification(title, {
                body: body
            });
        }
        ipcRenderer.send('message', ['notification',title,body]);
        inform_legacy(title, body, type);
    };

}, false);
