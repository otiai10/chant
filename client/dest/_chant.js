// onready的なこと
setTimeout(function(){
  React.render(
    React.createElement(Contents, {name: "World"}),
    // document.body
    document.getElementById('container')
  );
}, 0);

var chant = chant || {};
chant.__socket = null;
chant.__init = function() {
    chant.__socket = new WebSocket('ws://localhost:14000/websocket/room/socket');
};
chant.socket = function(force) {
    if (!chant.__socket || force) {
        chant.__socket = new WebSocket('ws://localhost:14000/websocket/room/socket');
    }
    return chant.__socket;
};
/**
 * おくるやつ
 * @param typ
 * @param value
 * @constructor
 */
chant.Send = function(/* string */typ/* string */, /* any */value) {
    chant.socket().send(JSON.stringify({
        type:typ,
        raw:value
    }));
};

var Contents = React.createClass({displayName: "Contents",
    render: function() {
        return (
            React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col s12"}, 
                    React.createElement("h1", null, "CHANT v1"), 
                    React.createElement(TextInput, null), 
                    React.createElement(Messages, null)
                )
            )
        );
    }
});

var TextInput = React.createClass({displayName: "TextInput",
    getInitialState: function() {
        return {
            value: '',
            rows: 3
        }
    },
    render: function() {
        var value = this.state.value;
        return (
            React.createElement("textarea", {
                cols: "3", 
                rows: "3", 
                onKeyDown: this.onKeyDown, 
                onChange: this.onChange, 
                value: value, 
                className: "materialize-textarea", 
                placeholder: "press enter to send ⏎"
            })
        );
    },
    onChange: function(ev) {
        this.setState({value: ev.target.value});
    },
    onKeyDown: function(ev) {
        const enterKey = 13;
        var txt = ev.target.value;
        if (!ev.shiftKey && ev.which == enterKey) {
            chant.Send("message", txt);
            this.setState({value: ""});
            return ev.preventDefault();
        }
    }
});

/*
 * Message
 * この中でごにょごにょすべきか
 */
var Message = React.createClass({displayName: "Message",
    render: function() {
        return React.createElement("div", null, this.props.text)
    }
});

var Messages = React.createClass({displayName: "Messages",
    getInitialState: function() {
        chant.socket().onopen = function(ev) { console.log('open', ev); };
        chant.socket().onclose = function(ev) { console.log('close', ev); };
        chant.socket().onerror = function(ev) { console.log('error', ev); };
        var self = this;
        chant.socket().onmessage = function(ev) {
            // FIXME: そうじゃないだろ感ある
            self.state.messages.unshift({text:ev.data});
            self.setState({messages: self.state.messages});
            // TODO: ここでごにょごにょするのいやだよ
            document.title = "!" + document.title;
        };

        return {
            messages: []
        };
    },
    componentDidMount: function() {
        // window.alert("did mount");
    },
    render: function() {
        var messages = this.state.messages.map(function(message, i) {
            return React.createElement(Message, {text: message.text, key: i})
        });
        return (
            React.createElement("div", null, 
                React.createElement("p", null, "メッセージ↓↓"), 
                messages
            )
        );
    }
});
