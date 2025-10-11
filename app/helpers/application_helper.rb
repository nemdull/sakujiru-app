module ApplicationHelper
  def user_avatar(name, size: 40)
    Initials.svg(name, size: size).html_safe
  end
end
