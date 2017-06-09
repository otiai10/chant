import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Entry from './Entry';

export default class Entries extends Component {
  render() {
    return (
      <div className="list section">
        {this.props.entries.map(entry => <Entry key={entry.id} {...entry}/>)}
      </div>
    );
  }
  static propTypes = {
    entries: PropTypes.arrayOf(PropTypes.object).isRequired,
  }
}
