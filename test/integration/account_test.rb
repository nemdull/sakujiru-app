require "test_helper"

class AccountTest < ActionDispatch::IntegrationTest
  test "登録すると、スワイプの画面へ進む" do
    assert_difference -> { User.count }, 1 do
      post user_registration_path, params: {
        user: { name: "はる", email: "haru@example.com", password: "password123", password_confirmation: "password123" }
      }
    end

    assert_redirected_to swipe_path
  end

  test "ログインすると、スワイプの画面へ進む" do
    post user_session_path, params: { user: { email: users(:aoi).email, password: "password123" } }

    assert_redirected_to swipe_path
  end

  test "プロフィールは、今のパスワードを入れなくても更新できる" do
    sign_in users(:aoi)

    patch user_registration_path, params: { user: { name: "あおい（改）", self_introduction: "看板の文字も作ります。" } }

    assert_redirected_to swipe_path
    assert_equal "あおい（改）", users(:aoi).reload.name
  end
end
