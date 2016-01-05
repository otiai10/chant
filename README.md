chant
========

The very minimum chat application, by [Golang](http://golang.org/) and [Reactjs](https://facebook.github.io/react/).

![](/public/img/title.png)

ちゃんと仕事しよう

Install
========

```sh
# clone project
cd $GOPATH/src
git clone git@github.com:otiai10/chant.git
# set up your conf
cp conf/app.conf.sample conf/app.conf # and edit a bit please :)
touch app/chatroom/bot/config.toml
# dependencies
go get github.com/revel/cmd/revel
go get ./...
# Let's start!
revel run chant
```

options

- redis // TODO: あとで書く


Development
===========

- policy: _Eat your dogfood, and Serve your best dogfood._
- issues: https://github.com/otiai10/chant/issues
- server: `revel run chant dev`
- client: see [client](https://github.com/otiai10/chant/tree/master/client)
- license: [MIT](https://github.com/otiai10/chant/blob/master/LICENSE)

Client Projects
================

- Desktop (Electron) https://github.com/otiai10/chantron
- iOS https://github.com/otiai10/chantos
- Android https://github.com/otiai10/chantroid
