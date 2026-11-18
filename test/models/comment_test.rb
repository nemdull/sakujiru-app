require "test_helper"

class CommentTest < ActiveSupport::TestCase
  test "空のコメントと、長すぎるコメントは保存しない" do
    comment = Comment.new(post: posts(:aoi_logo), user: users(:ren))

    comment.comment = "  "
    assert_not comment.valid?

    comment.comment = "あ" * (Comment::MAX_LENGTH + 1)
    assert_not comment.valid?

    comment.comment = "あ" * Comment::MAX_LENGTH
    assert comment.valid?
  end

  test "書いた本人かどうかが分かる" do
    comment = comments(:ren_on_aoi_logo)

    assert comment.written_by?(users(:ren))
    assert_not comment.written_by?(users(:aoi))
    assert_not comment.written_by?(nil)
  end
end
