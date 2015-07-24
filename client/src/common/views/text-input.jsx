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
                id="message-input"
                onKeyDown={this.onKeyDown}
                onChange={this.onChange}
                value={this.state.value}
                className="materialize-textarea"
                placeholder="Shift + ⏎ to newline"
                ref="textarea"
                ></textarea>
        );
    },
    onChange: function(ev) {
        chant.clearUnread();// TODO: うーむ
        this.setState({value: ev.target.value});
    },
    onKeyDown: function(ev) {
        var enterKey = 13;
        var upKey = 38;
        var txt = ev.target.value;
        if (!txt && ev.which == upKey) {
            return this.historyCompletion();
        }
        if (!ev.shiftKey && ev.which == enterKey) {
            chant.Send("message", txt);
            this.setState({value: ""});
            chant.local.history.push(txt);
            return ev.preventDefault();
        }
    },
    historyCompletion: function() {
      var txt = chant.local.history.pop();
      if (txt) this.setState({value: txt});
      chant.local.history.unshift(txt);
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
