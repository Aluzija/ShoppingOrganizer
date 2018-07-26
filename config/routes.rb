Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'dashboards#show'
  resources :products, except: :destroy
  resources :purchases, except: :destroy
end
