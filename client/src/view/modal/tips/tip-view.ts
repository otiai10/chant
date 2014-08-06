
module Chant {
    export class TipView extends showv.View {
        private tpl = new HBSTemplate('modal/tip.hbs');
        constructor(public tip: Tip){
            super({
                delegate: false
            });
        }
        render(): TipView {
            this.$el.append(
                this.tpl.render(this.tip)
            );
            return this;
        }
    }
}
