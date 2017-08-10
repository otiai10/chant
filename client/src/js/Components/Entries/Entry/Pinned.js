import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Icon from '../../Icon';
import Timestamp from './entryactions/timestamp';

class PinnedEntry extends Component {
  render() {
    return (
      <div className="pinned-entry row">
        <div>
          <Icon user={this.props.user} />
        </div>
        <div>
          <Timestamp time={this.props.time} />
          <div>{this.props.text}</div>
        </div>
      </div>
    );
  }
  static propTypes = {
    user: PropTypes.object.isRequired,
    time: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
  }
}

class PinnedEntryAction extends Component {
  render() {
    return (
      <div className="pinned-by row">
        <div><i className="fa fa-trash" /></div>
        <div>pinned by <img className="pinned-by-icon" src={this.props.by.image_url} /></div>
      </div>
    );
  }
  static propTypes = {
    by: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
  };
}

export default class Pinned extends Component {
  render() {
    const {id, by, entry} = this.props;
    return (
      <div className="pinned">
        <PinnedEntry {...entry} />
        <PinnedEntryAction by={by} id={id} />
      </div>
    );
  }
  static propTypes = {
    by:    PropTypes.object.isRequired,
    entry: PropTypes.object.isRequired,
    id:    PropTypes.string.isRequired,
    detail:PropTypes.object,
  }
}
