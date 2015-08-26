
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
    }
});

var NotificationSettings = React.createClass({
  getInitialState: function() {
    return {
      regexp: chant.local.config.get("notificationRegExp")
    };
  },
  render: function() {
    var regexplaceholder = "Default: @" + Config.myself.screen_name + " Example: .* ";
    return (
      <div>
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
            <button className="btn" onClick={this.close}>OK</button>
          </div>
        </div>
      </div>
    );
  },
  regexOnChange: function(ev) {
    chant.local.config.set("notificationRegExp", ev.target.value);
  },
  close: function() {
    document.getElementById("notification-settings").hidden = true;
  }
});
