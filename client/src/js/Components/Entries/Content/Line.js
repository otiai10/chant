import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Line extends Component {
  constructor(props) {
    super(props);
    this.state = {
      decorated: props.raw,
    };
  }
  render() {
    return (
      <p className="line">
        {this.state.decorated}
      </p>
    );
  }
  static propTypes = {
    raw: PropTypes.string.isRequired,
  }
}
