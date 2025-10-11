const initSwipe = () => {
  const path = window.location.pathname
  if (!path.startsWith("/swipe")) return

  const likeButton = document.getElementById("like")
  const dislikeButton = document.getElementById("dislike")
  if (!likeButton || !dislikeButton) return

  const handleReaction = (reaction) => {
    const cards = document.querySelectorAll(".swipe--card:not(.removed)")
    if (!cards.length) return

    const card = cards[0]
    const postId = card.id
    const moveOutWidth = document.body.clientWidth * 1.5

    sendReaction(postId, reaction)

    card.classList.add("removed")
    card.style.transform =
      reaction === "like"
        ? `translate(${moveOutWidth}px, -120px) rotate(-24deg)`
        : `translate(-${moveOutWidth}px, -120px) rotate(24deg)`
  }

  const sendReaction = (postId, reaction) => {
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content")

    const payload = new URLSearchParams({
      post_id: postId,
      reaction: reaction,
    }).toString()

    fetch("/reactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-CSRF-Token": csrfToken || "",
      },
      credentials: "same-origin",
      body: payload,
    }).catch((error) => console.error("Failed to send reaction:", error))
  }

  likeButton.addEventListener("click", () => handleReaction("like"))
  dislikeButton.addEventListener("click", () => handleReaction("dislike"))
}

document.addEventListener("turbo:load", initSwipe)
document.addEventListener("DOMContentLoaded", initSwipe)
