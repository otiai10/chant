export default (state = {message:false, member:false, days:1}, action) => {
  switch (action.type) {
  case 'LOADING_DAYS':
    return {...state, days:action.data};
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
