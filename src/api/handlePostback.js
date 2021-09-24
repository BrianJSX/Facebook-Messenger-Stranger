const Room = require("../api/chat/pair");
const callSendAPI = require("./callApi");
const handleImage = require("./chat/handleImage");
const textChat = require("./chat/textChat");
const requestApiGet = require("./requestApi");
const { handleEndAction } = require("./chat/handleEndAction");
const Nhaccuatui = require("nhaccuatui-api");
const sendAudio = require("./sendAudio");
const { getMusic, replyMusic } = require("./musicPlayer");

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
      await handleEndAction(sender_psid, payload);
    } else if (payload === "uid") {
      let response = {
        text: `[BOT] UID 👒 của bạn là:  ${sender_psid} 👑`,
      };
      await callSendAPI(sender_psid, response);
    } else if (payload === "dog") {
      let data = await requestApiGet("https://dog.ceo/api/breeds/image/random");
      await handleImage(sender_psid, String(data.message));
    } else if (payload === "cat") {
      let data = await requestApiGet(
        "https://api.thecatapi.com/v1/images/search"
      );
      await handleImage(sender_psid, String(data[0].url));
    } else if (payload == "covid") {
      let response = {
        text: `[BOT COVID] 📍 Vui lòng nhập "kcovid" + tên "TP hoặc Tỉnh" để xem thống kê số ca tại khu vực. ♻️ `,
      };
      let response1 = {
        text: `[BOT COVID] 📍 Ví dụ: kcovid Bình Dương. `,
      };
      await callSendAPI(sender_psid, response1);
      await callSendAPI(sender_psid, response);
    } else if (payload.includes("keymusic")) {
      const key = payload.slice(9);
      let data = await Nhaccuatui.getSong(String(key));
      const streamUrl = data.song.streamUrls;

      if(streamUrl.length > 0) { 
        const urlMp3 = data.song.streamUrls[0].streamUrl;
        await sendAudio(sender_psid, urlMp3);
      } else { 
        let response = {
          text: `[BOT Music] 📍 Bài hát không có audio. Vui lòng chọn bài khác. `,
        };
        await callSendAPI(sender_psid, response);
      }
    } else if (payload == "music") {
      await replyMusic(sender_psid);
      await getMusic(sender_psid, received_postback);
    }
  } catch (error) {
    console.log(error);
    let message = {
      text: `[BOT Lỗi] Lỗi Hệ Thống Vui Lòng Thử lại.`
    }
    await callSendAPI(sender_psid, message)
  }
}

module.exports = handlePostback;
