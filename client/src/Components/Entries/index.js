import React, {Component} from 'react';
import PropTypes from 'prop-types';

export class Entry extends Component {
  render() {
    return (
      <div>
        <p>{this.props.text}</p>
      </div>
    );
  }
  static propTypes = {
    text: PropTypes.string.isRequired,
  }
}

export default class Entries extends Component {
  render() {
    return (
      <div>
        {this.props.entries.map(entry => <Entry key={entry.id} {...entry}/>)}
      </div>
    );
  }
  static propTypes = {
    entries: PropTypes.arrayOf(PropTypes.object).isRequired,
  }
}
