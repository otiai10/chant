
var WebPreview = React.createClass({
    render: function() {
        return (
          <div onClick={this.openURL} className="web-preview clickable">
              <div className="web-preview-title">
                <a>{this.props.title}</a>
              </div>
              <div className="box">
                <div className="web-preview-image-wrap">
                  <img className="web-preview-image" src={this.props.image} />
                </div>
                <div className="web-preview-description-wrap">
                  <p>{this.props.description}</p>
                </div>
              </div>
          </div>
        );
    },
    openURL: function() {
        chant.interface.open(this.props.url);
    }
});
