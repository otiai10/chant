/// <reference path="../../../definitions/showv.d.ts" />
/// <reference path="../../../definitions/handlebars.d.ts" />
/// <reference path="../template.ts" />
/// <reference path="./modal-contents-view.ts" />

module Chant {
    export class ModalWrapperView extends showv.View {
        private background = '<div class="modal-background"></div>';
        public  contents: ModalContentsView;
        constructor(){
            super({
                tagName: 'div',
                className: 'modal-wrapper'
            });
        }
        events(): Object {
            return {
                'click': 'fadeOut'
            }
        }
        fadeOut() {
            this.$el.fadeOut(100, () => {
                this.$el.remove();
            });
        }
        render(): ModalWrapperView {
            this.$el.append(
                this.background,
                this.contents.render().$el
            );
            return this;
        }
    }
}
