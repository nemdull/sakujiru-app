class CardsController < ApplicationController


  require 'payjp'

  def new
    card = Card.where(user_id: current_user.id)
  end

  def show
  end
end
