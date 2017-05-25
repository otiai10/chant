import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import store from '../store';
import {startListeningFirebase} from '../actions/remote';
startListeningFirebase(store.dispatch);

import App from '../Containers/app';
render(
  <Provider store={store}><App /></Provider>,
  document.querySelector('main#app')
);
