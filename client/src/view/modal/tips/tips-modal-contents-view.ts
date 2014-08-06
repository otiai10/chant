/// <reference path="../../../../definitions/showv.d.ts" />
/// <reference path="../../template.ts" />
/// <reference path="../modal-contents-view.ts" />
/// <reference path="./tip-view.ts" />
/// <reference path="../../../models/tips/tips.ts" />

module Chant {
    export class TipsModalContentsView extends ModalContentsView {
        private tpl = new HBSTemplate("modal/tips.hbs");
        constructor() {
            super({
                id: 'chips'
            });
        }
        render(): TipsModalContentsView {
            var mention = new TipView(new Tip(Tips.mention));
            var quote   = new TipView(new Tip(Tips.quote));
            var stamp   = new TipView(new Tip(Tips.stamp));
            var emoji   = new TipView(new Tip(Tips.emoji));
            var youtube = new TipView(new Tip(Tips.youtube));
            var tweet   = new TipView(new Tip(Tips.tweet));
            this.$el.append(
                this.tpl.render(),
                mention.render().$el,
                quote.render().$el,
                stamp.render().$el,
                emoji.render().$el,
                youtube.render().$el,
                tweet.render().$el
            );
            return this;
        }
    }
}

