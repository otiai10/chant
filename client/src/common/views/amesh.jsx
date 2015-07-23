
var Amesh = React.createClass({
    render: function() {
        return (
          <div className="amesh-wrapper clickable" onClick={this.toAmesh}>
            <img className="amesh-bg"   src={this.props.entry.background} />
            <img className="amesh-rain" src={this.props.entry.rain} />
            <img className="amesh-dict" src={this.props.entry.dictionary} />
          </div>
        );
    },
    toAmesh: function() {
        window.open(this.props.entry.url, "_blank");
    }
});
