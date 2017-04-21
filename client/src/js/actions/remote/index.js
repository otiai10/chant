
export function startListening(dispatch) {
  setInterval(() => {
    dispatch({
      type: "REMOTE_MESSAGE",
      text: `hoge fuga piyo!! ${Date.now()}`,
    })
  }, 1000);
}
