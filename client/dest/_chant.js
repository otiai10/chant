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
        var _instance = new WebSocket('ws://localhost:14000/websocket/room/socket');
        _instance.onopen = function(ev) { console.log('open', ev); };
        _instance.onclose = function(ev) { console.log('close', ev); };
        _instance.onerror = function(ev) { console.log('error', ev); };
        var self = this;
        _instance.onmessage = function(ev) {
            // FIXME: そうじゃないだろ感ある
            self.state.messages.unshift({text:ev.data});
            self.setState({messages: self.state.messages});
        };
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
