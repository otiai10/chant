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
var AnchorizableText = React.createClass({
    getInitialState: function() {
      return {
        _c: this.props.text
      };
    },
    // render it first
    render: function () {
        return React.createElement('p', {
            className: 'line-wrap',
            ref: 'ATSelf'
        }, this.state._c);
    },
    // anchorize it after mount
    componentDidMount: function() {
        this.anchorize();
    },
    // anchorize execution
    anchorize: function() {
        if (__image.bind(this)()) {}
        else if (__link.bind(this)()) {}
    },
    getDefaultProps: function() {
        var sampleExprWrapper = {
            expr: function () /* RegExp */ {
                return /((https?):\/\/|www\.)([a-z0-9-]+\.)+[a-z0-9:]+(\/[^\s<>"',;]*)?(jpe?g|png|gif)/gi;
            },
            wrap: function (value) /* string */ {
                return '<a href="' + value + '" target="_blank"><img class="entry-image" src="' + value + '" /></a>';
            }
        };
        var normalURLExprWrapper = {
            expr: function() { return /(https?):\/\/([_a-zA-Z0-9-.@&=!~*()\';/?:+$,%#]+)/gi; },
            wrap: function(value) {
              return '<a href="' + value + '" target="_blank">' + value + '</a>';
            }
        };
        return {
            ExprWrappers: [sampleExprWrapper, normalURLExprWrapper]
        };
    }
});
