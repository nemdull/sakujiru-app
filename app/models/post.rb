class Post < ApplicationRecord
  belongs_to :user

  has_many :arts, dependent: :destroy
end
