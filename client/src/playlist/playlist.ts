/// <reference path="../../definitions/soundcloud.d.ts" />
/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/swfobject.d.ts" />
/// <reference path="../../definitions/templating.d.ts" />

module Chant {
    export class _Playlist {
        public nowplaying: number;
        public player:     string;
        constructor(public list?: any[]) {
            this.nowplaying = 0;
            this.player     = '#player';
        }

        private _play(index: number) {
            if (! this.list[index]) return;
            this.nowplaying = index;
            var vendor = this.list[index].Source.Vendor.Name;
            var html = tmpl('tmpl_base_globalplayer', {Sound:this.list[index]});

            $(this.player).html(html);

            Chant.Render.Playlist.update();
            if (vendor == 'youtube') {
                // ロード
                var params = { allowScriptAccess: "always" };
                var atts = { id: "player-youtube" };
                var videoId = this.list[index].Source.Hash;
                // 終了イベントのバインドはonYouTubePlayerReadyがする
                setTimeout(function(){
                    swfobject.embedSWF(
                        "http://www.youtube.com/v/"+videoId+"?enablejsapi=1&playerapiid=ytplayer", 
                        "ytapiplayer", "391", "220", "8", null, null, params, atts
                    );
                }, 0);
            } else if (vendor == 'soundcloud') {
                // ロード
                var widgetIframe = document.getElementById('sc-widget');
                var widget       = SC.Widget(widgetIframe);
                var soudURL      = this.list[index].Source.Hash;
                //alert(soudURL);
                widget.load(soudURL);
                // 終了イベントのバインド
                widget.bind(SC.Widget.Events.READY, function(){
                    widget.play();    
                });
                widget.bind(SC.Widget.Events.FINISH, function(){
                    Chant.Playlist().playNext();
                });
                widget.bind(SC.Widget.Events.ERROR, function(){
                    Chant.Playlist().playNext();
                });
            }
        }

        add(sound: any) {
            this.list.unshift(sound);
        }

        play(index?: number) {
            if (index) this.nowplaying = index;
            this._play(this.nowplaying);
        }

        playNext() {
            this.nowplaying++;
            if (this.list.length <= this.nowplaying) {
                this.nowplaying = 0;
            }
            this._play(this.nowplaying);
        }
    }
}
module Chant {
    var _playlist: _Playlist = null;
    export function Playlist(list?: any[]) {
        if (list || _playlist === null) {
            list = list || [];
            _playlist = new _Playlist(list);
        }
        return _playlist;
    }
}
