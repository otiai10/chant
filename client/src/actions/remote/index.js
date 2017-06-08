import 'firebase/auth';
import 'firebase/database';

export function startListeningFirebase(dispatch) {
  chant.firebase.database().ref('messages').on('value', snapshot => {
    dispatch({
      type: 'REMOTE_MESSAGE',
      data: snapshot.val() || [],
    });
  });
  chant.firebase.database().ref('members').on('value', snapshot => {
    dispatch({
      type: 'REMOTE_MEMBER',
      data: snapshot.val() || [],
    });
  });
}

export function postMessage(text) {
  const key = chant.firebase.database().ref('messages').push().key;
  chant.firebase.database().ref(`messages/${key}`).set({
    text: text,
    time: Date.now(),
  });
  return {type:'IGNORE'};
}
