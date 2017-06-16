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
  static propTypes = {
    id:   PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    time: PropTypes.number.isRequired,
    appendText:  PropTypes.func,
    upsertStamp: PropTypes.func,
  }
}
