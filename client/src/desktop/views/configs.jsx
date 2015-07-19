
var Configs = React.createClass({
    getInitialState: function() {
        return {
          display: false,
          configs: {
            notes: {
              on: false,
              cn: 'fa fa-bell-slash fa-2x stealth hazy clickable'
            }
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
        this.state.configs.notes = {
          on: !this.state.configs.notes.on,
          cn: (function(){
            if (!this.state.configs.notes.on) {
              return 'fa fa-bell fa-2x stealth hazy clickable';
            }
            return 'fa fa-bell-slash fa-2x stealth hazy clickable';
          }.bind(this))()
        };
        this.setState({configs: this.state.configs});
        // TODO: localStorageと合わせる
    },
    toggleEmojiList: function() {
      var listwrapper = document.getElementById("emoji-list-wrapper");
      listwrapper.hidden = !listwrapper.hidden;
    }
});
