const Room = require("../api/chat/pair");

// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
  let payload = received_postback.payload;

  if (payload === "male") {
    Room.handleRoom(sender_psid);
  } else if (payload === "female") {
    Room.handleRoom(sender_psid);
  } else if (payload === "lgbt") {
    Room.handleRoom(sender_psid);
  } else if (payload === "uid") {
    let response = `UID của bạn là ${sender_psid} 👑`
    await callSendAPI(sender_psid, response);
  }
}

module.exports = handlePostback;
