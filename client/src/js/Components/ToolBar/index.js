import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ToolItem from './ToolItem';
import {toggleDeviceNotification} from '../../actions/remote';

@connect(({members}) => ({members}), {
  toggleDeviceNotification,
})
export default class Toolbar extends Component {
  _notificationIcon() {
    const myself = this.props.members[chant.user.id];
    if (!myself) return 'bell-slash';
    const devices = ((myself.notification || {}).devices || {});
    if (devices[chant.device.name]) {
      return 'bell';
    } else {
      return 'bell-slash';
    }
  }
  render() {
    return (
      <div id="tool-bar">
        <ToolItem fa={this._notificationIcon()} onClick={this.openNotificationSetting.bind(this)} />
        <ToolItem fa="sign-out" onClick={this.attemptLogout.bind(this)}/>
      </div>
    );
  }
  openNotificationSetting() {
    // TODO: More detail settings.
    //       Just toggle settings for now.
    this.props.toggleDeviceNotification();
  }
  attemptLogout() {
    if (!window.confirm('Log out?')) return;
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/logout';
    form.style = 'display:hidden;';
    document.body.appendChild(form);
    form.submit();
  }
  static propTypes = {
    members: PropTypes.object.isRequired,
    toggleDeviceNotification: PropTypes.func.isRequired,
  }
}
