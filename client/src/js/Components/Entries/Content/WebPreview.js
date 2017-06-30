import React, {Component} from 'react';
import PropTypes from 'prop-types';

export class PreviewImage extends Component {
  render() {
    return (
      <img className="preview" src={this.props.image}
        onClick={() => window.open(this.props.link, '_blank')}
      />
    );
  }
  static propTypes = {
    link:  PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }
}

export class PreviewPage extends Component {
  render() {
    const {title, body, image} = this.props;
    return (
      <blockquote className="preview"
        onClick={() => window.open(this.props.link, '_blank')}
        >
        <div><h5>{title}</h5></div>
        <div className="row">
          <div className="justify"><img src={image}/></div>
          <div><p>{body}</p></div>
        </div>
      </blockquote>
    );
  }
  static propTypes = {
    link:  PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body:  PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }
}
