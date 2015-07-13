
var WebPreview = React.createClass({
    render: function() {
        return (
          <div onClick={this.openURL} className="web-preview clickable">
              <h6 className="web-preview-title"><a href={this.props.url}>{this.props.title}</a></h6>
              <div className="box">
                <div className="web-preview-image-wrap">
                  <a href={this.props.url}>
                    <img className="web-preview-image" src={this.props.image} />
                  </a>
                </div>
                <div className="web-preview-description-wrap">
                  <a href={this.props.url}>
                    <p>{this.props.description}</p>
                  </a>
                </div>
              </div>
          </div>
        );
    },
    openURL: function() {
        window.open(this.props.url, "_blank");
    }
});
