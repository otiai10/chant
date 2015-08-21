var chant = chant || {};

chant.addUnread = function(ev) {
  if (window.focused) return;
  document.title = '!' + document.title;
  var favicon = document.getElementById("favicon");
  favicon.setAttribute("href", "/public/img/icon.chant.unread.mini.png");
};
chant.clearUnread = function(ev) {
  document.title = document.title.replace(/!/g, '');
  var favicon = document.getElementById("favicon");
  favicon.setAttribute("href", "/public/img/icon.chant.mini.png");
};
