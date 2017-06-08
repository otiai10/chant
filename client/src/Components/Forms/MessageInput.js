import React, {Component} from 'react';
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
        cols={140} rows={4}
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
    }
  }
}
