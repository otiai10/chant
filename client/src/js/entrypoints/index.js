import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import store from '../store';
import {
  listenFirebaseMessages,
  listenFirebaseMembers,
  listenFirebaseStamps,
} from '../actions/remote';
listenFirebaseMessages(store.dispatch);
listenFirebaseMembers(store.dispatch);
listenFirebaseStamps(store.dispatch);

import App from '../Containers/app';
render(
  <Provider store={store}><App /></Provider>,
  document.querySelector('main#app')
);
