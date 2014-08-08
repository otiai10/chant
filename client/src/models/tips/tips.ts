/**
 * チップスです
 */
module Chant {
    export var Tips = {
        mention: {
            title: 'メンション',
            description: '@ユーザ名 を含む発言をすると、相手が通知有効の場合にNotificationが発生します。WebKitであり通知チェックボックスにチェックが入っている場合に通知有効です。ユーザアイコンをクリックすると@ユーザ名を補完してくれます。なお、@all で全員に通知を送ることも可能です。'
        },
        stamp: {
            title: 'スタンプ',
            description: 'いろんなものをスタンプ登録できます。直接スタンプするときは {@stamp:今日も一日がんばるぞい} のように {@stamp:value} の形式で発言してください。それ以外にも、発言のタイムスタンプ横をhoverすると現れる`stamprize`ボタンを押すことで、発言をスタンプ登録することができます。'
        },
        emoji: {
            title: '絵文字',
            description: '<a href="http://www.emoji-cheat-sheet.com/" target="_blank" class="light">GitHub絵文字</a>を使うことができます。例 :trollface:'
        },
        quote: {
            title: '引用',
            description: 'ユーザの発言を引用することができます。発言のタイムスタンプ表示をクリックすると引用形式のテキストが自動で補完されます。複数引用することも可能です。'
        },
        youtube: {
            title: 'プレイリスト機能',
            description: 'YouTubeやSoundCloudのURLを発言すると動画展開されます。ほとんどの発言はリロードすると消えますが、YouTube、SoundCloudのURLについてはサーバで保存しており、かつてユーザがシェアした動画をプレイリスト形式で再生し続けることができます。'
        },
        tweet: {
            title: 'ツイッター埋め込み',
            description: 'ツイッターのパーマリンクURLを発言すると、ツイートの展開がされます。'
        },
        totsuzen: {
            title: '突然の死',
            description: "{@tz:突然の死} -><br>＿人人人人＿<br>＞ 突然の死 ＜<br>￣Y^Y^Y^Y￣"
        }
    };
    export class Tip {
        public title: string;
        public description: string;
        constructor(obj: Object) {
            this.title = obj['title'];
            this.description = obj['description'];
        }
    }
}
