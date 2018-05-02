import React, {Component} from "react";
import ToolItem from "../ToolItem";

export default class NotificationItem extends Component {
  render() {
    return (
      <ToolItem
        fa={this._notificationIcon()}
        onClick={this.openNotificationSetting.bind(this)}
      />
    );
  }
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
  openNotificationSetting() {
    // TODO: More detail settings.
    //       Just toggle settings for now.
    this.props.toggleDeviceNotification();
  }
}