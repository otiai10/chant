setTimeout(function(){window.focused=!0,React.render(React.createElement(Contents,{name:"CHANT",myself:Config.myself}),document.getElementById("container"))},0);var chant=chant||{};chant.onfocusDelegate=function(e,t){e=e||function(){},window.onfocus=function(){window.focused=!0,chant.clearUnread(),e.call(t)}},window.onblur=function(){window.focused=!1};var chant=chant||{};chant._notification={__get:function(){return window.Notification?window.Notification:function(){return function(e,t){window.alert(t.body||"おだやかじゃないわね"),this.onclick=function(){},this.onclose=function(){},this.close=function(){}}}()},__sound:function(){var e=document.createElement("audio");return e.setAttribute("src","/public/sound/notification.mp3"),{play:function(){if(!(window.navigator.userAgent.indexOf("Firefox")>-1)){var t=parseInt(chant.local.config.get("notificationVolume"));e.volume=t/100,e.play()}}}}()},chant.notify=function(e,t,a,n,s,r){if(chant.local.config.get("notification")){r=r||function(){},a&&(a=a.replace("_normal","_bigger"));var i=chant._notification.__get(),c=new i(t||"CHANT",{body:e||"おだやかじゃないわね",icon:a||"/public/img/icon.png",requireInteraction:n&&!!chant.local.config.get("notificationStay")});c.onclick=s||function(){window.focus(),c.close()},c.onclose=r,chant._notification.__sound.play()}},chant.notifier={notify:function(e){if(e.user.id_str!=Config.myself.id_str){chant.addUnread();var t=chant.local.config.get("notificationRegExp"),a=new RegExp("@all|@"+Config.myself.screen_name),n=t?new RegExp(t):a;n.test(e.value.text)&&chant.notify(e.value.text,e.user.screen_name,e.user.profile_image_url,a.test(e.value.text))}}};var chant=chant||{};chant.__socket=null,chant.Send=function(e,t){"function"==typeof t.trim&&0===t.trim().length||chant.Socket().send(JSON.stringify({type:e,raw:t}))},chant.delegate={onmessage:null,keepaliveID:null,iconMyself:null},chant.Socket=function(e){if(null===chant.delegate.onmessage&&(chant.delegate.onmessage=chant.__socket&&chant.__socket.onmessage?chant.__socket.onmessage:null),e=2*(e||2),!chant.__socket||chant.__socket.readyState!=WebSocket.OPEN){var t=encodeURIComponent((new Date).toString().split(" ").splice(-2).join(" "));chant.__socket=new WebSocket("ws://"+Config.server.host+"/websocket/room/socket?token="+Config.room.token+"&tz="+t)}return chant.__socket.onopen=function(){chant.delegate.iconMyself&&chant.delegate.iconMyself.setAttribute("class",chant.delegate.iconMyself.getAttribute("class").replace(" icon-disconnected","")),e=0,chant.delegate.onmessage&&(chant.__socket.onmessage=chant.delegate.onmessage),window.clearInterval(chant.delegate.keepaliveID),chant.delegate.keepaliveID=window.setInterval(function(){chant.__socket&&chant.__socket.readyState==WebSocket.OPEN&&chant.__socket.send(JSON.stringify({type:"keepalive"}))},1e4)},chant.__socket.onerror=function(){},chant.__socket.onclose=function(){console.log("[WEBSOCKET CLOSED]\nTry to reconnect "+moment.duration(1e3*e).seconds()+"seconds later"),chant.delegate.iconMyself=document.getElementsByClassName("icon-myself")[0];var t=chant.delegate.iconMyself.getAttribute("class");t.match("icon-disconnected")||chant.delegate.iconMyself.setAttribute("class",t+" icon-disconnected"),setTimeout(function(e){chant.Socket(e)}.bind(this,e),1e3*e)},chant.__socket};var chant=chant||{};chant.local={},chant.local.storageAccessor=function(e,t,a){this.ns=a||"chant",this.ns+="."+e;var n=window.localStorage.getItem(this.ns);if(void 0===n||null===n)window.localStorage.setItem(this.ns,JSON.stringify(t||{}));else try{var s=JSON.parse(n);for(var r in t||{})s[r]=void 0===s[r]?t[r]:s[r];window.localStorage.setItem(this.ns,JSON.stringify(s))}catch(i){console.error("chant.local.storageAccessor",e,i)}this.get=function(e,t){var a=JSON.parse(window.localStorage.getItem(this.ns))||{};return"undefined"!=typeof a[e]?a[e]:t},this.getAll=function(){var e=JSON.parse(window.localStorage.getItem(this.ns));return e},this.set=function(e,t){var a=this.getAll()||{};a[e]=t,this.setAll(a)},this.setAll=function(e){window.localStorage.setItem(this.ns,JSON.stringify(e))}},chant.local.config=function(){return new chant.local.storageAccessor("config",{notification:!1,notificationVolume:40,mute:{}})}(),chant.local.history={index:-1,pool:[],push:function(e){chant.local.history.pool.push(e),chant.local.history.index=chant.local.history.pool.length},append:function(e){chant.local.history.pool.push(e)},prev:function(){if(0!==chant.local.history.pool.length){var e=chant.local.history.index-=1;return 0>e&&(chant.local.history.index=e=chant.local.history.pool.length-1),chant.local.history.pool[e]}},next:function(){if(0!==chant.local.history.pool.length){var e=chant.local.history.index+=1;return e>=chant.local.history.pool.length&&(chant.local.history.index=e=chant.local.history.pool.length-1),chant.local.history.pool[e]}}};var chant=chant||{};chant.Totsuzen=function(e){this.value=e,this.length=chant.Totsuzen.checkLength(e),this.head="＿",this.foot="￣",this.hat="人",this.shoe1="^",this.shoe2="Y",this.left="＞",this.right="＜"},chant.Totsuzen.prototype.getTopLine=function(){for(var e=[this.head],t=0;t<this.length;t++)e.push(this.hat);return e.push(this.head),e.join("")},chant.Totsuzen.prototype.getMiddleLine=function(){var e=[this.left," ",this.value," ",this.right];return e.join("")},chant.Totsuzen.prototype.getBottomLine=function(){for(var e=[],t=0;t<this.length;t++)e.push(this.shoe1,this.shoe2);return e=e.slice(1),e.unshift(this.foot),e.push(this.foot),e.join("")},chant.Totsuzen.prototype.toText=function(){return[this.getTopLine(),this.getMiddleLine(),this.getBottomLine()].join("\n")},chant.Totsuzen.checkLength=function(e){var t=0;return $.map(e.split(""),function(e){t+=chant.Totsuzen.isMultiByte(e)?2:3}),Math.floor(t/3)},chant.Totsuzen.isMultiByte=function(e){var t=e.charCodeAt(0);return t>=0&&129>t||63728==t||t>=65377&&65440>t||t>=63729&&63732>t},chant.Totsuzen.text=function(e){var t=new chant.Totsuzen(e);return t.toText()};var chant=chant||{};chant.addUnread=function(e){if(!window.focused){document.title="!"+document.title;var t=document.getElementById("favicon");t.setAttribute("href","/public/img/icon.chant.unread.mini.png")}},chant.clearUnread=function(e){document.title=document.title.replace(/!/g,"");var t=document.getElementById("favicon");t.setAttribute("href","/public/img/icon.chant.mini.png")};var Amesh=React.createClass({displayName:"Amesh",render:function(){return React.createElement("div",{className:"amesh-wrapper clickable",onClick:this.toAmesh},React.createElement("img",{className:"amesh-bg",src:this.props.entry.background}),React.createElement("img",{className:"amesh-rain",src:this.props.entry.rain}),React.createElement("img",{className:"amesh-dict",src:this.props.entry.dictionary}))},toAmesh:function(){window.open(this.props.entry.url,"_blank")}}),AnchorizableText=React.createClass({displayName:"AnchorizableText",getInitialState:function(){this.props.rules=this.props.rules||[];var e=this.expandByRules([this.props.text]),t=[];return e.forEach(function(e,a){if("string"==typeof e)return t.push(React.createElement("span",null,e));"function"==typeof e.replace&&setTimeout(function(){e.replace.bind(this)(a,e.value)}.bind(this));var n=e.wrap.bind(this)(e.value);return t.push(React.createElement("span",null,n))}.bind(this)),{contents:t}},render:function(){return React.createElement("span",null,this.state.contents)},expandByRules:function(e){return this.props.rules?(this.props.rules.forEach(function(t,a){e=this.expandByRule(t,e)}.bind(this)),e):e},expandByRule:function(e,t){return function(t){var a=new RegExp(e.match),n=[];return t.forEach(function(t){return t.split?void t.split(a).forEach(function(t){if(0!==t.length){if(t.match(a)){var s=new AnchorizableText.Replacer(t);return"function"==typeof e.wrap&&(s.wrap=e.wrap),"function"==typeof e.replace&&(s.replace=e.replace),n.push(s)}return n.push(t)}}):n.push(t)}),n}(t)},replaceContentsOf:function(e,t){this.state.contents[e]=t,this.setState({contents:this.state.contents})}});AnchorizableText.Replacer=function(e){this.value=e,this.wrap=function(e){return React.createElement("a",{href:e,target:"_blank"},e)}};var defaultRules=[{match:/(https?:\/\/(?:mobile\.)?twitter.com\/[^\/]+\/status(?:es)?\/[0-9]+)/g,replace:function(e,t){var a=/(?:https?:\/\/(?:mobile\.)?twitter.com)\/(?:[^\/]+)\/status(?:es)?\/([0-9]+)/gi,n=a.exec(t);if(n&&!(n.length<2)){var s=n[1];$.ajax({url:"https://api.twitter.com/1/statuses/oembed.json?id="+String(s),method:"GET",dataType:"jsonp",success:function(t){t.html=t.html.replace('<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>',""),this.replaceContentsOf(e,React.createElement("div",{dangerouslySetInnerHTML:{__html:t.html}})),setTimeout(function(){twttr.widgets.load()},0)}.bind(this),error:function(e){console.log("twitter API error",e)}})}}},{match:/(https?:\/\/vine.co\/v\/[^\/]+)\/?/,wrap:function(e){return React.createElement(Vine,{src:e})}},{match:/(https?:\/\/www.youtube.com\/watch\?.*v=[a-zA-Z0-9_-]{11})/gi,wrap:function(e){return React.createElement(YouTube,{src:e})}},{match:/(https?:\/\/youtu.be\/[a-zA-Z0-9_-]{11})/gi,wrap:function(e){return React.createElement(YouTube,{src:e})}},{match:/(https?:\/\/soundcloud.com\/(?:[^\/]+)(?:\/sets)?\/(?:[^\/]+))/gi,wrap:function(e){return React.createElement(SoundCloud,{src:e})}},{match:/(https?:\/\/www.mixcloud.com\/(?:[^\/]+)\/(?:[^ ]+))/gi,wrap:function(e){return React.createElement(MixCloud,{src:e})}},{match:/(https?:\/\/[_a-zA-Z0-9-.@&=!~*()\';\/?:+$,%#]+)/gi,wrap:function(e){return React.createElement("a",{href:e,target:"_blank"},e)},replace:function(e,t){$.ajax({url:"/api/v1/preview",data:{u:t},success:function(t){switch(t.content){case"image":return this.replaceContentsOf(e,React.createElement("a",{href:t.url,target:"_blank"},React.createElement("img",{src:t.url,className:"entry-image"})));case"video":return this.replaceContentsOf(e,React.createElement("video",{src:t.url,className:"entry-video",loop:!0,controls:!0}))}t.summary.title=t.summary.title||t.summary.url,t.summary.description=t.summary.description||t.summary.url,this.replaceContentsOf(e,React.createElement(WebPreview,{title:t.summary.title,image:t.summary.image,description:t.summary.description,url:t.summary.url}))}.bind(this)})}},{match:/(:[a-zA-Z0-9_\-+]+:)/g,wrap:function(e){Config.emojis[e];return Config.emojis[e]?React.createElement(Emoji,{name:e}):React.createElement("span",null,e)}},{match:/(おっぱい)/g,wrap:function(e){return React.createElement("b",null,e)}},{match:new RegExp("(@"+Config.myself.screen_name+"|@all)","g"),wrap:function(e){return React.createElement("b",null,e)}}];!function(){if(Config.apis.googlemaps){var e=Config.apis.googlemaps,t="https://www.google.com/maps/embed/v1";defaultRules.unshift({match:/(https?:\/\/www\.google\.co\.jp\/maps.*)/gi,wrap:function(a){if(a.match(/\/place\/([^\/]+)\//)){var n=a.match(/\/place\/([^\/]+)\//)[1],s=t+"/place?q="+n+"&zoom=15&key="+e;return React.createElement("iframe",{width:"100%",height:"450",frameborder:"0",style:{border:0},src:s})}return React.createElement("a",{href:a,target:"_blank"},a)}})}}();var YouTube=React.createClass({displayName:"YouTube",render:function(){var e=this.getID(),t="https://www.youtube.com/embed/"+e;return React.createElement("iframe",{width:"100%",height:"225",src:t,frameborder:"0",allowfullscreen:!0})},getID:function(){var e=/https?:\/\/youtu.be\/([a-zA-Z0-9_-]{11})/gi.exec(this.props.src);return e?e[1]:/https?:\/\/www.youtube.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/.exec(this.props.src)[1]}}),SoundCloud=React.createClass({displayName:"SoundCloud",render:function(){var e=this.props.src.match(/\/sets\//)?460:225,t="https://w.soundcloud.com/player/?url="+this.props.src+"&amp;visual=true";return React.createElement("iframe",{width:"100%",height:e,scrolling:"no",frameborder:"no",src:t})}}),MixCloud=React.createClass({displayName:"MixCloud",render:function(){var e="https://www.mixcloud.com/widget/iframe/?embed_type=widget_standard&feed="+encodeURIComponent(this.props.src);return React.createElement("iframe",{width:"100%",height:"400",src:e})}}),Vine=React.createClass({displayName:"Vine",render:function(){var e=this.props.src+"/embed/simple";return React.createElement("iframe",{width:"100%",height:"300",frameborder:"0",src:e},"うんこ")}}),Emoji=React.createClass({displayName:"Emoji",render:function(){var e=this.props.name,t=Config.emojis[e],a=function(){var t=document.getElementById("message-input");t.value+=e,t.focus()};return React.createElement("img",{onClick:a,onKeyPress:a,tabIndex:"0",className:"emoji clickable",src:t,title:e})}}),EmojiList=React.createClass({displayName:"EmojiList",getInitialState:function(){var e=[];for(var t in Config.emojis)e.push(React.createElement(Emoji,{name:t}));return{emojis:e,rerendering:!1}},render:function(){return React.createElement("div",null,React.createElement("div",null,React.createElement("input",{id:"emoji-search",type:"text",onChange:this.onInputChange})),React.createElement("div",null,this.state.emojis))},onInputChange:function(e){if(!this.rerendering){var t=[];this.replaceState({emojis:t,rerendering:!0});for(var a in Config.emojis)a.indexOf(e.target.value)<0||t.push(React.createElement(Emoji,{name:a}));this.setState({emojis:t,rerendering:!1})}}}),Icon=React.createClass({displayName:"Icon",render:function(){var e={backgroundImage:"url("+this.props.user.profile_image_url+")"},t="user-icon-wrapper";return this.props.isMyself&&(t+=" icon-myself"),React.createElement("div",{onClick:this.onClick,className:t,style:e})},onClick:function(e){this.props.setText("@"+this.props.user.screen_name)}}),Message=React.createClass({displayName:"Message",render:function(){return React.createElement("div",{className:"entry"},React.createElement(MessageMeta,{setText:this.props.setText,message:this.props.message}),React.createElement(MessageEntry,{setText:this.props.setText,message:this.props.message}))}}),MessageEntry=React.createClass({displayName:"MessageEntry",render:function(){return React.createElement("div",{className:"box"},React.createElement(MessageIcon,{setText:this.props.setText,message:this.props.message}),React.createElement(MessageContent,{setText:this.props.setText,message:this.props.message}))}}),MessageIcon=React.createClass({displayName:"MessageIcon",render:function(){return React.createElement("div",null,React.createElement(Icon,{setText:this.props.setText,user:this.props.message.user}))}}),MessageContent=React.createClass({displayName:"MessageContent",render:function(){return React.createElement("div",{className:"message-wrapper"},React.createElement(MessageInclusive,{setText:this.props.setText,message:this.props.message}))}}),MessageInclusive=React.createClass({displayName:"MessageInclusive",render:function(){switch(this.props.message.type){case"amesh":return React.createElement(Amesh,{entry:this.props.message.value});case"stamprize":return React.createElement(Stamprize,{message:this.props.message.value});case"mute":return React.createElement("div",null,React.createElement("div",null,"mute"),React.createElement("blockquote",null,React.createElement(MessageEntry,{setText:this.props.setText,message:this.props.message.value})));case"unmute":return React.createElement("div",null,React.createElement("div",null,"unmute"),React.createElement("blockquote",null,React.createElement(MessageEntry,{setText:this.props.setText,message:this.props.message.value})));case"stampuse":this.props.message.value=this.props.message.value.value||this.props.message.value;default:return React.createElement(MessageRecursive,{setText:this.props.setText,message:this.props.message})}}}),MessageRecursive=React.createClass({displayName:"MessageRecursive",render:function(){return this.props.message.value&&this.props.message.value.children?React.createElement("div",null,React.createElement("div",null,this.props.message.value.text),React.createElement("blockquote",null,React.createElement(MessageEntry,{setText:this.props.setText,message:this.props.message.value.children}))):React.createElement(MessageAnchorable,{setText:this.props.setText,message:this.props.message})}}),MessageAnchorable=React.createClass({displayName:"MessageAnchorable",render:function(){if(chant.local.config.get("mute")[this.props.message.value.text])return React.createElement(Muted,{message:this.props.message});var e=this.props.setText,t=this.props.message.value.text.split("\n").map(function(t){var a=t.match(/^quote>({.+})$/);if(a&&a.length>1)try{var n=JSON.parse(a[1]);return React.createElement("blockquote",{className:"rich-quote"},React.createElement(MessageEntry,{setText:e,message:n}))}catch(s){return React.createElement("blockquote",null,React.createElement(AnchorizableText,{rules:defaultRules,text:a[1]}))}return t.match(/^> /)?React.createElement("blockquote",null,React.createElement(AnchorizableText,{rules:defaultRules,text:t.replace(/^> /,"")})):React.createElement("p",{className:"line-wrap"},React.createElement(AnchorizableText,{rules:defaultRules,text:t}))});return React.createElement("div",null,t)}}),Muted=React.createClass({displayName:"Muted",render:function(){return React.createElement("div",{onClick:this.unmute,className:"muted-contents clickable"},React.createElement("i",{className:"fa fa-ban"},"あかんやつ"))},unmute:function(){if(window.confirm("unmute?\n"+this.props.message.value.text)){var e=chant.local.config.get("mute");delete e[this.props.message.value.text],chant.local.config.set("mute",e),chant.Send("unmute",JSON.stringify(this.props.message))}}}),Stamps=React.createClass({displayName:"Stamps",render:function(){var e=[];return this.props.stamps.forEach(function(t,a){t.source=t.value,e.push(React.createElement(Stamp,{stamp:t,key:a}))}),React.createElement("div",null,e)}}),Stamp=React.createClass({displayName:"Stamp",getInitialState:function(){return{left:!1}},render:function(){var e=this.props.stamp.source.value.text.split("\n").join("");return React.createElement("button",{onClick:this.useStamp,onMouseOver:this.showStampPreview,onMouseOut:this.remStampPreview,className:"stamp"},React.createElement(AnchorizableText,{rules:stampContentRules,text:e}))},useStamp:function(){chant.Send("stampuse",JSON.stringify(this.props.stamp.source))},showStampPreview:function(){var e=document.getElementById("message-input-preview");e&&this.props.stamp.source.value.text.match("https?://")&&(e.style.backgroundImage='url("'+this.props.stamp.source.value.text+'")')},remStampPreview:function(){this.setState({left:!0});var e=document.getElementById("message-input-preview");e&&(e.style.backgroundImage="")}}),stampContentRules=[{match:/((?:(?:https?):\/\/|www\.)(?:[a-z0-9-]+\.)+[a-z0-9:]+(?:\/[^\s<>"',;]*)?(?:jpe?g|png|gif))/gi,wrap:function(e){return React.createElement("img",{src:e})}},{match:/(:[a-zA-Z0-9_\-+]+:)/g,wrap:function(e){var t=Config.emojis[e];return Config.emojis[e]?React.createElement("img",{src:t}):React.createElement("span",null,e)}},{match:/(.{12,})/g,wrap:function(e){return e=e.slice(0,12)+"...",React.createElement("span",null,e)}}],Stamprize=React.createClass({displayName:"Stamprize",render:function(){return React.createElement("div",null,React.createElement("div",null,"stamprize"),React.createElement("blockquote",null,React.createElement(MessageEntry,{message:this.props.message})))}}),WebPreview=React.createClass({displayName:"WebPreview",render:function(){return React.createElement("div",{onClick:this.openURL,className:"web-preview clickable"},React.createElement("div",{className:"web-preview-title"},React.createElement("a",null,this.props.title)),React.createElement("div",{className:"box"},React.createElement("div",{className:"web-preview-image-wrap"},React.createElement("img",{className:"web-preview-image",src:this.props.image})),React.createElement("div",{className:"web-preview-description-wrap"},React.createElement("p",null,this.props.description))))},openURL:function(){window.open(this.props.url,"_blank")}}),chant=chant||{},Contents=React.createClass({displayName:"Contents",onfocus:function(){Promise.resolve().then(function(){return this.setState({loading:1}),Promise.resolve()}.bind(this)).then(function(){return Promise.all([new Promise(function(e){$.get("/api/v1/room/default/messages",{token:Config.room.token,name:Config.room.name},e)}),new Promise(function(e){setTimeout(e,500,!0)})])}).then(function(e){var t=e[0].messages;if(0==t.length)return"do nothing";if(0!=this.state.messages.length)for(var a=0;a<this.state.messages.length;a++)t[0].timestamp>this.state.messages[a].timestamp&&t.unshift(this.state.messages[a]);return this.setState({messages:t.reverse()}),Promise.resolve()}.bind(this)).then(function(){chant.Socket(0),this.setState({loading:0})}.bind(this))["catch"](function(){this.setState({loading:0})}.bind(this))},componentDidMount:function(){console.info("Mobile build : _chant.mobile.js"),$.get("/api/v1/room/default/messages",{token:Config.room.token,name:Config.room.name},function(e){this.setState({messages:e.messages.reverse()})}.bind(this)),chant.onfocusDelegate(this.onfocus,this)},getInitialState:function(){var e=this;return chant.Socket().onmessage=function(t){var a=JSON.parse(t.data);switch(a.type){case"message":case"amesh":case"stampuse":e.newMessage(a);break;case"join":e.join(a);break;case"leave":e.leave(a);break;case"kick":if(a.value==Config.myself.screen_name)return window.alert("kicked :("),window.location.reload();a.type="message",a.value={text:a.raw},e.newMessage(a)}},{loading:!1,messages:[],stamps:[],members:{}}},setText:function(e,t){this.refs.TextInput.appendTextValue(e),this.refs.TextInput.getDOMNode().focus(),t&&setTimeout(function(){document.getElementById("message-input").setSelectionRange(0,0)})},newMessage:function(e){var t=[e].concat(this.state.messages);this.setState({messages:t}),chant.notifier.notify(e)},newStamprize:function(e){this.state.stamps.unshift(e),this.state.messages.unshift(e),this.setState({messages:this.state.messages,stamps:this.state.stamps})},join:function(e){this.state.members=e.value,delete this.state.members[Config.myself.id_str],this.setState({members:this.state.members})},leave:function(e){this.state.members=e.value,delete this.state.members[Config.myself.id_str],this.setState({members:this.state.members})},render:function(){this.state.messages.map(function(e,t){return React.createElement("div",{className:"entry",transitionName:"example"},React.createElement(Message,{message:e,id:t,key:t}))});return React.createElement("div",{id:"contents-wrapper"},React.createElement("div",{className:"row members-wrapper"},React.createElement("div",{className:"col s12 members"},React.createElement("span",null,React.createElement(Icon,{setText:this.setText,user:this.props.myself})),React.createElement(Members,{setText:this.setText,members:this.state.members}))),React.createElement("div",{className:"row textinput-wrapper"},React.createElement("div",{className:"col s12 m8"},React.createElement(TextInput,{ref:"TextInput"})),React.createElement("div",{className:"col s12 m4"},React.createElement(Stamps,{stamps:this.state.stamps}))),React.createElement("div",{className:"row"},React.createElement("div",{className:"col s12 m12"},React.createElement(Messages,{setText:this.setText,messages:this.state.messages}))),1==this.state.loading?React.createElement("div",{id:"mobile-loader"},React.createElement("span",null,React.createElement("i",{className:"fa fa-refresh fa-spin"}))):null,2==this.state.loading?React.createElement("div",{id:"mobile-loader"},React.createElement("span",null,React.createElement("i",{className:"fa fa-check"}))):null)}}),Members=React.createClass({displayName:"Members",render:function(){var e=[];for(var t in this.props.members)e.push(React.createElement(Icon,{setText:this.props.setText,user:this.props.members[t]}));return React.createElement("span",null,e)}}),MessageMeta=React.createClass({displayName:"MessageMeta",render:function(){var e=moment(this.props.message.timestamp/1e6).format("YYYY/MM/DD HH:mm:ss"),t=[React.createElement("span",{onClick:this.quote,className:"meta"},React.createElement("small",{className:"grey-text text-lighten-1"},e))];return React.createElement("div",{className:"meta-wrapper"},t)},quote:function(){var e=JSON.stringify(this.props.message);this.props.setText(function(t){return t?t+"\nquote>"+e+"\n":"\nquote>"+e+"\n"},!0)}}),ReactCSSTransitionGroup=React.addons.CSSTransitionGroup,Messages=React.createClass({displayName:"Messages",render:function(){var e=this.props.messages.map(function(e,t){return React.createElement(Message,{key:e.timestamp,setText:this.props.setText,message:e})}.bind(this));return React.createElement(ReactCSSTransitionGroup,{transitionName:"newentry"},e)}}),TextInput=React.createClass({displayName:"TextInput",getInitialState:function(){return{value:"",rows:3,draft:!0,touchDown:!1}},render:function(){return React.createElement("div",null,React.createElement("textarea",{id:"message-input",onKeyDown:this.onKeyDown,onChange:this.onChange,value:this.state.value,className:"materialize-textarea",onTouchStart:this.touchStart,onTouchEnd:this.touchEnd,ref:"textarea"}),React.createElement("label",null,React.createElement("i",{className:"fa fa-file pull-right",id:"input-file-upload-proxy"}),React.createElement("input",{type:"file",ref:"inputFileUpload",accept:"image/*",id:"input-file-upload",onChange:this.fileChanged})))},compress:function(e){return Promise.resolve().then(function(){return new Promise(function(t){var a=new FileReader;a.onloadend=function(){var a=1;if(e.type.match("jpeg")){var n=EXIF.readFromBinaryFile(this.result);a=n.Orientation}t(a)},a.readAsArrayBuffer(e)})}).then(function(t){var a=5e5/e.size,n=URL.createObjectURL(e);return new Promise(function(e){var s=new Image;s.onload=function(){e({img:s,quality:a,orientation:t})},s.src=n})}).then(function(t){var a=t.img,n=t.quality,s=t.orientation,r=document.createElement("canvas"),i=r.getContext("2d");return new Promise(function(t){switch(s){case 6:r.height=a.width,r.width=a.height,i.translate(r.width/2,r.height/2),i.rotate(90*Math.PI/180),i.translate(-1*r.height/2,-1*r.width/2),i.drawImage(a,0,0);break;default:r.height=a.height,r.width=a.width,i.drawImage(a,0,0)}for(var c=atob(r.toDataURL("image/jpeg",n).split(",")[1]),o=new Uint8Array(c.length),l=0;l<c.length;l++)o[l]=c.charCodeAt(l);var u=new Blob([o.buffer],{type:"image/jpeg"});u.name=e.name+".jpg",t(u)})})},fileChanged:function(e){var t=e.target.files[0];t.type.match("^image")&&this.compress(t).then(function(e){var t=new FormData;t.append("oppai",e),t.append("name",e.name),$.ajax({url:"/api/v1/room/default/upload",type:"POST",data:t,processData:!1,contentType:!1,success:function(e){console.log("success",e)},error:function(e){window.alert(e.statusText)}})})},touchStart:function(){this.setState({touchDown:!0});setTimeout(function(){if(!this.state.touchDown)return console.info("Already Touch Up");this.setState({touchDown:!1});var e=document.getElementById("input-file-upload");e.click()}.bind(this),800)},touchEnd:function(e){return this.state.touchDown?void this.setState({touchDown:!1}):console.info("Already Touch Up")},onChange:function(e){chant.clearUnread(),this.setState({value:e.target.value})},onKeyDown:function(e){var t=13,a=e.target.value;return e.shiftKey||e.which!=t?void(this.state.draft||this.setState({draft:!0})):(chant.Send("message",a),this.setState({value:""}),document.getElementById("message-input").blur(),e.preventDefault())},historyCompletion:function(e){var t=e>0?chant.local.history.next():chant.local.history.prev();t&&this.setState({value:t,draft:!1})},appendTextValue:function(e){if("function"!=typeof e){var t=this.state.value||"";return 0!==t.length?t+=" "+e:t=e+" ",void this.setState({value:t})}var a=e(this.state.value);this.setState({value:a})},totsuzenize:function(){return String(this.state.value).length?(chant.Send("message",chant.Totsuzen.text(this.state.value)),this.setState({value:""}),this.refs.textarea.getDOMNode().focus()):this.refs.textarea.getDOMNode().focus()},stamprize:function(){return String(this.state.value).length?(chant.Send("stamprize",JSON.stringify({type:"message",raw:this.state.value,value:{text:this.state.value},user:Config.myself})),this.setState({value:""}),this.refs.textarea.getDOMNode().focus()):this.refs.textarea.getDOMNode().focus()}});