require "test_helper"

class ApplicationCable::ConnectionTest < ActionCable::Connection::TestCase
  FakeWarden = Struct.new(:user)

  test "ログインしている利用者として接続する" do
    connect env: { "warden" => FakeWarden.new(users(:aoi)) }

    assert_equal users(:aoi), connection.current_user
  end

  test "ログインしていなければ接続を断る" do
    assert_reject_connection { connect env: { "warden" => FakeWarden.new(nil) } }
  end
end
