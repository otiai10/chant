/// <reference path="../../template.ts" />
/// <reference path="../modal-wrapper-view.ts" />
/// <reference path="./chips-modal-contents-view.ts" />

module Chant {
    export class ChipsModalView extends ModalWrapperView {
        public contents = new ChipsModalContentsView();
        constructor(){
            super();
        }
        render(): ChipsModalView {
            super.render();
            return this;
        }
    }
}
