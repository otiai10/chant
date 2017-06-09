import React, {Component} from 'react';
import PropTypes from 'prop-types';

export class Entry extends Component {
  render() {
    const {user, time, text} = this.props;
    return (
      <div className="row">
        <div>
          <img src={user.image_url} />
        </div>
        <div>
          <div>{user.name} : {time}</div>
          <p>{text}</p>
        </div>
      </div>
    );
  }
  static propTypes = {
    text: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    time: PropTypes.number.isRequired,
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
