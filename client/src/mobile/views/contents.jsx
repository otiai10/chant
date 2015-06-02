
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
    var _instance = new WebSocket('ws://localhost:14000/websocket/room/socket');
    _instance.onopen = function(ev) { console.log('open', ev); };
    _instance.onclose = function(ev) { console.log('close', ev); };
    _instance.onerror = function(ev) { console.log('error', ev); };
    _instance.onmessage = function(ev) { console.log('mess', ev); };
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
    var messages = this.state.messages.map(function(message, i) {
      return <Message text={message.text} key={i} />
    });
    return (
      <div>
          <p>メッセージs</p>
          {messages}
      </div>
    );
  }
});
