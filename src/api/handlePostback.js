const Room = require("../api/chat/pair");
const callSendAPI = require("./callApi");
const callSendImgAPI = require("./callSendImgAPI");
const textChat = require("./chat/textChat");
const requestApiGet = require("./requestApi");

// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
  try {
    let payload = received_postback.payload;
    if (payload === "male") {
      Room.handleRoom(sender_psid, payload);
    } else if (payload === "female") {
      Room.handleRoom(sender_psid, payload);
    } else if (payload === "lgbt") {
      Room.handleRoom(sender_psid, payload);
    } else if (payload === "start") {
      await textChat.handleUser(sender_psid, payload);
    } else if (payload === "end") {
      await textChat.handleEndAction(sender_psid, payload);
    } else if (payload === "uid") {
      let response = {
        text: `[BOT] UID 👒 của bạn là:  ${sender_psid} 👑`,
      };
      await callSendAPI(sender_psid, response);
    } else if (payload === "dog") { 
      let data = await requestApiGet("https://dog.ceo/api/breeds/image/random");
      await callSendImgAPI(sender_psid, String(data.message));
    } else if (payload === "cat") { 
      let data = await requestApiGet("https://api.thecatapi.com/v1/images/search");
      await callSendImgAPI(sender_psid, String(data[0].url));
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = handlePostback;
