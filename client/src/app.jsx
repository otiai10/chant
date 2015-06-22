// onready的なこと
setTimeout(function(){
  React.render(
    <Contents name="CHANT" myself={Config.myself} />,
    document.getElementById('container')
  );
}, 0);
