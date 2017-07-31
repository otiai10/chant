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
  const fired = Date.now();
  return (dispatch, getState) => {
    const type = 'SHOW_PREVIEW';
    if (text.match(/(\[uploads\/.+\])/)) {
      return dispatch({type, url:  '/' + text.match(/\[(uploads\/.+)\]/).pop()});
    }
    const u = text.match(/(https?:\/\/[_a-zA-Z0-9-.@&=!~*()\';/?:+$,%#]+)/gi);
    if (!u) return dispatch({type: 'IGNORE'});
    fetch(`/api/messages/embed?url=${encodeURIComponent(u.pop())}`, {credentials:'include'})
    .then(res => res.json())
    .then(({preview}) => {
      if (getState().inputs.preview.canceled > fired) return dispatch({type:'IGNORE'});
      if (preview && preview.type == 'image') dispatch({type, url: preview.image});
      else dispatch({type: 'IGNORE'});
    });
  };
}

export function clearStampPreview() {
  return {
    type: 'CLEAR_PREVIEW',
    canceled: Date.now(),
  };
}
