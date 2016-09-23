var chant = chant || {};

sendMessage = function(path, data) {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', path, true);
  xhr.send(JSON.stringify(data));
};

window.onload = () => {
  let channel = new goog.appengine.Channel(chant.token);
  let socket = channel.open();
  socket.onmessage = (ev) => {
    var data;
    try {
      data = JSON.parse(ev.data);
    } catch (err) {
      return console.error("JSON.parse", err);
    }
    let li = document.createElement('li');
    li.innerHTML = data.message;
    document.querySelector('#messages').appendChild(li);
  }
  const ENTER_KEY = 13;
  document.querySelector('#message').addEventListener('keydown', (ev) => {
    if (ev.which != ENTER_KEY) return;
    let message = document.querySelector('#message').value;
    if (!message) return;
    sendMessage('/message', {message});
    document.querySelector('#message').value = "";
  })
}
