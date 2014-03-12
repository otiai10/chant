/// <reference path="../../../definitions/showv.d.ts" />
/// <reference path="../../../definitions/handlebars.d.ts" />

// どっか持ってってw
module Chant {
    export class HBSTemplate {
        private template: HandlebarsTemplate = null;
        constructor(private name: string) {
            this.template = HBS['asset/tpl/' + name];
        }
        render(param?: Object): string {
            return this.template(param);
        }
    }
}

module Chant {
    export class ModalView extends showv.View {
        constructor(){
            super();
        }
    }
    export class IntroductionModalView extends ModalView {
        private tpl = new HBSTemplate('hoge.hbs');
        constructor(){
            super();
            console.log(this.tpl.render());
        }
    }
}