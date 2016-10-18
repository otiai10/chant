/* global chant:false */
import React from "react";
import ReactDOM from "react-dom";

// https://github.com/callemall/material-ui/issues/4670
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import {createStore, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk";

import reducers from "../reducers";

let store = createStore(
  reducers,
  applyMiddleware(thunk)
);

import {initSocket} from "../actions/SocketActions";
initSocket(store, chant);

import App from "../components/app";

ReactDOM.render(
  <MuiThemeProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.querySelector("main")
);
