/**
 * Icon
 */
var Icon = React.createClass({
 render: function() {
   var styles = {
     backgroundImage: "url(" + this.props.user.profile_image_url + ")"
   };
   return (
     <div onClick={this.onClick} className="user-icon-wrapper" style={styles}></div>
   );
   // <img onClick={this.onClick} src={this.props.user.profile_image_url} className="user-icon" />
 },
 onClick: function(ev) {
   this.props.setText('@' + this.props.user.screen_name);
 }
});
