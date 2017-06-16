import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Loading from '../Loading';

// {{{ TODO: Refactor
import {listenFirebaseMessages} from '../../actions/remote';
import store from '../../store';
// }}}

@connect(({loading}) => loading)
export default class LoadMore extends Component {
  render() {
    return <div className="justify">{this.getContent()}</div>;
  }
  getContent() {
    if (this.props.message) return <Loading />;
    else return <span className="load-more" onClick={this.onClickLoadMore.bind(this)}>load more till {this.props.days + 1} days ago</span>;
  }
  onClickLoadMore() {
    // TODO: Refactor
    listenFirebaseMessages(store.dispatch, this.props.days + 1);
  }
  static propTypes = {
    message: PropTypes.bool.isRequired,
    member:  PropTypes.bool.isRequired,
    days:    PropTypes.number.isRequired,
  }
}
