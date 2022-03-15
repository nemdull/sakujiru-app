class MatchingController < ApplicationController
  before_action :authenticate_user!
  before_action :set_current_user

  def index
    # 自分がいいねした投稿のidを抜く
    reaction_post_ids = Reaction.where(user_id: current_user.id).pluck(:post_id)
    # 投稿のうちいいねしたものを抜く
    @posts = Post.where(id: reaction_post_ids)
  end
end
