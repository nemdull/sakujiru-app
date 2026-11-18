require "application_system_test_case"

class SwipeTest < ApplicationSystemTestCase
  test "Like を 1 回押すと、1 枚だけ進み、「いいね」も 1 件だけ付く" do
    sign_in_as users(:aoi)

    # 画面を読み込み直した状態で確かめる。以前はこのとき、ボタンの処理が 2 回つながっていた
    visit swipe_path
    assert_selector ".swipe--card", count: 2

    click_button "Like"

    assert_selector ".swipe--card.removed", count: 1
    assert_eventually { users(:aoi).reactions.count == 1 }
  end

  test "Pass では「いいね」は付かない" do
    sign_in_as users(:aoi)
    visit swipe_path

    click_button "Pass"

    assert_selector ".swipe--card.removed", count: 1
    assert_equal 0, users(:aoi).reactions.count
  end
end
