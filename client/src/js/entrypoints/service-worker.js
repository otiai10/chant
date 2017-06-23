/* eslint-env serviceworker */
/* eslint no-console:0 */
/* global firebase:false */
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

var configs = {};

const init = (_configs) => {
  configs = _configs;
  firebase.initializeApp(configs.firebase);
  const messaging = firebase.messaging();
  messaging.setBackgroundMessageHandler(() => {

  });
};

self.addEventListener('message', ev => {
  const data = JSON.parse(ev.data);
  console.log('[sw]', 'message', data);
  switch(data.action) {
  case 'init': return init(data.configs);
  default:
    console.log('DEFAULT??', data.action);
  }
});
