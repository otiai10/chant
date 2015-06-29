// var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Message = React.createClass({
    render: function() {
        return (
            <div className="entry">
                <MessageMeta message={this.props.message} />
                <MessageEntry setText={this.props.setText} message={this.props.message} />
            </div>
        );
    }
});

var MessageEntry = React.createClass({
    render: function () {
        return (
            <div className="box">
                <MessageIcon setText={this.props.setText} message={this.props.message}/>
                <MessageContent message={this.props.message}/>
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
                <span onClick={this.stamprize} className="meta stealth"><small className="grey-text text-lighten-2">stamprize</small></span>
            </div>
        );
    },
    stamprize: function() {
        chant.Send('stamprize', JSON.stringify(this.props.message));
        document.getElementsByTagName('textarea')[0].focus();
        chant.clearUnread();// うーむ
    }
});

var MessageIcon = React.createClass({
    render: function() {
        return (
            <div>
                <Icon setText={this.props.setText} user={this.props.message.user} />
            </div>
        );
    }
});

var MessageContent = React.createClass({
    render: function() {
        return (
            <div className="message-wrapper">
                <MessageInclusive message={this.props.message} />
            </div>
        );
    }
});

var MessageInclusive = React.createClass({
    render: function() {
        switch (this.props.message.type) {
        case "stamprize":
            return (
                <div>
                    <div>stamprize</div>
                    <blockquote>
                        <MessageEntry message={this.props.message.value} />
                    </blockquote>
                </div>
            );
        default:
            return <MessageRecursive message={this.props.message} />;
        }
    }
});
var MessageRecursive = React.createClass({
    render: function() {
        if (this.props.message.value.children) {
            return (
                <div>
                    <div>{this.props.message.value.text}</div>
                    <blockquote>
                        <MessageEntry message={this.props.message.value.children} />
                    </blockquote>
                </div>
            );
                {/*
                <div className="message-wrapper">
                    <div>
                        {this.props.message.value.text}
                    </div>
                    <blockquote>
                        <MessageRecursive message={this.props.message.value.children} />
                    </blockquote>
                </div>
                */}
        }
        return <MessageAnchorable message={this.props.message} />;
    }
});

var MessageAnchorable = React.createClass({
    render: function() {
        var lines = this.props.message.value.text.split('\n').map(function(line) {
            // return <p className="line-wrap">{line}</p>;
            return <p className="line-wrap"><AnchorizableText text={line} /></p>;
        });
        return <div className="message-wrapper">{lines}</div>;
    }
});