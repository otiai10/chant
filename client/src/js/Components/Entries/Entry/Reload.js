import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Icon from '../../Icon';
import Content from '../Content';

import entryactions from './entryactions';

import {appendText}  from '../../../actions/inputs';

@connect(null, {})
export default class ReloadRequestEntry extends Component {
  constructor(props) {
    super(props);
    const params = this.props.params || {};
    this.required = parseInt(params["client-timestamp"] || 0);
    this.current = parseInt(BUILD_TIMESTAMP || 0);
  }
  componentDidMount() {
    if (this.props._beread) return;
    if (!this.required || !this.current) return;
    if (this.current >= this.required) return;
    setTimeout(() => {
      if (window.confirm(this.confirmText())) location.reload();
    }, 1000);
  }
  render() {
    const {user} = this.props;
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
            <Content text={this.text()} />
          </div>
        </div>
      </div>
    );
  }
  text() {
    const {text} = this.props;
    if (this.current >= this.required) {
      return text + '\nBut your JavaScript is newer than requested version.';
    }
    console.log(this.current, this.required);
    return text + `\nRequested version of JavaScript has been built at ${(new Date(this.required)).toISOString()}`;
  }
  confirmText() {
    return this.props.text + "\n" + "Reload?";
  }
  static propTypes = {
    id:   PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    time: PropTypes.number.isRequired,
    params: PropTypes.shape({
      "client-timestamp": PropTypes.string,
    }),
    _beread: PropTypes.bool,
  }
}
