// {{{ bind(this)すれば外からでもいいという意味でとりあえずここに宣言します
var __image = function() {
  var expr = /((https?):\/\/|www\.)([a-z0-9-]+\.)+[a-z0-9:]+(\/[^\s<>"',;]*)?(jpe?g|png|gif)/gi;
  var m = expr.exec(this.props.text);
  if (!m) return; // do nothing
  var c = __arraynize(this.props.text, m[0], function(sub) {
        return <a href={sub} target="_blank"><img src={sub} className="entry-image"></img></a>;
  });
  this.setState({_c: c});
  return true;
};
var __link = function() {
  var expr = /(https?):\/\/([_a-zA-Z0-9-.@&=!~*()\';/?:+$,%#]+)/gi;
  var m = expr.exec(this.props.text);
  if (!m) return; // do nothing;
  var c = __arraynize(this.props.text, m[0], function(sub) {
        return <a href={sub} target="_blank">{sub}</a>;
  });
  this.setState({_c: c});
  return true;
};
var __twitter = function() {
  var expr = /(twitter.com)\/([^\/]+)\/status\/([0-9]+)/gi;
  var m = expr.exec(this.props.text);
  if (!m || m.length < 4) return;
  var id = m[3];
  $.ajax({
    url: 'https://api.twitter.com/1/statuses/oembed.json?id=' + String(id),
    method: 'GET',
    dataType: 'jsonp',
    success: function(res){
      res.html = res.html.replace('<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>', '');
      var d = <div dangerouslySetInnerHTML={{__html:res.html}}></div>;
      this.setState({_c: d});
      setTimeout(function(){twttr.widgets.load();}, 0);
    }.bind(this),
    error: function(err){
      console.log('twitter API error', err);
    }
  });
};
var __vine = function() {
    var expr = /(https?:\/\/vine.co\/v\/[^\/]+)\/?.*/;
    var m = expr.exec(this.props.text);
    if (!m) return;
    var c = __arraynize(this.props.text, m[0], function(sub) {
      sub += '/embed/simple';
      return (
        <iframe src={sub} width="400" height="400" frameborder="0"></iframe>
      );
    });
    this.setState({_c: c});
    return true;
};
var __arraynize = function(src, sub, gen) /* []string */ {
  if (src.trim() === sub) return [gen(sub)];
  var c = [];
  var splitted = src.split(sub);
  for (var i = 0; i < splitted.length; i++) {
      if (splitted[i].length === 0) { // this element is the target itself
        c.push(gen(sub));
        continue;
      }
      if (i === splitted.length - 1) {// this element is the last
        c.push(splitted[i]);
        continue;
      }
      c.push(splitted[i]);
      c.push(<div>{gen(sub)}</div>);
  }
  return c;
};
// }}}
