import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Icon from '../../Icon';
import {_prettyTime} from './utils';

class UserTimezone extends Component {
  render() {
    const {name, date, zone} = this.props;
    return (
      <div className="user-timezone">
        <div className="user-timezone-username">{name}</div>
        <div className="user-timezone-contents">
          <div className="name">{date}</div>
          <div className="zone">{zone}</div>
        </div>
      </div>
    );
  }
  static propTypes = {
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    zone: PropTypes.string.isRequired,
  }
}

export default class Timezone extends Component {
  render() {
    const {time, user, params} = this.props;
    return (
      <div className="entry">
        <div className="row actions">
          <div className="action timestamp">{_prettyTime(time)}</div>
        </div>
        <div className="row contents">
          <div className="icon-box">
            <Icon user={user} />
          </div>
          <div className="contents-box">
            <div className="timezone">
              {Object.keys(params).map(name => <UserTimezone key={name} name={name} {...params[name]} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }
  static propTypes = {
    user: PropTypes.object.isRequired, // TODO: shape
    time: PropTypes.number.isRequired, // TODO: shape
    params: PropTypes.object.isRequired, // TODO: shape
  }
}
