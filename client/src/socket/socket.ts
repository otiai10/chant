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
            if (force || _instance == null) {
                _instance = new WebSocket('ws://'+Conf.Server().Host+':'+Conf.Server().Port+'/websocket/room/socket');
            }
            if (_instance.readyState > WebSocket.OPEN) {
                return instance(true);
            }
            on();
            return _instance;
        }
        function on(events: ISocketEvents = null) {
            if (events) _events = events;
            var doNothing = () => {};
            instance().onmessage = _events.onmessage || doNothing;
            instance().onerror   = _events.onerror || doNothing;
            instance().onclose   = _events.onclose || doNothing;
        }
        export function init(events?: ISocketEvents) {
            instance();
            on(events);
        }
        export function send(message: string) {
            instance().send(message);
        }
    }
}
