
module Chant {
    export class Totsuzen {
        private length: number;
        private head: string = "＿";
        private foot: string = "￣";
        private hat: string = "人";
        private shoe: string = "^Y";
        private left: string = "＞";
        private right: string = "＜";
        constructor(private value: string) {
            this.length = value.length;
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
            var bottom: string[] = [this.foot];
            for (var i = 0; i < this.length; i++) {
                bottom.push(this.shoe);
            }
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
    }
}