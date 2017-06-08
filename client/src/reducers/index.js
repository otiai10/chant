/*
 * TODO: Split files
 */

import {combineReducers} from 'redux';

const messages = (state = [], action) => {
  switch (action.type) {
  case 'REMOTE_MESSAGE':
    return Object.keys(action.data).map(key => {
      return {id:key, ...action.data[key]};
    }).sort((p,n) => p.time < n.time ? 1 : -1);
  }
  return state;
};

const members = (state = {}, action) => {
  switch (action.type) {
  case 'REMOTE_MEMBER':
    return {...action.data};
  }
  return state;
};

export default combineReducers({
  messages,
  members,
});
