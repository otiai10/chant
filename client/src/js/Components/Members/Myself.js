import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {appendText} from '../../actions/inputs';
import Icon from '../Icon';

@connect(null, {
  appendText,
})
export default class Myself extends Component {
  render() {
    return (
      <div>
        <Icon user={this.props.user} onClick={this.onClick.bind(this)}/>
      </div>
    );
  }
  onClick() {
    this.props.appendText('@' + this.props.user.name + ' ');
  }
  static propTypes = {
    user: PropTypes.object.isRequired,
    appendText: PropTypes.func.isRequired,
  }
}
