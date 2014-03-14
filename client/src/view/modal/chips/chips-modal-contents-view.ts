/// <reference path="../../../../definitions/showv.d.ts" />
/// <reference path="../../template.ts" />
/// <reference path="../modal-contents-view.ts" />

/// <reference path="./chip-view.ts" />

/// <reference path="../../../models/chips/chips.ts" />

module Chant {
    export class ChipsModalContentsView extends ModalContentsView {
        private tpl = new HBSTemplate("modal/chips.hbs");
        constructor() {
            super({
                id: 'chips'
            });
        }
        render(): ChipsModalContentsView {
            var stamp = new ChipView(new Chip(Chips.stamp));
            var emo   = new ChipView(new Chip(Chips.emo));
            this.$el.append(
                this.tpl.render(),
                stamp.render().$el,
                emo.render().$el
            );
            return this;
        }
    }
}

