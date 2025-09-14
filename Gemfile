source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.3.0'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 7.2.0'
# Use postgresql as the database for Active Record
# Database adapter (allow pg 1.x/2.x for Ruby 3.3 compatibility)
gem 'pg', '>= 1.4'
# Use Puma as the app server (Rails 7 compatible)
gem 'puma', '~> 6.4'
# Stylesheets are built via cssbundling (Dart Sass)
# JavaScript bundling for Rails 7 (use esbuild by default)
gem 'jsbundling-rails'
# Hotwire Turbo (Rails 7 default navigation)
gem 'turbo-rails'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.12'
# Asset Pipeline (Sprockets) for Rails 7
gem 'sprockets-rails'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Active Storage variant
# gem 'image_processing', '~> 1.2'

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.18.0', require: false

# devise
gem 'devise'

# carrierwave
gem 'carrierwave', '~> 2.0'

# mini_magick
gem "mini_magick"

# initial_avatar(initial_avatar)
gem 'initials'

# kaminari(pagenate)
gem "kaminari"

# ransack(search)
gem "ransack"

# payjp(payment)
gem "payjp"

# dotenv
gem 'dotenv-rails'

# fog-aws
gem "fog-aws"

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '~> 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  # rails-erd
  gem "rails-erd"
  # pry-rails
  gem 'pry-rails'
  #capistrano
  gem "capistrano", "~> 3.10", require: false
  gem "capistrano-rails", "~> 1.6", require: false
  gem 'capistrano-rbenv', '~> 2.2'
  gem 'capistrano-rbenv-vars', '~> 0.1'
  gem 'capistrano3-puma'
end

group :test do
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '>= 2.15'
  gem 'selenium-webdriver'
  # Easy installation and use of web drivers to run system tests with browsers
  gem 'webdrivers'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

gem "nio4r", "~> 2.7"

# CSS bundling (Tailwind or PostCSS). We'll wire this after install.
gem 'cssbundling-rails'
