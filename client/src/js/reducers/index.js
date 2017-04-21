import {combineReducers} from 'redux'

const foo = (state = {messages:[]}, action) => {
  if (action.type == "SYNC_MESSAGE") {
    const d = action.snapshot;
    const messages = Object.keys(d).map(key => {return {id:key, ...d[key]};}).sort((p, n) => p.ts < n.ts ? 1 : -1);
    return {...state, messages};
  }
  return state;
}

export default combineReducers({
  foo,
});
