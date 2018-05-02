import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ToolItem from './ToolItem';
import NotificationItem from "./Items/Notification";
import LogoutItem from "./Items/Logout";
import {toggleDeviceNotification} from '../../actions/remote';

@connect(({members}) => ({members}), {
  toggleDeviceNotification,
})
export default class Toolbar extends Component {
  render() {
    return (
      <div id="tool-bar">
        <NotificationItem
          members={this.props.members}
          toggleDeviceNotification={this.props.toggleDeviceNotification.bind(this)}
        />
        <LogoutItem />
      </div>
    );
  }
  static propTypes = {
    members: PropTypes.object.isRequired,
    toggleDeviceNotification: PropTypes.func.isRequired,
  }
}
