import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {appendText} from '../../actions/inputs';

import Icon from '../Icon';

@connect(null, {
  appendText,
})
export default class Member extends Component {
  render() {
    const {member} = this.props;
    return (
      <div>
        <Icon user={member} onClick={this.onClick.bind(this)} />
      </div>
    );
  }
  onClick() {
    this.props.appendText('@' + this.props.member.name + ' ');
  }
  static propTypes = {
    member: PropTypes.object.isRequired,
    appendText: PropTypes.func.isRequired,
  }
}
