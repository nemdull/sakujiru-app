class Post < ApplicationRecord
  belongs_to :user

  has_many :arts, dependent: :destroy

  accepts_nested_attributes_for :arts
end
