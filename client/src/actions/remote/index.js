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
