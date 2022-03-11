class ReactionsController < ApplicationController
  def create
    reaction = Reaction.find_or_initialize_by(post_id: params[:post_id], user_id: current_user.id)
    reaction.update(
      post_id: params[:post_id],
      user_id: current_user.id
    )
  end
end
