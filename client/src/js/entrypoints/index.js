/* global firebase:false */
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import store from '../store';
import {
  listenFirebaseMessages,
  listenFirebaseMembers,
  listenFirebaseStamps,
  listenConnectionStatus,
} from '../actions/remote';
listenFirebaseMessages(store.dispatch);
listenFirebaseMembers(store.dispatch);
listenFirebaseStamps(store.dispatch);
listenConnectionStatus(/* store.dispatch */);

// onfocus
window.onfocus = () => store.dispatch({type:'UNREAD_RESET'});

import App from '../Containers/app';
render(
  <Provider store={store}><App /></Provider>,
  document.querySelector('main#app')
);

// {{{ TODO: Refactor
chant.device = {name: navigator.userAgent.indexOf('Firefox') < 0 ? 'chrome' : 'firefox'};
// }}}

// {{{ TODO: Refactor
setTimeout(() => {
  chant.firebase.database().ref(`/members/${chant.user.id}/timezone`).update({
    name:   Intl.DateTimeFormat().resolvedOptions().timeZone,
    offset: (new Date()).getTimezoneOffset(),
  });
});
// }}}

// Register Customized ServiceWorker
navigator.serviceWorker.getRegistration().then(reg => {
  return reg ? Promise.resolve(reg) : navigator.serviceWorker.register('/sw.js', {scope:'/'});
}).then(reg => {
  // FIXME: It's not good to reference "firebase" here ;(
  firebase.messaging().useServiceWorker(reg);
  return navigator.serviceWorker.ready;
}).then(() => {
  return new Promise(resolve => setTimeout(resolve, 2000)); // XXX
}).then(() => {
  var chan = new MessageChannel(); chan.port1.onmessage = () => {};
  return window.navigator.serviceWorker.controller.postMessage(JSON.stringify({action:'init',configs:chant.configs}));
});
