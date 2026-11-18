class ChatRoomChannel < ApplicationCable::Channel
  # メッセージ 1 件を、その部屋を購読している人にだけ届ける。
  # 自分の発言は右、相手の発言は左に出すので、両方の見た目を送り、受け取った側で選ぶ
  def self.broadcast_message(chat_message)
    broadcast_to(
      chat_message.chat_room,
      user_id: chat_message.user_id,
      mine: render_message(chat_message, mine: true),
      theirs: render_message(chat_message, mine: false)
    )
  end

  def self.render_message(chat_message, mine:)
    ApplicationController.renderer.render(
      partial: "chat_messages/chat_message",
      locals: { chat_message: chat_message, mine: mine }
    )
  end
  private_class_method :render_message

  def subscribed
    # 自分が入っている部屋だけ購読できる。それ以外は断る
    @chat_room = current_user.chat_rooms.find_by(id: params[:chat_room_id])
    return reject if @chat_room.nil?

    stream_for @chat_room
  end

  def speak(data)
    return if @chat_room.nil?

    # 書き込み先は、購読している部屋に固定する（送られてきた部屋の番号は使わない）
    @chat_room.chat_messages.create(user: current_user, content: data["chat_message"].to_s.strip)
  end
end
