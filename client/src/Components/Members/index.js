import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Members extends Component {
  render() {
    const {members} = this.props;
    return (
      <div style={{display:'flex'}}>
        {Object.keys(members).map(id => <div key={id}><img src={members[id].image_url} /></div>)}
      </div>
    );
  }
  static propTypes = {
    members: PropTypes.object.isRequired,
  }
}
