module Chant {
    export class HBSTemplate {
        private template: HandlebarsTemplate = null;
        constructor(private name: string) {
            this.template = HBS['asset/tpl/' + name];// + '.hbs'];
        }
        render(param?: Object): string {
            return this.template(param);
        }
    }
}