var EmojiList = React.createClass({
  getInitialState: function() {
    var emojis = [];
    for (var key in Config.emojis) {
      emojis.push(<Emoji name={key} />);
    }
    return {
      emojis: emojis,
      rerendering: false
    };
  },
  render: function() {
    return (
      <div>
        <div>
          <input type="text" onChange={this.onInputChange} />
        </div>
        <div>{this.state.emojis}</div>
      </div>
    );
  },
  onInputChange: function(ev) {
    if (this.rerendering) return;
    var emojis = [];
    this.replaceState({emojis: emojis, rerendering: true});
    var exp = new RegExp(ev.target.value);
    for (var key in Config.emojis) {
      if (exp.test(key)) emojis.push(<Emoji name={key}></Emoji>);
    }
    this.setState({emojis: emojis, rerendering: false});
  }
});
