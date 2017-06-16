# chant

Enjoy chatting ;)

# Deploy

```sh
% vi app/secret.yaml
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
```

# Development

```sh
% yarn start & goapp serve app
```
