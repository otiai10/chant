
var Configs = React.createClass({
    notes: function(on) {
        if (on) {
          return {
            on: true,
            cn: 'fa fa-bell fa-2x stealth hazy clickable'
          };
        }
        return {
          on: false,
          cn: 'fa fa-bell-slash fa-2x stealth hazy clickable'
        };
    },
    getInitialState: function() {
      var on = chant.local.config.get('notification');
      return {
        display: false,
        configs: {
          notes: this.notes(on)
        },
        mousedown: false
      };
    },
    render: function() {
        return (
            <div id="configs-wrapper" className="display">
              <div class="configs-list">
                <i onClick={this.toggleEmojiList} className="fa fa-meh-o fa-2x stealth hazy clickable"></i>
              </div>
              <div class="configs-list">
                <i onMouseDown={this.notificationDown} onMouseUp={this.notificationUp} className={this.state.configs.notes.cn}></i>
              </div>
              <div class="configs-list">
                <i onClick={this.signout} className="fa fa-sign-out fa-2x stealth hazy clickable"></i>
              </div>
              <div class="configs-list">
                <i onClick={this.github} className="fa fa-github-square fa-2x stealth hazy clickable"></i>
              </div>
            </div>
        );
    },
    toggleConfig: function() {
      this.display = !this.display;
    },
    signout: function() {
      if (window.confirm('logout?')) location.href = '/logout';
    },
    github: function() {
      window.open('https://github.com/otiai10/chant/issues', '_blank');
    },
    toggleNotification: function() {
        if (!window.Notification) return window.alert("undefined window.Notification");
        window.Notification.requestPermission(function(status){
          console.info("Notification permission status:", status);
        });
        this.state.configs.notes = this.notes(!this.state.configs.notes.on);
        this.setState({configs: this.state.configs});
        chant.local.config.set('notification', this.state.configs.notes.on);
    },
    notificationDown: function() {
      this.setState({mousedown: true});
      var id = setTimeout(function(){
        if (!this.state.mousedown) return console.info("Already Mouse Up");
        this.setState({mousedown: false});
        this.openNotificationSettings();
      }.bind(this), 800);
    },
    notificationUp: function() {
      if (!this.state.mousedown) return console.info('Already Mouse Up');
      this.setState({mousedown: false});
      this.toggleNotification();
    },
    openNotificationSettings: function() {
      var notificationSettings = document.getElementById("notification-settings");
      notificationSettings.hidden = false;
    },
    toggleEmojiList: function() {
      var listwrapper = document.getElementById("emoji-list-wrapper");
      listwrapper.hidden = !listwrapper.hidden;
      if (listwrapper.hidden) {
        document.getElementById("emoji-search").blur();
      } else {
        document.getElementById("emoji-search").focus();
      }
    }
});

var NotificationSettings = React.createClass({
  getInitialState: function() {
    return {
      regexp: chant.local.config.get("notificationRegExp"),
      volume: chant.local.config.get("notificationVolume"),
      stay:   chant.local.config.get("notificationStay")
    };
  },
  render: function() {
    var regexplaceholder = "Default: @" + Config.myself.screen_name + " Example: .* ";
    return (
      <div className="container">
        <div className="row">
          <div className="col s12">
            <h4>Notification Settings</h4>
          </div>
        </div>
        <div className="row">
          <div className="col s12">
            <span>RegExp for notification: </span>
            <input type="text" onChange={this.regexOnChange} placeholder={regexplaceholder} defaultValue={this.state.regexp} />
          </div>
        </div>
        <div className="row">
          <div className="col s12">
            <span>Stay on desktop if mention</span>
            <p>
              <input type="checkbox" onClick={this.stayOnClick} className="filled-in" id="note-stay-on-desktop" checked={this.state.stay} />
              <label for="note-stay-on-desktop" onClick={this.stayOnClick}></label>
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col s12">
            <span>Sound volume: </span>
            <input type="range" onChange={this.volumeChange} defaultValue={this.state.volume} />
          </div>
        </div>
        <div className="row">
          <div className="col s12">
            <button className="btn" onClick={this.close}>OK</button>
          </div>
        </div>
      </div>
    );
  },
  regexOnChange: function(ev) {
    chant.local.config.set("notificationRegExp", ev.target.value);
  },
  volumeChange: function(ev) {
    chant.local.config.set("notificationVolume", ev.target.value);
  },
  stayOnClick: function(ev) {
    var checked = document.getElementById("note-stay-on-desktop").checked;
    checked = !!!checked;
    document.getElementById("note-stay-on-desktop").checked = checked;
    chant.local.config.set("notificationStay", checked);
    this.setState({stay: checked});
  },
  close: function() {
    document.getElementById("notification-settings").hidden = true;
  }
});
