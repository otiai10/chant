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