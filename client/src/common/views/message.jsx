// var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Message = React.createClass({
    render: function() {
        return (
            <div className="entry">
                <MessageMeta setText={this.props.setText} message={this.props.message} />
                <MessageEntry setText={this.props.setText} message={this.props.message} />
            </div>
        );
    }
});

var MessageEntry = React.createClass({
    render: function () {
        return (
            <div className="box">
              <MessageIcon setText={this.props.setText} message={this.props.message}/>
              <MessageContent message={this.props.message}/>
            </div>
        );
    }
});

var MessageMeta = React.createClass({
    render: function() {
        var time = new Date(this.props.message.timestamp / 1000000);
        var contents = [
              <span onClick={this.quote} className="meta"><small className="grey-text text-lighten-2">{time.toLocaleString()}</small></span>,
        ];
        switch (this.props.message.type) {
        case 'message':
          contents.push(
            <span onClick={this.stamprize} className="meta stealth"><small className="grey-text text-lighten-2">stamprize</small></span>,
            <span onClick={this.totsuzenize} className="meta stealth"><small className="grey-text text-lighten-2">totsuzenize</small></span>
          );
        }
        return (
            <div className="meta-wrapper">{contents}</div>
        );
    },
    stamprize: function() {
        chant.Send('stamprize', JSON.stringify(this.props.message));
        document.getElementsByTagName('textarea')[0].focus();
        chant.clearUnread();// うーむ
    },
    totsuzenize: function() {
        chant.Send('message', chant.Totsuzen.text(this.props.message.value.text));
    },
    // 本当はちゃんとしたいんだけど、とりあえずbrief quoteに倒す
    quote: function() {
      // var value = this.props.message.value.text;
      var value = JSON.stringify(this.props.message);
      this.props.setText(function(text) {
        if (!text) {
            return '\nquote>' + value + '\n';
        }
        return text + '\nquote>' + value + '\n';
      }, true);
    }
});

var MessageIcon = React.createClass({
    render: function() {
        return (
            <div>
                <Icon setText={this.props.setText} user={this.props.message.user} />
            </div>
        );
    }
});

var MessageContent = React.createClass({
    render: function() {
        return (
            <div className="message-wrapper">
                <MessageInclusive message={this.props.message} />
            </div>
        );
    }
});

var MessageInclusive = React.createClass({
    render: function() {
        switch (this.props.message.type) {
        case "stamprize":
            return (
                <div>
                    <div>stamprize</div>
                    <blockquote>
                        <MessageEntry message={this.props.message.value} />
                    </blockquote>
                </div>
            );
        default:
            return <MessageRecursive message={this.props.message} />;
        }
    }
});
var MessageRecursive = React.createClass({
    render: function() {
        if (this.props.message.value.children) {
            return (
                <div>
                    <div>{this.props.message.value.text}</div>
                    <blockquote>
                        <MessageEntry message={this.props.message.value.children} />
                    </blockquote>
                </div>
            );
        }
        return <MessageAnchorable message={this.props.message} />;
    }
});

var MessageAnchorable = React.createClass({
    render: function() {
        var lines = this.props.message.value.text.split('\n').map(function(line) {
            var m = line.match(/^quote>({.+})$/);
            if (m && m.length > 1) {
              try {
                  var message = JSON.parse(m[1]);
                  return (
                    <blockquote className="rich-quote">
                      <MessageEntry message={message}></MessageEntry>
                    </blockquote>
                  );
              } catch (e) {
                  return <blockquote><AnchorizableText text={m[1]}></AnchorizableText></blockquote>;
              }
            }
            if (line.match(/^> /)) {// brief quote
              return <blockquote><AnchorizableText text={line.replace(/^> /, '')}></AnchorizableText></blockquote>;
            }
            return <AnchorizableText text={line}></AnchorizableText>;
        });
        return <div>{lines}</div>;
    }
});
