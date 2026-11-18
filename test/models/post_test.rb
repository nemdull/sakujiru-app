require "test_helper"

class PostTest < ActiveSupport::TestCase
  test "スワイプの束に、自分の投稿は入らない" do
    deck = Post.swipe_deck_for(users(:aoi))

    assert_includes deck, posts(:ren_poster)
    assert_not_includes deck, posts(:aoi_logo)
  end

  test "スワイプの束は、候補が多くても決めた枚数まで" do
    5.times { |i| users(:ren).posts.create!(art_text: "作品 #{i}") }

    deck = Post.swipe_deck_for(users(:aoi), size: 3)

    assert_equal 3, deck.to_a.size
    assert deck.none? { |post| post.owned_by?(users(:aoi)) }
  end

  test "「いいね」した投稿だけを取り出せる" do
    assert_equal [posts(:aoi_logo)], Post.liked_by(users(:ren)).to_a
    assert_empty Post.liked_by(users(:mio))
  end

  test "投稿を消すと、作品・コメント・「いいね」も消える" do
    assert_difference -> { Art.count } => -1, -> { Comment.count } => -1, -> { Reaction.count } => -1 do
      posts(:aoi_logo).destroy
    end
  end

  test "説明文が長すぎる投稿は保存しない" do
    post = users(:aoi).posts.build(art_text: "あ" * (Post::MAX_TEXT_LENGTH + 1))

    assert_not post.valid?
  end
end
