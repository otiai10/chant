
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
        }
      };
    },
    render: function() {
        return (
            <div id="configs-wrapper" className="display">
              <div class="configs-list">
                <i onClick={this.toggleEmojiList} className="fa fa-meh-o fa-2x stealth hazy clickable"></i>
              </div>
              <div class="configs-list">
                <i onClick={this.toggleNotification} className={this.state.configs.notes.cn}></i>
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
    toggleEmojiList: function() {
      var listwrapper = document.getElementById("emoji-list-wrapper");
      listwrapper.hidden = !listwrapper.hidden;
    }
});
