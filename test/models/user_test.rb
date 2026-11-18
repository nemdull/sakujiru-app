require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "名前の無い利用者は保存しない" do
    user = User.new(email: "new@example.com", password: "password123", name: "")

    assert_not user.valid?
  end

  test "「いいね」は 1 つの投稿に 1 つだけ付く" do
    user = users(:mio)

    assert_difference -> { Reaction.count }, 1 do
      user.like(posts(:aoi_logo))
      user.like(posts(:aoi_logo))
    end
  end

  test "「いいね」を外せる。付いていなくてもエラーにしない" do
    assert_difference -> { Reaction.count }, -1 do
      users(:ren).unlike(posts(:aoi_logo))
    end
    assert_no_difference -> { Reaction.count } do
      users(:ren).unlike(posts(:aoi_logo))
    end
  end

  test "同じ「いいね」は検証でもはじく" do
    duplicate = Reaction.new(user: users(:ren), post: posts(:aoi_logo))

    assert_not duplicate.valid?
  end

  test "パスワードの欄が空なら、パスワードを変えずにプロフィールを更新する" do
    user = users(:aoi)

    assert user.update_without_current_password({ name: "あおい（改）", password: "", password_confirmation: "" })
    assert_equal "あおい（改）", user.reload.name
    assert user.valid_password?("password123")
  end
end
