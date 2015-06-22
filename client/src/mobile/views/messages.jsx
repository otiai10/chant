// var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Messages = React.createClass({
    getInitialState: function() {
        chant.socket().onopen = function(ev) { console.log('open', ev); };
        chant.socket().onclose = function(ev) { console.log('close', ev); };
        chant.socket().onerror = function(ev) { console.log('error', ev); };
        var self = this;
        chant.socket().onmessage = function(ev) {
            // FIXME: そうじゃないだろ感ある
            var payload = JSON.parse(ev.data);
            // TODO: ここでごにょごにょする？
            switch (payload.type) {
            case "message":
                payload.value = payload.value.replace("\n", "<br>");
                self.state.messages.unshift(payload);
            }
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
            return (
                <div className="entry" transitionName="example">
                    <Message message={message} id={i} key={i} />
                </div>
            );
        });
        return (
            <div>
                {messages}
            </div>
        );
    }
});
