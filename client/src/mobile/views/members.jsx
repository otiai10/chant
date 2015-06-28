/**
 * Members
 */
var Members = React.createClass({
    render: function() {
        var members = [];
        for (var id in this.props.members) {
            members.push(
                <Icon setText={this.props.setText} user={this.props.members[id]} />
            );
        }
        return <span>{members}</span>;
    }
});
