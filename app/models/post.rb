class Post < ApplicationRecord
  belongs_to :user

  has_many :arts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :likes, -> { order(created_at: :desc) }, dependent: :destroy

  accepts_nested_attributes_for :arts

  def liked_by(user)
    Like.find_by(user_id: user.id, post_id: id)
  end
end
