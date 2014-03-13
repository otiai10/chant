// とりあえず移植しただけだから糞すぎる
module Chant {
    export class Render {
        public static Event = {
            message: Render.message,
            join: Render.join,
            leave: Render.leave,
            sound: Render.sound,
            notification: Render.notification
        }
        private static message(event: any): string {
            event.RawText = event.Text;

            event.isMention = false;
            event = Chant.Notifier.detectMentioned(event);

            event.Time = new Chant.Time(event.Timestamp).format();
            // うわーきもい
            event.isQuote = false;
            var prtcl = Chant.Protocol(event.Text);
            if (prtcl) {
                event.Text = prtcl.value;
                if (prtcl.protocol == 'quote') event.isQuote = true;
                return tmpl('tmpl_event_message',{event:event});
            }
            event.Text = Chant.Anchorize(event.Text);
            return tmpl('tmpl_event_message',{event:event});
        }
        private static join(event: any): string {
            return '';
        }
        private static leave(event: any): string {
            return '';
        }
        private static sound(sound: any): string {
            Chant.Playlist().add(sound);
            return '';
        }
        private static notification(event: any): string {
            alert(event.Text);
            return '';
        }

        public static RoomInfo = {
            default: Render.default
        }
        private static default(event: any): string {
            var view = new IntroductionModalView();
            $('body').append(view.render().$el);
            return tmpl('tmpl_roominfo_users', {users: event.RoomInfo.Users });
        }

        public static Playlist = {
            update: Render.update
        }
        private static update(list?: any[]): string {
            list = list || Chant.Playlist().list;
            var nowplaying = Chant.Playlist().nowplaying;
            var html = $.map(list, function(sound, index){
                sound.index = index;
                var isNowPlaying = false;
                if (nowplaying == index) isNowPlaying = true;
                sound.isNowPlaying = isNowPlaying;
                if (sound.Source.Vendor.Name == 'youtube') {
                    sound.title = sound.Source.Hash;
                } else if (sound.Source.Vendor.Name = 'soundcloud') {
                    sound.title = sound.Source.Hash.replace(/^https:\/\/soundcloud\.com/,'');
                }
                return tmpl('tmpl_base_playlist_sound', sound);
            }).join('');
            $('#playlist').html(html);
            return '';
        }
    }
}
