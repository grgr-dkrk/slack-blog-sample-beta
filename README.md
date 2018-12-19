# slack-blog-sample

[demo](https://slack-blog-sample-beta.firebaseapp.com/)

## 注意
- 取得ユーザーは1人だけ(users.listで返るリストの最初の人)です
- テスト何も書いてないです
- 画像のダウンロードが不安定です

## 導入

### トークン作成
[https://api.slack.com/apps](https://api.slack.com/apps)  
で、OAuth Access Tokenを取得

### トークンの登録
※macの場合  
`echo export SLACK_ACCESS_TOKEN='xoxb-○○○○○○○○' >> ~/.bash_profile`  
`source ~/.bash_profile`

### インストール
`yarn install`

### Slackで記事を書く
"blog-"から始まるチャンネルで記事を書きます。  
チャンネル名がカテゴリーになります。目的を書くとカテゴリの説明文になります。  
対応していないMarkdownやemojiがあります。  
[サンプルページより](https://slack-blog-sample-beta.firebaseapp.com/categories/CEY521C1L/entry-1545139299.002600)  
`#`（一番大きい見出し）が記事名になります。

### 生成
`yarn generate`

最初に"blog-"または"source-"の画像およびユーザーアイコンをSlackからダウンロードします。  
一度に大量に追加するとレート制限がかかります。

### 確認
`yarn server`

### PWA
icon.pngをstaticフォルダに置きます