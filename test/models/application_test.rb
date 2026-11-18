require "test_helper"

# 本番では起動時に全部のクラスを読み込む（eager load）。
# テストでは使う分しか読み込まないので、名前の間違いなどをここでまとめて見つける
class ApplicationTest < ActiveSupport::TestCase
  test "アプリのコードが全部読み込める" do
    assert_nothing_raised { Rails.application.eager_load! }
  end
end
