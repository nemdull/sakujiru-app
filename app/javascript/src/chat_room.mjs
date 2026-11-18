// チャットの画面で、その部屋だけを購読する。
// 画面に #chat-messages と #chat-room-message が無ければ、何もしない（＝ほかの画面では購読しない）。

export function connectChatRoom(consumer, root = document) {
  const list = root.getElementById("chat-messages")
  const input = root.getElementById("chat-room-message")
  if (!list || !input || !list.dataset.chatRoomId) return null

  const currentUserId = Number(list.dataset.currentUserId)

  const subscription = consumer.subscriptions.create(
    { channel: "ChatRoomChannel", chat_room_id: list.dataset.chatRoomId },
    {
      // つながっているあいだだけ data-chat-ready が付く（テストは、これを待ってから書き込む）
      connected() {
        list.dataset.chatReady = "true"
      },
      disconnected() {
        delete list.dataset.chatReady
      },
      // サーバーは「自分の発言」と「相手の発言」の両方の見た目を送ってくる。受け取った人に合うほうを足す
      received(data) {
        const html = Number(data.user_id) === currentUserId ? data.mine : data.theirs
        if (!html) return
        list.insertAdjacentHTML("beforeend", html)
        list.scrollTop = list.scrollHeight
      },
    }
  )

  const onKeydown = (event) => {
    if (event.key !== "Enter" || event.shiftKey) return
    // 日本語入力で変換を確定する Enter では、送らない
    if (event.isComposing || event.keyCode === 229) return

    event.preventDefault()
    const text = input.value.trim()
    if (!text) return

    // 回線が切れているときは送れない。そのときは、書いた文を消さずに残す
    if (subscription.perform("speak", { chat_message: text })) input.value = ""
  }
  input.addEventListener("keydown", onKeydown)

  return {
    disconnect() {
      input.removeEventListener("keydown", onKeydown)
      subscription.unsubscribe()
      delete list.dataset.chatReady
    },
  }
}
