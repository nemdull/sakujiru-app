import assert from "node:assert/strict"
import { test } from "node:test"

import { connectChatRoom } from "../../app/javascript/src/chat_room.mjs"

// ブラウザーの代わりになる、最小限の作り物
function fakeElement(dataset = {}) {
  const listeners = {}
  return {
    dataset,
    value: "",
    html: "",
    scrollTop: 0,
    scrollHeight: 120,
    insertAdjacentHTML(_position, html) {
      this.html += html
    },
    addEventListener(type, handler) {
      listeners[type] = handler
    },
    removeEventListener(type, handler) {
      if (listeners[type] === handler) delete listeners[type]
    },
    fire(type, event) {
      listeners[type]?.(event)
    },
    listening(type) {
      return type in listeners
    },
  }
}

function fakeRoot(elements) {
  return { getElementById: (id) => elements[id] ?? null }
}

function fakeConsumer() {
  const consumer = {
    created: [],
    performed: [],
    unsubscribed: 0,
    online: true,
    subscriptions: {
      create(params, handlers) {
        consumer.created.push(params)
        consumer.handlers = handlers
        return {
          // 本物と同じく、送れたら true、回線が切れていたら false を返す
          perform(action, data) {
            if (!consumer.online) return false
            consumer.performed.push([action, data])
            return true
          },
          unsubscribe: () => (consumer.unsubscribed += 1),
        }
      },
    },
  }
  return consumer
}

function keydown(overrides = {}) {
  const event = {
    key: "Enter",
    shiftKey: false,
    isComposing: false,
    keyCode: 13,
    prevented: false,
    preventDefault() {
      this.prevented = true
    },
    ...overrides,
  }
  return event
}

function chatScreen() {
  const list = fakeElement({ chatRoomId: "7", currentUserId: "1" })
  const input = fakeElement()
  const consumer = fakeConsumer()
  const room = connectChatRoom(consumer, fakeRoot({ "chat-messages": list, "chat-room-message": input }))
  return { list, input, consumer, room }
}

test("チャットの画面でなければ、購読しない", () => {
  const consumer = fakeConsumer()

  assert.equal(connectChatRoom(consumer, fakeRoot({})), null)
  // 投稿の詳細など、入力欄の無い画面
  assert.equal(connectChatRoom(consumer, fakeRoot({ "chat-messages": fakeElement() })), null)
  assert.deepEqual(consumer.created, [])
})

test("開いている部屋の番号を付けて購読する", () => {
  const { consumer } = chatScreen()

  assert.deepEqual(consumer.created, [{ channel: "ChatRoomChannel", chat_room_id: "7" }])
})

test("Enter で送り、入力欄を空にする", () => {
  const { input, consumer } = chatScreen()
  input.value = "  こんにちは  "
  const event = keydown()

  input.fire("keydown", event)

  assert.deepEqual(consumer.performed, [["speak", { chat_message: "こんにちは" }]])
  assert.equal(input.value, "")
  assert.equal(event.prevented, true)
})

test("回線が切れているときは、書いた文を消さない", () => {
  const { input, consumer } = chatScreen()
  consumer.online = false
  input.value = "あとで送りたい文"

  input.fire("keydown", keydown())

  assert.deepEqual(consumer.performed, [])
  assert.equal(input.value, "あとで送りたい文")
})

test("つながっているあいだだけ、準備できた印が付く", () => {
  const { list, consumer } = chatScreen()
  assert.equal(list.dataset.chatReady, undefined)

  consumer.handlers.connected()
  assert.equal(list.dataset.chatReady, "true")

  consumer.handlers.disconnected()
  assert.equal(list.dataset.chatReady, undefined)
})

test("日本語入力の変換を確定する Enter では送らない", () => {
  const { input, consumer } = chatScreen()
  input.value = "こんにちは"

  input.fire("keydown", keydown({ isComposing: true }))
  input.fire("keydown", keydown({ keyCode: 229 }))

  assert.deepEqual(consumer.performed, [])
  assert.equal(input.value, "こんにちは")
})

test("Shift + Enter と、空の入力では送らない", () => {
  const { input, consumer } = chatScreen()

  input.value = "1 行目"
  const shiftEnter = keydown({ shiftKey: true })
  input.fire("keydown", shiftEnter)
  assert.equal(shiftEnter.prevented, false, "改行はそのまま入る")

  input.value = "   "
  input.fire("keydown", keydown())

  assert.deepEqual(consumer.performed, [])
})

test("自分の発言と相手の発言で、足す見た目を変える", () => {
  const { list, consumer } = chatScreen()

  consumer.handlers.received({ user_id: 1, mine: "<p>自分</p>", theirs: "<p>相手から見た自分</p>" })
  consumer.handlers.received({ user_id: 2, mine: "<p>相手から見た相手</p>", theirs: "<p>相手</p>" })

  assert.equal(list.html, "<p>自分</p><p>相手</p>")
  assert.equal(list.scrollTop, list.scrollHeight, "いちばん下まで送る")
})

test("画面を離れるときは、購読をやめて、キー入力も聞かない", () => {
  const { list, input, consumer, room } = chatScreen()
  consumer.handlers.connected()

  room.disconnect()

  assert.equal(consumer.unsubscribed, 1)
  assert.equal(input.listening("keydown"), false)
  assert.equal(list.dataset.chatReady, undefined, "つながっている印も外す")
})
