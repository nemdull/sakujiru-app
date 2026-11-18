require "test_helper"

class ChatMessageTest < ActiveSupport::TestCase
  include ActionCable::TestHelper

  setup do
    @room = chat_rooms(:aoi_and_ren)
  end

  test "空のメッセージと、長すぎるメッセージは保存しない" do
    assert_not ChatMessage.new(chat_room: @room, user: users(:aoi), content: " ").valid?
    assert_not ChatMessage.new(chat_room: @room, user: users(:aoi), content: "あ" * (ChatMessage::MAX_LENGTH + 1)).valid?
    assert ChatMessage.new(chat_room: @room, user: users(:aoi), content: "あ" * ChatMessage::MAX_LENGTH).valid?
  end

  test "部屋に入っていない人のメッセージは保存しない" do
    message = ChatMessage.new(chat_room: @room, user: users(:mio), content: "こんにちは")

    assert_not message.valid?
    assert message.errors.added?(:user, "はこのチャットルームに参加していません")
  end

  test "保存すると、その部屋にだけ配信する" do
    other_room = ChatRoom.find_or_create_between!(users(:aoi), users(:mio))

    assert_broadcasts(ChatRoomChannel.broadcasting_for(@room), 1) do
      assert_no_broadcasts(ChatRoomChannel.broadcasting_for(other_room)) do
        ChatMessage.create!(chat_room: @room, user: users(:aoi), content: "作品の相談です")
      end
    end
  end

  test "配信には、自分用と相手用の両方の見た目が入る" do
    ChatMessage.create!(chat_room: @room, user: users(:aoi), content: "作品の相談です")

    payload = broadcasts(ChatRoomChannel.broadcasting_for(@room)).last
    payload = ActiveSupport::JSON.decode(payload) if payload.is_a?(String)

    assert_equal users(:aoi).id, payload["user_id"]
    assert_includes payload["mine"], "justify-end"
    assert_includes payload["theirs"], "justify-start"
    assert_includes payload["mine"], "作品の相談です"
  end
end
