import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Pinned from './Pinned';
import Icon from '../../Icon';

import entryactions from './entryactions';

export default class DefaultEntry extends Component {
  render() {
    const {user} = this.props;
    const {pins} = this.props.params;
    return (
      <div className="entry">
        <div className="row actions">
          <entryactions.Timestamp  time={this.props.time}/>
        </div>
        <div className="row contents">
          <div className="icon-box">
            <Icon user={user} />
          </div>
          <div className="contents-box">
            {pins.map(pin => <Pinned key={pin.id} {...pin} />)}
          </div>
        </div>
      </div>
    );
  }
  static propTypes = {
    id:   PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    time: PropTypes.number.isRequired,
    params: PropTypes.shape({
      pins: PropTypes.array.isRequired,
    }).isRequired,
  }
}
