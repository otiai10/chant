var AnchorizableText = React.createClass({
    getInitialState: function() {
        var replacers = this.expandByRules([this.props.text]);
        var contents = [];
        replacers.forEach(function(replacer, i) {
            if (typeof replacer === 'string')
              return contents.push(<span>{replacer}</span>);
            setTimeout(function() {
              replacer.replace.bind(this)(i);
            }.bind(this));
            return contents.push(<span>{replacer}</span>);
        }.bind(this));
        return {contents: contents};
    },
    render: function() {
        return <span>{this.state.contents}</span>;
    },
    expandByRules: function(tokens) {
        if (!AnchorizableText.Rules) return tokens;
        AnchorizableText.Rules.forEach(function(rule, i) {
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
            if (e.match(expr)) return res.push(new rule.replacer(e));
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

AnchorizableText.Rules = [
  // Twitter
  {
    match: /(https?:\/\/twitter.com\/[^\/]+\/status\/[0-9]+)/g,
    replacer: function(sub) {
      this.replace = function(i) {
        var expr = /(https?:\/\/twitter.com)\/([^\/]+)\/status\/([0-9]+)/gi;
        var m = expr.exec(sub);
        if (!m || m.length < 4) return; // do nothing
        var id = m[3];
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
      };
    }
  },
  // Vine
  {
    match: /(https?:\/\/vine.co\/v\/[^\/]+)\/?/,
    replacer: function(sub) {
        this.replace = function(i) {
          sub += '/embed/simple';
          this.replaceContentsOf(i, <iframe src={sub} width="400" height="400" frameborder="0"></iframe>);
        };
    }
  },
  // YouTube
  {
    match: /(https?:\/\/www.youtube.com\/watch\?.*v=[a-zA-Z0-9_-]{11})/gi,
    replacer: function(sub) {
      var id = /https?:\/\/www.youtube.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/.exec(sub)[1];
      this.replace = function(i) {
        var url = "https://www.youtube.com/embed/" + id;
        this.replaceContentsOf(i, <iframe width="560" height="225" src={url} frameborder="0" allowfullscreen></iframe>);
      };
    }
  },
  // SoundCloud
  {
    match: /(https?:\/\/soundcloud.com\/(?:[^\/]+)\/(?:[^\/]+))/gi,
    replacer: function(sub) {
        // var url = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/189264330";
        this.replace = function(i) {
          var url = "https://w.soundcloud.com/player/?url=" + sub + "&amp;visual=true";
          this.replaceContentsOf(i, <iframe width="100%" height="225" scrolling="no" frameborder="no" src={url}></iframe>);
        };
    }
  },
  // MixCloud
  {
    match: /(https?:\/\/www.mixcloud.com\/(?:[^\/]+)\/(?:[^ ]+))/gi,
    replacer: function(sub) {
      this.replace = function(i) {
        var url = "https://www.mixcloud.com/widget/iframe/?embed_type=widget_standard&feed=" + encodeURIComponent(sub);
        this.replaceContentsOf(i, <iframe width="100%" height="400" src={url}></iframe>);
      };
    }
  },
  // Image
  {
    match: /((?:(?:https?):\/\/|www\.)(?:[a-z0-9-]+\.)+[a-z0-9:]+(?:\/[^\s<>"',;]*)?(?:jpe?g|png|gif))/gi,
    replacer: function(sub) {
        this.replace = function(i) {
          this.replaceContentsOf(i, <a href={sub} target="_blank"><img src={sub} className="entry-image"></img></a>);
        };
    }
  },
  // URL Link
  {
    match: /(https?:\/\/[_a-zA-Z0-9-.@&=!~*()\';/?:+$,%#]+)/gi,
    replacer: function(sub) {
        this.replace = function(i) {
        $.ajax({
            url: '/api/v1/preview',
            data: { url: sub },
            success: function(res) {
              if (!res.summary.title && !res.summary.image && !res.summary.description) return;
              this.replaceContentsOf(
                i,
                <WebPreview title={res.summary.title} image={res.summary.image} description={res.summary.description} url={res.summary.url} ></WebPreview>
              );
            }.bind(this),
            error: function(err) {
              this.replaceContentsOf(i, <a href={sub} target="_blank">{sub}</a>);
            }.bind(this)
        });
      };
    }
  },
  // おっぱい
  {
    match: /(おっぱい)/g,
    replacer: function(sub) {
      this.replace = function(i) {
        this.replaceContentsOf(i, <b>{sub}</b>);
      };
    }
  }
];
