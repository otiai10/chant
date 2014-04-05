module Chant {
    export class OGDetail {
        public Title: string;
        public Description: string;
        public Image: string;
        public metas: any[] = [];
        constructor() {}
        ensure(): boolean {
            $.map(this.metas, (meta: any) => {
                // console.log(this.metas[i]);
                var name = meta.getAttribute("name");
                if (! name) return;
                if (name.match(/image/i)) {
                    this.Image = meta.getAttribute('content');
                    return;
                }
                if (name.match(/description/i)) {
                    this.Description = meta.getAttribute('content');
                    return;
                }
            });
            if (this.Title && this.Description && this.Image) return true;
            return false;
        }
    }
    export var WebPreview = {
        embed: (id: string, url: string) => {
            var url = 'http://'+Conf.Server().Host+':'+Conf.Server().Port+'/preview?url=' + url;
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function(ogDetail){
                    var og = new OGDetail();
                    // $('#twitter' + id).html(res.html);
                    $.map($(ogDetail['PageContents']), (el: any) => {
                        if (! el.tagName) return;
                        if (el.tagName.match(/title/i)) og.Title = el.innerHTML;
                        if (el.tagName.match(/meta/i)) og.metas.push(el);
                    });
                    if (! og.ensure()) return;
                    $('#' + id).html(tmpl('tmpl_base_preview', og));
                },
                error: function(hoge){
                    console.log(hoge);
                }
            });
        }
    }
}
