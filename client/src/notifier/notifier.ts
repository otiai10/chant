declare module webkitNotifications {
    export class INotification {
        public onclick: any;
        public show:    any;
    }
    export function checkPermission(): number;
    export function requestPermission(): void;
    export function createNotification(
            icon: string,
            title: string,
            text: string
        ): INotification;
}

module Chant {
    function getChromeVersion(): number {
        return parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
    }
    export class NotifierAlert {
        constructor(){}
        show(text: string, icon: string, title: string) {
            window.alert(text);
        }
        init() {}
    }
    export class NotifierWithPrefix {
        constructor(){}
        show(text: string, icon: string, title: string) {
            var notification = webkitNotifications.createNotification(
                icon,
                title,
                text
            );
            notification.onclick = function(){
                window.focus();
            };
            notification.show();
        }
        init() {
            if (webkitNotifications.checkPermission() !== 0) {
                webkitNotifications.requestPermission();
            }
        }
    }
    export class NotifierDefault {
        constructor(){}
        show(text: string, icon: string, title: string) {
            var notification = new window['Notification'](
                title || "CHANT",
                {
                    body: text || "えら〜",
                    icon: icon || '/public/images/favicon.jpg'
                }
            );
            notification.onclick = function(){
                window.focus();
            }
        }
        init() {
            window['Notification'].requestPermission();
        }
    }
    export function getNotifier(text?: string, icon?: string) {
        if (getChromeVersion() < 28) return new NotifierAlert();
        if (window['webkitNotifications']) return new NotifierWithPrefix();
        return new NotifierDefault();
    }
    export function Notify(text: string,
                           icon: string = '/public/images/favicon.png',
                           title: string = 'CHANT!') {
        if (! $('#enable-notification').is(':checked')) return;
        var notifier = getNotifier();
        notifier.show(text,icon,title);
    }
}

module Chant {
    export var Notifier = {
        isActive: true,
        onmessage: (event: any) => {
            if (event.Type == "leave"
                || event.Type == "join"
                || event.Type == "keepalive") return;
            if (Notifier.isActive) return;
            $('title').text('!' + $('title').text());
        },
        onread: () => {
            $('title').text('CHANT');
        },
        init: () => {
            var notifier = getNotifier();
            notifier.init();
        },
        detectMentioned: (event: any): any => {
            var mentioning = "@" + Conf.Me().ScreenName;
            if (! event.Text) return event;
            if (event.Text.match(mentioning) || event.Text.match('@all')) {
                var params = {
                    icon: event.User.ProfileImageURL,
                    title: event.User.ScreenName,
                    text: event.Text
                };
                Notify(event.Text, event.User.ProfileImageURL, event.User.ScreenName);
                /*
                Chant.Notifier._show(params);
                */
                var html = '<span class="mentioning">' + mentioning + '</span>';
                event.Text = event.Text.replace(mentioning, html);
            }
            return event;
        }
        /*
        _show: (params: any) => {
            if (! $('#enable-notification').is(':checked')) return;
            if (typeof params != 'object') params = {};
            var icon = params.icon || '/public/images/favicon.jpg';
            var title = params.title || 'CHANT!';
            var text = params.text || 'えら〜';
            var notification = webkitNotifications.createNotification(
                icon,
                title,
                text
            );
            notification.onclick = function(){
                window.focus();
            };
            notification.show();
        }
        */
    }
}
