class MatchingController < ApplicationController
  before_action :authenticate_user!

  def index
    like = Like.where.not(user_id: current_user.id)
  end
end
