# Sakujiru – 作字クリエイター向けマッチングプラットフォーム

作字（タイポグラフィ）クリエイターが作品を発信し、オーダーを希望する顧客とつながるためのマッチング型 SNS です。  
Tinder ライクなスワイプ UI、いいね一覧、ActionCable を用いたリアルタイム DM、PAY.JP 連携によるクレジットカード登録などを備えています。

## Deploy 
デプロイ先: https://sakujiru-web.onrender.com/

---

## 目次

1. [主な機能](#主な機能)
2. [技術スタック](#技術スタック)
3. [リポジトリ構成](#リポジトリ構成)
4. [セットアップの流れ](#セットアップの流れ)
   - [共通準備](#共通準備)
   - [ローカル環境での起動](#ローカル環境での起動)
   - [Docker での起動](#docker-での起動)
5. [データベースとシードデータ](#データベースとシードデータ)
6. [便利なコマンド](#便利なコマンド)
7. [トラブルシューティング](#トラブルシューティング)
8. [デプロイ時のヒント](#デプロイ時のヒント)
9. [参考リンク](#参考リンク)

---

## 主な機能

- **作品投稿**: 画像を複数アップロード可能なポートフォリオ投稿機能。
- **スワイプ評価**: Tailwind CSS の stack レイアウトで Tinder 風の UI を実装。
- **マッチング / いいね一覧**: リアクション履歴からお気に入りを素早く参照。（※ ベータ版 / 実装予定中）
- **リアルタイム DM**: ActionCable を用いたチャット機能。（※ ベータ版 / 実装予定中）
- **クレジットカード登録 (PAY.JP)**: トークンベースの安全な登録フロー。（※ 実装予定中、フォームはダミー）
- **検索 / 絞り込み**: Ransack による柔軟な検索。

---

## 技術スタック

| レイヤー | 技術 / バージョン |
|----------|-------------------|
| 言語 / FW | Ruby 3.4.5, Rails 7.2.2.2 |
| パッケージ管理 | Bundler 2.5.18, Yarn 1.22.x |
| データベース | PostgreSQL 13+ |
| ビルドツール | esbuild, Sass |
| UI | Tailwind CSS, DaisyUI, jQuery, Hammer.js |
| 認証 / 決済 | Devise, PAY.JP |
| メッセージング | Action Cable |
| 開発補助 | Docker / Docker Compose, Spring, Pry |

---

## リポジトリ構成

- `app/` – Rails アプリ本体 (MVC)
- `config/` – ルーティング / 環境別設定 / 初期化処理
- `db/` – マイグレーション、スキーマ、シード
- `app/assets`, `app/javascript` – アセット、フロントエンドソース
- `bin/` – Rails 実行用スクリプト
- `docker-compose.yml`, `Dockerfile` – Docker 関連設定

---

## セットアップの流れ

### 共通準備

| 必須ツール | 推奨バージョン | 備考 |
|------------|----------------|------|
| Git | 最新 | ソース管理 |
| Node.js | 18.x 以上 | LTS 推奨 (nvm / asdf 対応) |
| Yarn | 1.22.x (Classic) | `corepack prepare yarn@1.22.22 --activate` 等 |
| PostgreSQL | 13 以上 | ローカル or Docker |

以降、自分に合った環境（ローカル / Docker）を選んでセットアップしてください。

---

### ローカル環境での起動

1. **Ruby / Bundler の準備**
   ```bash
   rbenv install 3.4.5            # 未インストールの場合
   rbenv local 3.4.5
   gem install bundler -v 2.5.18
   bundle config set path 'vendor/bundle'
   bundle _2.5.18_ install
   ```

2. **JavaScript 依存関係**
   ```bash
   yarn install
   ```

3. **CSS/JS アセットのビルド (初回または変更時)**
   ```bash
   yarn build          # JS + CSS を一括ビルド
   # または必要な方だけ
   yarn build:js
   yarn build:css
   ```
   - `yarn build:css` は Tailwind CLI (`tailwindcss`) を用いて `app/javascript/stylesheets/application.css` をビルドし、`app/assets/builds/application.css` に出力します。

4. **環境変数ファイルを作成**
   ```bash
   cp .env.example .env
   ```
   - ローカルの PostgreSQL を利用する場合は、自身の OS ユーザー名に合わせて `DATABASE_USERNAME` / `DATABASE_PASSWORD` を設定してください。  
   - `postgres` ロールを使用したい場合は `createuser -s postgres` でロールを追加します。

5. **データベースの初期化**
   ```bash
   bin/rails db:setup
   ```

6. **アプリケーションの起動**
   ```bash
   bin/rails server           # http://localhost:3000
   ```

7. **アセットのライブビルド (必要に応じて)**
   ```bash
   yarn build:js:watch
   yarn build:css:watch
   ```

---

### Docker での起動

Docker 上で Rails / PostgreSQL をまとめて起動する場合の手順です。

1. **初回ビルド**
   ```bash
   docker compose build
   ```
   - 以前 Ruby 2.7 系のイメージを利用していた場合は `docker compose build --no-cache web` を実行して最新の Ruby 3.4.5 / Bundler 2.5.18 を反映させてください。

2. **コンテナの起動**
   ```bash
   docker compose up -d
   ```
   - 警告を避けたい場合は `docker-compose.yml` 先頭の `version: '3'` 行を削除しておきます (Compose v2 では不要)。

3. **依存関係のインストール (Web コンテナ内)**
   ```bash
   docker compose exec web bundle _2.5.18_ install
   docker compose exec web yarn install
   docker compose exec web yarn build
   ```
   - CSS の更新のみ行う場合は `docker compose exec web yarn build:css` を利用してください。

4. **データベース初期化**
   ```bash
   docker compose exec web bin/rails db:setup
   ```

5. **アプリケーション確認**
   - ブラウザで `http://localhost:3000` を開きます (web サービスが `3000:3000` で公開されます)。
   - Rails サーバーを前面で確認したい場合:
     ```bash
     docker compose logs -f web
     docker compose exec web bin/rails server -b 0.0.0.0
     ```

6. **停止 / 再起動**
   ```bash
   docker compose down             # 停止
   docker compose up -d            # 再起動
   ```

---

## データベースとシードデータ

- シードは `bin/rails db:seed` (または `db:setup`) で投入されます。
- サンプルデータでは `asset/img/avater` の画像をクリエイターのプロフィールに、`asset/img/typography` の画像を作品に紐付けます。適宜ご自身の素材に差し替えてください。
- Docker 利用時は `docker compose exec db psql -U postgres -d sakujiru_development` で DB にアクセスできます。
- Docker 利用時は `docker compose exec db psql -U postgres -d sakujiru_development` で DB にアクセスできます。
  - `\l` で DB 一覧、`\dt` でテーブル一覧を確認。
  - ローカル環境から Docker の DB に接続する場合は `.env` 内で `DATABASE_HOST=db`, `DATABASE_USERNAME=postgres`, `DATABASE_PASSWORD=` を設定してください。

---

## UI テーマとスタイル

- Tailwind CSS 3 + daisyUI 4 の「modern」テーマを定義しています。カラーパレットは `tailwind.config.js` の `daisyui.themes` で調整できます。
- グローバルスタイルやカスタムコンポーネントは `app/javascript/stylesheets/application.css` の `@layer base` / `@layer components` で管理しています。必要に応じて `surface-card` や `btn-modern` などのユーティリティクラスを追加してください。
- テーマカラーを変更した場合は `yarn build:css` を実行して `app/assets/builds/application.css` を再生成します。

---

## 機能ステータス

| 機能 | 状態 | 補足 |
|------|------|------|
| 作品投稿 / 一覧 / 検索 | 利用可能 | いいね・コメント・詳細表示を含む |
| スワイプ (Like / Dislike) | 利用可能 | `/swipe` でカードをスワイプ可能 |
| いいね一覧 | ベータ | サンプルデータを初期投入済み |
| マッチング通知 / DM | 実装予定中 | 画面には注意書きを表示中 |
| チャット画面 | ベータ | UI のみ、送受信はモック動作 |
| クレジットカード登録 | 実装予定中 | PAY.JP 連携用フォームはダミー |
| シードデータ | 利用可能 | `asset/img/avater` / `asset/img/typography` の画像を使用 |

---

## 便利なコマンド

| 目的 | ローカル | Docker |
|------|----------|--------|
| DB 初期化 | `bin/rails db:setup` | `docker compose exec web bin/rails db:setup` |
| マイグレーション | `bin/rails db:migrate` | 同左 |
| テスト実行 | `bin/rails test` / `bundle exec rake test` | `docker compose exec web bin/rails test` |
| Spring 停止 | `bin/spring stop` | `docker compose exec web bin/spring stop` |
| アセットビルド | `yarn build`, `yarn build:js`, `yarn build:css` | `docker compose exec web yarn build` など |
| Rails コンソール | `bin/rails console` | `docker compose exec web bin/rails console` |

---

## トラブルシューティング

- **`A server is already running` が表示される**
  ```bash
  rm -f tmp/pids/server.pid
  bin/rails server
  # Docker の場合
  docker compose exec web rm -f tmp/pids/server.pid
  docker compose exec web bin/rails server -b 0.0.0.0
  ```

- **Bundler / Ruby バージョン不一致 (Docker)**
  - 古いイメージが残っている場合、`docker compose build --no-cache web` を実行して再ビルドします。
  - コンテナ内で `gem install bundler -v 2.5.18` を行う必要があれば、`docker compose exec web gem install bundler -v 2.5.18` を実行してください。

- **PostgreSQL に接続できない**
  - ローカルでは `createuser -s postgres` や `.env` の `DATABASE_USERNAME`/`DATABASE_PASSWORD` の調整が必要な場合があります。
  - Docker ではコンテナが起動しているか (`docker compose ps`) を確認し、必要に応じて `.env` でホスト名を `db` に設定します。

- **シード時に画像が無いと言われる**
  - `db/dummy_images` に `1.jpg` 〜 `6.jpg` を配置するか、空のままでも実行は続行します（ユーザーの画像は `nil` になります）。

- **`cannot load such file -- sassc` が表示される**
  - `yarn build` が未実行で `app/assets/builds/application.css` が存在しない場合に発生します。`yarn build` または `yarn build:css` を実行してからサーバーを再起動してください。
- **スタイルが反映されない**
  - Tailwind のビルド結果 (`app/assets/builds/application.css`) が古い可能性があります。`yarn build:css` または Docker 環境では `docker compose exec web yarn build:css` を実行し、ブラウザのキャッシュをクリアして再読み込みしてください。

- **Yarn のネットワークエラー**
  - プロキシ / VPN を解除する、もしくは `yarn install --network-timeout 600000` を試してください。

- **Docker 環境が不安定 / クリーンにしたい**
  1. `docker compose down --volumes`
  2. `docker compose up -d --build`
  3. `docker compose exec web yarn build`
  4. `docker compose exec web bin/rails db:drop db:create db:migrate db:seed`
  5. `docker compose exec web bin/rails server -b 0.0.0.0`
  - `db:seed` では作例となるユーザー・作品・コメント・いいね・チャットが自動生成され、いいね一覧にもデータが表示されます。

---

## デプロイ時のヒント

1. 依存関係を production 向けにインストール
   ```bash
   bundle _2.5.18_ install --without development test
   yarn install --production
   ```
2. アセットのプリコンパイル
   ```bash
   RAILS_ENV=production bundle exec rake assets:precompile
   ```
3. マイグレーション
   ```bash
   RAILS_ENV=production bin/rails db:migrate
   ```
4. アプリケーションサーバー (Puma 等) を再起動

---

## Render へのデプロイ (Docker 利用時の例)

Render では Dockerfile をそのまま使用して Rails + PostgreSQL をホストできます。以下は最小構成の手順です。

1. **Render アカウント作成・GitHub 連携**
   - Render ダッシュボードで「New +」→「Web Service」→ GitHub リポジトリを選択。
   - Environment: `Docker`
   - Branch: デプロイしたいブランチ (例: `main`)
   - Region は任意の近いリージョンを選択します。

2. **環境変数 (Environment Variables) の設定**
   - `RAILS_ENV=production`
   - `RAILS_MASTER_KEY` (credentials を使用している場合に必須)
   - PAY.JP など外部サービスの API キーも必要に応じて登録。

3. **PostgreSQL を作成**
   - Render の「New +」→「PostgreSQL」で DB を作成。
   - Web Service の環境変数に `DATABASE_URL` が自動で連携されます。`config/database.yml` は `DATABASE_URL` を優先するため追加設定は不要です。

4. **初回デプロイ後の初期化**
   - Render の Web Service 画面で「Shell」を開き、以下を実行します。
     ```bash
     bundle exec rails db:setup
     bundle exec rails db:seed
     ```
   - 既存 DB がある場合は `db:migrate` のみ実行してください。

5. **アセットプリコンパイル**
   - 現行の Dockerfile には `yarn build` が含まれているため追加作業は不要です。
   - もし独自に `assets:precompile` が必要な場合は Dockerfile のビルドステップに追加するか、初回デプロイ後に `bundle exec rails assets:precompile` を実行します。

6. **ログ / 再デプロイ**
   - Render ダッシュボードの「Logs」で Puma のログを確認できます。
   - GitHub に push すると自動で再デプロイが走ります。手動で再デプロイする場合は「Manual Deploy」を選択してください。

> 💡 `docker-compose.yml` に記載したボリューム (`./tmp/db` など) は Render では利用されません。永続化は Render の管理する PostgreSQL を使う構成に切り替えてください。

---

## 参考リンク

- リポジトリ: <https://github.com/nemdull/sakujiru-app>
- Qiita 記事: <https://qiita.com/nemdull/items/4ca51b8f9a2e814ed0a1>
- Rails ガイド: <https://railsguides.jp/>
- PAY.JP ドキュメント: <https://pay.jp/docs/>

不明点があれば Issue / PR でお気軽に連絡してください。Happy coding!
