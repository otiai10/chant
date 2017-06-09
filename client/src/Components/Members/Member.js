import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Member extends Component {
  render() {
    const {member} = this.props;
    return (
      <div>
        <img src={member.image_url} />
      </div>
    );
  }
  static propTypes = {
    member: PropTypes.object.isRequired,
  }
}
