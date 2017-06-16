export default (current = [], action) => {
  switch (action.type) {
  case 'REMOTE_STAMP':
    return action.data.filter(coming => { // choose only new commers
      return !current.some(st => coming.text == st.text);
    }).concat(current);
  default:
    return current;
  }
};
