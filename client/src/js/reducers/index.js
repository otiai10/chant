import {combineReducers} from 'redux';
import messages from './messages';
import members  from './members';
import loading  from './loading';
import stamps   from './stamps';
import inputs   from './inputs';

export default combineReducers({
  messages,
  members,
  loading,
  stamps,
  inputs,
});
