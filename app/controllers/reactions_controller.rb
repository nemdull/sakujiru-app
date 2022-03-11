class ReactionsController < ApplicationController
  def create
    like = Like.find_or_initialize_by(post_id: params[:post_id], user_id: current_user.id)
    like.update(
      post_id: params[:post_id],
      user_id: current_user.id
    )
  end
end
