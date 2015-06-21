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

var Contents = React.createClass({
    render: function() {
        return (
            <div className="row">
                <div className="col s12">
                    <h1>CHANT v1</h1>
                    <TextInput />
                    <Messages />
                </div>
            </div>
        );
    }
});

var TextInput = React.createClass({
    getInitialState: function() {
        return {
            value: '',
            rows: 3
        }
    },
    render: function() {
        var value = this.state.value;
        return (
            <textarea
                cols="3"
                rows="3"
                onKeyDown={this.onKeyDown}
                onChange={this.onChange}
                value={value}
                className="materialize-textarea"
                placeholder="press enter to send ⏎"
            ></textarea>
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
var Message = React.createClass({
    render: function() {
        return <div>{this.props.text}</div>
    }
});

var Messages = React.createClass({
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
            return <Message text={message.text} key={i} />
        });
        return (
            <div>
                <p>メッセージ↓↓</p>
                {messages}
            </div>
        );
    }
});
