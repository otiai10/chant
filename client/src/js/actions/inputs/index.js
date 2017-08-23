/**
 * Action creator for any inputs by user
 */

import {TextHistory} from '../../models';

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

/**
 * popTextHistory
 * References history.stack **with current index**, and set it to state.
 */
export function popTextHistory() {
  return (dispatch, getState) => {
    const index = getState().inputs.history.index + 1;
    const text = TextHistory.getByIndex(index);
    if (text) dispatch({type: 'TEXT_CHANGE', data: text});
    dispatch({type: 'UPDATE_HISTORY', history: {index}});
  };
}

/**
 * pushTextHistory
 * Push specified text **OR** re-sort stack, and reset current index anyway.
 */
export function pushTextHistory(text) {
  return (dispatch) => {
    TextHistory.push(text);
    dispatch({type: 'UPDATE_HISTORY', history: {index: -1}});
  };
}
