<<<<<<< HEAD
# Sakujiru – 作字クリエイター支援プラットフォーム

作字（タイポグラフィ）クリエイターの作品発信を支援し、顧客と直接つながるためのマッチング型SNS。  
個人開発（Rails / Docker / AWS / DaisyUI）
 
- **レポジトリ**: https://github.com/nemdull/sakujiru-app
- **記事**: https://qiita.com/nemdull/items/4ca51b8f9a2e814ed0a1

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

=======
# sakujiru-app 開発ガイド

このドキュメントでは、ローカル／Docker でアプリケーションを起動するための手順、必要なバージョン、運用上のヒントをまとめています。初めてセットアップする場合は、上から順に読み進めてください。
>>>>>>> 55c9ce9 (fix: readme)

---

## 技術スタックとバージョン

| 項目 | バージョン / 備考 |
|------|-------------------|
| Ruby | 3.4.5（`.ruby-version` で指定） |
| Rails | 7.2.2.2 |
| Bundler | 2.5.18 |
| Node.js | 18.x 以上を推奨 |
| Yarn | 1.22.x（Classic） |
| データベース | PostgreSQL 13 以上 |
| JavaScript ビルド | esbuild / Sass |

---

## 必要なソフトウェアの準備

1. **Ruby**
   - `rbenv` や `asdf` を利用して `3.4.5` をインストール
   - 例（rbenv）:
     ```bash
     rbenv install 3.4.5
     rbenv local 3.4.5
     ```
   - インストール後に `ruby -v` でバージョンを確認してください。

2. **Bundler**
   ```bash
   gem install bundler -v 2.5.18
   bundle -v  # Bundler version 2.5.18
   ```

3. **Node.js / Yarn**
   - Node.js は 18.x 以上を用意します（nvm や asdf などのバージョン管理ツール推奨）。
   - Yarn は Classic (1.x) を利用します。未インストールの場合は以下のいずれかでセットアップしてください。
     ```bash
     corepack prepare yarn@1.22.22 --activate
     # もしくは
     npm install --global yarn@1
     ```

4. **PostgreSQL**
   - ローカルに PostgreSQL 13 以上を用意し、`postgres` ユーザーで接続できる状態にします。
   - 既に別のユーザー／パスワードを使用している場合は、後述する `.env` で接続情報を上書きしてください。

---

## リポジトリ構成（抜粋）

- `app/` … MVC を含む Rails アプリ本体
- `config/` … 各種設定、ルーティング、環境ごとの設定
- `db/` … スキーマとマイグレーション
- `public/` … 静的ファイル
- `app/assets` / `app/javascript` … アセット・JavaScript ソース
- `bin/` … Rails 用バイナリ（`bin/rails` など）

---

## 初期セットアップ手順

1. **Bundler のインストールディレクトリ設定（推奨）**
   ```bash
   bundle config set path 'vendor/bundle'
   ```
   これにより、依存パッケージがプロジェクト配下 (`vendor/bundle`) にインストールされます。

2. **Ruby/Rails 依存のインストール**
   ```bash
   bundle _2.5.18_ install
   ```

3. **JavaScript / CSS 依存のインストール**
   ```bash
   yarn install
   ```

4. **環境変数ファイルの作成**
   ```bash
   cp .env.example .env
   ```
   `.env` には下記の変数を設定してください。

   | 変数 | 説明 | デフォルト |
   |------|------|------------|
   | `DATABASE_HOST` | DB 接続先ホスト | `localhost` |
   | `DATABASE_USERNAME` | DB 接続ユーザー | `postgres` |
   | `DATABASE_PASSWORD` | DB 接続パスワード | （空） |
   | `PAYJP_PUBLIC_KEY` | PAY.JP 公開鍵 | 任意 |
   | `PAYJP_SECRET_KEY` | PAY.JP 秘密鍵 | 任意 |

5. **データベース初期化**
   ```bash
   bin/rails db:setup
   ```
   既存の DB がある場合は `bin/rails db:migrate` を使用してください。

---

## ローカル開発フロー

### Rails サーバーの起動
```bash
bin/rails server
```
`http://localhost:3000` でアプリケーションが確認できます。Spring を停止したい場合は `DISABLE_SPRING=1 bin/rails server` を利用してください。

### アセットの自動ビルド（任意）
開発中にスタイル／JavaScript を自動でビルドする場合は、別のターミナルで以下を実行します。
```bash
yarn build:js:watch
yarn build:css:watch
```

### CI／タスクでの代表的な Rails コマンド
```bash
bin/rails db:migrate        # マイグレーション実行
bin/rails db:setup          # DB 作成 + マイグレーション + シード
bin/rails db:reset          # DB を再作成（開発データを消去）
bin/rails test              # Minitest 実行
bundle exec rake test       # Rake 経由でのテスト実行
```

---

## Docker を利用する場合

Docker/Docker Compose が利用できる環境であれば、以下のコマンドで依存関係を意識せずに起動できます。

```bash
docker compose build
docker compose run --rm web bin/rails db:setup
docker compose up
```

- アプリケーション: `http://localhost:3000`
- PostgreSQL: `localhost:5432`

`docker compose down` でコンテナを停止し、永続化された DB データは `./tmp/db` に保存されます。

---

## テスト・ビルド・ユーティリティ

| 目的 | コマンド |
|------|----------|
| テスト全体の実行 | `bin/rails test` |
| 個別テストの実行 | `bin/rails test test/models/sample_test.rb` |
| JavaScript/CSS の単発ビルド | `yarn build` |
| JavaScript のみビルド | `yarn build:js` |
| CSS のみビルド | `yarn build:css` |

---

## トラブルシューティング

- **Rails サーバーが既に起動していると言われる**  
  `tmp/pids/server.pid` を削除してから再実行してください。  
  ```bash
  rm -f tmp/pids/server.pid
  bin/rails server
  ```

- **Spring 関連の不具合が発生する**  
  ```bash
  bin/spring stop
  DISABLE_SPRING=1 bin/rails server
  ```

- **PostgreSQL に接続できない**  
  `.env` の `DATABASE_HOST`／`DATABASE_USERNAME`／`DATABASE_PASSWORD` を利用環境に合わせて調整します。

- **Yarn でネットワークエラーが出る**  
  `npm config set strict-ssl false` などを試す前に、まずプロキシや VPN の設定を確認してください。

---

## 運用時のヒント

- 依存パッケージを更新する際は、`bundle update <gem>` や `yarn upgrade` を行った後に `bin/rails test` で動作確認を行ってください。
- 本番デプロイ時には以下の順序を推奨します。
  1. `RAILS_ENV=production bundle exec rake assets:precompile`
  2. `RAILS_ENV=production bin/rails db:migrate`
  3. アプリケーションサーバーを再起動

---

何か不明点があれば、開発チームまで気軽に問い合わせてください。Happy coding!
