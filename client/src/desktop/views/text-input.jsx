var TextInput = React.createClass({
    getInitialState: function() {
        return {
            value: '',
            rows: 3,
            draft: true
        };
    },
    render: function() {
        return (
          <div id="message-input-preview">
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
            </div>
        );
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
        if (!ev.shiftKey && ev.which == upKey) {
            this.historyCompletion(-1);
            if (this.state.draft && this.state.value !== "") {
                chant.local.history.append(this.state.value);
            }
            return;
        }
        if (!ev.shiftKey && ev.which == downKey) {
            return this.historyCompletion(1);
        }
        if (!ev.shiftKey && ev.which == enterKey) {
            chant.Send("message", txt);
            this.setState({value: ""});
            chant.local.history.push(txt);
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
