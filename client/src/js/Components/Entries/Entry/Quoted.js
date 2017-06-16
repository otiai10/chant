import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Icon from '../../Icon';
import Content from '../Content';

import {appendText}  from '../../../actions/inputs';
import {_prettyTime} from './utils';

@connect(null, {
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
    this.props.appendText(`[quote:${this.props.id}]`, true);
  }
  static propTypes = {
    id:   PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    time: PropTypes.number.isRequired,
    appendText:  PropTypes.func,
  }
}
