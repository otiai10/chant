import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Icon from '../Icon';
import Content from './Content';

@connect(null, {

})
export default class Entry extends Component {
  render() {
    const {user, text} = this.props;
    return (
      <div className="entry">
        <div className="row actions">
          <div className="action timestamp"
            onClick={this._onQuote.bind(this)}>{this._prettyTime()}</div>
          <div className="action totsuzenize"
            onClick={this._onTotsuzenize.bind(this)}>Totsuzenize</div>
          <div className="action stamprize"
            onClick={this._onStamprize.bind(this)}>Stamprize</div>
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
  _prettyTime() {
    const d = new Date(this.props.time);
    return [
      d.getFullYear(),
      this._zeropadding(d.getMonth()+1),
      this._zeropadding(d.getDate())
    ].join('/') + ' ' + [
      this._zeropadding(d.getHours()),
      this._zeropadding(d.getMinutes()),
      this._zeropadding(d.getSeconds())
    ].join(':');
  }
  _zeropadding(src, digit = 2, padding = '0') {
    for (let i = 0; i < digit; i++) {
      src = padding + src;
    }
    return src.slice(-1 * digit);
  }
  _onQuote() {

  }
  _onStamprize() {

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
  }
}