/*
 * TODO: Split files
 */

import {combineReducers} from 'redux';

const messages = (state = [], action) => {
  switch (action.type) {
  case 'REMOTE_MESSAGE':
    return Object.keys(action.data).map(key => {
      return {id:key, ...action.data[key]};
    }).reverse();
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

const loading = (state = {message:false, member:false}, action) => {
  switch (action.type) {
  case 'MESSAGE_LOADING':
    return {...state, message:true};
  case 'REMOTE_MESSAGE':
    return {...state, message:false};
  case 'MEMBER_LOADING':
    return {...state, member:true};
  case 'REMOTE_MEMBER':
    return {...state, member:false};
  default:
    return state;
  }
};

export default combineReducers({
  messages,
  members,
  loading,
});
