class ReactionsController < ApplicationController
  before_action :authenticate_user!

  # スワイプ画面から呼ばれる。reaction=dislike なら「いいね」を外し、それ以外は付ける
  def create
    post = Post.find(params[:post_id])

    if params[:reaction] == "dislike"
      current_user.unlike(post)
    else
      current_user.like(post)
    end

    head :ok
  end
end
