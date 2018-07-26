class CreatePurchases < ActiveRecord::Migration[5.1]
  def change
    create_table :purchases do |t|
      t.float :unit_price, null: false
      t.float :amount, null: false
      t.date :expiration_date
      t.timestamps
    end

    add_reference :purchases, :product, foreign_key: true
  end
end
