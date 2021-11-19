const User = require("../../app/Models/User");
const Room = require("../../app/Models/Room");
const callSendAPI = require("../callApi");
const sendAudio = require("../sendAudio");
const SendMessageP1 = require("../../helper/SendMessageP1");
const SendMessageP2 = require("../../helper/SendMessageP2");
const sendVideo = require("../sendVideo");


const shareTiktok = async (sender_psid, url) => {
  let userConnect = await Room.findOne({
    $or: [{ p1: sender_psid }, { p2: sender_psid }],
  });
  if (userConnect.p2 == null) {
    let response = {
      text: "[BOT] Chưa tìm được bạn để ghép nên không thể thực hiện chức năng này. 💑",
    };
    await callSendAPI(sender_psid, response);
  } else if (userConnect.p1 == sender_psid) {
    await SendMessageP1(userConnect.p1, userConnect.p2);
    await sendVideo(userConnect.p2, url);
  } else {
    await SendMessageP2(userConnect.p1, userConnect.p2);
    await sendVideo(userConnect.p1, url);
  }
};

module.exports = shareTiktok;
