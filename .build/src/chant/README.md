# ちゃんとしたい

- DB使わない揮発性チャット
- Twitterでログイン
- スタンプ登録機能
- シェアした音楽をプレイリスト再生
- CSSぜんぜんこだわらない

# セットアップ

dependencies
```
go get github.com/revel/cmd/revel
go get github.com/mrjones/oauth
```

app.confを作成
```
cp conf/app.conf.sample conf/app.conf
vi conf/app.conf
# http.host=your.hostname.com
```

起動
```
revel run chant
```

# 開発
サーバサイド

- `go fmt`する！(๑˃̵ᴗ˂̵)و http://otiai10.hatenablog.com/entry/2014/03/14/132315

クライアントサイド

- TypeScript！(๑˃̵ᴗ˂̵)و https://github.com/otiai10/chant/tree/master/client