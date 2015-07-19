var EmojiList = React.createClass({
  render: function() {
    var emojis = [];
    for (var key in Config.emojis) {
      emojis.push(<Emoji name={key}></Emoji>);
    }
    return (
      <div>{emojis}</div>
    );
  }
});
