import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {postMessage,upsertStamp} from '../../actions/remote';
import {changeText} from '../../actions/inputs';

@connect(({inputs}) => ({inputs}), {
  postMessage,
  upsertStamp,
  changeText,
})
export default class MessageInput extends Component {
  render() {
    const {inputs} = this.props;
    return (
      <div id="message-input-container">
        <textarea
          id="message-input"
          ref={ref => this.ref = ref}
          cols={140} rows={2}
          value={inputs.text}
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
    this.props.changeText(ev.target.value);
  }
  onKeyDown(ev) {
    const ENTER = 13;
    const {which, shiftKey, ctrlKey} = ev;
    if (which == ENTER && !(shiftKey || ctrlKey)) {
      if (this.props.inputs.text.trim().length == 0) return ev.preventDefault();
      this.props.postMessage(this.props.inputs.text);
      this.props.changeText('');
      return ev.preventDefault();
    }
  }
  onTotsuzenizeClick(ev) {
    ev.preventDefault();
    const text = this.props.inputs.text.trim();
    if (text.length == 0) return;
    fetch('/api/messages/text/totsuzenize', {
      method: 'POST',
      body: JSON.stringify({text:this.props.inputs.text}),
      credentials: 'include',
    });
    this.props.changeText('');
    this.ref.focus();
  }
  onStamprizeClick(ev) {
    ev.preventDefault();
    const text = this.props.inputs.text.trim();
    if (text.length == 0) return;
    upsertStamp(text);
    this.props.changeText('');
    this.ref.focus();
  }
  static propTypes = {
    inputs: PropTypes.shape({
      text: PropTypes.string.isRequired,
    }).isRequired,
    postMessage: PropTypes.func.isRequired,
    upsertStamp: PropTypes.func.isRequired,
    changeText:  PropTypes.func.isRequired,
  }
}
