export default (state = [], action) => {
  switch (action.type) {
  case 'REMOTE_MESSAGE':
    applyUnreadCount(Object.keys(action.data).length - state.length);
    return Object.keys(action.data).map(key => {
      return {id:key, ...action.data[key]};
    }).reverse();
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
