/// <reference path="../../../definitions/showv.d.ts" />
/// <reference path="../../../definitions/handlebars.d.ts" />
/// <reference path="../template.ts" />

module Chant {
    export class ModalView extends showv.View {
        constructor(){
            super({
                tagName: 'div',
                className: 'modal-container'
            });
        }
        events(): Object {
            return {
                'click': 'fadeOut'
            }
        }
        fadeOut() {
            this.$el.fadeOut(() => {
                this.$el.remove();
            });
        }
    }
}
