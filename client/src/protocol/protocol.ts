module Chant {

    export function Protocol(str: string) {
        var matches = str.match(/^\{@([a-z]+):(.+)\}$/);
        if (matches == null || matches.length < 3) return;

        var protocol = matches[1];
        var key      = matches[2];

        if (protocols[protocol] == undefined) return;

        return {
            protocol: protocol,
            value: protocols[protocol](key)
        };
    }

    var protocols: Object = {
        img: (key) => {
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
                },
                'chunchun': function(){
                    return '<img src="./public/images/kotori.jpg" class="tl-img">';
                }
            };
            if (typeof keys[key] != 'function') return;
            return keys[key]();
        },
        emo: (key) => {
            return '<img src="/public/images/emojis/' + key + '.png" width="40px">';
        },
        css: (values) => {
            var matches = values.match(/^([a-zA-Z_\-#\.]+)\{([a-zA-Z]+):(.+)\}$/);
            if (matches == null || matches.length < 4) return;
            var selector = matches[1];
            var style = {};
            style[matches[2]] = matches[3];
            $(selector).css(style);
            return values;
        },
        stamp: (url) => {
            var stampHTML = tmpl('tmpl_base_stamp', {url:url});
            $('#stamps-container').prepend($(stampHTML));
            return 'スタンプ登録ed' + stampHTML;
        },
        quote: (text) => {
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

}
