/// <reference path="../../../build/showv.d.ts" />

module Sample {
    export class HeaderView extends showv.View {
        constructor(){
            super();
        }
        render(): HeaderView {
            this.$el.append(
                '<a href="https://github.com/otiai10/showv"><img style="position: absolute; top: 0; left: 0; border: 0;" src="https://github-camo.global.ssl.fastly.net/567c3a48d796e2fc06ea80409cc9dd82bf714434/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_left_darkblue_121621.png"></a>',
                '<h1>Showv <span>The Simplest View Framework for TypeScript<img src="./showv.jpg"></span></h1>'
            );
            return this;
        }
    }
}
