// var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Messages = React.createClass({
    render: function() {
        var messages = this.props.messages.map(function(message, i) {
            return (
                <div className="entry" transitionName="example">
                    <Message message={message} id={i} key={i} />
                </div>
            );
        });
        return (
            <div>
                {messages}
            </div>
        );
    }
});
