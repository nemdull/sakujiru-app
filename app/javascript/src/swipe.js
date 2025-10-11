const initSwipe = () => {
  const container = document.querySelector(".swipe--cards")
  if (!container) return

  console.debug("[swipe] initializer attached", container)

  const likeButton = document.getElementById("like")
  const dislikeButton = document.getElementById("dislike")
  if (!likeButton || !dislikeButton) return

  const handleReaction = (reaction) => {
    console.debug("[swipe] handleReaction called with:", reaction)
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

    console.debug("[swipe] sending reaction payload:", payload)

    fetch("/reactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-CSRF-Token": csrfToken || "",
      },
      credentials: "same-origin",
      body: payload,
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Failed to send reaction:", response.statusText)
        }
      })
      .catch((error) => console.error("Failed to send reaction:", error))
  }

  likeButton.addEventListener("click", (event) => {
    event.preventDefault()
    handleReaction("like")
  })

  dislikeButton.addEventListener("click", (event) => {
    event.preventDefault()
    handleReaction("dislike")
  })
}

document.addEventListener("turbo:load", initSwipe)
document.addEventListener("DOMContentLoaded", initSwipe)
