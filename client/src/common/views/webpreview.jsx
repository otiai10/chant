
var WebPreview = React.createClass({
    render: function() {
        return (
          <div onClick={this.openURL} className="web-preview clickable">
              <h6 className="web-preview-title">{this.props.title}</h6>
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
        window.open(this.props.url, "_blank");
    }
});
