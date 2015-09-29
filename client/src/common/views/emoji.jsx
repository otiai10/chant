var Emoji = React.createClass({
  render: function() {
    var name = this.props.name;
    var url = Config.emojis[name];
    var out = function() {
        var hoge = document.getElementById("message-input");
        hoge.value += name;
        hoge.focus();
    };
    return <img onClick={out} onKeyPress={out} tabIndex="0" className="emoji clickable" src={url} title={name} />;
  }
});
