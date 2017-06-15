import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Icon from '../../Icon';
import Content from '../Content';

import {upsertStamp} from '../../../actions/remote';
import {_prettyTime} from './utils';

@connect(null, {
  upsertStamp,
})
export default class DefaultEntry extends Component {
  render() {
    const {user, text} = this.props;
    return (
      <div className="entry">
        <div className="row actions">
          <div className="action timestamp" onClick={this._onQuote.bind(this)}>
            {_prettyTime(this.props.time)}
          </div>
          <div className="action totsuzenize" onClick={this._onTotsuzenize.bind(this)}>
            Totsuzenize
          </div>
          <div className="action stamprize" onClick={this._onStamprize.bind(this)}>
            Stamprize
          </div>
        </div>
        <div className="row contents">
          <div className="icon-box">
            <Icon user={user} />
          </div>
          <div className="contents-box">
            <Content text={text} />
          </div>
        </div>
      </div>
    );
  }
  _onQuote() {

  }
  _onStamprize() {
    this.props.upsertStamp(this.props.text.trim());
  }
  _onTotsuzenize() {
    fetch(`/api/messages/${this.props.id}/totsuzenize`, {
      method: 'POST',
      body: JSON.stringify({text:this.props.text}),
      credentials: 'include',
    });
  }
  // TODO: Refactor by using `message.type`
  _getActions() {
    let actions = [
      <div key={0} className="action timestamp"
        onClick={this.props.stamp ? this._onQuote.bind(this) : () => {}}
      >
        {this._prettyTime()}
      </div>
    ];
    if (!this.props.stamp) return actions;
    return actions.concat([
      <div key={1} className="action totsuzenize"
        onClick={this._onTotsuzenize.bind(this)}>Totsuzenize</div>,
      <div key={2} className="action stamprize"
        onClick={this._onStamprize.bind(this)}>Stamprize</div>
    ]);
  }
  static propTypes = {
    id:   PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    time: PropTypes.number.isRequired,
    // {{{ TODO: Refactor
    stamp: PropTypes.object,
    // }}}
    upsertStamp: PropTypes.func,
  }
}
