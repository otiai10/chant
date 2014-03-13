/// <reference path="../template.ts" />
/// <reference path="./modal-view.ts" />

module Chant {
    export class IntroductionModalView extends ModalView {
        private tpl = new HBSTemplate('hoge.hbs');
        constructor(){
            super();
        }
        render() {
            this.$el.append(
                this.tpl.render()
            );
            return this;
        }
    }
}
