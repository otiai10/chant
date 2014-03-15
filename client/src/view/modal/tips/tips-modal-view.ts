/// <reference path="../../template.ts" />
/// <reference path="../modal-wrapper-view.ts" />
/// <reference path="./tips-modal-contents-view.ts" />

module Chant {
    export class TipsModalView extends ModalWrapperView {
        public contents = new TipsModalContentsView();
        constructor(){
            super();
        }
        render(): TipsModalView {
            super.render();
            return this;
        }
    }
}
