import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

import store from "./store";

import App from './containers/app';

import {startListening} from './actions/remote';
startListening(store.dispatch);

render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.querySelector('main')
);
