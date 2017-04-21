import * as firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';

import config from "./firebase-config";
var _app = firebase.initializeApp(config);

export function startListening(dispatch) {
  _app.database().ref('messages').on('value', snapshot => {
    dispatch({
      type: "SYNC_MESSAGE",
      snapshot: snapshot.val() || [],
    });
  })
  // setInterval(() => {
  //   const m = _app.database().ref('messages').push();
  //   m.set({
  //     text: "やあやあ！",
  //     ts: Date.now(),
  //   });
  // }, 2000);
}
