import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CSSTransitionGroup} from 'react-transition-group';

import Entry from './Entry';

export default class Entries extends Component {
  render() {
    return (
      <div className="list section">
        <CSSTransitionGroup
          transitionName="entries"
          transitionEnterTimeout={120}
          transitionLeaveTimeout={80}
          >
          {this.props.entries.map(entry => <Entry key={entry.id} {...entry}/>)}
        </CSSTransitionGroup>
      </div>
    );
  }
  static propTypes = {
    entries: PropTypes.arrayOf(PropTypes.object).isRequired,
  }
}
