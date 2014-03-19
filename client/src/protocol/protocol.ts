module Chant {
    export enum Protocols {
        img,
        emo,
        css,
        stamp,
        quote
    }
    export class ProtocolExecuter {
        public origin: string;
        public result: string;
        public ok: boolean = false;
        public name: string;
        public value: string;
        constructor(origin) {
            this.origin = origin;

            var matches = this.origin.match(/^\{@([a-z]+):([^}]+)\}$/);
            if (matches.length < 3) return this;

            this.name  = matches[1];
            if (! Protocols[Protocols[this.name]]) return this;

            this.value = matches[2];
            this.ok = true;

            this.result = this[this.name]();
        }
        emo(): string {
            return '<img src="/public/images/emojis/' + this.value + '.png" width="40px">';
        }
        img(): string {
            var map = {
                'ohayo':        "ohayogozaimasu.jpg",
                'odayakajanai': "odayakajanai.jpg",
                'okitekudasai': "okitekudasai.jpg",
                'zawameku':     "zawameku.jpg",
                'chunchun':     "kotori.jpg"
            };
            if (! map[this.value]) return this.origin;
            return '<img src="./public/images/{src}" class="tl-img">'.replace('{src}', map[this.value]);
        }
        css(): string {
            var matches = values.match(/^([a-zA-Z_\-#\.]+)\{([a-zA-Z]+):(.+)\}$/);
            if (matches == null || matches.length < 4) return this.origin;
            var selector = matches[1];
            var style = {};
            style[matches[2]] = matches[3];
            $(selector).css(style);
            return this.origin;
        }
        stamp(): string {
            var stampHTML = tmpl('tmpl_base_stamp', {raw: this.value, label: Imager(val)});
            $('#stamps-container').prepend($(stampHTML));
            return 'スタンプ登録' + stampHTML;
        }
        quote(): string {
            var pattern = /([^{^}]+)\|\|([^{^}]+)\|\|([^{^}]+)/gi;
            var matched = pattern.exec(this.value);
            if (matched == null) return;
            var quote = {
                name: matched[1],
                icon: matched[2],
                text: Chant.Anchorize(matched[3])
            };
            return tmpl('tmpl_event_message_quote',{quote:quote});
        }
    }
    export function Protocol(str: string) {
        var chunks = str.match(/\{@([a-z]+):([^}]+)\}/g);
        if (! chunks) return;
        $.map(chunks, (chunk) => {
            var ex = new ProtocolExecuter(chunk);
            if (! ex.ok) return;
            str = str.replace(ex.origin, ex.result);
        });
        return str;
    }
}
