import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Icon from '../../Icon';

import entryactions from './entryactions';

import {appendText}  from '../../../actions/inputs';

@connect(null, {
  appendText,
})
export default class DefaultEntry extends Component {
  render() {
    const {user} = this.props;
    const {map, mask, mesh} = this.props.params;
    return (
      <div className="entry">
        <div className="row actions">
          <entryactions.Timestamp   onClick={this._onQuote.bind(this)} time={this.props.time}/>
        </div>
        <div className="row contents">
          <div className="icon-box">
            <Icon user={user} />
          </div>
          <div className="contents-box">
            <div className="amesh-container">
              <img className="amesh-map"  src={map} />
              <img className="amesh-mask" src={mask} />
              <img className="amesh-mesh" src={mesh} />
            </div>
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
    user: PropTypes.object.isRequired,
    time: PropTypes.number.isRequired,
    params: PropTypes.shape({
      map:  PropTypes.string.isRequired,
      mask: PropTypes.string.isRequired,
      mesh: PropTypes.string.isRequired,
    }).isRequired,
    appendText:  PropTypes.func,
  }
}
