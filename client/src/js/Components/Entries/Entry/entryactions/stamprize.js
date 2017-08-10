import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class StamprizeAction extends Component {
  render() {
    return (
      <div className="action stamprize" onClick={this.onClick.bind(this)}>
        Stamprize
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
