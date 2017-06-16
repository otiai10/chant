import React, {Component} from 'react';
import {connect} from 'react-redux';
import ToolItem from './ToolItem';

@connect()
export default class Toolbar extends Component {
  render() {
    return (
      <div id="tool-bar">
        <ToolItem fa="sign-out" onClick={this.attemptLogout.bind(this)}/>
      </div>
    );
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
