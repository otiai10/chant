// entry point
setTimeout(function(){
  window.focused = true;
  React.render(
    React.createElement(Contents, {name: "CHANT", myself: Config.myself}),
    document.getElementById('container')
  );
}, 0);
window.onfocus = function() {
  window.focused = true;
  chant.clearUnread();
};
window.onblur = function () {
  window.focused = false;
};

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
              this.close = function() {};
          };
      })();
    },
    __sound: (function() {
        var audio = document.createElement('audio');
        audio.setAttribute('src', '/public/sound/notification.mp3');
        return {
          play: function() {
              if (window.navigator.userAgent.indexOf('Firefox') > -1) return;
              var vol = parseInt(chant.local.config.get('notificationVolume'));
              audio.volume = vol / 100;
              audio.play();
          }
        };
    })()
};
chant.notify = function(body, title, icon, isMention, onclick, onclose) {
    if (! chant.local.config.get('notification')) return;
    onclose = onclose || function() {};
    if (icon) icon = icon.replace('_normal', '_bigger');
    var notification = chant._notification.__get();
    var note = new notification(
        title || 'CHANT',
        {
            body: body || 'おだやかじゃないわね',
            icon: icon || '/public/img/icon.png',
            requireInteraction: isMention && !!chant.local.config.get("notificationStay")
        }
    );
    note.onclick = onclick || function() {
      window.focus();
      note.close();
    };
    note.onclose = onclose;

    // if xxx
    chant._notification.__sound.play();
};

chant.notifier = {
    notify: function(message) {
        // ignore my message
        if (message.user.id_str == Config.myself.id_str) return;
        chant.addUnread();
        // detect @all or @me
        var stored = chant.local.config.get("notificationRegExp");
        var mentioned = new RegExp('@all|@' + Config.myself.screen_name);
        var exp = (stored) ? new RegExp(stored) : mentioned;
        if (!exp.test(message.value.text)) return;
        chant.notify(
            message.value.text,
            message.user.screen_name,
            message.user.profile_image_url,
            mentioned.test(message.value.text)
        );
    }
};

var chant = chant || {};
chant.__socket = null;
/*
chant.socket = function(force) {
  this.retry += 500;
  if (chant.__socket !== null && chant.__socket.readyState > WebSocket.OPEN) {
    console.debug('chant.socket', '閉じてたのでforceする');
    force = true;
  }
  if (!chant.__socket || force) {
    chant.__socket = new WebSocket('ws://'+Config.server.host+'/websocket/room/socket?token=' + Config.room.token);
    chant.__socket.onerror = chant.__socket.onclose = function() {
      setTimeout(function(){
        chant.__socket = new WebSocket('ws://'+Config.server.host+'/websocket/room/socket?token=' + Config.room.token);
      }, this.retry);
    }.bind(this);
  }
  return chant.__socket;
};
*/

/**
 * おくるやつ
 * @param typ
 * @param value
 * @constructor
 */
chant.Send = function(/* string */typ/* string */, /* any */value) {
  if (typeof value.trim === 'function' && value.trim().length === 0) {
    return;// do nothing
  }
  chant.Socket().send(JSON.stringify({
    type:typ,
    raw:value
  }));
};

chant.delegate = {
    onmessage: null,
    keepaliveID: null,
    iconMyself: null
};

// 内部にWebSocketを持ち、onmessageイベントだけを受け取り、
// 再接続をincrementする
chant.Socket = function(retry) {
  // 既存のonmessageイベントハンドラを退避させとく
  if (chant.delegate.onmessage === null) {
    chant.delegate.onmessage = (chant.__socket && chant.__socket.onmessage) ? chant.__socket.onmessage : null;
  }
  // リトライをインクリメントしとく
  retry = (retry || 2) * 2;
  if (!chant.__socket || chant.__socket.readyState != WebSocket.OPEN) {
    chant.__socket = new WebSocket('ws://'+Config.server.host+'/websocket/room/socket?token=' + Config.room.token);
  }
  chant.__socket.onopen = function() {
    if (retry > 4) { // これはSocketによる再接続なので
      chant.notify("[RECONNECTED]\nreconnected successfully (o・∇・o)");
    }
    if (chant.delegate.iconMyself) {
      chant.delegate.iconMyself.setAttribute(
        'class',
        chant.delegate.iconMyself.getAttribute('class').replace(" icon-disconnected", "")
      );
    }
    retry = 0;
    if (chant.delegate.onmessage) {
      chant.__socket.onmessage = chant.delegate.onmessage;
    }
    // keepalive
    window.clearInterval(chant.delegate.keepaliveID);
    chant.delegate.keepaliveID = window.setInterval(function() {
      if (chant.__socket && chant.__socket.readyState == WebSocket.OPEN) {
        chant.__socket.send(JSON.stringify({
          type: 'keepalive'
        }));
      }
    }, 10000); // 雑に10秒でいいんすかね？
  };
  chant.__socket.onerror = function() {
    /*
    console.error("[WEBSOCKET ERROR] Try to reconnect " + retry + "seconds later");
    setTimeout(function(){
      chant.Socket(retry);
    }.bind(this), retry);
    */
  };
  chant.__socket.onclose = function() {
    console.log("[WEBSOCKET CLOSED]\nTry to reconnect " +
      moment.duration(retry * 1000).seconds() + "seconds later"
    );
    chant.delegate.iconMyself = document.getElementsByClassName('icon-myself')[0];
    var className = chant.delegate.iconMyself.getAttribute('class');
    if (!className.match('icon-disconnected')) {
      chant.delegate.iconMyself.setAttribute('class',className + " icon-disconnected");
    }
    setTimeout(function(r){
      chant.Socket(r);
    }.bind(this, retry), retry * 1000);
  };
  // onmessageのみをdelegateしてくれー
  return chant.__socket;
};

var chant = chant || {};
chant.local = {};
chant.local.storageAccessor = function(name, _def, _rootNS){
  this.ns = _rootNS || 'chant';
  this.ns += '.' + name;
  var _old = window.localStorage.getItem(this.ns);
  if (_old === undefined || _old === null) {
    window.localStorage.setItem(this.ns, JSON.stringify(_def || {}));
  } else {
    try {
      var merged = JSON.parse(_old);
      for (var key in (_def || {})) {
        merged[key] = (merged[key] === undefined) ? _def[key] : merged[key];
      }
      window.localStorage.setItem(this.ns, JSON.stringify(merged));
    } catch (e) {
      console.error('chant.local.storageAccessor', name, e);
    }
  }
  this.get = function(key, def) {
    var values = JSON.parse(window.localStorage.getItem(this.ns)) || {};
    return (typeof values[key] !== 'undefined') ? values[key] : def;
  };
  this.getAll = function() {
    var values = JSON.parse(window.localStorage.getItem(this.ns));
    return values;
  };
  this.set = function(key, value) {
    var values = this.getAll() || {};
    values[key] = value;
    this.setAll(values);
  };
  this.setAll = function(values) {
    window.localStorage.setItem(this.ns, JSON.stringify(values));
  };
};

chant.local.config = (function(){
  return new chant.local.storageAccessor('config', {
    notification: false,
    notificationVolume: 40,
    mute: {}
  });
})();

chant.local.history = {
  index: -1,
  pool: [],
  push: function(text) {
    chant.local.history.pool.push(text);
    chant.local.history.index = chant.local.history.pool.length;
  },
  append: function(text) {// indexはうごかさない
    chant.local.history.pool.push(text);
  },
  prev: function() {
    if (chant.local.history.pool.length === 0) return;
    var i = chant.local.history.index -= 1;
    if (i < 0)
      chant.local.history.index = i = chant.local.history.pool.length - 1;
    // console.log(i, chant.local.history.pool);
    return chant.local.history.pool[i];
  },
  next: function() {
    if (chant.local.history.pool.length === 0) return;
    var i = chant.local.history.index += 1;
    if (i >= chant.local.history.pool.length)
      chant.local.history.index = i = chant.local.history.pool.length - 1;
    // console.log(i, chant.local.history.pool);
    return chant.local.history.pool[i];
  }
};

var chant = chant || {};
chant.Totsuzen = function(str) {
  this.value = str;
  this.length = chant.Totsuzen.checkLength(str);
  this.head = "＿";
  this.foot = "￣";
  this.hat = "人";
  this.shoe1 = "^";
  this.shoe2 = "Y";
  this.left = "＞";
  this.right = "＜";
};
chant.Totsuzen.prototype.getTopLine = function() {
  var caps = [this.head];
  for (var i = 0; i < this.length; i++) {
    caps.push(this.hat);
  }
  caps.push(this.head);
  return caps.join('');
};
chant.Totsuzen.prototype.getMiddleLine = function() {
  var middle = [this.left, " ", this.value, " ", this.right];
  return middle.join('');
};
chant.Totsuzen.prototype.getBottomLine = function() {
  var bottom = [];
  for (var i = 0; i < this.length; i++) {
    bottom.push(this.shoe1, this.shoe2);
  }
  bottom = bottom.slice(1);
  bottom.unshift(this.foot);
  bottom.push(this.foot);
  return bottom.join('');
};
chant.Totsuzen.prototype.toText = function() {
  return [
  this.getTopLine(),
  this.getMiddleLine(),
  this.getBottomLine()
  ].join("\n");
};
chant.Totsuzen.checkLength = function(value) {
  var length = 0;
  // うわ、こんなところにjQuery!!
  $.map(value.split(''), function(ch) {
    if (chant.Totsuzen.isMultiByte(ch)) length += 2;
    else length += 3;
  });
  return Math.floor(length / 3);
};
chant.Totsuzen.isMultiByte = function(ch) /* bool */ {
  // Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff
  // Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
  var code =  ch.charCodeAt(0);
  if ((code >= 0x0 && code < 0x81) ||
    (code == 0xf8f0) ||
    (code >= 0xff61 && code < 0xffa0) ||
    (code >= 0xf8f1 && code < 0xf8f4)) {
    return true;
  }
  return false;
};
chant.Totsuzen.text = function(str) {
    var t = new chant.Totsuzen(str);
    return t.toText();
};

var chant = chant || {};

chant.addUnread = function(ev) {
  if (window.focused) return;
  document.title = '!' + document.title;
  var favicon = document.getElementById("favicon");
  favicon.setAttribute("href", "/public/img/icon.chant.unread.mini.png");
};
chant.clearUnread = function(ev) {
  document.title = document.title.replace(/!/g, '');
  var favicon = document.getElementById("favicon");
  favicon.setAttribute("href", "/public/img/icon.chant.mini.png");
};


var Amesh = React.createClass({displayName: "Amesh",
    render: function() {
        return (
          React.createElement("div", {className: "amesh-wrapper clickable", onClick: this.toAmesh}, 
            React.createElement("img", {className: "amesh-bg", src: this.props.entry.background}), 
            React.createElement("img", {className: "amesh-rain", src: this.props.entry.rain}), 
            React.createElement("img", {className: "amesh-dict", src: this.props.entry.dictionary})
          )
        );
    },
    toAmesh: function() {
        window.open(this.props.entry.url, "_blank");
    }
});

var AnchorizableText = React.createClass({displayName: "AnchorizableText",
    getInitialState: function() {
        this.props.rules = this.props.rules || [];
        var replacers = this.expandByRules([this.props.text]);
        var contents = [];
        replacers.forEach(function(replacer, i) {
            if (typeof replacer === 'string')
              return contents.push(React.createElement("span", null, replacer));
            if (typeof replacer.replace === 'function') {
              setTimeout(function() {
                replacer.replace.bind(this)(i, replacer.value);
              }.bind(this));
            }
            var _c = replacer.wrap.bind(this)(replacer.value);
            return contents.push(React.createElement("span", null, _c));
        }.bind(this));
        return {contents: contents};
    },
    render: function() {
        return React.createElement("span", null, this.state.contents);
    },
    expandByRules: function(tokens) {
        if (!this.props.rules) return tokens;
        this.props.rules.forEach(function(rule, i) {
            tokens = this.expandByRule(rule, tokens);
        }.bind(this));
        return tokens;
    },
    expandByRule: function(rule, tokens) /* tokens */ {
      return (function(tokens) {
        var expr = new RegExp(rule.match);
        var res = [];
        tokens.forEach(function(token) {
          if (!token.split) return res.push(token); // this is already replacer.
          token.split(expr).forEach(function(e) {
            if (e.length === 0) return;
            if (e.match(expr)) {
              var r = new AnchorizableText.Replacer(e);
              if (typeof rule.wrap === 'function') r.wrap = rule.wrap;
              if (typeof rule.replace === 'function') r.replace = rule.replace;
              return res.push(r);
            }
            return res.push(e);
          });
        });
        return res;
      })(tokens);
    },
    replaceContentsOf: function(index, content) {
        this.state.contents[index] = content;
        this.setState({contents: this.state.contents});
    }
});

AnchorizableText.Replacer = function(substr) {
  this.value = substr;
  // default wrap
  this.wrap = function(sub) {
    return React.createElement("a", {href: sub, target: "_blank"}, sub);
  };
};

var defaultRules = [
  // Twitter
  {
    match: /(https?:\/\/twitter.com\/[^\/]+\/status\/[0-9]+)/g,
    replace: function(i, sub) {
        var expr = /(https?:\/\/twitter.com)\/([^\/]+)\/status\/([0-9]+)/gi;
        var m = expr.exec(sub);
        if (!m || m.length < 4) return; // do nothing
        var id = m[3];
        $.ajax({
          url: 'https://api.twitter.com/1/statuses/oembed.json?id=' + String(id),
          method: 'GET',
          dataType: 'jsonp',
          success: function(res){
            res.html = res.html.replace('<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>', '');
            this.replaceContentsOf(i, React.createElement("div", {dangerouslySetInnerHTML: {__html:res.html}}));
            setTimeout(function(){twttr.widgets.load();}, 0);
          }.bind(this),
          error: function(err){
            console.log('twitter API error', err);
          }
        });
    }
  },
  // Vine
  {
    match: /(https?:\/\/vine.co\/v\/[^\/]+)\/?/,
    wrap: function(sub) {
      return React.createElement(Vine, {src: sub});
    }
  },
  // YouTube
  {
    match: /(https?:\/\/www.youtube.com\/watch\?.*v=[a-zA-Z0-9_-]{11})/gi,
    wrap: function(sub) {
      return React.createElement(YouTube, {src: sub});
    }
  },
  // youtu.be
  {
    match: /(https?:\/\/youtu.be\/[a-zA-Z0-9_-]{11})/gi,
    wrap: function(sub) {
      return React.createElement(YouTube, {src: sub});
    }
  },
  // SoundCloud
  {
    match: /(https?:\/\/soundcloud.com\/(?:[^\/]+)\/(?:[^\/]+))/gi,
    wrap: function(sub) {
      return React.createElement(SoundCloud, {src: sub});
    }
  },
  // MixCloud
  {
    match: /(https?:\/\/www.mixcloud.com\/(?:[^\/]+)\/(?:[^ ]+))/gi,
    wrap: function(sub) {
      return React.createElement(MixCloud, {src: sub});
    }
  },
  // Image
  /*
  {
    match: /((?:(?:https?):\/\/|www\.)(?:[a-z0-9-]+\.)+[a-z0-9:]+(?:\/[^\s<>"',;]*)?(?:jpe?g|png|gif))/gi,
    wrap: function(sub) {
      return <a href={sub} target="_blank"><img src={sub} className="entry-image"></img></a>;
    }
  },
  */
  // URL Link
  {
    match: /(https?:\/\/[_a-zA-Z0-9-.@&=!~*()\';/?:+$,%#]+)/gi,
    wrap: function(sub) {
      return React.createElement("a", {href: sub, target: "_blank"}, sub);
    },
    replace: function(i, sub) {
      $.ajax({
        url: '/api/v1/preview',
        data: { u: sub },
        success: function(res) {
          switch (res.content) {
          case 'image':
            return this.replaceContentsOf(i, React.createElement("a", {href: res.url, target: "_blank"}, React.createElement("img", {src: res.url, className: "entry-image"})));
          case 'video':
            return this.replaceContentsOf(i, React.createElement("video", {src: res.url, className: "entry-video", loop: true, controls: true}));
          }
          res.summary.title = res.summary.title || res.summary.url;
          res.summary.description = res.summary.description || res.summary.url;
          this.replaceContentsOf(
            i,
            React.createElement(WebPreview, {title: res.summary.title, image: res.summary.image, description: res.summary.description, url: res.summary.url})
          );
        }.bind(this)
      });
    }
  },
  // Emoji
  {
    match: /(:[a-zA-Z0-9_\-+]+:)/g,
    wrap: function(sub) {
      var url = Config.emojis[sub];
      if (Config.emojis[sub]) {
        return React.createElement(Emoji, {name: sub});
      } else {
        return React.createElement("span", null, sub);
      }
    }
  },
  // おっぱい
  {
    match: /(おっぱい)/g,
    wrap: function(sub) {
        return React.createElement("b", null, sub);
    }
  },
  // 自分
  {
    match: new RegExp('(@' + Config.myself.screen_name + '|' + '@all)', 'g'),
    wrap: function(sub) {
      return React.createElement("b", null, sub);
    }
  }
];

(function() {
  if (Config.apis.googlemaps) {
    var token = Config.apis.googlemaps;
    var baseURL = "https://www.google.com/maps/embed/v1";
    defaultRules.unshift({
      match: /(https?:\/\/www\.google\.co\.jp\/maps.*)/gi,
      wrap: function(sub) {
        if (sub.match(/\/place\/([^/]+)\//)) {
          var q = sub.match(/\/place\/([^/]+)\//)[1];
          var src = baseURL + "/place?q=" + q + "&zoom=15&key=" + token;
          return React.createElement("iframe", {width: "100%", height: "450", frameborder: "0", style: {border:0}, src: src});
        }
        return React.createElement("a", {href: sub, target: "_blank"}, sub);
      }
    });
  }
})();

var YouTube = React.createClass({displayName: "YouTube",
  render: function() {
    var id = this.getID();
    var url = "https://www.youtube.com/embed/" + id;
    return React.createElement("iframe", {width: "100%", height: "225", src: url, frameborder: "0", allowfullscreen: true});
  },
  getID: function() {
    var m = /https?:\/\/youtu.be\/([a-zA-Z0-9_-]{11})/gi.exec(this.props.src);
    if (m) {
        return m[1];
    }
    return /https?:\/\/www.youtube.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/.exec(this.props.src)[1];
  }
});
var SoundCloud = React.createClass({displayName: "SoundCloud",
  render: function() {
    var url = "https://w.soundcloud.com/player/?url=" + this.props.src + "&amp;visual=true";
    return React.createElement("iframe", {width: "100%", height: "225", scrolling: "no", frameborder: "no", src: url});
  }
});
var MixCloud = React.createClass({displayName: "MixCloud",
  render: function() {
    var url = "https://www.mixcloud.com/widget/iframe/?embed_type=widget_standard&feed=" + encodeURIComponent(this.props.src);
    return React.createElement("iframe", {width: "100%", height: "400", src: url});
  }
});
var Vine = React.createClass({displayName: "Vine",
  render: function() {
    var url = this.props.src + '/embed/simple';
    return React.createElement("iframe", {width: "100%", height: "300", frameborder: "0", src: url}, "うんこ");
  }
});

var Emoji = React.createClass({displayName: "Emoji",
  render: function() {
    var name = this.props.name;
    var url = Config.emojis[name];
    var out = function() {
        var hoge = document.getElementById("message-input");
        hoge.value += name;
        hoge.focus();
    };
    return React.createElement("img", {onClick: out, onKeyPress: out, tabIndex: "0", className: "emoji clickable", src: url, title: name});
  }
});

var EmojiList = React.createClass({displayName: "EmojiList",
  getInitialState: function() {
    var emojis = [];
    for (var key in Config.emojis) {
      emojis.push(React.createElement(Emoji, {name: key}));
    }
    return {
      emojis: emojis,
      rerendering: false
    };
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("div", null, 
          React.createElement("input", {id: "emoji-search", type: "text", onChange: this.onInputChange})
        ), 
        React.createElement("div", null, this.state.emojis)
      )
    );
  },
  onInputChange: function(ev) {
    if (this.rerendering) return;
    var emojis = [];
    this.replaceState({emojis: emojis, rerendering: true});
    for (var key in Config.emojis) {
      if (key.indexOf(ev.target.value) < 0) continue;
      emojis.push(React.createElement(Emoji, {name: key}));
    }
    this.setState({emojis: emojis, rerendering: false});
  }
});

/**
 * Icon
 */
var Icon = React.createClass({displayName: "Icon",
 render: function() {
   var styles = {
     backgroundImage: "url(" + this.props.user.profile_image_url + ")"
   };
   var className = "user-icon-wrapper";
   if (this.props.isMyself) className += " icon-myself";
   return (
     React.createElement("div", {onClick: this.onClick, className: className, style: styles})
   );
   // <img onClick={this.onClick} src={this.props.user.profile_image_url} className="user-icon" />
 },
 onClick: function(ev) {
   this.props.setText('@' + this.props.user.screen_name);
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
              React.createElement(MessageContent, {setText: this.props.setText, message: this.props.message})
            )
        );
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
                React.createElement(MessageInclusive, {setText: this.props.setText, message: this.props.message})
            )
        );
    }
});

var MessageInclusive = React.createClass({displayName: "MessageInclusive",
    render: function() {
        switch (this.props.message.type) {
        case "amesh":
          return React.createElement(Amesh, {entry: this.props.message.value});
        case "stamprize":
            return React.createElement(Stamprize, {message: this.props.message.value});
        case "mute":
            return (
              React.createElement("div", null, 
                React.createElement("div", null, "mute"), 
                React.createElement("blockquote", null, 
                  React.createElement(MessageEntry, {setText: this.props.setText, message: this.props.message.value})
                )
              )
            );
        case "unmute":
            return (
              React.createElement("div", null, 
                React.createElement("div", null, "unmute"), 
                React.createElement("blockquote", null, 
                  React.createElement(MessageEntry, {setText: this.props.setText, message: this.props.message.value})
                )
              )
            );
        case "stampuse":
            // うーむ、なぜ？ あー
            // 参照で全部変えてるのか
            this.props.message.value = this.props.message.value.value || this.props.message.value;
        default:
            return React.createElement(MessageRecursive, {setText: this.props.setText, message: this.props.message});
        }
    }
});
var MessageRecursive = React.createClass({displayName: "MessageRecursive",
  render: function() {
    if (this.props.message.value && this.props.message.value.children) {
      return (
        React.createElement("div", null, 
          React.createElement("div", null, this.props.message.value.text), 
          React.createElement("blockquote", null, 
            React.createElement(MessageEntry, {setText: this.props.setText, message: this.props.message.value.children})
          )
        )
      );
    }
    return React.createElement(MessageAnchorable, {setText: this.props.setText, message: this.props.message});
  }
});

var MessageAnchorable = React.createClass({displayName: "MessageAnchorable",
    render: function() {
        if (chant.local.config.get('mute')[this.props.message.value.text]) {
            return React.createElement(Muted, {message: this.props.message});
        }
        var setText = this.props.setText;// ここで退避
        var lines = this.props.message.value.text.split('\n').map(function(line) {
            var m = line.match(/^quote>({.+})$/);
            if (m && m.length > 1) {
              try {
                  var message = JSON.parse(m[1]);
                  return (
                    React.createElement("blockquote", {className: "rich-quote"}, 
                      React.createElement(MessageEntry, {setText: setText, message: message})
                    )
                  );
              } catch (e) {
                  return React.createElement("blockquote", null, React.createElement(AnchorizableText, {rules: defaultRules, text: m[1]}));
              }
            }
            if (line.match(/^> /)) {// brief quote
              return React.createElement("blockquote", null, React.createElement(AnchorizableText, {rules: defaultRules, text: line.replace(/^> /, '')}));
            }
            // return <AnchorizableText text={line}></AnchorizableText>;
            return React.createElement("p", {className: "line-wrap"}, React.createElement(AnchorizableText, {rules: defaultRules, text: line}));

        });
        return React.createElement("div", null, lines);
    }
});

var Muted = React.createClass({displayName: "Muted",
  render: function() {
      return (
        React.createElement("div", {onClick: this.unmute, className: "muted-contents clickable"}, 
          React.createElement("i", {className: "fa fa-ban"}, "あかんやつ")
        )
      );
  },
  unmute: function() {
    if (!window.confirm("unmute?\n" + this.props.message.value.text)) return;
    var mute = chant.local.config.get('mute');
    delete mute[this.props.message.value.text];
    chant.local.config.set('mute', mute);
    chant.Send('unmute', JSON.stringify(this.props.message));
  }
});

var Stamps = React.createClass({displayName: "Stamps",
  render: function() {
    var stamps = [];
    this.props.stamps.forEach(function(stamp, i) {
      stamp.source = stamp.value;
      stamps.push(React.createElement(Stamp, {stamp: stamp, key: i}));
    });
    return React.createElement("div", null, stamps);
  }
});

var Stamp = React.createClass({displayName: "Stamp",
  getInitialState: function() {
    return { left: false };
  },
  render: function() {
    var text = this.props.stamp.source.value.text.split("\n").join("");
    return (
      React.createElement("button", {onClick: this.useStamp, onMouseOver: this.showStampPreview, onMouseOut: this.remStampPreview, className: "stamp"}, 
        React.createElement(AnchorizableText, {rules: stampContentRules, text: text})
      )
    );
  },
  useStamp: function () {
    chant.Send("stampuse", JSON.stringify(this.props.stamp.source));
  },
  showStampPreview: function() {
    var preview = document.getElementById("message-input-preview");
    if (!preview) return; // TODO: separate mobile/desktop
    if (!this.props.stamp.source.value.text.match("https?:\/\/")) return; // TODO: 雑だなーw
    preview.style.backgroundImage = 'url("' + this.props.stamp.source.value.text + '")';
  },
  remStampPreview: function() {
    this.setState({left: true});
    var preview = document.getElementById("message-input-preview");
    if (!preview) return; // TODO: separate mobile/desktop
    preview.style.backgroundImage = '';
  }
});

var stampContentRules = [
  // 画像
  {
    match: /((?:(?:https?):\/\/|www\.)(?:[a-z0-9-]+\.)+[a-z0-9:]+(?:\/[^\s<>"',;]*)?(?:jpe?g|png|gif))/gi,
    wrap: function(sub) {
      return React.createElement("img", {src: sub});
    }
  },
  // emoji
  {
    match: /(:[a-zA-Z0-9_\-+]+:)/g,
    wrap: function(sub) {
      var url = Config.emojis[sub];
      if (Config.emojis[sub]) {
        // return <Emoji name={sub}></Emoji>;
        return React.createElement("img", {src: url});
      } else {
        return React.createElement("span", null, sub);
      }
    }
  },
  {
    match: /(.{12,})/g,
    wrap: function(sub) {
      sub = sub.slice(0, 12) + "...";
      return React.createElement("span", null, sub);
    }
  }
];

var Stamprize = React.createClass({displayName: "Stamprize",
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("div", null, "stamprize"), 
        React.createElement("blockquote", null, 
            React.createElement(MessageEntry, {message: this.props.message})
        )
      )
    );
  }
});


var WebPreview = React.createClass({displayName: "WebPreview",
    render: function() {
        return (
          React.createElement("div", {onClick: this.openURL, className: "web-preview clickable"}, 
              React.createElement("div", {className: "web-preview-title"}, 
                React.createElement("a", null, this.props.title)
              ), 
              React.createElement("div", {className: "box"}, 
                React.createElement("div", {className: "web-preview-image-wrap"}, 
                  React.createElement("img", {className: "web-preview-image", src: this.props.image})
                ), 
                React.createElement("div", {className: "web-preview-description-wrap"}, 
                  React.createElement("p", null, this.props.description)
                )
              )
          )
        );
    },
    openURL: function() {
        window.open(this.props.url, "_blank");
    }
});

/**
 * socketの管理は、ここでやるべきかもしれない
 * onmessageからのディスパッチとか
 */
var Contents = React.createClass({displayName: "Contents",
    componentDidMount: function() {
      console.info("Mobile build : _chant.mobile.js");
      $.get('/api/v1/room/default/messages', {
          token: Config.room.token,
          name: Config.room.name
        }, function(res) {
        this.setState({
          messages: res.messages.reverse()
        });
      }.bind(this));
    },
    getInitialState: function() {
        var self = this;
        chant.Socket().onmessage = function(ev) {
            var payload = JSON.parse(ev.data);
            // console.log(payload);
            switch (payload.type) {
                case "message":
                case "amesh":
                case "stampuse":
                    self.newMessage(payload);
                    break;
                    /*
                case "stamprize":
                    self.newStamprize(payload);
                    break;
                    */
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
    setText: function(text, focushead) {
        this.refs.TextInput.appendTextValue(text);
        this.refs.TextInput.getDOMNode().focus();
        if (focushead) {
          setTimeout(function() {
            document.getElementById('message-input').setSelectionRange(0, 0);
          });
        }
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
                    React.createElement("div", {className: "col s12 m8"}, 
                        React.createElement(TextInput, {ref: "TextInput"})
                    ), 
                    React.createElement("div", {className: "col s12 m4"}, 
                        React.createElement(Stamps, {stamps: this.state.stamps})
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col s12 m12"}, 
                        React.createElement(Messages, {setText: this.setText, messages: this.state.messages})
                    )
                )
            )
        );
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

var MessageMeta = React.createClass({displayName: "MessageMeta",
    render: function() {
        var time = moment(this.props.message.timestamp / 1000000).format("YYYY/MM/DD HH:mm:ss");
        var contents = [
              React.createElement("span", {onClick: this.quote, className: "meta"}, React.createElement("small", {className: "grey-text text-lighten-1"}, time)),
        ];
        return (
            React.createElement("div", {className: "meta-wrapper"}, contents)
        );
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

var TextInput = React.createClass({displayName: "TextInput",
    getInitialState: function() {
        return {
            value: '',
            rows: 3,
            draft: true,
            touchDown: false
        };
    },
    render: function() {
        return (
          React.createElement("div", null, 
            React.createElement("textarea", {
                id: "message-input", 
                onKeyDown: this.onKeyDown, 
                onChange: this.onChange, 
                value: this.state.value, 
                className: "materialize-textarea", 
                onTouchStart: this.touchStart, 
                onTouchEnd: this.touchEnd, 
                ref: "textarea"
                }), 
              React.createElement("input", {type: "file", ref: "inputFileUpload", id: "input-file-upload", onChange: this.fileChanged})
            )
        );
    },
    fileChanged: function(ev) {
      // var finput = React.findDOMNode(this.refs.inputFileUpload);
      // var file = ev.nativeEvent.dataTransfer.files[0];
      // var file = finput.files[0];
      var file = ev.target.files[0];
      if (!file.type.match('^image')) {
        return;
      }
      // data.append('file-0', file);
      var data = new FormData();
      // var data = new FormData(file);
      data.append('oppai', file);
      data.append('name', file.name);
      $.ajax({
        url: "/api/v1/room/default/upload",
        type: "POST",
        data: data,
        // dataType: false,
        processData: false,
        contentType: false,
        // contentType: 'multipart/form-data',
        success: function(res) {
          console.log('success', res);
        },
        error: function(err) {
          window.alert(err.statusText);
        }
      });
      // }}}
    },
    touchStart: function() {
      this.setState({touchDown: true});
      var id = setTimeout(function(){
        if (!this.state.touchDown) return console.info("Already Touch Up");
        this.setState({touchDown: false});
        // var finput = React.findDOMNode(this.refs.inputFileUpload);
        var finput = document.getElementById('input-file-upload');
        finput.click();
      }.bind(this), 800);
    },
    touchEnd: function(ev) {
      if (!this.state.touchDown) return console.info('Already Touch Up');
      this.setState({touchDown: false});
    },
    onChange: function(ev) {
        chant.clearUnread();// TODO: うーむ
        this.setState({value: ev.target.value});
    },
    onKeyDown: function(ev) {
        var enterKey = 13;
        var upKey = 38;
        var downKey = 40;
        var txt = ev.target.value;
        if (!ev.shiftKey && ev.which == enterKey) {
            chant.Send("message", txt);
            this.setState({value: ""});
            document.getElementById('message-input').blur();
            return ev.preventDefault();
        }
        if (!this.state.draft) this.setState({draft: true});
    },
    filedrop: function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      var file = ev.nativeEvent.dataTransfer.files[0];
      if (!file.type.match('^image')) {
        return;
      }
      // data.append('file-0', file);
      var data = new FormData();
      // var data = new FormData(file);
      data.append('oppai', file);
      data.append('name', file.name);
      $.ajax({
        url: "/api/v1/room/default/upload",
        type: "POST",
        data: data,
        // dataType: false,
        processData: false,
        contentType: false,
        // contentType: 'multipart/form-data',
        success: function(res) {
          console.log('success', res);
        },
        error: function(err) {
          console.log('error', err);
        }
      });
    },
    historyCompletion: function(step) {
      var txt = (step > 0) ? chant.local.history.next() : chant.local.history.prev();
      if (!txt) return;
      this.setState({value: txt, draft: false});
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
    },
    totsuzenize: function() {
      if (!String(this.state.value).length)
        return this.refs.textarea.getDOMNode().focus();
      chant.Send("message", chant.Totsuzen.text(this.state.value));
      this.setState({value: ""});
      return this.refs.textarea.getDOMNode().focus();
    },
    stamprize: function() {
      if (!String(this.state.value).length)
        return this.refs.textarea.getDOMNode().focus();
      chant.Send('stamprize', JSON.stringify({
        type: "message",
        raw: this.state.value,
        value: { text: this.state.value },
        user: Config.myself,
      }));
      this.setState({value: ""});
      return this.refs.textarea.getDOMNode().focus();
    }
});
