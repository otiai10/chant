import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Members from '../Components/Members';
import Entries from '../Components/Entries';
import Forms   from '../Components/Forms';

@connect(({messages, members}) => {
  return {messages, members};
})
export default class App extends Component {
  render() {
    const {messages, members} = this.props;
    return (
      <div className="container">
        <Members members={members} />
        <Forms />
        <Entries entries={messages} />
      </div>
    );
  }
  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.object).isRequired,
    members:  PropTypes.object.isRequired,
  }
}
