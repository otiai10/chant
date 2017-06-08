import React, {Component} from 'react';
import {connect} from 'react-redux';

@connect()
export default class Forms extends Component {
  render() {
    return (
      <div className="row">
        <input type="text" />
      </div>
    );
  }
}
