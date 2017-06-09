import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {postMessage} from '../../actions/remote';

@connect(null, {
  postMessage,
})
export default class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }
  render() {
    return (
      <textarea
        id="message-input"
        ref={ref => this.ref = ref}
        cols={140} rows={2}
        value={this.state.text}
        onChange={this.onChange.bind(this)}
        onKeyDown={this.onKeyDown.bind(this)}
      />
    );
  }
  onChange(ev) {
    this.setState({text: ev.target.value});
  }
  onKeyDown(ev) {
    const ENTER = 13;
    if (ev.which == ENTER) {
      this.props.postMessage(this.state.text);
      this.setState({text:''});
      return ev.preventDefault();
    }
  }
  static propTypes = {
    postMessage: PropTypes.func.isRequired,
  }
}
