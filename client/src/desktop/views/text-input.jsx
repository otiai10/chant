var TextInput = React.createClass({
    getInitialState: function() {
        return {
            value: '',
            rows: 3
        };
    },
    render: function() {
        return (
            <textarea
                cols="3"
                rows="3"
                onKeyDown={this.onKeyDown}
                onChange={this.onChange}
                value={this.state.value}
                className="materialize-textarea"
                style={{paddingTop: 0}}
                placeholder="Shift + ⏎ to newline"
                ></textarea>
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
        this.setState({value: this.state.value + ' ' + text});
    }
});
