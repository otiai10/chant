export default (state = {text:''}, action) => {
  switch (action.type) {
  case 'TEXT_CHANGE':
    return {...state, text: action.data};
  case 'TEXT_APPEND':
    return {
      ...state,
      text: state.text + (state.text.length && action.newline ? '\n' : '') + action.data + (action.newline ? '\n' : ''),
    };
  }
  return state;
};
