setTimeout(function(){chant.isCurrentPage=!0,React.render(React.createElement(Contents,{name:"CHANT",myself:Config.myself}),document.getElementById("container")),window.onfocus=function(){chant.clearUnread()},window.onblur=function(){chant.isCurrentPage=!1}},0);var chant=chant||{};chant["interface"]={impl:null,setImplement:function(e){chant["interface"].impl=e},open:function(e){return chant["interface"].impl.open(e)},defaultImplement:{open:function(e){return console.log("defaultImplement.open"),window.open(e,"_blank")}}},chant["interface"].impl=chant["interface"].defaultImplement;var chant=chant||{};chant._notification={__get:function(){return window.Notification?window.Notification:function(){return function(e,t){window.alert(t.body||"おだやかじゃないわね"),this.onclick=function(){},this.onclose=function(){}}}()}},chant.notify=function(e,t,a,n,s){if(chant.local.config.get("notification")){n=n||function(){window.focus()},s=s||function(){},a&&(a=a.replace("_normal","_bigger"));var c=chant._notification.__get(),i=new c(t||"CHANT",{body:e||"おだやかじゃないわね",icon:a||"/public/img/icon.png"});i.onclick=n,i.onclose=s}},chant.notifier={notify:function(e){if(e.user.id_str!=Config.myself.id_str){chant.addUnread();var t=new RegExp("@all|@"+Config.myself.screen_name);t.test(e.value.text)&&chant.notify(e.value.text,e.user.screen_name,e.user.profile_image_url)}}};var chant=chant||{};chant.__socket=null,chant.Send=function(e,t){("function"!=typeof t.trim||0!==t.trim().length)&&chant.Socket().send(JSON.stringify({type:e,raw:t}))},chant.delegate={onmessage:null,keepaliveID:null,iconMyself:null},chant.Socket=function(e){return null===chant.delegate.onmessage&&(chant.delegate.onmessage=chant.__socket&&chant.__socket.onmessage?chant.__socket.onmessage:null),e=2*(e||2),chant.__socket&&chant.__socket.readyState==WebSocket.OPEN||(chant.__socket=new WebSocket("ws://"+Config.server.host+"/websocket/room/socket?token="+Config.room.token)),chant.__socket.onopen=function(){e>4&&chant.notify("[RECONNECTED]\nreconnected successfully (o・∇・o)"),chant.delegate.iconMyself&&chant.delegate.iconMyself.setAttribute("class",chant.delegate.iconMyself.getAttribute("class").replace(" icon-disconnected","")),e=0,chant.delegate.onmessage&&(chant.__socket.onmessage=chant.delegate.onmessage),window.clearInterval(chant.delegate.keepaliveID),chant.delegate.keepaliveID=window.setInterval(function(){chant.__socket&&chant.__socket.readyState==WebSocket.OPEN&&chant.__socket.send(JSON.stringify({type:"keepalive"}))},1e4)},chant.__socket.onerror=function(){},chant.__socket.onclose=function(){console.log("[WEBSOCKET CLOSED]\nTry to reconnect "+moment.duration(1e3*e).seconds()+"seconds later"),chant.delegate.iconMyself=document.getElementsByClassName("icon-myself")[0];var t=chant.delegate.iconMyself.getAttribute("class");t.match("icon-disconnected")||chant.delegate.iconMyself.setAttribute("class",t+" icon-disconnected"),setTimeout(function(e){chant.Socket(e)}.bind(this,e),1e3*e)},chant.__socket};var chant=chant||{};chant.local={},chant.local.storageAccessor=function(e,t,a){this.ns=a||"chant",this.ns+="."+e;var n=window.localStorage.getItem(this.ns);if(void 0===n||null===n)window.localStorage.setItem(this.ns,JSON.stringify(t||{}));else try{var s=JSON.parse(n);for(var c in t||{})s[c]=void 0===s[c]?t[c]:s[c];window.localStorage.setItem(this.ns,JSON.stringify(s))}catch(i){console.error("chant.local.storageAccessor",e,i)}this.get=function(e,t){var a=JSON.parse(window.localStorage.getItem(this.ns))||{};return"undefined"!=typeof a[e]?a[e]:t},this.getAll=function(){var e=JSON.parse(window.localStorage.getItem(this.ns));return e},this.set=function(e,t){var a=this.getAll()||{};a[e]=t,this.setAll(a)},this.setAll=function(e){window.localStorage.setItem(this.ns,JSON.stringify(e))}},chant.local.config=function(){return new chant.local.storageAccessor("config",{notification:!1,mute:{}})}(),chant.local.history={index:-1,pool:[],push:function(e){chant.local.history.pool.push(e),chant.local.history.index=chant.local.history.pool.length},append:function(e){chant.local.history.pool.push(e)},prev:function(){if(0!==chant.local.history.pool.length){var e=chant.local.history.index-=1;return 0>e&&(chant.local.history.index=e=chant.local.history.pool.length-1),chant.local.history.pool[e]}},next:function(){if(0!==chant.local.history.pool.length){var e=chant.local.history.index+=1;return e>=chant.local.history.pool.length&&(chant.local.history.index=e=chant.local.history.pool.length-1),chant.local.history.pool[e]}}};var chant=chant||{};chant.Totsuzen=function(e){this.value=e,this.length=chant.Totsuzen.checkLength(e),this.head="＿",this.foot="￣",this.hat="人",this.shoe1="^",this.shoe2="Y",this.left="＞",this.right="＜"},chant.Totsuzen.prototype.getTopLine=function(){for(var e=[this.head],t=0;t<this.length;t++)e.push(this.hat);return e.push(this.head),e.join("")},chant.Totsuzen.prototype.getMiddleLine=function(){var e=[this.left," ",this.value," ",this.right];return e.join("")},chant.Totsuzen.prototype.getBottomLine=function(){for(var e=[],t=0;t<this.length;t++)e.push(this.shoe1,this.shoe2);return e=e.slice(1),e.unshift(this.foot),e.push(this.foot),e.join("")},chant.Totsuzen.prototype.toText=function(){return[this.getTopLine(),this.getMiddleLine(),this.getBottomLine()].join("\n")},chant.Totsuzen.checkLength=function(e){var t=0;return $.map(e.split(""),function(e){t+=chant.Totsuzen.isMultiByte(e)?2:3}),Math.floor(t/3)},chant.Totsuzen.isMultiByte=function(e){var t=e.charCodeAt(0);return t>=0&&129>t||63728==t||t>=65377&&65440>t||t>=63729&&63732>t?!0:!1},chant.Totsuzen.text=function(e){var t=new chant.Totsuzen(e);return t.toText()};var chant=chant||{};chant.isCurrentPage=!1,chant.addUnread=function(e){if(!chant.isCurrentPage){document.title="!"+document.title;var t=document.getElementById("favicon");t.setAttribute("href","/public/img/icon.chant.unread.mini.png")}},chant.clearUnread=function(e){document.title=document.title.replace(/!/g,"");var t=document.getElementById("favicon");t.setAttribute("href","/public/img/icon.chant.mini.png")};var Amesh=React.createClass({displayName:"Amesh",render:function(){return React.createElement("div",{className:"amesh-wrapper clickable",onClick:this.toAmesh},React.createElement("img",{className:"amesh-bg",src:this.props.entry.background}),React.createElement("img",{className:"amesh-rain",src:this.props.entry.rain}),React.createElement("img",{className:"amesh-dict",src:this.props.entry.dictionary}))},toAmesh:function(){chant["interface"].open(this.props.entry.url,"_blank")}}),AnchorizableText=React.createClass({displayName:"AnchorizableText",getInitialState:function(){this.props.rules=this.props.rules||[];var e=this.expandByRules([this.props.text]),t=[];return e.forEach(function(e,a){if("string"==typeof e)return t.push(React.createElement("span",null,e));"function"==typeof e.replace&&setTimeout(function(){e.replace.bind(this)(a,e.value)}.bind(this));var n=e.wrap.bind(this)(e.value);return t.push(React.createElement("span",null,n))}.bind(this)),{contents:t}},render:function(){return React.createElement("span",null,this.state.contents)},expandByRules:function(e){return this.props.rules?(this.props.rules.forEach(function(t,a){e=this.expandByRule(t,e)}.bind(this)),e):e},expandByRule:function(e,t){return function(t){var a=new RegExp(e.match),n=[];return t.forEach(function(t){return t.split?void t.split(a).forEach(function(t){if(0!==t.length){if(t.match(a)){var s=new AnchorizableText.Replacer(t);return"function"==typeof e.wrap&&(s.wrap=e.wrap),"function"==typeof e.replace&&(s.replace=e.replace),n.push(s)}return n.push(t)}}):n.push(t)}),n}(t)},replaceContentsOf:function(e,t){this.state.contents[e]=t,this.setState({contents:this.state.contents})}});AnchorizableText.Replacer=function(e){this.value=e,this.wrap=function(e){return React.createElement("a",{href:e,target:"_blank"},e)}};var defaultRules=[{match:/(https?:\/\/twitter.com\/[^\/]+\/status\/[0-9]+)/g,replace:function(e,t){var a=/(https?:\/\/twitter.com)\/([^\/]+)\/status\/([0-9]+)/gi,n=a.exec(t);if(n&&!(n.length<4)){var s=n[3];$.ajax({url:"https://api.twitter.com/1/statuses/oembed.json?id="+String(s),method:"GET",dataType:"jsonp",success:function(t){t.html=t.html.replace('<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>',""),this.replaceContentsOf(e,React.createElement("div",{dangerouslySetInnerHTML:{__html:t.html}})),setTimeout(function(){twttr.widgets.load()},0)}.bind(this),error:function(e){console.log("twitter API error",e)}})}}},{match:/(https?:\/\/vine.co\/v\/[^\/]+)\/?/,wrap:function(e){return React.createElement(Vine,{src:e})}},{match:/(https?:\/\/www.youtube.com\/watch\?.*v=[a-zA-Z0-9_-]{11})/gi,wrap:function(e){return React.createElement(YouTube,{src:e})}},{match:/(https?:\/\/youtu.be\/[a-zA-Z0-9_-]{11})/gi,wrap:function(e){return React.createElement(YouTube,{src:e})}},{match:/(https?:\/\/soundcloud.com\/(?:[^\/]+)\/(?:[^\/]+))/gi,wrap:function(e){return React.createElement(SoundCloud,{src:e})}},{match:/(https?:\/\/www.mixcloud.com\/(?:[^\/]+)\/(?:[^ ]+))/gi,wrap:function(e){return React.createElement(MixCloud,{src:e})}},{match:/(https?:\/\/[_a-zA-Z0-9-.@&=!~*()\';/?:+$,%#]+)/gi,wrap:function(e){return React.createElement(Link,{url:e,contents:e})},replace:function(e,t){$.ajax({url:"/api/v1/preview",data:{u:t},success:function(t){switch(t.content){case"image":var a=React.createElement("img",{src:t.url,className:"entry-image"});return void this.replaceContentsOf(e,React.createElement(Link,{url:t.url,contents:a}))}t.summary.title=t.summary.title||t.summary.url,t.summary.description=t.summary.description||t.summary.url,this.replaceContentsOf(e,React.createElement(WebPreview,{title:t.summary.title,image:t.summary.image,description:t.summary.description,url:t.summary.url}))}.bind(this)})}},{match:/(:[a-zA-Z0-9_\-+]+:)/g,wrap:function(e){Config.emojis[e];return Config.emojis[e]?React.createElement(Emoji,{name:e}):React.createElement("span",null,e)}},{match:/(おっぱい)/g,wrap:function(e){return React.createElement("b",null,e)}},{match:new RegExp("(@"+Config.myself.screen_name+"|@all)","g"),wrap:function(e){return React.createElement("b",null,e)}}],Link=React.createClass({displayName:"Link",render:function(){return React.createElement("a",{onClick:this.open,className:"clickable"},this.props.contents)},open:function(){return chant["interface"].open(this.props.url)}}),YouTube=React.createClass({displayName:"YouTube",render:function(){var e=this.getID(),t="https://www.youtube.com/embed/"+e;return React.createElement("iframe",{width:"100%",height:"225",src:t,frameborder:"0",allowfullscreen:!0})},getID:function(){var e=/https?:\/\/youtu.be\/([a-zA-Z0-9_-]{11})/gi.exec(this.props.src);return e?e[1]:/https?:\/\/www.youtube.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/.exec(this.props.src)[1]}}),SoundCloud=React.createClass({displayName:"SoundCloud",render:function(){var e="https://w.soundcloud.com/player/?url="+this.props.src+"&amp;visual=true";return React.createElement("iframe",{width:"100%",height:"225",scrolling:"no",frameborder:"no",src:e})}}),MixCloud=React.createClass({displayName:"MixCloud",render:function(){var e="https://www.mixcloud.com/widget/iframe/?embed_type=widget_standard&feed="+encodeURIComponent(this.props.src);return React.createElement("iframe",{width:"100%",height:"400",src:e})}}),Vine=React.createClass({displayName:"Vine",render:function(){var e=this.props.src+"/embed/simple";return React.createElement("iframe",{width:"100%",height:"300",frameborder:"0",src:e},"うんこ")}}),Emoji=React.createClass({displayName:"Emoji",render:function(){var e=this.props.name,t=Config.emojis[e],a=function(){var t=document.getElementById("message-input");t.value+=e,t.focus()};return React.createElement("img",{onClick:a,className:"emoji clickable",src:t,title:e})}}),EmojiList=React.createClass({displayName:"EmojiList",render:function(){var e=[];for(var t in Config.emojis)e.push(React.createElement(Emoji,{name:t}));return React.createElement("div",null,e)}}),Icon=React.createClass({displayName:"Icon",render:function(){var e={backgroundImage:"url("+this.props.user.profile_image_url+")"},t="user-icon-wrapper";return this.props.isMyself&&(t+=" icon-myself"),React.createElement("div",{onClick:this.onClick,className:t,style:e})},onClick:function(e){this.props.setText("@"+this.props.user.screen_name)}}),Message=React.createClass({displayName:"Message",render:function(){return React.createElement("div",{className:"entry"},React.createElement(MessageMeta,{setText:this.props.setText,message:this.props.message}),React.createElement(MessageEntry,{setText:this.props.setText,message:this.props.message}))}}),MessageEntry=React.createClass({displayName:"MessageEntry",render:function(){return React.createElement("div",{className:"box"},React.createElement(MessageIcon,{setText:this.props.setText,message:this.props.message}),React.createElement(MessageContent,{message:this.props.message}))}}),MessageMeta=React.createClass({displayName:"MessageMeta",render:function(){var e=moment(this.props.message.timestamp/1e6).format("YYYY/MM/DD HH:mm:ss"),t=[React.createElement("span",{onClick:this.quote,className:"meta"},React.createElement("small",{className:"grey-text text-lighten-2"},e))];switch(this.props.message.type){case"message":t.push(React.createElement("span",{onClick:this.stamprize,className:"meta stealth"},React.createElement("small",{className:"grey-text text-lighten-2"},"stamprize")),React.createElement("span",{onClick:this.totsuzenize,className:"meta stealth"},React.createElement("small",{className:"grey-text text-lighten-2"},"totsuzenize")),React.createElement("span",{onClick:this.mute,className:"meta stealth"},React.createElement("small",{className:"grey-text text-lighten-2"},"mute")))}return React.createElement("div",{className:"meta-wrapper"},t)},stamprize:function(){chant.Send("stamprize",JSON.stringify(this.props.message)),document.getElementsByTagName("textarea")[0].focus(),chant.clearUnread()},totsuzenize:function(){chant.Send("message",chant.Totsuzen.text(this.props.message.value.text))},quote:function(){var e=JSON.stringify(this.props.message);this.props.setText(function(t){return t?t+"\nquote>"+e+"\n":"\nquote>"+e+"\n"},!0)},mute:function(){var e=this.props.message.value.text,t=chant.local.config.get("mute");t[e]=1,chant.local.config.set("mute",t),chant.Send("mute",JSON.stringify(this.props.message))}}),MessageIcon=React.createClass({displayName:"MessageIcon",render:function(){return React.createElement("div",null,React.createElement(Icon,{setText:this.props.setText,user:this.props.message.user}))}}),MessageContent=React.createClass({displayName:"MessageContent",render:function(){return React.createElement("div",{className:"message-wrapper"},React.createElement(MessageInclusive,{message:this.props.message}))}}),MessageInclusive=React.createClass({displayName:"MessageInclusive",render:function(){switch(this.props.message.type){case"amesh":return React.createElement(Amesh,{entry:this.props.message.value});case"stamprize":return React.createElement("div",null,React.createElement("div",null,"stamprize"),React.createElement("blockquote",null,React.createElement(MessageEntry,{message:this.props.message.value})));case"mute":return React.createElement("div",null,React.createElement("div",null,"mute"),React.createElement("blockquote",null,React.createElement(MessageEntry,{message:this.props.message.value})));case"unmute":return React.createElement("div",null,React.createElement("div",null,"unmute"),React.createElement("blockquote",null,React.createElement(MessageEntry,{message:this.props.message.value})));default:return React.createElement(MessageRecursive,{message:this.props.message})}}}),MessageRecursive=React.createClass({displayName:"MessageRecursive",render:function(){return this.props.message.value&&this.props.message.value.children?React.createElement("div",null,React.createElement("div",null,this.props.message.value.text),React.createElement("blockquote",null,React.createElement(MessageEntry,{message:this.props.message.value.children}))):React.createElement(MessageAnchorable,{message:this.props.message})}}),MessageAnchorable=React.createClass({displayName:"MessageAnchorable",render:function(){if(chant.local.config.get("mute")[this.props.message.value.text])return React.createElement(Muted,{message:this.props.message});var e=this.props.message.value.text.split("\n").map(function(e){var t=e.match(/^quote>({.+})$/);if(t&&t.length>1)try{var a=JSON.parse(t[1]);return React.createElement("blockquote",{className:"rich-quote"},React.createElement(MessageEntry,{message:a}))}catch(n){return React.createElement("blockquote",null,React.createElement(AnchorizableText,{rules:defaultRules,text:t[1]}))}return e.match(/^> /)?React.createElement("blockquote",null,React.createElement(AnchorizableText,{rules:defaultRules,text:e.replace(/^> /,"")})):React.createElement("p",{className:"line-wrap"},React.createElement(AnchorizableText,{rules:defaultRules,text:e}))});return React.createElement("div",null,e)}}),Muted=React.createClass({displayName:"Muted",render:function(){return React.createElement("div",{onClick:this.unmute,className:"muted-contents clickable"},React.createElement("i",{className:"fa fa-ban"},"あかんやつ"))},unmute:function(){if(window.confirm("unmute?\n"+this.props.message.value.text)){var e=chant.local.config.get("mute");delete e[this.props.message.value.text],chant.local.config.set("mute",e),chant.Send("unmute",JSON.stringify(this.props.message))}}}),Stamps=React.createClass({displayName:"Stamps",render:function(){var e=[];return this.props.stamps.forEach(function(t,a){t.source=t.value,e.push(React.createElement(Stamp,{stamp:t,key:a}))}),React.createElement("div",null,e)}}),Stamp=React.createClass({displayName:"Stamp",render:function(){var e=this.props.stamp.source.value.text.split("\n").join("");return React.createElement("button",{onClick:this.useStamp,className:"stamp"},React.createElement(AnchorizableText,{rules:stampContentRules,text:e}))},useStamp:function(){chant.Send("stampuse",this.props.stamp.source.raw)}}),stampContentRules=[{match:/((?:(?:https?):\/\/|www\.)(?:[a-z0-9-]+\.)+[a-z0-9:]+(?:\/[^\s<>"',;]*)?(?:jpe?g|png|gif))/gi,wrap:function(e){return React.createElement("img",{src:e})}},{match:/(:[a-zA-Z0-9_\-+]+:)/g,wrap:function(e){var t=Config.emojis[e];return Config.emojis[e]?React.createElement("img",{src:t}):React.createElement("span",null,e)}},{match:/(.{12,})/g,wrap:function(e){return e=e.slice(0,12)+"...",React.createElement("span",null,e)}}],WebPreview=React.createClass({displayName:"WebPreview",render:function(){return React.createElement("div",{onClick:this.openURL,className:"web-preview clickable"},React.createElement("div",{className:"web-preview-title"},React.createElement("a",null,this.props.title)),React.createElement("div",{className:"box"},React.createElement("div",{className:"web-preview-image-wrap"},React.createElement("img",{className:"web-preview-image",src:this.props.image})),React.createElement("div",{className:"web-preview-description-wrap"},React.createElement("p",null,this.props.description))))},openURL:function(){chant["interface"].open(this.props.url)}}),Configs=React.createClass({displayName:"Configs",notes:function(e){return e?{on:!0,cn:"fa fa-bell fa-2x stealth hazy clickable"}:{on:!1,cn:"fa fa-bell-slash fa-2x stealth hazy clickable"}},getInitialState:function(){var e=chant.local.config.get("notification");return{display:!1,configs:{notes:this.notes(e)}}},render:function(){return React.createElement("div",{id:"configs-wrapper",className:"display"},React.createElement("div",{"class":"configs-list"},React.createElement("i",{onClick:this.toggleEmojiList,className:"fa fa-meh-o fa-2x stealth hazy clickable"})),React.createElement("div",{"class":"configs-list"},React.createElement("i",{onClick:this.toggleNotification,className:this.state.configs.notes.cn})),React.createElement("div",{"class":"configs-list"},React.createElement("i",{onClick:this.signout,className:"fa fa-sign-out fa-2x stealth hazy clickable"})),React.createElement("div",{"class":"configs-list"},React.createElement("i",{onClick:this.github,className:"fa fa-github-square fa-2x stealth hazy clickable"})))},toggleConfig:function(){this.display=!this.display},signout:function(){window.confirm("logout?")&&(location.href="/logout")},github:function(){window.open("https://github.com/otiai10/chant/issues","_blank")},toggleNotification:function(){return window.Notification?(window.Notification.requestPermission(function(e){console.info("Notification permission status:",e)}),this.state.configs.notes=this.notes(!this.state.configs.notes.on),this.setState({configs:this.state.configs}),void chant.local.config.set("notification",this.state.configs.notes.on)):window.alert("undefined window.Notification")},toggleEmojiList:function(){var e=document.getElementById("emoji-list-wrapper");e.hidden=!e.hidden}}),Contents=React.createClass({displayName:"Contents",componentDidMount:function(){console.info("Desktop build : _chant.desktop.js"),$.get("/api/v1/room/default/stamps",{token:Config.room.token,name:Config.room.name},function(e){this.setState({stamps:e.stamps})}.bind(this)),$.get("/api/v1/room/default/messages",{token:Config.room.token,name:Config.room.name},function(e){this.setState({messages:e.messages.reverse()})}.bind(this)),React.render(React.createElement(EmojiList,null),document.getElementById("emoji-list-wrapper"))},closeEmojiList:function(){document.getElementById("emoji-list-wrapper").hidden=!0},getInitialState:function(){return chant.Socket().onmessage=function(e){var t=JSON.parse(e.data);switch(t.type){case"message":case"amesh":case"mute":case"unmute":this.newMessage(t);break;case"stamprize":this.newStamprize(t);break;case"join":this.join(t);break;case"leave":this.leave(t)}}.bind(this),{messages:[],stamps:[],members:{}}},setText:function(e,t){this.refs.TextInput.appendTextValue(e),this.refs.TextInput.getDOMNode().focus(),t&&setTimeout(function(){document.getElementById("message-input").setSelectionRange(0,0)})},totsuzenize:function(){this.refs.TextInput.totsuzenize()},stamprize:function(){this.refs.TextInput.stamprize()},newMessage:function(e){var t=[e].concat(this.state.messages);this.setState({messages:t}),chant.notifier.notify(e)},newStamprize:function(e){this.state.stamps.unshift(e),this.state.messages.unshift(e);var t=this.state.stamps;this.setState({messages:this.state.messages,stamps:[]}),this.setState({stamps:t})},join:function(e){this.state.members=e.value,delete this.state.members[Config.myself.id_str],this.setState({members:this.state.members})},leave:function(e){this.state.members=e.value,delete this.state.members[Config.myself.id_str],this.setState({members:this.state.members})},render:function(){this.state.messages.map(function(e,t){return React.createElement("div",{className:"entry",transitionName:"example"},React.createElement(Message,{message:e,id:t,key:t}))});return React.createElement("div",null,React.createElement("div",{className:"row"},React.createElement("div",{id:"emoji-list-wrapper",onClick:this.closeEmojiList,className:"clickable",hidden:"true"})),React.createElement("div",{className:"row"},React.createElement("div",{className:"col s12 members"},React.createElement("span",null,React.createElement(Icon,{setText:this.setText,isMyself:!0,user:this.props.myself})),React.createElement(Members,{setText:this.setText,members:this.state.members}))),React.createElement("div",{className:"row",id:"input-actions"},React.createElement("div",{className:"col s12 m8"},React.createElement(TextInput,{ref:"TextInput"})),React.createElement("div",{className:"col s12 m4"},React.createElement("button",{onClick:this.totsuzenize,className:"stealth clickable text-decorate"},"totsuzenize"),React.createElement("button",{onClick:this.stamprize,className:"stealth clickable text-decorate"},"stamprize"))),React.createElement("div",{className:"row"},React.createElement("div",{className:"col s12"},React.createElement(Stamps,{stamps:this.state.stamps}))),React.createElement("div",{className:"row"},React.createElement("div",{className:"col s12 m8"},React.createElement(Messages,{setText:this.setText,messages:this.state.messages})),React.createElement("div",{className:"col s12 m4"})),React.createElement(Configs,{id:"configs"}))}}),Members=React.createClass({displayName:"Members",render:function(){var e=[];for(var t in this.props.members)e.push(React.createElement(Icon,{setText:this.props.setText,user:this.props.members[t]}));return React.createElement("span",null,e)}}),ReactCSSTransitionGroup=React.addons.CSSTransitionGroup,Messages=React.createClass({displayName:"Messages",render:function(){var e=this.props.messages.map(function(e,t){return React.createElement(Message,{key:e.timestamp,setText:this.props.setText,message:e})}.bind(this));return React.createElement(ReactCSSTransitionGroup,{transitionName:"newentry"},e)}}),TextInput=React.createClass({displayName:"TextInput",getInitialState:function(){return{value:"",rows:3,draft:!0}},render:function(){return React.createElement("textarea",{id:"message-input",onKeyDown:this.onKeyDown,onChange:this.onChange,onDrop:this.filedrop,value:this.state.value,className:"materialize-textarea",placeholder:"Shift + ⏎ to newline",ref:"textarea"})},onChange:function(e){chant.clearUnread(),this.setState({value:e.target.value})},onKeyDown:function(e){var t=13,a=38,n=40,s=e.target.value;return e.shiftKey||e.which!=a?e.shiftKey||e.which!=n?e.shiftKey||e.which!=t?void(this.state.draft||this.setState({draft:!0})):(chant.Send("message",s),this.setState({value:""}),chant.local.history.push(s),e.preventDefault()):this.historyCompletion(1):(this.historyCompletion(-1),void(this.state.draft&&""!==this.state.value&&chant.local.history.append(this.state.value)))},filedrop:function(e){e.preventDefault(),e.stopPropagation();var t=e.nativeEvent.dataTransfer.files[0];if(t.type.match("^image")){var a=new FormData;a.append("oppai",t),a.append("name",t.name),$.ajax({url:"/api/v1/room/default/upload",type:"POST",data:a,processData:!1,contentType:!1,success:function(e){console.log("success",e)},error:function(e){console.log("error",e)}})}},historyCompletion:function(e){var t=e>0?chant.local.history.next():chant.local.history.prev();t&&this.setState({value:t,draft:!1})},appendTextValue:function(e){if("function"!=typeof e){var t=this.state.value||"";return 0!==t.length?t+=" "+e:t=e+" ",void this.setState({value:t})}var a=e(this.state.value);this.setState({value:a})},totsuzenize:function(){return String(this.state.value).length?(chant.Send("message",chant.Totsuzen.text(this.state.value)),this.setState({value:""}),this.refs.textarea.getDOMNode().focus()):this.refs.textarea.getDOMNode().focus()},stamprize:function(){return String(this.state.value).length?(chant.Send("stamprize",JSON.stringify({type:"message",raw:this.state.value,value:{text:this.state.value},user:Config.myself})),this.setState({value:""}),this.refs.textarea.getDOMNode().focus()):this.refs.textarea.getDOMNode().focus()}});