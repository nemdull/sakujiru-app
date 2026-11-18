# PAY.JP の秘密鍵は環境変数から読む。未設定のときは、カードの画面で PAY.JP を呼んだ時点でエラーになり、
# CardsController が登録画面へ戻す
Payjp.api_key = ENV["PAYJP_SECRET_KEY"]
