import React from 'react';
import PropTypes from 'prop-types';

import Default   from './Default';
import Stamprize from './Stamprize';
import Quoted    from './Quoted';
import Amesh     from './Amesh';

const Entry = (props) => {
  switch (props.type) {
  case 'STAMPRIZE':
    return <Stamprize {...props} />;
  case 'QUOTED':
    return <Quoted {...props} />;
  case 'AMESH':
    return <Amesh {...props} />;
  default:
    return <Default {...props} />;
  }
};
Entry.propTypes = {
  type: PropTypes.string,
};

export default Entry;
