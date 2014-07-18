/// <reference path="../../definitions/index.d.ts" />
declare module Conf {
    export function Server(): any;
    export function Me(): any;
}
module Chant {
    enum WebSocketStatus {
        CONNECTING = 0,
        OPEN = 1,
        CLOSING = 2,
        CLOSED = 3,
    }
    var _socket: any = null;
    export function Socket(force: boolean) {
        if (_socket) debug("WebSocket.readyState\t" + _socket.readyState);
        if (window.navigator.onLine == false) {
            return Chant.Notify("Network is offline");
        }
        if (force || _socket === null || _socket.readyState != WebSocketStatus.OPEN) {
            _socket = new WebSocket('ws://'+Conf.Server().Host+':'+Conf.Server().Port+'/websocket/room/socket');
        }
        if (_socket.readyState > WebSocket.OPEN) return Chant.Socket(true);
        return _socket;
    }
    export function AutoRecover() {
        var keep = setInterval(() => {
            if (window.navigator.onLine == false) return;
            Chant.Socket(true);
        }, 3000);
    }
}
