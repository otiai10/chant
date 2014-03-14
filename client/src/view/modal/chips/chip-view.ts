
module Chant {
    export class ChipView extends showv.View {
        private tpl = new HBSTemplate('modal/chip.hbs');
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
        render(): ChipView {
            this.$el.append(
                this.tpl.render(this.chip)
            );
            return this;
        }
    }
}
