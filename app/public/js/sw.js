!function(e){function t(r){if(n[r])return n[r].exports;var s=n[r]={i:r,l:!1,exports:{}};return e[r].call(s.exports,s,s.exports,t),s.l=!0,s.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=123)}({123:function(e,t,n){"use strict";importScripts("https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js"),importScripts("https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js");var r={},s=function(e){r=e,firebase.initializeApp(r.firebase),firebase.messaging().setBackgroundMessageHandler(function(){})};self.addEventListener("message",function(e){var t=JSON.parse(e.data);switch(console.log("[sw]","message",t),t.action){case"init":return s(t.configs);default:console.log("DEFAULT??",t.action)}})}});