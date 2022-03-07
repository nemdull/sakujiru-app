class Art < ApplicationRecord
  belongs_to :post

  validates :image, presence: true

  mount_uploader :image, ImageUploader
end
