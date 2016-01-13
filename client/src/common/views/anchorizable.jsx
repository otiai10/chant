var AnchorizableText = React.createClass({
    getInitialState: function() {
        this.props.rules = this.props.rules || [];
        var replacers = this.expandByRules([this.props.text]);
        var contents = [];
        replacers.forEach(function(replacer, i) {
            if (typeof replacer === 'string')
              return contents.push(<span>{replacer}</span>);
            if (typeof replacer.replace === 'function') {
              setTimeout(function() {
                replacer.replace.bind(this)(i, replacer.value);
              }.bind(this));
            }
            var _c = replacer.wrap.bind(this)(replacer.value);
            return contents.push(<span>{_c}</span>);
        }.bind(this));
        return {contents: contents};
    },
    render: function() {
        return <span>{this.state.contents}</span>;
    },
    expandByRules: function(tokens) {
        if (!this.props.rules) return tokens;
        this.props.rules.forEach(function(rule, i) {
            tokens = this.expandByRule(rule, tokens);
        }.bind(this));
        return tokens;
    },
    expandByRule: function(rule, tokens) /* tokens */ {
      return (function(tokens) {
        var expr = new RegExp(rule.match);
        var res = [];
        tokens.forEach(function(token) {
          if (!token.split) return res.push(token); // this is already replacer.
          token.split(expr).forEach(function(e) {
            if (e.length === 0) return;
            if (e.match(expr)) {
              var r = new AnchorizableText.Replacer(e);
              if (typeof rule.wrap === 'function') r.wrap = rule.wrap;
              if (typeof rule.replace === 'function') r.replace = rule.replace;
              return res.push(r);
            }
            return res.push(e);
          });
        });
        return res;
      })(tokens);
    },
    replaceContentsOf: function(index, content) {
        this.state.contents[index] = content;
        this.setState({contents: this.state.contents});
    }
});

AnchorizableText.Replacer = function(substr) {
  this.value = substr;
  // default wrap
  this.wrap = function(sub) {
    return <a href={sub} target="_blank">{sub}</a>;
  };
};

var defaultRules = [
  // Twitter
  {
    match: /(https?:\/\/(?:mobile\.)?twitter.com\/[^\/]+\/status(?:es)?\/[0-9]+)/g,
    replace: function(i, sub) {
        var expr = /(?:https?:\/\/(?:mobile\.)?twitter.com)\/(?:[^\/]+)\/status(?:es)?\/([0-9]+)/gi;
        var m = expr.exec(sub);
        if (!m || m.length < 2) return; // do nothing
        var id = m[1];
        $.ajax({
          url: 'https://api.twitter.com/1/statuses/oembed.json?id=' + String(id),
          method: 'GET',
          dataType: 'jsonp',
          success: function(res){
            res.html = res.html.replace('<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>', '');
            this.replaceContentsOf(i, <div dangerouslySetInnerHTML={{__html:res.html}}></div>);
            setTimeout(function(){twttr.widgets.load();}, 0);
          }.bind(this),
          error: function(err){
            console.log('twitter API error', err);
          }
        });
    }
  },
  // Vine
  {
    match: /(https?:\/\/vine.co\/v\/[^\/]+)\/?/,
    wrap: function(sub) {
      return <Vine src={sub}></Vine>;
    }
  },
  // YouTube
  {
    match: /(https?:\/\/www.youtube.com\/watch\?.*v=[a-zA-Z0-9_-]{11})/gi,
    wrap: function(sub) {
      return <YouTube src={sub}></YouTube>;
    }
  },
  // youtu.be
  {
    match: /(https?:\/\/youtu.be\/[a-zA-Z0-9_-]{11})/gi,
    wrap: function(sub) {
      return <YouTube src={sub}></YouTube>;
    }
  },
  // SoundCloud
  {
    match: /(https?:\/\/soundcloud.com\/(?:[^\/]+)\/(?:[^\/]+))/gi,
    wrap: function(sub) {
      return <SoundCloud src={sub}></SoundCloud>;
    }
  },
  // MixCloud
  {
    match: /(https?:\/\/www.mixcloud.com\/(?:[^\/]+)\/(?:[^ ]+))/gi,
    wrap: function(sub) {
      return <MixCloud src={sub}></MixCloud>;
    }
  },
  // Image
  /*
  {
    match: /((?:(?:https?):\/\/|www\.)(?:[a-z0-9-]+\.)+[a-z0-9:]+(?:\/[^\s<>"',;]*)?(?:jpe?g|png|gif))/gi,
    wrap: function(sub) {
      return <a href={sub} target="_blank"><img src={sub} className="entry-image"></img></a>;
    }
  },
  */
  // URL Link
  {
    match: /(https?:\/\/[_a-zA-Z0-9-.@&=!~*()\';/?:+$,%#]+)/gi,
    wrap: function(sub) {
      return <a href={sub} target="_blank">{sub}</a>;
    },
    replace: function(i, sub) {
      $.ajax({
        url: '/api/v1/preview',
        data: { u: sub },
        success: function(res) {
          switch (res.content) {
          case 'image':
            return this.replaceContentsOf(i, <a href={res.url} target="_blank"><img src={res.url} className="entry-image"></img></a>);
          case 'video':
            return this.replaceContentsOf(i, <video src={res.url} className="entry-video" loop controls></video>);
          }
          res.summary.title = res.summary.title || res.summary.url;
          res.summary.description = res.summary.description || res.summary.url;
          this.replaceContentsOf(
            i,
            <WebPreview title={res.summary.title} image={res.summary.image} description={res.summary.description} url={res.summary.url} ></WebPreview>
          );
        }.bind(this)
      });
    }
  },
  // Emoji
  {
    match: /(:[a-zA-Z0-9_\-+]+:)/g,
    wrap: function(sub) {
      var url = Config.emojis[sub];
      if (Config.emojis[sub]) {
        return <Emoji name={sub}></Emoji>;
      } else {
        return <span>{sub}</span>;
      }
    }
  },
  // おっぱい
  {
    match: /(おっぱい)/g,
    wrap: function(sub) {
        return <b>{sub}</b>;
    }
  },
  // 自分
  {
    match: new RegExp('(@' + Config.myself.screen_name + '|' + '@all)', 'g'),
    wrap: function(sub) {
      return <b>{sub}</b>;
    }
  }
];

(function() {
  if (Config.apis.googlemaps) {
    var token = Config.apis.googlemaps;
    var baseURL = "https://www.google.com/maps/embed/v1";
    defaultRules.unshift({
      match: /(https?:\/\/www\.google\.co\.jp\/maps.*)/gi,
      wrap: function(sub) {
        if (sub.match(/\/place\/([^/]+)\//)) {
          var q = sub.match(/\/place\/([^/]+)\//)[1];
          var src = baseURL + "/place?q=" + q + "&zoom=15&key=" + token;
          return <iframe width="100%" height="450" frameborder="0" style={{border:0}} src={src} />;
        }
        return <a href={sub} target="_blank">{sub}</a>;
      }
    });
  }
})();
