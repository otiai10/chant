import 'firebase/auth';
import 'firebase/database';

export function startListeningFirebase(dispatch) {
  chant.firebase.database().ref('messages').on('value', snapshot => {
    dispatch({
      type: 'REMOTE_MESSAGE',
      data: snapshot.val() || [],
    });
  });
}
