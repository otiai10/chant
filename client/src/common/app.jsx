// entry point
setTimeout(function(){
  window.focused = true;
  React.render(
    <Contents name="CHANT" myself={Config.myself} />,
    document.getElementById('container')
  );
}, 0);
var chant = chant || {};
chant.onfocusDelegate = function(func, context) {
  window.onfocus = function() {
    window.focused = true;
    chant.clearUnread();
    func.call(context);
  };
};
window.onblur = function () {
  window.focused = false;
};
