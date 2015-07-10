// entry point
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
    __get: function() {
      if (window.Notification) {
        return window.Notification;
      }
      return (function() {
          return function(title, options) {
              window.alert(options.body || 'おだやかじゃないわね');
              this.onclick = function() {};
              this.onclose = function() {};
          };
      })();
    }
};
chant.notify = function(body, title, icon, onclick, onclose) {
    onclick = onclick || function() {window.focus();};
    onclose = onclose || function() {};
    if (icon) icon = icon.replace('_normal', '_bigger');
    var notification = chant._notification.__get();
    var note = new notification(
        title || 'CHANT',
        {
            body: body || 'おだやかじゃないわね',
            icon: icon || '/public/img/icon.png'
        }
    );
    note.onclick = onclick;
    note.onclose = onclose;
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
    getInitialState: function() {
      return {
        _c: this.props.text
      };
    },
    // render it first
    render: function () {
        return React.createElement('p', {
            className: 'line-wrap',
            ref: 'ATSelf'
        }, this.state._c);
    },
    // anchorize it after mount
    componentDidMount: function() {
        this.anchorize();
    },
    // anchorize execution
    anchorize: function() {
        if (__vine.bind(this)()) {}
        else if (__twitter.bind(this)()) {}
        else if (__image.bind(this)()) {}
        else if (__link.bind(this)()) {}
    },
    getDefaultProps: function() {
        var sampleExprWrapper = {
            expr: function () /* RegExp */ {
                return /((https?):\/\/|www\.)([a-z0-9-]+\.)+[a-z0-9:]+(\/[^\s<>"',;]*)?(jpe?g|png|gif)/gi;
            },
            wrap: function (value) /* string */ {
                return '<a href="' + value + '" target="_blank"><img class="entry-image" src="' + value + '" /></a>';
            }
        };
        var normalURLExprWrapper = {
            expr: function() { return /(https?):\/\/([_a-zA-Z0-9-.@&=!~*()\';/?:+$,%#]+)/gi; },
            wrap: function(value) {
              return '<a href="' + value + '" target="_blank">' + value + '</a>';
            }
        };
        return {
            ExprWrappers: [sampleExprWrapper, normalURLExprWrapper]
        };
    }
});

// var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Message = React.createClass({displayName: "Message",
    render: function() {
        return (
            React.createElement("div", {className: "entry"}, 
                React.createElement(MessageMeta, {setText: this.props.setText, message: this.props.message}), 
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
        var contents = [
              React.createElement("span", {onClick: this.quote, className: "meta"}, React.createElement("small", {className: "grey-text text-lighten-2"}, time.toLocaleString())),
        ];
        switch (this.props.message.type) {
        case 'message':
          contents.push(
            React.createElement("span", {onClick: this.stamprize, className: "meta stealth"}, React.createElement("small", {className: "grey-text text-lighten-2"}, "stamprize"))
          );
        }
        return (
            React.createElement("div", {className: "meta-wrapper"}, contents)
        );
    },
    stamprize: function() {
        chant.Send('stamprize', JSON.stringify(this.props.message));
        document.getElementsByTagName('textarea')[0].focus();
        chant.clearUnread();// うーむ
    },
    // 本当はちゃんとしたいんだけど、とりあえずbrief quoteに倒す
    quote: function() {
      // var value = this.props.message.value.text;
      var value = JSON.stringify(this.props.message);
      this.props.setText(function(text) {
        if (!text) {
            return '\nquote>' + value + '\n';
        }
        return text + '\nquote>' + value + '\n';
      }, true);
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
        }
        return React.createElement(MessageAnchorable, {message: this.props.message});
    }
});

var MessageAnchorable = React.createClass({displayName: "MessageAnchorable",
    render: function() {
        var lines = this.props.message.value.text.split('\n').map(function(line) {
            var m = line.match(/^quote>({.+})$/);
            if (m && m.length > 1) {
              try {
                  var message = JSON.parse(m[1]);
                  return (
                    React.createElement("blockquote", {className: "rich-quote"}, 
                      React.createElement(MessageEntry, {message: message})
                    )
                  );
              } catch (e) {
                  return React.createElement("blockquote", null, React.createElement(AnchorizableText, {text: m[1]}));
              }
            }
            if (line.match(/^> /)) {// brief quote
              return React.createElement("blockquote", null, React.createElement(AnchorizableText, {text: line.replace(/^> /, '')}));
            }
            return React.createElement(AnchorizableText, {text: line});
        });
        return React.createElement("div", null, lines);
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
    var content = this.createContent();
    return (
      React.createElement("button", {onClick: this.useStamp, className: "stamp"}, content)
    );
  },
  createContent: function() {
    var content = this.props.stamp.source.value.text || '';
    var imgexp = /((https?):\/\/|www\.)([a-z0-9-]+\.)+[a-z0-9:]+(\/[^\s<>"',;]*)?(jpe?g|png|gif)/gi;
    var matches = imgexp.exec(content);
    if (matches) return React.createElement("img", {src: matches[0]});
    if (content.length > this.maxlen) return content.slice(0, this.maxlen) + '...';
    return content;
  },
  maxlen: 15,
  useStamp: function () {
    chant.Send("stampuse", this.props.stamp.source.raw);
  }
});

var TextInput = React.createClass({displayName: "TextInput",
    getInitialState: function() {
        return {
            value: '',
            rows: 3
        };
    },
    render: function() {
        return (
            React.createElement("textarea", {
                id: "message-input", 
                onKeyDown: this.onKeyDown, 
                onChange: this.onChange, 
                value: this.state.value, 
                className: "materialize-textarea", 
                placeholder: "Shift + ⏎ to newline"
                })
        );
    },
    onChange: function(ev) {
        chant.clearUnread();// TODO: うーむ
        this.setState({value: ev.target.value});
    },
    onKeyDown: function(ev) {
        var enterKey = 13;
        var txt = ev.target.value;
        if (!ev.shiftKey && ev.which == enterKey) {
            chant.Send("message", txt);
            this.setState({value: ""});
            return ev.preventDefault();
        }
    },
    appendTextValue: function(text) {
      if (typeof text !== 'function') { // TODO: remove this if block
        var c = this.state.value || '';
        if (c.length !== 0) c += ' ' + text;
        else c = text + ' ';
        this.setState({value: c});
        return;
      }
      var _c = text(this.state.value);
      this.setState({value: _c});
      return;
    }
});

// {{{ bind(this)すれば外からでもいいという意味でとりあえずここに宣言します
var __image = function() {
  var expr = /((https?):\/\/|www\.)([a-z0-9-]+\.)+[a-z0-9:]+(\/[^\s<>"',;]*)?(jpe?g|png|gif)/gi;
  var m = expr.exec(this.props.text);
  if (!m) return; // do nothing
  var c = __arraynize(this.props.text, m[0], function(sub) {
        return React.createElement("a", {href: sub, target: "_blank"}, React.createElement("img", {src: sub, className: "entry-image"}));
  });
  this.setState({_c: c});
  return true;
};
var __link = function() {
  var expr = /(https?):\/\/([_a-zA-Z0-9-.@&=!~*()\';/?:+$,%#]+)/gi;
  var m = expr.exec(this.props.text);
  if (!m) return; // do nothing;
  var c = __arraynize(this.props.text, m[0], function(sub) {
        return React.createElement("a", {href: sub, target: "_blank"}, sub);
  });
  this.setState({_c: c});
  return true;
};
var __twitter = function() {
  var expr = /(twitter.com)\/([^\/]+)\/status\/([0-9]+)/gi;
  var m = expr.exec(this.props.text);
  if (!m || m.length < 4) return;
  var id = m[3];
  $.ajax({
    url: 'https://api.twitter.com/1/statuses/oembed.json?id=' + String(id),
    method: 'GET',
    dataType: 'jsonp',
    success: function(res){
      res.html = res.html.replace('<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>', '');
      var d = React.createElement("div", {dangerouslySetInnerHTML: {__html:res.html}});
      this.setState({_c: d});
      setTimeout(function(){twttr.widgets.load();}, 0);
    }.bind(this),
    error: function(err){
      console.log('twitter API error', err);
    }
  });
};
var __vine = function() {
    var expr = /(https?:\/\/vine.co\/v\/[^\/]+)\/?.*/;
    var m = expr.exec(this.props.text);
    if (!m) return;
    var c = __arraynize(this.props.text, m[0], function(sub) {
      sub += '/embed/simple';
      return (
        React.createElement("iframe", {src: sub, width: "400", height: "400", frameborder: "0"})
      );
    });
    this.setState({_c: c});
    return true;
};
var __arraynize = function(src, sub, gen) /* []string */ {
  if (src.trim() === sub) return [gen(sub)];
  var c = [];
  var splitted = src.split(sub);
  for (var i = 0; i < splitted.length; i++) {
      if (splitted[i].length === 0) { // this element is the target itself
        c.push(gen(sub));
        continue;
      }
      if (i === splitted.length - 1) {// this element is the last
        c.push(splitted[i]);
        continue;
      }
      c.push(splitted[i]);
      c.push(React.createElement("div", null, gen(sub)));
  }
  return c;
};
// }}}

/**
 * socketの管理は、ここでやるべきかもしれない
 * onmessageからのディスパッチとか
 */
var Contents = React.createClass({displayName: "Contents",
    componentDidMount: function() {
      console.info("Mobile build : _chant.mobile.js");
    },
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
                React.createElement("div", {className: "row members-wrapper"}, 
                    React.createElement("div", {className: "col s12 members"}, 
                        React.createElement("span", null, 
                            React.createElement(Icon, {setText: this.setText, user: this.props.myself})
                        ), 
                        React.createElement(Members, {setText: this.setText, members: this.state.members})
                    )
                ), 
                React.createElement("div", {className: "row textinput-wrapper"}, 
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
      React.createElement(ReactCSSTransitionGroup, {transitionName: "newentry"}, 
        messages
      )
    );
  }
});
