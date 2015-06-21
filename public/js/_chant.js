// onready的なこと
setTimeout(function(){
  React.render(
    React.createElement(Contents, {name: "World", myself: Config.myself}),
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
            React.createElement("div", null, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col s12"}, 
                        React.createElement("h1", {className: "modest"}, this.props.name, " v1")
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col s12"}, 
                        React.createElement("img", {src: this.props.myself.profile_image_url, className: "user-icon myself"})
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col s12 m6"}, 
                        React.createElement(TextInput, null)
                    ), 
                    React.createElement("div", {className: "col s12 m6"}, 
                        React.createElement("button", {className: "stamp"}, React.createElement("span", null, "foo")), 
                        React.createElement("button", {className: "stamp"}, React.createElement("span", null, "foobarbuz")), 
                        React.createElement("button", {className: "stamp"}, React.createElement("span", null, "foo")), 
                        React.createElement("button", {className: "stamp"}, React.createElement("span", null, "女医と結婚したい")), 
                        React.createElement("button", {className: "stamp"}, React.createElement("span", null, "foo")), 
                        React.createElement("button", {className: "stamp"}, React.createElement("span", null, "foobarbuz")), 
                        React.createElement("button", {className: "stamp"}, React.createElement("span", null, "foo")), 
                        React.createElement("button", {className: "stamp"}, React.createElement("span", null, "foo")), 
                        React.createElement("button", {className: "stamp"}, React.createElement("span", null, "foobarbuz")), 
                        React.createElement("button", {className: "stamp"}, React.createElement("span", null, "foo")), 
                        React.createElement("button", {className: "stamp"}, React.createElement("span", null, "女医と結婚したい")), 
                        React.createElement("button", {className: "stamp"}, React.createElement("span", null, "foo")), 
                        React.createElement("button", {className: "stamp"}, React.createElement("span", null, "foobarbuz")), 
                        React.createElement("button", {className: "stamp"}, React.createElement("span", null, "foo")), 
                        React.createElement("button", {className: "stamp"}, React.createElement("span", null, "foo")), 
                        React.createElement("button", {className: "stamp"}, React.createElement("span", null, "foobarbuz")), 
                        React.createElement("button", {className: "stamp"}, React.createElement("span", null, "foo")), 
                        React.createElement("button", {className: "stamp"}, React.createElement("span", null, "女医と結婚したい")), 
                        React.createElement("button", {className: "stamp"}, React.createElement("span", null, "foo")), 
                        React.createElement("button", {className: "stamp"}, React.createElement("span", null, "foobarbuz")), 
                        React.createElement("button", {className: "stamp"}, React.createElement("span", null, "foo"))
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col s12 m8"}, 
                        React.createElement(Messages, null)
                    ), 
                    React.createElement("div", {className: "col s12 m4"}, 
                        React.createElement("div", {className: "card"}, 
                            React.createElement("div", {className: "card-image"}, 
                                React.createElement("div", {className: "video-container"}, 
                                    React.createElement("iframe", {
                                        width: "853", 
                                        height: "480", 
                                        src: "//www.youtube.com/embed/Q8TXgCzxEnw?rel=0", 
                                        allowfullscreen: true}
                                    )
                                )
                            ), 
                            React.createElement("div", {className: "card-content"}, 
                                React.createElement("p", null, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa. ...aaaaaaaaaaaaaaaaaaaaaaa")
                            ), 
                            React.createElement("div", {className: "card-action"}, 
                                React.createElement("a", {href: "#"}, React.createElement("i", {className: "mdi-av-skip-previous"})), 
                                React.createElement("a", {href: "#"}, React.createElement("i", {className: "mdi-av-skip-next"}))
                            )
                        )
                    )
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
                style: {paddingTop: 0}, 
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
                messages
            )
        );
    }
});
