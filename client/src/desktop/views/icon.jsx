/**
 * Icon
 */
var Icon = React.createClass({
    render: function() {
        return (
            <img onClick={this.onClick} src={this.props.user.profile_image_url} className="user-icon" />
        );
    },
    onClick: function(ev) {
        this.props.setText('@' + this.props.user.screen_name);
    }
});