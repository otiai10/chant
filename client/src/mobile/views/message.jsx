// var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Message = React.createClass({
    render: function() {
        return (
            <div className="entry">
                <MessageMeta message={this.props.message} />
                <div className="box">
                    <MessageIcon message={this.props.message} />
                    <MessageContent message={this.props.message} />
                </div>
            </div>
        );
    }
});

var MessageMeta = React.createClass({
    render: function() {
        var time = new Date(this.props.message.timestamp / 1000000);
        return (
            <div className="meta-wrapper">
                <span className="meta"><small className="grey-text text-lighten-2">{time.toLocaleString()}</small></span>
                <span className="meta stealth"><small className="grey-text text-lighten-2">stamprize</small></span>
            </div>
        );
    }
});

var MessageIcon = React.createClass({
    render: function() {
        return (
            <div>
                <img src={this.props.message.user.profile_image_url} className="user-icon" />
            </div>
        );
    }
});

var MessageContent = React.createClass({
    render: function() {
        return (
            <div className="message-wrapper">
                <MessageRecursive message={this.props.message} />
            </div>
        );
    }
});

var MessageRecursive = React.createClass({
    render: function() {
        if (false) {
            return (
                <blockquote>
                    <MessageRecursive message={this.props.message.children} />
                </blockquote>
            );
        }
        return (
             <div className="message-wrapper">
                <div>
                    {this.props.message.value}
                </div>
            </div>
        );
    }
});