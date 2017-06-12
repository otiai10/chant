import 'firebase/auth';
import 'firebase/database';

const day = 24*60*60*1000;

export function startListeningFirebase(dispatch, duration = 1*day) {
  dispatch({type: 'MESSAGE_LOADING'});
  const messages = chant.firebase.database().ref('messages');
  messages.off();
  messages.orderByChild('time').startAt(Date.now() - duration).on('value', snapshot => {
    dispatch({
      type: 'REMOTE_MESSAGE',
      data: snapshot.val() || [],
    });
  });
  dispatch({type: 'MEMBER_LOADING'});
  const members = chant.firebase.database().ref('members');
  members.off();
  members.on('value', snapshot => {
    dispatch({
      type: 'REMOTE_MEMBER',
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
