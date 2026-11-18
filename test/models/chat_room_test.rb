require "test_helper"

class ChatRoomTest < ActiveSupport::TestCase
  test "2 人の部屋がもうあれば、それを返す" do
    assert_no_difference -> { ChatRoom.count } do
      assert_equal chat_rooms(:aoi_and_ren), ChatRoom.find_or_create_between!(users(:aoi), users(:ren))
      assert_equal chat_rooms(:aoi_and_ren), ChatRoom.find_or_create_between!(users(:ren), users(:aoi))
    end
  end

  test "無ければ、部屋と 2 人分の参加の記録を作る" do
    room = nil

    assert_difference -> { ChatRoom.count } => 1, -> { ChatRoomUser.count } => 2 do
      room = ChatRoom.find_or_create_between!(users(:aoi), users(:mio))
    end

    assert_equal [users(:aoi), users(:mio)].sort_by(&:id), room.users.sort_by(&:id)
  end

  test "自分自身との部屋は作らない" do
    assert_no_difference -> { ChatRoom.count } do
      assert_raises(ArgumentError) { ChatRoom.find_or_create_between!(users(:aoi), users(:aoi)) }
    end
  end

  test "参加しているかどうかと、相手が分かる" do
    room = chat_rooms(:aoi_and_ren)

    assert room.member?(users(:aoi))
    assert_not room.member?(users(:mio))
    assert_equal users(:ren), room.partner_of(users(:aoi))
  end

  test "同じ人を同じ部屋に 2 回は入れられない" do
    duplicate = ChatRoomUser.new(chat_room: chat_rooms(:aoi_and_ren), user: users(:aoi))

    assert_not duplicate.valid?
  end
end
