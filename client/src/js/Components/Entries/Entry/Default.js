import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Icon from '../../Icon';
import Content from '../Content';

import {upsertStamp, pinEntry} from '../../../actions/remote';
import {appendText}  from '../../../actions/inputs';

import entryactions from './entryactions';

@connect(null, {
  upsertStamp,
  appendText,
  pinEntry,
})
export default class DefaultEntry extends Component {
  render() {
    const {user, text} = this.props;
    return (
      <div className="entry">
        <div className="row actions">
          <entryactions.Timestamp   onClick={this._onQuote.bind(this)} time={this.props.time}/>
          <entryactions.Totsuzenize onClick={this._onTotsuzenize.bind(this)}/>
          <entryactions.Stamprize   onClick={this._onStamprize.bind(this)}/>
          <entryactions.Pin         onClick={this._onPinned.bind(this)} />
        </div>
        <div className="row contents">
          <div className="icon-box">
            <Icon user={user} onClick={() => this.props.appendText('@' + this.props.user.name + ' ')} />
          </div>
          <div className="contents-box">
            <Content text={text} />
          </div>
        </div>
      </div>
    );
  }
  _onQuote() {
    this.props.appendText(`[quote:${this.props.id}]`, true);
  }
  _onStamprize() {
    this.props.upsertStamp({
      id: this.props.id,     text: this.props.text,
      user: this.props.user, time: this.props.time,
    });
  }
  _onPinned() {
    var pinned = {
      ref:  this.props.id, // This is ref, not "pin" itself
      text: this.props.text,
      user: {...this.props.user},
      time: this.props.time,
    };
    this.props.pinEntry(pinned);
  }
  _onTotsuzenize() {
    fetch(`/api/messages/${this.props.id}/totsuzenize`, {
      method: 'POST',
      body: JSON.stringify({text:this.props.text}),
      credentials: 'include',
    });
  }
  static propTypes = {
    id:   PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    time: PropTypes.number.isRequired,
    appendText:  PropTypes.func,
    upsertStamp: PropTypes.func,
    pinEntry:    PropTypes.func,
  }
}
