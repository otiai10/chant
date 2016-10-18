/* global goog:false */

export function initSocket(store, chant) {
  let channel = new goog.appengine.Channel(chant.channeltoken);
  let socket = channel.open();
  socket.onmessage = (ev) => {
    store.dispatch({
      type: "SOCKET_ON_MESSAGE",
      payload: JSON.parse(ev.data)
    });
  };
}

export function sendMessage(message) {
  // if (ev.which != ENTER || !document.querySelector("#message").value) return;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/message", true);
  xhr.send(JSON.stringify({ text: message }));
  return {
    type: "SOCKET_SEND_MESSAGE"
  };
  // return (dispatch) => {
  //   dispatch({
  //     type: "SOCKET_SEND_MESSAGE",
  //     payload: {message}
  //   });
  // };
}
