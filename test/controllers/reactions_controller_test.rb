require "test_helper"

class ReactionsControllerTest < ActionDispatch::IntegrationTest
  test "「いいね」は何度送っても 1 つ" do
    sign_in users(:mio)

    assert_difference -> { Reaction.count }, 1 do
      2.times { post reactions_path, params: { post_id: posts(:aoi_logo).id, reaction: "like" } }
    end

    assert_response :ok
  end

  test "dislike で「いいね」を外す" do
    sign_in users(:ren)

    assert_difference -> { Reaction.count }, -1 do
      post reactions_path, params: { post_id: posts(:aoi_logo).id, reaction: "dislike" }
    end

    assert_response :ok
  end

  test "無い投稿には 404 を返す" do
    sign_in users(:mio)

    assert_no_difference -> { Reaction.count } do
      post reactions_path, params: { post_id: 0, reaction: "like" }
    end

    assert_response :not_found
  end

  test "ログインしていないと付けられない" do
    assert_no_difference -> { Reaction.count } do
      post reactions_path, params: { post_id: posts(:aoi_logo).id, reaction: "like" }
    end

    assert_redirected_to new_user_session_path
  end
end
