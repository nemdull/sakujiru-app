require "test_helper"

class ChatRoomsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @room = chat_rooms(:aoi_and_ren)
  end

  test "同じ相手とは、いつも同じ部屋になる" do
    sign_in users(:aoi)

    assert_no_difference -> { ChatRoom.count } do
      post chat_rooms_path, params: { user_id: users(:ren).id }
    end

    assert_redirected_to chat_room_path(@room)
  end

  test "初めての相手とは、新しい部屋を作る" do
    sign_in users(:aoi)

    assert_difference -> { ChatRoom.count } => 1, -> { ChatRoomUser.count } => 2 do
      post chat_rooms_path, params: { user_id: users(:mio).id }
    end

    assert_redirected_to chat_room_path(ChatRoom.between(users(:aoi), users(:mio)))
  end

  test "自分自身との部屋は作らない" do
    sign_in users(:aoi)

    assert_no_difference -> { ChatRoom.count } do
      post chat_rooms_path, params: { user_id: users(:aoi).id }
    end

    assert_redirected_to users_path
  end

  test "いない相手を指定したら 404" do
    sign_in users(:aoi)

    post chat_rooms_path, params: { user_id: 0 }

    assert_response :not_found
  end

  test "自分の部屋は開ける。これまでのやり取りが出る" do
    sign_in users(:ren)

    get chat_room_path(@room)

    assert_response :success
    assert_includes response.body, chat_messages(:hello_from_aoi).content
    assert_includes response.body, %(data-chat-room-id="#{@room.id}")
  end

  test "入っていない部屋は、番号を知っていても開けない" do
    sign_in users(:mio)

    get chat_room_path(@room)

    assert_response :not_found
    assert_not_includes response.body, chat_messages(:hello_from_aoi).content
  end
end
