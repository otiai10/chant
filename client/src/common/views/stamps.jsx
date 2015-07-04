
var Stamps = React.createClass({
  render: function() {
    var stamps = this.props.stamps.map(function(stamp) {
      stamp.source = stamp.value;
      return <Stamp stamp={stamp}></Stamp>;
    });
    return <div>{stamps}</div>;
  }
});

var Stamp = React.createClass({
  render: function() {
    var content = this.createContent();
    return (
      <button onClick={this.useStamp} className="stamp">{content}</button>
    );
  },
  createContent: function() {
    var content = this.props.stamp.source.value.text || '';
    var imgexp = /((https?):\/\/|www\.)([a-z0-9-]+\.)+[a-z0-9:]+(\/[^\s<>"',;]*)?(jpe?g|png|gif)/gi;
    var matches = imgexp.exec(content);
    if (matches) return <img src={matches[0]}></img>;
    if (content.length > this.maxlen) return content.slice(0, this.maxlen) + '...';
    return content;
  },
  maxlen: 15,
  useStamp: function () {
    chant.Send("stampuse", this.props.stamp.source.raw);
  }
});
