FROM ruby:2.7.5

# --- APT 周り ---
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=DontWarn
ENV DEBCONF_NOWARNINGS=yes
RUN apt-get update -qq && apt-get install -y \
  build-essential libpq-dev git \
  nodejs curl apt-transport-https gnupg \
  libffi-dev \              
  && rm -rf /var/lib/apt/lists/*

# --- Yarn 公式 ---
RUN curl -fsSL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor -o /usr/share/keyrings/yarn.gpg \
  && echo "deb [signed-by=/usr/share/keyrings/yarn.gpg] https://dl.yarnpkg.com/debian stable main" \
  > /etc/apt/sources.list.d/yarn.list \
  && apt-get update -qq && apt-get install -y yarn \
  && rm -rf /var/lib/apt/lists/*

# --- RubyGems / Bundler を lockfile に合わせて更新 ---
ENV RUBYGEMS_VERSION=3.4.22 \
  BUNDLER_VERSION=2.2.33
RUN gem update --system ${RUBYGEMS_VERSION} \
  && gem install bundler:${BUNDLER_VERSION}

# ← これを追加（musl の prebuilt を拾わずにビルドさせる）
ENV BUNDLE_FORCE_RUBY_PLATFORM=1

WORKDIR /sakujiru
COPY Gemfile Gemfile.lock ./

# bundlerのバージョン固定で
RUN bundle _${BUNDLER_VERSION}_ install

COPY . /sakujiru

RUN yarn install --check-files

# 開発ならスキップ可。本番でやる場合は RAILS_ENV=production を付ける
RUN bundle exec rails webpacker:compile

COPY entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["/usr/bin/entrypoint.sh"]
EXPOSE 3000
CMD ["rails", "server", "-b", "0.0.0.0"]
