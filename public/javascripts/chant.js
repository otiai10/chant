var Chant;
(function (Chant) {
    function Anchorize(str) {
        var ytb = _execYouTube(str);
        if (ytb)
            return ytb;
        var sndcld = _execSoundCloud(str);
        if (sndcld)
            return sndcld;
        var img = _execImage(str);
        if (img)
            return img;
        var anc = _execAnchor(str);
        if (anc)
            return anc;
        return str;
    }
    Chant.Anchorize = Anchorize;

    var _execYouTube = function (str) {
        var youTubeUrl = /https?:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/g;
        var ytb = youTubeUrl.exec(str);
        if (ytb && ytb.length > 1) {
            return '<br>' + tmpl('tmpl_base_youtube', { videoId: ytb[1] });
        }
        return null;
    };
    var _execSoundCloud = function (str) {
        var soundCloudUrl = /(https?:\/\/soundcloud\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+))/g;
        var sndcld = soundCloudUrl.exec(str);
        if (sndcld && sndcld.length > 3) {
            return '<br>' + tmpl('tmpl_base_soundcloud', { videoId: sndcld[1] });
        }
        return null;
    };
    var _execImage = function (str) {
        var imgUrl = /((https?):\/\/|www\.)([a-z0-9-]+\.)+[a-z0-9]+(\/[^\s<>"',;]*)?(jpg|png|gif)$/gi;
        var img = imgUrl.exec(str);
        if (img != null && img.length) {
            return str.replace(img[0], '<br><a href="' + img[0] + '" target="_blank"><img src="' + img[0] + '" class="tl-img"></a>');
        }
        return;
    };
    var _execAnchor = function (str) {
        var url = /((https?):\/\/|www\.)([a-z0-9-]+\.)+[a-z0-9]+(\/[^\s<>"',;]*)?/gi;
        var anc = url.exec(str);
        if (anc != null && anc[3] == 'twitter.') {
            var id = anc[4].replace(/^\/[^\/]+\/[^\/]+\//, '');
            setTimeout(function () {
                Chant.Twitter.embed(id);
            }, 0);
            return '<div id="twitter' + id + '"><a href="' + anc[0] + '" target="_blank">' + str + '</a></div>';
        }
        if (anc != null && anc.length) {
            var lenToTruncate = 100;
            var innerText = (anc[0].length < lenToTruncate) ? anc[0] : anc[0].slice(0, lenToTruncate) + '...';
            return str.replace(anc[0], '<a target="_blank" href="' + anc[0] + '">' + innerText + '</a>');
        }
        return;
    };
})(Chant || (Chant = {}));
var Chant;
(function (Chant) {
    Chant.Twitter = {
        embed: function (id) {
            $.ajax({
                url: 'https://api.twitter.com/1/statuses/oembed.json?id=' + String(id),
                method: 'GET',
                dataType: 'jsonp',
                success: function (res) {
                    $('#twitter' + id).html(res.html);
                },
                error: function (hoge) {
                    console.log(hoge);
                }
            });
        }
    };
})(Chant || (Chant = {}));
var Chant;
(function (Chant) {
    var Time = (function () {
        function Time(timestamp) {
            this.timestamp = timestamp;
        }
        Time.prototype.format = function () {
            var d = new Date(this.timestamp * 1000);
            return d.toLocaleString();
        };
        return Time;
    })();
    Chant.Time = Time;
})(Chant || (Chant = {}));
var Chant;
(function (Chant) {
    Chant.Notifier = {
        onmessage: function () {
            $('title').text('!' + $('title').text());
        },
        onread: function () {
            $('title').text('Chant');
        },
        init: function () {
            if (webkitNotifications.checkPermission() == 0) {
                return;
            } else {
                webkitNotifications.requestPermission();
            }
        },
        detectMentioned: function (event) {
            var mentioning = "@" + Conf.Me().ScreenName;
            if (!event.Text)
                return event;
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
        _show: function (params) {
            if (!$('#enable-notification').attr('checked'))
                return;
            if (typeof params != 'object')
                params = {};
            var icon = params.icon || '/public/images/favicon.jpg';
            var title = params.title || 'Chant!';
            var text = params.text || 'えら〜';
            var notification = webkitNotifications.createNotification(icon, title, text);
            notification.onclick = function () {
                window.focus();
            };
            notification.show();
        }
    };
})(Chant || (Chant = {}));
var Chant;
(function (Chant) {
    var _Playlist = (function () {
        function _Playlist(list) {
            this.list = list;
            this.nowplaying = 0;
            this.player = '#player';
        }
        _Playlist.prototype._play = function (index) {
            if (!this.list[index])
                return;
            this.nowplaying = index;
            var vendor = this.list[index].Source.Vendor.Name;
            var html = tmpl('tmpl_base_globalplayer', { Sound: this.list[index] });

            $(this.player).html(html);

            Chant.Render.Playlist.update();
            if (vendor == 'youtube') {
                var params = { allowScriptAccess: "always" };
                var atts = { id: "player-youtube" };
                var videoId = this.list[index].Source.Hash;

                setTimeout(function () {
                    swfobject.embedSWF("http://www.youtube.com/v/" + videoId + "?enablejsapi=1&playerapiid=ytplayer", "ytapiplayer", "391", "220", "8", null, null, params, atts);
                }, 0);
            } else if (vendor == 'soundcloud') {
                var widgetIframe = document.getElementById('sc-widget');
                var widget = SC.Widget(widgetIframe);
                var soudURL = this.list[index].Source.Hash;

                widget.load(soudURL);

                widget.bind(SC.Widget.Events.READY, function () {
                    widget.play();
                });
                widget.bind(SC.Widget.Events.FINISH, function () {
                    Chant.Playlist().playNext();
                });
                widget.bind(SC.Widget.Events.ERROR, function () {
                    Chant.Playlist().playNext();
                });
            }
        };

        _Playlist.prototype.add = function (sound) {
            this.list.unshift(sound);
        };

        _Playlist.prototype.play = function (index) {
            if (index)
                this.nowplaying = index;
            this._play(this.nowplaying);
        };

        _Playlist.prototype.playNext = function () {
            this.nowplaying++;
            if (this.list.length <= this.nowplaying) {
                this.nowplaying = 0;
            }
            this._play(this.nowplaying);
        };
        return _Playlist;
    })();
    Chant._Playlist = _Playlist;
})(Chant || (Chant = {}));
var Chant;
(function (Chant) {
    var _playlist = null;
    function Playlist(list) {
        if (list || _playlist === null) {
            list = list || [];
            _playlist = new Chant._Playlist(list);
        }
        return _playlist;
    }
    Chant.Playlist = Playlist;
})(Chant || (Chant = {}));
var Chant;
(function (Chant) {
    function Protocol(str) {
        var matches = str.match(/^\{@([a-z]+):(.+)\}$/);
        if (matches == null || matches.length < 3)
            return;

        var protocol = matches[1];
        var key = matches[2];

        if (protocols[protocol] == undefined)
            return;

        return {
            protocol: protocol,
            value: protocols[protocol](key)
        };
    }
    Chant.Protocol = Protocol;

    var protocols = {
        img: function (key) {
            var keys = {
                'ohayo': function () {
                    return '<img src="./public/images/ohayogozaimasu.jpg" class="tl-img">';
                },
                'odayakajanai': function () {
                    return '<img src="./public/images/odayakajanai.jpg" class="tl-img">';
                },
                'okitekudasai': function () {
                    return '<img src="./public/images/okitekudasai.jpg" class="tl-img">';
                },
                'zawameku': function () {
                    return '<img src="./public/images/zawameku.jpg" class="tl-img">';
                },
                'chunchun': function () {
                    return '<img src="./public/images/kotori.jpg" class="tl-img">';
                }
            };
            if (typeof keys[key] != 'function')
                return;
            return keys[key]();
        },
        emo: function (key) {
            return '<img src="/public/images/emojis/' + key + '.png" width="40px">';
        },
        css: function (values) {
            var matches = values.match(/^([a-zA-Z_\-#\.]+)\{([a-zA-Z]+):(.+)\}$/);
            if (matches == null || matches.length < 4)
                return;
            var selector = matches[1];
            var style = {};
            style[matches[2]] = matches[3];
            $(selector).css(style);
            return values;
        },
        stamp: function (url) {
            var stampHTML = tmpl('tmpl_base_stamp', { url: url });
            $('#stamps-container').prepend(stampHTML);
            return 'スタンプ登録ed' + stampHTML;
        },
        quote: function (text) {
            console.log(text);
            var pattern = /{([^{^}]+)}{([^{^}]+)}{([^{^}]+)}/gi;
            var matched = pattern.exec(text);
            if (matched == null)
                return;
            var quote = {
                name: matched[1],
                icon: matched[2],
                text: Chant.Anchorize(matched[3])
            };
            return tmpl('tmpl_event_message_quote', { quote: quote });
        }
    };
})(Chant || (Chant = {}));
var Chant;
(function (Chant) {
    var Render = (function () {
        function Render() {
        }
        Render.message = function (event) {
            event.RawText = event.Text;

            event.isMention = false;
            event = Chant.Notifier.detectMentioned(event);

            event.Time = new Chant.Time(event.Timestamp).format();

            event.isQuote = false;
            var prtcl = Chant.Protocol(event.Text);
            if (prtcl) {
                event.Text = prtcl.value;
                if (prtcl.protocol == 'quote')
                    event.isQuote = true;
                return tmpl('tmpl_event_message', { event: event });
            }
            event.Text = Chant.Anchorize(event.Text);
            return tmpl('tmpl_event_message', { event: event });
        };
        Render.join = function (event) {
            return '';
        };
        Render.leave = function (event) {
            return '';
        };
        Render.sound = function (sound) {
            Chant.Playlist().add(sound);
            return '';
        };
        Render.notification = function (event) {
            alert(event.Text);
            return '';
        };

        Render.default = function (event) {
            return tmpl('tmpl_roominfo_users', { users: event.RoomInfo.Users });
        };

        Render.update = function (list) {
            list = list || Chant.Playlist().list;
            var nowplaying = Chant.Playlist().nowplaying;
            var html = $.map(list, function (sound, index) {
                sound.index = index;
                var isNowPlaying = false;
                if (nowplaying == index)
                    isNowPlaying = true;
                sound.isNowPlaying = isNowPlaying;
                if (sound.Source.Vendor.Name == 'youtube') {
                    sound.title = sound.Source.Hash;
                } else if (sound.Source.Vendor.Name = 'soundcloud') {
                    sound.title = sound.Source.Hash.replace(/^https:\/\/soundcloud\.com/, '');
                }
                return tmpl('tmpl_base_playlist_sound', sound);
            }).join('');
            $('#playlist').html(html);
            return '';
        };
        Render.Event = {
            message: Render.message,
            join: Render.join,
            leave: Render.leave,
            sound: Render.sound,
            notification: Render.notification
        };

        Render.RoomInfo = {
            default: Render.default
        };

        Render.Playlist = {
            update: Render.update
        };
        return Render;
    })();
    Chant.Render = Render;
})(Chant || (Chant = {}));
var Chant;
(function (Chant) {
    var _socket = null;
    function Socket(force) {
        if (force || _socket === null) {
            _socket = new WebSocket('ws://' + Conf.Server().Host + ':' + Conf.Server().Port + '/websocket/room/socket');
        }
        if (_socket.readyState > WebSocket.OPEN)
            return Chant.Socket(true);
        return _socket;
    }
    Chant.Socket = Socket;
})(Chant || (Chant = {}));
