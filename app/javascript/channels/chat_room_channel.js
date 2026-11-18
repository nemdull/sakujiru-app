import consumer from "./consumer"
import { connectChatRoom } from "../src/chat_room.mjs"

// チャットの画面を開いているあいだだけ、その部屋を購読する。
// Turbo で画面が切り替わるたびに、前の購読をやめてから、今の画面で入り直す。
let current = null

const disconnect = () => {
  current?.disconnect()
  current = null
}

document.addEventListener("turbo:load", () => {
  disconnect()
  current = connectChatRoom(consumer)
})
document.addEventListener("turbo:before-cache", disconnect)
