
var Configs = React.createClass({
    getInitialState: function() {
        return {
          display: false,
          configs: {
            notes: {
              on: false,
              cn: 'mdi-social-notifications-off small clickable'
            }
          }
        };
    },
    render: function() {
        return (
            <div id="configs-wrapper" className="display">
              {/*
              <div id="configs-tab">
                <i onClick={this.toggleConfig} className="mdi-action-settings small clickable"></i>
              </div>
              */}
              <div class="configs-list">
                <i onClick={this.toggleNotification} className={this.state.configs.notes.cn}></i>
              </div>
            </div>
        );
    },
    toggleConfig: function() {
      this.display = !this.display;
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
              return 'mdi-social-notifications-on small clickable';
            }
            return 'mdi-social-notifications-off small clickable';
          }.bind(this))()
        };
        this.setState({configs: this.state.configs});
        // TODO: localStorageと合わせる
    }
});
