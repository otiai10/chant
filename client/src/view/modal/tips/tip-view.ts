
module Chant {
    export class TipView extends showv.View {
        private tpl = new HBSTemplate('modal/tip.hbs');
        constructor(public chip: Chip){
            super({
                delegate: false
            });
        }
        events(): Object {
            return {
                'click .chips-sample': 'inputSample'
            }
        }
        inputSample() {
            $('input#message').val(this.chip.toSampleText()).focus();
        }
        render(): TipView {
            this.$el.append(
                this.tpl.render(this.chip)
            );
            return this;
        }
    }
}
