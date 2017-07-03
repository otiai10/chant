/* global firebase:false */
import 'firebase/auth';
import 'firebase/database';

const day = 24*60*60*1000;

export function listenFirebaseMessages(dispatch, days = 1) {
  dispatch({type: 'MESSAGE_LOADING'});
  const messages = chant.firebase.database().ref('messages');
  messages.off();
  messages.orderByChild('time').startAt(Date.now() - days * day).on('value', snapshot => {
    dispatch({
      type: 'REMOTE_MESSAGE',
      data: snapshot.val() || [],
    });
  });
  dispatch({type: 'LOADING_DAYS', data: days});
}

export function listenFirebaseMembers(dispatch) {
  dispatch({type: 'MEMBER_LOADING'});
  chant.firebase.database().ref('members').on('value', snapshot => {
    dispatch({
      type: 'REMOTE_MEMBER',
      data: snapshot.val() || {},
    });
  });
}

export function listenConnectionStatus(/* dispatch */) {
  // To publish that this browser disconnected
  chant.firebase.database().ref('.info/connected').on('value', snapshot => {
    const browser = chant.firebase.database().ref(`members/${chant.user.id}/browsers/${chant.user.browser}`);
    if (snapshot.val()) {
      browser.set(true); // Re-connection
      chant.firebase.database().ref(`members/${chant.user.id}`).update({name:chant.user.name, image_url:chant.user.image_url});
    }
    browser.onDisconnect().remove(); // Remove anyway on disconnected.
  });
}

export function listenFirebaseStamps(dispatch) {
  chant.firebase.database().ref('stamps').orderByChild('used').limitToLast(20).on('value', snapshot => {
    const dict = snapshot.val() || {};
    const newlist = Object.keys(dict).map(key => dict[key]).sort((p, n) => p.used < n.used ? 1 : -1);
    dispatch({
      type: 'REMOTE_STAMP',
      data: newlist,
    });
  });
}

function __hook_Mention(text, getState, user = chant.user) {
  const r = new RegExp('[ 　]+');
  const members = Object.keys(getState().members).map(id => getState().members[id]);
  const targets = text.split(r).filter(t => /@[_a-zA-Z0-9]+/.test(t)).map(t => t.replace(/^@/, '')).map(name => {
    return members.filter(member => member.name == name).pop();
  }).filter(m => !!m);
  if (targets.length == 0) return;
  fetch('/api/messages/notification', {method:'POST', credentials:'include', body:JSON.stringify({targets, sender: user, text})});
}

function __hook_SlashCommand(text, user = chant.user) {
  const command = text.split(new RegExp('[ 　]+'))[0];
  if (!chant.configs.commands.some(cmd => cmd == command)) return;
  fetch('/api/messages/slashcommand', {method:'POST', credentials:'include', body:JSON.stringify({command, sender: user, text})});
}

export function postMessage(text, user = chant.user) {
  return (dispatch, getState) => {
    const key = chant.firebase.database().ref('messages').push().key;
    chant.firebase.database().ref(`messages/${key}`).set({
      text,
      user,
      time: Date.now(),
    });
    __hook_SlashCommand(text);
    __hook_Mention(text, getState, user);
    dispatch({type:'IGNORE'});
  };
}

export function useStamp(stamp) {
  const id = encodeURIComponent(stamp.text);
  chant.firebase.database().ref(`stamps/${id}`).update({used:Date.now()});
  return postMessage(stamp.text);
}

export function upsertStamp(text, user = chant.user) {
  text = text.trim();
  const id = encodeURIComponent(text);
  const target = {text, user, time: Date.now(), used: Date.now()};
  chant.firebase.database().ref(`stamps/${id}`).set(target);
  const key = chant.firebase.database().ref('messages').push().key;
  chant.firebase.database().ref(`messages/${key}`).set({
    type: 'STAMPRIZE',
    text: 'stamprize:', stamp: target,
    user, time: Date.now(),
  });
  return {type:'IGNORE'};
}

export function toggleDeviceNotification(user = chant.user) {
  const db = chant.firebase.database();
  return (dispath) => {
    (new Promise(resolve => db.ref(`members/${user.id}`).once('value', snapshot => resolve(snapshot.val()))))
    .then(member => (member.notification && member.notification.devices) ? member.notification.devices[chant.device.name] : undefined)
    .then(device => device ? Promise.resolve(device) : Promise.reject())
    .then(() => db.ref(`members/${user.id}/notification/devices/${chant.device.name}`).remove())
    .catch(() => saveDeviceToken());
    dispath({type:'IGNORE'});
  };
}

export function saveDeviceToken(user = chant.user) {
  const messaging = firebase.messaging();
  messaging.requestPermission().then(() => {
    messaging.getToken().then(token => {
      chant.firebase.database().ref(`members/${user.id}/notification/devices/${chant.device.name}`).set({token,ts:Date.now()});
      return {type:'IGNORE'};
    });
  });
}
