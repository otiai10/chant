/**
 * socketの管理は、ここでやるべきかもしれない
 * onmessageからのディスパッチとか
 */
var Contents = React.createClass({
    componentDidMount: function() {
      console.info("Desktop build : _chant.desktop.js");
      $.get('/api/v1/room/default/stamps', {
          token: Config.room.token,
          name: Config.room.name
        }, function(res) {
          this.setState({
            stamps: res.stamps,
        });
      }.bind(this));
      $.get('/api/v1/room/default/messages', {
          token: Config.room.token,
          name: Config.room.name
        }, function(res) {
        this.setState({
          messages: res.messages.reverse()
        });
      }.bind(this));
      React.render(<EmojiList />, document.getElementById('emoji-list-wrapper'));
    },
    closeEmojiList: function() {
      document.getElementById('emoji-list-wrapper').hidden = true;
    },
    getInitialState: function() {
        chant.socket().onopen = function(ev) { /* なんもしない */ };
        chant.socket().onclose = function(ev) {
          console.debug('socket.onclose', ev);
        };
        chant.socket().onerror = function(ev) {
          console.debug('socket.onerror', ev);
          chant.notify('ERROR!!', null, null, function() {
            chant.socket(true);
            // sysinfoしたい
          });
        };
        chant.socket().onmessage = function(ev) {
            var payload = JSON.parse(ev.data);
            // console.log(payload);
            switch (payload.type) {
                case "message":
                    this.newMessage(payload);
                    break;
                case "stamprize":
                    this.newStamprize(payload);
                    break;
                case "join":
                    this.join(payload);
                    break;
                case "leave":
                    this.leave(payload);
                    break;
            }
        }.bind(this);
        return {
            messages: [],
            stamps: [],
            members: {}
        };
    },
    setText: function(text, focushead) {
        this.refs.TextInput.appendTextValue(text);
        if (focushead) {
          this.refs.TextInput.getDOMNode().setSelectionRange(0, 0);
        } else {
          this.refs.TextInput.getDOMNode().focus();
        }
    },
    totsuzenize: function() {
        this.refs.TextInput.totsuzenize();
    },
    stamprize: function() {
        this.refs.TextInput.stamprize();
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
                <div className="entry" transitionName="example">
                    <Message message={message} id={i} key={i} />
                </div>
            );
        });
        return (
            <div>
                <div className="row">
                  <div id="emoji-list-wrapper" onClick={this.closeEmojiList} className="clickable" hidden="true">
                  </div>
                </div>
                <div className="row">
                    <div className="col s12 members">
                        <span>
                            <Icon setText={this.setText} user={this.props.myself} />
                        </span>
                        <Members setText={this.setText} members={this.state.members} />
                    </div>
                </div>
                <div className="row" id="input-actions">
                    <div className="col s12 m8">
                      <TextInput ref="TextInput" />
                    </div>
                    <div className="col s12 m4">
                      <button onClick={this.totsuzenize} className="stealth clickable text-decorate">totsuzenize</button>
                      <button onClick={this.stamprize} className="stealth clickable text-decorate">stamprize</button>
                    </div>
                </div>
                <div className="row">
                  <div className="col s12">
                    <Stamps stamps={this.state.stamps} />
                  </div>
                </div>
                <div className="row">
                    <div className="col s12 m8">
                        <Messages setText={this.setText} messages={this.state.messages} />
                    </div>
                    <div className="col s12 m4">
                        {/*
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
                        */}
                    </div>
                </div>
                <Configs id="configs"></Configs>
            </div>
        );
    }
});
