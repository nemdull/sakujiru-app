module ApplicationHelper
  def user_avatar(name, **options)
    Initials.svg(name, size: 40)
  end
end
