import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

@connect(({foo}) => foo)
export default class App extends Component {
  render() {
    return (
      <div>
        <h1>This is chant: {this.props.messages.length}</h1>
      </div>
    );
  }
  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  }
}
