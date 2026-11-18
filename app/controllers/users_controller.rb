class UsersController < ApplicationController
  before_action :authenticate_user!

  def index
    @users = User.where.not(id: current_user.id).order(:id)
  end

  def show
    @user = User.find(params[:id])
    @posts = @user.posts.includes(:arts, :user).newest_first
  end
end
