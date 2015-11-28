var MessageMeta = React.createClass({
    render: function() {
        var time = moment(this.props.message.timestamp / 1000000).format("YYYY/MM/DD HH:mm:ss");
        var contents = [
              <span onClick={this.quote} className="meta"><small className="grey-text text-lighten-1">{time}</small></span>,
        ];
        switch (this.props.message.type) {
        case 'message':
        case 'stampuse':
          contents.push(
            <span onClick={this.stamprize} className="meta stealth"><small className="grey-text text-lighten-1">stamprize</small></span>,
            <span onClick={this.totsuzenize} className="meta stealth"><small className="grey-text text-lighten-1">totsuzenize</small></span>,
            <span onClick={this.mute} className="meta stealth"><small className="grey-text text-lighten-1">mute</small></span>
          );
        }
        return (
            <div className="meta-wrapper">{contents}</div>
        );
    },
    stamprize: function() {
        chant.Send('stamprize', JSON.stringify(this.props.message));
        document.getElementsByTagName('textarea')[0].focus();
        chant.clearUnread();// うーむ
    },
    totsuzenize: function() {
        chant.Send('message', chant.Totsuzen.text(this.props.message.value.text));
    },
    // 本当はちゃんとしたいんだけど、とりあえずbrief quoteに倒す
    quote: function() {
      // var value = this.props.message.value.text;
      var value = JSON.stringify(this.props.message);
      this.props.setText(function(text) {
        if (!text) {
            return '\nquote>' + value + '\n';
        }
        return text + '\nquote>' + value + '\n';
      }, true);
    },
    mute: function() {
      var text = this.props.message.value.text;
      var mute = chant.local.config.get('mute');
      mute[text] = 1;
      chant.local.config.set('mute', mute);
      chant.Send('mute', JSON.stringify(this.props.message));
    }
});
