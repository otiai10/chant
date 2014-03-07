# ちゃんとしたい

- DB使わない揮発性チャット
- Twitterでログイン
- スタンプ登録機能
- シェアした音楽をプレイリスト再生
- CSSぜんぜんこだわらない

# セットアップ

[Goをインストール](https://gist.github.com/otiai10/6779454#comment-920223)

[revelをインストール](https://gist.github.com/otiai10/6779454#comment-920230)

chantをクローン
```
cd $GOPATH/src
git clone git@github.com:otiai10/chant.git
```
app.confを作成
```
cp conf/app.conf.sample conf/app.conf
```
起動
```
revel run chant
```
