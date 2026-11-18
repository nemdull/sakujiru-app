ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'

# テストでは画像の加工（ImageMagick）をしない。アップロードしたファイルは tmp の下に置く
CarrierWave.configure do |config|
  config.enable_processing = false
  config.root = Rails.root.join("tmp", "test_uploads")
end

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors)

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all
end

class ActionDispatch::IntegrationTest
  # sign_in users(:aoi) でログインした状態にできる
  include Devise::Test::IntegrationHelpers
end
