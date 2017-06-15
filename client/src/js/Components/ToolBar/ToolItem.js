import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class ToolItem extends Component {
  render() {
    return (
      <div className="tool-item justify" onClick={this.props.onClick}>
        <i className={`fa fa-${this.props.fa}`} />
      </div>
    );
  }
  static propTypes = {
    fa:      PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }
}
