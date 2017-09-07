import React, {Component} from 'react';
import PropTypes from 'prop-types';

export class EmbedImage extends Component {
  render() {
    return (
      <img className="embed" src={this.props.image}
        onClick={() => window.open(this.props.link, '_blank')}
      />
    );
  }
  static propTypes = {
    link:  PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }
}

export class EmbedPage extends Component {
  render() {
    const {title, body, image, favicon, site, link} = this.props;
    return (
      <div className="embed embed-page embed-container"
        onClick={() => window.open(link, '_blank')}
        >
        <div className="row embed-content">
          <div className="embed-text">
            <div className="embed-title"><h3>{title}</h3></div>
            <div className="embed-body"><p>{body || title}</p></div>
            <div className="row embed-meta">
              <div className="embed-favicon justify"><img src={favicon} /></div>
              <div className="embed-site justify"><span>{site || link}</span></div>
            </div>
          </div>
          <div className="embed-img">
            <img src={image} />
          </div>
        </div>
      </div>
    );
  }
  static propTypes = {
    link:  PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body:  PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    site:  PropTypes.string.isRequired,
    favicon: PropTypes.string,
  }
}
