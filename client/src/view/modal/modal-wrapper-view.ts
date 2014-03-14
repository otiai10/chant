/// <reference path="../../../definitions/showv.d.ts" />
/// <reference path="../../../definitions/handlebars.d.ts" />
/// <reference path="../template.ts" />
/// <reference path="./modal-contents-view.ts" />

module Chant {
    export class ModalWrapperView extends showv.View {
        private background = '<div class="modal-background"></div>';
        public  contents: ModalContentsView;
        private static fadeDuration: number = 100;
        constructor(){
            super({
                tagName: 'div',
                className: 'modal-wrapper clickable'
            });
        }
        events(): Object {
            return {
                'click': 'fadeOut'
            }
        }
        fadeOut() {
            this.$el.fadeOut(ModalWrapperView.fadeDuration, () => {
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
        // このshowを使いたいんだけど、Chromeの描画バグっぽい？backgroundが表示されない
        show(): ModalWrapperView {
            this.$el.fadeIn(ModalWrapperView.fadeDuration);
            return this;
        }
    }
}
