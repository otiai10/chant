var chant = chant || {};
chant._notification = {

};
chant.notify = function(body, title, icon, onclick, onclose) {
    onclick = onclick || function() {window.focus();};
    onclose = onclose || function() {};
    if (icon) icon = icon.replace('_normal', '_bigger');
    var note = new window.Notification(
        title || 'CHANT',
        {
            body: body || 'おだやかじゃないわね',
            icon: icon || '/public/img/icon.png'
        }
    );
    note.onclick = onclick;
    note.onclise = onclose;
};

chant.notifier = {
    notify: function(message) {
        chant.addUnread();
        // ignore my message
        if (message.user.id_str == Config.myself.id_str) return;
        // detect @all or @me
        var exp = new RegExp('@all|@' + Config.myself.screen_name);
        if (!exp.test(message.value.text)) return;
        chant.notify(
            message.value.text,
            message.user.screen_name,
            message.user.profile_image_url
        );
    }
};
