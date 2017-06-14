import {combineReducers} from 'redux';
import messages from './messages';
import members  from './members';
import loading  from './loading';

export default combineReducers({
  messages,
  members,
  loading,
});
