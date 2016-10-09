/* global chant:false, goog:false */
import React, {Component} from "react";
import ReactDOM from "react-dom";

// redux storeをつくる

// channelのonmessageでactionを発行するactioncreatorをつくる
(() => {
    let channel = new goog.appengine.Channel(chant.channeltoken);
    let socket = channel.open();
    socket.onmessage = (ev) => {
        window.console.log(ev);
        const li = document.createElement("li");
        li.innerHTML = ev.data;
        document.querySelector("#messages").appendChild(li);
    };
})();

class Foo extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
          <div>
            <img src={chant.myself.profile_image_url} />
            <div>
              <ol id="messages">
                <li><input type="text" id="message" onKeyDown={this.onKeyDown.bind(this)} /></li>
              </ol>
            </div>
          </div>
        );
    }
    onKeyDown(ev) {
        const ENTER = 13;
        if (ev.which != ENTER || !document.querySelector("#message").value) return;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/message", true);
        xhr.send(JSON.stringify({message: document.querySelector("#message").value}));
    }
}

ReactDOM.render(
  <Foo />,
  document.querySelector("main")
);
