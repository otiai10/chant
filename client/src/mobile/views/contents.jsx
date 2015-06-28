/**
 * socketの管理は、ここでやるべきかもしれない
 * onmessageからのディスパッチとか
 */
var Contents = React.createClass({
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
                    chant.addUnread();
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
                            <img src={this.props.myself.profile_image_url} className="user-icon myself" />
                        </span>
                        <Members members={this.state.members} />
                    </div>
                </div>
                <div className="row">
                    <div className="col s12 m6">
                        <TextInput />
                    </div>
                    <div className="col s12 m6">
                        {/*
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
                        */}
                    </div>
                </div>
                <div className="row">
                    <div className="col s12 m8">
                        <Messages messages={this.state.messages} />
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
