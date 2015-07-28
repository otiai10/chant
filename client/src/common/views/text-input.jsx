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
                onDrop={this.filedrop}
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
        if (ev.which == upKey) {
            return this.historyCompletion();
        }
        if (!ev.shiftKey && ev.which == enterKey) {
            chant.Send("message", txt);
            this.setState({value: ""});
            chant.local.history.pool.push(txt);
            chant.local.history.index = -1;
            return ev.preventDefault();
        }
    },
    filedrop: function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      var file = ev.nativeEvent.dataTransfer.files[0];
      var data = new FormData();
      // data.append('file-0', file);
      console.log(file);
      $.ajax({
        url: "/api/v1/room/default/upload",
        type: "post",
        data: data,
        dataType: false,
        processData: false,
        success: function(res) {
          console.log('success', res);
        },
        error: function(err) {
          console.log('error', err);
        }
      });
    },
    historyCompletion: function() {
      chant.local.history.index--;
      var i = (chant.local.history.index < 0) ? (chant.local.history.pool.length - 1) : chant.local.history.index;
      chant.local.history.index = i;
      var txt = chant.local.history.pool[i];
      if (txt) this.setState({value: txt});
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
