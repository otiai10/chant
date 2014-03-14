
module Chant {
    export class ModalContentsView extends showv.View {
        constructor(options: showv.IViewCreateOptions = {}){
            super({
                tagName: 'div',
                id: options.id || '',
                className: options.className || 'modal-contents'
            });
        }
    }
}