import React, {Component} from 'react';
import {connect} from 'react-redux';

@connect(({foo}) => {return {foo};})
export default class App extends Component {
  render() {
    return (
      <div>
        <h1>This is chant: {this.props.foo.messages.length}</h1>
      </div>
    )
  }
}
