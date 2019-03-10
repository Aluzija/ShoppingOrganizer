class Product < ApplicationRecord
    has_many :purchases

    enum unit: [:szt, :kg] # {"szt"=>0, "kg"=>1}
end
