import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Icon from '../../Icon';
import Timestamp from './entryactions/timestamp';

import {appendText} from '../../../actions/inputs';
import {deletePinnedEntry} from '../../../actions/remote';

class PinnedEntry extends Component {
  render() {
    return (
      <div className="pinned-entry row">
        <div className="pinned-prof">
          <Icon user={this.props.user} />
        </div>
        <div className="pinned-contents">
          <Timestamp time={this.props.time} onClick={() => this.props.appendText(`[pinned:${this.props.id}]`, true)} />
          <div>{this.props.text}</div>
        </div>
      </div>
    );
  }
  static propTypes = {
    user: PropTypes.object.isRequired,
    time: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    id:   PropTypes.string.isRequired,
    appendText: PropTypes.func.isRequired,
  }
}

class PinnedEntryAction extends Component {
  render() {
    return (
      <div className="pinned-by row">
        <div onClick={() => this.props.deletePinnedEntry(this.props.id)}><i className="fa fa-trash"/></div>
        <div>pinned by <img className="pinned-by-icon" src={this.props.by.image_url} /></div>
      </div>
    );
  }
  static propTypes = {
    by: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    deletePinnedEntry: PropTypes.func,
  };
}

@connect(null, {
  appendText,
  deletePinnedEntry,
})
export default class Pinned extends Component {
  render() {
    const {id, by, entry} = this.props;
    return (
      <div className="pinned">
        <PinnedEntry {...entry}    id={id} appendText={this.props.appendText}/>
        <PinnedEntryAction by={by} id={id} deletePinnedEntry={this.props.deletePinnedEntry} />
      </div>
    );
  }
  static propTypes = {
    by:    PropTypes.object.isRequired,
    entry: PropTypes.object.isRequired,
    id:    PropTypes.string.isRequired,
    detail:PropTypes.object,
    appendText:        PropTypes.func.isRequired,
    deletePinnedEntry: PropTypes.func.isRequired,
  }
}
