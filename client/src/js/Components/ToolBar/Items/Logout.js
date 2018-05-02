import React, {Component} from "react";
import ToolItem from "../ToolItem";

export default class LogoutItem extends Component {
  render() {
    return (
      <ToolItem fa="sign-out" onClick={this.attemptLogout}/>
    )
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
}