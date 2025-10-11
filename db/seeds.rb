require "fileutils"

puts "🌱 Seeding database..."

avatar_dir     = Rails.root.join("asset", "img", "avater")
typography_dir = Rails.root.join("asset", "img", "typography")

avatar_images = Dir.glob(avatar_dir.join("**", "*")).select { |path| File.file?(path) }
typography_images = Dir.glob(typography_dir.join("**", "*")).select { |path| File.file?(path) }

if avatar_images.empty? || typography_images.empty?
  raise "Seed images not found. Ensure avatar images exist under #{avatar_dir} and typography images exist under #{typography_dir}."
end

def attach_upload(record, attribute, path)
  File.open(path, "rb") do |file|
    record.public_send("#{attribute}=", file)
  end
end

def random_sentence
  samples = [
    "線の流れと余白の美しさを大切にしています。",
    "ポスターやパッケージ向けの文字デザインを得意としています。",
    "幾何学的な骨格に柔らかさを加えた作風です。",
    "日本語と英語を組み合わせたタイポグラフィ作品を制作しています。",
    "物語や世界観を文字で表現することをテーマにしています。"
  ]
  samples.sample
end

ActiveRecord::Base.transaction do
  puts "🧹 Cleaning existing data..."
  [Reaction, Comment, Art, Post, ChatMessage, ChatRoomUser, ChatRoom, Card, User].each(&:delete_all)
  FileUtils.rm_rf(Rails.root.join("public", "uploads"))

  puts "👤 Creating users..."
  users_data = [
    { name: "エマ", email: "emma@example.com", intro: "音楽と猫と美味しいものが好きな作字クリエイター。" },
    { name: "オリビア", email: "olivia@example.com", intro: "柔らかい手書き風のフォントを研究しています。" },
    { name: "アキラ", email: "akira@example.com", intro: "SF 的な世界観を文字で表現することがテーマです。" },
    { name: "ミナト", email: "minato@example.com", intro: "広告・ポスターを中心に文字のデザインをしています。" },
    { name: "ソラ", email: "sora@example.com", intro: "グラフィックデザインとタイポグラフィを組み合わせた作品制作。" },
    { name: "リコ", email: "riko@example.com", intro: "余白と線のリズムにこだわった作品を作っています。" }
  ]

  users = users_data.map.with_index(1) do |attrs, idx|
    user = User.new(
      name: attrs[:name],
      email: attrs[:email],
      self_introduction: attrs[:intro],
      password: "password",
      password_confirmation: "password"
    )
    attach_upload(user, :profile_image, avatar_images.sample)
    user.save!
    puts "  ▸ #{idx}. #{user.name}"
    user
  end

  puts "🖋 Creating posts and artworks..."
  art_text_samples = [
    "夜空をテーマにしたタイトルロゴ。曲線と直線を組み合わせて、星のきらめきを表現しています。",
    "クラフトビールのラベル用に制作したロゴタイプ。柔らかい曲線と太めの線で親しみやすさを演出。",
    "ゲーム UI 向けに制作した未来的なフォント。シャープなエッジと蛍光色のアクセントが特徴です。",
    "和紙と墨をモチーフにしたロゴ。筆致をデジタルで再構築し、力強さと繊細さを併せ持たせました。",
    "子ども向けイベントのタイトル文字。カラフルな幾何学模様で楽しさを表現しています。",
    "旅雑誌の表紙用にデザインした文字。風景写真と馴染むよう、柔らかい陰影を加えました。"
  ]

  posts = []
  users.each do |user|
    rand(2..4).times do
      post = user.posts.create!(art_text: art_text_samples.sample)
      art = post.arts.build
      attach_upload(art, :image, typography_images.sample)
      art.save!
      posts << post
    end
  end
  puts "  ▸ Created #{posts.size} posts."

  puts "💬 Creating comments..."
  comment_samples = [
    "素敵な表現ですね！筆のあとがとても印象的です。",
    "この作品の色合いがとても好みです。印刷物でも映えそう！",
    "エッジの効いたラインがかっこいいです。制作の裏話が聞きたいです。",
    "柔らかい雰囲気がとても優しくて好きです。",
    "コンセプトが分かりやすくて惹かれました。"
  ]
  posts.each do |post|
    commenters = users.reject { |u| u == post.user }.sample(rand(1..3))
    commenters.each do |commenter|
      Comment.create!(
        user: commenter,
        post: post,
        comment: comment_samples.sample
      )
    end
  end

  puts "❤️ Creating reactions..."
  posts.each do |post|
    users.reject { |u| u == post.user }.sample(rand(2..users.size)).each do |liker|
      Reaction.find_or_create_by!(user: liker, post: post)
    end
  end

  users.each do |user|
    other_posts = posts.reject { |post| post.user == user }
    other_posts.sample([3, other_posts.size].min).each do |post|
      Reaction.find_or_create_by!(user: user, post: post)
    end
  end

  puts "💬 Creating chat rooms..."
  chat_pairs = users.combination(2).to_a.sample([3, users.combination(2).count].min)
  chat_pairs.each do |user_a, user_b|
    room = ChatRoom.create!
    ChatRoomUser.create!(chat_room: room, user: user_a)
    ChatRoomUser.create!(chat_room: room, user: user_b)
    ChatMessage.create!(chat_room: room, user: user_a, content: "こんにちは、#{user_b.name}さん。作品を拝見しました！")
    ChatMessage.create!(chat_room: room, user: user_b, content: "ありがとうございます！ぜひお話ししましょう。")
  end

  puts "✨ Seeding completed."
end
