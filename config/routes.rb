Rails.application.routes.draw do
  devise_for :users,
    controllers: { registrations:"registrations",sessions: :sessions }

  root "top#index"

  resources :posts, only: %i(new create index show destroy) do
    resources :arts, only: %i(create)
    resources :comments, only: %i(create destroy)
  end

  resources :users, only:[:show,:index]
  resources :reactions, only: [:create]
  resources :matching, only: [:index]

  resources :chat_rooms, only: [:create, :show]

  get "/swipe", to: "posts#swipe"
end
