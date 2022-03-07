class CreateArts < ActiveRecord::Migration[6.0]
  def change
    create_table :arts do |t|

      t.string :image, null: false
      t.references :post, foreign_key: true, null: false

      t.timestamps
    end
  end
end
