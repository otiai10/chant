
var AnchorizableText = React.createClass({
    // render it first
    render: function () {
        return React.createElement('p', {
            className: 'line-wrap',
            ref: 'ATSelf'
        }, this.props.text);
    },
    // anchorize it after mount
    componentDidMount: function() {
        this.anchorize();
    },
    // anchorize it after update
    componentDidUpdate: function() {
        this.anchorize();
    },
    // anchorize execution
    anchorize: function() {
        var myself = React.findDOMNode(this.refs.ATSelf);
        var value = this.props.text;
        var self = this;
        for (var i = 0; i < this.props.ExprWrappers.length; i++) {
          var v = this.exprAndWrap(value, this.props.ExprWrappers[i]);
          if (v) {
            myself.innerHTML = v;
            return;
          }
        }
        myself.innerHTML = value;
    },
    // expr and wrap
    exprAndWrap: function(value, ew /* interface ExprWrapper */) {
        if (typeof ew.expr != 'function' || typeof ew.wrap != 'function') return value;
        var matches = ew.expr().exec(value) || [];
        if (matches.length === 0) return null;
        value = value.split(matches[0]).join(ew.wrap(matches[0]));
        return value;
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
            wrap: function(value) { return '<a href="' + value + '" target="_blank">' + value + '</a>'; }
        };
        return {
            ExprWrappers: [sampleExprWrapper, normalURLExprWrapper]
        };
    }
});
