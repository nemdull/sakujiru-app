Rails.application.routes.draw do
  devise_for :users,
    controllers: { registrations:"registrations"}

  root "top#index"

  resources :posts, only: %i(new create index show destroy) do
    resources :arts, only: %i(create)
  end

  resources :users, only:[:show,:index]
  get "/swipe", to: "posts#swipe"
end
