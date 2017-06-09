import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Icon extends Component {
  render() {
    const {user} = this.props;
    return (
      <div className="icon">
        <div className="icon-image" style={{backgroundImage: `url(${user.image_url})`}} />
        <span>{user.name}</span>
      </div>
    );
  }
  static propTypes = {
    user: PropTypes.object.isRequired,
  }
}
