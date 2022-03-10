class ReactionsController < ApplicationController
  before_action :authenticate_user!

  def create
    @post = Post.find(params[:post_id])
    if @post.user_id != current_user.id
      @reaction = Reaction.create(user_id: current_user.id, post_id: @post.id)
    end
  end

  def destroy
    @post = Post.find(params[:post_id])
    @reaction = Reaction.find_by(user_id: current_user.id, post_id: @post.id)
    @reaction.destroy
  end
end
