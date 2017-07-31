export default (state = {text:'', preview:{}}, action) => {
  switch (action.type) {
  case 'TEXT_CHANGE':
    return {...state, text: action.data};
  case 'TEXT_APPEND':
    return {
      ...state,
      text: state.text + (state.text.length && action.newline ? '\n' : '') + action.data + (action.newline ? '\n' : ''),
    };
  case 'SHOW_PREVIEW':
    return {...state, preview: {url: action.url}};
  case 'CLEAR_PREVIEW':
    return {...state, preview: {url: null, caceled: action.canceled}};
  }
  return state;
};
