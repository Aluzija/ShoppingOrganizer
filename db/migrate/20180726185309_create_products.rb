class CreateProducts < ActiveRecord::Migration[5.1]
  def change
    create_table :products do |t|
      t.string :name, null: false
      t.string :category, null: false
      t.string :barcode
      t.integer :avg_price
      t.integer :unit, null: false
      t.timestamps
    end
  end
end