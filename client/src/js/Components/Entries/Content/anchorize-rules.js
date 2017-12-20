/* eslint react/display-name:0 no-console:0 */
/* global twttr:false */
import React from 'react';

import Entry from '../Entry';
import {EmbedImage, EmbedPage} from './WebEmbed';
import {
  SoundCloud,
} from './VendorEmbed';

export default  [
  // quote
  {
    match: /(\[quote:[-_a-zA-Z0-9]+\])/g,
    replace: function(sub, result) {
      const id = sub.match(/\[quote:([-_a-zA-Z0-9]+)\]/)[1];
      chant.firebase.database().ref(`messages/${id}`).once('value', snapshot => {
        if (!snapshot.val()) return result(<span>{sub}</span>);
        const message = {...snapshot.val(), id, type:'QUOTED'};
        result(<blockquote><Entry {...message} /></blockquote>);
      });
    }
  },
  // simple quote
  {
    match: /(^>.+$)/g,
    wrap: function(sub) {
      return <blockquote>{sub.replace(/^>/,'')}</blockquote>;
    },
  },
  // pinned
  {
    match: /(\[pinned:[-_a-zA-Z0-9]+\])/g,
    replace: function(sub, result) {
      const id = sub.match(/\[pinned:([-_a-zA-Z0-9]+)\]/)[1];
      chant.firebase.database().ref(`pins/${id}`).once('value', snapshot => {
        if (!snapshot.val()) return result(<span>{sub}</span>);
        const pin = {...snapshot.val(), id, type:'PIN_DETAIL'};
        result(<Entry {...pin} />);
      });
    }
  },
  // Mention
  {
    match: new RegExp(`(@${chant.user.name}|@all)`, 'g'),
    wrap: function(sub) {
      return <b>{sub}</b>;
    }
  },
  // SoundCloud
  {
    match: /(https?:\/\/soundcloud.com\/(?:[^\/]+)(?:\/sets)?\/(?:[^\/]+))/gi,
    wrap: function(sub) {
      return <SoundCloud src={sub}></SoundCloud>;
    }
  },
  // YouTube
  {
    match: /(https?:\/\/www.youtube.com\/watch\?.*v=[a-zA-Z0-9_-]{11})/gi,
    wrap: function(sub) {
      const exp = [/https?:\/\/youtu.be\/([a-zA-Z0-9_-]{11})/i, /https?:\/\/www.youtube.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/i];
      var m = exp[0].exec(sub);
      const id = (m) ? m[1] : exp[1].exec(sub)[1];
      return <iframe width="100%" style={{maxWidth:'520px'}} height="225" src={'https://www.youtube.com/embed/' + id} frameBorder="0" allowFullScreen></iframe>;
    }
  },
  // Twitter
  {
    match: /(https?:\/\/(?:mobile\.)?twitter.com\/[^\/]+\/status(?:es)?\/[0-9]+)/g,
    replace: function(sub, result) {
      fetch(`/api/tweets/embed?url=${encodeURIComponent(sub)}`, {
        method: 'GET',
        credentials: 'include',
      }).then(res => {
        return res.json();
      }).then(res => {
        res.html = res.html.replace('<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>', '');
        result(<div className="twitterwidget-wrapper" dangerouslySetInnerHTML={{__html:res.html}}></div>);
        setTimeout(function(){twttr.widgets.load();}, 0);
      }).catch(() => {
        // console.log(err);
      });
    }
  },
  // Application Uploads
  {
    match: /(\[uploads\/.+\])/,
    wrap: function(sub) {
      const img = sub.replace(/^\[/, '').replace(/\]$/, '');
      return <EmbedImage image={img} link={img} />;
    },
    replace: function(sub, replace) {
      const img = sub.replace(/^\[/, '').replace(/\]$/, '');
      setTimeout(() => replace(<EmbedImage image={img} link={img} />), 1000);
    }
  },
  // Explicit Images
  {
    match: /(https?:\/\/[_a-zA-Z0-9-.@&=!~*()\';/?:+$,%#]+\.(?:gif|png|jpeg|jpg)[_a-zA-Z0-9-.@&=!~*()\';/?:+$,%#]*)/gi,
    wrap: function(sub) {
      return <EmbedImage link={sub} image={sub} />;
    }
  },
  // Any URL (without image-like extensions)
  {
    match: /(https?:\/\/[_a-zA-Z0-9-.@&=!~*()\';/?:+$,%#]+)/gi,
    wrap: function(sub) {
      return <a href={sub} rel="noopener noreferrer" target="_blank">{sub}</a>;
    },
    replace: function(sub, replace) {
      fetch(`/api/messages/embed?url=${encodeURIComponent(sub)}`, {credentials:'include'})
      .then(res => res.json())
      .then(({embed}) => {
        if (!embed) return;
        switch (embed.type) {
        case 'image': return replace(<EmbedImage {...embed} />);
        case 'html':  return replace(<EmbedPage  {...embed} />);
        default:  console.info('[API][GET /embed]', embed);
        }
      }).catch(err => console.error('EMBED ERRORED', err));
    }
  },
  // Emoji
  {
    match: /(:[a-zA-Z0-9_-]+:)/g,
    wrap: (sub) => <i className={`twa twa-lg twa-${sub.slice(1, sub.length - 1)}`}></i>
  },
  {
    match: /(おっぱい)/g,
    wrap: (sub) => <b>{sub}</b>,
    replace: (sub, result) => {
      setTimeout(() => {
        result(<b style={{color:'tomato'}}>{sub}</b>);
      }, 5000 * Math.random());
    }
  },
];
