class ChatRoomUser < ApplicationRecord
  belongs_to :chat_room
  belongs_to :user

  validates :user_id, uniqueness: { scope: :chat_room_id }
end
