declare module Conf {
    export function Server(): any;
    export function Me(): any;
}
module Chant {
    var _socket: any = null;
    export function Socket(force: boolean) {
        if (force || _socket === null) {
            _socket = new WebSocket('ws://'+Conf.Server().Host+':'+Conf.Server().Port+'/websocket/room/socket');
        }
        if (_socket.readyState > WebSocket.OPEN) return Chant.Socket(true);
        return _socket;
    }
}
