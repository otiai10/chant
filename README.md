# chant

[![Build Status](https://travis-ci.org/otiai10/chant.svg?branch=master)](https://travis-ci.org/otiai10/chant)

<img src="https://user-images.githubusercontent.com/931554/36833483-d9b53fb2-1d72-11e8-94b8-63efefa42fa7.png" width="80%" alt="Enjoy chatting, then work ;)"/>

# Deploy

```sh
# setup your secret varialbes
% vi app/secret.yaml
# Deploy it to GAE
% goapp deploy -application your-crazy-app app/
```

without AppEngine?

```sh
% go get github.com/otiai10/chant
% chant -secret you-secret.yaml
```

# Secret Variables

`app/secret.yaml` should be like this

```yaml
env_variables:
  # Server token salt,
  #     any string as you like
  JWT_SALT: w5Asjxxxxxxxxxxxxxx
  # For Twitter OAuth,
  #     obtained from "https://apps.twitter.com"
  TWITTER_CONSUMER_KEY: Keskxxxxxxxxxxxxxxxx
  TWITTER_CONSUMER_SECRET: Ub1c7sVPJJaxxxxxx
  # For Firebase,
  #     obtained from "https://console.firebase.google.com/"
  FIREBASE_API_KEY: AIzaSyCxxxxxxxxxxxxxxxxxxxxxx
  FIREBASE_AUTH_DOMAIN: your-crazy-app.firebaseapp.com
  FIREBASE_DB_URL: https://your-crazy-app.firebaseio.com
  FIREBASE_PROJECT_ID: your-crazy-app
  FIREBASE_STORAGE_BUCKET: your-crazy-app.appspot.com
  FIREBASE_MESSAGING_SENDER_ID: 72123123123123123123123
  # For Push Notification
  #     obtained from "General Settings" of "https://console.firebase.google.com"
  FCM_SERVER_KEY: AAAAqxxxx:adfadfadfasdfasdfadfadfadfadsfasdfas
```

# Development

```sh
# Build frontend JavaScript
yarn start
# Wake up the server on local
goapp server app
```

Better use **[`too` command](https://github.com/otiai10/too)** to parallelize both of them

```sh
% go get github.com/otiai10/too
% too -cmd "yarn start" -cmd "goapp serve app"
```

# Issues and questions

- https://github.com/otiai10/chant/issues
