
var Members = React.createClass({
    render: function() {
        var members = [];
        for (var id in this.props.members) {
            members.push(
                <img src={this.props.members[id].profile_image_url} className="user-icon" />
            );
        }
        return <span>{members}</span>;
    }
});