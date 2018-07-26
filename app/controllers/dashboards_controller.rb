class DashboardsController < ApplicationController
  def show
    @purchase = Purchase.new
  end

  private

  def purchase_params
    params.require(:purchase).permit(:unit_price, :amount, :expiration_date, :product_id,
    product_attributes: [:id, :barcode, :name, :unit, :category])
  end
end
