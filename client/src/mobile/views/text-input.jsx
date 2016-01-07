var TextInput = React.createClass({
    getInitialState: function() {
        return {
            value: '',
            rows: 3,
            draft: true,
            touchDown: false
        };
    },
    render: function() {
        return (
          <div>
            <textarea
              id="message-input"
              onKeyDown={this.onKeyDown}
              onChange={this.onChange}
              value={this.state.value}
              className="materialize-textarea"
              onTouchStart={this.touchStart}
              onTouchEnd={this.touchEnd}
              ref="textarea"
              ></textarea>
            <label>
              <i className="fa fa-file pull-right" id="input-file-upload-proxy"></i>
              <input type="file" ref="inputFileUpload" accept="image/*" id="input-file-upload" onChange={this.fileChanged}></input>
            </label>
          </div>
        );
    },
    compress: function(file) {
      if (file.size < 1000 * 1000) return Promise.resolve(file);
      var quality = 500 * 1000 / file.size;
      var uri = URL.createObjectURL(file);
      var img = new Image();
      img.src = uri;
      return new Promise(function(resolve) {
        var cnvs = document.createElement('canvas');
        img.onload = function() {
          try {
            cnvs.width = img.width / 4;
            cnvs.height = img.height / 4;
            cnvs.getContext('2d').drawImage(img, 0, 0, cnvs.width, cnvs.height);
            var bin = atob(cnvs.toDataURL('image/jpeg', quality).split(',')[1]);
            var buf = new Uint8Array(bin.length);
            for (var i = 0; i < bin.length; i++) {
              buf[i] = bin.charCodeAt(i);
            }
            var blob = new Blob([buf.buffer], {type: 'image/jpeg'});
            blob.name = file.name + '.jpg';
            resolve(blob);
          } catch (e) {
            console.error('compress failed', e);
            resolve(file);
          }
        };
      });
    },
    fileChanged: function(ev) {
      var file = ev.target.files[0];
      if (!file.type.match('^image')) {
        return;
      }
      this.compress(file).then(function(file) {
        var data = new FormData();
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
            window.alert(err.statusText);
          }
        });
      });
      // }}}
    },
    touchStart: function() {
      this.setState({touchDown: true});
      var id = setTimeout(function(){
        if (!this.state.touchDown) return console.info("Already Touch Up");
        this.setState({touchDown: false});
        // {{{ TODO: #229
        var finput = document.getElementById('input-file-upload');
        finput.click();
        // mobile safariだとclickイベントは発火するが、dialogがでない
        // しかたがないので、labelでonclickとってpropagateする方針をとってる
        // }}}
      }.bind(this), 800);
    },
    touchEnd: function(ev) {
      if (!this.state.touchDown) return console.info('Already Touch Up');
      this.setState({touchDown: false});
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
        if (!ev.shiftKey && ev.which == enterKey) {
            chant.Send("message", txt);
            this.setState({value: ""});
            document.getElementById('message-input').blur();
            return ev.preventDefault();
        }
        if (!this.state.draft) this.setState({draft: true});
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
