class MatchingController < ApplicationController
  before_action :authenticate_user!

  def index
    # 自分が「いいね」した投稿
    @posts = Post.liked_by(current_user)
                 .includes(:arts, :user)
                 .newest_first
                 .page(params[:page])
                 .per(9)
  end
end
