/// <reference path="../../../../definitions/showv.d.ts" />
/// <reference path="../../template.ts" />
/// <reference path="../modal-contents-view.ts" />

module Chant {
    export class ChipsModalContentsView extends ModalContentsView {
        private tpl = new HBSTemplate("modal/chips.hbs");
        constructor() {
            super({
                id: 'chips'
            });
        }
        render(): ChipsModalContentsView {
            this.$el.append(
                this.tpl.render()
            );
            return this;
        }
    }
}

