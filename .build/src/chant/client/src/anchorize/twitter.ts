module Chant {
    export var Twitter = {
        embed: (id) => {
            $.ajax({
                url: 'https://api.twitter.com/1/statuses/oembed.json?id=' + String(id),
                method: 'GET',
                dataType: 'jsonp',
                success: function(res){
                    $('#twitter' + id).html(res.html);
                },
                error: function(hoge){
                    console.log(hoge);
                }
            });
        }
    }
}