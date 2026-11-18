class CommentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_post

  def create
    comment = @post.comments.build(comment_params.merge(user: current_user))
    if comment.save
      redirect_to post_path(@post), notice: "コメントしました。"
    else
      redirect_to post_path(@post), alert: "コメントできませんでした。1〜#{Comment::MAX_LENGTH} 文字で入力してください。"
    end
  end

  def destroy
    comment = @post.comments.find(params[:id])
    if comment.written_by?(current_user)
      comment.destroy
      redirect_to post_path(@post), notice: "コメントを削除しました。"
    else
      redirect_to post_path(@post), alert: "自身のコメントのみ削除できます。"
    end
  end

  private

  def set_post
    @post = Post.find(params[:post_id])
  end

  def comment_params
    params.require(:comment).permit(:comment)
  end
end
