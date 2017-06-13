import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Myself from './Myself';
import Member from './Member';

export default class Members extends Component {
  render() {
    const {members} = this.props;
    const current = Object.keys(members).filter(id => {
      if (id == chant.user.id) return false;
      if (!members[id].browsers) return false;
      return true;
    });
    return (
      <div id="members" className="row section">
        <Myself user={chant.user} />
        {current.map(id => <Member key={id} member={members[id]} />)}
      </div>
    );
  }
  static propTypes = {
    members: PropTypes.object.isRequired,
  }
}
