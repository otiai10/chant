var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Messages = React.createClass({
  render: function() {
    var self = this;
    var messages = this.props.messages.map(function(message, i) {
      return (
        <Message key={message.timestamp} setText={this.props.setText} message={message}></Message>
      );
    }.bind(this));
    return (
      <ReactCSSTransitionGroup transitionName="example">
        {messages}
      </ReactCSSTransitionGroup>
    );
  }
});
