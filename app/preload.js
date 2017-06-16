const {ipcRenderer} = require('electron')

ipcRenderer.on('message', (event, arg) => {
    switch(arg[0]) {
        case "panel":
            switch(arg[1]) {
                case "coins":
                    $("#leftresizer").trigger("click");
                    break;
                case "orders":
                    $("#resizer").trigger("click");
                    break;
                case "wallpaper":
                    $('.site-settings').show();
                    $(".site-settings-button").trigger("click");
                    break;
            }
            break;
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
        if(!$(".site-settings").hasClass("active")) {
            $('.site-settings').hide();
        }
    },1000);

    setTimeout(function(){
        if(leftresizer_toggle = "hide") {
            $("#leftresizer").trigger("click");
        }
        $('#chatbox').hide();
    }, 1500);

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
