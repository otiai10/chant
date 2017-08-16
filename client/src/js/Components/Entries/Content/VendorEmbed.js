import React, {Component} from 'react';
import PropTypes from 'prop-types';

export class SoundCloud extends Component {
  render() {
    var height = (this.props.src.match(/\/sets\//)) ? 460 : 225;
    var url = 'https://w.soundcloud.com/player/?url=' + this.props.src + '&amp;visual=true';
    return <iframe width="100%" height={height} scrolling="no" frameBorder="no" src={url}></iframe>;
  }
  static propTypes = {
    src: PropTypes.string.isRequired,
  }
}
