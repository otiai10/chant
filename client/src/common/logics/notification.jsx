var chant = chant || {};
chant._notification = {

};
chant.notify = function(title, body, icon, onclick, onclose) {
    onclick = onclick || function() {window.focus();};
    onclose = onclose || function() {};
    var note = new window.Notification(
        title || 'CHANT',
        {
            body: body || 'おだやかじゃないわね',
            icon: icon || ''
        }
    );
    note.onclick = onclick;
    note.onclise = onclose;
};
