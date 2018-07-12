export default (state = [], action) => {
  switch (action.type) {
  case 'REMOTE_MESSAGE':
    // mark new coming
    state.map(m => action.data[m.id] ? action.data[m.id]._beread = true : null);
    const messages = Object.keys(action.data).map(key => ({id:key, ...action.data[key]}));
    applyUnreadCount(messages.filter(m => !m._beread).length);
    return messages.reverse();
  case 'UNREAD_RESET':
    applyUnreadCount(0);
  }
  return state;
};

/**
 * This reducer controlls DOM itself ;(
 */
const defaultTitle = 'CHANT';
const applyUnreadCount = (count) => {
  if (document.hasFocus()) count = 0;
  const title = document.querySelector('title');
  if (count == 0) {
    title.innerHTML = defaultTitle;
  } else {
    title.innerHTML = '!' + title.innerHTML;
  }
};
