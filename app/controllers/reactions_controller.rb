class ReactionsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_current_user

  def create
    reaction = Reaction.find_by(post_id: params[:post_id], user_id: current_user.id)

    case params[:reaction]
    when "dislike"
      reaction&.destroy
    else
      Reaction.find_or_create_by!(post_id: params[:post_id], user_id: current_user.id)
    end

    head :ok
  end
end
