# 「いいね」と、チャットルームへの参加は、同じ組み合わせが 2 行あってはいけない。
# これまではモデルの検証だけで防いでいたので、同時に 2 回押されると 2 行できる余地があった。
# データベース側でも 1 行に決める。
class AddUniqueIndexesToReactionsAndChatRoomUsers < ActiveRecord::Migration[7.2]
  def up
    # すでに重複している行があると索引を作れないので、古いほう（id の小さいほう）を残して消す
    execute <<~SQL.squish
      DELETE FROM reactions a
      USING reactions b
      WHERE a.id > b.id AND a.user_id = b.user_id AND a.post_id = b.post_id
    SQL
    execute <<~SQL.squish
      DELETE FROM chat_room_users a
      USING chat_room_users b
      WHERE a.id > b.id AND a.chat_room_id = b.chat_room_id AND a.user_id = b.user_id
    SQL

    add_index :reactions, [:user_id, :post_id], unique: true
    add_index :chat_room_users, [:chat_room_id, :user_id], unique: true
  end

  def down
    remove_index :chat_room_users, column: [:chat_room_id, :user_id]
    remove_index :reactions, column: [:user_id, :post_id]
  end
end
