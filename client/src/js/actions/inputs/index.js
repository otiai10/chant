/**
 * Action creator for any inputs by user
 */

export function changeText(text) {
  return {
    type: 'TEXT_CHANGE',
    data: text,
  };
}
