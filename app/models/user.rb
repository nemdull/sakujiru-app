class User < ApplicationRecord
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :reactions, dependent: :destroy
  has_many :chat_room_users, dependent: :destroy
  has_many :chat_rooms, through: :chat_room_users
  has_many :chat_messages, dependent: :destroy
  has_one :card, dependent: :destroy

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  validates :name, presence: true
  validates :self_introduction, length: { maximum: 500 }

  mount_uploader :profile_image, ProfileImageUploader

  # 「いいね」を付ける。もう付いていれば、そのまま返す。
  # 同時に 2 回押されても、2 つ目は付けずに 1 つ目を返す
  def like(post)
    reactions.find_or_create_by!(post: post)
  rescue ActiveRecord::RecordInvalid, ActiveRecord::RecordNotUnique
    reactions.find_by!(post: post)
  end

  def unlike(post)
    reactions.where(post: post).destroy_all
  end

  # プロフィールの更新。パスワードの欄が空なら、パスワードは変えない
  def update_without_current_password(params, *options)
    if params[:password].blank? && params[:password_confirmation].blank?
      params.delete(:password)
      params.delete(:password_confirmation)
    end

    result = update(params, *options)
    clean_up_passwords
    result
  end
end
