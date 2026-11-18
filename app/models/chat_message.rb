class ChatMessage < ApplicationRecord
  MAX_LENGTH = 1000

  belongs_to :user
  belongs_to :chat_room

  validates :content, presence: true, length: { maximum: MAX_LENGTH }
  validate :user_must_be_member

  # 保存できたら、その部屋を開いている人にだけ届ける
  after_create_commit { ChatRoomChannel.broadcast_message(self) }

  private

  def user_must_be_member
    return if chat_room.nil? || user.nil?
    return if chat_room.member?(user)

    errors.add(:user, "はこのチャットルームに参加していません")
  end
end
