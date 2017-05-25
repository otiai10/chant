import {combineReducers} from 'redux';

const foo = (state = {messages:[]}, action) => {
  const messages = state.messages.concat([action]);
  return {...state, messages};
};

export default combineReducers({
  foo,
});
