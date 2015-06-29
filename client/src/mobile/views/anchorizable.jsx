
var AnchorizableText = React.createClass({
    // render it first
    render: function () {
        return React.createElement('div', {
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
        this.props.ExprWrappers.map(function(ew) {
          value = self.exprAndWrap(value, ew);
        });
        myself.innerHTML = value;
    },
    // expr and wrap
    exprAndWrap: function(value, ew /* interface ExprWrapper */) {
        if (typeof ew.expr != 'function' || typeof ew.wrap != 'function') return value;
        var matches = ew.expr().exec(value) || [];
        if (matches.length == 0) return value;
        value = value.split(matches[0]).join(ew.wrap(matches[0]));
        return value;
    },
    getDefaultProps: function() {
        var sampleExprWrapper = {
            expr: function () /* RegExp */ {
                return /((https?):\/\/|www\.)([a-z0-9-]+\.)+[a-z0-9:]+(\/[^\s<>"',;]*)?(jpe?g|png|gif)$/gi;
            },
            wrap: function (value) /* string */ {
                return '<a href="' + value + '"><img class="entry-image" src="' + value + '" /></a>';
            }
        };
        return {
            ExprWrappers: [sampleExprWrapper]
        };
    }
});
