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
        if (__vine.bind(this)()) {}
        else if (__twitter.bind(this)()) {}
        else if (__image.bind(this)()) {}
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
