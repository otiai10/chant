var chant = chant || {};
chant.__socket = null;
/*
chant.socket = function(force) {
  this.retry += 500;
  if (chant.__socket !== null && chant.__socket.readyState > WebSocket.OPEN) {
    console.debug('chant.socket', '閉じてたのでforceする');
    force = true;
  }
  if (!chant.__socket || force) {
    chant.__socket = new WebSocket('ws://'+Config.server.host+'/websocket/room/socket?token=' + Config.room.token);
    chant.__socket.onerror = chant.__socket.onclose = function() {
      setTimeout(function(){
        chant.__socket = new WebSocket('ws://'+Config.server.host+'/websocket/room/socket?token=' + Config.room.token);
      }, this.retry);
    }.bind(this);
  }
  return chant.__socket;
};
*/

/**
 * おくるやつ
 * @param typ
 * @param value
 * @constructor
 */
chant.Send = function(/* string */typ/* string */, /* any */value) {
  if (typeof value.trim === 'function' && value.trim().length === 0) {
    return;// do nothing
  }
  chant.Socket().send(JSON.stringify({
    type:typ,
    raw:value
  }));
};

chant.delegate = {
    onmessage: null,
    keepaliveID: null,
    iconMyself: null
};

// 内部にWebSocketを持ち、onmessageイベントだけを受け取り、
// 再接続をincrementする
chant.Socket = function(retry) {
  // 既存のonmessageイベントハンドラを退避させとく
  if (chant.delegate.onmessage === null) {
    chant.delegate.onmessage = (chant.__socket && chant.__socket.onmessage) ? chant.__socket.onmessage : null;
  }
  // リトライをインクリメントしとく
  retry = (retry || 2) * 2;
  if (!chant.__socket || chant.__socket.readyState != WebSocket.OPEN) {
    chant.__socket = new WebSocket('ws://'+Config.server.host+'/websocket/room/socket?token=' + Config.room.token);
  }
  chant.__socket.onopen = function() {
    /* とりあえず
    if (retry > 4) { // これはSocketによる再接続なので
      chant.notify("[RECONNECTED]\nreconnected successfully (o・∇・o)");
    }
    */
    if (chant.delegate.iconMyself) {
      chant.delegate.iconMyself.setAttribute(
        'class',
        chant.delegate.iconMyself.getAttribute('class').replace(" icon-disconnected", "")
      );
    }
    retry = 0;
    if (chant.delegate.onmessage) {
      chant.__socket.onmessage = chant.delegate.onmessage;
    }
    // keepalive
    window.clearInterval(chant.delegate.keepaliveID);
    chant.delegate.keepaliveID = window.setInterval(function() {
      if (chant.__socket && chant.__socket.readyState == WebSocket.OPEN) {
        chant.__socket.send(JSON.stringify({
          type: 'keepalive'
        }));
      }
    }, 10000); // 雑に10秒でいいんすかね？
  };
  chant.__socket.onerror = function() {
    /*
    console.error("[WEBSOCKET ERROR] Try to reconnect " + retry + "seconds later");
    setTimeout(function(){
      chant.Socket(retry);
    }.bind(this), retry);
    */
  };
  chant.__socket.onclose = function() {
    console.log("[WEBSOCKET CLOSED]\nTry to reconnect " +
      moment.duration(retry * 1000).seconds() + "seconds later"
    );
    chant.delegate.iconMyself = document.getElementsByClassName('icon-myself')[0];
    var className = chant.delegate.iconMyself.getAttribute('class');
    if (!className.match('icon-disconnected')) {
      chant.delegate.iconMyself.setAttribute('class',className + " icon-disconnected");
    }
    setTimeout(function(r){
      chant.Socket(r);
    }.bind(this, retry), retry * 1000);
  };
  // onmessageのみをdelegateしてくれー
  return chant.__socket;
};
