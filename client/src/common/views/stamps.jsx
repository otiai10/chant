var Stamps = React.createClass({
  render: function() {
    var stamps = [];
    this.props.stamps.forEach(function(stamp, i) {
      stamp.source = stamp.value;
      stamps.push(<Stamp stamp={stamp} key={i}></Stamp>);
    });
    return <div>{stamps}</div>;
  }
});

var Stamp = React.createClass({
  render: function() {
    var text = this.props.stamp.source.value.text.split("\n").join("");
    return (
      <button onClick={this.useStamp} className="stamp">
        <AnchorizableText rules={stampContentRules} text={text}></AnchorizableText>
      </button>
    );
  },
  useStamp: function () {
    chant.Send("stampuse", this.props.stamp.source.raw);
  }
});

var stampContentRules = [
  // 画像
  {
    match: /((?:(?:https?):\/\/|www\.)(?:[a-z0-9-]+\.)+[a-z0-9:]+(?:\/[^\s<>"',;]*)?(?:jpe?g|png|gif))/gi,
    wrap: function(sub) {
      return <img src={sub}></img>;
    }
  },
  // emoji
  {
    match: /(:[a-zA-Z0-9_\-+]+:)/g,
    wrap: function(sub) {
      var url = Config.emojis[sub];
      if (Config.emojis[sub]) {
        // return <Emoji name={sub}></Emoji>;
        return <img src={url}></img>;
      } else {
        return <span>{sub}</span>;
      }
    }
  },
  {
    match: /(.{12,})/g,
    wrap: function(sub) {
      sub = sub.slice(0, 12) + "...";
      return <span>{sub}</span>;
    }
  }
];

var Stamprize = React.createClass({
  render: function() {
    return (
      <div>
        <div>stamprize</div>
        <blockquote>
            <MessageEntry message={this.props.message} />
        </blockquote>
      </div>
    );
  }
});
