setTimeout(function(){chant.isCurrentPage=!0,React.render(React.createElement(Contents,{name:"CHANT",myself:Config.myself}),document.getElementById("container")),window.onfocus=function(){chant.clearUnread()},window.onblur=function(){chant.isCurrentPage=!1}},0);var AnchorizableText=React.createClass({displayName:"AnchorizableText",getInitialState:function(){return{_c:this.props.text}},render:function(){return React.createElement("p",{className:"line-wrap",ref:"ATSelf"},this.state._c)},componentDidMount:function(){this.anchorize()},anchorize:function(){__vine.bind(this)()||__youtube.bind(this)()||__mixcloud.bind(this)()||__soundcloud.bind(this)()||__twitter.bind(this)()||__image.bind(this)()||__link.bind(this)()},getDefaultProps:function(){var e={expr:function(){return/((https?):\/\/|www\.)([a-z0-9-]+\.)+[a-z0-9:]+(\/[^\s<>"',;]*)?(jpe?g|png|gif)/gi},wrap:function(e){return'<a href="'+e+'" target="_blank"><img class="entry-image" src="'+e+'" /></a>'}},t={expr:function(){return/(https?):\/\/([_a-zA-Z0-9-.@&=!~*()\';/?:+$,%#]+)/gi},wrap:function(e){return'<a href="'+e+'" target="_blank">'+e+"</a>"}};return{ExprWrappers:[e,t]}}}),Message=React.createClass({displayName:"Message",render:function(){return React.createElement("div",{className:"entry"},React.createElement(MessageMeta,{setText:this.props.setText,message:this.props.message}),React.createElement(MessageEntry,{setText:this.props.setText,message:this.props.message}))}}),MessageEntry=React.createClass({displayName:"MessageEntry",render:function(){return React.createElement("div",{className:"box"},React.createElement(MessageIcon,{setText:this.props.setText,message:this.props.message}),React.createElement(MessageContent,{message:this.props.message}))}}),MessageMeta=React.createClass({displayName:"MessageMeta",render:function(){var e=new Date(this.props.message.timestamp/1e6),t=[React.createElement("span",{onClick:this.quote,className:"meta"},React.createElement("small",{className:"grey-text text-lighten-2"},e.toLocaleString()))];switch(this.props.message.type){case"message":t.push(React.createElement("span",{onClick:this.stamprize,className:"meta stealth"},React.createElement("small",{className:"grey-text text-lighten-2"},"stamprize")),React.createElement("span",{onClick:this.totsuzenize,className:"meta stealth"},React.createElement("small",{className:"grey-text text-lighten-2"},"totsuzenize")))}return React.createElement("div",{className:"meta-wrapper"},t)},stamprize:function(){chant.Send("stamprize",JSON.stringify(this.props.message)),document.getElementsByTagName("textarea")[0].focus(),chant.clearUnread()},totsuzenize:function(){chant.Send("message",chant.Totsuzen.text(this.props.message.value.text))},quote:function(){var e=JSON.stringify(this.props.message);this.props.setText(function(t){return t?t+"\nquote>"+e+"\n":"\nquote>"+e+"\n"},!0)}}),MessageIcon=React.createClass({displayName:"MessageIcon",render:function(){return React.createElement("div",null,React.createElement(Icon,{setText:this.props.setText,user:this.props.message.user}))}}),MessageContent=React.createClass({displayName:"MessageContent",render:function(){return React.createElement("div",{className:"message-wrapper"},React.createElement(MessageInclusive,{message:this.props.message}))}}),MessageInclusive=React.createClass({displayName:"MessageInclusive",render:function(){switch(this.props.message.type){case"stamprize":return React.createElement("div",null,React.createElement("div",null,"stamprize"),React.createElement("blockquote",null,React.createElement(MessageEntry,{message:this.props.message.value})));default:return React.createElement(MessageRecursive,{message:this.props.message})}}}),MessageRecursive=React.createClass({displayName:"MessageRecursive",render:function(){return this.props.message.value.children?React.createElement("div",null,React.createElement("div",null,this.props.message.value.text),React.createElement("blockquote",null,React.createElement(MessageEntry,{message:this.props.message.value.children}))):React.createElement(MessageAnchorable,{message:this.props.message})}}),MessageAnchorable=React.createClass({displayName:"MessageAnchorable",render:function(){var e=this.props.message.value.text.split("\n").map(function(e){var t=e.match(/^quote>({.+})$/);if(t&&t.length>1)try{var a=JSON.parse(t[1]);return React.createElement("blockquote",{className:"rich-quote"},React.createElement(MessageEntry,{message:a}))}catch(s){return React.createElement("blockquote",null,React.createElement(AnchorizableText,{text:t[1]}))}return e.match(/^> /)?React.createElement("blockquote",null,React.createElement(AnchorizableText,{text:e.replace(/^> /,"")})):React.createElement(AnchorizableText,{text:e})});return React.createElement("div",null,e)}}),Stamps=React.createClass({displayName:"Stamps",render:function(){var e=this.props.stamps.map(function(e){return e.source=e.value,React.createElement(Stamp,{stamp:e})});return React.createElement("div",null,e)}}),Stamp=React.createClass({displayName:"Stamp",render:function(){var e=this.createContent();return React.createElement("button",{onClick:this.useStamp,className:"stamp"},e)},createContent:function(){var e=this.props.stamp.source.value.text||"",t=/((https?):\/\/|www\.)([a-z0-9-]+\.)+[a-z0-9:]+(\/[^\s<>"',;]*)?(jpe?g|png|gif)/gi,a=t.exec(e);return a?React.createElement("img",{src:a[0]}):e.length>this.maxlen?e.slice(0,this.maxlen)+"...":e},maxlen:15,useStamp:function(){chant.Send("stampuse",this.props.stamp.source.raw)}}),TextInput=React.createClass({displayName:"TextInput",getInitialState:function(){return{value:"",rows:3}},render:function(){return React.createElement("textarea",{id:"message-input",onKeyDown:this.onKeyDown,onChange:this.onChange,value:this.state.value,className:"materialize-textarea",placeholder:"Shift + ⏎ to newline"})},onChange:function(e){chant.clearUnread(),this.setState({value:e.target.value})},onKeyDown:function(e){var t=13,a=e.target.value;return e.shiftKey||e.which!=t?void 0:(chant.Send("message",a),this.setState({value:""}),e.preventDefault())},appendTextValue:function(e){if("function"!=typeof e){var t=this.state.value||"";return 0!==t.length?t+=" "+e:t=e+" ",void this.setState({value:t})}var a=e(this.state.value);this.setState({value:a})}}),__image=function(){var e=/((https?):\/\/|www\.)([a-z0-9-]+\.)+[a-z0-9:]+(\/[^\s<>"',;]*)?(jpe?g|png|gif)/gi,t=e.exec(this.props.text);if(t){var a=__arraynize(this.props.text,t[0],function(e){return React.createElement("a",{href:e,target:"_blank"},React.createElement("img",{src:e,className:"entry-image"}))});return this.setState({_c:a}),!0}},__link=function(){var e=/(https?):\/\/([_a-zA-Z0-9-.@&=!~*()\';/?:+$,%#]+)/gi,t=e.exec(this.props.text);if(t){$.ajax({url:"/api/v1/preview",data:{url:t[0]},success:function(e){(e.summary.title||e.summary.image||e.summary.description)&&this.setState({_c:React.createElement(WebPreview,{title:e.summary.title,image:e.summary.image,description:e.summary.description,url:e.summary.url})})}.bind(this)});var a=__arraynize(this.props.text,t[0],function(e){return React.createElement("a",{href:e,target:"_blank"},e)});return this.setState({_c:a}),!0}},__twitter=function(){var e=/(twitter.com)\/([^\/]+)\/status\/([0-9]+)/gi,t=e.exec(this.props.text);if(t&&!(t.length<4)){var a=t[3];$.ajax({url:"https://api.twitter.com/1/statuses/oembed.json?id="+String(a),method:"GET",dataType:"jsonp",success:function(e){e.html=e.html.replace('<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>',"");var t=React.createElement("div",{dangerouslySetInnerHTML:{__html:e.html}});this.setState({_c:t}),setTimeout(function(){twttr.widgets.load()},0)}.bind(this),error:function(e){console.log("twitter API error",e)}})}},__youtube=function(){var e=/https?:\/\/www.youtube.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/gi,t=e.exec(this.props.text);if(t){var a=__arraynize(this.props.text,t[0],function(e){var a="https://www.youtube.com/embed/"+t[1];return React.createElement("iframe",{width:"560",height:"225",src:a,frameborder:"0",allowfullscreen:!0})});return this.setState({_c:a}),!0}},__soundcloud=function(){var e=/(https?:\/\/soundcloud.com\/([^\/]+)\/([^\/]+))/gi,t=e.exec(this.props.text);if(t){var a=__arraynize(this.props.text,t[0],function(e){var a="https://w.soundcloud.com/player/?url="+t[0]+"&amp;visual=true";return React.createElement("iframe",{width:"100%",height:"225",scrolling:"no",frameborder:"no",src:a})});return this.setState({_c:a}),!0}},__mixcloud=function(){var e=/(https?:\/\/www.mixcloud.com\/([^\/]+)\/([^ ]+))/gi,t=e.exec(this.props.text);if(t){var a=__arraynize(this.props.text,t[0],function(e){var a="https://www.mixcloud.com/widget/iframe/?embed_type=widget_standard&feed="+encodeURIComponent(t[0]);return React.createElement("iframe",{width:"100%",height:"400",src:a})});return this.setState({_c:a}),!0}},__vine=function(){var e=/(https?:\/\/vine.co\/v\/[^\/]+)\/?.*/,t=e.exec(this.props.text);if(t){var a=__arraynize(this.props.text,t[0],function(e){return e+="/embed/simple",React.createElement("iframe",{src:e,width:"400",height:"400",frameborder:"0"})});return this.setState({_c:a}),!0}},__arraynize=function(e,t,a){if(e.trim()===t)return[a(t)];for(var s=[],n=e.split(t),i=0;i<n.length;i++)0!==n[i].length?i!==n.length-1?(s.push(n[i]),s.push(React.createElement("div",null,a(t)))):s.push(n[i]):s.push(a(t));return s},WebPreview=React.createClass({displayName:"WebPreview",render:function(){return React.createElement("div",{onClick:this.openURL,className:"web-preview clickable"},React.createElement("h6",{className:"web-preview-title"},this.props.title),React.createElement("div",{className:"box"},React.createElement("div",{className:"web-preview-image-wrap"},React.createElement("img",{className:"web-preview-image",src:this.props.image})),React.createElement("div",{className:"web-preview-description-wrap"},React.createElement("p",null,this.props.description))))},openURL:function(){window.open(this.props.url,"_blank")}}),chant=chant||{};chant._notification={__get:function(){return window.Notification?window.Notification:function(){return function(e,t){window.alert(t.body||"おだやかじゃないわね"),this.onclick=function(){},this.onclose=function(){}}}()}},chant.notify=function(e,t,a,s,n){s=s||function(){window.focus()},n=n||function(){},a&&(a=a.replace("_normal","_bigger"));var i=chant._notification.__get(),r=new i(t||"CHANT",{body:e||"おだやかじゃないわね",icon:a||"/public/img/icon.png"});r.onclick=s,r.onclose=n},chant.notifier={notify:function(e){if(e.user.id_str!=Config.myself.id_str){chant.addUnread();var t=new RegExp("@all|@"+Config.myself.screen_name);t.test(e.value.text)&&chant.notify(e.value.text,e.user.screen_name,e.user.profile_image_url)}}};var chant=chant||{};chant.__socket=null,chant.socket=function(e){return(!chant.__socket||e)&&(chant.__socket=new WebSocket("ws://"+Config.server.host+"/websocket/room/socket")),chant.__socket},chant.Send=function(e,t){("function"!=typeof t.trim||0!=t.trim().length)&&chant.socket().send(JSON.stringify({type:e,raw:t}))};var chant=chant||{};chant.Totsuzen=function(e){this.value=e,this.length=chant.Totsuzen.checkLength(e),this.head="＿",this.foot="￣",this.hat="人",this.shoe1="^",this.shoe2="Y",this.left="＞",this.right="＜"},chant.Totsuzen.prototype.getTopLine=function(){for(var e=[this.head],t=0;t<this.length;t++)e.push(this.hat);return e.push(this.head),e.join("")},chant.Totsuzen.prototype.getMiddleLine=function(){var e=[this.left," ",this.value," ",this.right];return e.join("")},chant.Totsuzen.prototype.getBottomLine=function(){for(var e=[],t=0;t<this.length;t++)e.push(this.shoe1,this.shoe2);return e=e.slice(1),e.unshift(this.foot),e.push(this.foot),e.join("")},chant.Totsuzen.prototype.toText=function(){return[this.getTopLine(),this.getMiddleLine(),this.getBottomLine()].join("\n")},chant.Totsuzen.checkLength=function(e){var t=0;return $.map(e.split(""),function(e){t+=chant.Totsuzen.isMultiByte(e)?2:3}),Math.floor(t/3)},chant.Totsuzen.isMultiByte=function(e){var t=e.charCodeAt(0);return t>=0&&129>t||63728==t||t>=65377&&65440>t||t>=63729&&63732>t?!0:!1},chant.Totsuzen.text=function(e){var t=new chant.Totsuzen(e);return t.toText()};var chant=chant||{};chant.isCurrentPage=!1,chant.addUnread=function(e){if(!chant.isCurrentPage){document.title="!"+document.title;var t=document.getElementById("favicon");t.setAttribute("href","/public/img/icon.chant.unread.mini.png")}},chant.clearUnread=function(e){document.title=document.title.replace(/!/g,"");var t=document.getElementById("favicon");t.setAttribute("href","/public/img/icon.chant.mini.png")};var Configs=React.createClass({displayName:"Configs",getInitialState:function(){return{display:!1,configs:{notes:{on:!1,cn:"fa fa-bell-slash fa-2x stealth hazy clickable"}}}},render:function(){return React.createElement("div",{id:"configs-wrapper",className:"display"},React.createElement("div",{"class":"configs-list"},React.createElement("i",{onClick:this.toggleNotification,className:this.state.configs.notes.cn})),React.createElement("div",{"class":"configs-list"},React.createElement("i",{onClick:this.signout,className:"fa fa-sign-out fa-2x stealth hazy clickable"})),React.createElement("div",{"class":"configs-list"},React.createElement("i",{onClick:this.github,className:"fa fa-github-square fa-2x stealth hazy clickable"})))},toggleConfig:function(){this.display=!this.display},signout:function(){window.confirm("logout?")&&(location.href="/logout")},github:function(){window.open("https://github.com/otiai10/chant/issues","_blank")},toggleNotification:function(){return window.Notification?(window.Notification.requestPermission(function(e){console.info("Notification permission status:",e)}),this.state.configs.notes={on:!this.state.configs.notes.on,cn:function(){return this.state.configs.notes.on?"fa fa-bell-slash fa-2x stealth hazy clickable":"fa fa-bell fa-2x stealth hazy clickable"}.bind(this)()},void this.setState({configs:this.state.configs})):window.alert("undefined window.Notification")}}),Contents=React.createClass({displayName:"Contents",componentDidMount:function(){console.info("Desktop build : _chant.desktop.js"),$.get("/api/v1/room/default/stamps",function(e){this.setState({stamps:e.stamps})}.bind(this))},getInitialState:function(){return chant.socket().onopen=function(e){console.log("open",e)},chant.socket().onclose=function(e){console.log("close",e),chant.notify("disconnected with code: "+e.code)},chant.socket().onerror=function(e){console.log("error",e),chant.notify("ERROR!!")},chant.socket().onmessage=function(e){var t=JSON.parse(e.data);switch(t.type){case"message":this.newMessage(t);break;case"stamprize":this.newStamprize(t);break;case"join":this.join(t);break;case"leave":this.leave(t)}}.bind(this),{messages:[],stamps:[],members:{}}},setText:function(e,t){this.refs.TextInput.appendTextValue(e),t?this.refs.TextInput.getDOMNode().setSelectionRange(0,0):this.refs.TextInput.getDOMNode().focus()},newMessage:function(e){var t=[e].concat(this.state.messages);this.setState({messages:t}),chant.notifier.notify(e)},newStamprize:function(e){this.state.stamps.unshift(e),this.state.messages.unshift(e),this.setState({messages:this.state.messages,stamps:this.state.stamps})},join:function(e){this.state.members=e.value,delete this.state.members[Config.myself.id_str],this.setState({members:this.state.members})},leave:function(e){this.state.members=e.value,delete this.state.members[Config.myself.id_str],this.setState({members:this.state.members})},render:function(){this.state.messages.map(function(e,t){return React.createElement("div",{className:"entry",transitionName:"example"},React.createElement(Message,{message:e,id:t,key:t}))});return React.createElement("div",null,React.createElement("div",{className:"row"}),React.createElement("div",{className:"row"},React.createElement("div",{className:"col s12 members"},React.createElement("span",null,React.createElement(Icon,{setText:this.setText,user:this.props.myself})),React.createElement(Members,{setText:this.setText,members:this.state.members}))),React.createElement("div",{className:"row"},React.createElement("div",{className:"col s12 m6"},React.createElement(TextInput,{ref:"TextInput"})),React.createElement("div",{className:"col s12 m6"},React.createElement(Stamps,{stamps:this.state.stamps}))),React.createElement("div",{className:"row"},React.createElement("div",{className:"col s12 m8"},React.createElement(Messages,{setText:this.setText,messages:this.state.messages})),React.createElement("div",{className:"col s12 m4"})),React.createElement(Configs,{id:"configs"}))}}),Icon=React.createClass({displayName:"Icon",render:function(){return React.createElement("img",{onClick:this.onClick,src:this.props.user.profile_image_url,className:"user-icon"})},onClick:function(e){this.props.setText("@"+this.props.user.screen_name)}}),Members=React.createClass({displayName:"Members",render:function(){var e=[];for(var t in this.props.members)e.push(React.createElement(Icon,{setText:this.props.setText,user:this.props.members[t]}));return React.createElement("span",null,e)}}),ReactCSSTransitionGroup=React.addons.CSSTransitionGroup,Messages=React.createClass({displayName:"Messages",render:function(){var e=this.props.messages.map(function(e,t){return React.createElement(Message,{key:e.timestamp,setText:this.props.setText,message:e})}.bind(this));return React.createElement(ReactCSSTransitionGroup,{transitionName:"newentry"},e)}});