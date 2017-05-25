
export function startListeningFirebase(dispatch) {
  setInterval(() => {
    dispatch({
      type: 'REMOTE_MESSAGE',
      text: `hoge fuga piyo!! ${Date.now()}`,
    });
  }, 10 * 1000);
}
