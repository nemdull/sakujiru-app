FROM ruby:2.7.5

ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=DontWarn
ENV DEBCONF_NOWARNINGS=yes

# 必要パッケージ
RUN apt-get update -qq && apt-get install -y \
  build-essential libpq-dev git libffi-dev \
  nodejs curl apt-transport-https gnupg \
  && rm -rf /var/lib/apt/lists/*

# Yarn
RUN curl -fsSL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor -o /usr/share/keyrings/yarn.gpg \
 && echo "deb [signed-by=/usr/share/keyrings/yarn.gpg] https://dl.yarnpkg.com/debian stable main" \
    > /etc/apt/sources.list.d/yarn.list \
 && apt-get update -qq && apt-get install -y yarn \
 && rm -rf /var/lib/apt/lists/*

# RubyGems / Bundler を lockfile に合わせる
ENV RUBYGEMS_VERSION=3.4.22 \
    BUNDLER_VERSION=2.2.33 \
    BUNDLE_FORCE_RUBY_PLATFORM=1
RUN gem update --system ${RUBYGEMS_VERSION} \
 && gem install bundler:${BUNDLER_VERSION}

WORKDIR /sakujiru
COPY Gemfile Gemfile.lock ./

RUN bundle lock --add-platform aarch64-linux || true \
 && bundle lock --add-platform ruby || true

# ★ここがポイント：Linuxプラットフォームを lock に追加してから install
RUN bundle lock --add-platform aarch64-linux --add-platform ruby \
 && bundle _${BUNDLER_VERSION}_ install --jobs 1

COPY . /sakujiru

RUN yarn install --check-files

# （開発ならスキップ可。必要なら） 
# RUN bundle exec rails webpacker:compile

COPY entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["/usr/bin/entrypoint.sh"]
EXPOSE 3000
CMD ["rails", "server", "-b", "0.0.0.0"]
