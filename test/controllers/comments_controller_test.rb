require "test_helper"

class CommentsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @post = posts(:aoi_logo)
  end

  test "コメントできる" do
    sign_in users(:mio)

    assert_difference -> { @post.comments.count }, 1 do
      post post_comments_path(@post), params: { comment: { comment: "配色が好きです" } }
    end

    assert_redirected_to post_path(@post)
    assert_equal users(:mio), @post.comments.order(:id).last.user
    assert_equal "コメントしました。", flash[:notice]
  end

  test "空のコメントは受け付けない" do
    sign_in users(:mio)

    assert_no_difference -> { Comment.count } do
      post post_comments_path(@post), params: { comment: { comment: "  " } }
    end

    assert_redirected_to post_path(@post)
    assert flash[:alert].present?
  end

  test "自分のコメントは消せる" do
    sign_in users(:ren)

    assert_difference -> { Comment.count }, -1 do
      delete post_comment_path(@post, comments(:ren_on_aoi_logo))
    end

    assert_redirected_to post_path(@post)
  end

  test "ほかの人のコメントは消せない" do
    sign_in users(:mio)

    assert_no_difference -> { Comment.count } do
      delete post_comment_path(@post, comments(:ren_on_aoi_logo))
    end

    assert_equal "自身のコメントのみ削除できます。", flash[:alert]
  end

  test "ログインしていないとコメントできない" do
    assert_no_difference -> { Comment.count } do
      post post_comments_path(@post), params: { comment: { comment: "こんにちは" } }
    end

    assert_redirected_to new_user_session_path
  end
end
