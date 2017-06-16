import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon';

export default class Myself extends Component {
  render() {
    return (
      <div>
        <Icon user={this.props.user} />
      </div>
    );
  }
  static propTypes = {
    user: PropTypes.object.isRequired,
  }
}
