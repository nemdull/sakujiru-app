# Sakujiru – 作字クリエイター支援プラットフォーム

作字（タイポグラフィ）クリエイターの作品発信を支援し、顧客と直接つながるためのマッチング型SNS。  
個人開発（Rails / Docker / AWS / DaisyUI）
 
- **レポジトリ**: https://github.com/nemdull/sakujiru-app

---

## アプリ概要

クリエイターが作品を投稿し、閲覧者（顧客）が気に入った作風のクリエイターを見つけ、**直接交渉（DM）** できるプラットフォームです。  
Tinder ライクな「スワイプ評価」、**いいね一覧**、**リアルタイムDM**、**クレジットカード登録（Pay.jp）** などを備えています。

---

## 主な機能

1. **作品投稿機能**  

2. **マッチング（いいね機能）**  

3. **いいねした作品一覧**  

4. **DM機能（ActionCable）**  

5. **クレジットカード登録機能（Pay.jp）**  

**使用Gem（抜粋）**  
- devise  
- carrierwave  
- kaminari  
- initials  
- ransack  
- actioncable  
- payjp  

---

## 使用技術

### フロントエンド
- HTML / CSS / JS (jQuery)  
- Tailwind CSS + DaisyUI  
  - `<html data-theme="aqua">` などで簡単にテーマ切替可能

### バックエンド
- Ruby 2.7.5  
- Rails 6.0.4.6  
- PostgreSQL 14.x  

### インフラ
- **開発**: Docker / Docker Compose  
- **本番**: AWS (VPC, EC2, RDS, S3, Route53)  
  - 当初は Heroku → その後 EC2 へ移行  

### ツール
- Git / GitHub / GitLab  
- VSCode  
- Slack / Trello / Gather  

---

## データベース設計

| テーブル         | 役割                                |
|------------------|-------------------------------------|
| users            | ユーザー関連（認証・プロフィール）   |
| posts            | 投稿関連                            |
| arts             | 投稿に紐づく画像                    |
| reactions        | マッチングで「いいね」された履歴    |
| comments         | コメント                            |
| cards            | クレジットカード（トークン化情報）  |
| chat_rooms       | チャットルーム                     |
| chat_room_users  | チャットルーム参加者の中間テーブル |
| chat_messages    | チャットメッセージ                  |

---

## 開発において意識したこと

### 工夫した点
- **マッチング機能**: Tailwind の stack プロパティを用いて Tinder風のカード重ねUIを実装  
- **擬似チーム開発**: 機能ごとにブランチ切り→PR→レビュー→マージの流れを徹底  
- **タイムマネジメント**: 卒研と並行して短時間を確保、場所を変えつつ進捗を維持  

### 苦労した点
- **環境構築**: Dockerfile, Compose 設定、AWS サービス間連携に度々苦戦  
- **学習方法**: 網羅学習（Udemy）後に公式リファレンスを熟読して仕組み理解を徹底  

### 今後の課題
- 作品カテゴリの追加  
- SNSログイン  
- フォロー機能  
- ゲストログイン  
- スキルセット表示  
- 決済フローの拡張  
- UI改善・インフラ強化  

---

## ローカル開発手順

```bash
# Ruby 2.7.5 前提
bundle install
bin/rails db:setup
bin/rails s


## リポジトリの構成

- **app/**: アプリケーションの主要なコードが含まれています。コントローラー、モデル、ビューがそれぞれのサブディレクトリに分かれています。
- **config/**: アプリケーションの設定ファイルが含まれています。ルーティングやデータベースの設定などがここにあります。
- **db/**: データベースのマイグレーションやスキーマが含まれています。
- **public/**: 公開される静的ファイル（例: HTML、画像）が含まれています。

## 必要な手順

1. **Rubyのインストール**: Ruby 2.7.5を使用する必要があります。
2. **Bundlerのインストール**: `gem install bundler`を実行してBundlerをインストールします。
3. **依存関係のインストール**: `bundle install`を実行して必要なGemをインストールします。
4. **データベースの作成**: `rails db:create`を実行してデータベースを作成します。
5. **データベースの初期化**: `rails db:migrate`を実行してデータベースを初期化します。
6. **アプリケーションの起動**: `bin/rails server`を実行してアプリケーションを起動します。

## 注意事項

- Rubyのバージョンは2.7.5を指定してください。
- Bundlerのバージョンは2.2.33を使用してください。

## 使用するRubyのバージョン
- Ruby 2.7.5を使用します。

## 使用するBundlerのバージョン
- Bundler 2.2.33を使用します。

## その他

- テストスイートの実行方法やデプロイ手順については、必要に応じて追加してください。

## テストの実行方法
- ローカル実行
  - bin/rails test
  - bundle exec rake test
- 環境別実行
  - RAILS_ENV=test bin/rails test

## デプロイ手順
- アセットのプリコンパイル
  - RAILS_ENV=production bundle exec rake assets:precompile
- データベース移行
  - RAILS_ENV=production bin/rails db:migrate
- 本番サーバの再起動
  - 環境依存の手順に従って再起動
