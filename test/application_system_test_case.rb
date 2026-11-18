require "test_helper"

# 画面が書き換わるのを待つ時間。CI の遅いマシンでも落ちないよう、少し長めにする
Capybara.default_max_wait_time = 8

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :selenium, using: :headless_chrome, screen_size: [1400, 1400]

  private

  # ログイン画面から、実際に入力してログインする
  def sign_in_as(user)
    visit new_user_session_path
    fill_in "メールアドレス", with: user.email
    fill_in "パスワード", with: "password123"
    click_button "ログイン"
    assert_current_path swipe_path
  end

  # 画面の外（データベースなど）の変化を、少しのあいだ待つ
  def assert_eventually(message = "待っても条件が満たされませんでした", timeout: Capybara.default_max_wait_time)
    deadline = Process.clock_gettime(Process::CLOCK_MONOTONIC) + timeout
    until yield
      flunk(message) if Process.clock_gettime(Process::CLOCK_MONOTONIC) > deadline
      sleep 0.1
    end
  end
end
