/// <reference path="../../../../definitions/showv.d.ts" />
/// <reference path="../../template.ts" />
/// <reference path="../modal-contents-view.ts" />

/// <reference path="./tip-view.ts" />

/// <reference path="../../../models/chips/chips.ts" />

module Chant {
    export class TipsModalContentsView extends ModalContentsView {
        private tpl = new HBSTemplate("modal/tips.hbs");
        constructor() {
            super({
                id: 'chips'
            });
        }
        render(): TipsModalContentsView {
            var stamp = new TipView(new Chip(Chips.stamp));
            var emo   = new TipView(new Chip(Chips.emo));
            this.$el.append(
                this.tpl.render(),
                stamp.render().$el,
                emo.render().$el
            );
            return this;
        }
    }
}

