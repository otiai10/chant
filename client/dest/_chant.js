// onready的なこと
setTimeout(function(){
  React.render(
    React.createElement(Contents, {name: "World"}),
    // document.body
    document.getElementById('container')
  );
}, 0);


var Contents = React.createClass({displayName: "Contents",
  render: function() {
    return (
      React.createElement("div", {className: "row"}, 
        React.createElement("div", {className: "col s12"}, 
          React.createElement("h1", null, "ほげ"), 
          React.createElement(Messages, null)
        )
      )
    );
  }
});

var Message = React.createClass({displayName: "Message",
  render: function() {
    return React.createElement("div", null, this.props.text)
  }
});

var Messages = React.createClass({displayName: "Messages",
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
    var messages = this.state.messages.map(function(message, i) {
      return React.createElement(Message, {text: message.text, key: i})
    });
    return (
      React.createElement("div", null, 
          React.createElement("p", null, "メッセージs"), 
          messages
      )
    );
  }
});
