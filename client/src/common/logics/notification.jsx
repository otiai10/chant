var chant = chant || {};
chant._notification = {
    __get: function() {
      if (window.Notification) {
        return window.Notification;
      }
      return (function() {
          return function(title, options) {
              window.alert(options.body || 'おだやかじゃないわね');
              this.onclick = function() {};
              this.onclose = function() {};
              this.close = function() {};
          };
      })();
    },
    __sound: (function() {
        var audio = document.createElement('audio');
        audio.setAttribute('src', '/public/sound/notification.mp3');
        return {
          play: function() {
              if (window.navigator.userAgent.indexOf('Firefox') > -1) return;
              var vol = parseInt(chant.local.config.get('notificationVolume'));
              audio.volume = vol / 100;
              audio.play();
          }
        };
    })()
};
chant.notify = function(body, title, icon, isMention, onclick, onclose) {
    if (! chant.local.config.get('notification')) return;
    onclose = onclose || function() {};
    if (icon) icon = icon.replace('_normal', '_bigger');
    var notification = chant._notification.__get();
    var note = new notification(
        title || 'CHANT',
        {
            body: body || 'おだやかじゃないわね',
            icon: icon || '/public/img/icon.png',
            requireInteraction: isMention && !!chant.local.config.get("notificationStay")
        }
    );
    note.onclick = onclick || function() {
      window.focus();
      note.close();
    };
    note.onclose = onclose;

    // if xxx
    chant._notification.__sound.play();
};

chant.notifier = {
    notify: function(message) {
        // ignore my message
        if (message.user.id_str == Config.myself.id_str) return;
        chant.addUnread();
        // detect @all or @me
        var stored = chant.local.config.get("notificationRegExp");
        var mentioned = new RegExp('@all|@' + Config.myself.screen_name);
        var exp = (stored) ? new RegExp(stored) : mentioned;
        if (!exp.test(message.value.text)) return;
        chant.notify(
            message.value.text,
            message.user.screen_name,
            message.user.profile_image_url,
            mentioned.test(message.value.text)
        );
    }
};
