
var Contents = React.createClass({
  render: function() {
    return (
      <div className="row">
        <div className="col s12">
          <h1>ほげ</h1>
          <Messages />
        </div>
      </div>
    );
  }
});

var Message = React.createClass({
  render: function() {
    return <div>{this.props.text}</div>
  }
});

var Messages = React.createClass({
  getInitialState: function() {
    // ここでサーバと通信する
    return {
      messages: [
        {text:"fooooo"},
        {text:"barrr"}
      ]
    };
  },
  componentDidMount: function() {
    window.alert("did mount");
  },
  render: function() {
    var messages = this.state.messages.map(function(message) {
      return <Message text={message.text} />
    });
    return (
      <div>
          <p>メッセージs</p>
          {messages}
      </div>
    );
  }
});
