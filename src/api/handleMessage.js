const textChat = require("./chat/textChat");
const { handleEndAction } = require("./chat/handleEndAction");
const menuPresident = require("./menuPresident");
const callSendAPI = require("./callApi");
const requestApi = require("./requestApi");
const dotenv = require("dotenv");
// Handles message_text events
async function handleMessage(sender_psid, received_message) {
  switch (received_message.text) {
    case "End":
    case "end":
      await handleEndAction(sender_psid, received_message);
      break;
    case "menu president":
      let response = {
        text: "[BOT UPDATE] Cập nhật Menu cố định thành công.",
      };
      await menuPresident.handleMenuPre();
      await callSendAPI(sender_psid, response);
      break;
    default:
      await textChat.handleUser(sender_psid, received_message);
      break;
  }
}

module.exports = handleMessage;
