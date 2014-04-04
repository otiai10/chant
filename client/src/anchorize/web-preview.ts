module Chant {
    export var WebPreview = {
        embed: (id: string, url: string) => {
            var url = 'http://'+Conf.Server().Host+':'+Conf.Server().Port+'/preview?url=' + url;
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function(ogDetail){
                    console.log(ogDetail);
                    // $('#twitter' + id).html(res.html);
                    $('#' + id).html(tmpl('tmpl_base_preview', ogDetail));
                },
                error: function(hoge){
                    console.log(hoge);
                }
            });
        }
    }
}