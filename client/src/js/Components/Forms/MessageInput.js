import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import cn from 'classnames';

import {postMessage,upsertStamp} from '../../actions/remote';
import {
  changeText,
  pushTextHistory,
  popTextHistory,
} from '../../actions/inputs';
import {api_imageUpload} from '../../actions/api';

@connect(({inputs}) => ({inputs}), {
  postMessage,
  upsertStamp,
  changeText,
  api_imageUpload,
  pushTextHistory,
  popTextHistory,
})
export default class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hold: false,
      dragover: false,
    };
  }
  render() {
    const {inputs} = this.props;
    return (
      <div id="message-input-container" style={this.getStyle()}>
        <div
          className={cn({dragover: this.state.dragover})}
          onMouseDown={this.onMouseDown.bind(this)}
          onMouseUp={this.onMouseUp.bind(this)}
          onMouseOut={this.onMouseOut.bind(this)}
          onDragOver={this.onFileDragOver.bind(this)}
          onDragLeave={this.onFileDragLeave.bind(this)}
          onDrop={this.onFileDrop.bind(this)}
        >
          <textarea
            id="message-input"
            ref={ref => this.ref = ref}
            cols={140} rows={2}
            value={inputs.text}
            onChange={this.onChange.bind(this)}
            onKeyDown={this.onKeyDown.bind(this)}
            placeholder="Shift + ⏎ for newline"
          />
        </div>
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
  componentWillReceiveProps(next) {
    if (next.inputs.text != this.props.inputs.text) this.ref.focus();
  }
  onChange(ev) {
    this.props.changeText(ev.target.value);
  }
  onFileDragOver(/* ev */) {
    this.setState({dragover: true});
  }
  onFileDragLeave(/* ev */) {
    this.setState({dragover: false});
  }
  onFileDrop(ev) {
    this.setState({dragover: false});
    ev.preventDefault();
    ev.stopPropagation();
    const file = ev.nativeEvent.dataTransfer.files[0];
    if (!file) return; // TODO: show alert
    this.props.api_imageUpload(file);
  }
  onKeyDown(ev) {
    const ENTER = 13, UP = 38;
    const {which, shiftKey, ctrlKey} = ev;
    if (ev.target.selectionStart == 0 && which == UP) {
      return this.props.popTextHistory();
    }
    if (which == ENTER && !(shiftKey || ctrlKey)) {
      if (this.props.inputs.text.trim().length == 0) return ev.preventDefault();
      this.props.postMessage(this.props.inputs.text);
      this.props.pushTextHistory(this.props.inputs.text);
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
    upsertStamp({text, user: chant.user});
    this.props.changeText('');
    this.ref.focus();
  }
  // {{{ TODO: Separate
  onMouseDown() {
    this.setState({hold:true});
    setTimeout(() => {
      const hold = this.state.hold;
      this.setState({hold:false});
      if (hold) this.triggerFileSelect();
    }, 2000);
  }
  onMouseUp() {
    this.setState({hold:false});
  }
  onMouseOut() {
    this.setState({hold:false});
  }
  // }}}

  getStyle() {
    const {inputs} = this.props;
    if (!inputs.preview.url) return {};
    return {backgroundImage: `url(${inputs.preview.url})`, backgroundSize: 'contain', backgroundRepeat:'no-repeat'};
  }

  triggerFileSelect() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    new Promise((resolve, reject) => {
      input.addEventListener('change', ev => ev.target.files.length ? resolve(ev.target.files[0]) : reject());
    }).then(this.props.api_imageUpload);
    input.click();
  }

  static propTypes = {
    inputs: PropTypes.shape({
      text: PropTypes.string.isRequired,
    }).isRequired,
    postMessage: PropTypes.func.isRequired,
    upsertStamp: PropTypes.func.isRequired,
    changeText:  PropTypes.func.isRequired,
    popTextHistory:  PropTypes.func.isRequired,
    pushTextHistory: PropTypes.func.isRequired,
    api_imageUpload: PropTypes.func.isRequired,
  }
}
