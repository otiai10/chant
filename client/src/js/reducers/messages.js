export default (state = [], action) => {
  switch (action.type) {
  case 'REMOTE_MESSAGE':
    return Object.keys(action.data).map(key => {
      return {id:key, ...action.data[key]};
    }).reverse();
  }
  return state;
};
