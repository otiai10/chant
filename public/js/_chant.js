// onready的なこと
setTimeout(function(){
    chant.isCurrentPage = true;
    React.render(
        React.createElement(Contents, {name: "CHANT", myself: Config.myself}),
        document.getElementById('container')
    );
    window.onfocus = function() {
        chant.clearUnread();
    };
    window.onblur = function () {
        chant.isCurrentPage = false;
    };
}, 0);

var chant = chant || {};
chant._notification = {

};
chant.notify = function(body, title, icon, onclick, onclose) {
    onclick = onclick || function() {window.focus();};
    onclose = onclose || function() {};
    if (icon) icon = icon.replace('_normal', '_bigger');
    var note = new window.Notification(
        title || 'CHANT',
        {
            body: body || 'おだやかじゃないわね',
            icon: icon || '/public/img/icon.png'
        }
    );
    console.log(note);
    note.onclick = onclick;
    note.onclise = onclose;
};

chant.notifier = {
    notify: function(message) {
        // ignore my message
        if (message.user.id_str == Config.myself.id_str) return;
        chant.addUnread();
        // detect @all or @me
        var exp = new RegExp('@all|@' + Config.myself.screen_name);
        if (!exp.test(message.value.text)) return;
        chant.notify(
            message.value.text,
            message.user.screen_name,
            message.user.profile_image_url
        );
    }
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


var chant = chant || {};

chant.isCurrentPage = false;

chant.addUnread = function(ev) {
    if (chant.isCurrentPage) return;
    document.title = '!' + document.title;
    var favicon = document.getElementById("favicon");
    favicon.setAttribute("href", "/public/img/icon.chant.unread.mini.png");
};
chant.clearUnread = function(ev) {
    document.title = document.title.replace(/!/g, '');
    var favicon = document.getElementById("favicon");
    favicon.setAttribute("href", "/public/img/icon.chant.mini.png");
};


var AnchorizableText = React.createClass({displayName: "AnchorizableText",
    // render it first
    render: function () {
        return React.createElement('div', {
            ref: 'ATSelf'
        }, this.props.text);
    },
    // anchorize it after mount
    componentDidMount: function() {
        this.anchorize();
    },
    // anchorize it after update
    componentDidUpdate: function() {
        this.anchorize();
    },
    // anchorize execution
    anchorize: function() {
        var myself = React.findDOMNode(this.refs.ATSelf);
        var value = this.props.text;
        var self = this;
        this.props.ExprWrappers.map(function(ew) {
          value = self.exprAndWrap(value, ew);
        });
        myself.innerHTML = value;
    },
    // expr and wrap
    exprAndWrap: function(value, ew /* interface ExprWrapper */) {
        if (typeof ew.expr != 'function' || typeof ew.wrap != 'function') return value;
        var matches = ew.expr().exec(value) || [];
        if (matches.length == 0) return value;
        value = value.split(matches[0]).join(ew.wrap(matches[0]));
        return value;
    },
    getDefaultProps: function() {
        var sampleExprWrapper = {
            expr: function () /* RegExp */ {
                return /((https?):\/\/|www\.)([a-z0-9-]+\.)+[a-z0-9:]+(\/[^\s<>"',;]*)?(jpe?g|png|gif)$/gi;
            },
            wrap: function (value) /* string */ {
                return '<a href="' + value + '"><img class="entry-image" src="' + value + '" /></a>';
            }
        };
        return {
            ExprWrappers: [sampleExprWrapper]
        };
    }
});

/**
 * socketの管理は、ここでやるべきかもしれない
 * onmessageからのディスパッチとか
 */
var Contents = React.createClass({displayName: "Contents",
    getInitialState: function() {
        chant.socket().onopen = function(ev) { console.log('open', ev); };
        chant.socket().onclose = function(ev) {
            console.log('close', ev);
            chant.notify("disconnected with code: " + ev.code);
        };
        chant.socket().onerror = function(ev) {
            console.log('error', ev);
            chant.notify('ERROR!!');
        };
        var self = this;
        chant.socket().onmessage = function(ev) {
            var payload = JSON.parse(ev.data);
            console.log(payload);
            switch (payload.type) {
                case "message":
                    self.newMessage(payload);
                    break;
                case "stamprize":
                    self.newStamprize(payload);
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
            stamps: [],
            members: {}
        };
    },
    setText: function(text) {
        this.refs.TextInput.appendTextValue(text);
        this.refs.TextInput.getDOMNode().focus();
    },
    newMessage: function(message) {
        // this.state.messages.unshift(message);
        // var newMessages = this.state.messages;
        var messages = [message].concat(this.state.messages);
        this.setState({messages: messages});
        chant.notifier.notify(message);
    },
    newStamprize: function(stamprized) {
        this.state.stamps.unshift(stamprized);
        this.state.messages.unshift(stamprized);
        this.setState({
            messages: this.state.messages,
            stamps: this.state.stamps
        });
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
                            React.createElement(Icon, {setText: this.setText, user: this.props.myself})
                        ), 
                        React.createElement(Members, {setText: this.setText, members: this.state.members})
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col s12 m6"}, 
                        React.createElement(TextInput, {ref: "TextInput"})
                    ), 
                    React.createElement("div", {className: "col s12 m6"}, 
                        React.createElement(Stamps, {stamps: this.state.stamps})
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col s12 m8"}, 
                        React.createElement(Messages, {setText: this.setText, messages: this.state.messages})
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

/**
 * Icon
 */
var Icon = React.createClass({displayName: "Icon",
    render: function() {
        return (
            React.createElement("img", {onClick: this.onClick, src: this.props.user.profile_image_url, className: "user-icon"})
        );
    },
    onClick: function(ev) {
        this.props.setText('@' + this.props.user.screen_name);
    }
});
/**
 * Members
 */
var Members = React.createClass({displayName: "Members",
    render: function() {
        var members = [];
        for (var id in this.props.members) {
            members.push(
                React.createElement(Icon, {setText: this.props.setText, user: this.props.members[id]})
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
                React.createElement(MessageEntry, {setText: this.props.setText, message: this.props.message})
            )
        );
    }
});

var MessageEntry = React.createClass({displayName: "MessageEntry",
    render: function () {
        return (
            React.createElement("div", {className: "box"}, 
                React.createElement(MessageIcon, {setText: this.props.setText, message: this.props.message}), 
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
                React.createElement("span", {onClick: this.stamprize, className: "meta stealth"}, React.createElement("small", {className: "grey-text text-lighten-2"}, "stamprize"))
            )
        );
    },
    stamprize: function() {
        chant.Send('stamprize', JSON.stringify(this.props.message));
        document.getElementsByTagName('textarea')[0].focus();
        chant.clearUnread();// うーむ
    }
});

var MessageIcon = React.createClass({displayName: "MessageIcon",
    render: function() {
        return (
            React.createElement("div", null, 
                React.createElement(Icon, {setText: this.props.setText, user: this.props.message.user})
            )
        );
    }
});

var MessageContent = React.createClass({displayName: "MessageContent",
    render: function() {
        return (
            React.createElement("div", {className: "message-wrapper"}, 
                React.createElement(MessageInclusive, {message: this.props.message})
            )
        );
    }
});

var MessageInclusive = React.createClass({displayName: "MessageInclusive",
    render: function() {
        switch (this.props.message.type) {
        case "stamprize":
            return (
                React.createElement("div", null, 
                    React.createElement("div", null, "stamprize"), 
                    React.createElement("blockquote", null, 
                        React.createElement(MessageEntry, {message: this.props.message.value})
                    )
                )
            );
        default:
            return React.createElement(MessageRecursive, {message: this.props.message});
        }
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
        var lines = this.props.message.value.text.split('\n').map(function(line) {
            // return <p className="line-wrap">{line}</p>;
            return React.createElement("p", {className: "line-wrap"}, React.createElement(AnchorizableText, {text: line}));
        });
        return React.createElement("div", {className: "message-wrapper"}, lines);
    }
});

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Messages = React.createClass({displayName: "Messages",
  render: function() {
    var self = this;
    var messages = this.props.messages.map(function(message, i) {
      return (
        React.createElement(Message, {key: message.timestamp, setText: this.props.setText, message: message})
      );
    }.bind(this));
    return (
      React.createElement(ReactCSSTransitionGroup, {transitionName: "example"}, 
        messages
      )
    );
  }
});


var Stamps = React.createClass({displayName: "Stamps",
   render: function() {
       var stamps = this.props.stamps.map(function(stamp) {
           stamp.source = stamp.value;
           return React.createElement(Stamp, {stamp: stamp});
       });
       return React.createElement("div", null, stamps);
   }
});

var Stamp = React.createClass({displayName: "Stamp",
    render: function() {
        var text = (function(src) {
            if (src.length < 10) return src;
            return src.slice(0, 10) + '...';
        })(this.props.stamp.source.value.text);
        return React.createElement("button", {onClick: this.useStamp, className: "stamp"}, text);
    },
    useStamp: function () {
        chant.Send("stampuse", this.props.stamp.source.raw);
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
        return (
            React.createElement("textarea", {
                cols: "3", 
                rows: "3", 
                onKeyDown: this.onKeyDown, 
                onChange: this.onChange, 
                value: this.state.value, 
                className: "materialize-textarea", 
                style: {paddingTop: 0}, 
                placeholder: "Shift + ⏎ to newline"
                })
        );
    },
    onChange: function(ev) {
        chant.clearUnread();// TODO: うーむ
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
    },
    appendTextValue: function(text) {
        this.setState({value: this.state.value + ' ' + text})
    }
});