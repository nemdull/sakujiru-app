import consumer from "./consumer"

const appChatRoom = consumer.subscriptions.create("ChatRoomChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
    return alert(data['chat_message']);
  },

  speak: function(chat_message) {
    return this.perform('speak', { chat_message: chat_message });
  }
});
if(/chat_rooms/.test(location.pathname)) {
  $(document).on("keydown", ".chat-room__message-form_textarea", function(e) {
    if (e.key === "Enter") {
      appChatRoom.speak(e.target.value);
      e.target.value = '';
      e.preventDefault();
    }
  })
}