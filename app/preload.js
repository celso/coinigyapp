const {ipcRenderer} = require('electron')

ipcRenderer.on('message', (event, arg) => {
    switch(arg[0]) {
        case "market":
            $('#market_search').focus().dblclick();
            $("#exchange_list").find("[data-exchange='" + arg[1] + "']").click(); // clicks exchange
            $("#market_list").find("[data-exchange='" + arg[1] + "'][data-market='" + arg[2] + "']").click(); // clicks market pair
            update_favs = true; // update favorites menu
            break;
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
                case "logout":
                    window.location.href='https://www.coinigy.com/auth/logout';
                    break;
            }
            break;
        case "settings":
            switch(arg[1]) {
                case "myaccount":
                    window.location.href='https://www.coinigy.com/user/account';
                    break;
            }
            break;
        case "help":
            switch(arg[1]) {
                case "knowledge":
                    window.location.href='https://www.coinigy.com/site/support';
                    break;
                case "ticket":
                    window.location.href='https://www.coinigy.com/site/support_ticket';
                    break;
                case "bug":
                    window.location.href='https://www.coinigy.com/site/support_ticket';
                    break;
            }
            break;
    }
});

document.addEventListener('DOMContentLoaded', function() {

    var marketData = getMarketData();

    ipcRenderer.send('message', ['system','pageloaded']);
    ipcRenderer.send('message', ['path',window.location.pathname]);

    update_favs = true;

    setInterval(function(){
        marketData = getMarketData(); // update the market data

        if(!$(".site-settings").hasClass("active")) { // keep hiding the settings button, it's annoying
            $('.site-settings').hide();
        }

        if(favoritesData!=undefined && update_favs==true) { // time to rebuilt the favorites menu
            ipcRenderer.send('message', ['favorites', favoritesData, marketData.exchangename, marketData.marketname]);
            update_favs=false;
        }
    },1000);

    // marketdata updates
    setInterval(function(){
        ipcRenderer.send('message', ['mdata', marketData]);
    },10000);

    setTimeout(function(){
        // hide markets column as default
        /*
        if(leftresizer_toggle = "hide") {
            $("#leftresizer").trigger("click");
        }
        */
        // hide action column as default
        if(resizer_toggle = "hide") {
            $("#resizer").trigger("click");
        }
        // hide chatbox
        $('#chatbox').hide();
        // hide the navigation bar, we have menus
        /*
        $('#navbar_container').remove();
        $("#wrap br:lt(2)").remove();
        */
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
    // override favorites
    var insertFavorite_legacy = insertFavorite;
    insertFavorite = function() {
        // hack - coinigy doens't update this
        favoritesData.push({
            exch_code: cookie('selected_exchange_code'),
            exch_name: cookie('selected_exchange_name'),
            mkt_name: cookie('selected_market_name')
        });
        insertFavorite_legacy();
        update_favs=true; // update menus
    };
    var deleteFavorite_legacy = deleteFavorite;
    deleteFavorite = function() {
        // hack - coinigy doens't update this
        favoritesData = $.grep(favoritesData, function(e) {
            return (e.mkt_name != cookie('selected_market_name') || e.exch_code != cookie('selected_exchange_code'));
        });
        deleteFavorite_legacy();
        update_favs=true; // update menus
    };

}, false);

function cookie(d) {
    var b = d + "=";
    var a = document.cookie.split(";");
    for (var e = 0; e < a.length; e++) {
        var f = a[e].trim();
        if (f.indexOf(b) == 0) {
            return html_sanitize(f.substring(b.length, f.length))
        }
    }
    return ""
}

function getMarketData() {
    const md = {
        lasthigh: $(".lastHigh").html(),
        lastlow: $(".lastLow").html(),
        lastvolume: $(".lastVolume").html(),
        askprice: current_ask_price,
        bidprice: current_bid_price,
        marketname: market_name,
        exchangename: exchange_name
    };
    return(md);
}
