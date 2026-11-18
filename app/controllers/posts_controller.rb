class PostsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_q, only: [:index, :search]
  before_action :set_post, only: [:show, :edit, :update, :destroy]
  before_action :authorize_owner!, only: [:edit, :update, :destroy]

  def new
    @post = Post.new
    @post.arts.build
  end

  def create
    @post = current_user.posts.build(post_params)
    if @post.arts.present? && @post.save
      flash[:notice] = "作品を投稿しました。"
      redirect_to posts_path
    else
      flash.now[:alert] = "投稿に失敗しました。入力内容をご確認ください。"
      @post.arts.build if @post.arts.blank?
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  # 書き直せるのは紹介文だけ。画像は変えない
  def update
    if @post.update(post_update_params)
      redirect_to post_path(@post), notice: "作品の紹介を更新しました。"
    else
      flash.now[:alert] = "更新できませんでした。入力内容をご確認ください。"
      render :edit, status: :unprocessable_entity
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
    @posts = Post.includes(:arts, :user).newest_first.page(params[:page]).per(9)
  end

  def swipe
    @posts = Post.swipe_deck_for(current_user)
  end

  def search
    @results = @q.result.includes(:arts, :user).page(params[:page]).per(9)
  end

  private

  def post_params
    params.require(:post).permit(:art_text, arts_attributes: [:image])
  end

  def post_update_params
    params.require(:post).permit(:art_text)
  end

  def set_q
    @q = Post.ransack(params[:q])
  end

  def set_post
    @post = Post.includes(:arts, :user).find(params[:id])
  end

  def authorize_owner!
    return if @post.owned_by?(current_user)

    verb = action_name == "destroy" ? "削除" : "編集"
    redirect_to posts_path, alert: "自身の投稿のみ#{verb}できます。"
  end
end
