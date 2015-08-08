/**
 * Icon
 */
var Icon = React.createClass({
 render: function() {
   var styles = {
     backgroundImage: "url(" + this.props.user.profile_image_url + ")"
   };
   var className = "user-icon-wrapper";
   if (this.props.isMyself) className += " icon-myself";
   return (
     <div onClick={this.onClick} className={className} style={styles}></div>
   );
   // <img onClick={this.onClick} src={this.props.user.profile_image_url} className="user-icon" />
 },
 onClick: function(ev) {
   this.props.setText('@' + this.props.user.screen_name);
 }
});
