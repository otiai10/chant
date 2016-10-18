import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as SocketActions from "../actions/SocketActions";

class App extends Component {
  render() {
    return (
      <div>
        <h1>CHANTしたい</h1>
        <button onClick={this.onClick.bind(this)}>押して</button>
        <ul>
        {this.props.messages.map((message, i) => {
          return <li key={i}>{JSON.stringify(message)}</li>;
        })}
        </ul>
      </div>
    );
  }
  onClick() {
    this.props.sendMessage("Hello!!");
  }
  static propTypes = {
    sendMessage: PropTypes.func,
    messages: PropTypes.array
  }
}

export default connect(
  (state) => {
    return {
      messages: state.messages,
    };
  },
  (dispatch) => {
    return {
      ...bindActionCreators(SocketActions, dispatch),
    };
  }
)(App);
