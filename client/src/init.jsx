// onready的なこと
setTimeout(function(){
  React.render(
    <Contents name="World" myself={Config.myself} />,
    // document.body
    document.getElementById('container')
  );
}, 0);
