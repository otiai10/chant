var chant = chant || {};
chant.__socket = null;
chant.socket = function(force) {
    if (chant.__socket !== null &&
        chant.__socket.readyState > WebSocket.OPEN) {
        console.debug('chant.socket', '閉じてたのでforceする');
        force = true;
    }
    if (!chant.__socket || force) {
        chant.__socket = new WebSocket('ws://'+Config.server.host+'/websocket/room/socket');
    }
    return chant.__socket;
};

/**
 * おくるやつ
 * @param typ
 * @param value
 * @constructor
 */
chant.Send = function(/* string */typ/* string */, /* any */value) {
    if (typeof value.trim === 'function' && value.trim().length === 0) {
        return;// do nothing
    }
    chant.socket().send(JSON.stringify({
        type:typ,
        raw:value
    }));
};
