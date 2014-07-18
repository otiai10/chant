/// <reference path="../../definitions/index.d.ts" />
declare module Conf {
    export function Server(): any;
    export function Me(): any;
}
module Chant {
    export interface ISocketEvents {
        onmessage?: (event: any) => any;
        onerror?:   (event: any) => any;
        onclose?:   (event: any) => any;
    }
    export module Socket {
        var _instance: WebSocket = null;
        var _events: ISocketEvents = {};
        function instance(force: boolean = false): WebSocket {
            if (window.navigator.onLine == false) {
                var errorMessage = "オフラインだにゃー";
                Chant.Notify(errorMessage);
                throw new Error(errorMessage);
            }
            if (force || _instance == null || _instance.readyState > WebSocket.OPEN) {
                if (_instance) debug("RECONNECTED\t" + _instance.readyState);
                _instance = new WebSocket('ws://'+Conf.Server().Host+':'+Conf.Server().Port+'/websocket/room/socket');
                _instance.onopen = listen;
            }
            return _instance;
        }
        function listen() {
            var doNothing = () => {};
            instance().onmessage = _events.onmessage || doNothing;
            instance().onerror   = _events.onerror || doNothing;
            instance().onclose   = _events.onclose || doNothing;
        }
        export function init(events?: ISocketEvents) {
            _events = events || {};
            instance();
        }
        export function send(message: string) {
            instance().send(message);
        }
    }
}
