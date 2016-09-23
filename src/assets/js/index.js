sendMessage = function(path) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', path, true);
  xhr.send();
};

window.onload = () => {
  var channel = new goog.appengine.Channel(chant.token);
  var socket = channel.open();
  socket.onopen = (ev) => {
    sendMessage("/hello");
  };
  socket.onmessage = (ev) => {
    console.log(ev);
    debugger;
  }
}
