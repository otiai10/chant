import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Entry extends Component {
  render() {
    return (
      <div>
        <p>{this.props.text}</p>
      </div>
    );
  }
  static propTypes = {
    text: PropTypes.string.isRequired,
  }
}
