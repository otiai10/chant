import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Myself from './Myself';
import Member from './Member';

export default class Members extends Component {
  render() {
    const {members} = this.props;
    return (
      <div className="row">
        <Myself user={chant.user} />
        {Object.keys(members).filter(id => id != chant.user.id).map(id => <Member key={id} member={members[id]} />)}
      </div>
    );
  }
  static propTypes = {
    members: PropTypes.object.isRequired,
  }
}
