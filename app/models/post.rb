class Post < ApplicationRecord
  belongs_to :user

  has_many :arts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :reactions, -> { order(created_at: :desc) }, dependent: :destroy

  accepts_nested_attributes_for :arts

  def self.ransackable_attributes(_auth_object = nil)
    %w[art_text created_at id updated_at user_id]
  end

  def self.ransackable_associations(_auth_object = nil)
    %w[arts comments reactions user]
  end
end
