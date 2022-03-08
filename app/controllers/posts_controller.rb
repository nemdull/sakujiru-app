class PostsController < ApplicationController
  before_action :authenticate_user!
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

  private
    def post_params
      params.require(:post).permit(:art_text, arts_attributes: [:image]).merge(user_id: current_user.id)
    end
end

