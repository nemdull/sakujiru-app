class MatchingController < ApplicationController
  before_action :authenticate_user!

  def index
    reaction_post_ids = Reaction.where(user_id: current_user.id).pluck(:post_id)
    @posts = Post.where(id: reaction_post_ids)
  end
end
