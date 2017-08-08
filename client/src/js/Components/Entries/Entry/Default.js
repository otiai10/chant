import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Icon from '../../Icon';
import Content from '../Content';

import {upsertStamp} from '../../../actions/remote';
import {appendText}  from '../../../actions/inputs';
import {_prettyTime} from './utils';

@connect(null, {
  upsertStamp,
  appendText,
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
  }
}
