/// <reference path="./totsuzen/totsuzen.ts" />
module Chant {
    export enum Protocols {
        img,
        emo,
        css,
        stamp,
        quote,
        totsuzen,
        tz,
        danger
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
            if (matches == null || matches.length < 3) return this;

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
            if (! map[this.value]) return this.abort();
            return '<img src="./public/images/{src}" class="tl-img">'.replace('{src}', map[this.value]);
        }
        css(): string {
            var matches = this.value.match(/^([a-zA-Z_\-#\.]+)\{([a-zA-Z]+):(.+)\}$/);
            if (matches == null || matches.length < 4) return this.abort();
            var selector = matches[1];
            var style = {};
            style[matches[2]] = matches[3];
            $(selector).css(style);
            return this.origin;
        }
        stamp(): string {
            var stamp = {raw: this.value, label: this.value.slice(0,20), display: Imager(this.value)};
            var stampHTML = tmpl('tmpl_base_stamp', stamp);
            Chant.Render.Event.stamp({Value:this.value});
            return 'スタンプ登録' + stampHTML;
        }
        quote(str: string = null): string {
            var targetValue = str || this.value;
            var splits = targetValue.split('||');
            var name = splits[0];
            var icon = splits[1];
            var text = splits[2];
            // {{{
            if (splits.length < 3) return this.abort();
            if (3 < splits.length) {
                // セパレータで分けてもまだ要素があるってことは、これはquoteのquoteなので、再帰する
                text = Chant.Protocol(splits.splice(2).join('||') + '}');
            } else {
                text = Chant.Anchorize(text);
            }
            // }}}
            var quote = {
                name: name,
                icon: icon,
                text: text
            };
            return tmpl('tmpl_event_message_quote',{quote:quote});
        }
        totsuzen(): string {
            if (! this.value) return this.abort();
            var t = new Totsuzen(this.value);
            return t.toText();
        }
        tz(): string {
            return this.totsuzen();
        }
        danger(): string {
            var id = "danger-hidden-" + Date.now();
            return '<span id="'+id+'" style="color:#bbb;font-size:x-large" class="danger-hidden clickable" data-dangerous="'+this.value+'">⚠</span>';
        }
        abort(): string {
            return this.origin;
        }
    }
    export function Protocol(str: string) {
        var chunks = str.match(/\{@([a-z]+):([^}]+)\}/g);
        // プロトコルは含まれてない
        if (! chunks) return;
        var response = str;
        $.map(chunks, (chunk) => {
            var ex = new ProtocolExecuter(chunk);
            // エクゼキュータが受け付けてないならこれを無視
            if (! ex.ok) return;
            // エグゼキュータが受け付けている場合はこれを置換する
            response = response.replace(ex.origin, ex.result);
        });
        return response;
    }
}
