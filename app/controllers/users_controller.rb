class UsersController < ApplicationController
  before_action :authenticate_user!

  def index
    @users = User.where.not(id: current_user.id)
  end

  def show
    # URLのuserを取得
    @user = User.find(params[:id])
    # URLのuserのポストを取得
    @posts = Post.where(user_id: @user.id)
  end
end
