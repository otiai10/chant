import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {postMessage,upsertStamp} from '../../actions/remote';

@connect(null, {
  postMessage,
  upsertStamp,
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
      <div id="message-input-container">
        <textarea
          id="message-input"
          ref={ref => this.ref = ref}
          cols={140} rows={2}
          value={this.state.text}
          onChange={this.onChange.bind(this)}
          onKeyDown={this.onKeyDown.bind(this)}
          placeholder="Shift + ⏎ for newline"
        />
        <div className="actions">
          <div>
            <button onClick={this.onTotsuzenizeClick.bind(this)}>Totsuzenize</button>
          </div>
          <div>
            <button onClick={this.onStamprizeClick.bind(this)}>Stamprize</button>
          </div>
        </div>
      </div>
    );
  }
  onChange(ev) {
    this.setState({text: ev.target.value});
  }
  onKeyDown(ev) {
    const ENTER = 13;
    const {which, shiftKey, ctrlKey} = ev;
    if (which == ENTER && !(shiftKey || ctrlKey)) {
      if (this.state.text.trim().length == 0) return ev.preventDefault();
      this.props.postMessage(this.state.text);
      this.setState({text:''});
      return ev.preventDefault();
    }
  }
  onTotsuzenizeClick(ev) {
    ev.preventDefault();
    const text = this.state.text.trim();
    if (text.length == 0) return;
    fetch('/api/messages/text/totsuzenize', {
      method: 'POST',
      body: JSON.stringify({text:this.state.text}),
      credentials: 'include',
    });
    this.setState({text:''}, () => this.ref.focus());
  }
  onStamprizeClick(ev) {
    ev.preventDefault();
    const text = this.state.text.trim();
    if (text.length == 0) return;
    upsertStamp(text);
    this.setState({text:''}, () => this.ref.focus());
  }
  static propTypes = {
    postMessage: PropTypes.func.isRequired,
    upsertStamp: PropTypes.func.isRequired,
  }
}
