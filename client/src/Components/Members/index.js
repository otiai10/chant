import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Member from './Member';

export default class Members extends Component {
  render() {
    const {members} = this.props;
    return (
      <div className="row">
        {Object.keys(members).map(id => <Member key={id} member={members[id]} />)}
      </div>
    );
  }
  static propTypes = {
    members: PropTypes.object.isRequired,
  }
}
