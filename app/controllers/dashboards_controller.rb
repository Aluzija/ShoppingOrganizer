class DashboardsController < ApplicationController
  def show
    @products = Product.all
    respond_to do |format|
        format.html { render :show }
        format.json { render json: @products.as_json(:only => [:id, :name, :barcode]) }
    end
  end
end
