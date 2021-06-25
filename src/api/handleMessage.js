const callSendAPI = require("./callApi");

// Handles message_text events
async function handleMessage(sender_psid, received_message) {
  switch (received_message.text) {
    case "end":
      let response;
      response = {
        text: "kết thúc cuộc trò chuyện",
      };
      //send message
      await callSendAPI(sender_psid, response);
      break;
    default:
      console.log("messenger default");
      break;
  }
}

module.exports = handleMessage;
