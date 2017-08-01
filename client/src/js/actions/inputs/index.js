/**
 * Action creator for any inputs by user
 */

export function changeText(text) {
  return {
    type: 'TEXT_CHANGE',
    data: text,
  };
}

export function appendText(text, newline = false) {
  return {
    type: 'TEXT_APPEND',
    data: text,
    newline: newline,
  };
}

export function showStampPreview(text) {
  return (dispatch) => {
    const type = 'SHOW_PREVIEW';
    if (text.match(/(\[uploads\/.+\])/)) {
      return dispatch({type, url:  '/' + text.match(/\[(uploads\/.+)\]/).pop()});
    }
    const u = text.match(/(https?:\/\/[_a-zA-Z0-9-.@&=!~*()\';/?:+$,%#]+)/gi);
    if (!u) return dispatch({type: 'IGNORE'});
    dispatch({type, url: u.pop()});
  };
}

export function clearStampPreview() {
  return {
    type: 'CLEAR_PREVIEW',
  };
}
