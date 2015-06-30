/**
 * socketの管理は、ここでやるべきかもしれない
 * onmessageからのディスパッチとか
 */
var Contents = React.createClass({
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
                <div className="entry" transitionName="example">
                    <Message message={message} id={i} key={i} />
                </div>
            );
        });
        return (
            <div>
                <div className="row">
                    <div className="col s12">
                        <h1 className="modest pull-right"><img src="/public/img/title.png" width="60px"/></h1>
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
                <div className="row">
                    <div className="col s12 m6">
                        <TextInput ref="TextInput" />
                    </div>
                    <div className="col s12 m6">
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
            </div>
        );
    }
});
