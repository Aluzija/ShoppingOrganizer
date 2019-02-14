module ProductsHelper

    # zwraca średnią cenę produktu w formacie 'cena zł/jednostka', np. 15zł/szt, 10zł/kg
    # lub jeśli produkt nie ma przypisanej średniej ceny zwraca &mdash
    def self.avg_price_with_unit(product)
        product.avg_price ? (product.avg_price.to_s + ' zł/' + product.unit) : '—'
    end

    def self.barcode(product)
        product.barcode ? product.barcode : '—'
    end
end
