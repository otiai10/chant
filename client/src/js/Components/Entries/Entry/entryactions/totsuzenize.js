import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class TotsuzenizeAction extends Component {
  render() {
    return (
      <div className="action totsuzenize" onClick={this.onClick.bind(this)}>
        Totsuzenize
      </div>
    );
  }
  onClick() {
    if (typeof this.props.onClick == 'function') this.props.onClick();
  }
  static propTypes = {
    onClick: PropTypes.func,
  }
}
