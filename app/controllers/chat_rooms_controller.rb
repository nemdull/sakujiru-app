class ChatRoomsController < ApplicationController
  before_action :authenticate_user!

  def create
    partner = User.find(params[:user_id])
    if partner == current_user
      redirect_back fallback_location: users_path, alert: "自分自身にはメッセージを送れません。"
      return
    end

    redirect_to chat_room_path(ChatRoom.find_or_create_between!(current_user, partner))
  end

  def show
    # 自分が入っている部屋の中からだけ探す。ほかの人の部屋の番号を入れても開けない
    @chat_room = current_user.chat_rooms.find(params[:id])
    @chat_room_user = @chat_room.partner_of(current_user)
    if @chat_room_user.nil?
      redirect_to users_path, alert: "相手のアカウントが見つかりませんでした。"
      return
    end

    @chat_messages = @chat_room.chat_messages.order(:created_at, :id)
  end
end
