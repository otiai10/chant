import React, {Component} from 'react';
import {connect} from 'react-redux';

@connect(({foo}) => {return {foo};})
export default class App extends Component {
  render() {
    const {foo:{messages}} = this.props;
    return (
      <div>
        <h1>This is chant: message length: {this.props.foo.messages.length}</h1>
        <ul>
        {messages.map(message => {
            return <li key={message.id}>{message.id}<br /> {message.text}</li>;
        })}
        </ul>
      </div>
    )
  }
}
