import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Line from './Line';

export default class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      decorated: props.text,
    };
  }
  render() {
    return (
      <div>
        {this.props.text.split('\n').map((r, i) => <Line key={i} raw={r} />)}
      </div>
    );
  }
  static propTypes = {
    text: PropTypes.string.isRequired,
  }
}
