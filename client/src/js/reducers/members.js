export default (state = {}, action) => {
  switch (action.type) {
  case 'REMOTE_MEMBER':
    return {...action.data};
  }
  return state;
};
