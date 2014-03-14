/// <reference path="../../template.ts" />
/// <reference path="../modal-wrapper-view.ts" />
/// <reference path="./chips-modal-contents-view.ts" />

module Chant {
    export class ChipsModalView extends ModalWrapperView {
        private tpl = new HBSTemplate('hoge.hbs');
        public contents = new ChipsModalContentsView();
        constructor(){
            super();
        }
        render(): ChipsModalView {
            this.$el.append(
                this.tpl.render()
            );
            super.render();
            return this;
        }
    }
}
