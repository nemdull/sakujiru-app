class Comment < ApplicationRecord
  MAX_LENGTH = 500

  belongs_to :user
  belongs_to :post

  validates :comment, presence: true, length: { maximum: MAX_LENGTH }

  def written_by?(other)
    other.present? && user_id == other.id
  end
end
