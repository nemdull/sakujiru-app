require "test_helper"

class ChatRoomChannelTest < ActionCable::Channel::TestCase
  setup do
    @room = chat_rooms(:aoi_and_ren)
  end

  test "自分が入っている部屋は購読できる" do
    stub_connection current_user: users(:aoi)

    subscribe chat_room_id: @room.id

    assert subscription.confirmed?
    assert_has_stream_for @room
  end

  test "入っていない部屋の購読は断る" do
    stub_connection current_user: users(:mio)

    subscribe chat_room_id: @room.id

    assert subscription.rejected?
    assert_no_streams
  end

  test "部屋の番号が無い購読は断る" do
    stub_connection current_user: users(:aoi)

    subscribe

    assert subscription.rejected?
  end

  test "発言は、購読している部屋にだけ書き込まれる" do
    other_room = ChatRoom.find_or_create_between!(users(:ren), users(:mio))
    stub_connection current_user: users(:aoi)
    subscribe chat_room_id: @room.id

    assert_difference -> { @room.chat_messages.count }, 1 do
      assert_no_difference -> { other_room.chat_messages.count } do
        # ほかの部屋の番号を送っても、そちらには書き込まれない
        perform :speak, chat_message: "こんにちは", chat_room_id: other_room.id
      end
    end

    assert_equal users(:aoi), @room.chat_messages.order(:id).last.user
  end

  test "空の発言は保存しない" do
    stub_connection current_user: users(:aoi)
    subscribe chat_room_id: @room.id

    assert_no_difference -> { ChatMessage.count } do
      perform :speak, chat_message: "   "
    end
  end
end
