// onready的なこと
setTimeout(function(){
  React.render(
    React.createElement(Contents, {name: "CHANT", myself: Config.myself}),
    document.getElementById('container')
  );
}, 0);

var chant = chant || {};
chant._notification = {

};
chant.notify = function(title, body, icon, onclick, onclose) {
    onclick = onclick || function() {window.focus();};
    onclose = onclose || function() {};
    var note = new window.Notification(
        title || 'CHANT',
        {
            body: body || 'おだやかじゃないわね',
            icon: icon || ''
        }
    );
    note.onclick = onclick;
    note.onclise = onclose;
};

var chant = chant || {};
chant.__socket = null;
chant.socket = function(force) {
    if (!chant.__socket || force) {
        chant.__socket = new WebSocket('ws://'+Config.server.host+'/websocket/room/socket');
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
    if (typeof value.trim == 'function' && value.trim().length == 0) {
        return;// do nothing
    }
    chant.socket().send(JSON.stringify({
        type:typ,
        raw:value
    }));
};


/**
 * socketの管理は、ここでやるべきかもしれない
 * onmessageからのディスパッチとか
 */
var Contents = React.createClass({displayName: "Contents",
    getInitialState: function() {
        chant.socket().onopen = function(ev) { console.log('open', ev); };
        chant.socket().onclose = function(ev) { console.log('close', ev); };
        chant.socket().onerror = function(ev) { console.log('error', ev); };
        var self = this;
        chant.socket().onmessage = function(ev) {
            var payload = JSON.parse(ev.data);
            console.log(payload);
            switch (payload.type) {
                case "message":
                    self.newMessage(payload);
                    break;
                case "join":
                    self.join(payload);
                    break;
                case "leave":
                    self.leave(payload);
                    break;
            }
        };
        return {
            messages: [],
            members: {}
        };
    },
    newMessage: function(message) {
        this.state.messages.unshift(message);
        this.setState({messages: this.state.messages});
    },
    join: function(ev) {
        this.state.members = ev.value;
        delete this.state.members[Config.myself.id_str];
        this.setState({members: this.state.members});
    },
    leave: function(ev) {
        this.state.members = ev.value;
        delete this.state.members[Config.myself.id_str];
        this.setState({members: this.state.members});
    },
    render: function() {
        var messages = this.state.messages.map(function(message, i) {
            return (
                React.createElement("div", {className: "entry", transitionName: "example"}, 
                    React.createElement(Message, {message: message, id: i, key: i})
                )
            );
        });
        return (
            React.createElement("div", null, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col s12"}, 
                        React.createElement("h1", {className: "modest pull-right"}, React.createElement("img", {src: "/public/img/title.png", width: "60px"}))
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col s12 members"}, 
                        React.createElement("span", null, 
                            React.createElement("img", {src: this.props.myself.profile_image_url, className: "user-icon myself"})
                        ), 
                        React.createElement(Members, {members: this.state.members})
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col s12 m6"}, 
                        React.createElement(TextInput, null)
                    ), 
                    React.createElement("div", {className: "col s12 m6"}
                        /*
                        <button className="stamp"><span>foo</span></button>
                        <button className="stamp"><span>foobarbuz</span></button>
                        <button className="stamp"><span>foo</span></button>
                        <button className="stamp"><span>女医と結婚したい</span></button>
                        <button className="stamp"><span>foo</span></button>
                        <button className="stamp"><span>foobarbuz</span></button>
                        <button className="stamp"><span>foo</span></button>
                        <button className="stamp"><span>foo</span></button>
                        <button className="stamp"><span>foobarbuz</span></button>
                        <button className="stamp"><span>foo</span></button>
                        <button className="stamp"><span>女医と結婚したい</span></button>
                        <button className="stamp"><span>foo</span></button>
                        <button className="stamp"><span>foobarbuz</span></button>
                        <button className="stamp"><span>foo</span></button>
                        <button className="stamp"><span>foo</span></button>
                        <button className="stamp"><span>foobarbuz</span></button>
                        <button className="stamp"><span>foo</span></button>
                        <button className="stamp"><span>女医と結婚したい</span></button>
                        <button className="stamp"><span>foo</span></button>
                        <button className="stamp"><span>foobarbuz</span></button>
                        <button className="stamp"><span>foo</span></button>
                        */
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col s12 m8"}, 
                        React.createElement(Messages, {messages: this.state.messages})
                    ), 
                    React.createElement("div", {className: "col s12 m4"}
                        /*
                        <div className="card">
                            <div className="card-image">
                                <div className="video-container">
                                    <iframe
                                        width="853"
                                        height="480"
                                        src="//www.youtube.com/embed/Q8TXgCzxEnw?rel=0"
                                        allowfullscreen>
                                    </iframe>
                                </div>
                            </div>
                            <div className="card-content">
                                <p>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa. ...aaaaaaaaaaaaaaaaaaaaaaa</p>
                            </div>
                            <div className="card-action">
                                <a href="#"><i className="mdi-av-skip-previous"></i></a>
                                <a href="#"><i className="mdi-av-skip-next"></i></a>
                            </div>
                        </div>
                        */
                    )
                )
            )
        );
    }
});


var Members = React.createClass({displayName: "Members",
    render: function() {
        var members = [];
        for (var id in this.props.members) {
            members.push(
                React.createElement("img", {src: this.props.members[id].profile_image_url, className: "user-icon"})
            );
        }
        return React.createElement("span", null, members);
    }
});
// var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Message = React.createClass({displayName: "Message",
    render: function() {
        return (
            React.createElement("div", {className: "entry"}, 
                React.createElement(MessageMeta, {message: this.props.message}), 
                React.createElement(MessageEntry, {message: this.props.message})
            )
        );
    }
});

var MessageEntry = React.createClass({displayName: "MessageEntry",
    render: function () {
        return (
            React.createElement("div", {className: "box"}, 
                React.createElement(MessageIcon, {message: this.props.message}), 
                React.createElement(MessageContent, {message: this.props.message})
            )
        );
    }
});

var MessageMeta = React.createClass({displayName: "MessageMeta",
    render: function() {
        var time = new Date(this.props.message.timestamp / 1000000);
        return (
            React.createElement("div", {className: "meta-wrapper"}, 
                React.createElement("span", {className: "meta"}, React.createElement("small", {className: "grey-text text-lighten-2"}, time.toLocaleString())), 
                React.createElement("span", {className: "meta stealth"}, React.createElement("small", {className: "grey-text text-lighten-2"}, "stamprize"))
            )
        );
    }
});

var MessageIcon = React.createClass({displayName: "MessageIcon",
    render: function() {
        return (
            React.createElement("div", null, 
                React.createElement("img", {src: this.props.message.user.profile_image_url, className: "user-icon"})
            )
        );
    }
});

var MessageContent = React.createClass({displayName: "MessageContent",
    render: function() {
        return (
            React.createElement("div", {className: "message-wrapper"}, 
                React.createElement(MessageRecursive, {message: this.props.message})
            )
        );
    }
});

var MessageRecursive = React.createClass({displayName: "MessageRecursive",
    render: function() {
        if (this.props.message.value.children) {
            return (
                React.createElement("div", null, 
                    React.createElement("div", null, this.props.message.value.text), 
                    React.createElement("blockquote", null, 
                        React.createElement(MessageEntry, {message: this.props.message.value.children})
                    )
                )
            );
                {/*
                <div className="message-wrapper">
                    <div>
                        {this.props.message.value.text}
                    </div>
                    <blockquote>
                        <MessageRecursive message={this.props.message.value.children} />
                    </blockquote>
                </div>
                */}
        }
        return React.createElement(MessageAnchorable, {message: this.props.message});
    }
});

var MessageAnchorable = React.createClass({displayName: "MessageAnchorable",
    render: function() {
        return (
            React.createElement("div", {className: "message-wrapper"}, 
                React.createElement("div", null, 
                    this.props.message.value.text
                )
            )
        );
    }
});
// var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Messages = React.createClass({displayName: "Messages",
    render: function() {
        var messages = this.props.messages.map(function(message, i) {
            return (
                React.createElement("div", {className: "entry", transitionName: "example"}, 
                    React.createElement(Message, {message: message, id: i, key: i})
                )
            );
        });
        return (
            React.createElement("div", null, 
                messages
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
                placeholder: "Shift + ⏎ to newline"
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