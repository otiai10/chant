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
    export var Notifier = {
        isActive: true,
        onmessage: (event: any) => {
            if (event.Type == "leave" || event.Type == "join") return;
            if (Notifier.isActive) return;
            $('title').text('!' + $('title').text());
        },
        onread: () => {
            $('title').text('CHANT');
        },
        init: () => {
            if (webkitNotifications.checkPermission() == 0) {
                return;
            } else {
                webkitNotifications.requestPermission();
            }
        },
        detectMentioned: (event: any): any => {
            var mentioning = "@" + Conf.Me().ScreenName;
            if (! event.Text) return event;
            if (event.Text.match(mentioning) || event.Text.match('@all')) {
                var params = {
                    icon: event.User.ProfileImageUrl,
                    title: event.User.ScreenName,
                    text: event.Text
                };
                Chant.Notifier._show(params);
                var html = '<span class="mentioning">' + mentioning + '</span>';
                event.Text = event.Text.replace(mentioning, html);
            }
            return event;
        },
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
    }
}
