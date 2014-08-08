/// <reference path="../../../definitions/jquery.d.ts" />

module Chant {
    export class Totsuzen {
        private length: number = 0;
        private head: string = "＿";
        private foot: string = "￣";
        private hat: string = "人";
        private shoe1: string = "^";
        private shoe2: string = "Y";
        private left: string = "＞";
        private right: string = "＜";
        public static text(value: string): string {
            var t = new this(value);
            return t.toText();
        }
        constructor(private value: string) {
            this.length = this.checkLength();
        }
        private getTopLine(): string {
            var caps: string[] = [this.head];
            for (var i = 0; i < this.length; i++) {
                caps.push(this.hat);
            }
            caps.push(this.head);
            return caps.join('');
        }
        private getMiddleLine(): string {
            var middle: string[] = [this.left, " ", this.value, " ", this.right];
            return middle.join('');
        }
        private getBottomLine(): string {
            var bottom: string[] = [];
            for (var i = 0; i < this.length; i++) {
                bottom.push(this.shoe1, this.shoe2);
            }
            bottom = bottom.slice(1);
            bottom.unshift(this.foot);
            bottom.push(this.foot);
            return bottom.join('');
        }
        public toText(): string {
            return [
                this.getTopLine(),
                this.getMiddleLine(),
                this.getBottomLine()
            ].join("<br>");
        }
        // 長さの微調整はこのへんいじる
        private checkLength(): number {
            var length = 0;
            $.map(this.value.split(''), (ch) => {
                if (this.isMultiByte(ch)) length += 2;
                else length += 3;
            });
            return Math.floor(length / 3);
        }
        // マルチバイト文字の追加はこのへんいじる
        private isMultiByte(ch: string): boolean {
            // Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff
            // Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
            var code =  ch.charCodeAt(0);
            if ((code >= 0x0 && code < 0x81)
                || (code == 0xf8f0)
                || (code >= 0xff61 && code < 0xffa0)
                || (code >= 0xf8f1 && code < 0xf8f4)) {
                return true;
            }
            return false;
        }

    }
}