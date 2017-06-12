import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Loading from '../Loading';

@connect(({loading}) => loading)
export default class LoadMore extends Component {
  render() {
    return <div className="justify">{this.getContent()}</div>;
  }
  getContent() {
    if (this.props.message) return <Loading />;
    else return <span className="load-more">load more</span>;
  }
  static propTypes = {
    message: PropTypes.bool.isRequired,
    member:  PropTypes.bool.isRequired,
  }
}
