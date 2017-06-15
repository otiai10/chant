import React, {Component} from 'react';

import MessageInput from './MessageInput';
import StampsInput  from './StampsInput';

export default class Forms extends Component {
  render() {
    return (
      <div className="list section forms">
        <MessageInput />
        <StampsInput />
      </div>
    );
  }
}
