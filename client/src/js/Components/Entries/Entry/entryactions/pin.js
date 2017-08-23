import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class PinAction extends Component {
  render() {
    return (
      <div className="action pin" onClick={this.props.onClick.bind(this)}>
        <i className="fa fa-thumb-tack" />
      </div>
    );
  }
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  }
}
