module Chant {
    export class OGDetail {
        public Title: string;
        public Description: string = "undefined";
        public Image: string = "";
        public metas: any[] = [];
        constructor(public Id: string,
                    public URL: string) {}
        ensure(): boolean {
            $.map(this.metas, (meta: any) => {
                var name = meta.getAttribute("name") || meta.getAttribute("property");
                if (! name) return;
                if (name.match(/image$/)) {
                    this.Image = meta.getAttribute('content');
                    return;
                }
                if (name.match(/description/)) {
                    this.Description = meta.getAttribute('content');
                    return;
                }
            });
            if (this.Title) return true;
            return false;
        }
    }
    export var WebPreview = {
        embed: (id: string, url: string) => {
            var apiURL = 'http://'+Conf.Server().Host+':'+Conf.Server().Port+'/preview?url=' + url;
            $.ajax({
                url: apiURL,
                method: 'GET',
                dataType: 'json',
                success: function(ogDetail){
                    var og = new OGDetail(id, url);
                    // $('#twitter' + id).html(res.html);
                    $.map($(ogDetail['PageContents']), (el: any) => {
                        if (! el.tagName) return;
                        if (el.tagName.match(/title/i)) og.Title = el.innerHTML;
                        if (el.tagName.match(/meta/i)) og.metas.push(el);
                    });
                    if (! og.ensure()) return;
                    //$('#' + id).html(tmpl('tmpl_base_preview', og));
                    $('#' + id).replaceWith(tmpl('tmpl_base_preview', og));
                },
                error: function(hoge){
                    console.log(hoge);
                }
            });
        }
    }
}
