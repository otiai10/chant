
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
        var youTubeUrl = /https?:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/g;
        var ytb = youTubeUrl.exec(str);
        if (ytb && ytb.length > 1) {
            return /* _execAnchor(str) + */ tmpl('tmpl_base_youtube',{videoId:ytb[1]});
        }
        return null;
    }
    var _execSoundCloud = (str) => {
        var soundCloudUrl = /(https?:\/\/soundcloud\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+))/g;
        var sndcld = soundCloudUrl.exec(str);
        if (sndcld && sndcld.length > 3) {
            return /* _execAnchor(str) + */ tmpl('tmpl_base_soundcloud',{videoId:sndcld[1]});
        }
        return null;
    }
    var _execImage = (str) => {
        var imgUrl = /((https?):\/\/|www\.)([a-z0-9-]+\.)+[a-z0-9:]+(\/[^\s<>"',;]*)?(jpe?g|png|gif)$/gi;
        var img = imgUrl.exec(str);
        if (img != null && img.length) {
            return str.replace(img[0], /* _execAnchor(img[0]) + */'<a href="'+img[0]+'" target="_blank"><img src="' + img[0] + '" class="tl-img"></a>');
        }
        return;
    }
    var _execAnchor = (str) => {
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
            var lenToTruncate = 100;
            var innerText = (anc[0].length < lenToTruncate) ? anc[0] : anc[0].slice(0, lenToTruncate) + '...';
            return str.replace(anc[0], '<a target="_blank" href="' + anc[0] + '">' + innerText + '</a>');
        }
        return;
    }
}
