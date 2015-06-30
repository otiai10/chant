var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Messages = React.createClass({
  render: function() {
    var self = this;
    var messages = this.props.messages.map(function(message, i) {
      return (
        <div className="entry">
          <Message setText={self.props.setText} message={message} id={i} key={i} />
        </div>
      );
    });
    return (
      <ReactCSSTransitionGroup transitionName="example">
        {messages}
      </ReactCSSTransitionGroup>
    );
  }
});
