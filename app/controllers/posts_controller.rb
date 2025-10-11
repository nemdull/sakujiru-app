class PostsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_current_user
  before_action :set_q, only: [:index, :search]
  before_action :set_post, only: [:show, :destroy]
  before_action :authorize_owner!, only: [:destroy]

  def new
    @post = Post.new
    @post.arts.build
  end

  def create
    @post = Post.new(post_params)
    if @post.arts.present? && @post.save
      flash[:notice] = "作品を投稿しました。"
      redirect_to posts_path
    else
      flash.now[:alert] = "投稿に失敗しました。入力内容をご確認ください。"
      @post.arts.build if @post.arts.blank?
      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    @post.destroy
    flash[:notice] = "投稿が削除されました。"
    redirect_to posts_path
  end

  def show
    @comments = @post.comments.includes(:user).order(created_at: :asc)
    @comment = @post.comments.build
  end

  def index
    @posts = Post.page(params[:page]).per(9).includes(:arts, :user).order('created_at DESC')
  end

  def swipe
    @posts = Post.where.not(user_id: current_user.id)
    @user = User.find(current_user.id)
  end

  def search
    @results = @q.result.includes(:arts, :user).page(params[:page]).per(9)
  end

  private
    def post_params
      params.require(:post).permit(:art_text, arts_attributes: [:image]).merge(user_id: current_user.id)
    end

    def set_q
      @q = Post.ransack(params[:q])
    end

    def set_post
      @post = Post.includes(:arts, :user).find(params[:id])
    end

    def authorize_owner!
      return if @post.user == current_user

      redirect_to posts_path, alert: "自身の投稿のみ削除できます。"
    end
end
