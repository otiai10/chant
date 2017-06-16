export default (state = [], action) => {
  switch (action.type) {
  case 'REMOTE_STAMP':
    return Object.keys(action.data).filter(text => {
      return !state.some(stamp => stamp.text == text);
    }).map(text => action.data[text]).concat(state).sort((p, n) => {
      return (p.used < n.used) ? 1 : -1;
    });
  default:
    return state;
  }
};
