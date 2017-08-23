import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Icon from '../../Icon';
import Content from '../Content';

import entryactions from './entryactions';
import {_prettyTime} from './utils';

export default class StamprizeEntry extends Component {
  render() {
    const {user, text, stamp} = this.props;
    return (
      <div className="entry">
        <div className="row actions">
          <entryactions.Timestamp time={this.props.time}/>
        </div>
        <div className="row contents">
          <div className="icon-box">
            <Icon user={user} />
          </div>
          <div className="contents-box">
            <Content text={text} />
            <blockquote>
              <div className="entry">
                <div className="row actions">
                  <div className="action timestamp">{_prettyTime(stamp.time)}</div>
                </div>
                <div className="row contents">
                  <div className="icon-box">
                    <Icon user={stamp.user} />
                  </div>
                  <div className="contents-box">
                    <Content text={stamp.text} />
                  </div>
                </div>
              </div>
            </blockquote>
          </div>
        </div>
      </div>
    );
  }
  static propTypes = {
    text:  PropTypes.string.isRequired,
    user:  PropTypes.object.isRequired,
    time:  PropTypes.number.isRequired,
    stamp: PropTypes.object.isRequired,
  }
}
