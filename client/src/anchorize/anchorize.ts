
module Chant {
    export function Imager(str: string) {
        var imgUrl = /((https?):\/\/|www\.)([a-z0-9-]+\.)+[a-z0-9:]+(\/[^\s<>"',;]*)?(jpe?g|png|gif)$/gi;
        var img = imgUrl.exec(str);
        if (img != null && img.length) {
            return str.replace(img[0], '<img src="' + img[0] + '">');
        }
        return str;
 
    }
    export function Anchorize(str: string) {
        var emo = _execEmo(str);
        if (emo) return emo;
        var vine = _execVine(str);
        if (vine) return vine;
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

    var _execYouTube = (str) => {
        var youTubeUrl = /https?:\/\/www\.youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]+)/g;
        var ytb = youTubeUrl.exec(str);
        if (ytb && ytb.length > 1) {
            return /* _execAnchor(str) + */ tmpl('tmpl_base_youtube',{videoId:ytb[1]});
        }
        return null;
    };
    var _execSoundCloud = (str) => {
        var soundCloudUrl = /(https?:\/\/soundcloud\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+))/g;
        var sndcld = soundCloudUrl.exec(str);
        if (! sndcld) return null;
        if (sndcld.length < 4) return null;
        if (sndcld[2] == "search") return null;
        return /* _execAnchor(str) + */ tmpl('tmpl_base_soundcloud',{videoId:sndcld[1]});
    };
    var _execImage = (str) => {
        var imgUrl = /((https?):\/\/|www\.)([a-z0-9-]+\.)+[a-z0-9:]+(\/[^\s<>"',;]*)?(jpe?g|png|gif)$/gi;
        var img = imgUrl.exec(str);
        if (img != null && img.length) {
            return str.replace(img[0], /* _execAnchor(img[0]) + */'<a href="'+img[0]+'" target="_blank" rel="noreferrer"><img src="' + img[0] + '" class="tl-img"></a>');
        }
        return null;
    };
    // つらw
    var _execTwitter = (anc) => {
        if (anc.length < 3) return;
        var matched = anc[2].match(/(twitter.com)\/([^\/]+)\/status\/([0-9]+)/);
        if (! matched || matched.length < 4) return;
        var matched = anc[2].match(/(twitter.com)\/([^\/]+)\/status\/([0-9]+)/);
        var id = matched[3];
        setTimeout(() => {Chant.Twitter.embed(id);},0);
        return '<div id="twitter' + id + '"><a href="' + anc[0] + '" target="_blank" rel="noreferrer">' + anc[0] + '</a></div>';
    };
    var _execVine = (str) => {
        var matched = str.match(/(https?:\/\/vine.co\/v\/[^\/]+)\/?.*/);
        if (! matched || matched.length < 2) return;
        return tmpl('tmpl_base_vine',{vineURL:matched[1]});
    };
    var _execAnchor = (str) => {
        var url = /(https?):\/\/([_a-zA-Z0-9-.@&=!~*()\';/?:+$,%#]+)/gi;
        var anc = url.exec(str);
        if (! anc) return;
        var twitterEmbeded = _execTwitter(anc);
        if (twitterEmbeded) return str.replace(anc[0], twitterEmbeded);
        if (anc != null && anc.length) {
            var lenToTruncate = 100;
            var innerText = (anc[0].length < lenToTruncate) ? anc[0] : anc[0].slice(0, lenToTruncate) + '...';
            // {{{
            var id = Date.now() + '' + Math.floor(Math.random() * 100);//とりあえずˉ̞̭ ( ›◡ु‹ ) ˄̻ ̊
            setTimeout(() => {
                Chant.WebPreview.embed(id, anc[0]);
            },0);
            // }}}
            return str.replace(anc[0], '<a id="' + id + '" target="_blank" href="' + anc[0] + '" rel="noreferrer">' + innerText + '</a>');
        }
        return null;
    };
    var _execEmo = (str: string) => {
        var pattern: RegExp = /:([a-zA-Z0-9-+_]+):/gi;
        var matches: RegExpExecArray = pattern.exec(str);
        if (matches && matches.length > 1) {
            var toBeReplaced: RegExp = new RegExp(matches[0].replace("+", "\\+"), "g");
            return str.replace(toBeReplaced, '<img src="/public/images/emojis/' + matches[1] + '.png" width="40px">');
        }
        return null;
    };
}
