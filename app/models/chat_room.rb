class ChatRoom < ApplicationRecord
  has_many :chat_room_users, dependent: :destroy
  has_many :chat_messages, dependent: :destroy
  has_many :users, through: :chat_room_users

  # 2 人が入っている部屋を探す。無ければ nil
  def self.between(user, other)
    rooms_of_user = ChatRoomUser.where(user_id: user.id).select(:chat_room_id)
    joins(:chat_room_users)
      .where(id: rooms_of_user, chat_room_users: { user_id: other.id })
      .first
  end

  # 2 人の部屋を返す。無ければ、部屋と 2 人分の参加の記録をまとめて作る
  def self.find_or_create_between!(user, other)
    raise ArgumentError, "自分自身との部屋は作れません" if user == other

    between(user, other) || transaction do
      create!.tap do |room|
        room.chat_room_users.create!(user: user)
        room.chat_room_users.create!(user: other)
      end
    end
  end

  def member?(user)
    chat_room_users.exists?(user_id: user.id)
  end

  # 自分から見た相手。相手が退会していれば nil
  def partner_of(user)
    users.where.not(id: user.id).first
  end
end
