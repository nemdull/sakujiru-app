require "test_helper"

class PostsControllerTest < ActionDispatch::IntegrationTest
  test "ログインしていないと見られない" do
    get posts_path

    assert_redirected_to new_user_session_path
  end

  test "一覧・詳細・投稿フォーム・検索・スワイプが表示できる" do
    sign_in users(:aoi)

    [posts_path, post_path(posts(:ren_poster)), new_post_path, search_posts_path, swipe_path].each do |path|
      get path

      assert_response :success, "#{path} が表示できない"
    end
  end

  test "詳細には、説明文とコメントが出る" do
    sign_in users(:aoi)

    get post_path(posts(:aoi_logo))

    assert_includes response.body, posts(:aoi_logo).art_text
    assert_includes response.body, comments(:ren_on_aoi_logo).comment
  end

  test "画像つきで投稿できる" do
    sign_in users(:aoi)

    assert_difference -> { users(:aoi).posts.count } => 1, -> { Art.count } => 1 do
      post posts_path, params: {
        post: {
          art_text: "新しい作字です",
          arts_attributes: { "0" => { image: fixture_file_upload("sample.png", "image/png") } }
        }
      }
    end

    assert_redirected_to posts_path
  end

  test "画像が無い投稿は受け付けない" do
    sign_in users(:aoi)

    assert_no_difference -> { Post.count } do
      post posts_path, params: { post: { art_text: "画像を付け忘れた" } }
    end

    assert_response :unprocessable_entity
  end

  test "ほかの人の名前では投稿できない" do
    sign_in users(:aoi)

    post posts_path, params: {
      post: {
        user_id: users(:ren).id,
        art_text: "なりすまし",
        arts_attributes: { "0" => { image: fixture_file_upload("sample.png", "image/png") } }
      }
    }

    assert_equal users(:aoi), Post.order(:id).last.user
  end

  test "自分の投稿は消せる" do
    sign_in users(:aoi)

    assert_difference -> { Post.count }, -1 do
      delete post_path(posts(:aoi_logo))
    end

    assert_redirected_to posts_path
  end

  test "ほかの人の投稿は消せない" do
    sign_in users(:aoi)

    assert_no_difference -> { Post.count } do
      delete post_path(posts(:ren_poster))
    end

    assert_redirected_to posts_path
    assert_equal "自身の投稿のみ削除できます。", flash[:alert]
  end
end
