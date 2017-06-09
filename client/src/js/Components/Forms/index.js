import React, {Component} from 'react';

import MessageInput from './MessageInput';

export default class Forms extends Component {
  render() {
    return (
      <div className="list section forms">
        <div className="row">
          <MessageInput />
        </div>
      </div>
    );
  }
}
