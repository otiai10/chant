// onready的なこと
setTimeout(function(){
  React.render(
    <Contents name="World" />,
    // document.body
    document.getElementById('container')
  );
}, 0);
