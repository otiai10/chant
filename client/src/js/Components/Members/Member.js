import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon';

export default class Member extends Component {
  render() {
    const {member} = this.props;
    return (
      <div>
        <Icon user={member} />
      </div>
    );
  }
  static propTypes = {
    member: PropTypes.object.isRequired,
  }
}
