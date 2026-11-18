require "test_helper"

# 画面が書き換わるのを待つ時間。CI の遅いマシンでも落ちないよう、少し長めにする
Capybara.default_max_wait_time = 8

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :selenium, using: :headless_chrome, screen_size: [1400, 1400]
end
