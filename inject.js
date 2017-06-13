
$().ready(function() {
    /* hide a few elements for the desktop app */
    setInterval(function(){
        $('.site-settings').hide();
        $('#chatbox').hide();
    }, 1000);

    if (Notification.permission !== "granted"){
        Notification.requestPermission();
    }

    // override notifications
    inform = function(title, body, type) {
        if (Notification.permission === "granted"){
            var notification = new Notification(title, {
                body: body
            });
        }
    };

});
