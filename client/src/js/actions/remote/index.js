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

  // To publish that this browser disconnected
  const connections = chant.firebase.database().ref(`members/${chant.user.id}/browsers/${chant.user.browser}`);
  connections.onDisconnect().remove();
}

export function listenFirebaseStamps(dispatch) {
  chant.firebase.database().ref('stamps').on('value', snapshot => {
    dispatch({
      type: 'REMOTE_STAMP',
      data: snapshot.val() || {},
    });
  });
}

export function postMessage(text, user = chant.user) {
  const key = chant.firebase.database().ref('messages').push().key;
  chant.firebase.database().ref(`messages/${key}`).set({
    text,
    user,
    time: Date.now(),
  });
  return {type:'IGNORE'};
}

export function useStamp(stamp) {
  postMessage(stamp.text);
  const id = encodeURIComponent(stamp.text);
  chant.firebase.database().ref(`stamps/${id}`).update({used:Date.now()});
  return {type:'IGNORE'};
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
