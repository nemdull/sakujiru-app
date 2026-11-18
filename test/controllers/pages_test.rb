require "test_helper"

# 細かい動きは持たない画面が、エラーにならずに表示できることを確かめる
class PagesTest < ActionDispatch::IntegrationTest
  test "トップはログインなしで見られる" do
    get root_path

    assert_response :success
  end

  test "ログインと新規登録の画面が出る" do
    [new_user_session_path, new_user_registration_path].each do |path|
      get path

      assert_response :success, "#{path} が表示できない"
    end
  end

  test "ユーザーの一覧に、自分以外が出る" do
    sign_in users(:aoi)

    get users_path

    assert_response :success
    assert_includes response.body, users(:ren).name
  end

  test "ユーザーの詳細に、その人の投稿が出る" do
    sign_in users(:aoi)

    get user_path(users(:ren))

    assert_response :success
    assert_includes response.body, posts(:ren_poster).art_text
  end

  test "マッチングには「いいね」した投稿が出る" do
    sign_in users(:ren)

    get matching_index_path

    assert_response :success
    assert_includes response.body, posts(:aoi_logo).art_text
    assert_not_includes response.body, posts(:ren_poster).art_text
  end

  test "プロフィールの編集画面が出る" do
    sign_in users(:aoi)

    get edit_user_registration_path

    assert_response :success
  end

  test "カードを登録していなければ、登録の画面へ送る" do
    sign_in users(:aoi)

    get new_card_path
    assert_response :success

    get card_path(1)
    assert_redirected_to new_card_path
  end
end
