require "application_system_test_case"

# 本物のブラウザーを 3 つ開いて、チャットが「同じ部屋の相手にだけ」届くことを確かめる
class ChatTest < ApplicationSystemTestCase
  MESSAGE = "作字の相談をさせてください".freeze

  test "メッセージは、同じ部屋を開いている相手にだけ届く" do
    room = chat_rooms(:aoi_and_ren)

    using_session(:ren) do
      sign_in_as users(:ren)
      visit chat_room_path(room)
      assert_text "あおい さんとのチャット"
      assert_selector "#chat-messages[data-chat-ready='true']"
    end

    # みおは部屋に入っていない。投稿の詳細（コメント欄のある画面）を開いておく
    using_session(:mio) do
      sign_in_as users(:mio)
      visit post_path(posts(:aoi_logo))
      assert_text "コメント"
    end

    using_session(:aoi) do
      sign_in_as users(:aoi)
      visit chat_room_path(room)
      assert_text "れん さんとのチャット"
      # 回線がつながるのを待ってから書き込む
      assert_selector "#chat-messages[data-chat-ready='true']"

      find("#chat-room-message").send_keys(MESSAGE, :enter)

      assert_selector "#chat-messages .justify-end", text: MESSAGE
      assert_equal "", find("#chat-room-message").value
    end

    using_session(:ren) do
      assert_selector "#chat-messages .justify-start", text: MESSAGE
    end

    using_session(:mio) do
      assert_no_text MESSAGE
    end

    assert_equal MESSAGE, room.chat_messages.order(:id).last.content
  end

  private

  def sign_in_as(user)
    visit new_user_session_path
    fill_in "メールアドレス", with: user.email
    fill_in "パスワード", with: "password123"
    click_button "ログイン"
    assert_current_path swipe_path
  end
end
