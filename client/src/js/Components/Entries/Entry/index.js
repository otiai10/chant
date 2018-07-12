import React from 'react';
import PropTypes from 'prop-types';

import Default   from './Default';
import Stamprize from './Stamprize';
import Quoted    from './Quoted';
import Amesh     from './Amesh';
import Timezone  from './Timezone';
import PinList   from './PinList';
import Pinned    from './Pinned';
import Reload    from './Reload';

const Entry = (props) => {
  switch (props.type) {
  case 'STAMPRIZE':
    return <Stamprize {...props} />;
  case 'QUOTED':
    return <Quoted {...props} />;
  case 'AMESH':
    return <Amesh {...props} />;
  case 'TIMEZONE':
    return <Timezone {...props} />;
  case 'PIN_LIST':
    return <PinList {...props} />;
  case 'PIN_DETAIL':
    return <Pinned {...props} />;
  case 'RELOAD':
    return <Reload {...props} />;
  default:
    return <Default {...props} />;
  }
};
Entry.propTypes = {
  type: PropTypes.string,
};

export default Entry;
