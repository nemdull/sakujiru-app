class PostsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_current_user

  def new
    @post = Post.new
    @post.arts.build
  end

  def create
    @post = Post.new(post_params)
    if @post.arts.present?
      @post.save
      redirect_to root_path
      flash[:notice] = "投稿が保存されました"
    else
      redirect_to root_path
      flash[:alert] = "投稿に失敗しました"
    end
  end

  def destroy
    @post = Post.find_by(id: params[:id])
    if @post.user == current_user
      flash[:notice] = "投稿が削除されました" if @post.destroy
    else
      flash[:alert] = "投稿の削除に失敗しました"
    end
    redirect_to root_path
  end

  def show
    @post = Post.find_by(id: params[:id])
    @comments = @post.comments
    @comment = @post.comments.build
  end

  def index
    @posts = Post.page(params[:page]).per(9).includes(:arts, :user).order('created_at DESC')
  end

  def swipe
    @posts = Post.where.not(user_id: current_user.id)
    @user = User.find(current_user.id)
  end


  private
    def post_params
      params.require(:post).permit(:art_text, arts_attributes: [:image]).merge(user_id: current_user.id)
    end
end

