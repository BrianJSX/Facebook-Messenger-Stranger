// const callSendAPI = require("./callApi");
const textChat = require("./chat/textChat");

// Handles message_text events
async function handleMessage(sender_psid, received_message) {
  switch (received_message.text) {
    case "end":
      textChat.handleEndAction(sender_psid, received_message);
      break;
    default:
      textChat.handleUser(sender_psid, received_message);
      break;
  }
}

module.exports = handleMessage;
