import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Myself extends Component {
  render() {
    return (
      <div>
        <img src={this.props.user.image_url} />
      </div>
    );
  }
  static propTypes = {
    user: PropTypes.object.isRequired,
  }
}
