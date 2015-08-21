// entry point
setTimeout(function(){
  window.focused = true;
  React.render(
    <Contents name="CHANT" myself={Config.myself} />,
    document.getElementById('container')
  );
}, 0);
window.onfocus = function() {
  window.focused = true;
  chant.clearUnread();
};
window.onblur = function () {
  window.focused = false;
};
