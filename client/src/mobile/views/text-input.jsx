var TextInput = React.createClass({
    getInitialState: function() {
        return {
            value: '',
            rows: 3
        }
    },
    render: function() {
        var value = this.state.value;
        return (
            <textarea
                cols="3"
                rows="3"
                onKeyDown={this.onKeyDown}
                onChange={this.onChange}
                value={value}
                className="materialize-textarea"
                style={{paddingTop: 0}}
                placeholder="Shift + ⏎ to newline"
                ></textarea>
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