import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {_prettyTime} from '../utils';

export default class Timestamp extends Component {
  render() {
    return (
      <div className="action timestamp" onClick={this.onClick.bind(this)}>
        {_prettyTime(this.props.time)}
      </div>
    );
  }
  onClick() {
    if (typeof this.props.onClick == 'function') this.props.onClick();
  }
  static propTypes = {
    time:    PropTypes.number.isRequired,
    onClick: PropTypes.func,
  }
}
