
module Chant {
    export var Chips = {
        stamp: {
            title:'@stamp',
            placeholder:'画像URL',
            description:'任意の画像を全ユーザの窓においてスタンプとして登録できます。このコマンドで1度スタンプ登録すると、ページをリロードしない限りボタンからいつでもスタンプ画像を投下できます',
            sampleValue:'https://pbs.twimg.com/media/BitWdO3CMAEb-4k.jpg'
        },
        emo: {
            title:'@emo',
            placeholder:'GitHubのemojiコード',
            description:'簡単に絵文字を出力することができます。GitHubのemojiコード全てに対応しています。詳しくは<a href="http://www.emoji-cheat-sheet.com/" target="_blank" class="light">Emoji cheat sheet for Campfire and GitHub</a>',
            sampleValue:'shit'
        }
    }
    export class Chip {
        public title: string;
        public placeholder: string;
        public description: string;
        public sampleValue: string;
        constructor(obj: Object) {
            this.title = obj['title'];
            this.placeholder = obj['placeholder'];
            this.description = obj['description'];
            this.sampleValue = obj['sampleValue'];
        }
        toSampleText(): string {
            return '{' + this.title + ':' + this.sampleValue + '}';
        }
    }
}
