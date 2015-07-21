var YouTube = React.createClass({
  render: function() {
    var id = /https?:\/\/www.youtube.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/.exec(this.props.src)[1];
    var url = "https://www.youtube.com/embed/" + id;
    return <iframe width="100%" height="225" src={url} frameborder="0" allowfullscreen></iframe>;
  }
});
var SoundCloud = React.createClass({
  render: function() {
    var url = "https://w.soundcloud.com/player/?url=" + this.props.src + "&amp;visual=true";
    return <iframe width="100%" height="225" scrolling="no" frameborder="no" src={url}></iframe>;
  }
});
var MixCloud = React.createClass({
  render: function() {
    var url = "https://www.mixcloud.com/widget/iframe/?embed_type=widget_standard&feed=" + encodeURIComponent(this.props.src);
    return <iframe width="100%" height="400" src={url}></iframe>;
  }
});
var Vine = React.createClass({
  render: function() {
    var url = this.props.src + '/embed/simple';
    return <iframe width="100%" height="300" frameborder="0" src={url}>うんこ</iframe>;
  }
});