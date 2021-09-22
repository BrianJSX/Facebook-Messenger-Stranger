const textChat = require("./chat/textChat");
const { handleEndAction } = require("./chat/handleEndAction");
const { handleMusic } = require("./musicPlayer");
// Handles message_text events
async function handleMessage(sender_psid, received_message) {
  switch (received_message.text) {
    // case "music":
    //   await handleMusic(sender_psid, received_message);
    //   break;
    case "End":
    case "end":
      await handleEndAction(sender_psid, received_message);
      break;
    default:
      await textChat.handleUser(sender_psid, received_message);
      break;
  }
}

module.exports = handleMessage;
