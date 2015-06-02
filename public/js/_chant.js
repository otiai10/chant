
React.render(
    React.createElement(Contents, {name: "World"}),
    // document.body
    document.getElementById('container')
);

var Contents = React.createClass({displayName: "Contents",
    render: function() {
      return React.createElement("div", {className: "row center"}, 
        React.createElement("div", {className: "col s12"}, 
          React.createElement("h1", {className: "header center blue-text"}, "\"CHANT\" ?"), 
          React.createElement("p", null, "ちゃんとというのはなんだらかんだら"), 
          React.createElement("a", {href: "/auth", className: "btn blue"}, "Login with Twitter")
        )
      )
    }
});
