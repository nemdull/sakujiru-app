Rails.application.routes.draw do
  devise_for :users,
    controllers: { registrations:"registrations"}
  
  root "top#index"

  resources :users, only:[:show]
end
