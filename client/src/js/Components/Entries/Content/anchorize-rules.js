/* eslint react/display-name:0 */
/* global twttr:false */
import React from 'react';

export default  [
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
  // URL
  {
    match: /(https?:\/\/[_a-zA-Z0-9-.@&=!~*()\';/?:+$,%#]+)/gi,
    wrap: function(sub) {
      return <a href={sub} rel="noopener noreferrer" target="_blank">{sub}</a>;
    },
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
