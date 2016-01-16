/**
 * socketの管理は、ここでやるべきかもしれない
 * onmessageからのディスパッチとか
 */
var chant = chant || {};
var Contents = React.createClass({
    onfocus: function() {
      Promise.resolve().then(function(){
        this.setState({loading: 1});
        return Promise.resolve();
      }.bind(this)).then(function() {
        return Promise.all([
          new Promise(function(resolve) {
            $.get('/api/v1/room/default/messages', {
              token: Config.room.token,
              name: Config.room.name
            }, resolve);
          }),
          new Promise(function(resolve) {
            setTimeout(resolve, 1000, true);
          })
        ]);
      }).then(function(results) {
        var messages = results[0].messages;
        if (messages.length == 0) return "do nothing";
        if (this.state.messages.length != 0) {
          for (var i = 0; i < this.state.messages.length; i++) {
            if (messages[0].timestamp > this.state.messages[i].timestamp) messages.unshift(this.state.messages[i]);
          }
        }
        this.setState({messages: messages.reverse()});
        return Promise.resolve();
      }.bind(this)).then(function() {
        chant.Socket(0); // ensure connection, reconnect if it is closed
        this.setState({loading: 0});
      }.bind(this)).catch(function() {
        // TODO: なんかエラーを伝える
        this.setState({loading: 0});
      }.bind(this));
    },
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

      chant.onfocusDelegate(this.onfocus, this);
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
                case "kick":
                    if (payload.value == Config.myself.screen_name) {
                      window.alert("kicked :(");
                      return window.location.reload();
                    }
                    payload.type = "message";
                    payload.value = {
                      "text": payload.raw
                    };
                    self.newMessage(payload);
                    break;
            }
        };
        return {
            loading: false,
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
                <div className="entry" transitionName="example">
                    <Message message={message} id={i} key={i} />
                </div>
            );
        });
        return (
            <div id="contents-wrapper">
                <div className="row members-wrapper">
                    <div className="col s12 members">
                        <span>
                            <Icon setText={this.setText} user={this.props.myself} />
                        </span>
                        <Members setText={this.setText} members={this.state.members} />
                    </div>
                </div>
                <div className="row textinput-wrapper">
                    <div className="col s12 m8">
                        <TextInput ref="TextInput" />
                    </div>
                    <div className="col s12 m4">
                        <Stamps stamps={this.state.stamps} />
                    </div>
                </div>
                <div className="row">
                    <div className="col s12 m12">
                        <Messages setText={this.setText} messages={this.state.messages} />
                    </div>
                </div>
                {(this.state.loading == 1) ?
                  <div id="mobile-loader">
                      <span>
                          <i className="fa fa-refresh fa-spin"></i>
                      </span>
                  </div>
                : null}
                {/* いらんきもするな */}
                {(this.state.loading == 2) ?
                  <div id="mobile-loader">
                      <span>
                          <i className="fa fa-check"></i>
                      </span>
                  </div>
                : null}
            </div>
        );
    }
});
