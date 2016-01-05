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
              <MessageContent setText={this.props.setText} message={this.props.message}/>
            </div>
        );
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
                <MessageInclusive setText={this.props.setText} message={this.props.message} />
            </div>
        );
    }
});

var MessageInclusive = React.createClass({
    render: function() {
        switch (this.props.message.type) {
        case "amesh":
          return <Amesh entry={this.props.message.value} />;
        case "stamprize":
            return <Stamprize message={this.props.message.value} />;
        case "mute":
            return (
              <div>
                <div>mute</div>
                <blockquote>
                  <MessageEntry setText={this.props.setText} message={this.props.message.value} />
                </blockquote>
              </div>
            );
        case "unmute":
            return (
              <div>
                <div>unmute</div>
                <blockquote>
                  <MessageEntry setText={this.props.setText} message={this.props.message.value} />
                </blockquote>
              </div>
            );
        case "stampuse":
            // うーむ、なぜ？ あー
            // 参照で全部変えてるのか
            this.props.message.value = this.props.message.value.value || this.props.message.value;
        default:
            return <MessageRecursive setText={this.props.setText} message={this.props.message} />;
        }
    }
});
var MessageRecursive = React.createClass({
  render: function() {
    if (this.props.message.value && this.props.message.value.children) {
      return (
        <div>
          <div>{this.props.message.value.text}</div>
          <blockquote>
            <MessageEntry setText={this.props.setText} message={this.props.message.value.children} />
          </blockquote>
        </div>
      );
    }
    return <MessageAnchorable setText={this.props.setText} message={this.props.message} />;
  }
});

var MessageAnchorable = React.createClass({
    render: function() {
        if (chant.local.config.get('mute')[this.props.message.value.text]) {
            return <Muted message={this.props.message}></Muted>;
        }
        var setText = this.props.setText;// ここで退避
        var lines = this.props.message.value.text.split('\n').map(function(line) {
            var m = line.match(/^quote>({.+})$/);
            if (m && m.length > 1) {
              try {
                  var message = JSON.parse(m[1]);
                  return (
                    <blockquote className="rich-quote">
                      <MessageEntry setText={setText} message={message}></MessageEntry>
                    </blockquote>
                  );
              } catch (e) {
                  return <blockquote><AnchorizableText rules={defaultRules} text={m[1]}></AnchorizableText></blockquote>;
              }
            }
            if (line.match(/^> /)) {// brief quote
              return <blockquote><AnchorizableText rules={defaultRules} text={line.replace(/^> /, '')}></AnchorizableText></blockquote>;
            }
            // return <AnchorizableText text={line}></AnchorizableText>;
            return <p className="line-wrap"><AnchorizableText rules={defaultRules} text={line}></AnchorizableText></p>;

        });
        return <div>{lines}</div>;
    }
});

var Muted = React.createClass({
  render: function() {
      return (
        <div onClick={this.unmute} className="muted-contents clickable">
          <i className="fa fa-ban">あかんやつ</i>
        </div>
      );
  },
  unmute: function() {
    if (!window.confirm("unmute?\n" + this.props.message.value.text)) return;
    var mute = chant.local.config.get('mute');
    delete mute[this.props.message.value.text];
    chant.local.config.set('mute', mute);
    chant.Send('unmute', JSON.stringify(this.props.message));
  }
});
