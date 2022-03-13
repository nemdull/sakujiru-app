class ChatRoomChannel < ApplicationCable::Channel
  def subscribed
    stream_from "chat_room_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def speak(data)
    ActionCable.server.broadcast 'chat_room_channel', chat_message: data['chat_message']
  end
end
