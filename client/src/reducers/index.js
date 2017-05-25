import {combineReducers} from 'redux';

const foo = (state = {messages:[]}, action) => {
  // const messages = state.messages.concat([action]);
  // return {...state, messages};
  switch (action.type) {
  case 'REMOTE_MESSAGE':
    return {...state, messages: Object.keys(action.data).map(key => {
      return {id:key, ...action.data[key]};
    }).sort((p,n) => p.ts < n.ts ? 1 : -1)};
  }
  return state;
};

export default combineReducers({
  foo,
});
