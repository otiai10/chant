import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Members from '../Components/Members';
import Entry from '../Components/Entry';

@connect(({messages, members}) => {
  return {messages, members};
})
export default class App extends Component {
  render() {
    const {messages, members} = this.props;
    return (
      <div>
        <Members members={members} />
        {messages.map(message => <Entry key={message.id} {...message} />)}
      </div>
    );
  }
  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.object).isRequired,
    members:  PropTypes.object.isRequired,
  }
}
