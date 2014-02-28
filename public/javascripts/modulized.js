var Chant = Chant || {};
Chant.Socket = (function(){
    var _socket = null;
    return function(force){
        if (force || _socket === null) {
            _socket = new WebSocket('ws://'+Conf.Server().Host+':'+Conf.Server().Port+'/websocket/room/socket');
        }
        if (_socket.readyState > WebSocket.OPEN) return Chant.Socket(true);
        return _socket;
    };
})();
Chant.Render = {
    Event: {
        message: function(event) {

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
        },
        join: function(event) {
            return '';
            //return tmpl('tmpl_event_join',{event:event});
        },
        leave: function(event) {
            return '';
            //return tmpl('tmpl_event_leave',{event:event});
        },
        sound: function(sound) {
            // とりあえず
            var event = {
                User: sound.Sharer,
                Time: new Chant.Time(sound.Timestamp).format(),
                Text: Chant.Anchorize(sound.Source.Url)
            };
            return tmpl('tmpl_event_message', {event:event});
        },
        notification: function(event) {
            alert(event.Text);
            return '';
        }
    },
    RoomInfo: {
        default: function(event){
            return tmpl('tmpl_roominfo_users', {users: event.RoomInfo.Users});
        }
    }
};
Chant.Time = function(timestamp){
    this.timestamp = timestamp;
};
Chant.Time.prototype.format = function(format){
    var _d = new Date(this.timestamp * 1000);
    return _d.toLocaleString();
};
Chant.Notifier = {
    onmessage: function(){
        $('title').text($('title').text() + '!');
    },
    onread: function(){
        $('title').text('Chant');
    },
    init: function(){
        if (window.webkitNotifications.checkPermission() == 0) {
            return;
        } else {
            window.webkitNotifications.requestPermission();
        }
    },
    detectMentioned: function(event){
        var mentioning = "@" + Conf.Me().ScreenName;
        if (event.Text && event.Text.match(mentioning)) {
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
    _show: function(params){
        if (! $('#enable-notification').attr('checked')) return;
        if (typeof params != 'object') params = {};
        var icon = params.icon || '/public/images/favicon.jpg';
        var title = params.title || 'Chant!';
        var text = params.text || 'えら〜';
        var notification = window.webkitNotifications.createNotification(
            icon,
            title,
            text
        );
        notification.onclick = function(){
            window.focus();
        };
        notification.show();
    }
};
Chant.Anchorize = (function() {
    return function(str){
        var ytb = _execYouTube(str);
        if (ytb) return ytb;
        var sndcld = _execSoundCloud(str);
        if (sndcld) return sndcld;
        var img = _execImage(str);
        if (img) return img;
        var anc = _execAnchor(str);
        if (anc) return anc;
        return str;
    }
    function _execYouTube(str){
        var youTubeUrl = /https?:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/g;
        var ytb = youTubeUrl.exec(str);
        if (ytb && ytb.length > 1) {
            return _execAnchor(str) + '<br>' + tmpl('tmpl_base_youtube',{videoId:ytb[1]});
        }
        return null;
    }
    function _execSoundCloud(str){
        var soundCloudUrl = /(https?:\/\/soundcloud\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+))/g;
        var sndcld = soundCloudUrl.exec(str);
        if (sndcld && sndcld.length > 3) {
            var sndcldParams = {
                videoId: sndcld[1],
                url: sndcld[1]
            };
            return _execAnchor(str) + '<br>' + tmpl('tmpl_base_soundcloud',sndcldParams);
        }
        return null;
    }
    function _execImage(str){
        var imgUrl = /((https?):\/\/|www\.)([a-z0-9-]+\.)+[a-z0-9]+(\/[^\s<>"',;]*)?(jpg|png|gif)$/gi;
        var img = imgUrl.exec(str);
        if (img != null && img.length) {
            return str.replace(img[0], _execAnchor(img[0]) + '<br><img src="' + img[0] + '" class="tl-img">');
        }
        return;
    }
    function _execAnchor(str){
        var url = /((https?):\/\/|www\.)([a-z0-9-]+\.)+[a-z0-9]+(\/[^\s<>"',;]*)?/gi;
        var anc = url.exec(str);
        if (anc != null && anc[3] == 'twitter.') {
            var id = anc[4].replace(/^\/[^\/]+\/[^\/]+\//,'');
            setTimeout(function(){
                Chant.Twitter.embed(id);
            },0);
            return '<div id="twitter' + id + '"><a href="' + anc[0] + '" target="_blank">' + str + '</a></div>';
        }
        if (anc != null && anc.length) {
            var lenToTruncate = 50;
            var innerText = (anc[0].length < lenToTruncate) ? anc[0] : anc[0].slice(0, lenToTruncate) + '...';
            return str.replace(anc[0], '<a target="_blank" href="' + anc[0] + '">' + innerText + '</a>');
        }
        return;
    }
})();
Chant.Protocol = (function() {
    var _protocols = {
        img: function(key){
            var keys = {
                'ohayo': function(){
                    return '<img src="./public/images/ohayogozaimasu.jpg" class="tl-img">';
                },
                'odayakajanai': function(){
                    return '<img src="./public/images/odayakajanai.jpg" class="tl-img">';
                },
                'okitekudasai': function(){
                    return '<img src="./public/images/okitekudasai.jpg" class="tl-img">';
                },
                'zawameku': function(){
                    return '<img src="./public/images/zawameku.jpg" class="tl-img">';
                }
            };
            if (typeof keys[key] != 'function') return;
            return keys[key]();
        },
        emo: function(key){
            return '<img src="/public/images/emojis/' + key + '.png" width="40px">';
        },
        /* 危険すぎる
        alert: function(key){
            alert(key);
            return;
        },
        */
        css: function(values){
            var matches = values.match(/^([a-zA-Z_\-#\.]+)\{([a-zA-Z]+):(.+)\}$/);
            if (matches == null || matches.length < 4) return;
            var selector = matches[1];
            var style = {};
            style[matches[2]] = matches[3];
            $(selector).css(style);
            return values;
        },
        stamp: function(url){
            var stampHTML = tmpl('tmpl_base_stamp', {url:url});
            $('#stamps-container').prepend(stampHTML);
            return 'スタンプ登録ed' + stampHTML;
        },
        quote: function(text){
            console.log(text);
            var pattern = /{([^{^}]+)}{([^{^}]+)}{([^{^}]+)}/gi;
            var matched = pattern.exec(text);
            if (matched == null) return;
            var quote = {
                name: matched[1],
                icon: matched[2],
                text: Chant.Anchorize(matched[3])
            };
            return tmpl('tmpl_event_message_quote',{quote:quote});
        }
    };
    return function(str){
        var matches = str.match(/^\{@([a-z]+):(.+)\}$/);
        if (matches == null || matches.length < 3) return;

        var protocol = matches[1];
        var key      = matches[2];

        if (_protocols[protocol] == undefined) return;

        return {
            protocol: protocol,
            value: _protocols[protocol](key)
        };
    }
})();
Chant.Twitter = {
    embed: function(id){
        $.ajax({
            url: 'https://api.twitter.com/1/statuses/oembed.json?id=' + String(id),
            method: 'GET',
            dataType: 'jsonp',
            success: function(res){
                $('#twitter' + id).html(res.html);
            },
            error: function(hoge){
                console.log(hoge);
            }
        });
    }
};
