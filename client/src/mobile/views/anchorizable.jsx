
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
        (ew.expr().exec(value) || []).map(function(found) {
            value = value.split(found).join(ew.wrap(found));
        });
        return value;
    },
    getDefaultProps: function() {
        var sampleExprWrapper = {
            expr: function () /* RegExp */ {
                return /おっぱい/gi;
            },
            wrap: function (value) /* string */ {
                return '<span style="background-color:yellow">' + value + '</span>';
            }
        };
        return {
            ExprWrappers: [sampleExprWrapper]
        };
    }
});