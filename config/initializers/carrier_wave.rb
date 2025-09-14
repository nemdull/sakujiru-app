if Rails.env.production?
  # Prefer environment variables on hosted platforms (e.g. Render),
  # fallback to Rails credentials for self-managed deployments.
  access_key = ENV["AWS_ACCESS_KEY_ID"] || Rails.application.credentials.dig(:aws, :access_key_id)
  secret_key = ENV["AWS_SECRET_ACCESS_KEY"] || Rails.application.credentials.dig(:aws, :secret_access_key)
  region     = ENV["AWS_REGION"] || "ap-northeast-1"
  bucket     = ENV["AWS_S3_BUCKET"] || "sakujiru"

  if access_key.present? && secret_key.present?
    CarrierWave.configure do |config|
      config.fog_credentials = {
        provider: "AWS",
        aws_access_key_id: access_key,
        aws_secret_access_key: secret_key,
        region: region
      }
      config.fog_directory = bucket
    end
  else
    # Avoid CarrierWave's Fog eager loading when credentials are missing.
    if defined?(CarrierWave::Storage::Fog)
      CarrierWave::Storage::Fog.singleton_class.class_eval do
        def eager_load; end
      end
    end
    Rails.logger.warn("[CarrierWave] AWS credentials not set. Using local file storage in production.")
  end
end
