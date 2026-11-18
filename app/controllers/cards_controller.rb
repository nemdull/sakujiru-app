class CardsController < ApplicationController
  before_action :authenticate_user!

  # PAY.JP との通信に失敗したら、エラー画面にせず、登録画面へ戻して知らせる
  rescue_from Payjp::PayjpError, with: :payjp_failed

  def new
    redirect_to action: :show if current_user.card.present?
  end

  def pay
    if current_user.card.present?
      redirect_to action: :show
      return
    end

    if params["payjp_token"].blank?
      redirect_to action: :new
      return
    end

    customer = Payjp::Customer.create(
      description: "登録テスト",
      email: current_user.email,
      card: params["payjp_token"],
      metadata: { user_id: current_user.id }
    )
    card = current_user.build_card(customer_id: customer.id, card_id: customer.default_card)

    if card.save
      redirect_to action: :show
    else
      redirect_to({ action: :new }, alert: "カードを登録できませんでした。")
    end
  end

  def show
    card = current_user.card
    if card.blank?
      redirect_to action: :new
      return
    end

    customer = Payjp::Customer.retrieve(card.customer_id)
    @default_card_information = customer.cards.retrieve(card.card_id)
  end

  def delete
    card = current_user.card
    if card.present?
      Payjp::Customer.retrieve(card.customer_id).delete
      card.destroy
    end
    redirect_to action: :new
  end

  private

  def payjp_failed(error)
    logger.error("[PAY.JP] #{error.class}: #{error.message}")
    redirect_to({ action: :new }, alert: "カード会社との通信に失敗しました。時間をおいて、もう一度お試しください。")
  end
end
