var MessageMeta = React.createClass({
    render: function() {
        var time = moment(this.props.message.timestamp / 1000000).format("YYYY/MM/DD HH:mm:ss");
        var contents = [
              <span onClick={this.quote} className="meta"><small className="grey-text text-lighten-1">{time}</small></span>,
        ];
        return (
            <div className="meta-wrapper">{contents}</div>
        );
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
    }
});
