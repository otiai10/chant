import React, {Component} from 'react';
import PropTypes from 'prop-types';

import AnchorizableText from 'react-text-anchorize';
import rules from './anchorize-rules';

export default class Line extends Component {
  constructor(props) {
    super(props);
    this.state = {
      decorated: props.raw,
    };
  }
  render() {
    return (
      <div className="line">
        <AnchorizableText rules={rules} text={this.props.raw} />
      </div>
    );
  }
  static propTypes = {
    raw: PropTypes.string.isRequired,
  }
}
