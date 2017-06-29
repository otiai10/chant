package controllers

import (
	"fmt"
	"net/http"
	"os"
)

// ServiceWorkerJavaScript ...
func ServiceWorkerJavaScript(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "text/javascript")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(serviceworker))
}

const serviceworker = `
importScripts("/public/js/sw.js");
self.addEventListener('install', function(ev) {
  ev.waitUntil(self.skipWaiting());
  console.log("INSTALLED!!");
});
self.addEventListener('activate', function(ev) {
  ev.waitUntil(self.clients.claim());
  console.log("ACTIVATED!!");
});
console.log("ROOT SERVICE WORKER RENDERED BY SERVER TO MANAGE SCOPE");
`

// ManifestJSON ...
func ManifestJSON(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, map[string]interface{}{
		"gcm_sender_id": os.Getenv("FIREBASE_MESSAGING_SENDER_ID"),
	})
}
