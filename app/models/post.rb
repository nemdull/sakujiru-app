class Post < ApplicationRecord
  SWIPE_DECK_SIZE = 10
  MAX_TEXT_LENGTH = 1000

  belongs_to :user
  has_many :arts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :reactions, -> { order(created_at: :desc) }, dependent: :destroy

  accepts_nested_attributes_for :arts

  validates :art_text, length: { maximum: MAX_TEXT_LENGTH }

  scope :newest_first, -> { order(created_at: :desc) }
  scope :liked_by, ->(user) { where(id: user.reactions.select(:post_id)) }

  # スワイプ画面に出す束。自分の投稿は出さない。
  # 候補が束より多いときは、新しい順に並べた列のどこか 1 か所から続けて取る
  def self.swipe_deck_for(user, size: SWIPE_DECK_SIZE)
    candidates = where.not(user_id: user.id)
    surplus = candidates.count - size
    candidates = candidates.offset(rand(surplus + 1)) if surplus.positive?

    candidates.includes(:arts, :user).newest_first.limit(size)
  end

  def owned_by?(other)
    other.present? && user_id == other.id
  end

  # Ransack allowlist (required from Ransack 4)
  def self.ransackable_attributes(_auth_object = nil)
    %w[art_text created_at id updated_at user_id]
  end

  def self.ransackable_associations(_auth_object = nil)
    %w[arts comments reactions user]
  end
end
