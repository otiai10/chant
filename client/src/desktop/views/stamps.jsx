
var Stamps = React.createClass({
   render: function() {
       var stamps = this.props.stamps.map(function(stamp) {
           stamp.source = stamp.value;
           return <Stamp stamp={stamp} />;
       });
       return <div>{stamps}</div>;
   }
});

var Stamp = React.createClass({
    render: function() {
        var text = (function(src) {
            if (src.length < 10) return src;
            return src.slice(0, 10) + '...';
        })(this.props.stamp.source.value.text);
        return <button onClick={this.useStamp} className="stamp">{text}</button>;
    },
    useStamp: function () {
        chant.Send("stampuse", this.props.stamp.source.raw);
    }
});